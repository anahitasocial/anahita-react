import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';

import * as actions from '../../../actions';
import CommentType from '../../../proptypes/Comment';
import NodeType from '../../../proptypes/Node';
import i18n from '../../../languages';

class ActionsCommentDelete extends React.Component {
  constructor(props) {
    super(props);

    const { isDeleted } = props;

    this.state = {
      isDeleted,
      isFetching: false,
    };

    this.handleDelete = this.handleDelete.bind(this);
  }

  static getDerivedStateFromProps(nextProps) {
    const { isFetching } = nextProps;
    return { isFetching };
  }

  handleDelete(event) {
    event.preventDefault();

    const { comment, node: { objectType }, deleteItem } = this.props;
    const namespace = objectType.split('.')[1];
    deleteItem(comment, namespace);
  }

  render() {
    const { isDeleted, isFetching } = this.state;
    const label = i18n.t('actions:delete');
    const onClick = this.handleDelete;
    const color = isDeleted ? 'primary' : 'inherit';

    return (
      <MenuItem
        onClick={onClick}
        disabled={isFetching}
        color={color}
        aria-label={label}
      >
        {label}
      </MenuItem>
    );
  }
}

ActionsCommentDelete.propTypes = {
  deleteItem: PropTypes.func.isRequired,
  comment: CommentType.isRequired,
  node: NodeType.isRequired,
  isDeleted: PropTypes.bool,
};

ActionsCommentDelete.defaultProps = {
  isDeleted: false,
};


const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteItem: (comment, namespace) => {
      return dispatch(actions.comments(namespace).deleteItem(comment));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActionsCommentDelete);
