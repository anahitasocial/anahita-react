import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../../api/cover';
import CoverForm from '../../components/CoverForm';
import NodeType from '../../proptypes/Node';

const Cover = (props) => {
  const {
    node,
    canEdit,
  } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const [cover, setCover] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    const src = node.coverUrls && node.coverUrls.large && node.coverUrls.large.url;
    if (src) {
      setCover(src);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (cover) {
      // eslint-disable-next-line no-undef
      const image = new Image();

      setIsLoading(true);
      image.src = cover;

      image.onload = () => {
        setIsLoading(false); // Image loaded successfully
      };

      image.onError = () => {
        setIsLoading(false); // Error loading image
      };
    }
  }, [cover]);

  const handleFieldChange = (event) => {
    const { files } = event.target;

    setAnchorEl(null);
    if (!files.length) {
      return;
    }

    setWaiting(true);
    api.add(node, files[0]).then((result) => {
      const { data } = result;
      setCover(data.large.url);
      setWaiting(false);
    });
  };

  const handleDelete = () => {
    setAnchorEl(null);
    setWaiting(true);
    api.deleteItem(node).then(() => {
      setCover(null);
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
    <CoverForm
      isFetching={waiting || isLoading}
      node={node}
      cover={cover}
      anchorEl={anchorEl}
      canEdit={canEdit}
      handleOpen={handleOpen}
      handleClose={handleClose}
      handleFieldChange={handleFieldChange}
      handleDelete={handleDelete}
    />
  );
};

Cover.propTypes = {
  node: NodeType.isRequired,
  canEdit: PropTypes.bool.isRequired,
};

export default Cover;
