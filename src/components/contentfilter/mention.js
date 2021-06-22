const baseURL = window.location.origin.toString();

const contentfilterMention = (text) => {
  const regex = /@(\S{2,})(?![^<]*>)/g;
  return text.replace(regex, `[@$1](${baseURL}/people/$1/)`);
};

export default contentfilterMention;
