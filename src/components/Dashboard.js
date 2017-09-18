import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withStyles from 'material-ui/styles/withStyles'
import Typography from 'material-ui/Typography'

const styles = theme => ({
    root: {}
})

class Dashboard extends Component {
    render() {
        const classes = this.props.classes;
        return (
            <div className={classes.root}>
                <Typography type="title" color="inherit" className={classes.flex}>
                    Dashboard
                </Typography>
                <p>You are now logged in!</p>
            </div>
        )
    }
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Dashboard);
