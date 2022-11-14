import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import Typography from '@material-ui/core/Typography';
import ActorInfoForm from '../../components/actor/forms/Info';
import actions from '../../actions';
import utils from '../../utils';
import i18n from '../../languages';

import ActorsType from '../../proptypes/Actors';

const { form } = utils;
const {
  getURL,
  getActorInitials,
} = utils.node;

const formFields = form.createFormFields([
  'name',
  'body',
  'website',
  'contact_url',
  'phone',
]);

const ActorsAdd = (props) => {
  const {
    addItem,
    alertError,
    alertSuccess,
    items: {
      current: actor,
    },
    namespace,
    isFetching,
    success,
    error,
  } = props;

  const [fields, setFields] = useState(formFields);

  useEffect(() => {
    if (error) {
      alertError(i18n.t('prompts:updated.error'));
    }

    if (success) {
      alertSuccess(i18n.t('prompts:updated.success'));
    }
  }, [error, success]);

  const handleOnChange = (event) => {
    const { target } = event;
    const { name, value } = target;

    actor[name] = value;

    const newFields = form.validateField(target, fields);

    setFields({ ...newFields });
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    const { target } = event;
    const newFields = form.validateForm(target, fields);

    if (form.isValid(newFields)) {
      const formData = form.fieldsToData(newFields);
      addItem(formData);
    }

    setFields({ ...newFields });
  };

  if (success && actor.id) {
    return (
      <Redirect to={getURL(actor)} />
    );
  }

  return (
    <Card>
      <CardHeader
        title={
          <Typography
            variant="h3"
            style={{
              fontSize: 24,
            }}
          >
            {actor.name || i18n.t(`${namespace}:add.cTitle`)}
          </Typography>
        }
        avatar={
          <Avatar
            aria-label={actor.name}
            alt={actor.name}
          >
            {actor.name ? getActorInitials(actor) : <GroupAddIcon />}
          </Avatar>
        }
      />
      <ActorInfoForm
        actor={actor}
        fields={fields}
        handleOnChange={handleOnChange}
        handleOnSubmit={handleOnSubmit}
        isFetching={isFetching}
        dismissPath={`/${namespace}/`}
      />
    </Card>
  );
};

ActorsAdd.propTypes = {
  addItem: PropTypes.func.isRequired,
  alertSuccess: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  items: ActorsType.isRequired,
  namespace: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  success: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
};

const mapStateToProps = (namespace) => {
  return (state) => {
    const {
      isFetching,
      success,
      error,
    } = state[namespace];

    return {
      items: state[namespace][namespace],
      namespace,
      isFetching,
      success,
      error,
    };
  };
};

const mapDispatchToProps = (namespace) => {
  return (dispatch) => {
    return {
      addItem: (node) => {
        return dispatch(actions[namespace].add(node));
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
  )(ActorsAdd);
};
