import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import ArticlesIcon from '@material-ui/icons/LibraryBooks';
import DocumentsIcon from '@material-ui/icons/PictureAsPdf';
import NotesIcon from '@material-ui/icons/Note';
import PhotosIcon from '@material-ui/icons/Photo';
import TopicsIcon from '@material-ui/icons/QuestionAnswer';
import TodosIcon from '@material-ui/icons/AssignmentTurnedIn';

const useStyles = makeStyles({
  icon: {
    fontSize: 20,
  },
});

const StyledIcon = ({ component: Component, ...props }) => {
  const classes = useStyles();
  return (
    <Component className={classes.icon} {...props} />
  );
};

StyledIcon.propTypes = {
  component: PropTypes.node.isRequired,
};

export default {
  Articles: <StyledIcon component={ArticlesIcon} />,
  Documents: <StyledIcon component={DocumentsIcon} />,
  Notes: <StyledIcon component={NotesIcon} />,
  Photos: <StyledIcon component={PhotosIcon} />,
  Topics: <StyledIcon component={TopicsIcon} />,
  Todos: <StyledIcon component={TodosIcon} />,
};
