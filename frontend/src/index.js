import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Import Mantine CSS styles untuk v5
// import 'react-datepicker/dist/react-datepicker.css'; // Untuk datepicker

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);