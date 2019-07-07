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
import contentfilter from '../../contentfilter';
import ReadMore from '../../ReadMore';
import StoryMessage from '../../StoryMessage';
import StoryCardOwner from '../Owner';
import Player from '../../Player';

import {
  getURL,
  getPortraitURL,
  getCoverURL,
} from '../../utils';

const styles = (theme) => {
  return {
    card: {
      marginBottom: theme.spacing(2),
    },
    cover: {
      height: theme.spacing(20),
      marginBottom: theme.spacing(2),
    },
    portrait: {
      height: theme.spacing(40),
      marginBottom: theme.spacing(2),
    },
    title: {
      textTransform: 'capitalize',
      marginBottom: theme.spacing(2),
    },
    content: {
      marginLeft: theme.spacing(2),
      backgroundColor: theme.palette.grey[100],
      borderLeft: 2,
      borderLeftStyle: 'solid',
      borderLeftColor: theme.palette.grey[200],
    },
    authorName: {
      fontSize: 16,
    },
    ownerName: {
      fontSize: 14,
    },
  };
};

class StoryCardComment extends React.Component {
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

    // @Todo add support for array objects
    const portrait = story.object && getPortraitURL(story.object);
    const cover = story.object && getCoverURL(story.object);
    const title = story.object && story.object.name;
    const body = story.object && story.object.body;
    const url = title && story.object ? getURL(story.object) : '';

    return (
      <Card className={classes.card}>
        {showOwner &&
          <StoryCardOwner node={story} />
        }
        <CardHeader
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
              className={classes.cover}
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
        {body &&
          <Player text={body} />
        }
        <CardContent className={classes.content}>
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
              {contentfilter({
                text: body,
                filters: [
                  'hashtag',
                  'mention',
                  'url',
                ],
              })}
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

StoryCardComment.propTypes = {
  classes: PropTypes.object.isRequired,
  actions: PropTypes.node,
  menuItems: PropTypes.node,
  comments: PropTypes.node.isRequired,
  story: PropTypes.object.isRequired,
  showOwner: PropTypes.bool,
};

StoryCardComment.defaultProps = {
  showOwner: false,
  actions: null,
  menuItems: null,
};

export default withStyles(styles)(StoryCardComment);
