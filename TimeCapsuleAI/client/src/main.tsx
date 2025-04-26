import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Load Material Icons
const materialIcons = document.createElement('link');
materialIcons.rel = 'stylesheet';
materialIcons.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
document.head.appendChild(materialIcons);

// Load Inter font
const interFont = document.createElement('link');
interFont.rel = 'stylesheet';
interFont.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
document.head.appendChild(interFont);

// Add meta title
const metaTitle = document.createElement('title');
metaTitle.textContent = 'Time Capsule AI - AI365 Power Suite';
document.head.appendChild(metaTitle);

createRoot(document.getElementById("root")!).render(<App />);
