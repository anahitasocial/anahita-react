import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import actions from '../../actions/auth';
import * as validate from '../../containers/people/validate';

class TextFieldUsername extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initValue: props.value,
      error: false,
      helperText: '',
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { usernameAvailable } = nextProps;

    this.setState({
      error: !usernameAvailable,
      helperText: usernameAvailable ? 'Good username!' : 'Username already taken!',
    });
  }

  handleFieldChange(event) {
    const { value } = event.target;
    const { isUsernameTaken, onChange } = this.props;

    if (validate.username(value) && this.state.initValue !== value) {
      isUsernameTaken(value);
    }

    onChange(event);
  }

  render() {
    const {
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
        error={this.props.error || error}
        helperText={this.props.helperText || helperText}
        fullWidth
        margin="normal"
        disabled={disabled}
      />
    );
  }
}

TextFieldUsername.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  isUsernameTaken: PropTypes.func.isRequired,
  usernameAvailable: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
};

TextFieldUsername.defaultProps = {
  value: '',
  disabled: false,
  usernameAvailable: false,
  error: false,
  helperText: '',
};

const mapStateToProps = (state) => {
  const {
    usernameAvailable,
  } = state.auth;

  return {
    usernameAvailable,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    isUsernameTaken: (username) => {
      dispatch(actions.validateUsername(username));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TextFieldUsername);
