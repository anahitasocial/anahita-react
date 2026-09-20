import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import ReactMarkdown from 'react-markdown';
import Container from '@material-ui/core/Container';
import _ from 'lodash';
import path from 'path';

import HeaderMeta from '../components/HeaderMeta';
import * as actions from '../actions';
import i18n from '../languages';

const useStyles = makeStyles((theme) => {
  return {
    root: {
      '& a': {
        color: theme.palette.primary.main,
      },
    },
  };
});

const StaticPage = (props) => {
  const classes = useStyles();
  const [source, setSource] = React.useState('');
  const {
    match: { params },
  } = props;
  const src = path.join(__dirname, `statics/pages/${_.snakeCase(params.alias)}.md`);

  fetch(src).then((response) => {
    return response.text();
  }).then((text) => {
    return setSource(text);
  }).catch((error) => {
    console.error(error);
  });

  const title = `${i18n.t(`pages:${params.alias}`)} - ${process.env.REACT_APP_NAME}`;

  return (
    <Container maxWidth="md">
      <div className={classes.root}>
        <HeaderMeta
          title={title}
        />
        <ReactMarkdown>
          {source}
        </ReactMarkdown>
      </div>
    </Container>
  );
};

StaticPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      chapter: PropTypes.string,
      section: PropTypes.string,
      part: PropTypes.string,
      alias: PropTypes.string,
    }),
  }),
};

const mapStateToProps = () => {
  return {};
};

export default connect(
  mapStateToProps,
)(StaticPage);
