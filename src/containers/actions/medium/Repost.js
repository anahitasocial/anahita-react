import React, { useState } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import RepostIcon from '@material-ui/icons/Repeat';

import api from '../../../api';
import NodeType from '../../../proptypes/Node';
import i18n from '../../../languages';

const ActionsMediumRepost = React.forwardRef(({ node }, ref) => {
  const [reposted, setReposted] = useState(node.isRepostedByViewer);

  const handleRepost = async () => {
    try {
      const response = await api.feed.repost.add(node.id);
      if (response.status === 200) {
        setReposted(true);
      }
    } catch (error) {
      console.error(error);
    }
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
  node: NodeType.isRequired,
};

export default connect()(ActionsMediumRepost);
