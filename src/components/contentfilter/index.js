import hashtagFilter from './hashtag';
import mentionFilter from './mention';

const contentfilter = (props) => {
  const { text, filters } = props;
  let result = text;

  if (filters.includes('hashtag')) {
    result = hashtagFilter(result);
  }

  if (filters.includes('mention')) {
    result = mentionFilter(result);
  }

  return result;
};

export default contentfilter;
