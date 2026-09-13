import axios from 'axios';

// The Terms of Service and Privacy Policy versions currently in force, and
// where to read each.
//
// Public and unauthenticated.
//
// NOT CALLED YET. Signup moved to auth-service and no longer needs it; the
// post-login agreements interstitial will, and is what this is kept for.
//
// The same versions and URLs also ride in NodeInfo's metadata, which this app
// already fetches. Whichever the interstitial reads, the other should go — two
// sources for "which terms are in force" is how they come to disagree.
function read() {
  return axios.get('/agreements');
}

export default {
  read,
};
