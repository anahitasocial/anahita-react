import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from '../../../actions';
import form from '../../../utils/form';

import TopicForm from '../../../components/composers/Topic';
import AcctorType from '../../../proptypes/Actor';
import PersonType from '../../../proptypes/Person';
import MediumDefault from '../../../proptypes/MediumDefault';

const formFields = form.createFormFields([
  'name',
  'body',
]);

const MediaComposerTopics = (props) => {
  const {
    owner,
    viewer,
    addItem,
    success,
    error,
    isFetching,
    alertError,
    alertSuccess,
  } = props;

  const [fields, setFields] = useState(formFields);
  const [medium, setMedium] = useState(MediumDefault);

  useEffect(() => {
    if (error) {
      alertError('Something went wrong!');
    }

    if (success) {
      alertSuccess('Item posted successfully!');
    }
  }, [error, success]);

  const handleOnChange = (event) => {
    const { target } = event;
    const { name, value } = target;

    medium[name] = value;

    const newFields = form.validateField(target, fields);

    setMedium({ ...medium });
    setFields({ ...newFields });
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    const { target } = event;
    const newFields = form.validateForm(target, fields);

    if (form.isValid(newFields)) {
      const formData = {
        ...form.fieldsToData(fields),
      };

      addItem({
        composed: 1,
        ...formData,
      }, owner).then(() => {
        setMedium({
          ...medium,
          body: '',
        });
        setFields({ ...formFields });
      });
    }
  };

  return (
    <TopicForm
      owner={owner}
      viewer={viewer}
      medium={medium}
      fields={fields}
      handleOnChange={handleOnChange}
      handleOnSubmit={handleOnSubmit}
      isFetching={isFetching}
    />
  );
};

MediaComposerTopics.propTypes = {
  addItem: PropTypes.func.isRequired,
  alertSuccess: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  owner: AcctorType.isRequired,
  viewer: PersonType.isRequired,
  success: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  const {
    success,
    error,
    isFetching,
  } = state.topics;

  const { viewer } = state.session;

  return {
    viewer,
    error,
    success,
    isFetching,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addItem: (medium, owner) => {
      return dispatch(actions.topics.add(medium, owner));
    },
    alertSuccess: (message) => {
      return dispatch(actions.app.alert.success(message));
    },
    alertError: (message) => {
      return dispatch(actions.app.alert.error(message));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MediaComposerTopics);
