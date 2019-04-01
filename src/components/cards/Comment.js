import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import ActorTitle from '../actor/Title';
import ActorAvatar from '../actor/Avatar';
import EntityBody from '../../components/EntityBody';
import CommentType from '../../proptypes/Comment';

const styles = (theme) => {
  return {
    title: {
      fontSize: 16,
      fontWeight: 500,
      marginBottom: theme.spacing.unit * 2,
    },
    titleLink: {
      textDecoration: 'none',
      color: theme.palette.text.primary,
    },
    authorName: {
      fontSize: 16,
    },
  };
};

const CommentCard = (props) => {
  const { comment, classes } = props;
  const { author } = comment;
  return (
    <Card square>
      <CardHeader
        avatar={
          <ActorAvatar
            actor={author}
            linked={Boolean(author.id)}
          />
        }
        title={
          <ActorTitle
            actor={author}
            typographyProps={{
                variant: 'h6',
                className: classes.authorName,
            }}
            linked={Boolean(author.id)}
          />
        }
        /*
        action={
          <React.Fragment>
            <IconButton
              aria-owns={menuAnchorEl ? 'story-menu' : undefined}
              aria-haspopup="true"
              onClick={this.handleOpenMenu}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={this.handleCloseMenu}
            >
              {menuItems}
            </Menu>
          </React.Fragment>
        }
        */
      />
      <CardContent>
        <EntityBody>
          {comment.body}
        </EntityBody>
      </CardContent>
    </Card>
  );
};

CommentCard.propTypes = {
  classes: PropTypes.object.isRequired,
  comment: CommentType.isRequired,
};

export default withStyles(styles)(CommentCard);
