import React from 'react';
import reactDOM from 'react-dom/client';
import app from './main/App';
import registerServiceWorker from './registerServiceWorker';
import { register } from 'module';

const root = reactDOM.createRoot(document.getElementById('Root'));
root.render(<App />);

registerServiceWorker();