import { createTheme } from '@material-ui/core/styles';
import { colors } from '@material-ui/core';
import assets from '../assets';

const { red } = colors;
const { styles } = assets;

export default (prefersDarkMode) => {
  const style = styles.global({
    colors: {
      red,
    },
    prefersDarkMode,
  });
  return createTheme({
    ...style,
  });
};
