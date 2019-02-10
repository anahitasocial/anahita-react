import React from 'react';
import { Helmet } from 'react-helmet';
import StoriesContainer from './stories/Stories';

class DashboardPage extends React.Component {
  render() {
    const filters = {
      filter: 'leaders',
    };

    return (
      <React.Fragment>
        <Helmet>
          <title>Dashboard</title>
        </Helmet>
        <StoriesContainer
          key="com:stories.story"
          queryFilters={filters}
          {...this.params}
        />
      </React.Fragment>
    );
  }
}

export default DashboardPage;
