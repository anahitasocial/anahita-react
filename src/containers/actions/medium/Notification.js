import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';

import actions from '../../../actions/notifications';
import MediumType from '../../../proptypes/Medium';
import i18n from '../../../languages';

class ActionsMediumNotification extends React.Component {
  constructor(props) {
    super(props);

    const { isSubscribed } = props;

    this.state = {
      isSubscribed,
      isFetching: false,
    };

    this.handleSubscribe = this.handleSubscribe.bind(this);
    this.handleUnsubscribe = this.handleUnsubscribe.bind(this);
  }

  static getDerivedStateFromProps(nextProps) {
    const { isFetching } = nextProps;
    return { isFetching };
  }

  handleSubscribe(event) {
    event.preventDefault();

    const { medium, subscribe } = this.props;

    subscribe(medium).then(() => {
      this.setState({ isSubscribed: true });
    });
  }

  handleUnsubscribe(event) {
    event.preventDefault();

    const { medium, unsubscribe } = this.props;

    unsubscribe(medium).then(() => {
      this.setState({ isSubscribed: false });
    });
  }

  render() {
    const {
      subscribeLabel,
      unsubscribeLabel,
    } = this.props;

    const { isSubscribed, isFetching } = this.state;

    const title = isSubscribed ? unsubscribeLabel : subscribeLabel;
    const onClick = isSubscribed ? this.handleUnsubscribe : this.handleSubscribe;

    return (
      <MenuItem
        onClick={onClick}
        disabled={isFetching}
      >
        {title}
      </MenuItem>
    );
  }
}

ActionsMediumNotification.propTypes = {
  subscribe: PropTypes.func.isRequired,
  unsubscribe: PropTypes.func.isRequired,
  medium: MediumType.isRequired,
  isSubscribed: PropTypes.bool,
  subscribeLabel: PropTypes.string,
  unsubscribeLabel: PropTypes.string,
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
      return dispatch(actions.add(medium));
    },
    unsubscribe: (medium) => {
      return dispatch(actions.deleteItem(medium));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActionsMediumNotification);
