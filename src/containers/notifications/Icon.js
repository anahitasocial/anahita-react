import React, { useEffect, useState } from 'react';
import Badge from '@material-ui/core/Badge';
import Icon from '@material-ui/icons/Notifications';
import ErrorIcon from '@material-ui/icons/Error';
import api from '../../api/notifications';

let interval = null;
const PERIOD = 5000; // process.env.REACT_APP_NOTIFICATIONS_CHECK_INTERVAL || 15000;

const NotificationsIcon = () => {
  const [count, setCount] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!interval) {
      interval = setInterval(() => {
        api.count()
          .then((response) => {
            const { count: newCount } = response.data;
            setCount(newCount);
          }).catch((err) => {
            setError(err);
          });
      }, PERIOD);
    }

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (error) {
    return (
      <ErrorIcon color="error" />
    );
  }

  return (
    <Badge badgeContent={count} color="primary" overlap="rectangular">
      <Icon />
    </Badge>
  );
};

export default NotificationsIcon;
