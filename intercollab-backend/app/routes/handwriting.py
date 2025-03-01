from fastapi import APIRouter, UploadFile, File
from app.services.handwriting import recognize_handwriting

router = APIRouter()

@router.post("/handwriting/recognize")
async def handwriting_recognition(file: UploadFile = File(...)):
    """
    Upload an image file and get recognized text.
    """
    text = recognize_handwriting(await file.read())
    return {"recognized_text": text}
