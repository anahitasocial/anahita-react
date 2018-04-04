import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PasswordResetForm from '../../components/PasswordResetForm';
import { resetPassword } from '../../actions/auth';

class PasswordResetPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      person: {
        email: '',
      },
      hasEmail: true,
    };

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  validate() {
    const { email } = this.state.person;
    this.setState({
      hasEmail: Boolean(email),
    });
    return Boolean(email);
  }

  handleFieldChange(event) {
    const { person } = this.state;
    const { name, value } = event.target;
    person[name] = value;
    this.setState({
      person,
      [`has${name.toUpperCase()}`]: Boolean(value),
    });
  }

  handleFormSubmit(event) {
    event.preventDefault();
    const { person } = this.state;
    if (this.validate()) {
      this.props.resetPassword(person);
    }
  }

  render() {
    const {
      hasEmail,
    } = this.state;

    const {
      isFetching,
      error,
      success,
    } = this.props;

    return (
      <div>
        <PasswordResetForm
          handleFormSubmit={this.handleFormSubmit}
          handleFieldChange={this.handleFieldChange}
          hasEmail={hasEmail}
          error={error}
          success={success}
          isFetching={isFetching}
        />
      </div>
    );
  }
}

PasswordResetPage.propTypes = {
  resetPassword: PropTypes.func.isRequired,
  success: PropTypes.bool,
  isFetching: PropTypes.bool,
  error: PropTypes.string,
};

PasswordResetPage.defaultProps = {
  isFetching: false,
  success: false,
  error: '',
};

const mapStateToProps = (state) => {
  const {
    success,
    error,
    isFetching,
  } = state.authReducer;

  return {
    isFetching,
    success,
    error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetPassword: (person) => {
      dispatch(resetPassword(person));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PasswordResetPage);
