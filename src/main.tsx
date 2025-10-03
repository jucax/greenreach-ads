import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'


console.log('🚀 Main: Starting application...');

try {
  const rootElement = document.getElementById('root');
  console.log('🚀 Main: Root element found:', !!rootElement);
  
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  const root = createRoot(rootElement);
  console.log('🚀 Main: React root created');
  
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  
  console.log('🚀 Main: App rendered successfully');
} catch (error) {
  console.error('❌ Main: Error starting application:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; color: red; font-family: Arial, sans-serif;">
      <h1>Application Error</h1>
      <p>Failed to start the application: ${error instanceof Error ? error.message : 'Unknown error'}</p>
      <p>Check the console for more details.</p>
    </div>
  `;
}
