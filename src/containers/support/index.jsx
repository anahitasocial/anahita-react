import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import SupportIcon from '@material-ui/icons/ContactSupport';
import EmailIcon from '@material-ui/icons/Email';
import HelpIcon from '@material-ui/icons/HelpOutline';
import GavelIcon from '@material-ui/icons/Gavel';
import PolicyIcon from '@material-ui/icons/Policy';

import HeaderMeta from '../../components/HeaderMeta';
import actions from '../../actions';
import i18n from '../../languages';

// Where to get help. PUBLIC, deliberately.
//
// The emails that link here are the ones sent to somebody who cannot get in —
// a TOTP lockout, a recovery code spent, a device lost. Putting it behind
// AuthenticatedRoute would mean the page reachable only by people who do not
// need it.
//
// It used to link to /support on a host built as "https://www." plus the
// domain, and neither the route nor the host existed. In development that
// resolved to https://www.localhost:3000, which is not a place.

const SUPPORT_EMAIL = process.env.REACT_APP_SUPPORT_EMAIL;
const SUPPORT_URL = process.env.REACT_APP_SUPPORT_URL;
const SITE_NAME = process.env.REACT_APP_NAME;

const SupportPage = ({ setAppTitle }) => {
  useEffect(() => {
    setAppTitle(i18n.t('pages:support'));
  }, [setAppTitle]);

  // An unset variable must render nothing rather than "mailto:undefined",
  // which is the same class of broken link this page exists to replace.
  const hasEmail = Boolean(SUPPORT_EMAIL);
  const hasURL = Boolean(SUPPORT_URL);

  return (
    <Container maxWidth="sm">
      <HeaderMeta title={`${i18n.t('pages:support')} - ${SITE_NAME}`} />
      <Card>
        <CardHeader
          avatar={
            <Avatar>
              <SupportIcon />
            </Avatar>
          }
          title={
            <Typography variant="h6">
              {i18n.t('support:cTitle')}
            </Typography>
          }
          subheader={i18n.t('support:cDesc', { site: SITE_NAME })}
        />
        <CardContent>
          <List>
            {hasEmail &&
              <ListItem
                button
                component="a"
                href={`mailto:${SUPPORT_EMAIL}`}
              >
                <ListItemIcon><EmailIcon /></ListItemIcon>
                <ListItemText
                  primary={i18n.t('support:email.title')}
                  secondary={SUPPORT_EMAIL}
                />
              </ListItem>}
            {hasURL &&
              <ListItem
                button
                component="a"
                href={SUPPORT_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ListItemIcon><HelpIcon /></ListItemIcon>
                <ListItemText
                  primary={i18n.t('support:help.title')}
                  secondary={i18n.t('support:help.desc')}
                />
              </ListItem>}
            {/* Nothing configured is a real state and says so, rather than
                rendering an empty card that reads as a broken page. */}
            {!hasEmail && !hasURL &&
              <ListItem>
                <ListItemText secondary={i18n.t('support:unconfigured')} />
              </ListItem>}
          </List>

          <Divider />

          {/* Somebody on a support page is often here about their account or
              their data, so the two documents that answer those belong on it. */}
          <List>
            <ListItem button component={Link} href="/pages/tos">
              <ListItemIcon><GavelIcon /></ListItemIcon>
              <ListItemText primary={i18n.t('pages:tos')} />
            </ListItem>
            <ListItem button component={Link} href="/pages/privacy">
              <ListItemIcon><PolicyIcon /></ListItemIcon>
              <ListItemText primary={i18n.t('pages:privacy')} />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Container>
  );
};

SupportPage.propTypes = {
  setAppTitle: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAppTitle: (title) => {
      return dispatch(actions.app.setAppTitle(title));
    },
  };
};

export default connect(null, mapDispatchToProps)(SupportPage);
