import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import BlockAction from '../../actions/Block';
import DeleteAction from '../../actions/Delete';

import ActorType from '../../../proptypes/Actor';
import PersonType from '../../../proptypes/Person';
import utils from '../../../utils';

const ITEM_HEIGHT = 48;

const { node } = utils;

const ActorsReadCommands = (props) => {
  const { actor, viewer } = props;

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpen = (event) => {
    const { currentTarget } = event;
    setAnchorEl(currentTarget);
  };

  const isSuperAdmin = node.isSuperAdmin(viewer) && viewer.id !== actor.id;

  if (isSuperAdmin && !actor.commands.includes('delete')) {
    actor.commands.push('delete');
  }

  return (
    <React.Fragment>
      <IconButton
        aria-label="More"
        aria-owns={anchorEl ? 'long-menu' : null}
        aria-haspopup="true"
        onClick={handleOpen}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
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
            case 'edit':
              return (
                <MenuItem
                  key={`actor-${command}`}
                  component="a"
                  href={`${node.getURL(actor)}settings`}
                >
                  Settings
                </MenuItem>
              );
            case 'delete':
              return (
                <DeleteAction
                  key={`actor-${command}`}
                  node={actor}
                  component="menuitem"
                  redirect={`/explore/${node.getNamespace(actor)}`}
                />
              );
            default:
                return (
                  <div key={command} />
                );
          }
        })}
      </Menu>
    </React.Fragment>
  );
};

ActorsReadCommands.propTypes = {
  actor: ActorType,
  viewer: PersonType,
};

ActorsReadCommands.defaultProps = {
  actor: {
    commands: [],
  },
};

export default ActorsReadCommands;
