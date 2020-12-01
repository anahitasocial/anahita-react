/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import LocationForm from '../../../components/location/Form';
import * as actions from '../../../actions';
import * as api from '../../../api';
import form from '../../../utils/form';
import NodeType from '../../../proptypes/Node';

const formFields = form.createFormFields([
  'name',
  'address',
  'city',
  'state_province',
  'country',
]);

const LocationsSelectorAdd = (props) => {
  const {
    addTag,
    node,
    name,
    callback,
  } = props;

  formFields.name.value = name;

  const [fields, setFields] = useState(formFields);
  const [isFetching, setIsFetching] = useState(false);

  const handleOnChange = (event) => {
    const { target } = event;
    const newFields = form.validateField(target, fields);

    setFields({ ...newFields });
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    const { target } = event;
    const newFields = form.validateForm(target, fields);

    if (form.isValid(newFields)) {
      const formData = form.fieldsToData(newFields);
      setIsFetching(true);
      api.locations.add(formData).then((result) => {
        const { data: location } = result;
        addTag(node, location).then(() => {
          setIsFetching(true);
          return callback(location);
        }).catch((err) => {
          return console.error(err);
        });
      }).catch((err) => {
        return console.error(err);
      });
    }

    setFields({ ...newFields });
  };

  return (
    <LocationForm
      fields={fields}
      handleOnChange={handleOnChange}
      handleOnSubmit={handleOnSubmit}
      isFetching={isFetching}
    />
  );
};

LocationsSelectorAdd.propTypes = {
  addTag: PropTypes.func.isRequired,
  node: NodeType.isRequired,
  name: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
};

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    addTag: (node, tag) => {
      return dispatch(actions.locationsGraph.add(node)(tag));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LocationsSelectorAdd);
