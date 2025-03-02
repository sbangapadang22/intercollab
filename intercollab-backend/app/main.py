# intercollab-backend/app/main.py
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import base64
import io
import os
from app.utils.utils import get_text_prediction

app = FastAPI()

# Add CORS middleware to allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/process-image")
async def process_image(image_data: str = Form(...)):
    try:
        # Remove header from base64 string if present
        if "base64," in image_data:
            image_data = image_data.split("base64,")[1]
        
        # Decode base64 to bytes
        image_bytes = base64.b64decode(image_data)
        
        # Process the image using the utility function
        recognized_text = get_text_prediction(image_bytes)
        
        return {"status": "success", "text": recognized_text}
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Error processing image: {str(e)}")
        print(f"Error details: {error_details}")
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": str(e), "details": error_details}
        )

@app.get("/api/debug/model-path")
async def debug_model_path():
    model_path = os.environ.get("PGNET_MODEL_PATH", "app/utils/pgnet.onnx")
    exists = os.path.exists(model_path)
    file_size = os.path.getsize(model_path) if exists else None
    return {
        "model_path": model_path,
        "exists": exists,
        "file_size_bytes": file_size,
        "cwd": os.getcwd()
    }

# Add to intercollab-backend/app/main.py
from pydantic import BaseModel
from googletrans import Translator

# Create a model for translation requests
class TranslationRequest(BaseModel):
    text: str
    target_language: str

@app.post("/api/translate")
async def translate_text(request: TranslationRequest):
    try:
        translator = Translator()
        # Use googletrans to translate the text
        result = translator.translate(
            request.text, 
            dest=request.target_language
        )
        return {"translated_text": result.text}
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Error translating text: {str(e)}")
        print(f"Error details: {error_details}")
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": str(e), "details": error_details}
        )