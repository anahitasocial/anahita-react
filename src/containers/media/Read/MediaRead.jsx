import React from 'react';
import PropTypes from 'prop-types';

import PersonType from '../../../proptypes/Person';
import MediumType from '../../../proptypes/Medium';

import Article from './Article';
import Default from './Default';
import CommentStats from '../../../components/CommentStats';
import HeaderMeta from '../../../components/HeaderMeta';
import Likes from '../../likes';
import LocationsGadget from '../../locations/Gadget';
import MediumComments from '../../comments/Browse';
import Cover from '../../cover';
import ControlDownload from '../../controls/medium/Download';
import MediumMenu from '../MediaMenu';
import MediumForm from '../EditForm';

import utils from '../../../utils';

const { getPortraitURL, getCoverURL } = utils.node;

const MediaReadView = ({
  medium,
  current,
  namespace,
  viewer,
  isAuthenticated,
  isEditing,
  isFetching,
  fields,
  Like,
  Access,
  canEdit,
  handleView,
  handleEdit,
  handleCancel,
  handleOnChange,
  handleOnSubmit,
}) => {
  const portrait = getPortraitURL(medium, 'large');
  const cover = getCoverURL(medium, 'large');
  const canAddComment = isAuthenticated && medium.commentStatus;

  const mediumProps = {
    medium,
    handleView: portrait ? handleView : null,
    access: canEdit && medium.access && <Access medium={medium} size="small" />,
    editing: isEditing,
    cover: (
      <Cover
        node={medium}
        canEdit={canEdit}
      />
    ),
    form: (
      <MediumForm
        medium={current}
        fields={fields}
        handleOnChange={handleOnChange}
        handleOnSubmit={handleOnSubmit}
        handleCancel={handleCancel}
        isFetching={isFetching}
      />
    ),
    menu: isAuthenticated && (
      <MediumMenu
        medium={medium}
        viewer={viewer}
        handleEdit={handleEdit}
      />
    ),
    actions: [
      isAuthenticated && <Like node={medium} key={`medium-like-${medium.id}`} />,
      namespace === 'documents' && (
        <ControlDownload
          node={medium}
          key={`medium-download-${medium.id}`}
        />
      ),
    ],
    stats: (
      <>
        <Likes node={medium} />
        <CommentStats node={medium} />
      </>
    ),
    comments: (
      <MediumComments
        parent={medium}
        canAdd={canAddComment}
      />
    ),
    locations: (
      <LocationsGadget
        node={medium}
        viewer={viewer}
      />
    ),
  };

  return (
    <>
      <HeaderMeta
        title={medium.name || medium.body}
        description={medium.body}
        image={portrait || cover}
      />
      {medium.type === 'node.medium.article-service.article.v1'
        ? <Article {...mediumProps} />
        : <Default {...mediumProps} />}
    </>
  );
};

MediaReadView.propTypes = {
  medium: MediumType.isRequired,
  current: PropTypes.object.isRequired,
  namespace: PropTypes.string.isRequired,
  viewer: PersonType.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  fields: PropTypes.object.isRequired,
  Like: PropTypes.elementType.isRequired,
  Access: PropTypes.elementType.isRequired,
  canEdit: PropTypes.bool.isRequired,
  handleView: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleOnChange: PropTypes.func.isRequired,
  handleOnSubmit: PropTypes.func.isRequired,
};

export default MediaReadView;
