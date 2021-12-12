import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import striptags from 'striptags';

const HeaderMeta = (props) => {
  const {
    title,
    description,
    image,
    url,
    type,
  } = props;

  const metaTitle = title ? `${title} - ${process.env.REACT_APP_NAME}` : process.env.REACT_APP_NAME;
  const metaDesc = striptags(description).substr(0, 160);
  const twitterCard = image ? 'summary_large_image' : 'summary';

  return (
    <Helmet>
      {metaTitle && [
        <title key="meta-title">{metaTitle}</title>,
        <meta property="og:title" content={metaTitle} key="og-title" />,
      ]}
      {metaDesc && [
        <meta name="description" content={metaDesc} key="meta-description" />,
        <meta property="og:description" content={metaDesc} key="og-description" />,
      ]}
      {image && [
        <meta name="twitter:card" content={twitterCard} key="twitter-card" />,
        <meta property="og:image" content={image} key="og-image" />,
      ]}
      {url && [
        <meta property="og:site" content={url} key="og-site" />,
      ]}
      {type && [
        <meta property="og:type" content={type} key="og-type" />,
      ]}
    </Helmet>
  );
};

HeaderMeta.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  type: PropTypes.string,
};

HeaderMeta.defaultProps = {
  title: process.env.REACT_APP_NAME,
  description: process.env.REACT_APP_DESCRIPTION,
  image: `${window.location.origin}/statics/media/ogimage.jpg`,
  url: window.location.href,
  type: 'website',
};

export default HeaderMeta;
