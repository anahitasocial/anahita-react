import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import AddIcon from '@material-ui/icons/Add';

import ActorType from '../../../../proptypes/Actor';
import i18n from '../../../../languages';
import SelectList from './Select';

const useStyles = makeStyles((theme) => {
  return {
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  };
});

const ActorsSocialgraphAdd = (props) => {
  const classes = useStyles();
  const {
    actor,
    isOpen: defaultIsOpen,
  } = props;

  const [isOpen, setIsOpen] = useState(defaultIsOpen);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {i18n.t('socialgraph:add.cTitle')}
          <IconButton
            onClick={handleClose}
            style={{
              float: 'right',
            }}
            className={classes.closeButton}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        {isOpen && <SelectList actor={actor} />}
      </Dialog>
      <Button
        startIcon={<AddIcon />}
        onClick={handleOpen}
      >
        {i18n.t('socialgraph:add.mTitle')}
      </Button>
    </>
  );
};

ActorsSocialgraphAdd.propTypes = {
  actor: ActorType.isRequired,
  isOpen: PropTypes.bool,
};

ActorsSocialgraphAdd.defaultProps = {
  isOpen: false,
};

export default ActorsSocialgraphAdd;
