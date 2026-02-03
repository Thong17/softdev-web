import React from 'react'
import ReactDOM from 'react-dom'
import App from './app/App'
import { store } from './app/store'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
