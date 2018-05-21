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

const styles = theme => ({
  root: {},
  media: {
    height: theme.spacing.unit * 20,
  },
  title: {
    fontSize: 16,
  },
  titleLink: {
    textDecoration: 'none',
    color: theme.palette.primary,
  },
});

let MediumTitle = (props) => {
  const { to, name, classes } = props;
  return (
    <Link
      to={to}
      href={to}
      className={classes.titleLink}
    >
      {name}
    </Link>
  );
};

MediumTitle = withStyles(styles)(MediumTitle);

MediumTitle.propTypes = {
  classes: PropTypes.object.isRequired,
  to: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};


const MediumCard = (props) => {
  const {
    classes,
    author,
    authorAvatar,
    title,
    description,
    portrait,
    createdOn,
    path,
    action,
    owner,
  } = props;

  return (
    <div className={classes.root}>
      <Card>
        <CardHeader
          avatar={authorAvatar}
          title={author}
          subheader={owner}
        />
        {portrait &&
          <Link to={path} href={path}>
            <CardMedia
              className={classes.media}
              image={portrait}
              title={title}
            />
          </Link>
        }
        <CardContent>
          {title &&
            <Typography>
              <Link
                path={path}
                href={path}
              >
                {title}
              </Link>
            </Typography>
          }
          {description &&
          <Typography variant="body1">
            {description}
          </Typography>
          }
        </CardContent>
        <CardActions>
          {action}
        </CardActions>
      </Card>
    </div>
  );
};

MediumCard.propTypes = {
  classes: PropTypes.object.isRequired,
  author: PropTypes.object,
  authorAvatar: PropTypes.node.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  portrait: PropTypes.string,
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
  action: null,
};

export default withStyles(styles)(MediumCard);
