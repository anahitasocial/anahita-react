import React from 'react';
import MediaPage from './media/Media';

class PhotosPage extends React.Component {
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
        key="com:photos.photo"
        namespace="photos"
        queryFilters={filters}
        {...this.params}
      />
    );
  }
}

export default PhotosPage;
