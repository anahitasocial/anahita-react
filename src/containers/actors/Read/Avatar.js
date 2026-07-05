import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../../../api/avatar';
import AvatarForm from '../Forms/Avatar';
import NodeType from '../../../proptypes/Node';

const ActorsAvatar = (props) => {
  const {
    node,
    canEdit,
  } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    const src = node.avatarUrls && node.avatarUrls.large && node.avatarUrls.large.url;
    if (src) {
      setAvatar(src);
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (avatar) {
      // eslint-disable-next-line no-undef
      const image = new Image();

      setIsLoading(true);
      image.src = avatar;

      image.onload = () => {
        setIsLoading(false); // Image loaded successfully
      };

      image.onError = () => {
        setIsLoading(false); // Error loading image
      };
    }
  }, [avatar]);

  const handleFieldChange = (event) => {
    const { files } = event.target;

    setAnchorEl(null);
    if (!files.length) {
      return;
    }

    setWaiting(true);
    api.add(node, files[0]).then((result) => {
      const { data } = result;
      setAvatar(data.large.url);
      setWaiting(false);
    });
  };

  const handleDelete = () => {
    setAnchorEl(null);
    setWaiting(true);
    api.deleteItem(node).then(() => {
      setAvatar(null);
      setWaiting(false);
    });
  };

  const handleOpen = (event) => {
    const { currentTarget } = event;
    setAnchorEl(currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AvatarForm
      isFetching={waiting || isLoading}
      node={node}
      avatar={avatar}
      anchorEl={anchorEl}
      canEdit={canEdit}
      handleOpen={handleOpen}
      handleClose={handleClose}
      handleFieldChange={handleFieldChange}
      handleDelete={handleDelete}
      size="large"
    />
  );
};

ActorsAvatar.propTypes = {
  node: NodeType.isRequired,
  canEdit: PropTypes.bool.isRequired,
};

export default ActorsAvatar;
