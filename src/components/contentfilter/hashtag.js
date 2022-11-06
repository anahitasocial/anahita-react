const baseURL = window.location.origin.toString();

const contentfilterHashtag = (text) => {
  const regex = /(^|\s)#(\S[\u1F600-\u1F64F\u1F300-\u1F5FF\u1F680-\u1F6FF]{2,})(?![^<]*>)/g;

  return text.replace(regex, (match, p1, p2) => {
    return ` [#${p2}](${baseURL}/hashtags/${p2.toLowerCase()}/)`;
  });
};

export default contentfilterHashtag;
