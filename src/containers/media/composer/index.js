import React from 'react';
import PropTypes from 'prop-types';

import ComposerDefault from './Default';
import ArticleForm from '../../../components/composer/forms/Article';
import FileForm from '../../../components/composer/forms/File';
import NoteForm from '../../../components/composer/forms/Note';
import TodoForm from '../../../components/composer/forms/Todo';
import TopicForm from '../../../components/composer/forms/Topic';

import AcctorType from '../../../proptypes/Actor';
import utils from '../../../utils';

const { form } = utils;

const MediaComposer = (props) => {
  const {
    owner,
    namespace,
  } = props;

  switch (namespace) {
    case 'articles': {
      const formFields = form.createFormFields([
        'name',
        'body',
        'excerpt',
      ]);
      const ArticlesComposer = ComposerDefault('articles');

      return (
        <ArticlesComposer
          owner={owner}
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
      const DocumentsComposer = ComposerDefault('documents');

      return (
        <DocumentsComposer
          owner={owner}
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
        'body',
      ]);
      const supportedMimetypes = [
        'image/jpeg',
        'image/png',
      ];
      const PhotosComposer = ComposerDefault('photos');

      return (
        <PhotosComposer
          owner={owner}
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
      const NotesComposer = ComposerDefault('notes');

      return (
        <NotesComposer
          owner={owner}
          namespace={namespace}
          formFields={formFields}
          formComponent={NoteForm}
          key={`composer-${namespace}`}
        />
      );
    }
    case 'todos': {
      const formFields = form.createFormFields([
        'name',
        'body',
      ]);
      const TodosComposer = ComposerDefault('todos');

      return (
        <TodosComposer
          owner={owner}
          namespace={namespace}
          formFields={formFields}
          formComponent={TodoForm}
          key={`composer-${namespace}`}
        />
      );
    }
    case 'topics': {
      const formFields = form.createFormFields([
        'name',
        'body',
      ]);
      const TopicsComposer = ComposerDefault('topics');

      return (
        <TopicsComposer
          owner={owner}
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
  owner: AcctorType.isRequired,
  namespace: PropTypes.string.isRequired,
};

export default MediaComposer;
