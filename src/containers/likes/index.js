import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import LikeIcon from '@material-ui/icons/Favorite';

import LikesBrowse from './Browse';
import NodeType from '../../proptypes/Node';

const Likes = (props) => {
  const {
    node,
  } = props;

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const {
    voteUpCount: likesCount,
    objectType,
  } = node;

  const MediumLikes = LikesBrowse(objectType.split('.')[1]);

  return (
    <React.Fragment>
      <Dialog
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        open={open}
      >
        <DialogTitle>
          {`${likesCount} Likes`}
        </DialogTitle>
        <DialogContent dividers style={{ padding: 0 }}>
          {open && <MediumLikes node={node} />}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            fullWidth
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Button
        variant="text"
        fullWidth
        onClick={() => {
          setOpen(true);
        }}
        disabled={likesCount === 0}
        endIcon={<LikeIcon />}
      >
        {likesCount}
      </Button>
    </React.Fragment>
  );
};

Likes.propTypes = {
  node: NodeType.isRequired,
};

export default Likes;
