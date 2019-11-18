import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import * as actions from '../../actions';
import * as validate from '../../containers/people/validate';

class TextFieldUsername extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetching: false,
      error: false,
      helperText: props.helperText,
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  static getDerivedStateFromProps(nextProps) {
    const {
      isUsername,
      isFetching,
      error,
      value,
    } = nextProps;

    let helperText = '';

    if (value) {
      helperText = isUsername ? 'Good username!' : 'Username already taken!';
    }

    return {
      isFetching,
      helperText,
      error,
    };
  }

  handleFieldChange(event) {
    const { value } = event.target;
    const { isUsernameAvailable, onChange } = this.props;

    if (value !== '' && validate.username(value)) {
      isUsernameAvailable(value);
    }

    onChange(event);
  }

  render() {
    const {
      isFetching,
      error,
      helperText,
    } = this.state;

    const {
      value,
      disabled,
    } = this.props;

    return (
      <TextField
        name="username"
        value={value}
        onChange={this.handleFieldChange}
        label="Username"
        error={error}
        helperText={helperText}
        fullWidth
        margin="normal"
        disabled={disabled}
        autoComplete="off"
      />
    );
  }
}

TextFieldUsername.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  isUsername: PropTypes.bool.isRequired,
  isUsernameAvailable: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  helperText: PropTypes.string.isRequired,
  error: PropTypes.bool.isRequired,
};

TextFieldUsername.defaultProps = {
  value: '',
  disabled: false,
};

const mapStateToProps = (state) => {
  const {
    isUsername,
    isFetching,
  } = state.is;

  return {
    isUsername,
    isFetching,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    isUsernameAvailable: (username) => {
      dispatch(actions.is.username(username));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TextFieldUsername);
