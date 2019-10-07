import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
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

  static getDerivedStateFromProps(nextProps, state) {
    const { isFetching } = nextProps;

    if (isFetching !== state.isFetching) {
      return { isFetching };
    }

    return null;
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
      component,
      subscribeLabel,
      unsubscribeLabel,
    } = this.props;

    const { isSubscribed, isFetching } = this.state;

    const title = isSubscribed ? unsubscribeLabel : subscribeLabel;
    const onClick = isSubscribed ? this.handleUnsubscribe : this.handleSubscribe;
    const color = isSubscribed ? 'inherit' : 'primary';

    if (component === 'menuitem') {
      return (
        <MenuItem
          onClick={onClick}
          disabled={isFetching}
        >
          {title}
        </MenuItem>
      );
    }

    return (
      <Button
        onClick={onClick}
        disabled={isFetching}
        color={color}
      >
        {title}
      </Button>
    );
  }
}

ActionsMediumNotification.propTypes = {
  subscribe: PropTypes.func.isRequired,
  unsubscribe: PropTypes.func.isRequired,
  medium: MediumType.isRequired,
  isSubscribed: PropTypes.bool,
  component: PropTypes.oneOf(['button', 'menuitem']),
  subscribeLabel: PropTypes.string,
  unsubscribeLabel: PropTypes.string,
};

ActionsMediumNotification.defaultProps = {
  component: 'menuitem',
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
