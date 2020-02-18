import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import EntityBody from '../../EntityBody';
import ActorType from '../../../proptypes/Actor';
import contentfilter from '../../contentfilter';

const styles = (theme) => {
  return {
    root: {
      marginBottom: theme.spacing(2),
    },
  };
};

const ActorBodyAbout = (props) => {
  const { actor: { body }, classes } = props;

  return (
    <Card className={classes.root}>
      <CardHeader
        title={
          <Typography
            variant="h3"
            style={{
              fontSize: 24,
            }}
          >
            About
          </Typography>
        }
      />
      <CardContent>
        <EntityBody>
          {contentfilter({
            text: body,
            filters: [
              'hashtag',
              'mention',
              'url',
            ],
          })}
        </EntityBody>
      </CardContent>
    </Card>
  );
};

ActorBodyAbout.propTypes = {
  classes: PropTypes.object.isRequired,
  actor: ActorType.isRequired,
};

export default withStyles(styles)(ActorBodyAbout);
