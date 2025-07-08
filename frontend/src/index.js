import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import store from './redux/store';
import { Provider } from 'react-redux';
import './i18n'; 

const ignoreResizeObserverError = (e) => {
  if (
    e.message &&
    e.message.includes('ResizeObserver loop completed with undelivered notifications')
  ) {
    e.stopImmediatePropagation();
  }
};
window.addEventListener('error', ignoreResizeObserverError);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)