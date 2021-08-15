import { createMuiTheme } from '@material-ui/core/styles';
import { colors } from '@material-ui/core';
import assets from 'anahita-react-assets';

export default (prefersDarkMode) => {
  const styles = assets.styles.global({
    prefersDarkMode,
    colors,
  });

  return createMuiTheme({
    ...styles,
  });
};
