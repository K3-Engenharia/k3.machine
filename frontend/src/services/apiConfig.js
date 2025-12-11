// src/services/apiConfig.js
const API_URL = process.env.REACT_APP_API_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'https://k3-machine-backend.onrender.com');
export default API_URL;