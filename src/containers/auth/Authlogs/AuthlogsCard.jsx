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

const AuthlogsCard = ({
  items = [],
  handleDelete,
  loading,
}) => {
  const classes = useStyles();

  if (items.length === 0) {
    return (<></>);
  }

  const getIcon = (authlog) => {
    const color = authlog.isActive === true ? 'primary' : 'disabled';

    if (authlog.device === 'mobile') {
      return <MobileIcon color={color} />;
    }

    if (authlog.device === 'tablet') {
      return <TabletIcon color={color} />;
    }

    if (authlog.device === 'desktop') {
      if (authlog.os === 'macOS') {
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
        {items.map((authlog, index) => {
          const key = `authlog-${index}`;
          const createdAt = moment.utc(authlog.createdAt).local().format('LLL').toString();
          const avatarIcon = getIcon(authlog);
          const canDelete = authlog.isActive === true && authlog.isViewer === false;
          const clientName = clientDisplayName(authlog.clientId);
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
                    ...authlog,
                  })}
                  primary={
                    <>
                      <span>
                        {clientName ? `${createdAt} · ${clientName}` : createdAt}
                      </span>
                      {authlog.isActive && (
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
                        handleDelete(authlog);
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

AuthlogsCard.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any),
  handleDelete: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default AuthlogsCard;
