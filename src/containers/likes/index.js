import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import LikeIcon from '@material-ui/icons/Favorite';

import LikesBrowse from './Browse';
import CommentType from '../../proptypes/Comment';
import NodeType from '../../proptypes/Node';
import utils from '../../utils';
import i18n from '../../languages';

const Likes = (props) => {
  const {
    node,
    comment,
  } = props;

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const likeableNode = comment || node;
  const { voteUpCount } = likeableNode;
  const namespace = utils.node.getNamespace(likeableNode);
  const LikesStat = LikesBrowse(namespace);

  return (
    <>
      <Dialog
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        open={open}
      >
        <DialogTitle>
          {`${voteUpCount} Likes`}
        </DialogTitle>
        <DialogContent dividers style={{ padding: 0 }}>
          {open && <LikesStat node={node} comment={comment} />}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            fullWidth
          >
            {i18n.t('commons:close')}
          </Button>
        </DialogActions>
      </Dialog>
      <Button
        variant="text"
        onClick={() => {
          setOpen(true);
        }}
        disabled={!voteUpCount}
        startIcon={<LikeIcon />}
        size="small"
      >
        {voteUpCount}
      </Button>
    </>
  );
};

Likes.propTypes = {
  node: NodeType.isRequired,
  comment: CommentType,
};

Likes.defaultProps = {
  comment: null,
};

export default Likes;
