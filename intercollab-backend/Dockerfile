# Use an official Python image
FROM python:3.10

# Set the working directory inside the container
WORKDIR /app

# Install dependencies for OpenCV
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0

# Install PaddleOCR dependencies
RUN apt-get install -y \
    wget \
    libsm6 \
    libxext6 \
    libxrender-dev

# Copy only requirements.txt first
COPY requirements.txt ./

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Install PaddleOCR
RUN pip install paddlepaddle paddleocr

# Copy the entire project
COPY . .

# Expose the application port
EXPOSE 8000

# Run the backend server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]