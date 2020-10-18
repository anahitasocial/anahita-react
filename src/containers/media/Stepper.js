import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import striptags from 'striptags';
import { Helmet } from 'react-helmet';

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
import MediumType from '../../proptypes/Medium';
import MediaType from '../../proptypes/Media';

import MediumComments from '../comments/Browse';
import LocationsGadget from '../locations/Gadget';
import LikeAction from '../actions/Like';
import MediumMenu from './Menu';
import Medium from '../../components/medium/Stepper';
import MediumForm from '../../components/medium/forms/Edit';

import SimpleSnackbar from '../../components/SimpleSnackbar';

import * as actions from '../../actions';
import form from '../../utils/form';
import i18n from '../../languages';
import utils from '../utils';

const formFields = form.createFormFields([
  'name',
  'body',
]);

const MediaStepper = (props) => {
  const {
    setAppTitle,
    editItem,
    handleClose,
    medium: current,
    items,
    namespace,
    viewer,
    isAuthenticated,
    error,
    success,
    isFetching,
    open,
  } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [fields, setFields] = useState(formFields);
  const [medium, setMedium] = useState(current);

  const index = items.allIds.indexOf(medium.id);

  useEffect(() => {
    setAppTitle(i18n.t(`${namespace}:cTitle`));
  }, [setAppTitle, namespace]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleNext = () => {
    if (items.allIds[index + 1]) {
      const item = items.byId[items.allIds[index + 1]];
      setMedium({ ...item });
    }
  };

  const handlePrev = () => {
    if (items.allIds[index - 1]) {
      const item = items.byId[items.allIds[index - 1]];
      setMedium({ ...item });
    }
  };

  const handleKeydown = (event) => {
    const { code } = event;

    if (code === 'ArrowRight') {
      handleNext();
    }

    if (code === 'ArrowLeft') {
      handlePrev();
    }
  };

  const handleOnChange = (event) => {
    const { target } = event;
    const { name, value } = target;

    medium[name] = value;

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
        id: medium.id,
        ...formData,
      }).then(() => {
        handleCancel();
      });
    }

    setFields({ ...newFields });
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [handleKeydown]);

  const canAddComment = isAuthenticated && medium.openToComment;
  const url = utils.getURL(medium);

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
      <Medium
        medium={medium}
        steps={items.allIds.length}
        activeStep={items.allIds.indexOf(medium.id)}
        editing={isEditing}
        form={
          <MediumForm
            medium={medium}
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
          />
        }
        actions={isAuthenticated &&
          <LikeAction
            node={medium}
            liked={medium.isVotedUp}
            key={`${namespace}-likes-${medium.id}`}
          />
        }
        comments={
          <MediumComments
            parent={medium}
            canAdd={canAddComment}
            key={`${namespace}-comments-${medium.id}`}
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
          >
            <NextIcon />
          </Button>
        }
        prevAction={
          <Button
            onClick={handlePrev}
            disabled={!items.allIds[index - 1]}
            fullWidth
          >
            <PrevIcon />
          </Button>
        }
      />
      {error &&
        <SimpleSnackbar
          isOpen={Boolean(error)}
          message="Something went wrong!"
          type="error"
        />
      }
      {success &&
        <SimpleSnackbar
          isOpen={Boolean(success)}
          message="Updated successfully!"
          type="success"
        />
      }
    </Dialog>
  );
};

MediaStepper.propTypes = {
  setAppTitle: PropTypes.func.isRequired,
  editItem: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  namespace: PropTypes.string.isRequired,
  viewer: PersonType.isRequired,
  isFetching: PropTypes.bool.isRequired,
  items: MediaType.isRequired,
  medium: MediumType.isRequired,
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
      setAppTitle: (title) => {
        return dispatch(actions.app.setAppTitle(title));
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
