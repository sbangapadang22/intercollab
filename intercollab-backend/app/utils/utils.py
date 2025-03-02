from app.utils.inference_pgnet import PGNetPredictor
import tempfile
import os

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
        _, recognized_texts = predictor()
        
        # Join the recognized texts into a single string
        recognized_text = " ".join(recognized_texts) if recognized_texts else "No text detected"
        return recognized_text
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)