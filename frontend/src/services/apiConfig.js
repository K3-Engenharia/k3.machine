// src/services/apiConfig.js
const API_URL = process.env.REACT_APP_API_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'https://k3-machine-backend.onrender.com');
console.log('API_URL configurada:', API_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('REACT_APP_API_URL env var:', process.env.REACT_APP_API_URL);
export default API_URL;