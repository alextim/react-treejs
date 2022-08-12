import App from './App';
import './index.css';

const container = document.getElementById('scene-container');
if (!container) {
  throw new Error('No #scene-container');
}

App(container);
