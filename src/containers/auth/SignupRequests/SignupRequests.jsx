import React from 'react';
import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import SignupRequestsIcon from '@material-ui/icons/HowToReg';
import PersonIcon from '@material-ui/icons/PersonOutline';
import WarningIcon from '@material-ui/icons/Warning';

import i18n from '../../../languages';
import SignupRequestsType from '../../../proptypes/SignupRequests';

const useStyles = makeStyles((theme) => {
  return {
    body: {
      marginTop: theme.spacing(0.5),
      whiteSpace: 'pre-wrap',
    },
    meta: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      marginTop: theme.spacing(0.5),
    },
    chip: {
      marginRight: theme.spacing(0.5),
    },
    warning: {
      display: 'flex',
      alignItems: 'center',
      marginTop: theme.spacing(0.5),
    },
    warningIcon: {
      fontSize: '1rem',
      marginRight: theme.spacing(0.5),
      color: theme.palette.warning.dark,
    },
    // The actions sit in the flow of the row rather than in a
    // ListItemSecondaryAction, which is absolutely positioned. Two
    // text buttons pinned to the right edge overlap a long email on a
    // phone; here they wrap under the text instead, and the row grows.
    actions: {
      display: 'flex',
      flexWrap: 'wrap',
      marginTop: theme.spacing(1),
    },
    approve: {
      marginRight: theme.spacing(1),
    },
    reject: {
      color: theme.palette.error.main,
    },
  };
});

const formatDate = (value) => {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
};

const SignupRequests = ({
  items,
  isFetching = false,
  canApprove = false,
  canReject = false,
  onDecide,
}) => {
  const classes = useStyles();

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar>
            <SignupRequestsIcon />
          </Avatar>
        }
        title={
          <Typography variant="h6">
            {i18n.t('signupRequests:cTitle')}
          </Typography>
        }
      />
      <Divider />

      {isFetching && <LinearProgress />}

      {/* An empty queue is the good state, and says so. "No results"
          would read as a list that failed to load. */}
      {!isFetching && items.length === 0 &&
        <CardContent>
          <Typography variant="body2" color="textSecondary">
            {i18n.t('signupRequests:empty')}
          </Typography>
        </CardContent>}

      {items.length > 0 &&
        <List disablePadding>
          {items.map((request) => {
            return (
              <ListItem key={request.id} divider alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={request.username}
                  secondaryTypographyProps={{ component: 'div' }}
                  secondary={
                    <>
                      <Typography variant="caption" color="textSecondary">
                        {request.name ?
                          `${request.name} · ${request.email}` :
                          request.email}
                      </Typography>

                      {/* Why they say they want in. The reason an
                          administrator is being asked at all, so it is
                          shown in full rather than truncated to keep a
                          row height. */}
                      {request.body &&
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          className={classes.body}
                        >
                          {request.body}
                        </Typography>}

                      <div className={classes.meta}>
                        <Chip
                          size="small"
                          variant="outlined"
                          className={classes.chip}
                          label={formatDate(request.createdAt)}
                        />
                        {Boolean(request.invitedBy) &&
                          <Chip
                            size="small"
                            variant="outlined"
                            className={classes.chip}
                            label={i18n.t('signupRequests:invited')}
                          />}
                        {request.websiteUrl &&
                          <Link
                            href={request.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="caption"
                          >
                            {request.websiteUrl}
                          </Link>}
                      </div>

                      {/* Computed by the server at read time, because
                          it changes while a request waits. Shown here
                          so the conflict is seen before the approval
                          is attempted rather than after it 409s. */}
                      {request.usernameTaken &&
                        <div className={classes.warning}>
                          <WarningIcon className={classes.warningIcon} />
                          <Typography variant="caption" color="error">
                            {i18n.t('signupRequests:usernameTakenHint')}
                          </Typography>
                        </div>}

                      <div className={classes.actions}>
                        {canApprove &&
                          // The span is load-bearing: a disabled MUI
                          // button fires no pointer events, so the
                          // Tooltip never hears the hover and the
                          // explanation becomes unreachable exactly
                          // when somebody most wants it.
                          <Tooltip
                            title={request.usernameTaken ?
                              i18n.t('signupRequests:usernameTakenHint') :
                              ''}
                          >
                            <span className={classes.approve}>
                              <Button
                                size="small"
                                color="primary"
                                variant="contained"
                                disabled={request.usernameTaken}
                                onClick={() => {
                                  onDecide(request, 'approve');
                                }}
                              >
                                {i18n.t('signupRequests:actions.approve')}
                              </Button>
                            </span>
                          </Tooltip>}
                        {canReject &&
                          <Button
                            size="small"
                            className={classes.reject}
                            onClick={() => {
                              onDecide(request, 'reject');
                            }}
                          >
                            {i18n.t('signupRequests:actions.reject')}
                          </Button>}
                      </div>
                    </>
                  }
                />
              </ListItem>
            );
          })}
        </List>}
    </Card>
  );
};

SignupRequests.propTypes = {
  items: SignupRequestsType.isRequired,
  isFetching: PropTypes.bool,
  canApprove: PropTypes.bool,
  canReject: PropTypes.bool,
  onDecide: PropTypes.func.isRequired,
};

export default SignupRequests;
