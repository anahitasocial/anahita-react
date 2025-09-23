import React, { useState } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import RepostIcon from '@material-ui/icons/Repeat';

import api from '../../api';
import NodeType from '../../proptypes/Node';

const ActionsFeedRepost = React.forwardRef(({ parent }, ref) => {
  const [reposted, setReposted] = useState(parent.isRepostedByViewer);
  const [count, setCount] = useState(parent.repostCount);

  const handleAdd = async () => {
    try {
      const response = await api.repost.add(parent);
      if (response.status === 201) {
        setReposted(true);
        setCount(count + 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemove = async () => {
    try {
      const response = await api.repost.deleteItem(parent);
      if (response.status === 200) {
        setReposted(false);
        setCount(count - 1);
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
      {count > 0 && count}
    </Button>
  );
});

ActionsFeedRepost.propTypes = {
  parent: NodeType.isRequired,
};

export default connect()(ActionsFeedRepost);
