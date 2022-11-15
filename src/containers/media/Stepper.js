/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import striptags from 'striptags';
import { Helmet } from 'react-helmet-async';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';

import NextIcon from '@material-ui/icons/NavigateNext';
import PrevIcon from '@material-ui/icons/NavigateBefore';

import CloseIcon from '@material-ui/icons/Close';
import HomeIcon from '@material-ui/icons/Home';
import LinkIcon from '@material-ui/icons/Link';

import PersonType from '../../proptypes/Person';
import MediaType from '../../proptypes/Media';

import MediumComments from '../comments/Browse';
import LocationsGadget from '../locations/Gadget';
import LikeAction from '../likes/actions/Like';
import Likes from '../likes';
import CommentStats from '../../components/comment/Stats';
import MediumMenu from './Menu';
import MediumStepper from '../../components/medium/Stepper';
import MediumForm from '../../components/medium/forms/Edit';

import MEDIUM_DEFAULT from '../../proptypes/MediumDefault';

import actions from '../../actions';
import form from '../../utils/form';
// import i18n from '../../languages';
import utils from '../../utils';

const {
  getPortraitURL,
  getURL,
} = utils.node;

const formFields = form.createFormFields([
  'name',
  'body',
]);

const MediaStepper = (props) => {
  const {
    editItem,
    alertError,
    alertSuccess,
    handleClose,
    mediumId,
    items,
    namespace,
    viewer,
    isAuthenticated,
    error,
    success,
    isFetching,
    open,
  } = props;

  const nextImage = new Image();
  const prevImage = new Image();

  const [isEditing, setIsEditing] = useState(false);
  const [fields, setFields] = useState(formFields);
  const [index, setIndex] = useState(items.allIds.indexOf(mediumId));
  const [current, setCurrent] = useState({ ...MEDIUM_DEFAULT });

  useEffect(() => {
    if (error) {
      alertError('Something went wrong!');
    }

    if (success) {
      alertSuccess('Updated successfully.');
    }
  }, [error, success]);

  const handleEdit = () => {
    setCurrent({ ...items.byId[items.allIds[index]] });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setCurrent({ ...MEDIUM_DEFAULT });
    setIsEditing(false);
  };

  const preloadImages = () => {
    if (items.allIds[index + 1]) {
      const item = items.byId[items.allIds[index + 1]];
      nextImage.src = getPortraitURL(item, 'large');
    }

    if (items.allIds[index - 1]) {
      const item = items.byId[items.allIds[index - 1]];
      prevImage.src = getPortraitURL(item, 'large');
    }
  };

  const handleNext = () => {
    if (items.allIds[index + 1]) {
      preloadImages();
      setIndex(index + 1);
    }
  };

  const handlePrev = () => {
    if (items.allIds[index - 1]) {
      preloadImages();
      setIndex(index - 1);
    }
  };

  const handleKeydown = (event) => {
    const { code } = event;

    if (isEditing) {
      return;
    }

    if (code === 'ArrowRight') {
      handleNext();
    }

    if (code === 'ArrowLeft') {
      handlePrev();
    }
  };

  useEffect(() => {
    // window.addEventListener('keydown', handleKeydown);
    preloadImages();

    return () => {
      // window.removeEventListener('keydown', handleKeydown);
      nextImage.src = null;
      prevImage.src = null;
    };
  }, [handleKeydown]);

  const handleOnChange = (event) => {
    const { target } = event;
    const { name, value } = target;

    current[name] = value;

    setCurrent({ ...current });

    const newFields = form.validateField(target, fields);

    setFields({ ...newFields });
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    const { target } = event;
    const newFields = form.validateForm(target, fields);

    if (form.isValid(newFields)) {
      const formData = form.fieldsToData(newFields);
      editItem({
        id: current.id,
        ...formData,
      }).then(() => {
        handleCancel();
      });
    }

    setFields({ ...newFields });
  };

  const medium = items.byId[items.allIds[index]];
  const canAddComment = isAuthenticated && medium.openToComment;
  const url = getURL(medium);
  const Like = LikeAction(medium.objectType.split('.')[1]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen
    >
      <DialogTitle
        disableTypography
      >
        <IconButton
          aria-label="close"
          onClick={handleClose}
          edge="start"
        >
          <CloseIcon />
        </IconButton>
        <IconButton
          aria-label="close"
          component="a"
          href="/"
        >
          <HomeIcon />
        </IconButton>
        <IconButton
          aria-label="close"
          component="a"
          href={url}
        >
          <LinkIcon />
        </IconButton>
      </DialogTitle>
      <Helmet>
        <title>
          {medium.name || striptags(medium.body).substring(0, 60)}
        </title>
        <meta name="description" content={striptags(medium.body)} />
      </Helmet>
      <Divider />
      <MediumStepper
        medium={medium}
        steps={items.allIds.length}
        activeStep={items.allIds[index]}
        editing={isEditing}
        form={
          <MediumForm
            medium={current}
            fields={fields}
            handleOnChange={handleOnChange}
            handleOnSubmit={handleOnSubmit}
            handleCancel={handleCancel}
            isFetching={isFetching}
          />
        }
        menu={isAuthenticated &&
          <MediumMenu
            medium={medium}
            viewer={viewer}
            handleEdit={handleEdit}
            key={`${namespace}-menu-${medium.id}`}
          />}
        actions={isAuthenticated &&
          <Like
            node={medium}
            key={`like-${medium.id}`}
          />}
        stats={
          <>
            <Likes
              node={medium}
              key={`likes-${medium.id}`}
            />
            <CommentStats node={medium} />
          </>
        }
        comments={
          <MediumComments
            parent={medium}
            canAdd={canAddComment}
            key={`${namespace}-comments-${medium.id}`}
            cardProps={{
              variant: 'outlined',
            }}
          />
        }
        locations={
          <LocationsGadget
            node={medium}
            key={`${namespace}-locations-${medium.id}`}
          />
        }
        nextAction={
          <Button
            onClick={handleNext}
            disabled={!items.allIds[index + 1]}
            fullWidth
            variant="outlined"
          >
            <NextIcon />
          </Button>
        }
        prevAction={
          <Button
            onClick={handlePrev}
            disabled={!items.allIds[index - 1]}
            fullWidth
            variant="outlined"
          >
            <PrevIcon />
          </Button>
        }
      />
    </Dialog>
  );
};

MediaStepper.propTypes = {
  editItem: PropTypes.func.isRequired,
  alertSuccess: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  namespace: PropTypes.string.isRequired,
  viewer: PersonType.isRequired,
  isFetching: PropTypes.bool.isRequired,
  items: MediaType.isRequired,
  mediumId: PropTypes.number.isRequired,
  error: PropTypes.string.isRequired,
  success: PropTypes.bool.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
};

const mapStateToProps = (namespace) => {
  return (state) => {
    const {
      isFetching,
      error,
      success,
    } = state[namespace];

    const { viewer, isAuthenticated } = state.session;

    return {
      items: state[namespace][namespace],
      namespace,
      error,
      success,
      isFetching,
      viewer,
      isAuthenticated,
    };
  };
};

const mapDispatchToProps = (namespace) => {
  return (dispatch) => {
    return {
      editItem: (node) => {
        return dispatch(actions[namespace].edit(node));
      },
      alertSuccess: (message) => {
        return dispatch(actions.app.alert.success(message));
      },
      alertError: (message) => {
        return dispatch(actions.app.alert.error(message));
      },
    };
  };
};

export default (namespace) => {
  return connect(
    mapStateToProps(namespace),
    mapDispatchToProps(namespace),
  )(MediaStepper);
};
