import async from './async';

const signup = async('signup');

export default {
  ADD: signup('add'),
  IS_EMAIL: signup('is_email'),
  IS_USERNAME: signup('is_username'),
  FIELDS: {
    // One display name, replacing the GIVEN_NAME/FAMILY_NAME pair.
    //
    // AuthSignupForm already read SIGNUP.FIELDS.NAME while this file still
    // declared the old two, so NAME was undefined and NAME.MAX_LENGTH threw
    // on render — the signup page did not load at all.
    //
    // 100 to match the server, which validates `max=100` on the same field.
    // The pair it replaces capped each half at 30 and had no way to express
    // the space between them.
    NAME: {
      MAX_LENGTH: 100,
      MIN_LENGTH: 1,
    },
    USERNAME: {
      MAX_LENGTH: 30,
      MIN_LENGTH: 3,
    },
    EMAIL: {
      MAX_LENGTH: 80,
      MIN_LENGTH: 10,
    },
    PASSWORD: {
      // 15, matching the server and the invite-accept form. Eight here was
      // the outlier and the asymmetry ran the wrong way: the weakest rule was
      // on the public path anyone can reach.
      MAX_LENGTH: 150,
      MIN_LENGTH: 15,
    },
  },
};
