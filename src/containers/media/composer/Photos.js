import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from '../../../actions';
import form from '../../../utils/form';

import FileForm from '../../../components/composers/File';
import AcctorType from '../../../proptypes/Actor';
import PersonType from '../../../proptypes/Person';
import MediumDefault from '../../../proptypes/MediumDefault';

const formFields = form.createFormFields([
  'body',
]);

const supportedMimetypes = [
  'image/jpeg',
  'image/png',
];

const MediaComposerPhotos = (props) => {
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

    const { target } = event;
    const newFields = form.validateForm(target, fields);

    if (form.isValid(newFields)) {
      const formData = {
        ...form.fieldsToData(fields),
        file,
      };

      addItem({
        composed: 1,
        ...formData,
      }, owner).then(() => {
        setMedium({
          ...medium,
          body: '',
        });
        setFile(null);
        setFields({ ...formFields });
      });
    }
  };

  return (
    <FileForm
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

MediaComposerPhotos.propTypes = {
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
  } = state.photos;

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
      return dispatch(actions.photos.add(medium, owner));
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
)(MediaComposerPhotos);
