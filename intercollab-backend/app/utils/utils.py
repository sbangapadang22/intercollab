from app.utils.inference_pgnet import PGNetPredictor
import tempfile
import os

def get_text_prediction(image_bytes):
    # Save the image bytes to a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
        temp_file.write(image_bytes)
        temp_file_path = temp_file.name

    try:
        # Initialize the PGNetPredictor with the temporary image file
        predictor = PGNetPredictor(temp_file_path, cpu=True)
        # Run the prediction
        _, recognized_texts = predictor()
        # Join the recognized texts into a single string
        recognized_text = " ".join(recognized_texts)
    finally:
        # Clean up the temporary file
        os.remove(temp_file_path)

    return recognized_text