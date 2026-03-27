import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

export const predictImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${API_BASE_URL}/predict`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`Server error: ${error.response.status} - ${error.response.data?.detail || 'Unknown error'}`);
    } else if (error.request) {
      throw new Error('No response from server. Please ensure the backend is running at http://127.0.0.1:8000');
    } else {
      throw new Error(`Request error: ${error.message}`);
    }
  }
};
