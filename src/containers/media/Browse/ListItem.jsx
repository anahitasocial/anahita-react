import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CommentStats from '../../../components/comment/Stats';
import LikeAction from '../../likes/actions/Like';
import LikesStats from '../../likes';
import MediumCard from '../../../components/cards/Medium';
import EditAccessAction from '../../actions/medium/Access';

import PersonType from '../../../proptypes/Person';
import MediumType from '../../../proptypes/Medium';

import MediumMenu from '../MediaMenu';
import utils from '../../../utils';
import perms from '../../../permissions';

const { getNamespace } = utils.node;

const MediaListItem = ({
  medium,
  viewer,
  isAuthenticated,
  handleView = null,
}) => {
  const namespace = getNamespace(medium);

  const Like = useMemo(() => {
    return LikeAction(namespace);
  }, [namespace]);

  const Access = useMemo(() => {
    return EditAccessAction(namespace);
  }, [namespace]);

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
      access={canEditMedium && medium.access && <Access medium={medium} size="small" />}
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

MediaListItem.propTypes = {
  medium: MediumType.isRequired,
  viewer: PersonType.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  handleView: PropTypes.func,
};

const mapStateToProps = (state) => {
  const { viewer, isAuthenticated } = state.session;

  return {
    viewer,
    isAuthenticated,
  };
};

export default connect(mapStateToProps)(MediaListItem);
