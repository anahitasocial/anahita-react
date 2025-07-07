import React from 'react';
import PropTypes from 'prop-types';

import ComposerDefault from './Default';
import ArticleForm from '../../../components/composer/forms/Article';
import FileForm from '../../../components/composer/forms/File';
import NoteForm from '../../../components/composer/forms/Note';
import TopicForm from '../../../components/composer/forms/Topic';

import AcctorType from '../../../proptypes/Actor';
import utils from '../../../utils';

const { form } = utils;

const MediaComposer = (props) => {
  const {
    actor,
    namespace,
  } = props;

  switch (namespace) {
    case 'articles': {
      const formFields = form.createFormFields([
        'name',
        'body',
        'excerpt',
      ]);
      const ArticleComposer = ComposerDefault('articles');

      return (
        <ArticleComposer
          actor={actor}
          namespace={namespace}
          formFields={formFields}
          formComponent={ArticleForm}
          key={`composer-${namespace}`}
        />
      );
    }
    case 'documents': {
      const formFields = form.createFormFields([
        'name',
        'body',
      ]);
      const supportedMimetypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      const DocumentComposer = ComposerDefault('documents');

      return (
        <DocumentComposer
          actor={actor}
          namespace={namespace}
          formFields={formFields}
          formComponent={FileForm}
          supportedMimetypes={supportedMimetypes}
          key={`composer-${namespace}`}
        />
      );
    }
    case 'photos': {
      const formFields = form.createFormFields([
        'name',
        'body',
      ]);
      const supportedMimetypes = [
        'image/jpeg',
        'image/png',
      ];
      const PhotoComposer = ComposerDefault('photos');

      return (
        <PhotoComposer
          actor={actor}
          namespace={namespace}
          formFields={formFields}
          formComponent={FileForm}
          supportedMimetypes={supportedMimetypes}
          key={`composer-${namespace}`}
        />
      );
    }
    case 'notes': {
      const formFields = form.createFormFields([
        'name',
        'body',
      ]);
      const NoteComposer = ComposerDefault('notes');

      return (
        <NoteComposer
          actor={actor}
          namespace={namespace}
          formFields={formFields}
          formComponent={NoteForm}
          key={`composer-${namespace}`}
        />
      );
    }
    case 'topics': {
      const formFields = form.createFormFields([
        'name',
        'body',
      ]);
      const TopicComposer = ComposerDefault('topics');

      return (
        <TopicComposer
          actor={actor}
          namespace={namespace}
          formFields={formFields}
          formComponent={TopicForm}
          key={`composer-${namespace}`}
        />
      );
    }
    default:
      return (<></>);
  }
};

MediaComposer.propTypes = {
  actor: AcctorType.isRequired,
  namespace: PropTypes.string.isRequired,
};

export default MediaComposer;
