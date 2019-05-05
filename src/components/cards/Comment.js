import React from 'react';
import PropTypes from 'prop-types';
import ReactTimeAgo from 'react-time-ago';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';

import MoreVertIcon from '@material-ui/icons/MoreVert';

import ActorTitle from '../actor/Title';
import ActorAvatar from '../actor/Avatar';
import EntityBody from '../EntityBody';
import CommentType from '../../proptypes/Comment';

const styles = (theme) => {
  return {
    root: {
      backgroundColor: theme.palette.grey[100],
    },
    title: {
      fontSize: 16,
      fontWeight: 500,
      marginBottom: theme.spacing.unit * 2,
    },
    authorName: {
      fontSize: 16,
    },
    content: {
      paddingTop: 0,
    },
  };
};

class CommentCard extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      menuAnchorEl: null,
    };

    this.handleOpenMenu = this.handleOpenMenu.bind(this);
    this.handleCloseMenu = this.handleCloseMenu.bind(this);
  }

  handleOpenMenu(event) {
    this.setState({
      menuAnchorEl: event.currentTarget,
    });
  }

  handleCloseMenu() {
    this.setState({ menuAnchorEl: null });
  }

  render() {
    const {
      comment,
      classes,
      actions,
      menuItems,
    } = this.props;

    const { author, creationTime } = comment;
    const { menuAnchorEl } = this.state;

    return (
      <Card square className={classes.root}>
        <CardHeader
          avatar={
            <ActorAvatar
              actor={author}
              linked={Boolean(author.id)}
              size="small"
            />
          }
          title={
            <ActorTitle
              actor={author}
              linked={Boolean(author.id)}
            />
          }
          subheader={
            <ReactTimeAgo
              date={new Date(creationTime)}
            />
          }
          action={
            <React.Fragment>
              <IconButton
                aria-owns={menuAnchorEl ? 'comment-menu' : undefined}
                aria-haspopup="true"
                onClick={this.handleOpenMenu}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
              <Menu
                id="comment-menu"
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={this.handleCloseMenu}
              >
                {menuItems}
              </Menu>
            </React.Fragment>
          }
        />
        <CardContent className={classes.content}>
          <EntityBody size="small">
            {comment.body}
          </EntityBody>
        </CardContent>
        {actions &&
          <CardActions>
            {actions}
          </CardActions>
        }
      </Card>
    );
  }
}

CommentCard.propTypes = {
  classes: PropTypes.object.isRequired,
  actions: PropTypes.node,
  menuItems: PropTypes.node,
  comment: CommentType.isRequired,
};

CommentCard.defaultProps = {
  actions: null,
  menuItems: null,
};

export default withStyles(styles)(CommentCard);
