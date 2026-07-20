import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import axios from 'axios';

// Configure Axios base URL for Netlify to Render deployment compatibility
axios.defaults.baseURL = (import.meta as any).env.VITE_API_BASE_URL || "";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
