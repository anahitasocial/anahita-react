import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import * as actions from '../../actions';
import * as validate from '../../containers/people/validate';

class TextFieldEmail extends React.Component {
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
    const { isEmail, isFetching, error } = nextProps;
    const helperText = isEmail ? 'Good email!' : 'Email already taken!';

    return {
      isFetching,
      helperText,
      error,
    };
  }

  handleFieldChange(event) {
    const { value } = event.target;
    const { isEmailAvailable, onChange } = this.props;

    if (value !== '' && validate.email(value)) {
      isEmailAvailable(value);
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
        name="email"
        value={value}
        onChange={this.handleFieldChange}
        label="Email"
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

TextFieldEmail.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  isEmail: PropTypes.bool.isRequired,
  isEmailAvailable: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  helperText: PropTypes.string.isRequired,
  error: PropTypes.bool.isRequired,
};

TextFieldEmail.defaultProps = {
  value: '',
  disabled: false,
};

const mapStateToProps = (state) => {
  const {
    isEmail,
    isFetching,
  } = state.is;

  return {
    isEmail,
    isFetching,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    isEmailAvailable: (email) => {
      dispatch(actions.is.email(email));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TextFieldEmail);
