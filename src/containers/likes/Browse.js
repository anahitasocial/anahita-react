import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';

import Avatar from '../../components/actor/Avatar';

import * as actions from '../../actions';
// import i18n from '../../languages';
import Progress from '../../components/Progress';

import NodeType from '../../proptypes/Node';
import NodesType from '../../proptypes/Nodes';
import ActionFollow from '../actions/Follow';

const LikesBrowse = (props) => {
  const {
    browseList,
    resetList,
    items,
    node,
    isFetching,
    error,
    namespace,
  } = props;

  useEffect(() => {
    browseList(node);

    return () => {
      resetList(node);
    };
  }, []);

  if (isFetching) {
    return (
      <Progress key="likes-progress" />
    );
  }

  if (error) {
    return (
      <Typography variant="body1" color="error" align="center">
        {error}
      </Typography>
    );
  }

  return (
    <List>
      {items.allIds.map((actorId) => {
        const actor = items.byId[actorId];
        const key = `${namespace}_likes_${actor.id}`;
        return (
          <ListItem key={key}>
            <ListItemAvatar>
              <Avatar
                actor={actor}
                linked
              />
            </ListItemAvatar>
            <ListItemText
              primary={actor.name}
            />
            <ListItemSecondaryAction>
              <ActionFollow actor={actor} />
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  );
};

const mapStateToProps = (namespace) => {
  return (state) => {
    const {
      likes: items,
      isFetching,
      error,
    } = state.likes;

    return {
      items,
      isFetching,
      error,
      namespace,
    };
  };
};

const mapDispatchToProps = (namespace) => {
  return (dispatch) => {
    return {
      browseList: (node) => {
        return dispatch(actions[namespace].likes.browse(node));
      },
      resetList: (node) => {
        return dispatch(actions[namespace].likes.reset(node));
      },
    };
  };
};

LikesBrowse.propTypes = {
  items: NodesType.isRequired,
  node: NodeType.isRequired,
  browseList: PropTypes.func.isRequired,
  resetList: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  namespace: PropTypes.string.isRequired,
};

export default (namespace) => {
  return connect(
    mapStateToProps(namespace),
    mapDispatchToProps(namespace),
  )(LikesBrowse);
};
