import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import striptags from 'striptags';

import PersonType from '../../proptypes/Person';
import MediaType from '../../proptypes/Media';
import MediumComments from '../comments/Browse';
import Progress from '../../components/Progress';
import LocationsGadget from '../locations/Gadget';

import MediumMenu from './Menu';
import Medium from '../../components/medium/Read';
import MediumForm from '../../components/medium/forms/Edit';
import Likes from '../likes';
import LikeAction from '../likes/actions/Like';
import CommentStats from '../../components/comment/Stats';

import * as actions from '../../actions';
import utils from '../../utils';
import i18n from '../../languages';

const {
  isLikeable,
  isCommentable,
} = utils.node;

const MediaRead = (props) => {
  const {
    numOfComments,
    namespace,
    readItem,
    editItem,
    deleteItem,
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
  const [redirect, setRedirect] = useState('');
  const [fields, setFields] = useState(formFields);

  useEffect(() => {
    readItem(id, namespace);
    setAppTitle(i18n.t(`${namespace}:cTitle`));
  }, [readItem, id, namespace, setAppTitle]);

  useEffect(() => {
    if (error) {
      alertError('Something went wrong!');
    }

    if (success) {
      alertSuccess('Updated successfully.');
    }
  }, [alertError, alertSuccess, error, success]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    const ownerURL = utils.node.getURL(medium.owner);
    deleteItem(medium).then(() => {
      setRedirect(ownerURL);
    });
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

  if (redirect) {
    return (
      <Redirect push to={redirect} />
    );
  }

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
  }

  const canAddComment = isAuthenticated && medium.openToComment;
  const Like = LikeAction(medium.objectType.split('.')[1]);

  return (
    <React.Fragment>
      <Helmet>
        <title>
          {medium.name || striptags(medium.body).substring(0, 60)}
        </title>
        <meta name="description" content={striptags(medium.body)} />
      </Helmet>
      {medium.id &&
        <Medium
          medium={medium}
          editing={isEditing}
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
              handleDelete={handleDelete}
            />
          }
          actions={isAuthenticated &&
            <Like node={medium} />
          }
          stats={
            <React.Fragment>
              {isLikeable(medium) &&
                <Likes node={medium} />
              }
              {isCommentable(medium) &&
                <CommentStats
                  node={{
                    ...medium,
                    numOfComments,
                  }}
                />
              }
            </React.Fragment>
          }
          comments={isCommentable(medium) &&
            <MediumComments
              parent={medium}
              canAdd={canAddComment}
            />
          }
          locations={
            <LocationsGadget node={medium} />
          }
        />
      }
    </React.Fragment>
  );
};

MediaRead.propTypes = {
  readItem: PropTypes.func.isRequired,
  editItem: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
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
      deleteItem: (node) => {
        return dispatch(actions[namespace].deleteItem(node));
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
