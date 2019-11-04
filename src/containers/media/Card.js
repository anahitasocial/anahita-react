import React from 'react';
import { connect } from 'react-redux';
import MediumCard from '../../components/cards/Medium';
import LikeAction from '../actions/Like';
import PersonType from '../../proptypes/Person';
import MediumType from '../../proptypes/Medium';

import MediumMenu from './Menu';

const MediaCard = (props) => {
  const {
    medium,
    viewer,
  } = props;

  return (
    <MediumCard
      medium={medium}
      menu={
        <MediumMenu
          medium={medium}
          viewer={viewer}
        />
      }
      actions={
        <LikeAction
          node={medium}
          isLiked={medium.isVotedUp}
        />
      }
    />
  );
};

MediaCard.propTypes = {
  medium: MediumType.isRequired,
  viewer: PersonType.isRequired,
};

const mapStateToProps = (state) => {
  const {
    viewer,
  } = state.session;

  return {
    viewer,
  };
};

export default connect(mapStateToProps)(MediaCard);
