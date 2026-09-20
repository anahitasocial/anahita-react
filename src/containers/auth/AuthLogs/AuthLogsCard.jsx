import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { makeStyles } from '@material-ui/core/styles';

import DesktopMacIcon from '@material-ui/icons/DesktopMac';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import MobileIcon from '@material-ui/icons/Smartphone';
import TabletIcon from '@material-ui/icons/Tablet';
import BotIcon from '@material-ui/icons/Warning';

import i18n from '../../../languages';
import { OAuthClients as OAUTH_CLIENTS } from '../../../constants';

const clientDisplayName = (clientId) => {
  if (!clientId) return '';
  return OAUTH_CLIENTS[clientId] || clientId;
};

const useStyles = makeStyles((theme) => {
  return ({
    chip: {
      marginLeft: theme.spacing(1),
      height: 20,
      fontSize: '0.75rem',
    },
  });
});

const AuthLogsCard = ({
  items = [],
  handleDelete,
  loading,
}) => {
  const classes = useStyles();

  if (items.length === 0) {
    return (<></>);
  }

  const getIcon = (authLog) => {
    const color = authLog.isActive === true ? 'primary' : 'disabled';

    if (authLog.device === 'mobile') {
      return <MobileIcon color={color} />;
    }

    if (authLog.device === 'tablet') {
      return <TabletIcon color={color} />;
    }

    if (authLog.device === 'desktop') {
      if (authLog.os === 'macOS') {
        return <DesktopMacIcon color={color} />;
      }

      return <DesktopWindowsIcon color={color} />;
    }

    return <BotIcon color={color} />;
  };

  return (
    <Card>
      <CardHeader
        title={i18n.t('auth:authLogs.cTitle')}
      />
      <List>
        {items.map((authLog, index) => {
          const key = `authLog-${index}`;
          const createdAt = moment.utc(authLog.createdAt).local().format('LLL').toString();
          const avatarIcon = getIcon(authLog);
          const canDelete = authLog.isActive === true && authLog.isViewer === false;
          const clientName = clientDisplayName(authLog.clientId);
          return (
            <div key={key}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    {avatarIcon}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  secondary={i18n.t('auth:authLogs.cDesc', {
                    ...authLog,
                  })}
                  primary={
                    <>
                      <span>
                        {clientName ? `${createdAt} · ${clientName}` : createdAt}
                      </span>
                      {authLog.isActive && (
                        <Chip
                          label={i18n.t('auth:authLogs.cActive')}
                          size="small"
                          color="primary"
                          className={classes.chip}
                        />
                      )}
                    </>
                  }
                />
                {canDelete &&
                  <ListItemSecondaryAction>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        handleDelete(authLog);
                      }}
                      disabled={loading}
                    >
                      {i18n.t('auth:authLogs.actions.forceLogout')}
                    </Button>
                  </ListItemSecondaryAction>}
              </ListItem>
              <Divider variant="inset" component="li" />
            </div>
          );
        })}
      </List>
    </Card>
  );
};

AuthLogsCard.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any),
  handleDelete: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default AuthLogsCard;
