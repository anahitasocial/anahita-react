import React from 'react';
import ActorPage from '../actors/ActorPage';


const PersonPage = (params) => {
  return (
    <ActorPage namespace="people" {...params} />
  );
};

export default PersonPage;
