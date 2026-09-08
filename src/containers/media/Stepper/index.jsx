/* eslint-disable no-undef */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ControlLike from '../../likes/controls/Like';
import MediaStepperView from './Stepper';
import MEDIUM_DEFAULT from '../../../proptypes/MediumDefault';
import PersonType from '../../../proptypes/Person';
import MediaType from '../../../proptypes/Media';
import actions from '../../../actions';
import form from '../../../utils/form';
import utils from '../../../utils';

const { getPortraitURL, getNamespace } = utils.node;

const formFields = form.createFormFields(['name', 'body']);

// Arrow keys belong to whatever the viewer is typing in — a comment box, the
// edit form — before they belong to the stepper.
const isTypingTarget = (target) => {
  if (!target) return false;
  if (target.isContentEditable) return true;
  return ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
};

const MediaStepper = ({
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
}) => {
  const nextImageRef = useRef(new Image());
  const prevImageRef = useRef(new Image());

  const [isEditing, setIsEditing] = useState(false);
  const [fields, setFields] = useState(formFields);
  const [currentId, setCurrentId] = useState(mediumId);
  const [current, setCurrent] = useState({ ...MEDIUM_DEFAULT });

  // byId is a plain object, so its keys are strings while allIds holds whatever
  // the API sent — numbers, here. Compare as strings so the index resolves
  // either way; a -1 would send Next to the top of the list.
  const currentIndex = items.allIds.findIndex((id) => {
    return String(id) === String(currentId);
  });
  const medium = items.byId[currentId];

  // The browse list reuses one mounted stepper, so a second thumbnail click
  // only changes this prop.
  useEffect(() => {
    setCurrentId(mediumId);
  }, [mediumId]);

  useEffect(() => {
    if (error) alertError('Something went wrong!');
    if (success) alertSuccess('Updated successfully.');
  }, [error, success]);

  const hasNext = currentIndex > -1 && currentIndex < items.allIds.length - 1;
  const hasPrev = currentIndex > 0;

  const handleNext = useCallback(() => {
    const nextId = items.allIds[currentIndex + 1];
    if (nextId) setCurrentId(nextId);
  }, [currentIndex, items]);

  const handlePrev = useCallback(() => {
    const prevId = items.allIds[currentIndex - 1];
    if (prevId) setCurrentId(prevId);
  }, [currentIndex, items]);

  const handleKeydown = useCallback((event) => {
    if (isEditing) return;
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (isTypingTarget(event.target)) return;
    if (event.code === 'ArrowRight') handleNext();
    if (event.code === 'ArrowLeft') handlePrev();
  }, [isEditing, handleNext, handlePrev]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [handleKeydown]);

  // Warm the neighbours so stepping through a gallery does not flash a spinner.
  useEffect(() => {
    const nextImage = nextImageRef.current;
    const prevImage = prevImageRef.current;
    const nextId = items.allIds[currentIndex + 1];
    const prevId = items.allIds[currentIndex - 1];

    if (nextId) nextImage.src = getPortraitURL(items.byId[nextId], 'large');
    if (prevId) prevImage.src = getPortraitURL(items.byId[prevId], 'large');

    return () => {
      nextImage.src = '';
      prevImage.src = '';
    };
  }, [currentIndex, items]);

  const handleEdit = useCallback(() => {
    setCurrent({ ...items.byId[currentId] });
    setIsEditing(true);
  }, [currentId, items]);

  const handleCancel = useCallback(() => {
    setCurrent({ ...MEDIUM_DEFAULT });
    setIsEditing(false);
  }, []);

  // Stepping away from a medium mid-edit would submit the change against the
  // one now on screen.
  useEffect(() => {
    handleCancel();
  }, [currentId, handleCancel]);

  const handleOnChange = useCallback((event) => {
    const { name, value } = event.target;
    setCurrent((prev) => {
      return { ...prev, [name]: value };
    });
    setFields((prev) => {
      return { ...form.validateField(event.target, prev) };
    });
  }, []);

  const handleOnSubmit = useCallback((event) => {
    event.preventDefault();
    const newFields = form.validateForm(event.target, fields);
    if (form.isValid(newFields)) {
      const formData = form.fieldsToData(newFields);
      editItem({ id: current.id, ...formData }).then(handleCancel);
    }
    setFields({ ...newFields });
  }, [fields, current, editItem, handleCancel]);

  const Like = useMemo(() => {
    if (!medium) return null;
    return ControlLike(getNamespace(medium));
  }, [medium && medium.type]);

  if (!medium) return null;

  return (
    <MediaStepperView
      open={open}
      handleClose={handleClose}
      medium={medium}
      current={current}
      fields={fields}
      index={currentIndex}
      itemCount={items.allIds.length}
      namespace={namespace}
      viewer={viewer}
      isAuthenticated={isAuthenticated}
      isFetching={isFetching}
      isEditing={isEditing}
      hasNext={hasNext}
      hasPrev={hasPrev}
      Like={Like}
      handleNext={handleNext}
      handlePrev={handlePrev}
      handleEdit={handleEdit}
      handleCancel={handleCancel}
      handleOnChange={handleOnChange}
      handleOnSubmit={handleOnSubmit}
    />
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
    const { isFetching, error, success } = state[namespace];
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
