import React from 'react';
import ActorSettings from '../actors/Settings';


const PeopleSettings = (params) => {
  return (
    <ActorSettings
      key="com:people.person"
      namespace="people"
      {...params}
    />
  );
};

export default PeopleSettings;
