import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'material-ui/styles/withStyles';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

const styles = theme => ({
    container: {
        margin: "10px 0"
    },
    colorError: {
        color: theme.palette.error.A400
    },
    textField: {
        margin: "0 0 15px 0"
    },
    button: {}
});

const LoginForm = (props) => {

    const {
        classes,
        handleFieldChange,
        handleFormSubmit,
        hasUsername,
        hasPassword,
        error
    } = props;

    return (
        <div className={classes.root}>
            <Typography type="headline" color="primary">
                Please login
            </Typography>
            <form className={classes.container} onSubmit={handleFormSubmit}>
                { error &&
                    <Typography type="body1" classes={classes} color="error" paragraph={true}>
                        {error}
                    </Typography>
                }
                <div>
                    <TextField
                        name="username"
                        onChange={handleFieldChange("username")}
                        className={classes.textField}
                        label="Email or username"
                        error={ !hasUsername}
                        helperText={ !hasUsername ? "Please enter your email or username." : ""}
                        autoFocus
                        fullWidth
                    />
                </div>
                <div>
                    <TextField
                        type="password"
                        name="password"
                        onChange={handleFieldChange("password")}
                        className={classes.textField}
                        label="Password"
                        error={ !hasPassword}
                        helperText={ !hasPassword ? "Please enter your password." : ""}
                        fullWidth
                    />
                </div>
                <Button
                    raised
                    dense
                    type="submit"
                    className={classes.button}>
                    Login
                </Button>
            </form>
        </div>
    );
}

LoginForm.propTypes = {
    classes: PropTypes.object.isRequired,
    handleFieldChange: PropTypes.func.isRequired,
    handleFormSubmit: PropTypes.func.isRequired,
    username: PropTypes.string,
    hasUsername: PropTypes.bool,
    passowrd: PropTypes.string,
    hasPassword: PropTypes.bool
}

export default withStyles(styles)(LoginForm);
