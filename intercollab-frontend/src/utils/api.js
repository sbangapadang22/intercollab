// intercollab-frontend/src/utils/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const processImage = async (imageData) => {
  try {
    const formData = new FormData();
    
    // Ensure imageData is sent exactly as received from the canvas
    // The backend will handle extracting the base64 content
    formData.append('image_data', imageData);
    
    console.log('Sending image data to backend...');
    
    const response = await axios.post(`${API_URL}/api/process-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error processing image:', error);
    if (error.response && error.response.data) {
      console.error('Error details:', error.response.data);
    }
    throw error;
  }
};