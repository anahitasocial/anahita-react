import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from '../../../actions';
import form from '../../../utils/form';

import FileForm from '../../../components/composers/File';
import AcctorType from '../../../proptypes/Actor';
import PersonType from '../../../proptypes/Person';
import MediumDefault from '../../../proptypes/MediumDefault';

const formFields = form.createFormFields([
  'name',
  'body',
]);

const supportedMimetypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const MediaComposerDocuments = (props) => {
  const {
    owner,
    viewer,
    addItem,
    success,
    error,
    isFetching,
  } = props;

  const [fields, setFields] = useState(formFields);
  const [medium, setMedium] = useState(MediumDefault);
  const [file, setFile] = useState(null);

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
          name: '',
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

MediaComposerDocuments.propTypes = {
  addItem: PropTypes.func.isRequired,
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
    addItem: (medium, owner) => {
      return dispatch(actions.documents.add(medium, owner));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MediaComposerDocuments);
