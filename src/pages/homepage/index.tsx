// the entry point of the application
import React from 'react';
import ReactDOM from 'react-dom/client';
import HomePage from "./homepage";
import "bootstrap/dist/css/bootstrap.min.css";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <HomePage />
  </React.StrictMode>
);
