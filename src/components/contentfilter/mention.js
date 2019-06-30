const baseURL = window.location.origin.toString();

const contentfilterMention = (props) => {
  const { text, classes } = props;
  const regex = /@(\S{2,})(?![^<]*>)/g;
  return text.replace(regex, `<a class="${classes}" href="${baseURL}/people/$1/">@$1</a>`);
};

export default contentfilterMention;
