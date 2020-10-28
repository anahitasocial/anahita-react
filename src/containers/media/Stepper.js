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
import MediaType from '../../proptypes/Media';

import MediumComments from '../comments/Browse';
import LocationsGadget from '../locations/Gadget';
import LikeAction from '../likes/Read';
import Likes from '../likes';
import MediumMenu from './Menu';
import MediumStepper from '../../components/medium/Stepper';
import MediumForm from '../../components/medium/forms/Edit';

import SimpleSnackbar from '../../components/SimpleSnackbar';

import * as actions from '../../actions';
import form from '../../utils/form';
// import i18n from '../../languages';
import utils from '../utils';

const formFields = form.createFormFields([
  'name',
  'body',
]);

const MediaStepper = (props) => {
  const {
    editItem,
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

  const [isEditing, setIsEditing] = useState(false);
  const [fields, setFields] = useState(formFields);
  const [index, setIndex] = useState(items.allIds.indexOf(mediumId));
  const [medium, setMedium] = useState(null);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setMedium({ ...items.byId(items.allIds(index)) });
    setIsEditing(false);
  };

  const handleNext = () => {
    if (items.allIds[index + 1]) {
      setIndex(index + 1);
    }
  };

  const handlePrev = () => {
    if (items.allIds[index - 1]) {
      setIndex(index - 1);
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

    setMedium({ ...medium });

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

  const cMedium = items.byId[items.allIds[index]];
  const canAddComment = isAuthenticated && cMedium.openToComment;
  const url = utils.getURL(cMedium);
  const Like = LikeAction(cMedium.objectType.split('.')[1]);

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
          {cMedium.name || striptags(cMedium.body).substring(0, 60)}
        </title>
        <meta name="description" content={striptags(cMedium.body)} />
      </Helmet>
      <Divider />
      <MediumStepper
        medium={cMedium}
        steps={items.allIds.length}
        activeStep={items.allIds[index]}
        editing={isEditing}
        form={
          <MediumForm
            medium={cMedium}
            fields={fields}
            handleOnChange={handleOnChange}
            handleOnSubmit={handleOnSubmit}
            handleCancel={handleCancel}
            isFetching={isFetching}
          />
        }
        menu={isAuthenticated &&
          <MediumMenu
            medium={cMedium}
            viewer={viewer}
            handleEdit={handleEdit}
            key={`${namespace}-menu-${cMedium.id}`}
          />
        }
        actions={isAuthenticated &&
          <Like
            node={cMedium}
            key={`like-${cMedium.id}`}
          />
        }
        stats={open &&
          <Likes
            node={cMedium}
            key={`likes-${cMedium.id}`}
          />
        }
        comments={
          <MediumComments
            parent={cMedium}
            canAdd={canAddComment}
            key={`${namespace}-comments-${cMedium.id}`}
          />
        }
        locations={
          <LocationsGadget
            node={medium}
            key={`${namespace}-locations-${cMedium.id}`}
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
  editItem: PropTypes.func.isRequired,
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
    };
  };
};

export default (namespace) => {
  return connect(
    mapStateToProps(namespace),
    mapDispatchToProps(namespace),
  )(MediaStepper);
};
