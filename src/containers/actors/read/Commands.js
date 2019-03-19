import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { NavLink } from 'react-router-dom';
import BlockAction from '../../actions/Block';

import ActorType from '../../../proptypes/Actor';

const styles = (theme) => {
  return {
    navlink: {
      width: '100%',
      padding: '20px 0',
      textDecoration: 'none',
      color: theme.palette.text.primary,
    },
  };
};

const ITEM_HEIGHT = 48;

class ActorsReadCommands extends React.Component {
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
    // console.log(actor.commands);
    return (
      <React.Fragment>
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
        >
          {actor.commands.map((command) => {
            switch (command) {
              case 'block':
              case 'unblock':
                return (
                  <BlockAction
                    actor={actor}
                    key={`actor-${command}`}
                    component="menuitem"
                  />
                );
              case 'edit-actor':
                return (
                  <MenuItem key={`actor-${command}`}>
                    <NavLink
                      to="settings/"
                      className={classes.navlink}
                    >
                      {'Settings'}
                    </NavLink>
                  </MenuItem>
                );
              default:
                  return <div key={command} />;
            }
          })}
        </Menu>
      </React.Fragment>
    );
  }
}

ActorsReadCommands.propTypes = {
  classes: PropTypes.object.isRequired,
  actor: ActorType,
};

ActorsReadCommands.defaultProps = {
  actor: {
    commands: [],
  },
};

export default withStyles(styles)(ActorsReadCommands);
