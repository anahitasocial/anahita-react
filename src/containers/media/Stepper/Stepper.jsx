/* eslint-disable no-undef */
import React from 'react';
import PropTypes from 'prop-types';
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

import PersonType from '../../../proptypes/Person';
import MediumType from '../../../proptypes/Medium';

import MediumComments from '../../comments/Browse';
import LocationsGadget from '../../locations/Gadget';
import Likes from '../../likes';
import CommentStats from '../../../components/comment/Stats';
import MediaMenu from '../MediaMenu';
import Lightbox from './Lightbox';
import MediumForm from '../../../components/medium/forms/Edit';

import utils from '../../../utils';

const { getURL } = utils.node;

const MediaStepperView = ({
  open,
  handleClose,
  medium,
  current,
  fields,
  index,
  itemCount,
  namespace,
  viewer,
  isAuthenticated,
  isFetching,
  isEditing,
  Like = null,
  handleNext,
  handlePrev,
  handleEdit,
  handleCancel,
  handleOnChange,
  handleOnSubmit,
}) => {
  const url = getURL(medium);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen
    >
      <Helmet>
        <title>
          {medium.name || striptags(medium.body).substring(0, 60)}
        </title>
        <meta name="description" content={striptags(medium.body)} />
      </Helmet>
      <DialogTitle disableTypography>
        <IconButton aria-label="close" onClick={handleClose} edge="start">
          <CloseIcon />
        </IconButton>
        <IconButton aria-label="home" component="a" href="/">
          <HomeIcon />
        </IconButton>
        <IconButton aria-label="link" component="a" href={url}>
          <LinkIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <Lightbox
        medium={medium}
        steps={itemCount}
        activeStep={medium.id}
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
          <MediaMenu
            medium={medium}
            viewer={viewer}
            handleEdit={handleEdit}
            key={`${namespace}-menu-${medium.id}`}
          />}
        actions={isAuthenticated && Like &&
          <Like
            node={medium}
            key={`like-${medium.id}`}
          />}
        stats={
          <>
            <Likes node={medium} key={`likes-${medium.id}`} />
            <CommentStats node={medium} />
          </>
        }
        comments={
          <MediumComments
            parent={medium}
            canAdd={isAuthenticated && medium.openToComment}
            key={`${namespace}-comments-${medium.id}`}
            cardProps={{ variant: 'outlined' }}
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
            disabled={index >= itemCount - 1}
            fullWidth
            variant="outlined"
          >
            <NextIcon />
          </Button>
        }
        prevAction={
          <Button
            onClick={handlePrev}
            disabled={index === 0}
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

MediaStepperView.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  medium: MediumType.isRequired,
  current: PropTypes.object.isRequired,
  fields: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  itemCount: PropTypes.number.isRequired,
  namespace: PropTypes.string.isRequired,
  viewer: PersonType.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  Like: PropTypes.elementType,
  handleNext: PropTypes.func.isRequired,
  handlePrev: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleOnChange: PropTypes.func.isRequired,
  handleOnSubmit: PropTypes.func.isRequired,
};

export default MediaStepperView;
