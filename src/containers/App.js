import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { fade, makeStyles, useTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import SearchIcon from '@material-ui/icons/Search';

import Viewer from '../components/auth/Viewer';
import LeftMenu from '../components/LeftMenu';
import * as actions from '../actions';

const drawerWidth = 200;

// Apply some reset
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
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
  toolbar: {
    paddingRight: theme.spacing(1),
  },
  grow: {
    flex: '1 1 auto',
  },
  menuButton: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
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
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    overflow: 'auto',
    marginTop: theme.spacing(2),
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
}));

const App = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    const { logout } = props;
    logout();
  };

  const {
    children,
    isAuthenticated,
    viewer,
    appBarTitle,
  } = props;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        className={clsx(classes.appBar, open && classes.appBarShift)}
        color="inherit"
      >
        <Toolbar disableGutters={!open} className={classes.toolbar}>
          <IconButton
            className={clsx(classes.menuButton, open && classes.hide)}
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          {appBarTitle && !open &&
            <Typography
              variant="h6"
              color="inherit"
              noWrap
            >
              {appBarTitle}
            </Typography>
          }
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          <div className={classes.grow} />
          <Viewer
            viewer={viewer}
            isAuthenticated={isAuthenticated}
          />
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        onClose={handleDrawerToggle}
      >
        <div className={classes.drawerInner}>
          <div className={classes.drawerHeader}>
            <Typography variant="h6" color="inherit" noWrap>
              Anahita
            </Typography>
            <IconButton onClick={handleDrawerToggle}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List className={classes.list}>
            <LeftMenu
              onLogoutClick={handleLogout}
              isAuthenticated={isAuthenticated}
              classNames={classes}
            />
          </List>
          <Divider />
        </div>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container>
          {children}
        </Container>
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
