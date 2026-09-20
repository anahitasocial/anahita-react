import React from 'react';
import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Chip from '@material-ui/core/Chip';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import AboutIcon from '@material-ui/icons/Info';

import i18n from '../../languages';
import NodeInfoType from '../../proptypes/NodeInfo';
import packageInfo from '../../../package.json';

const useStyles = makeStyles((theme) => {
  return {
    container: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(4),
    },
    mono: {
      fontFamily: 'monospace',
    },
    chip: {
      marginRight: theme.spacing(0.5),
    },
  };
});

// The two halves of the installation, named rather than translated:
// they are product names, and "Anahita Web" is "Anahita Web" in every
// language. Kept out of the language files for that reason, and kept
// out of NodeInfo's software.name, which is lowercase "anahita" by
// crawler convention and describes the platform rather than either
// half of it.
const SERVER_NAME = 'Anahita Services';
const CLIENT_NAME = 'Anahita Web';

// npm's repository field is an object in this package.json and a bare
// string in plenty of others, so read both shapes rather than assume.
// Empty when the field is absent, which the row renders as a dash.
const clientRepository = (() => {
  const { repository } = packageInfo;

  if (!repository) {
    return '';
  }

  return typeof repository === 'string' ? repository : repository.url || '';
})();

// A count of nothing is still an answer. `value || '—'` turns a real
// zero into a dash, which reads as "not reported" — a site with no
// posts yet would look broken rather than new.
const count = (value) => {
  return typeof value === 'number' ? value.toLocaleString() : '—';
};

const text = (value) => {
  return value || '—';
};

const SettingsAbout = ({
  nodeInfo = null,
  failed = false,
}) => {
  const classes = useStyles();

  if (failed || !nodeInfo) {
    return (
      <Container maxWidth="sm" className={classes.container}>
        <Typography variant="body2" color="textSecondary">
          {i18n.t('about:unavailable')}
        </Typography>
      </Container>
    );
  }

  const {
    software = {},
    usage = {},
    metadata = {},
    openRegistrations = false,
  } = nodeInfo;

  const { users = {} } = usage;

  return (
    <Container maxWidth="md" className={classes.container}>
      <Card variant="outlined">
        {/* Titled with the instance name and subtitled with the
            operator's own description — the pair those two NodeInfo
            values make, and what another server reads about this one.
            The static line is the fallback rather than the preference:
            it describes the tab, which is less useful than describing
            the site. */}
        <CardHeader
          avatar={
            <Avatar>
              <AboutIcon />
            </Avatar>
          }
          title={
            <Typography variant="h6">
              {text(metadata.nodeName)}
            </Typography>
          }
          subheader={metadata.nodeDescription || i18n.t('about:cDescription')}
        />

        {/* Two sections rather than one "Software" list, so the labels
            can be bare. Prefixing every row — Server name, Client name,
            Client licence — repeats in each row what the heading can
            say once, and it reads worst exactly where it matters most:
            on a narrow screen, where the prefix pushes the value onto a
            second line.

            The split also makes the asymmetry legible rather than
            puzzling. The client knows everything about itself from
            package.json; the server is only as detailed as what it
            chooses to publish through NodeInfo, which is a name and a
            repository. Grouped, that reads as two different sources.
            Interleaved, it read as missing rows. */}
        <List
          subheader={
            <ListSubheader disableSticky>
              {i18n.t('about:server.mTitle')}
            </ListSubheader>
          }
        >
          <ListItem divider>
            <ListItemText
              primary={i18n.t('about:fields.name')}
              secondary={SERVER_NAME}
            />
          </ListItem>
          {/* No version row, and no licence row.

              The version exists — node_info.go publishes one — but it
              is a hardcoded constant with no release pipeline behind
              it, so on the page an operator opens to find out what is
              deployed it would read the same after every deploy and
              invite them to trust it. NodeInfo keeps publishing it for
              crawlers counting the network, who are asking a different
              question.

              The licence is simply not published. Hard-coding it here
              would mean the client asserting something about the
              server that goes stale the day it changes. */}
          <ListItem>
            <ListItemText
              primary={i18n.t('about:fields.repository')}
              secondary={software.repository ?
                <Link
                  href={software.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {software.repository}
                </Link> :
                '—'}
            />
          </ListItem>
        </List>

        <Divider />

        <List
          subheader={
            <ListSubheader disableSticky>
              {i18n.t('about:client.mTitle')}
            </ListSubheader>
          }
        >
          <ListItem divider>
            <ListItemText
              primary={i18n.t('about:fields.name')}
              secondary={CLIENT_NAME}
            />
          </ListItem>
          {/* Real, unlike the server's: a person bumps package.json and
              the bundle is rebuilt from it, so this identifies what is
              actually loaded in the browser reading it. It is also the
              one fact on this page the server cannot report. */}
          <ListItem divider>
            <ListItemText
              primary={i18n.t('about:fields.version')}
              secondary={`v${packageInfo.version}`}
            />
          </ListItem>
          <ListItem divider>
            <ListItemText
              primary={i18n.t('about:fields.license')}
              secondary={packageInfo.license}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={i18n.t('about:fields.repository')}
              secondary={clientRepository ?
                <Link
                  href={clientRepository}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {clientRepository}
                </Link> :
                '—'}
            />
          </ListItem>
        </List>

        <Divider />

        <List
          subheader={
            <ListSubheader disableSticky>
              {i18n.t('about:usage.mTitle')}
            </ListSubheader>
          }
        >
          <ListItem divider>
            <ListItemText
              primary={i18n.t('about:usage.people')}
              secondary={count(users.total)}
            />
          </ListItem>
          <ListItem divider>
            <ListItemText
              primary={i18n.t('about:usage.activeMonth')}
              secondary={count(users.activeMonth)}
            />
          </ListItem>
          <ListItem divider>
            <ListItemText
              primary={i18n.t('about:usage.activeHalfyear')}
              secondary={count(users.activeHalfyear)}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={i18n.t('about:usage.localPosts')}
              secondary={count(usage.localPosts)}
            />
          </ListItem>
        </List>

        <Divider />

        <List
          subheader={
            <ListSubheader disableSticky>
              {i18n.t('about:registration.mTitle')}
            </ListSubheader>
          }
        >
          <ListItem divider>
            <ListItemText
              primary={i18n.t('about:registration.mode')}
              secondary={text(metadata.registrationMode)}
            />
            <Chip
              size="small"
              className={classes.chip}
              label={openRegistrations ?
                i18n.t('about:registration.open') :
                i18n.t('about:registration.closed')}
              color={openRegistrations ? 'primary' : 'default'}
            />
          </ListItem>
          <ListItem divider>
            <ListItemText
              primary={i18n.t('about:registration.approvalRequired')}
              secondary={metadata.approvalRequired ?
                i18n.t('commons:yes') :
                i18n.t('commons:no')}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={i18n.t('about:registration.invitationsAccepted')}
              secondary={metadata.invitationsAccepted ?
                i18n.t('commons:yes') :
                i18n.t('commons:no')}
            />
          </ListItem>
        </List>

        <Divider />

        <List
          subheader={
            <ListSubheader disableSticky>
              {i18n.t('about:contact.mTitle')}
            </ListSubheader>
          }
        >
          <ListItem divider>
            <ListItemText
              primary={i18n.t('about:contact.supportEmail')}
              secondary={text(metadata.supportEmail)}
            />
          </ListItem>
          <ListItem divider>
            <ListItemText
              primary={i18n.t('about:contact.supportPhone')}
              secondary={text(metadata.supportPhone)}
            />
          </ListItem>
          <ListItem divider>
            <ListItemText
              primary={i18n.t('about:contact.termsOfService')}
              secondary={metadata.termsOfServiceUrl ?
                <Link href={metadata.termsOfServiceUrl}>
                  {metadata.termsOfServiceUrl}
                </Link> :
                '—'}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={i18n.t('about:contact.privacyPolicy')}
              secondary={metadata.privacyPolicyUrl ?
                <Link href={metadata.privacyPolicyUrl}>
                  {metadata.privacyPolicyUrl}
                </Link> :
                '—'}
            />
          </ListItem>
        </List>
      </Card>

      {/* Said plainly rather than implied by the absence of edit
          controls. Every value above is either counted from the
          database or set from auth-service's environment, and NodeInfo
          is a read-only published document — there is no endpoint to
          write any of it back. Somebody looking for where to change the
          support address should be told it is a server setting, not
          left hunting for a button. */}
      <Typography
        variant="caption"
        color="textSecondary"
        component="p"
        style={{ marginTop: 16 }}
      >
        {i18n.t('about:readOnly')}
      </Typography>
    </Container>
  );
};

SettingsAbout.propTypes = {
  nodeInfo: NodeInfoType,
  failed: PropTypes.bool,
};

export default SettingsAbout;
