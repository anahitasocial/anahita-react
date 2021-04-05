import React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';

import darkThemeLogo from '../statics/media/menu-logo-white.png';
import lightThemeLogo from '../statics/media/menu-logo-colour.png';

const Logo = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const src = prefersDarkMode ? darkThemeLogo : lightThemeLogo;

  return (
    <IconButton href="/" size="small">
      <Avatar src={src} alt={process.env.REACT_APP_NAME} />
    </IconButton>
  );
};

export default Logo;
