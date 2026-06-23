import React from 'react';
import PropTypes from 'prop-types';

import PersonType from '../../../proptypes/Person';
import MediumType from '../../../proptypes/Medium';

import CommentStats from '../../../components/comment/Stats';
import HeaderMeta from '../../../components/HeaderMeta';
import Likes from '../../likes';
import LocationsGadget from '../../locations/Gadget';
import MediumComments from '../../comments/Browse';
import Cover from '../../cover';
import DownloadAction from '../../actions/medium/Download';
import MediumMenu from '../MediaMenu';
import Medium from '../../../components/medium/Read';
import MediumForm from '../../../components/medium/forms/Edit';

import utils from '../../../utils';

const { getPortraitURL, getCoverURL } = utils.node;

const MediaReadView = ({
  medium,
  namespace,
  viewer,
  isAuthenticated,
  isEditing,
  isFetching,
  fields,
  Like,
  Access,
  canEdit,
  handleEdit,
  handleCancel,
  handleOnChange,
  handleOnSubmit,
}) => {
  const portrait = getPortraitURL(medium, 'large');
  const cover = getCoverURL(medium, 'large');
  const canAddComment = isAuthenticated && medium.commentStatus;

  return (
    <>
      <HeaderMeta
        title={medium.name || medium.body}
        description={medium.body}
        image={portrait || cover}
      />
      <Medium
        medium={medium}
        access={canEdit && medium.access && <Access medium={medium} size="small" />}
        editing={isEditing}
        cover={
          <Cover
            node={medium}
            canEdit={canEdit}
          />
        }
        form={
          <MediumForm
            medium={medium}
            fields={fields}
            handleOnChange={handleOnChange}
            handleOnSubmit={handleOnSubmit}
            handleCancel={handleCancel}
            isFetching={isFetching}
          />
        }
        menu={isAuthenticated &&
          <MediumMenu
            medium={medium}
            viewer={viewer}
            handleEdit={handleEdit}
          />}
        actions={[
          isAuthenticated && <Like node={medium} key={`medium-like-${medium.id}`} />,
          namespace === 'documents' && (
            <DownloadAction
              node={medium}
              key={`medium-download-${medium.id}`}
            />
          ),
        ]}
        stats={
          <>
            <Likes node={medium} />
            <CommentStats node={medium} />
          </>
        }
        comments={
          <MediumComments
            parent={medium}
            canAdd={canAddComment}
          />
        }
        locations={
          <LocationsGadget
            node={medium}
            viewer={viewer}
          />
        }
      />
    </>
  );
};

MediaReadView.propTypes = {
  medium: MediumType.isRequired,
  namespace: PropTypes.string.isRequired,
  viewer: PersonType.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  fields: PropTypes.object.isRequired,
  Like: PropTypes.elementType.isRequired,
  Access: PropTypes.elementType.isRequired,
  canEdit: PropTypes.bool.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleOnChange: PropTypes.func.isRequired,
  handleOnSubmit: PropTypes.func.isRequired,
};

export default MediaReadView;
