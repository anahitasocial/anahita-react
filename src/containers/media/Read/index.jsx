import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';

import PersonType from '../../../proptypes/Person';
import MediaType from '../../../proptypes/Media';

import ControlLike from '../../likes/controls/Like';
import ControlEditAccess from '../../controls/medium/Access';
import Progress from '../../../components/Progress';
import MediaReadView from './MediaRead';

import actions from '../../../actions';
import utils from '../../../utils';
import i18n from '../../../languages';
import perms from '../../../permissions';

const MediaRead = ({
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
  media,
}) => {
  const { current: medium } = media;
  const { id } = useParams();

  const formFields = useMemo(() => {
    return utils.form.createFormFields(
      namespace === 'notes' ? ['body'] : ['name', 'body'],
    );
  }, [namespace]);

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
    const { name, value } = event.target;
    const newFields = utils.form.validateField(event.target, fields);
    setFields({ ...newFields, [name]: { ...newFields[name], value } });
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
      return <Progress />;
    }
    if (error !== '') {
      return <Navigate to="/404/" replace />;
    }
    return null;
  }

  const Like = ControlLike(namespace);
  const Access = ControlEditAccess(namespace);
  const canEdit = perms.medium.canEdit(viewer, medium);

  return (
    <MediaReadView
      medium={medium}
      namespace={namespace}
      viewer={viewer}
      isAuthenticated={isAuthenticated}
      isEditing={isEditing}
      isFetching={isFetching}
      fields={fields}
      Like={Like}
      Access={Access}
      canEdit={canEdit}
      handleEdit={handleEdit}
      handleCancel={handleCancel}
      handleOnChange={handleOnChange}
      handleOnSubmit={handleOnSubmit}
    />
  );
};

MediaRead.propTypes = {
  readItem: PropTypes.func.isRequired,
  editItem: PropTypes.func.isRequired,
  alertSuccess: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  media: MediaType.isRequired,
  namespace: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  success: PropTypes.bool.isRequired,
  setAppTitle: PropTypes.func.isRequired,
  viewer: PersonType.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (namespace) => {
  return (state) => {
    const { isFetching, success, error } = state[namespace];
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
      readItem: (slug) => {
        const id = slug.split('-')[0];
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
