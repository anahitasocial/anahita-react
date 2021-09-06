import React from 'react';
import PropTypes from 'prop-types';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';

const HomeCardContent = (props) => {
  const {
    title,
    subtitle,
    body,
    actions,
  } = props;

  return (
    <Card>
      <CardHeader
        title={
          <Typography variant="h6">
            {title}
          </Typography>
        }
        subtitle={subtitle}
      />
      <CardContent>
        {body}
      </CardContent>
      {actions &&
        <CardActions>
          {actions}
        </CardActions>
      }
    </Card>
  );
};

HomeCardContent.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  body: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]).isRequired,
  actions: PropTypes.node,
};

HomeCardContent.defaultProps = {
  subtitle: '',
  actions: null,
};

export default HomeCardContent;
