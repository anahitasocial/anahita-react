import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Clear';

import TagType from '../../../../proptypes/Location';
import NodeType from '../../../../proptypes/Node';
import * as actions from '../../../../actions';

const ActionsTagsLocationDelete = React.forwardRef((props, ref) => {
  const {
    deleteTag,
    node,
    tag,
  } = props;

  const [isWaiting, setIsWaiting] = useState(false);

  return (
    <IconButton
      edge="end"
      aria-label="delete"
      ref={ref}
      onClick={() => {
        setIsWaiting(true);
        deleteTag(node, tag);
      }}
    >
      {!isWaiting && <DeleteIcon />}
      {isWaiting && <CircularProgress size={20} />}
    </IconButton>
  );
});

ActionsTagsLocationDelete.propTypes = {
  deleteTag: PropTypes.func.isRequired,
  node: NodeType.isRequired,
  tag: TagType.isRequired,
};

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteTag: (node, tag) => {
      return dispatch(actions.locationsGraph(node).deleteItem(tag));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActionsTagsLocationDelete);
