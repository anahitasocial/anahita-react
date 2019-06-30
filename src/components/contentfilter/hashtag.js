const baseURL = window.location.origin.toString();

const contentfilterHashtag = (props) => {
  const { text, classes } = props;
  const regex = /#([\S[\u1F600-\u1F64F\u1F300-\u1F5FF\u1F680-\u1F6FF]{2,})(?![^<]*>)/g;
  return text.replace(regex, `<a class="${classes}" href="${baseURL}/hashtags/$1/">#$1</a>`);
};

export default contentfilterHashtag;
