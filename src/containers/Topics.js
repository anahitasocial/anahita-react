import React from 'react';
import MediaBrowse from './media/Browse';

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
      <MediaBrowse
        key="com:topics.topic"
        namespace="topics"
        queryFilters={filters}
        {...this.params}
      />
    );
  }
}

export default TopicsPage;
