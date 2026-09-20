import React from 'react';
import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
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
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import KeyIcon from '@material-ui/icons/VpnKey';

import i18n from '../../../languages';
import OAuthSigningKeysType from '../../../proptypes/OAuthSigningKeys';

// How long before expiry a key starts being flagged. Two weeks is
// enough notice to seed a replacement and let consumers pick it up from
// JWKS before the old one stops verifying.
const EXPIRY_WARNING_DAYS = 14;

const useStyles = makeStyles((theme) => {
  return {
    keyId: {
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
    inactive: {
      backgroundColor: theme.palette.action.disabledBackground,
    },
    empty: {
      paddingTop: 0,
    },
  };
});

const daysUntil = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
};

const formatDate = (value) => {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
};

const OAuthSigningKeys = ({
  items,
  publishedKids = null,
  isFetching = false,
  canEdit = false,
  pendingKid = null,
  onToggle,
}) => {
  const classes = useStyles();

  // Whether switching a key off is even possible right now. The server
  // refuses to leave the registry with none active, so with exactly one
  // the switch is disabled here too — the refusal is then something the
  // screen explains up front rather than something discovered by
  // trying.
  const activeCount = items.filter((key) => {
    return key.active;
  }).length;

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar>
            <KeyIcon />
          </Avatar>
        }
        title={
          <Typography variant="h6">
            {i18n.t('settings:oauthSigningKeys.cTitle')}
          </Typography>
        }
        subheader={i18n.t('settings:oauthSigningKeys.cDescription')}
      />
      <Divider />

      {isFetching && <LinearProgress />}

      {!isFetching && items.length === 0 &&
        <CardContent className={classes.empty}>
          <Typography variant="body2" color="error">
            {i18n.t('settings:oauthSigningKeys.empty')}
          </Typography>
        </CardContent>}

      {items.length > 0 &&
        <List disablePadding>
          {items.map((key) => {
            const remaining = daysUntil(key.expiresAt);
            const expired = remaining !== null && remaining <= 0;
            const expiring = remaining !== null &&
              remaining > 0 &&
              remaining <= EXPIRY_WARNING_DAYS;

            // The last active key cannot be switched off, and neither
            // can anything while another toggle is in flight.
            const isLastActive = key.active && activeCount <= 1;
            const disabled = !canEdit || pendingKid !== null || isLastActive;

            const published = publishedKids === null ?
              null :
              publishedKids.includes(key.keyId);

            return (
              <ListItem key={key.keyId} divider alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar className={key.active ? '' : classes.inactive}>
                    <KeyIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  // The whole kid, not a truncation. On a table it was
                  // shortened to keep the column scannable; in a list
                  // it has the row to itself and wraps, so there is no
                  // reason to hide half of the one value somebody
                  // came here to match against a token.
                  primaryTypographyProps={{ className: classes.keyId }}
                  primary={key.keyId}
                  secondaryTypographyProps={{ component: 'div' }}
                  secondary={
                    <>
                      <Typography variant="caption" color="textSecondary">
                        {`${key.algorithm} · ${key.backend} · ${i18n.t('settings:oauthSigningKeys.expiresOn', {
                          date: formatDate(key.expiresAt),
                        })}`}
                      </Typography>
                      <div className={classes.meta}>
                        {/* Whether verifiers can actually see this
                            key. A registry row and a published JWK are
                            different facts, and they lag each other by
                            however long consumers cache the document. */}
                        {published === true &&
                          <Chip
                            size="small"
                            variant="outlined"
                            color="primary"
                            className={classes.chip}
                            label={i18n.t('settings:oauthSigningKeys.published.yes')}
                          />}
                        {published === false &&
                          <Chip
                            size="small"
                            variant="outlined"
                            className={classes.chip}
                            label={i18n.t('settings:oauthSigningKeys.published.no')}
                          />}
                        {/* "We could not ask" is not "not published",
                            and saying nothing would collapse the two.
                            JWKS is fetched separately and is allowed
                            to fail without taking the screen down. */}
                        {published === null &&
                          <Chip
                            size="small"
                            variant="outlined"
                            className={classes.chip}
                            label={i18n.t('settings:oauthSigningKeys.published.unknown')}
                          />}
                        {expired &&
                          <Chip
                            size="small"
                            className={classes.chip}
                            label={i18n.t('settings:oauthSigningKeys.expired')}
                          />}
                        {/* A flag, not a countdown. The exact date is
                            on the line above, so repeating the number
                            of days would say it twice — and phrasing
                            it as "{{count}} days" would need i18next's
                            plural forms to avoid reading "1 days" on
                            the last day, for a word nobody needs. */}
                        {expiring &&
                          <Chip
                            size="small"
                            className={classes.chip}
                            label={i18n.t('settings:oauthSigningKeys.expiringSoon')}
                          />}
                      </div>
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  {/* The span is load-bearing: a disabled control
                      fires no pointer events, so the Tooltip would
                      never hear the hover and the reason the switch is
                      dead would be unreachable exactly when somebody
                      most wants it. */}
                  <Tooltip
                    title={isLastActive && canEdit ?
                      i18n.t('settings:oauthSigningKeys.lastActiveHint') :
                      ''}
                  >
                    <span>
                      <Switch
                        edge="end"
                        color="primary"
                        checked={Boolean(key.active)}
                        disabled={disabled}
                        inputProps={{
                          'aria-label': i18n.t('settings:oauthSigningKeys.fields.active'),
                        }}
                        onChange={(event) => {
                          onToggle(key, event.target.checked);
                        }}
                      />
                    </span>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>}
    </Card>
  );
};

OAuthSigningKeys.propTypes = {
  items: OAuthSigningKeysType.isRequired,
  publishedKids: PropTypes.arrayOf(PropTypes.string),
  isFetching: PropTypes.bool,
  canEdit: PropTypes.bool,
  pendingKid: PropTypes.string,
  onToggle: PropTypes.func.isRequired,
};

export default OAuthSigningKeys;
