export const themeMode = {
  blue: {
    background: {
      primary: 'rgb(14, 25, 40)',
      secondary: 'rgb(19, 47, 76)',
    },
    text: {
      primary: '#ffffff',
      secondary: '#f3f3f3',
    },
    active: {
      primary: 'rgb(24, 67, 96)',
      secondary: 'rgb(29, 77, 106)',
    },
    border: {
      primary: '1px solid rgba(255, 255, 255, 0.5)',
      secondary: '1px solid rgba(255, 255, 255, 0.1)',
    },
    shadow: {
      container:
        '0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 6px 10px 0px rgb(0 0 0 / 14%), 0px 1px 18px 0px rgb(0 0 0 / 12%)',
      primary:
        '0 3px 5px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15) !important',
      secondary:
        '0 1px 3px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15) !important',
      inset:
        '0 0 0 3px hsla(0, 0%, 100%, 0), 0 0 0 4px hsla(0, 0%, 83.9%, 0), inset 0 2px 2px 0 rgba(0, 0, 0, .2)',
    },
  },
  light: {
    background: {
      primary: '#ffffff',
      secondary: '#f3f3f3',
    },
    text: {
      primary: '#000000',
      secondary: '#333333',
    },
    active: {
      primary: '#cccccc',
      secondary: '#f9f9f9',
    },
    border: {
      primary: '1px solid rgba(0, 0, 0, 0.5)',
      secondary: '1px solid rgba(0, 0, 0, 0.1)'
    },
    shadow: {
      container:
        '0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 6px 10px 0px rgb(0 0 0 / 14%), 0px 1px 18px 0px rgb(0 0 0 / 12%)',
      primary:
        '0 3px 5px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15) !important',
      secondary:
        '0 1px 3px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15) !important',
      inset:
        '0 0 0 3px hsla(0, 0%, 100%, 0), 0 0 0 4px hsla(0, 0%, 83.9%, 0), inset 0 2px 2px 0 rgba(0, 0, 0, .2)',
    },
  },
  dark: {
    background: {
      primary: '#333333',
      secondary: '#444444',
    },
    text: {
      primary: '#ffffff',
      secondary: '#f3f3f3',
    },
    active: {
      primary: '#cccccc',
      secondary: '#999999',
    },
    border: {
      primary: '1px solid rgba(255, 255, 255, 0.5)',
      secondary: '1px solid rgba(255, 255, 255, 0.1)',
    },
    shadow: {
      container:
        '0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 6px 10px 0px rgb(0 0 0 / 14%), 0px 1px 18px 0px rgb(0 0 0 / 12%)',
      primary:
        '0 3px 5px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15) !important',
      secondary:
        '0 1px 3px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15) !important',
      inset:
        '0 0 0 3px hsla(0, 0%, 100%, 0), 0 0 0 4px hsla(0, 0%, 83.9%, 0), inset 0 2px 2px 0 rgba(0, 0, 0, .2)',
    },
  },
}

export const themeStyle = {
  radius: {
    primary: '7px',
    secondary: '13px',
    circle: '50%',
    rounded: '20px',
  },
  font: {
    family: `-apple-system, BlinkMacSystemFont, 'Open Sans', 'Helvetica Neue', sans-serif`,
    weight: 300,
  },
  responsive: {
    mobile: {
      textSize: 11
    },
    tablet: {
      textSize: 13
    },
    laptop: {
      textSize: 13
    },
    desktop: {
      textSize: 13
    }
  }
}
