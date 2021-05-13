import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from '../../../actions';
import utils from '../../../utils';

import AcctorType from '../../../proptypes/Actor';
import PersonType from '../../../proptypes/Person';
import MediumDefault from '../../../proptypes/MediumDefault';

const MediaComposerDefault = (props) => {
  const {
    owner,
    viewer,
    addItem,
    success,
    error,
    isFetching,
    alertError,
    alertSuccess,
    formComponent: FormComponent,
    formFields,
    supportedMimetypes,
    namespace,
  } = props;

  const [fields, setFields] = useState(formFields);
  const [medium, setMedium] = useState(MediumDefault);
  const [file, setFile] = useState(null);

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
    const { form } = utils;

    medium[name] = value;

    const newFields = form.validateField(target, fields);

    setMedium({ ...medium });
    setFields({ ...newFields });
  };

  const handleOnFileSelect = (newFile) => {
    setFile(newFile);
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();
    const { form } = utils;

    const { target } = event;
    const newFields = form.validateForm(target, fields);

    if (form.isValid(newFields)) {
      const formData = {
        ...form.fieldsToData(fields),
        file,
      };

      addItem({
        ...formData,
        composed: 1,
      }, namespace, owner).then(() => {
        setMedium({
          ...medium,
          name: '',
          body: '',
        });
        setFile(null);
        setFields({ ...formFields });
      });
    }
  };

  return (
    <FormComponent
      owner={owner}
      viewer={viewer}
      medium={medium}
      fields={fields}
      handleOnChange={handleOnChange}
      handleOnFileSelect={handleOnFileSelect}
      handleOnSubmit={handleOnSubmit}
      isFetching={isFetching}
      supportedMimetypes={supportedMimetypes}
      success={success}
      file={file}
    />
  );
};

MediaComposerDefault.propTypes = {
  addItem: PropTypes.func.isRequired,
  alertSuccess: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  owner: AcctorType.isRequired,
  viewer: PersonType.isRequired,
  formComponent: PropTypes.func.isRequired,
  formFields: PropTypes.objectOf(PropTypes.any).isRequired,
  supportedMimetypes: PropTypes.arrayOf(PropTypes.string),
  success: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  namespace: PropTypes.string.isRequired,
};

MediaComposerDefault.defaultProps = {
  supportedMimetypes: [],
};

const mapStateToProps = (state) => {
  const {
    success,
    error,
    isFetching,
  } = state.documents;

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
    addItem: (medium, namespace, owner) => {
      return dispatch(actions[namespace].add(medium, owner));
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
)(MediaComposerDefault);
