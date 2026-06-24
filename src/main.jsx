import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Global fetch interceptor to append JWT authorization header and trigger global updates
const originalFetch = window.fetch;
window.fetch = async function (url, options = {}) {
  const urlStr = url.toString();
  if (urlStr.startsWith('/api') || urlStr.startsWith('api') || urlStr.includes('/api/')) {
    const token = sessionStorage.getItem('uct_token');
    if (token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      };
    }
  }
  const response = await originalFetch(url, options);
  
  // Detect successful write requests
  const method = options.method ? options.method.toUpperCase() : 'GET';
  if (['POST', 'PUT', 'DELETE'].includes(method) && response.ok) {
    // Notify all components in the current tab
    window.dispatchEvent(new Event('uct_data_update'));
    // Notify all other tabs via localStorage
    localStorage.setItem('uct_data_update_trigger', Date.now().toString());
  }

  return response;
};

// Cross-tab synchronization via storage events
window.addEventListener('storage', (e) => {
  if (e.key === 'uct_data_update_trigger') {
    window.dispatchEvent(new Event('uct_data_update'));
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
