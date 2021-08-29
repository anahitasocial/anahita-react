import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
// import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import assets from 'anahita-react-assets';

const useStyles = makeStyles(theme => ({
  root: {},
  media: {
    height: theme.spacing(50),
  },
  container: {
    height: theme.spacing(50),
    backgroundColor: fade(theme.palette.common.black, 0.15),
  },
  logoContainer: {
    margin: theme.spacing(3),
  },
  logo: {
    maxWidth: '100%',
  },
  h1: {
    fontSize: 56,
    margin: theme.spacing(3),
    wordBreak: 'break-word',
  },
  h3: {
    fontSize: 16,
    margin: theme.spacing(3),
  },
  subtitle: {
    margin: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
  },
}));

const HomeHero = () => {
  const classes = useStyles();
  const { color: logo } = assets.logo;
  return (
    <Card>
      <Grid
        container
        spacing={2}
        direction="row"
        justify="center"
        alignItems="center"
      >
        <Grid item xs={12} md={6}>
          <Box color="white">
            <div className={classes.logoContainer}>
              <img src={logo} alt={process.env.REACT_APP_NAME} className={classes.logo} />
            </div>
            <Typography
              variant="h3"
              className={classes.h3}
              gutterBottom
            >
              open source social networking platform
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};

export default withRouter(HomeHero);
