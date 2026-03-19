import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!, {
  onUncaughtError: (error, errorInfo) => {
    console.error('Uncaught Error:', error, errorInfo);
    // Here you could send the error to a reporting service like Sentry
  },
  onCaughtError: (error, errorInfo) => {
    console.error('Caught Error:', error, errorInfo);
    // Here you could send the error to a reporting service like Sentry
  }
}).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
