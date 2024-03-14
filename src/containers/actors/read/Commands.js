import React, { useState } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import BlockAction from '../../actions/Block';
import DeleteAction from '../../actions/Delete';

import ActorType from '../../../proptypes/Actor';
import PersonType from '../../../proptypes/Person';
import utils from '../../../utils';
import i18n from '../../../languages';
import perms from '../../../permissions/actor';

const ITEM_HEIGHT = 48;

const { node } = utils;

const ActorsReadCommands = (props) => {
  const {
    actor,
    isAuthenticated,
    viewer,
  } = props;

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpen = (event) => {
    const { currentTarget } = event;
    setAnchorEl(currentTarget);
  };

  const namespace = node.getNamespace(actor);
  const showBlock = isAuthenticated && perms.canBlock(actor, viewer);
  const showEdit = perms.canEdit(actor);
  const showDelete = perms.canDelete(actor);

  return (
    <>
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
        {showBlock &&
          <BlockAction
            actor={actor}
            key="actor-socialgraph-block"
            component="menuitem"
          />}
        {showEdit &&
          <MenuItem
            key={`actor-edit-${actor.id}`}
            component="a"
            href={`${node.getURL(actor)}settings`}
          >
            {i18n.t('commons:settings')}
          </MenuItem>}
        {showDelete &&
          <DeleteAction
            key={`actor-delete-${actor.id}`}
            node={actor}
            component="menuitem"
            confirmMessage={i18n.t(`${namespace}:confirm.delete`, {
              name: actor.name,
            })}
          />}
      </Menu>
    </>
  );
};

ActorsReadCommands.propTypes = {
  actor: ActorType,
  isAuthenticated: PropTypes.bool,
  viewer: PersonType.isRequired,
};

ActorsReadCommands.defaultProps = {
  actor: {
    commands: [],
  },
  isAuthenticated: false,
};

export default ActorsReadCommands;
