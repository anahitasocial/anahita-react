export default {
  FILTER: {
    ADMINISTERING: 'administering',
    FOLLOWING: 'following',
  },
  FIELDS: {
    NAME: {
      MAX_LENGTH: 100,
    },
    ALIAS: {
      MAX_LENGTH: 100,
      MIN_LENGTH: 3,
    },
    BODY: {
      MAX_LENGTH: 1000,
    },
    METADATA: {
      MAX_LENGTH: 100,
    },
  },
};
