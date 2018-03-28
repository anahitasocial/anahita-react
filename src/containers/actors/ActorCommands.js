import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import Menu, { MenuItem } from 'material-ui/Menu';
import Fade from 'material-ui/transitions/Fade';
import { NavLink } from 'react-router-dom';
import BlockAction from '../actions/BlockAction';

const styles = theme => ({
  root: {
    width: '100%',
  },
  navlink: {
    width: '100%',
    padding: '20px 0',
    textDecoration: 'none',
    color: theme.palette.text.primary,
  },
});

const ITEM_HEIGHT = 48;

class ActorCommands extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
    };

    this.handleOpenMenu = this.handleOpenMenu.bind(this);
    this.handleCloseMenu = this.handleCloseMenu.bind(this);
  }

  handleCloseMenu() {
    this.setState({
      anchorEl: null,
    });
  }

  handleOpenMenu(event) {
    this.setState({
      anchorEl: event.currentTarget,
    });
  }

  render() {
    const { classes, actor } = this.props;
    const { anchorEl } = this.state;
    // const namespace = actor.objectType.split('.')[1];
    console.log(actor.commands);
    return (
      <div className={classes.root}>
        <IconButton
          aria-label="More"
          aria-owns={anchorEl ? 'long-menu' : null}
          aria-haspopup="true"
          onClick={this.handleOpenMenu}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleCloseMenu}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: 200,
            },
          }}
          transition={Fade}
        >
          {actor.commands.map((command) => {
            switch (command) {
              case 'block':
              case 'unblock':
                return (
                  <BlockAction actor={actor} key={command} />
                );
              case 'edit-actor':
                return (
                  <MenuItem key={command}>
                    <NavLink to="settings/" className={classes.navlink}>
                      {'Settings'}
                    </NavLink>
                  </MenuItem>
                );
              default:
                  return <div key={command} />;
            }
          })}
        </Menu>
      </div>
    );
  }
}

ActorCommands.propTypes = {
  classes: PropTypes.object.isRequired,
  actor: PropTypes.object.isRequired,
};

export default withStyles(styles)(ActorCommands);
