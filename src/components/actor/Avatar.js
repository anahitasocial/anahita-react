import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';
import ActorType from '../../proptypes/Actor';

import {
  getURL,
  getPortraitURL,
  getActorInitials,
} from '../utils';

const styles = (theme) => {
  return {
    largeAvatar: {
      width: theme.spacing(20),
      height: theme.spacing(20),
    },
    smallAvatar: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
    defaultAvatar: {
      width: theme.spacing(5),
      height: theme.spacing(5),
    },
    largeInitials: {
      fontSize: 48,
    },
    smallInitials: {
      fontSize: 12,
    },
    defaultInitials: {
      fontSize: 20,
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
    <React.Fragment>
      {linked &&
        <Link
          href={url}
          className={classes.link}
        >
          <Avatar
            aria-label={actor.name}
            alt={actor.name}
            src={portrait}
            className={classes[`${size}Avatar`]}
          >
            <span className={classes[`${size}Initials`]}>
              {!portrait && initials}
            </span>
          </Avatar>
        </Link>
      }
      {!linked &&
        <Avatar
          aria-label={actor.name}
          alt={actor.name}
          src={portrait}
        >
          {!portrait && initials}
        </Avatar>
      }
    </React.Fragment>
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
