import React from 'react';
import StoriesContainer from './Stories';

class DashboardPage extends React.Component {
  render() {
    const filters = {
      filter: 'leaders',
    };

    return (
      <StoriesContainer
        key="com:stories.story"
        queryFilters={filters}
        {...this.params}
      />
    );
  }
}

export default DashboardPage;
