import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode>
    <div className="bg-orb bg-orb-1"></div>
    <div className="bg-orb bg-orb-2"></div>
    <div className="bg-orb bg-orb-3"></div>
    <div className="main-content-wrapper">
      <App />
    </div>
  </React.StrictMode>);
