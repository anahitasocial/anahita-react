import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';
import Fade from 'material-ui/transitions/Fade';
import withStyles from 'material-ui/styles/withStyles';

const styles = theme => ({
  root: {
    width: '100%',
  },
  cover: {
    position: 'absolute',
    top: theme.spacing.unit * 8,
    left: 0,
    width: '100%',
    height: theme.spacing.unit * 40,
    zIndex: 0,
  },
  informationContainer: {
    maxWidth: theme.spacing.unit * 40,
    margin: `${theme.spacing.unit * 20}px auto 20px auto`,
  },
  avatar: {
    width: theme.spacing.unit * 30,
    height: theme.spacing.unit * 30,
    border: `5px solid ${theme.palette.background.default}`,
    textDecoration: 'none',
    margin: 10,
  },
  title: {
    margin: 10,
  },
  description: {
    margin: 10,
  },
});

const ActorProfile = (props) => {
  const {
    classes,
    cover,
    avatar,
    name,
    description,
  } = props;
  const timeout = {
    enter: 1000,
    exit: 0,
  };
  return (
    <div className={classes.root}>
      <Fade
        in
        appear
        timeout={timeout}
      >
        <Paper
          className={classes.cover}
          style={{
            backgroundImage: `url(${cover})`,
          }}
          elevation={0}
        />
      </Fade>
      <div className={classes.informationContainer}>
        <Avatar
          alt={name.charAt(0)}
          src={avatar}
          className={classes.avatar}
        >
          {!avatar && name.charAt(0)}
        </Avatar>
        <Typography variant="display1" className={classes.title}>
          {name}
        </Typography>
        <Typography component="p" className={classes.description}>
          {description}
        </Typography>
      </div>
    </div>
  );
};

ActorProfile.propTypes = {
  classes: PropTypes.object.isRequired,
  cover: PropTypes.string,
  avatar: PropTypes.string,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
};

ActorProfile.defaultProps = {
  cover: '',
  avatar: '',
  description: '',
};

export default withStyles(styles)(ActorProfile);
