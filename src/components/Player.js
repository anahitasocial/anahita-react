import React from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';
import withStyles from '@material-ui/core/styles/withStyles';

const regex = /((?:https?|http?):\/\/[-a-z0-9+&@#/%?=~_()|!:,.;]*[-a-z0-9+&@#/%=~_()|])/ig;

const styles = (theme) => {
  return {
    wrapper: {
      backgroundColor: theme.palette.grey[900],
    },
  };
};

const Player = (props) => {
  const { text, classes } = props;
  const urls = text.match(regex);

  if (!urls || !urls[0].match(/(youtu|vimeo|soundcloud|dailymotion|mixcloud|twitch)/)) {
    return '';
  }

  return (
    <div className={classes.wrapper}>
      <ReactPlayer
        url={urls[0]}
        controls
        light
        width="100%"
      />
    </div>
  );
};

Player.propTypes = {
  classes: PropTypes.object.isRequired,
  text: PropTypes.string,
};

Player.defaultProps = {
  text: '',
};

export default withStyles(styles)(Player);
