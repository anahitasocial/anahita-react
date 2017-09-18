import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withStyles from 'material-ui/styles/withStyles'
import Typography from 'material-ui/Typography'

const styles = theme => ({
    root: {}
})

class Welcome extends Component {
    render() {
        const classes = this.props.classes;
        return (
            <div className={classes.root}>
                <Typography type="title" color="inherit" className={classes.flex}>
                    Anahita
                </Typography>
                <p>Social networking platform and framework!</p>
            </div>
        )
    }
}

Welcome.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Welcome);
