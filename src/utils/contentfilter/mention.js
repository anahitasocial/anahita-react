const baseURL = window.location.origin.toString();

const contentfilterMention = (text) => {
  const regex = /@(\S{2,})(?![^<]*>)/g;

  return text.replace(regex, (match, p1) => {
    return `[@${p1}](${baseURL}/people/${p1.toLowerCase()}/)`;
  });
};

export default contentfilterMention;
