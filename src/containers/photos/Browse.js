import React from 'react';
import MediaBrowse from '../media/Browse';

class PhotosBrowse extends React.Component {
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
        key="com:photos.photo"
        namespace="photos"
        queryFilters={filters}
        {...this.params}
      />
    );
  }
}

export default PhotosBrowse;
