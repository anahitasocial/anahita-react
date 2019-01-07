import React from 'react';
import PropTypes from 'prop-types';
import StoryCard from '../../components/cards/StoryCard';

class StoryContainer extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {};
  }

  render() {
    const { story } = this.props;

    return (
      <StoryCard story={story} />
    );
  }
}

StoryContainer.propTypes = {
  story: PropTypes.object.isRequired,
};

export default StoryContainer;
