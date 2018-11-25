import React from 'react';
import ActorSettingsPage from '../actors/ActorSettings';


const PersonSettingsPage = (params) => {
  return (
    <ActorSettingsPage
      key="com:people.person"
      namespace="people"
      {...params}
    />
  );
};

export default PersonSettingsPage;
