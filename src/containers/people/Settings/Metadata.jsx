import React, { useEffect, useState } from 'react';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import MetadataIcon from '@material-ui/icons/PermIdentity';

import api from '../../../api';
import i18n from '../../../languages';
import PersonType from '../../../proptypes/Person';

const formatDateTime = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date.toLocaleString();
};

// When somebody joined, and when they were last here.
//
// Two facts from two places. The join date is on the person already —
// it is the node's creation time, and no request is needed for it. The
// last sign-in is not stored on the account at all, so it is derived
// from the most recent auth log.
//
// Derived rather than assumed-sorted: the endpoint makes no ordering
// promise this card could rely on, and reading entry zero would be a
// guess that happens to be right until somebody changes the query.
const Metadata = ({ person }) => {
  const [lastSignIn, setLastSignIn] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    let cancelled = false;

    api.authLogs.browse(person)
      .then(({ data }) => {
        if (cancelled) {
          return;
        }

        const logs = (data && data.data) || [];

        const latest = logs.reduce((newest, log) => {
          if (!log.createdAt) {
            return newest;
          }

          return !newest || log.createdAt > newest ? log.createdAt : newest;
        }, null);

        setLastSignIn(latest);
      })
      // Not fatal, and not worth an alert. The join date above is the
      // half of this card that always works; failing the whole thing
      // over the other half would hide a fact we already have.
      .catch(() => {
        return null;
      })
      .finally(() => {
        if (!cancelled) {
          setIsFetching(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [person]);

  const joined = formatDateTime(person.creationTime);
  const seen = formatDateTime(lastSignIn);

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar>
            <MetadataIcon />
          </Avatar>
        }
        title={
          <Typography variant="h5">
            {i18n.t('people:metadata.cTitle')}
          </Typography>
        }
      />
      <Divider />

      {isFetching && <LinearProgress />}

      <List disablePadding>
        <ListItem divider>
          <ListItemText
            primary={i18n.t('people:metadata.joined')}
            secondary={joined || i18n.t('people:metadata.unknown')}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={i18n.t('people:metadata.lastSignIn')}
            // "Never" and "we could not tell" are different answers and
            // this cannot distinguish them: an empty log reads the same
            // as a failed request. Says the weaker of the two rather
            // than asserting the stronger.
            secondary={seen || i18n.t('people:metadata.unknown')}
          />
        </ListItem>
      </List>
    </Card>
  );
};

Metadata.propTypes = {
  person: PersonType.isRequired,
};

export default Metadata;
