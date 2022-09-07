import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';
import ActorType from '../../proptypes/Actor';
import utils from '../../utils';

const {
  getURL,
  getPortraitURL,
  getActorInitials,
} = utils.node;

const styles = (theme) => {
  return {
    largeAvatar: {
      width: theme.spacing(20),
      height: theme.spacing(20),
      fontSize: 48,
    },
    smallAvatar: {
      width: theme.spacing(3),
      height: theme.spacing(3),
      fontSize: 12,
    },
    defaultAvatar: {
      width: theme.spacing(6),
      height: theme.spacing(6),
      fontSize: 20,
    },
    avatar: {
      // color: theme.palette.text.primary,
    },
    link: {
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'none',
      },
    },
  };
};

const ActorAvatar = (props) => {
  const {
    classes,
    actor,
    linked,
    size,
  } = props;

  const url = getURL(actor);
  const portrait = getPortraitURL(actor);
  const initials = getActorInitials(actor);

  return (
    <>
      {linked &&
        <Link
          href={url}
          className={classes.link}
        >
          <Avatar
            aria-label={actor.name}
            alt={actor.name}
            src={portrait}
            className={clsx(classes[`${size}Avatar`], classes.avatar)}
          >
            {!portrait && initials}
          </Avatar>
        </Link>}
      {!linked &&
        <Avatar
          aria-label={actor.name}
          alt={actor.name}
          src={portrait}
        >
          {!portrait && initials}
        </Avatar>}
    </>
  );
};

ActorAvatar.propTypes = {
  classes: PropTypes.object.isRequired,
  actor: ActorType.isRequired,
  linked: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'large', 'default']),
};

ActorAvatar.defaultProps = {
  linked: false,
  size: 'default',
};

export default withStyles(styles)(ActorAvatar);
