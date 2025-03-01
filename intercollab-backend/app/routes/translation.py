from fastapi import APIRouter
from app.services.translation import translate_text

router = APIRouter()

@router.post("/translation")
async def translate(text: str, target_language: str):
    """
    Translate input text into the target language.
    """
    translated_text = translate_text(text, target_language)
    return {"translated_text": translated_text}
