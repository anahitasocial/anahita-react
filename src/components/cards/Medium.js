import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Menu from '@material-ui/core/Menu';

import MoreVertIcon from '@material-ui/icons/MoreVert';

import MediumType from '../../proptypes/Medium';
import ActorTitle from '../actor/Title';
import ActorAvatar from '../actor/Avatar';
import EntityBody from '../EntityBody';

import {
  getAuthor,
  getURL,
  getPortraitURL,
  getCoverURL,
} from '../utils';

const styles = (theme) => {
  return {
    cover: {
      height: theme.spacing.unit * 20,
    },
    title: {
      fontSize: 16,
      fontWeight: 500,
      marginBottom: theme.spacing.unit * 2,
    },
    titleLink: {
      textDecoration: 'none',
      color: theme.palette.text.primary,
    },
    portrait: {
      minHeight: theme.spacing.unit * 40,
    },
    authorName: {
      fontSize: 16,
    },
    ownerName: {
      fontSize: 12,
    },
  };
};

class MediumCard extends React.Component {
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
      medium,
      actions,
      menuItems,
    } = this.props;

    const { menuAnchorEl } = this.state;

    const portrait = getPortraitURL(medium);
    const cover = getCoverURL(medium);
    const url = getURL(medium);
    const author = getAuthor(medium);

    return (
      <React.Fragment>
        <Card square>
          {cover &&
            <Link href={url}>
              <CardMedia
                className={classes.cover}
                image={cover}
                title={medium.name}
              />
            </Link>
          }
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
            subheader={
              <ActorTitle
                actor={medium.owner}
                typographyProps={{
                    variant: 'subtitle1',
                    className: classes.ownerName,
                }}
                linked
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
                  id="simple-menu"
                  anchorEl={menuAnchorEl}
                  open={Boolean(menuAnchorEl)}
                  onClose={this.handleCloseMenu}
                >
                  {menuItems}
                </Menu>
              </React.Fragment>
            }
          />
          {portrait &&
            <Link href={url}>
              <CardMedia
                className={classes.portrait}
                title={medium.name}
                image={portrait}
              />
            </Link>
          }
          <CardContent>
            {medium.name &&
              <Typography
                variant="h6"
                className={classes.title}
              >
                <Link href={url}>
                  {medium.name}
                </Link>
              </Typography>
            }
            {medium.body &&
              <EntityBody>
                {medium.body}
              </EntityBody>
            }
          </CardContent>
          {actions &&
            <CardActions>
              {actions}
            </CardActions>
          }
        </Card>
      </React.Fragment>
    );
  }
}

MediumCard.propTypes = {
  classes: PropTypes.object.isRequired,
  actions: PropTypes.node.isRequired,
  menuItems: PropTypes.node.isRequired,
  medium: MediumType.isRequired,
};

export default withStyles(styles)(MediumCard);
