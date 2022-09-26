import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';

import actions from '../../../actions';
import MediumType from '../../../proptypes/Medium';
import i18n from '../../../languages';

const ActionsMediumNotification = React.forwardRef((props, ref) => {
  const {
    subscribe,
    unsubscribe,
    medium,
    isSubscribed,
    subscribeLabel,
    unsubscribeLabel,
    isFetching,
  } = props;

  const [subscribed, setSubscribed] = useState(isSubscribed);

  const handleSubscribe = () => {
    subscribe(medium).then(() => {
      setSubscribed(true);
    });
  };

  const handleUnsubscribe = () => {
    unsubscribe(medium).then(() => {
      setSubscribed(false);
    });
  };

  const title = subscribed ? unsubscribeLabel : subscribeLabel;
  const onClick = subscribed ? handleUnsubscribe : handleSubscribe;

  return (
    <MenuItem
      onClick={onClick}
      disabled={isFetching}
      ref={ref}
    >
      {title}
    </MenuItem>
  );
});

ActionsMediumNotification.propTypes = {
  subscribe: PropTypes.func.isRequired,
  unsubscribe: PropTypes.func.isRequired,
  medium: MediumType.isRequired,
  isSubscribed: PropTypes.bool,
  subscribeLabel: PropTypes.string,
  unsubscribeLabel: PropTypes.string,
  isFetching: PropTypes.bool.isRequired,
};

ActionsMediumNotification.defaultProps = {
  isSubscribed: false,
  subscribeLabel: i18n.t('actions:subscribe'),
  unsubscribeLabel: i18n.t('actions:unsubscribe'),
};

const mapStateToProps = (state) => {
  const {
    isFetching,
  } = state.notifications;

  return {
    isFetching,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    subscribe: (medium) => {
      return dispatch(actions.notifications.add(medium));
    },
    unsubscribe: (medium) => {
      return dispatch(actions.notifications.deleteItem(medium));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActionsMediumNotification);
