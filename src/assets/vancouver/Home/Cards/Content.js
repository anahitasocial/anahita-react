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
    content,
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
      {content &&
        <CardContent>
          {content}
        </CardContent>
      }
      {actions &&
        <CardActions>
          {actions}
        </CardActions>
      }
    </Card>
  );
};

HomeCardContent.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  actions: PropTypes.node,
};

HomeCardContent.defaultProps = {
  title: '',
  subtitle: '',
  content: null,
  actions: null,
};

export default HomeCardContent;
