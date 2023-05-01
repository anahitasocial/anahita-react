const isSocialMediaAgent = () => {
  const userAgent = navigator.userAgent || window.opera;

  console.debug('userAgent', userAgent);

  const userAgentBots = [
    'facebookexternalhit',
    'Twitterbot',
    'Pinterest',
    'WhatsApp',
    'Instagram',
    'LinkedInBot',
    'SkypeUriPreview',
    // iphone messenger
    'Facebot',
    // android messenger
    'ia_archiver',
    // signal app
    'Signal',
  ];

  const regex = new RegExp(userAgentBots.join('|'), 'i');

  return regex.test(userAgent);
};

export default {
  isSocialMediaAgent,
};
