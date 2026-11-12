import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DashboardTheme } from './themes';
import './css/fonts.css';
import './css/style.css';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DashboardTheme>
      <App />
    </DashboardTheme>
  </React.StrictMode>,
);
