import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
// import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import assets from 'anahita-react-assets';

const useStyles = makeStyles((theme) => {
  return {
    hRoot: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.palette.background.paper,
    },
    hAvatar: {
      // marginTop: -theme.spacing(15),
    },
    avatar: {
      width: theme.spacing(20),
      height: theme.spacing(20),
      fontSize: 48,
    },
    hContent: {
      marginTop: theme.spacing(4),
    },
    title: {
      // fontSize: 24,
      // fontWeight: 600,
    },
    subheader: {
      fontSize: 18,
      // margin: theme.spacing(2),
    },
    grow: {
      flex: '1 1 auto',
    },
  };
});

const HomeHero = () => {
  const classes = useStyles();
  const { color: logo } = assets.logo;
  return (
    <Card>
      <CardHeader
        classes={{
          root: classes.hRoot,
          avatar: classes.hAvatar,
          content: classes.hContent,
          action: classes.hAction,
        }}
        avatar={
          <Avatar className={classes.avatar}>
            <img src={logo} alt={process.env.REACT_APP_NAME} className={classes.logo} />
          </Avatar>
        }
        title={
          <Typography
            variant="h1"
            className={classes.title}
            align="center"
          >
            {process.env.REACT_APP_NAME}
          </Typography>
        }
        subheader={
          <Typography
            variant="subtitle1"
            className={classes.subheader}
            align="center"
            color="textSecondary"
          >
            Knowledge Networking Platform & Framework
          </Typography>
        }
      />
    </Card>
  );
};

export default withRouter(HomeHero);
