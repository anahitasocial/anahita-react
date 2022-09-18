/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';

import LocationForm from '../../../components/location/Form';
import actions from '../../../actions';
import api from '../../../api';
import i18n from '../../../languages';
import form from '../../../utils/form';
import NodeType from '../../../proptypes/Node';
import LocationDefault from '../../../proptypes/LocationDefault';

const fieldNames = ['name', 'address'];

if (!process.env.REACT_APP_LOCATION_FIXED_CITY) {
  fieldNames.push('city');
}

if (!process.env.REACT_APP_LOCATION_FIXED_STATE_PROVINCE) {
  fieldNames.push('state_province');
}

if (!process.env.REACT_APP_LOCATION_FIXED_COUNTRY) {
  fieldNames.push('country');
}

const formFields = form.createFormFields(fieldNames);

const LocationsSelectorAdd = (props) => {
  const {
    addTag,
    node,
    name,
    callback,
  } = props;

  formFields.name.value = name;

  const [fields, setFields] = useState(formFields);
  /* eslint no-unused-vars: "off" */
  const [location, setLocation] = useState({
    ...LocationDefault,
    country: process.env.REACT_APP_LOCATION_FIXED_COUNTRY,
    state_province: process.env.REACT_APP_LOCATION_FIXED_STATE_PROVINCE,
    city: process.env.REACT_APP_LOCATION_FIXED_CITY,
  });
  const [isFetching, setIsFetching] = useState(false);

  const handleOnChange = (event) => {
    const { target } = event;
    const newFields = form.validateField(target, fields);

    location[target.name] = target.value;

    setFields({ ...newFields });
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    const { target } = event;
    const newFields = form.validateForm(target, fields);

    if (form.isValid(newFields)) {
      const formData = form.fieldsToData(newFields);

      formData.city = process.env.REACT_APP_LOCATION_FIXED_CITY || formData.city;

      formData.state_province =
      process.env.REACT_APP_LOCATION_FIXED_STATE_PROVINCE ||
      formData.state_province;

      formData.country = process.env.REACT_APP_LOCATION_FIXED_COUNTRY || formData.country;

      setIsFetching(true);
      api.locations.add(formData).then((result) => {
        addTag(node, result.data).then(() => {
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
    <Card square variant="outlined">
      <LocationForm
        fields={fields}
        location={location}
        handleOnChange={handleOnChange}
        handleOnSubmit={handleOnSubmit}
        isFetching={isFetching}
        actions={
          <Button
            type="submit"
            color="primary"
            disabled={isFetching}
            variant="contained"
            size="small"
            fullWidth
          >
            {i18n.t('actions:add')}
          </Button>
        }
      />
    </Card>
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
