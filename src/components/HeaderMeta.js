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
        <title>{metaTitle}</title>,
        <meta itemprop="name" content={metaTitle} />,
        <meta property="og:title" content={metaTitle} />,
      ]}
      {metaDesc && [
        <meta name="description" content={metaDesc} />,
        <meta itemprop="description" content={metaDesc} />,
        <meta property="og:description" content={metaDesc} />
      ]}
      {image && [
        <meta itemprop="image" content={image} />,
        <meta name="twitter:card" content={twitterCard} />,
        <meta property="og:image" content={image} />,
      ]}
      {url && [
        <meta property="og:site" content={url} />,
      ]}
      {type && [
        <meta property="og:type" content={type} />,
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
  title: '',
  description: process.env.REACT_APP_DESCRIPTION,
  image: `${window.location.origin}/statics/media/ogimage.jpg`,
  url: window.location.href,
  type: 'website',
};

export default HeaderMeta;
