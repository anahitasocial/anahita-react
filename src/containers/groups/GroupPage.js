import React from 'react';
import ActorPage from '../actors/ActorPage';


const GroupPage = (params) => {
  return (
    <ActorPage namespace="groups" {...params} />
  );
};

export default GroupPage;
