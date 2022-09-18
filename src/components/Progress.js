import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => {
  return {
    progress: {
      margin: theme.spacing(1),
    },
  };
});

const Progress = () => {
  const classes = useStyles();
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
    >
      <Grid>
        <CircularProgress className={classes.progress} />
      </Grid>
    </Grid>
  );
};

export default Progress;
