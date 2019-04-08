import React from 'react';
import PropTypes from 'prop-types';
import ReactTimeAgo from 'react-time-ago';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Menu from '@material-ui/core/Menu';
import Typography from '@material-ui/core/Typography';

import MoreVertIcon from '@material-ui/icons/MoreVert';

import ReadMore from '../../ReadMore';
import StoryMessage from '../../StoryMessage';
import ActorAvatar from '../../actor/Avatar';
import StoryType from '../../../proptypes/Story';
import StoryCardOwner from '../Owner';

import {
  getURL,
  getPortraitURL,
  getCoverURL,
  getStorySubject,
} from '../../utils';

const styles = (theme) => {
  return {
    card: {
      marginBottom: theme.spacing.unit * 2,
    },
    media: {
      height: theme.spacing.unit * 20,
    },
    title: {
      textTransform: 'capitalize',
      marginBottom: theme.spacing.unit * 2,
    },
    authorName: {
      fontSize: 16,
    },
    ownerName: {
      fontSize: 14,
    },
    portrait: {
      minHeight: theme.spacing.unit * 30,
    },
  };
};

class StoryCardDefault extends React.Component {
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
      classes,
      story,
      actions,
      menuItems,
      comments,
      showOwner,
    } = this.props;

    const { menuAnchorEl } = this.state;

    const subject = getStorySubject(story);

    // @Todo add support for array objects
    const portrait = story.object && getPortraitURL(story.object);
    const cover = story.object && getCoverURL(story.object);
    const title = story.object && story.object.name;
    const body = story.object && story.object.body;
    const url = title && story.object ? getURL(story.object) : '';
    const showOwnerHeader = showOwner && (story.subject.id !== story.owner.id);

    return (
      <Card square className={classes.card}>
        {showOwnerHeader &&
          <StoryCardOwner node={story} />
        }
        <CardHeader
          avatar={
            <ActorAvatar
              actor={subject}
              linked={Boolean(subject.id)}
            />
          }
          title={
            <StoryMessage story={story} />
          }
          subheader={
            <ReactTimeAgo
              date={new Date(story.creationTime)}
            />
          }
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
                id="story-menu"
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={this.handleCloseMenu}
              >
                {menuItems}
              </Menu>
            </React.Fragment>
          }
        />
        {cover &&
          <Link href={url}>
            <CardMedia
              className={classes.media}
              image={cover}
              title={title}
            />
          </Link>
        }
        {portrait &&
          <Link href={url}>
            <CardMedia
              className={classes.portrait}
              title={title}
              image={portrait}
            />
          </Link>
        }
        <CardContent>
          {title &&
            <Typography
              variant="h6"
              className={classes.title}
            >
              <Link href={url}>
                {title}
              </Link>
            </Typography>
          }
          {body &&
            <ReadMore>
              {body}
            </ReadMore>
          }
        </CardContent>
        {actions &&
          <CardActions>
            {actions}
          </CardActions>
        }
        <Divider />
        {comments}
      </Card>
    );
  }
}

StoryCardDefault.propTypes = {
  classes: PropTypes.object.isRequired,
  actions: PropTypes.node,
  menuItems: PropTypes.node,
  comments: PropTypes.node.isRequired,
  story: StoryType.isRequired,
  showOwner: PropTypes.bool,
};

StoryCardDefault.defaultProps = {
  showOwner: false,
  actions: null,
  menuItems: null,
};

export default withStyles(styles)(StoryCardDefault);
