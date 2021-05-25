import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/Remove';

import TagType from '../../../../proptypes/Location';
import NodeType from '../../../../proptypes/Node';
import actions from '../../../../actions';

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
      {!isWaiting && <RemoveIcon />}
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
      return dispatch(actions.locationsGraph.deleteItem(node)(tag));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActionsTagsLocationDelete);
