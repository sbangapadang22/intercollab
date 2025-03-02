from app.utils.inference_pgnet import PGNetPredictor
import tempfile
import os
import base64
import cv2
import numpy as np
from io import BytesIO
from app.utils.inference_pgnet import PGNetPredictor

def get_annotated_image(image_bytes, text_boxes, recognized_texts):
    """
    Create an annotated image with bounding boxes and text recognition results
    
    Args:
        image_bytes (bytes): The original image bytes
        text_boxes (np.ndarray): Bounding boxes of detected text
        recognized_texts (list): List of recognized text strings
    
    Returns:
        str: Base64 encoded image with annotations
    """
    # Convert image bytes to numpy array for OpenCV
    nparr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Get image dimensions
    height, width, _ = image.shape
    
    # Draw bounding boxes and text (similar to PGNetPredictor.draw)
    for box, text_str in zip(text_boxes, recognized_texts):
        box = box.astype(np.int32).reshape((-1, 1, 2))
        cv2.polylines(image, [box], True, color=(255, 255, 0), thickness=2)
        
        # Write text near the box
        cv2.putText(
            image,
            text_str,
            org=(int(box[0, 0, 0]), int(box[0, 0, 1])),
            fontFace=cv2.FONT_HERSHEY_COMPLEX,
            fontScale=0.7 / 400 * width / 2,
            color=(0, 0, 0),
            thickness=int(1 / 1000 * width),
        )
    
    # Encode the image to base64 for sending to frontend
    _, buffer = cv2.imencode('.jpg', image)
    jpg_as_text = base64.b64encode(buffer).decode('utf-8')
    
    return f"data:image/jpeg;base64,{jpg_as_text}"

def get_text_prediction(image_bytes):
    # Save the image bytes to a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
        temp_file.write(image_bytes)
        temp_file_path = temp_file.name

    try:
        # Get model path from environment or use a default
        model_path = os.environ.get("PGNET_MODEL_PATH", "app/utils/pgnet.onnx")
        
        # Check if model exists
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at {model_path}")
        
        # Initialize the PGNetPredictor with the temporary image file and model path
        predictor = PGNetPredictor(
            img_path=temp_file_path,
            cpu=True,
            model_path=model_path
        )
        
        # Run the prediction
        dt_boxes, recognized_texts = predictor()
        
        # Create annotated image
        annotated_image = get_annotated_image(image_bytes, dt_boxes, recognized_texts)
        
        # Join the recognized texts into a single string
        recognized_text = " ".join(recognized_texts) if recognized_texts else "No text detected"
        return recognized_text, annotated_image
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

