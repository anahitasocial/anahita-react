import React from 'react';
import PropTypes from 'prop-types';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';

const HomeCardContent = ({
  title = '',
  subheader = '',
  content = null,
  actions = null,
}) => {
  return (
    <Card component="section">
      <CardHeader
        title={
          <Typography variant="h6">
            {title}
          </Typography>
        }
        subheader={subheader}
      />
      {content &&
        <CardContent>
          {content}
        </CardContent>}
      {actions &&
        <CardActions>
          {actions}
        </CardActions>}
    </Card>
  );
};

HomeCardContent.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  actions: PropTypes.node,
};

export default HomeCardContent;
