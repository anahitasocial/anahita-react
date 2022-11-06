import React from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import gfm from 'remark-gfm';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';

import cFilter from './contentfilter';

const useStyles = makeStyles((theme) => {
  const { body1, body2 } = theme.typography;
  return {
    root: {
      '& a': {
        color: theme.palette.primary.main,
        textDecoration: 'none',
        wordWrap: 'break-word',
      },
      '& pre': {
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(1),
        overflowX: 'scroll',
      },
      '& code': {
        overflowX: 'scroll',
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
    contentFilter,
    filters,
  } = props;

  let body = `${children}`;

  if (contentFilter) {
    body = cFilter({
      text: children,
      filters,
    });
  }

  return (
    <ReactMarkdown
      remarkPlugins={[gfm]}
      className={classNames(
        classes.root,
        classes[size],
      )}
    >
      {body}
    </ReactMarkdown>
  );
};

EntityBody.propTypes = {
  children: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['body1', 'body2']),
  contentFilter: PropTypes.bool,
  filters: PropTypes.arrayOf(PropTypes.string),
};

EntityBody.defaultProps = {
  size: 'body1',
  contentFilter: false,
  filters: [
    'hashtag',
    'mention',
    // 'url',
  ],
};

export default EntityBody;
