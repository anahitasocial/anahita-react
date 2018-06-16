import React from 'react';
import ActorSettingsPage from '../actors/ActorSettingsPage';


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
