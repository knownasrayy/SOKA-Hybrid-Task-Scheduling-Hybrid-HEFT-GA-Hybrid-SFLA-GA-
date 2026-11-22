import React from 'react';
import ReactDOM from 'react-dom/client';
import { DeckShell } from './app/DeckShell';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DeckShell />
  </React.StrictMode>
);
