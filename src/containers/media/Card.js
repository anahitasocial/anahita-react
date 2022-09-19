import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CommentStats from '../../components/comment/Stats';
import LikeAction from '../likes/actions/Like';
import LikesStats from '../likes';
import MediumCard from '../../components/cards/Medium';
import PrivacyAction from '../actions/medium/Privacy';

import PersonType from '../../proptypes/Person';
import MediumType from '../../proptypes/Medium';

import MediumMenu from './Menu';
import utils from '../../utils';
import perms from '../../permissions';

const { getNamespace } = utils.node;

const MediaCard = (props) => {
  const {
    medium,
    viewer,
    isAuthenticated,
    handleView,
  } = props;

  const namespace = getNamespace(medium);
  const Like = LikeAction(namespace);
  const Privacy = PrivacyAction(namespace);
  const canEditMedium = perms.medium.canEdit(viewer, medium);

  return (
    <MediumCard
      medium={medium}
      handleView={handleView}
      menu={isAuthenticated &&
        <MediumMenu
          medium={medium}
          viewer={viewer}
          inline
        />}
      privacy={canEditMedium && medium.access && <Privacy medium={medium} size="small" />}
      stats={
        <>
          <LikesStats node={medium} />
          <CommentStats node={medium} />
        </>
      }
      actions={isAuthenticated && <Like node={medium} />}
    />
  );
};

MediaCard.propTypes = {
  medium: MediumType.isRequired,
  viewer: PersonType.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  handleView: PropTypes.func,
};

MediaCard.defaultProps = {
  handleView: null,
};

const mapStateToProps = (state) => {
  const {
    viewer,
    isAuthenticated,
  } = state.session;

  return {
    viewer,
    isAuthenticated,
  };
};

export default connect(mapStateToProps)(MediaCard);
