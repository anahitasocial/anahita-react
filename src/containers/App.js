import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import IconButton from '@material-ui/core/IconButton';
import SearchBox from './search/SearchBox';

import Viewer from '../components/auth/Viewer';
import assets from '../assets';
import Alerts from './Alerts';
import MenuLogo from '../components/Logo';
import actions from '../actions';

const drawerWidth = 240;
const { LeftMenu } = assets.navs;

// Apply some reset
const useStyles = makeStyles((theme) => {
  return {
    root: {
      display: 'flex',
    },
    appBar: {
      [theme.breakpoints.up('lg')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
    },
    grow: {
      flex: '1 1 auto',
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('lg')]: {
        display: 'none',
      },
    },
    drawer: {
      [theme.breakpoints.up('lg')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: `0 ${theme.spacing(2)}px`,
      ...theme.mixins.toolbar,
    },
    viewer: {
      display: 'flex',
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      overflow: 'auto',
      paddingBottom: theme.spacing(2),
    },
  };
});

const App = (props) => {
  const classes = useStyles();
  const {
    children,
    isAuthenticated,
    viewer,
    appBarTitle,
    location,
    history,
  } = props;

  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    const { logout } = props;
    logout()
      .then(() => {
        history.push('/auth/');
      });
  };

  const drawer = () => {
    return (
      <>
        <div className={classes.drawerHeader}>
          <MenuLogo />
        </div>
        <Divider />
        <LeftMenu
          onLogoutClick={handleLogout}
          viewer={viewer}
          isAuthenticated={isAuthenticated}
          classNames={classes}
        />
        <Divider />
      </>
    );
  };

  const container = window !== undefined ? () => {
    return window.document.body;
  } : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Alerts />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <SearchBox location={location} />
          <Hidden xsDown implementation="css">
            {appBarTitle && !open &&
              <Typography
                variant="h6"
                color="inherit"
                noWrap
              >
                {appBarTitle}
              </Typography>}
          </Hidden>
          <div className={classes.grow} />
          <Viewer
            viewer={viewer}
            isAuthenticated={isAuthenticated}
          />
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer}>
        <Hidden lgUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={open}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer()}
          </Drawer>
        </Hidden>
        <Hidden mdDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer()}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Hidden mdDown implementation="css">
          <Container fixed maxWidth="false">
            {children}
          </Container>
        </Hidden>
        <Hidden lgUp implementation="css">
          {children}
        </Hidden>
      </main>
    </div>
  );
};

App.propTypes = {
  viewer: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  appBarTitle: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  const {
    appBarTitle,
  } = state.app;

  const {
    isAuthenticated,
    viewer,
  } = state.session;

  return {
    appBarTitle,
    isAuthenticated,
    viewer,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    logout: () => {
      return dispatch(actions.session.deleteItem());
    },
  };
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(App));
