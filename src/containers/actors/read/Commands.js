import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import BlockAction from '../../actions/Block';

import ActorType from '../../../proptypes/Actor';
import utils from '../../../utils';

const ITEM_HEIGHT = 48;

const { getURL } = utils.node;

const ActorsReadCommands = (props) => {
  const { actor } = props;

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpen = (event) => {
    const { currentTarget } = event;
    setAnchorEl(currentTarget);
  };

  // const namespace = actor.objectType.split('.')[1];
  // console.log(actor.commands);
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
                  href={`${getURL(actor)}settings`}
                >
                  Settings
                </MenuItem>
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
};

ActorsReadCommands.defaultProps = {
  actor: {
    commands: [],
  },
};

export default ActorsReadCommands;
