import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Menu from '@material-ui/core/Menu';
import Typography from '@material-ui/core/Typography';

import MoreVertIcon from '@material-ui/icons/MoreVert';

import ReadMore from '../../ReadMore';
import StoryMessage from '../../StoryMessage';
import ActorTitle from '../../actor/Title';
import ActorAvatar from '../../actor/Avatar';

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
    } = this.props;

    const { menuAnchorEl } = this.state;

    const subject = getStorySubject(story);

    // @Todo add support for array objects
    const portrait = story.object && getPortraitURL(story.object);
    const cover = story.object && getCoverURL(story.object);
    const title = story.object && story.object.name;
    const body = story.object && story.object.body;
    const url = title && story.object ? getURL(story.object) : '';

    return (
      <Card square className={classes.card}>
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
          subheader={
            <ActorTitle
              actor={story.owner}
              typographyProps={{
                  variant: 'subtitle1',
                  className: classes.ownerName,
              }}
              linked
            />
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
      </Card>
    );
  }
}

StoryCardDefault.propTypes = {
  classes: PropTypes.object.isRequired,
  actions: PropTypes.node.isRequired,
  menuItems: PropTypes.node.isRequired,
  story: PropTypes.object.isRequired,
};

export default withStyles(styles)(StoryCardDefault);
