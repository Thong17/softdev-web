import React from 'react'
import ReactDOM from 'react-dom'
import App from './app/App'
import { store } from './app/store'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles'

// MUI's default theme, except plain MUI buttons get the app's button radius
// (theme radius.primary) instead of 4px, which is too small for the squircle
// corners to show. Buttons styled with their own radius keep it.
const muiTheme = createTheme({
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 14 } } },
  },
})

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <ThemeProvider theme={muiTheme}>
          <App />
        </ThemeProvider>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
