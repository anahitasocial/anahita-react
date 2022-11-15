import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import actions from '../../../actions';
import utils from '../../../utils';

import AcctorType from '../../../proptypes/Actor';
import PersonType from '../../../proptypes/Person';
import MediumDefault from '../../../proptypes/MediumDefault';
import i18n from '../../../languages';

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
  const [medium, setMedium] = useState({ ...MediumDefault });
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (error) {
      alertError(i18n.t('prompts:posted.error'));
    }

    if (success) {
      alertSuccess(i18n.t('prompts:posted.success'));
    }
  }, [error, success]);

  const handleOnChange = (event) => {
    const { target } = event;
    const {
      name,
      value,
      type,
      checked,
    } = target;
    const { form } = utils;

    if (type === 'checkbox') {
      medium[name] = checked;
    } else {
      medium[name] = value;
    }

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

    setFields({ ...newFields });

    if (form.isValid(newFields)) {
      const formData = {
        ...form.fieldsToData(fields),
        file,
      };

      addItem({
        ...formData,
        composed: 1,
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
      namespace={namespace}
    />
  );
};

MediaComposerDefault.propTypes = {
  addItem: PropTypes.func.isRequired,
  alertSuccess: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  owner: AcctorType.isRequired,
  viewer: PersonType.isRequired,
  formComponent: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]).isRequired,
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

const mapStateToProps = (namespace) => {
  return (state) => {
    const {
      success,
      error,
      isFetching,
    } = state[namespace];

    const { viewer } = state.session;

    return {
      viewer,
      error,
      success,
      isFetching,
      namespace,
    };
  };
};

const mapDispatchToProps = (namespace) => {
  return (dispatch) => {
    return {
      addItem: (medium, owner) => {
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
};

export default (namespace) => {
  return connect(
    mapStateToProps(namespace),
    mapDispatchToProps(namespace),
  )(MediaComposerDefault);
};
