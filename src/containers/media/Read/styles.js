export default (theme) => {
  return {
    cover: {
      height: 0,
      paddingTop: '30%',
    },
    portraitButton: {
      width: '100%',
      display: 'inline',
      cursor: 'zoom-in',
    },
    title: {
      fontSize: 36,
      marginBottom: theme.spacing(2),
    },
    authorName: {
      fontSize: 16,
    },
    ownerName: {
      fontSize: 12,
    },
  };
};
