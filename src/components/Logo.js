import React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import assets from 'anahita-react-assets';

const {
  white: darkThemeLogo,
  color: lightThemeLogo,
} = assets.logo;

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
