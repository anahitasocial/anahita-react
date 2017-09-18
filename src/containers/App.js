import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

import JssProvider from 'react-jss/lib/JssProvider'
import { withStyles, MuiThemeProvider } from 'material-ui/styles'
import createContext from '../styles/createContext'

import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';

// Apply some reset
const styles = theme => ({
  '@global': {
    html: {
      background: theme.palette.background.default,
      WebkitFontSmoothing: 'antialiased', // Antialiasing.
      MozOsxFontSmoothing: 'grayscale', // Antialiasing.
    },
    body: {
      margin: 0
    }
  },
  root: {
      flex: '1 0 100%',
  },
  menuButton: {
      marginLeft: -12,
      marginRight: 20
  },
  flex: {
      flex: 1
  }
});

let AppWrapper = props => props.children;
AppWrapper = withStyles(styles)(AppWrapper);

class App extends React.Component {
    render() {

        const { children, classes } = this.props;
        const context = createContext()

        return (
            <JssProvider registry={context.sheetsRegistry} jss={context.jss}>
                <MuiThemeProvider theme={context.theme} sheetsManager={context.sheetsManager}>
                    <div>
                        <AppBar position="static">
                            <Toolbar>
                                <IconButton className={classes.menuButton} color="contrast" aria-label="Menu">
                                    <MenuIcon/>
                                </IconButton>
                                <Typography type="title" color="inherit" className={classes.flex}>
                                    Dashboard
                                </Typography>
                                <Button color="contrast">Login</Button>
                            </Toolbar>
                        </AppBar>
                        <AppWrapper>
                            {children}
                        </AppWrapper>
                    </div>
                </MuiThemeProvider>
            </JssProvider>
        )
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.node
}

App.contextTypes = {
  router: PropTypes.object,
};

const mapStateToProps = state => {
  const {
    auth,
    routing
  } = state;

  return {
    auth,
    routing
  };
};

export default connect(mapStateToProps)(withStyles(styles)(App));
