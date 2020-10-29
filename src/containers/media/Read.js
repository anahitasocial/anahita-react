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

import SimpleSnackbar from '../../components/SimpleSnackbar';

import * as actions from '../../actions';
import form from '../../utils/form';
import i18n from '../../languages';

const formFields = form.createFormFields([
  'name',
  'body',
]);

const MediaRead = (props) => {
  const {
    namespace,
    readItem,
    editItem,
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

  const [isEditing, setIsEditing] = useState(false);
  const [fields, setFields] = useState(formFields);

  useEffect(() => {
    readItem(id, namespace);
    setAppTitle(i18n.t(`${namespace}:cTitle`));
  }, []);

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

    const newFields = form.validateField(target, fields);

    setFields({ ...newFields });
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    const { target } = event;
    const newFields = form.validateForm(target, fields);

    if (form.isValid(newFields)) {
      const formData = form.fieldsToData(newFields);
      editItem({
        id: medium.id,
        ...formData,
      }).then(() => {
        handleCancel();
      });
    }

    setFields({ ...newFields });
  };

  const canAddComment = isAuthenticated && medium.openToComment;

  if (isFetching && !medium.id) {
    return (
      <Progress />
    );
  }

  if (!medium.id && error !== '') {
    return (
      <Redirect push to="/404/" />
    );
  }

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
            />
          }
          actions={isAuthenticated &&
            <Like node={medium} />
          }
          stats={
            <React.Fragment>
              <Likes node={medium} />
              <CommentStats node={medium} />
            </React.Fragment>
          }
          comments={
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
      {error &&
        <SimpleSnackbar
          isOpen={Boolean(error)}
          message="Something went wrong!"
          type="error"
        />
      }
      {success &&
        <SimpleSnackbar
          isOpen={Boolean(success)}
          message="Updated successfully!"
          type="success"
        />
      }
    </React.Fragment>
  );
};

MediaRead.propTypes = {
  readItem: PropTypes.func.isRequired,
  editItem: PropTypes.func.isRequired,
  media: MediaType.isRequired,
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

    const { viewer, isAuthenticated } = state.session;

    return {
      media: state[namespace][namespace],
      namespace,
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
    };
  };
};

export default (namespace) => {
  return connect(
    mapStateToProps(namespace),
    mapDispatchToProps(namespace),
  )(MediaRead);
};
