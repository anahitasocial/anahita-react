import React from 'react';
import PropTypes from 'prop-types';
import striptags from 'striptags';
import { Helmet } from 'react-helmet-async';
import withStyles from '@material-ui/core/styles/withStyles';

import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import CloseIcon from '@material-ui/icons/Close';
import HomeIcon from '@material-ui/icons/Home';
import LinkIcon from '@material-ui/icons/Link';

import PersonType from '../../../proptypes/Person';
import MediumType from '../../../proptypes/Medium';

import MediumComments from '../../comments/Browse';
import LocationsGadget from '../../locations/Gadget';
import Likes from '../../likes';
import CommentStats from '../../../components/CommentStats';
import MediaMenu from '../MediaMenu';
import Lightbox from './Lightbox';
import MediumForm from '../EditForm';

import i18n from '../../../languages';
import utils from '../../../utils';

const { getURL } = utils.node;

const styles = (theme) => {
  return {
    toolbar: {
      flexShrink: 0,
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    title: {
      flexGrow: 1,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    position: {
      flexShrink: 0,
      marginRight: theme.spacing(1),
      color: theme.palette.text.secondary,
      fontVariantNumeric: 'tabular-nums',
    },
  };
};

const getTitle = (medium) => {
  return medium.name || striptags(medium.body || '').substring(0, 60);
};

const MediaStepperView = ({
  classes,
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
  hasNext,
  hasPrev,
  Like = null,
  handleNext,
  handlePrev,
  handleEdit,
  handleCancel,
  handleOnChange,
  handleOnSubmit,
}) => {
  const url = getURL(medium);
  const title = getTitle(medium);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen
      aria-labelledby="medium-stepper-title"
    >
      <Helmet>
        <title>
          {title}
        </title>
        <meta name="description" content={striptags(medium.body || '')} />
      </Helmet>
      <Toolbar className={classes.toolbar} variant="dense">
        <Tooltip title={i18n.t('commons:close')}>
          <IconButton aria-label={i18n.t('commons:close')} onClick={handleClose} edge="start">
            <CloseIcon />
          </IconButton>
        </Tooltip>
        <Typography
          id="medium-stepper-title"
          variant="subtitle1"
          className={classes.title}
        >
          {title}
        </Typography>
        {itemCount > 1 && index > -1 &&
          <Typography variant="body2" className={classes.position}>
            {i18n.t('media:stepper.position', {
              index: index + 1,
              total: itemCount,
            })}
          </Typography>}
        <Tooltip title={i18n.t('media:stepper.permalink')}>
          <IconButton aria-label={i18n.t('media:stepper.permalink')} component="a" href={url}>
            <LinkIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={i18n.t('media:stepper.home')}>
          <IconButton aria-label={i18n.t('media:stepper.home')} component="a" href="/" edge="end">
            <HomeIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
      <Divider />
      <Lightbox
        medium={medium}
        editing={isEditing}
        hasNext={hasNext}
        hasPrev={hasPrev}
        handleNext={handleNext}
        handlePrev={handlePrev}
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
            canAdd={isAuthenticated && medium.commentStatus}
            key={`${namespace}-comments-${medium.id}`}
            cardProps={{ variant: 'outlined' }}
          />
        }
        locations={
          <LocationsGadget
            node={medium}
            viewer={viewer}
            key={`${namespace}-locations-${medium.id}`}
          />
        }
      />
    </Dialog>
  );
};

MediaStepperView.propTypes = {
  classes: PropTypes.object.isRequired,
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
  hasNext: PropTypes.bool.isRequired,
  hasPrev: PropTypes.bool.isRequired,
  Like: PropTypes.elementType,
  handleNext: PropTypes.func.isRequired,
  handlePrev: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleOnChange: PropTypes.func.isRequired,
  handleOnSubmit: PropTypes.func.isRequired,
};

export default withStyles(styles)(MediaStepperView);
