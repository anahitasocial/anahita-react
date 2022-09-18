import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';
import VisibilitySensor from 'react-visibility-sensor';
import withStyles from '@material-ui/core/styles/withStyles';

const regex = /((?:https?|http?):\/\/[-a-z0-9+&@#/%?=~_()|!:,.;]*[-a-z0-9+&@#/%=~_()|])/ig;

const styles = (theme) => {
  return {
    root: {
      position: 'relative',
      paddingTop: '56.25%', /* 56.25% Player ratio: 100 / (1280 / 720) */
      backgroundColor: theme.palette.background.default,
    },
    reactPlayer: {
      position: 'absolute',
      top: 0,
      left: 0,
    },
  };
};

const Player = (props) => {
  const { text, classes } = props;
  const [playing, setPlaying] = useState(false);
  const urls = text.match(regex);
  const isEmpty = !urls || !urls[0].match(/(youtu|vimeo|soundcloud|dailymotion|mixcloud|twitch)/);

  if (isEmpty) {
    return '';
  }

  return (
    <div className={classes.root}>
      <VisibilitySensor
        onChange={(isVisible) => {
          if (!isVisible) {
            setPlaying(isVisible);
          }
        }}
      >
        <ReactPlayer
          url={urls[0]}
          controls
          light
          width="100%"
          height="100%"
          className={classes.reactPlayer}
          playing={playing}
          onPlay={() => {
            setPlaying(true);
          }}
        />
      </VisibilitySensor>
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
