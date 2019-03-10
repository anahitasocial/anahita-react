import React from 'react';
import ActorsBrowse from '../actors/Browse';

class PeopleBrowse extends React.Component {
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
      <ActorsBrowse
        key="com:people.person"
        namespace="people"
        queryFilters={filters}
        {...this.params}
      />
    );
  }
}

export default PeopleBrowse;
