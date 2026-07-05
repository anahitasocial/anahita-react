import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Masonry from 'react-masonry-css';

const useStyles = makeStyles((theme) => {
  return {
    masonryGrid: {
      display: 'flex',
      marginLeft: theme.spacing(-2),
      width: 'inherit',
    },
    masonryColumn: {
      paddingLeft: theme.spacing(2),
      backgroundClip: 'padding-box',
    },
  };
});

const BreakpointMasonry = (params) => {
  const classes = useStyles();
  const theme = useTheme();
  const { children } = params;

  const breakpointCols = {
    default: 3,
    [theme.breakpoints.values.xl]: 3,
    [theme.breakpoints.values.lg]: 2,
    [theme.breakpoints.values.md]: 1,
    [theme.breakpoints.values.sm]: 1,
    [theme.breakpoints.values.xs]: 1,
  };

  return (
    <Masonry
      breakpointCols={breakpointCols}
      className={classes.masonryGrid}
      columnClassName={classes.masonryColumn}
    >
      {children}
    </Masonry>
  );
};

export default BreakpointMasonry;
