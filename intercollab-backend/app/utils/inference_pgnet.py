# Github: kuroko1t
import argparse
import os

import cv2
import numpy as np
import onnxruntime
from paddleocr.ppocr.data.imaug.operators import (
    E2EResizeForTest,
    KeepKeys,
    NormalizeImage,
    ToCHWImage
)
from paddleocr.ppocr.postprocess.pg_postprocess import PGPostProcess

from app.utils.pgnet.chr_dct import chr_dct_list


class PGNetPredictor:
    """
    This class encapsulates the entire process of loading an ONNX model for PGNet,
    preprocessing input images, performing inference, and postprocessing the results
    to obtain bounding boxes and text strings.
    """

    def __init__(self, img_path, cpu):
        """
        Constructor for the PGNetPredictor class.
        
        Args:
            img_path (str): Path to the input image.
            cpu (bool): Whether to run inference on CPU. If False, GPU (CUDA) is used.
        """
        self.img_path = img_path
        # We need a dictionary file (ic15_dict.txt) that maps indices to characters.
        self.dict_path = "ic15_dict.txt"
        
        # If the dictionary file doesn't exist, create it using chr_dct_list (from pgnet.chr_dct).
        if not os.path.exists(self.dict_path):
            with open(self.dict_path, "w") as f:
                f.writelines(chr_dct_list)
        
        # Set the ONNXRuntime providers based on whether we want to use CPU or GPU.
        if not cpu:
            providers = ["CUDAExecutionProvider"]
        else:
            providers = ["CPUExecutionProvider"]
        
        # Create an ONNXRuntime session with the specified providers (CPU or GPU).
        self.sess = onnxruntime.InferenceSession(args.model_path, providers=providers)

    def preprocess(self, img_path):
        """
        Preprocess the input image before feeding it into the ONNX model.
        
        1. Read the image using OpenCV.
        2. Apply transforms (resize, normalize, transpose).
        3. Return the processed image and shape information.
        
        Args:
            img_path (str): Path to the image that needs to be preprocessed.
        
        Returns:
            (tuple): A tuple of (image, shape_list), where `image` is the processed
                     image tensor, and `shape_list` is shape information needed
                     for postprocessing.
        """
        # Read the image from disk.
        img = cv2.imread(img_path)
        # Keep a copy of the original image for later use (e.g., drawing).
        self.ori_im = img.copy()
        
        # Prepare a dictionary to feed into the transform pipeline.
        data = {"image": img}
        
        # Define transformations from PaddleOCR:
        # - E2EResizeForTest: Resize the image for test (max_side_len=768 here).
        # - NormalizeImage: Normalize by dividing by 255 and using the given mean/std.
        # - ToCHWImage: Transpose image to [C, H, W].
        # - KeepKeys: Keep only "image" and "shape" keys in the data dictionary.
        transforms = [
            E2EResizeForTest(max_side_len=768, valid_set="totaltext"),
            NormalizeImage(
                scale=1.0 / 255.0,
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225],
                order="hwc",
            ),
            ToCHWImage(),
            KeepKeys(keep_keys=["image", "shape"]),
        ]
        
        # Apply each transform in sequence.
        for transform in transforms:
            data = transform(data)
        
        # After KeepKeys, 'data' becomes (img, shape_list).
        img, shape_list = data
        
        # Expand dims to make batch size = 1 for ONNX model (i.e., [1, C, H, W]).
        img = np.expand_dims(img, axis=0)
        # Similarly, expand dims for shape_list.
        shape_list = np.expand_dims(shape_list, axis=0)
        
        return img, shape_list

    def predict(self, img):
        """
        Perform inference on the preprocessed image.
        
        Args:
            img (numpy.ndarray): The preprocessed image tensor with shape [1, C, H, W].
        
        Returns:
            dict: A dictionary with the model’s output tensors:
                  {
                      "f_border": <border output>,
                      "f_char": <character output>,
                      "f_direction": <direction output>,
                      "f_score": <score output>
                  }
        """
        # Prepare the input dictionary, matching the input name required by the model.
        ort_inputs = {self.sess.get_inputs()[0].name: img}
        
        # Run the ONNX model with all outputs (None).
        outputs = self.sess.run(None, ort_inputs)
        
        # Organize the outputs into a dictionary.
        preds = {}
        preds["f_border"] = outputs[0]
        preds["f_char"] = outputs[1]
        preds["f_direction"] = outputs[2]
        preds["f_score"] = outputs[3]
        
        return preds

    def filter_tag_det_res_only_clip(self, dt_boxes, image_shape):
        """
        Clip the detected bounding boxes so they lie within the image boundaries.
        
        Args:
            dt_boxes (np.ndarray): Detected bounding boxes.
            image_shape (tuple): Shape of the original image (height, width, ...).
        
        Returns:
            np.ndarray: Clipped bounding boxes.
        """
        img_height, img_width = image_shape[0:2]
        dt_boxes_new = []
        
        # Go through each box and clip points that fall outside the image boundary.
        for box in dt_boxes:
            box = self.clip_det_res(box, img_height, img_width)
            dt_boxes_new.append(box)
        
        dt_boxes = np.array(dt_boxes_new)
        return dt_boxes

    def clip_det_res(self, points, img_height, img_width):
        """
        Clip the coordinates of a single box to ensure they are within the image.
        
        Args:
            points (np.ndarray): Coordinates of the box’s corners.
            img_height (int): Height of the image.
            img_width (int): Width of the image.
        
        Returns:
            np.ndarray: The clipped corner coordinates.
        """
        for pno in range(points.shape[0]):
            # Ensure x-coordinate is in [0, img_width-1]
            points[pno, 0] = int(min(max(points[pno, 0], 0), img_width - 1))
            # Ensure y-coordinate is in [0, img_height-1]
            points[pno, 1] = int(min(max(points[pno, 1], 0), img_height - 1))
        return points

    def postprocess(self, preds, shape_list):
        """
        Postprocess the model outputs to obtain bounding boxes and recognized text.
        
        1. Use PGPostProcess to decode predictions into bounding boxes and strings.
        2. Clip bounding boxes to ensure they lie within image boundaries.
        
        Args:
            preds (dict): The dictionary of outputs from `predict()`.
            shape_list (numpy.ndarray): Shape information from preprocess.
        
        Returns:
            (tuple): (dt_boxes, strs) where dt_boxes are the bounding boxes, and
                     strs are the recognized texts.
        """
        # PGPostProcess decodes the model outputs into polygon coordinates and text strings.
        pgpostprocess = PGPostProcess(
            character_dict_path=self.dict_path,
            valid_set="totaltext",
            score_thresh=0.5,
            mode="fast",
        )
        
        # Get the postprocessing result, which contains "points" and "texts".
        post_result = pgpostprocess(preds, shape_list)
        points, strs = post_result["points"], post_result["texts"]
        
        # Clip the bounding boxes to ensure they are within the image boundaries.
        dt_boxes = self.filter_tag_det_res_only_clip(points, self.ori_im.shape)
        
        return dt_boxes, strs

    def __call__(self):
        """
        Make the class callable. Executes the entire pipeline:
        1. Preprocess the image.
        2. Run the model inference.
        3. Postprocess the outputs.
        
        Returns:
            (tuple): (dt_boxes, strs), the bounding boxes and recognized text.
        """
        # Preprocess
        img, shape_list = self.preprocess(self.img_path)
        # Model prediction
        preds = self.predict(img)
        # Postprocess and return bounding boxes + texts
        dt_boxes, strs = self.postprocess(preds, shape_list)
        return dt_boxes, strs

    def draw(self, dt_boxes, strs, img_path):
        """
        Draw bounding boxes and recognized text onto the image, then save it.
        
        Args:
            dt_boxes (np.ndarray): Bounding boxes of detected text.
            strs (list): Recognized text strings corresponding to each box.
            img_path (str): Path to the original image (for saving the result).
        
        Returns:
            np.ndarray: The annotated image.
        """
        # Read the original image for drawing.
        src_im = cv2.imread(img_path)
        width, height, _ = src_im.shape
        
        # Draw each bounding box and place the recognized text.
        for box, text_str in zip(dt_boxes, strs):
            box = box.astype(np.int32).reshape((-1, 1, 2))
            cv2.polylines(src_im, [box], True, color=(255, 255, 0), thickness=2)
            
            # Write text near the first corner of the box.
            cv2.putText(
                src_im,
                text_str,
                org=(int(box[0, 0, 0]), int(box[0, 0, 1])),
                fontFace=cv2.FONT_HERSHEY_COMPLEX,
                fontScale=0.7 / 500 * width / 2,
                color=(0, 255, 0),
                thickness=int(1 / 1000 * width),
            )
        
        # Build an output image filename, e.g. "imageName_pgnet.jpg"
        img_out_name = os.path.basename(img_path).split(".")[0]
        img_out_name = f"{img_out_name}_pgnet.jpg"
        
        # Save the annotated image
        cv2.imwrite(img_out_name, src_im)
        return src_im


if __name__ == "__main__":
    # Command-line argument parsing
    parser = argparse.ArgumentParser(description="PGPNET inference")
    parser.add_argument("model_path", type=str, help="onnxmodel path")
    parser.add_argument("img_path", type=str, help="image path")
    parser.add_argument(
        "--cpu", action="store_true", help="cpu inference, default device is gpu"
    )
    
    # Parse the input arguments
    args = parser.parse_args()
    
    # Initialize the predictor with the given arguments
    pgnetpredictor = PGNetPredictor(args.img_path, args.cpu)
    
    # Run the end-to-end detection and recognition
    dt_boxes, strs = pgnetpredictor()
    print(f"Predict string: {strs}")
    
    # Draw and save the results on the image
    pgnetpredictor.draw(dt_boxes, strs, args.img_path)
