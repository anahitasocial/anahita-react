import React from 'react';
import MediaPage from './media/Media';

class ArticlesPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ownerId: 0,
    };
  }

  render() {
    const { ownerId } = this.state;
    const filters = {
      ownerId,
    };

    return (
      <MediaPage
        key="com:articles.article"
        namespace="articles"
        queryFilters={filters}
        {...this.params}
      />
    );
  }
}

export default ArticlesPage;
