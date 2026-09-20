import React from 'react';
import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import AddIcon from '@material-ui/icons/Add';
import ClientsIcon from '@material-ui/icons/Apps';
import ConfidentialIcon from '@material-ui/icons/Lock';
import PublicIcon from '@material-ui/icons/LockOpen';

import i18n from '../../../languages';
import OAuthClientsType from '../../../proptypes/OAuthClients';

import OAuthClientMenu from './Menu';

const useStyles = makeStyles((theme) => {
  return {
    clientId: {
      fontFamily: 'monospace',
      wordBreak: 'break-all',
    },
    meta: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      marginTop: theme.spacing(0.5),
    },
    chip: {
      marginRight: theme.spacing(0.5),
      marginBottom: theme.spacing(0.5),
    },
    empty: {
      paddingTop: 0,
    },
  };
});

// Dates arrive as RFC 3339 from Go. An unparseable one is reported as a
// dash rather than as "Invalid Date", which is what the previous screen
// printed in every row — it read client.createTime, and the field has
// always been called created_at.
const formatDate = (value) => {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
};

const OAuthClients = ({
  items,
  isFetching = false,
  canAdd = false,
  canEdit = false,
  canDelete = false,
  onAdd,
  onEdit,
  onDelete,
  onRotate,
}) => {
  const classes = useStyles();

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar>
            <ClientsIcon />
          </Avatar>
        }
        title={
          <Typography variant="h6">
            {i18n.t('settings:oauthClients.cTitle')}
          </Typography>
        }
        subheader={i18n.t('settings:oauthClients.cDescription')}
      />
      <Divider />

      {isFetching && <LinearProgress />}

      {!isFetching && items.length === 0 &&
        <CardContent className={classes.empty}>
          <Typography variant="body2" color="textSecondary">
            {i18n.t('settings:oauthClients.empty')}
          </Typography>
        </CardContent>}

      {items.length > 0 &&
        <List disablePadding>
          {items.map((client) => {
            // Confidential and public are the two kinds of client, not
            // a yes/no property — one authenticates with a secret, the
            // other proves itself with PKCE. The icon carries it, so
            // the distinction survives the chips wrapping off the end
            // of a narrow row.
            const confidential = Boolean(client.confidential);

            return (
              <ListItem key={client.id} divider alignItems="flex-start">
                <ListItemAvatar>
                  <Tooltip
                    title={confidential ?
                      i18n.t('settings:oauthClients.confidential') :
                      i18n.t('settings:oauthClients.public')}
                  >
                    <Avatar>
                      {confidential ? <ConfidentialIcon /> : <PublicIcon />}
                    </Avatar>
                  </Tooltip>
                </ListItemAvatar>
                <ListItemText
                  primary={client.name}
                  secondaryTypographyProps={{ component: 'div' }}
                  secondary={
                    <>
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        className={classes.clientId}
                        display="block"
                      >
                        {client.clientId}
                      </Typography>
                      <div className={classes.meta}>
                        <Chip
                          size="small"
                          className={classes.chip}
                          color={client.active ? 'primary' : 'default'}
                          label={client.active ?
                            i18n.t('commons:enabled') :
                            i18n.t('commons:disabled')}
                        />
                        {(client.grantTypes || []).map((grant) => {
                          return (
                            <Chip
                              key={grant}
                              size="small"
                              variant="outlined"
                              className={classes.chip}
                              label={grant}
                            />
                          );
                        })}
                        {client.skipConsent &&
                          <Tooltip
                            title={i18n.t('settings:oauthClients.skipConsentHint')}
                          >
                            <Chip
                              size="small"
                              variant="outlined"
                              className={classes.chip}
                              label={i18n.t('settings:oauthClients.skipConsent')}
                            />
                          </Tooltip>}
                      </div>
                      <Typography variant="caption" color="textSecondary">
                        {i18n.t('settings:oauthClients.registeredOn', {
                          date: formatDate(client.createdAt),
                        })}
                      </Typography>
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <OAuthClientMenu
                    client={client}
                    canEdit={canEdit}
                    canDelete={canDelete}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onRotate={onRotate}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>}

      {canAdd &&
        <CardActions>
          <Button
            color="primary"
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={onAdd}
            fullWidth
          >
            {i18n.t('settings:oauthClients.actions.add')}
          </Button>
        </CardActions>}
    </Card>
  );
};

OAuthClients.propTypes = {
  items: OAuthClientsType.isRequired,
  isFetching: PropTypes.bool,
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
  onAdd: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onRotate: PropTypes.func.isRequired,
};

export default OAuthClients;
