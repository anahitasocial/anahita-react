import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';

import TagType from '../../../../proptypes/Location';
import NodeType from '../../../../proptypes/Node';
import actions from '../../../../actions';

const ActionsTagsLocationAdd = React.forwardRef((props, ref) => {
  const {
    addTag,
    node,
    tag,
    callback,
  } = props;

  const [isWaiting, setIsWaiting] = useState(false);

  return (
    <IconButton
      edge="end"
      aria-label="delete"
      ref={ref}
      onClick={() => {
        setIsWaiting(true);
        addTag(node, tag).then(() => {
          setIsWaiting(false);
          callback();
        });
      }}
    >
      {!isWaiting && <AddIcon />}
      {isWaiting && <CircularProgress size={20} />}
    </IconButton>
  );
});

ActionsTagsLocationAdd.propTypes = {
  addTag: PropTypes.func.isRequired,
  node: NodeType.isRequired,
  tag: TagType.isRequired,
  callback: PropTypes.func.isRequired,
};

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    addTag: (node, tag) => {
      return dispatch(actions.locationsGraph.add(node)(tag));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActionsTagsLocationAdd);
