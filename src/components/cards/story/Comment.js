import React from 'react';
import PropTypes from 'prop-types';
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
import ActorTitle from '../../actor/Title';

import {
  getURL,
  getPortraitURL,
  getCoverURL,
} from '../../utils';

const styles = (theme) => {
  return {
    card: {
      marginBottom: theme.spacing.unit * 2,
    },
    cover: {
      height: theme.spacing.unit * 20,
      marginBottom: theme.spacing.unit * 2,
    },
    portrait: {
      height: theme.spacing.unit * 40,
      marginBottom: theme.spacing.unit * 2,
    },
    title: {
      textTransform: 'capitalize',
      marginBottom: theme.spacing.unit * 2,
    },
    content: {
      marginLeft: theme.spacing.unit * 2,
      backgroundColor: theme.palette.background.default,
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
    } = this.props;

    const { menuAnchorEl } = this.state;

    // @Todo add support for array objects
    const portrait = story.object && getPortraitURL(story.object);
    const cover = story.object && getCoverURL(story.object);
    const title = story.object && story.object.name;
    const body = story.object && story.object.body;
    const url = title && story.object ? getURL(story.object) : '';

    return (
      <Card square className={classes.card}>
        <CardHeader
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
  actions: PropTypes.node.isRequired,
  menuItems: PropTypes.node.isRequired,
  comments: PropTypes.node.isRequired,
  story: PropTypes.object.isRequired,
};

export default withStyles(styles)(StoryCardDefault);
