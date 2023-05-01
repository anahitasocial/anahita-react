import React from 'react';
import { Redirect } from 'react-router-dom';

const SocialMediaPreviewRedirect = () => {
  const baseURL = process.env.REACT_APP_API_BASE_URL;
  const url = window.location.href.replace(window.location.origin, baseURL) || '';
  // remove / from end of url and add .og
  const urlOg = `${url.replace(/\/$/, '')}.og`;

  window.location.href = urlOg;

  return (<></>);
};

export default SocialMediaPreviewRedirect;
