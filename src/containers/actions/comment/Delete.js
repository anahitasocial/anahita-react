import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';

import actions from '../../../actions/comments';
import CommentType from '../../../proptypes/Comment';
import NodeType from '../../../proptypes/Node';
import i18n from '../../../languages';

class ActionsCommentDelete extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDeleted: false,
      isFetching: false,
    };

    this.handleDelete = this.handleDelete.bind(this);
  }

  componentWillMount() {
    const { isDeleted } = this.props;
    this.setState({ isDeleted });
  }

  componentWillReceiveProps() {
    this.setState({ isFetching: false });
  }

  handleDelete(event) {
    event.preventDefault();

    const { comment, node, deleteItem } = this.props;

    deleteItem(comment, node);
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
    deleteItem: (comment, node) => {
      return dispatch(actions.deleteItem(comment, node));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActionsCommentDelete);
