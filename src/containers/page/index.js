import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import ReactMarkdown from 'react-markdown';
import Container from '@material-ui/core/Container';
import _ from 'lodash';

import HeaderMeta from '../../components/HeaderMeta';
import actions from '../../actions';
import i18n from '../../languages';
import assets from '../../assets';

const useStyles = makeStyles((theme) => {
  return {
    article: {
      fontSize: theme.typography.htmlFontSize,
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
    setAppTitle,
  } = props;

  const alias = _.snakeCase(params.alias);
  const src = assets.pages[alias];

  useEffect(() => {
    setAppTitle(i18n.t(`pages:${params.alias}`));

    fetch(src).then((response) => {
      return response.text();
    }).then((text) => {
      return setSource(text);
    }).catch((err) => {
      console.error(err);
    });
  }, [setAppTitle, params.alias]);

  const title = `${i18n.t(`pages:${params.alias}`)} - ${process.env.REACT_APP_NAME}`;

  return (
    <Container maxWidth="md">
      <HeaderMeta
        title={title}
      />
      <article className={classes.article}>
        <ReactMarkdown>
          {source}
        </ReactMarkdown>
      </article>
    </Container>
  );
};

StaticPage.propTypes = {
  setAppTitle: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      chapter: PropTypes.string,
      section: PropTypes.string,
      part: PropTypes.string,
      alias: PropTypes.string,
    }),
  }),
};

StaticPage.defaultProps = {
  match: {
    params: {
      chapter: '',
      section: '',
      part: '',
      alias: '',
    },
  },
};

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAppTitle: (title) => {
      return dispatch(actions.app.setAppTitle(title));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StaticPage);
