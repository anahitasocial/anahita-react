import hashtagFilter from './hashtag';
import urlFilter from './url';

const styleClasses = 'MuiTypography-root MuiLink-root MuiLink-underlineHover MuiTypography-colorPrimary';

const contentfilter = (props) => {
  const { text, filters } = props;
  let result = text;

  if (filters.includes('url')) {
    result = urlFilter({
      text: result,
      classes: styleClasses,
    });
  }

  if (filters.includes('hashtag')) {
    result = hashtagFilter({
      text: result,
      classes: styleClasses,
    });
  }

  return result;
};

export default contentfilter;
