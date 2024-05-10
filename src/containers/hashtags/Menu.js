import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import utils from '../../utils';
import i18n from '../../languages';

import DeleteAction from '../actions/Delete';
import LocationType from '../../proptypes/Location';

const { withRef } = utils.component;

const DeleteActionWithRef = withRef(DeleteAction);

const LocationMenu = (props) => {
  const {
    hashtag,
  } = props;

  const [menuAnchorEl, setAnchorEl] = React.useState(null);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-owns={menuAnchorEl ? `hashtag-card-menu-${hashtag.id}` : undefined}
        aria-haspopup="true"
        onClick={handleOpenMenu}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id={`hashtag-menu-${hashtag.id}`}
        anchorEl={menuAnchorEl}
        keepMounted
        open={Boolean(menuAnchorEl)}
        onClose={handleClose}
      >
        <DeleteActionWithRef
          node={hashtag}
          redirect="/hashtags/"
          key={`hashtag-delete-${hashtag.id}`}
          confirmMessage={i18n.t('hashtags:confirm.delete')}
        />
      </Menu>
    </>
  );
};

LocationMenu.propTypes = {
  hashtag: LocationType.isRequired,
};

export default LocationMenu;
