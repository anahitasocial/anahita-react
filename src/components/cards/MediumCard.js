import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

import EntityBody from '../EntityBody';
import PersonType from '../../proptypes/Person';

const styles = (theme) => {
  return {
    media: {
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
      minHeight: theme.spacing.unit * 30,
    },
  };
};

const MediumCard = (props) => {
  const {
    classes,
    cover,
    author,
    authorAvatar,
    title,
    description,
    portrait,
    // createdOn,
    path,
    action,
    owner,
  } = props;

  return (
    <React.Fragment>
      <Card square>
        {cover &&
          <CardMedia
            className={classes.media}
            image={cover}
            title={title}
          />
        }
        <CardHeader
          avatar={authorAvatar}
          title={author}
          subheader={owner}
        />
        {portrait &&
          <CardMedia
            className={classes.portrait}
            title={title}
            image={portrait}
          />
        }
        <CardContent>
          {title &&
            <Typography
              variant="title"
              component="h2"
              className={classes.title}
            >
              <Link
                to={path}
                href={path}
                className={classes.titleLink}
              >
                {title}
              </Link>
            </Typography>
          }
          {description &&
            <EntityBody body={description} />
          }
        </CardContent>
        <CardActions>
          {action}
        </CardActions>
      </Card>
    </React.Fragment>
  );
};

MediumCard.propTypes = {
  classes: PropTypes.object.isRequired,
  author: PersonType,
  authorAvatar: PropTypes.node.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  portrait: PropTypes.string,
  cover: PropTypes.string,
  path: PropTypes.string.isRequired,
  action: PropTypes.node,
  owner: PropTypes.node.isRequired,
  // createdOn: PropTypes.node.isRequired,
};

MediumCard.defaultProps = {
  author: {},
  title: '',
  description: '',
  portrait: '',
  cover: '',
  action: null,
};

export default withStyles(styles)(MediumCard);
