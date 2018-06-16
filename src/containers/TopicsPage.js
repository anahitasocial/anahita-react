import React from 'react';
import MediaPage from './media/MediaPage';

class TopicsPage extends React.Component {
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
        key="com:topics.topic"
        namespace="topics"
        queryFilters={filters}
        {...this.params}
      />
    );
  }
}

export default TopicsPage;
