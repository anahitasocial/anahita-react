import React from 'react';
import ActorsPage from '../actors/ActorsPage';


const GroupsPage = (params) => {
  return (
    <ActorsPage namespace="groups" {...params} />
  );
};

export default GroupsPage;
