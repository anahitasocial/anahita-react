import React from 'react';
import ActorSettingsPage from '../actors/ActorSettingsPage';


const PersonSettingsPage = (params) => {
  return (
    <ActorSettingsPage namespace="people" {...params} />
  );
};

export default PersonSettingsPage;
