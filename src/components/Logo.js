import React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import logo from '../statics/logo';

const {
  white: darkThemeLogo,
  color: lightThemeLogo,
} = logo;

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
