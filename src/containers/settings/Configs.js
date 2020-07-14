/* eslint camelcase: "off" */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import form from '../../utils/form';
import ConfigsType from '../../proptypes/settings/Configs';
import SettingsConfigsForm from '../../components/settings/configs/Form';
import SimpleSnackbar from '../../components/SimpleSnackbar';

const formFields = form.createFormFields([
  'sitename',
  'live_site',
  'log_path',
  'tmp_path',
  'secret',
  'host',
  'db',
  'dbprefix',
  'smtpport',
  'smtpuser',
  'smtppass',
  'smtphost',
]);

const ConfigsAbout = (props) => {
  const {
    readConfigs,
    editConfigs,
    configs,
    success,
    error,
    isFetching,
  } = props;

  const [fields, setFields] = useState(formFields);

  useEffect(() => {
    readConfigs();
  }, []);

  const handleOnChange = (event) => {
    const { target } = event;
    const {
      name,
      value,
      checked,
      type,
    } = target;

    if (type === 'checkbox') {
      configs[name] = Boolean(checked);
    } else {
      configs[name] = value;
    }

    const newFields = form.validateField(target, fields);

    setFields({ ...newFields });
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    const { target } = event;
    const newFields = form.validateForm(target, fields);

    if (form.isValid(newFields)) {
      const {
        sef_rewrite,
        debug,
        smtpauth,
      } = configs;

      const formData = {
        ...form.fieldsToData(newFields),
        sef_rewrite,
        debug,
        smtpauth,
      };

      editConfigs(formData);
    }

    setFields({ ...newFields });
  };

  return (
    <React.Fragment>
      <SettingsConfigsForm
        configs={configs}
        fields={fields}
        handleOnChange={handleOnChange}
        handleOnSubmit={handleOnSubmit}
        isFetching={isFetching}
      />
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
          message="Information Updated!"
          type="success"
        />
      }
    </React.Fragment>
  );
};

ConfigsAbout.propTypes = {
  configs: ConfigsType.isRequired,
  readConfigs: PropTypes.func.isRequired,
  editConfigs: PropTypes.func.isRequired,
  success: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    readConfigs: () => {
      dispatch(actions.settings.configs.read());
    },
    editConfigs: (params) => {
      dispatch(actions.settings.configs.edit(params));
    },
  };
};

const mapStateToProps = (state) => {
  const {
    settings_configs: {
      current: configs,
    },
    isFetching,
    error,
    success,
  } = state.settingsConfigs;

  return {
    configs,
    isFetching,
    error,
    success,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfigsAbout);
