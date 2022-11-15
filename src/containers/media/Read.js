import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import PersonType from '../../proptypes/Person';
import MediaType from '../../proptypes/Media';

import CommentStats from '../../components/comment/Stats';
import DownloadAction from '../actions/medium/Download';
import HeaderMeta from '../../components/HeaderMeta';
import Likes from '../likes';
import LikeAction from '../likes/actions/Like';
import LocationsGadget from '../locations/Gadget';
import MediumComments from '../comments/Browse';
import Cover from '../cover';
import MediumMenu from './Menu';
import Medium from '../../components/medium/Read';
import MediumForm from '../../components/medium/forms/Edit';
import PrivacyAction from '../actions/medium/Privacy';
import Progress from '../../components/Progress';

import actions from '../../actions';
import utils from '../../utils';
import i18n from '../../languages';
import perms from '../../permissions';

const {
  isLikeable,
  isCommentable,
  getPortraitURL,
  getCoverURL,
} = utils.node;

const MediaRead = (props) => {
  const {
    numOfComments,
    namespace,
    readItem,
    editItem,
    alertError,
    alertSuccess,
    setAppTitle,
    isFetching,
    viewer,
    isAuthenticated,
    success,
    error,
    media: {
      current: medium,
    },
    match: {
      params: {
        id,
      },
    },
  } = props;

  let formFields = null;

  if (namespace === 'notes') {
    formFields = utils.form.createFormFields([
      'body',
    ]);
  } else {
    formFields = utils.form.createFormFields([
      'name',
      'body',
    ]);
  }

  const [isEditing, setIsEditing] = useState(false);
  const [fields, setFields] = useState(formFields);

  useEffect(() => {
    readItem(id, namespace);
    setAppTitle(i18n.t(`${namespace}:cTitle`));
  }, [readItem, id, namespace, setAppTitle]);

  useEffect(() => {
    if (error) {
      alertError(i18n.t('prompts:updated.error'));
    }

    if (success) {
      alertSuccess(i18n.t('prompts:updated.success'));
    }
  }, [error, success]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleOnChange = (event) => {
    const { target } = event;
    const { name, value } = target;

    medium[name] = value;

    const newFields = utils.form.validateField(target, fields);

    setFields({ ...newFields });
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    const { target } = event;
    const newFields = utils.form.validateForm(target, fields);

    if (utils.form.isValid(newFields)) {
      const formData = utils.form.fieldsToData(newFields);
      editItem({
        id: medium.id,
        ...formData,
      });
    }

    setFields({ ...newFields });
  };

  if (!medium.id) {
    if (isFetching) {
      return (
        <Progress />
      );
    }

    if (error !== '') {
      return (
        <Redirect push to="/404/" />
      );
    }

    return <></>;
  }

  const canAddComment = isAuthenticated && medium.openToComment;
  const portrait = getPortraitURL(medium, 'large');
  const cover = getCoverURL(medium, 'large');
  const Like = LikeAction(namespace);
  const Privacy = PrivacyAction(namespace);
  const canEdit = perms.medium.canEdit(viewer, medium);

  return (
    <>
      <HeaderMeta
        title={medium.name || medium.body}
        description={medium.body}
        image={portrait || cover}
      />
      {medium.id &&
        <Medium
          medium={medium}
          privacy={canEdit && medium.access && <Privacy medium={medium} size="small" />}
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
          actions={[isAuthenticated && isLikeable(medium) &&
            <Like node={medium} key={`medium-like-${medium.id}`} />,
          namespace === 'documents' &&
            <DownloadAction
              node={medium}
              key={`medium-download-${medium.id}`}
            />,
          ]}
          stats={
            <>
              {isLikeable(medium) && <Likes node={medium} />}
              {isCommentable(medium) &&
                <CommentStats
                  node={{
                    ...medium,
                    numOfComments,
                  }}
                />}
            </>
          }
          comments={isCommentable(medium) &&
            <MediumComments
              parent={medium}
              canAdd={canAddComment}
            />}
          locations={
            <LocationsGadget node={medium} />
          }
        />}
    </>
  );
};

MediaRead.propTypes = {
  readItem: PropTypes.func.isRequired,
  editItem: PropTypes.func.isRequired,
  alertSuccess: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  media: MediaType.isRequired,
  numOfComments: PropTypes.number.isRequired,
  namespace: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  success: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
  setAppTitle: PropTypes.func.isRequired,
  viewer: PersonType.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (namespace) => {
  return (state) => {
    const {
      isFetching,
      success,
      error,
    } = state[namespace];

    const { comments } = state.comments;

    const { viewer, isAuthenticated } = state.session;

    return {
      media: state[namespace][namespace],
      namespace,
      numOfComments: comments.allIds.length,
      success,
      error,
      viewer,
      isAuthenticated,
      isFetching,
    };
  };
};

const mapDispatchToProps = (namespace) => {
  return (dispatch) => {
    return {
      readItem: (id) => {
        return dispatch(actions[namespace].read(id));
      },
      editItem: (node) => {
        return dispatch(actions[namespace].edit(node));
      },
      setAppTitle: (title) => {
        return dispatch(actions.app.setAppTitle(title));
      },
      alertSuccess: (message) => {
        return dispatch(actions.app.alert.success(message));
      },
      alertError: (message) => {
        return dispatch(actions.app.alert.error(message));
      },
    };
  };
};

export default (namespace) => {
  return connect(
    mapStateToProps(namespace),
    mapDispatchToProps(namespace),
  )(MediaRead);
};
