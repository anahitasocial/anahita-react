import {
  PERSON_BROWSE_REQUEST, PERSON_BROWSE_SUCCESS, PERSON_BROWSE_FAILURE,
  PERSON_READ_REQUEST, PERSON_READ_SUCCESS, PERSON_READ_FAILURE,
//  PERSON_EDIT_REQUEST, PERSON_EDIT_SUCCESS, PERSON_EDIT_FAILURE,
//  PERSON_ADD_REQUEST, PERSON_ADD_SUCCESS, PERSON_ADD_FAILURE,
  PERSON_DELETE_REQUEST, PERSON_DELETE_SUCCESS, PERSON_DELETE_FAILURE,
  PERSON_FOLLOW_REQUEST, PERSON_FOLLOW_SUCCESS, PERSON_FOLLOW_FAILURE,
  PERSON_UNFOLLOW_REQUEST, PERSON_UNFOLLOW_SUCCESS, PERSON_UNFOLLOW_FAILURE,
} from '../constants/people';

export default function (state = {
  isFetching: false,
  people: [],
  person: {},
  deleteSuccess: false,
  followSuccess: false,
  unfollowSuccess: false,
  errorMessage: '',
  keywordFilter: '',
  usertypeFilter: '',
  disabledFilter: false,
  offset: 0,
  limit: 60,
  total: 0,
}, action) {
  switch (action.type) {
    case PERSON_READ_REQUEST:
    case PERSON_BROWSE_REQUEST:
      return {
        ...state,
        isFetching: true,
        person: {},
        people: [],
      };
    case PERSON_BROWSE_SUCCESS:
      return {
        ...state,
        people: action.people,
        offset: action.offset,
        limit: action.limit,
        total: action.total,
        isFetching: false,
      };
    case PERSON_BROWSE_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.errorMessage,
      };
    case PERSON_READ_SUCCESS:
      return {
        ...state,
        isFetching: false,
        person: action.person,
        errorMessage: '',
      };
    case PERSON_READ_FAILURE:
      return {
        ...state,
        isFetching: false,
        person: {},
        errorMessage: action.errorMessage,
      };
    case PERSON_DELETE_REQUEST:
      return {
        ...state,
        person: action.person,
        deleteSuccess: false,
      };
    case PERSON_DELETE_SUCCESS:
      return {
        ...state,
        person: {},
        deleteSuccess: true,
      };
    case PERSON_DELETE_FAILURE:
      return {
        ...state,
        deleteSuccess: false,
        errorMessage: action.errorMessage,
      };
    case PERSON_FOLLOW_REQUEST:
      return {
        ...state,
        person: action.person,
        followSuccess: false,
      };
    case PERSON_FOLLOW_SUCCESS:
      return {
        ...state,
        person: action.person,
        followSuccess: true,
      };
    case PERSON_FOLLOW_FAILURE:
      return {
        ...state,
        followSuccess: false,
        errorMessage: action.errorMessage,
      };
    case PERSON_UNFOLLOW_REQUEST:
      return {
        ...state,
        person: action.person,
        unfollowSuccess: false,
      };
    case PERSON_UNFOLLOW_SUCCESS:
      return {
        ...state,
        person: action.person,
        unfollowSuccess: true,
      };
    case PERSON_UNFOLLOW_FAILURE:
      return {
        ...state,
        unfollowSuccess: false,
        errorMessage: action.errorMessage,
      };
    default:
      return state;
  }
}
