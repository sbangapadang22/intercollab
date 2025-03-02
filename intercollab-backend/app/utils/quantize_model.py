# intercollab-backend/app/utils/quantize_model.py
import os
import numpy as np
import cv2
import tempfile
from quark.onnx.quantization.config import Config, get_default_config
from quark.onnx import ModelQuantizer
from onnxruntime.quantization import CalibrationDataReader


class PGNetCalibrationDataReader(CalibrationDataReader):
    """Custom calibration data reader for PGNet model."""
    def __init__(self, sample_images_dir, batch_size=1):
        """Initialize with directory containing sample images for calibration."""
        super().__init__()
        self.image_dir = sample_images_dir
        self.batch_size = batch_size
        self.image_list = [os.path.join(sample_images_dir, f) for f in os.listdir(sample_images_dir) 
                          if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        self.current_index = 0
        
    def get_next(self):
        """Get the next batch of images for calibration."""
        if self.current_index >= len(self.image_list):
            return None
            
        batch_images = []
        for _ in range(self.batch_size):
            if self.current_index >= len(self.image_list):
                break
                
            # Process single image similar to PGNetPredictor's preprocess method
            img_path = self.image_list[self.current_index]
            img = cv2.imread(img_path)
            
            # Basic preprocessing (resize to fixed size)
            img = cv2.resize(img, (768, 768))
            img = img.astype(np.float32) / 255.0
            
            # Normalize (ensure all arrays are float32)
            mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
            std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
            img = (img - mean) / std
            
            # Convert to NCHW format
            img = np.transpose(img, (2, 0, 1))
            
            # Add batch dimension and ensure float32
            img = np.expand_dims(img, axis=0).astype(np.float32)
            batch_images.append(img)
            self.current_index += 1
            
        if not batch_images:
            return None
            
        # If only one image, return it directly
        if len(batch_images) == 1:
            return {"x": batch_images[0]}
            
        # Otherwise, concatenate the batch and ensure float32
        batched_input = np.concatenate(batch_images, axis=0).astype(np.float32)
        return {"x": batched_input}


def quantize_pgnet_model(input_model_path=None, output_model_path=None, calibration_data_dir=None):
    """
    Quantize PGNet ONNX model.
    
    Args:
        input_model_path (str): Path to the original pgnet.onnx model.
        output_model_path (str): Path where the quantized model will be saved.
        calibration_data_dir (str): Directory containing images for calibration.
        
    Returns:
        str: Path to the quantized model.
    """
    # Get the directory of the current script for absolute path resolution
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Use default paths if not provided, with proper absolute path resolution
    if input_model_path is None:
        input_model_path = os.path.join(current_dir, "pgnet.onnx")
    
    if output_model_path is None:
        # Save in the same directory as input
        output_model_path = os.path.join(current_dir, "pgnet2.onnx")
    
    # Print debug information
    print(f"Current directory: {current_dir}")
    print(f"Input model path: {input_model_path}")
    print(f"Output model path: {output_model_path}")
    print(f"Model exists: {os.path.exists(input_model_path)}")
    
    if not os.path.exists(input_model_path):
        raise FileNotFoundError(f"Model file not found at {input_model_path}")
    
    # Use a temp directory with sample images if no calibration data provided
    temp_dir = None
    if calibration_data_dir is None:
        # Create temp directory for calibration images
        temp_dir = tempfile.TemporaryDirectory()
        calibration_data_dir = temp_dir.name
        
        # Create at least one sample image for calibration
        # This is a dummy image, in a real scenario you should use real training data
        sample_img = np.zeros((768, 768, 3), dtype=np.uint8)
        cv2.imwrite(os.path.join(calibration_data_dir, "sample.jpg"), sample_img)
    
    try:
        # Create calibration data reader
        dr = PGNetCalibrationDataReader(calibration_data_dir)
        
        # Get quantization configuration
        quant_config = get_default_config("XINT8")
        config = Config(global_quant_config=quant_config)
        print(f"The configuration for quantization is {config}")
        
        # Create an ONNX quantizer
        quantizer = ModelQuantizer(config)
        
        # Quantize the ONNX model
        quantizer.quantize_model(input_model_path, output_model_path, dr)
        
        print(f'Calibrated and quantized model saved at: {output_model_path}')
        return output_model_path
    
    finally:
        # Clean up temporary directory if we created one
        if temp_dir:
            temp_dir.close()


if __name__ == "__main__":
    # Example usage:
    quantize_pgnet_model()