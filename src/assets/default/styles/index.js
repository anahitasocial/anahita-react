const global = (params) => {
  const {
    colors: {
      red,
    },
    prefersDarkMode,
  } = params;

  return {
    typography: {
      useNextVariants: true,
    },
    palette: {
      type: prefersDarkMode ? 'dark' : 'light',
      primary: {
        main: prefersDarkMode ? '#90caf9' : '#098ED1',
      },
      error: red,
    },
  };
};

export default {
  global,
}
