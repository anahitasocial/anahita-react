import React, { useEffect, useState } from 'react';
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
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

// The same MenuBook the left menu uses for Legal. A gavel was the
// earlier choice here and the wrong one twice over: it had already
// been replaced for the legal pages, and it pictures a court rather
// than a document somebody read and agreed to.
import AgreementsIcon from '@material-ui/icons/MenuBook';

import api from '../../../api';
import i18n from '../../../languages';

const useStyles = makeStyles((theme) => {
  return {
    chip: {
      marginLeft: theme.spacing(1),
    },
  };
});

const formatDate = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString();
};

// What one person has accepted, and when.
//
// Shown to its subject in their own Account section and to an
// administrator in the Administration section — same card, same
// endpoint, the server deciding which of the two is asking.
//
// Version and date only. The row also holds the IP, user agent and OS
// of the acceptance; those are the audit trail, read by somebody
// looking at a row when a question arises, and putting a person's
// address on a settings card would be a privacy expansion arriving by
// accident because the column was next door.
const Agreements = ({ personId }) => {
  const classes = useStyles();
  const [agreements, setAgreements] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    api.agreements.read(personId)
      .then(({ data }) => {
        if (!cancelled) {
          setAgreements(data.data || {});
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFailed(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [personId]);

  const documents = [
    { key: 'tos', consent: agreements && agreements.tos },
    { key: 'privacy', consent: agreements && agreements.privacy },
  ];

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar>
            <AgreementsIcon />
          </Avatar>
        }
        title={
          <Typography variant="h5">
            {i18n.t('people:agreements.cTitle')}
          </Typography>
        }
      />
      <Divider />

      {!agreements && !failed && <LinearProgress />}

      {failed &&
        <CardContent>
          <Typography variant="body2" color="textSecondary">
            {i18n.t('people:agreements.unavailable')}
          </Typography>
        </CardContent>}

      {agreements &&
        <List disablePadding>
          {documents.map(({ key, consent }) => {
            const accepted = Boolean(consent && consent.accepted);
            const at = formatDate(consent && consent.acceptedAt);

            return (
              <ListItem key={key} divider={key === 'tos'}>
                <ListItemText
                  primary={i18n.t(`people:agreements.${key}`)}
                  secondaryTypographyProps={{ component: 'div' }}
                  secondary={
                    <Typography variant="caption" color="textSecondary">
                      {/* Never accepted is a real state and says so.
                          A blank row would read as a card that failed
                          to load, which is the opposite of what an
                          administrator checking compliance needs. */}
                      {accepted && at ?
                        i18n.t('people:agreements.acceptedOn', { date: at }) :
                        i18n.t('people:agreements.never')}
                    </Typography>
                  }
                />
                {accepted && consent.version &&
                  <Chip
                    size="small"
                    variant="outlined"
                    className={classes.chip}
                    label={i18n.t('people:agreements.version', {
                      version: consent.version,
                    })}
                  />}
              </ListItem>
            );
          })}
        </List>}
    </Card>
  );
};

Agreements.propTypes = {
  personId: PropTypes.number.isRequired,
};

export default Agreements;
