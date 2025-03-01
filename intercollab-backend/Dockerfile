# Use an official Python image
FROM python:3.10

# Set the working directory inside the container
WORKDIR /app

# Copy only requirements.txt first
COPY requirements.txt ./

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project
COPY . .

# Expose the application port
EXPOSE 8000

# Run the backend server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
