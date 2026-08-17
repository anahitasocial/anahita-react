/* eslint-disable no-undef */
import {
  Auth as AUTH,
  Person as PERSON,
  Session as SESSION,
} from '../constants';
import PersonDefault from '../proptypes/PersonDefault';

const { GUEST } = PERSON.FIELDS.USERTYPE;

const { VIEWER_STORAGE_KEY } = AUTH;

// Keyed on having an identity that isn't the guest role, rather than on
// an allowlist of privileged roles. An allowlist reads any viewer whose
// cached profile is missing `usertype` as signed out — which is exactly
// what happened when /oauth/userinfo stopped returning that claim.
const isViewerAuthenticated = (item) => {
  return Boolean(item.id) && item.usertype !== GUEST;
};

const viewer = localStorage.getItem(VIEWER_STORAGE_KEY) ?
  JSON.parse(localStorage.getItem(VIEWER_STORAGE_KEY)) :
  { ...PersonDefault };

const initState = {
  viewer,
  // Optimistic, from cache — good enough to render the signed-in shell
  // without a flash, but not authoritative. /oauth/userinfo decides.
  isAuthenticated: isViewerAuthenticated(viewer),
  // Whether that check has come back yet. Routes that redirect on
  // `isAuthenticated` must wait for this, or they bounce a signed-in
  // viewer to the login screen before the request has even been sent.
  isResolved: false,
  isFetching: false,
  success: false,
  error: '',
};

export default (state = { ...initState }, action) => {
  switch (action.type) {
    case SESSION.RESET:
      return {
        ...state,
        isFetching: false,
        success: false,
        error: '',
      };
    case SESSION.READ.REQUEST:
    case SESSION.ADD.REQUEST:
      return {
        ...state,
        isFetching: true,
        success: false,
        error: '',
      };
    case SESSION.READ.SUCCESS:
    case SESSION.ADD.SUCCESS:
      localStorage.setItem(VIEWER_STORAGE_KEY, JSON.stringify(action.viewer));
      // A 200 from the endpoint is itself proof of a live session — it
      // 401s otherwise — so this doesn't go back through the viewer.
      return {
        ...state,
        viewer: action.viewer,
        isAuthenticated: true,
        isResolved: true,
        isFetching: false,
        success: true,
        error: '',
      };
    case SESSION.READ.FAILURE: {
      // A 401 is the server saying the session is gone. That's
      // authoritative, so drop the cached viewer — otherwise a stale
      // one keeps the app looking signed in until the tab is closed.
      // Any other failure (offline, 5xx) says nothing about the
      // session: keep what we have and let the next request retry.
      const isUnauthorized = action.status === 401;

      if (isUnauthorized) {
        localStorage.removeItem(VIEWER_STORAGE_KEY);
      }

      return {
        ...state,
        viewer: isUnauthorized ? { ...PersonDefault } : state.viewer,
        isAuthenticated: isUnauthorized ? false : state.isAuthenticated,
        isResolved: true,
        isFetching: false,
        success: false,
        error: action.error,
      };
    }
    case SESSION.ADD.FAILURE:
      return {
        ...state,
        viewer: { ...PersonDefault },
        isAuthenticated: false,
        isResolved: true,
        isFetching: false,
        success: false,
        error: action.error,
      };
    case SESSION.DELETE.REQUEST:
      return {
        ...state,
        isAuthenticated: false,
        isFetching: true,
        success: false,
        error: '',
      };
    case SESSION.DELETE.SUCCESS:
      localStorage.removeItem(VIEWER_STORAGE_KEY);
      return {
        ...state,
        viewer: { ...PersonDefault },
        isAuthenticated: false,
        isFetching: false,
        error: '',
      };
    case SESSION.DELETE.FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        success: false,
        error: action.error,
      };
    default:
      return state;
  }
};
