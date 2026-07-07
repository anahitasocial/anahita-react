import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import inflector from 'inflector-js';
import _ from 'lodash';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import ArticleForm from './Forms/Article';
import FileForm from './Forms/File';
import NoteForm from './Forms/Note';
import TopicForm from './Forms/Topic';
import ComposerDefault from './Default';

import i18n from '../../../languages';
import appIcons from '../../../components/AppIcons';
import ActorType from '../../../proptypes/Actor';
import PersonType from '../../../proptypes/Person';
import utils from '../../../utils';

const { form, node } = utils;

const useStyles = makeStyles({
  root: {
    marginBottom: 8 * 2,
    position: 'sticky',
    top: 8 * 7,
    zIndex: 8,
  },
  tab: {
    fontSize: 12,
  },
});

const COMPOSER_CONFIGS = {
  articles: {
    Composer: ComposerDefault('articles'),
    formFields: form.createFormFields(['name', 'body', 'excerpt']),
    formComponent: ArticleForm,
  },
  documents: {
    Composer: ComposerDefault('documents'),
    formFields: form.createFormFields(['name', 'body']),
    formComponent: FileForm,
    supportedMimetypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  },
  photos: {
    Composer: ComposerDefault('photos'),
    formFields: form.createFormFields(['name', 'body']),
    formComponent: FileForm,
    supportedMimetypes: [
      'image/jpeg',
      'image/png',
    ],
  },
  notes: {
    Composer: ComposerDefault('notes'),
    formFields: form.createFormFields(['name', 'body']),
    formComponent: NoteForm,
  },
  topics: {
    Composer: ComposerDefault('topics'),
    formFields: form.createFormFields(['name', 'body']),
    formComponent: TopicForm,
  },
};

const Composers = ({
  actor,
  viewer,
}) => {
  const classes = useStyles();
  const composers = node.getComposers(actor, viewer);
  const [tab, setTab] = useState(composers[0]);

  if (composers.length === 0) {
    return null;
  }

  const namespace = inflector.pluralize(tab);
  const config = COMPOSER_CONFIGS[namespace];

  return (
    <AppBar
      position="sticky"
      color="inherit"
      className={classes.root}
      variant="outlined"
    >
      {config && (
        <config.Composer
          actor={actor}
          namespace={namespace}
          formFields={config.formFields}
          formComponent={config.formComponent}
          supportedMimetypes={config.supportedMimetypes}
          key={`composer-${namespace}`}
        />
      )}
      <Tabs
        value={tab}
        onChange={(event, value) => {
          return setTab(value);
        }}
        variant="scrollable"
        indicatorColor="primary"
        textColor="primary"
      >
        {composers.map((composer) => {
          return (
            <Tab
              key={`composer-tab-${composer}`}
              label={i18n.t(`apps:${composer}`)}
              value={composer}
              icon={appIcons[_.upperFirst(composer)]}
              className={classes.tab}
            />
          );
        })}
      </Tabs>
    </AppBar>
  );
};

Composers.propTypes = {
  actor: ActorType.isRequired,
  viewer: PersonType.isRequired,
};

export default Composers;
