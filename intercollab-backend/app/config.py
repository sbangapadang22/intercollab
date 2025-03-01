import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from a .env file

class Config:
    APP_NAME = "InterCollab Backend"
    VERSION = "0.1.0"
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"
    TRANSLATION_API_KEY = os.getenv("TRANSLATION_API_KEY", "your-api-key")
    HANDWRITING_MODEL_PATH = os.getenv("HANDWRITING_MODEL_PATH", "models/handwriting_model.pt")

config = Config()
