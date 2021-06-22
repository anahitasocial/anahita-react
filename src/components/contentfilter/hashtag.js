const baseURL = window.location.origin.toString();

const contentfilterHashtag = (text) => {
  const regex = /#(\S[\u1F600-\u1F64F\u1F300-\u1F5FF\u1F680-\u1F6FF]{2,})(?![^<]*>)/g;
  return text.replace(regex, `[#$1](${baseURL}/hashtags/$1/)`);
};

export default contentfilterHashtag;
