import React, { useState } from 'react';
import { connect } from 'react-redux';

import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import SettingsIcon from '@material-ui/icons/Settings';

import HeaderMeta from '../../components/HeaderMeta';
import i18n from '../../languages';
import permissions from '../../permissions';
import PersonType from '../../proptypes/Person';

import SettingsOAuthClients from './OAuthClients';
import SettingsOAuthSigningKeys from './OAuthSigningKeys';

const SITE_NAME = process.env.REACT_APP_NAME;

const TABS = {
  OAUTH_CLIENTS: 'oauthClients',
  OAUTH_SIGNING_KEYS: 'oauthSigningKeys',
};

const TAB_ORDER = [
  TABS.OAUTH_CLIENTS,
  TABS.OAUTH_SIGNING_KEYS,
];

// Site settings. Super admin only, both tabs.
//
// About used to sit here and does not any more: nothing on it was a
// setting, everything on it was already public in NodeInfo, and the
// people who most needed it were the ones without accounts. It is
// /about now, in the menu beside /support and /legal. What is left is
// what the name promises — things only a super admin can change.
//
// The route was authenticated but ungated before this: the left menu
// hid the link from everybody else, and anybody who typed the URL got
// in. Hiding a link is presentation; this is the check.
const Settings = ({
  viewer,
}) => {
  const canBrowse = permissions.settings.canBrowse(viewer);
  const [tab, setTab] = useState(TABS.OAUTH_CLIENTS);

  // No second-factor check here, and nothing passed down about one.
  //
  // Writing to either OAuth tab needs a proof of presence within five
  // minutes — a passkey, a passcode or a password — but the server
  // asks for it when the write arrives, not before, and each tab
  // handles that with containers/auth/StepUp.
  //
  // This used to read GET /totp on mount and hand both tabs a
  // totpEnabled flag to disable their controls with. That was the
  // browser predicting the server's answer, and it predicted wrong
  // twice over: it locked out anybody holding a passkey rather than
  // TOTP, and the gate it was mirroring denied everyone regardless,
  // because it read a field the JWT never carries.

  // After the hooks, so every render runs the same ones.
  if (!canBrowse) {
    return (
      <Container maxWidth="sm">
        <HeaderMeta title={`${i18n.t('settings:cTitle')} - ${SITE_NAME}`} />
        <Typography variant="h6" gutterBottom>
          {i18n.t('settings:restricted.cTitle')}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {i18n.t('settings:restricted.cDescription')}
        </Typography>
      </Container>
    );
  }

  return (
    <>
      <HeaderMeta title={`${i18n.t('settings:cTitle')} - ${SITE_NAME}`} />
      {/* The header and the tabs share a card; the panels stack below it.
          Putting the panels inside too would draw a card border around a
          column of card borders — every tab renders its own cards — which
          is the same nesting ActorSetting avoids by being a header only.

          The tabs sat in a sticky AppBar before, with nothing naming the
          page: a bar of two labels and no title, which is what sent
          anybody landing on /settings looking for context. Stickiness is
          what the card costs, and it buys little across two tabs — the
          actor settings page has never had it either. */}
      <Box mb={2}>
        <Card variant="outlined">
          <CardHeader
            avatar={
              <Avatar>
                <SettingsIcon />
              </Avatar>
            }
            titleTypographyProps={{ variant: 'h5' }}
            title={i18n.t('settings:cTitle')}
            subheader={i18n.t('settings:cDescription')}
          />
          <Divider />
          <Tabs
            variant="scrollable"
            scrollButtons="on"
            value={tab}
            onChange={(event, newTab) => {
              setTab(newTab);
            }}
            aria-label={i18n.t('settings:cTitle')}
          >
            {TAB_ORDER.map((value) => {
              return (
                <Tab
                  key={value}
                  value={value}
                  label={i18n.t(`settings:${value}.mTitle`)}
                />
              );
            })}
          </Tabs>
        </Card>
      </Box>
      {tab === TABS.OAUTH_CLIENTS &&
        <SettingsOAuthClients />}
      {tab === TABS.OAUTH_SIGNING_KEYS &&
        <SettingsOAuthSigningKeys />}
    </>
  );
};

Settings.propTypes = {
  viewer: PersonType.isRequired,
};

const mapStateToProps = (state) => {
  const { viewer } = state.session;
  return { viewer };
};

export default connect(
  mapStateToProps,
)(Settings);
