import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import API_URL from './services/apiConfig';

// Keep-alive global que roda sem precisar estar autenticado
const startGlobalKeepAlive = () => {
  setInterval(async () => {
    try {
      await fetch(`${API_URL}/api/health`, { method: 'GET' });
      console.log('Keep-alive: Backend ping realizado');
    } catch (err) {
      console.log('Keep-alive: Backend ainda dormindo ou indisponível');
    }
  }, 4 * 60 * 1000); // A cada 4 minutos
};

startGlobalKeepAlive();

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
