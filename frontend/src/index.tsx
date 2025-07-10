import React from 'react';
import ReactDOM from 'react-dom'; // No longer import '/client' for React 17
import App from './components/App'; // Adjust path if App.tsx is directly in src, or elsewhere

// For React 17 and older:
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you previously had reportWebVitals or index.css imports, add them back if needed:
// import './index.css';
// import reportWebVitals from './reportWebVitals';
// reportWebVitals();