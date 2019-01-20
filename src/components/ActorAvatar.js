import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import { Link } from 'react-router-dom';
import ActorType from '../proptypes/Actor';

import {
  getURL,
  getPortraitURL,
  getActorInitials,
} from './utils';

const ActorAvatar = (props) => {
  const {
    actor,
    linked,
  } = props;

  const url = getURL(actor);
  const portrait = getPortraitURL(actor);
  const initials = getActorInitials(actor);

  return (
    <React.Fragment>
      {linked &&
        <ButtonBase
          component={Link}
          to={url}
        >
          <Avatar
            aria-label={actor.name}
            alt={actor.name}
            src={portrait}
          >
            {!portrait && initials}
          </Avatar>
        </ButtonBase>
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
  actor: ActorType.isRequired,
  linked: PropTypes.bool,
};

ActorAvatar.defaultProps = {
  linked: false,
};

export default ActorAvatar;
