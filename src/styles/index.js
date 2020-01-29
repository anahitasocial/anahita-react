import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

export default (prefersDarkMode) => {
  return createMuiTheme({
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
  });
};
