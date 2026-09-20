import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

import HeaderMeta from '../../components/HeaderMeta';
import i18n from '../../languages';
import legal from '../../statics/legal';

const useStyles = makeStyles((theme) => {
  return {
    tabs: {
      marginBottom: theme.spacing(2),
    },
    document: {
      padding: theme.spacing(3),
      '& a': {
        color: theme.palette.primary.main,
      },
      // The boilerplate opens with a blockquote telling the operator to
      // replace it. Styled as a notice so it reads as an instruction, not as
      // part of the terms.
      '& blockquote': {
        margin: theme.spacing(0, 0, 2),
        padding: theme.spacing(1, 2),
        borderLeft: `4px solid ${theme.palette.warning.main}`,
        backgroundColor: theme.palette.action.hover,
      },
    },
  };
});

// The order of the tabs, and the alias each maps to.
//
// Terms first: somebody arriving from "By creating an account you agree to the
// Terms of Service and the Privacy Policy" reads them in that order.
const DOCUMENTS = ['tos', 'privacy'];

// Public, deliberately. People read the terms BEFORE they have an account —
// that is the point of linking them from the signup form.
const LegalPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { tab } = useParams();

  // An unknown alias falls back to the terms rather than rendering nothing.
  // A mistyped link should still land on a legal document.
  const alias = DOCUMENTS.includes(tab) ? tab : DOCUMENTS[0];
  const index = DOCUMENTS.indexOf(alias);

  const [source, setSource] = useState('');

  useEffect(() => {
    let cancelled = false;
    setSource('');

    fetch(legal[alias].file)
      .then((response) => {
        return response.text();
      })
      .then((text) => {
        if (!cancelled) {
          setSource(text);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSource(i18n.t('legal:unavailable'));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [alias]);

  // The URL is the state, so a tab can be linked to and the back button works.
  const handleChange = (event, value) => {
    navigate(`/legal/${DOCUMENTS[value]}`);
  };

  return (
    <Container maxWidth="md">
      <HeaderMeta
        title={`${i18n.t(`legal:${alias}`)} - ${process.env.REACT_APP_NAME}`}
      />
      <Tabs
        value={index}
        onChange={handleChange}
        className={classes.tabs}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        {DOCUMENTS.map((key) => {
          return <Tab key={key} label={i18n.t(`legal:${key}`)} />;
        })}
      </Tabs>
      <Paper className={classes.document}>
        <ReactMarkdown remarkPlugins={[gfm]}>
          {source}
        </ReactMarkdown>
      </Paper>
    </Container>
  );
};

export default LegalPage;
