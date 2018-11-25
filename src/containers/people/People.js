import React from 'react';
import ActorsPage from '../actors/Actors';

class PeoplePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      usertypeFilter: '',
    };
  }

  render() {
    const { usertypeFilter } = this.state;
    const filters = {
      usertypeFilter,
    };

    return (
      <ActorsPage
        key="com:people.person"
        namespace="people"
        queryFilters={filters}
        {...this.params}
      />
    );
  }
}

export default PeoplePage;
