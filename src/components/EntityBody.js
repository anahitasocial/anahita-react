import React from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import gfm from 'remark-gfm';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => {
  const { body1, body2 } = theme.typography;
  return {
    root: {
      '& a': {
        color: theme.palette.primary.main,
        textDecoration: 'none',
      },
    },
    body1,
    body2,
  };
});

const EntityBody = (props) => {
  const classes = useStyles();
  const {
    children,
    size,
  } = props;

  return (
    <ReactMarkdown
      remarkPlugins={[gfm]}
      className={classNames(
        classes.root,
        classes[size],
      )}
    >
      {children}
    </ReactMarkdown>
  );
};

EntityBody.propTypes = {
  children: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['body1', 'body2']),
};

EntityBody.defaultProps = {
  size: 'body1',
};

export default EntityBody;
