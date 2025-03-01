from fastapi import FastAPI
from app.routes import handwriting, translation, health

app = FastAPI(title="InterCollab API", version="0.1.0")

# Register routers
app.include_router(handwriting.router, prefix="/api")
app.include_router(translation.router, prefix="/api")
app.include_router(health.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Backend is running"}
