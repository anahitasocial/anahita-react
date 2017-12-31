import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import JssProvider from 'react-jss/lib/JssProvider';
import { withStyles, MuiThemeProvider } from 'material-ui/styles';
import classNames from 'classnames';
import Drawer from 'material-ui/Drawer';
import createContext from '../styles/createContext';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import List from 'material-ui/List';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import ChevronRightIcon from 'material-ui-icons/ChevronRight';
import Viewer from '../components/Viewer';
import LeftMenu from '../components/LeftMenu';
import { logout } from '../actions/auth';

const drawerWidth = 240;

// Apply some reset
const styles = theme => ({
  '@global': {
    body: {
        margin: 0
    }
  },
  toolbar: {
    paddingLeft: 10
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  appBar: {
    position: 'absolute',
    zIndex: theme.zIndex.navDrawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 15,
  },
  appBarTitle: {
      marginLeft: 15
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    height: '100%',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    width: 60,
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  drawerInner: {
    // Make the items inside not wrap when transitioning:
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    ...theme.mixins.toolbar,
  },
  viewer : {
      display: 'flex',
  },
  mainContent: {
    width: '100%',
    flexGrow: 1,
    //backgroundColor: theme.palette.background.default,
    padding: 24,
    //height: 'calc(100% - 56px)',
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100% - 64px)',
      marginTop: 64,
    },
  }
});

let AppWrapper = ({ children }) => {
    return(
        <div>
            {children}
        </div>
    )
};
AppWrapper = withStyles(styles)(AppWrapper);

class App extends React.Component {

    state = {
      leftDrawerOpen: true,
    };

    handleDrawerOpen = () => {
      this.setState({
          leftDrawerOpen: true
      });
    };

    handleDrawerClose = () => {
      this.setState({
          leftDrawerOpen: false
      });
    };

    render() {

        const {
            dispatch,
            auth,
            children,
            classes,
            theme
        } = this.props;

        const context = createContext();

        return (
            <JssProvider registry={context.sheetsRegistry} jss={context.jss}>
                <MuiThemeProvider theme={context.theme} sheetsManager={context.sheetsManager}>
                    <div className={classes.appFrame}>

                        {auth.isAuthenticated &&
                        <AppBar className={classNames(classes.appBar, auth.isAuthenticated && this.state.leftDrawerOpen && classes.appBarShift)}>
                            <Toolbar className={classNames(classes.toolbar)}>
                                <IconButton
                                  className={classNames(classes.menuButton, this.state.leftDrawerOpen && classes.hide)}
                                  color="contrast"
                                  aria-label="open drawer"
                                  onClick={this.handleDrawerOpen}
                                  >
                                    <MenuIcon/>
                                </IconButton>
                                <Typography type="title" color="inherit" className={classes.appBarTitle}>
                                    Dashboard
                                </Typography>
                            </Toolbar>
                        </AppBar>
                        }

                        { auth.isAuthenticated &&
                        <Drawer
                          type="permanent"
                          classes={{
                            paper: classNames(classes.drawerPaper, !this.state.leftDrawerOpen && classes.drawerPaperClose),
                          }}
                          open={this.state.leftDrawerOpen}
                        >
                            <div className={classes.drawerInner}>
                              <div className={classes.drawerHeader}>
                                <Typography type="headline" color="inherit">
                                    Anahita
                                </Typography>
                                <IconButton onClick={this.handleDrawerClose}>
                                  {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                                </IconButton>
                              </div>
                              <Divider />
                              <div className={classes.viewer}>
                                  <Viewer viewer={auth.viewer} />
                              </div>
                              <Divider />
                              <List className={classes.list}>
                                  <LeftMenu onLogoutClick={() => dispatch(logout())} classNames={classes} />
                              </List>
                              <Divider />
                            </div>
                        </Drawer>
                        }
                        <main className={classes.mainContent}>
                            <AppWrapper>
                                {children}
                            </AppWrapper>
                        </main>
                    </div>
                </MuiThemeProvider>
            </JssProvider>
        )
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    children: PropTypes.node
}

//App.contextTypes = {
//  router: PropTypes.object,
//};

const mapStateToProps = state => {
  const {
    auth,
    //routing
  } = state;

  return {
    auth,
    //routing
  };
};


export default withRouter(
    connect(mapStateToProps)(withStyles(styles, { withTheme: true })(App))
);
