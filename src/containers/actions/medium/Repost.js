import React, { useState } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import RepostIcon from '@material-ui/icons/Repeat';

import api from '../../../api';
import NodeType from '../../../proptypes/Node';
import i18n from '../../../languages';

const ActionsMediumRepost = React.forwardRef(({ repost, parent }, ref) => {
  const [reposted, setReposted] = useState(parent.isRepostedByViewer);

  const handleAdd = async () => {
    try {
      const response = await api.repost.add(parent);
      if (response.status === 201) {
        setReposted(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemove = async () => {
    if (!repost || !repost.id) {
      return;
    }

    try {
      const response = await api.repost.deleteItem(repost);
      if (response.status === 200) {
        setReposted(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const action = reposted ? handleRemove : handleAdd;

  const handleRepost = (event) => {
    event.preventDefault();
    action();
  };

  return (
    <Button
      ref={ref}
      onClick={handleRepost}
      startIcon={<RepostIcon />}
      color={reposted ? 'primary' : 'default'}
      fullWidth
    >
      {i18n.t('actions:repost')}
    </Button>
  );
});

ActionsMediumRepost.propTypes = {
  parent: NodeType.isRequired,
  repost: NodeType,
};

ActionsMediumRepost.defaultProps = {
  repost: null,
};

export default connect()(ActionsMediumRepost);
