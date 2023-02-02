import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';

import BackIcon from '@material-ui/icons/ArrowBackIos';

import utils from '../../utils';

const {
  getActorInitials,
  getPortraitURL,
  getURL,
} = utils.node;

const ActorSettingCard = (props) => {
  const {
    actor,
    subheader,
    children,
  } = props;

  const src = getPortraitURL(actor, 'medium');
  const initials = getActorInitials(actor);
  const url = getURL(actor);

  return (
    <Card>
      <CardHeader
        avatar={
          <Button
            href={url}
            variant="text"
            startIcon={<BackIcon />}
          >
            <Avatar
              aria-label={actor.name}
              alt={actor.name}
              src={src}
            >
              {!src && initials}
            </Avatar>
          </Button>
        }
        title={actor.name}
        subheader={subheader}
      />
      <Divider />
      {children}
    </Card>
  );
};

ActorSettingCard.propTypes = {
  actor: PropTypes.object.isRequired,
  subheader: PropTypes.string,
  children: PropTypes.node.isRequired,
};

ActorSettingCard.defaultProps = {
  subheader: 'Settings',
};

export default ActorSettingCard;
