import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Box from '@material-ui/core/Box';

import PeopleIcon from '@material-ui/icons/People';

import ActorsBrowse from '../../actors/Browse';
import BrowseHeader from '../../../components/BrowseHeader';

import i18n from '../../../languages';
import permissions from '../../../permissions';
import PersonType from '../../../proptypes/Person';

const Browse = ActorsBrowse('people');

// People browse.
//
// The + goes to /invites rather than to an add form, because people are not
// created here — they arrive by invitation or by signing up. Sending somebody
// to the invite screen is the nearest true thing the button can do.
//
// Gated on the same question the left menu and the invites page ask: whether
// this site is issuing invitations at all, and whether the viewer's role
// clears the level it requires. Both are server settings arriving through
// NodeInfo, so the viewer alone cannot answer it.
const People = ({ viewer, inviteSettings }) => {
  const canInvite = permissions.invite.canAdd(viewer, inviteSettings);

  return (
    <>
      <Box mb={2}>
        <BrowseHeader
          icon={<PeopleIcon />}
          title={i18n.t('people:cTitle')}
          actionTo={canInvite ? '/invites' : ''}
          actionLabel={i18n.t('invites:form.cTitle')}
        />
      </Box>
      <Browse />
    </>
  );
};

People.propTypes = {
  viewer: PersonType.isRequired,
  inviteSettings: PropTypes.object,
};

const mapStateToProps = (state) => {
  const { viewer } = state.session;
  const { nodeInfo } = state.app;

  return {
    viewer,
    // Empty until NodeInfo answers, which the permission treats as the closed
    // answer — the + appears once the document arrives, rather than flashing
    // for viewers who turn out not to qualify.
    inviteSettings: (nodeInfo && nodeInfo.metadata) || {},
  };
};

export default connect(
  mapStateToProps,
)(People);
