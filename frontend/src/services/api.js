import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minute timeout for large files
});

export const getApiInfo = async () => {
  try {
    const response = await apiClient.get('/info');
    return response.data;
  } catch (error) {
    console.error('Error fetching API info:', error);
    throw new Error('Failed to fetch API information');
  }
};

export const getHealthStatus = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    return { status: 'offline', error: error.message };
  }
};

export const predictImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await apiClient.post('/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload progress: ${percentCompleted}%`);
        }
      },
    });

    if (response.data.error) {
      throw new Error(response.data.error);
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (status === 400) {
        throw new Error(
          data?.detail || 'Invalid file format or size. Supported: TIFF, PNG, JPG (max 50MB)'
        );
      } else if (status === 413) {
        throw new Error('File is too large. Maximum size: 50 MB');
      } else if (status === 500) {
        throw new Error(
          data?.detail || 'Server error during processing. Check if all models are loaded.'
        );
      } else {
        throw new Error(`Server error: ${status} - ${data?.detail || 'Unknown error'}`);
      }
    } else if (error.request) {
      throw new Error(
        'No response from server. Ensure the backend is running at http://127.0.0.1:8000'
      );
    } else {
      throw new Error(`Request error: ${error.message}`);
    }
  }
};

export const getStats = async () => {
  try {
    const response = await apiClient.get('/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    return null;
  }
};