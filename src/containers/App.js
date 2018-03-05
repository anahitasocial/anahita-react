import React from 'react';
import PropTypes from 'prop-types';
import {
  withStyles,
  MuiThemeProvider,
} from 'material-ui/styles';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import JssProvider from 'react-jss/lib/JssProvider';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import List from 'material-ui/List';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import ChevronRightIcon from 'material-ui-icons/ChevronRight';
import createContext from '../styles/createContext';
import Viewer from '../components/Viewer';
import LeftMenu from '../components/LeftMenu';
import { logout } from '../actions/auth';

const drawerWidth = 240;

// Apply some reset
const styles = theme => ({
  '@global': {
    body: {
      margin: 0,
      backgroundColor: theme.palette.background.default,
    },
  },
  root: {
    width: '100%',
    height: 430,
    marginTop: theme.spacing.unit * 3,
    zIndex: 1,
    overflow: 'hidden',
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  appBar: {
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 1,
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
    marginLeft: 12,
    marginRight: 36,
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
    width: 0,
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
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  viewer: {
    display: 'flex',
  },
  content: {
    width: '100%',
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: 24,
    height: 'calc(100% - 56px)',
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100% - 64px)',
      marginTop: 64,
    },
  },
});

let AppWrapper = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

AppWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

AppWrapper = withStyles(styles)(AppWrapper);

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };

    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
  }

  handleDrawerOpen() {
    this.setState({
      open: true,
    });
  }

  handleDrawerClose() {
    this.setState({
      open: false,
    });
  }

  render() {
    const {
      children,
      classes,
      theme,
      isAuthenticated,
      viewer,
    } = this.props;

    const { open } = this.state;
    const context = createContext();
    const title = '';

    return (
      <JssProvider registry={context.sheetsRegistry} jss={context.jss}>
        <MuiThemeProvider theme={context.theme} sheetsManager={context.sheetsManager}>
          <div className={classes.appFrame}>
            <AppBar
              className={classNames(
                classes.appBar,
                isAuthenticated && open && classes.appBarShift,
              )}
            >
              <Toolbar disableGutters={!open}>
                <IconButton
                  className={classNames(
                    classes.menuButton,
                    open && classes.hide,
                  )}
                  color="inherit"
                  aria-label="open drawer"
                  onClick={this.handleDrawerOpen}
                >
                  <MenuIcon />
                </IconButton>
                {title !== null && (
                  <Typography className={classes.title} variant="title" color="inherit" noWrap>
                    {title}
                  </Typography>
                )}
              </Toolbar>
            </AppBar>
            {isAuthenticated &&
              <Drawer
                variant="permanent"
                classes={{
                  paper: classNames(classes.drawerPaper, !open && classes.drawerPaperClose),
                }}
                open={open}
              >
                <div className={classes.drawerInner}>
                  <div className={classes.drawerHeader}>
                    <Typography variant="title" color="inherit" noWrap>
                      Anahita
                    </Typography>
                    <IconButton onClick={this.handleDrawerClose}>
                      {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                  </div>
                  <Divider />
                  <div className={classes.viewer}>
                    <Viewer viewer={viewer} />
                  </div>
                  <Divider />
                  <List className={classes.list}>
                    <LeftMenu
                      onLogoutClick={this.props.logout}
                      classNames={classes}
                    />
                  </List>
                  <Divider />
                </div>
              </Drawer>
              }
            <main className={classes.content}>
              <AppWrapper>
                {children}
              </AppWrapper>
            </main>
          </div>
        </MuiThemeProvider>
      </JssProvider>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  viewer: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const {
    isAuthenticated,
    viewer,
  } = state.authReducer;

  return {
    isAuthenticated,
    viewer,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    logout: () => dispatch(logout()),
  };
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles, { withTheme: true })(App)));
