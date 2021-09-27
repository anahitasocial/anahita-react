import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';

import appLogo from '../../statics/logo';

const useStyles = makeStyles((theme) => {
  return {
    root: {
      backgroundColor: 'transparent',
    },
    hRoot: {
      display: 'flex',
      flexDirection: 'column',
    },
    hAvatar: {
      marginTop: theme.spacing(10),
    },
    avatar: {
      width: theme.spacing(19),
      height: theme.spacing(19),
      border: '2px solid white',
    },
    hContent: {
      marginTop: theme.spacing(4),
    },
    title: {
      fontSize: 64,
    },
    subheader: {
      fontSize: 20,
    },
    grow: {
      flex: '1 1 auto',
    },
  };
});

const HomeHero = () => {
  const classes = useStyles();
  const { color: logo } = appLogo;
  return (
    <Card elevation={0} className={classes.root}>
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
