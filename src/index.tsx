import React from 'react'
import ReactDOM from 'react-dom'
import App from './app/App'
import { store } from './app/store'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles'

// MUI's default theme, except MUI's own 4px corners, too small for the
// squircle corners to show, take the app's radii instead: buttons
// radius.primary, dialogs and menus radius.quaternary (as the app's own
// dialogs and menus). Anything styled with its own radius keeps it.
const muiTheme = createTheme({
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 14 } } },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 26 } } },
    MuiPopover: { styleOverrides: { paper: { borderRadius: 26 } } },
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
