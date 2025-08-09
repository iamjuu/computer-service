import axios from 'axios';

// Create axios instance for localhost server
const apiInstance = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});





export default apiInstance;