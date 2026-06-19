import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import PersonType from '../../proptypes/Person';
import Icon from './Icon';

const NotificationButton = ({ viewer }) => {
  return (
    <IconButton
      href="/notifications"
      color="inherit"
      size="small"
    >
      <Avatar color="inherit">
        <Icon viewer={viewer} />
      </Avatar>
    </IconButton>
  );
};

NotificationButton.propTypes = {
  viewer: PersonType.isRequired,
};

export default NotificationButton;
