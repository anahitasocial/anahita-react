import {
  PEOPLE_BROWSE_REQUEST, PEOPLE_BROWSE_SUCCESS, PEOPLE_BROWSE_FAILURE,
  PEOPLE_FOLLOW_REQUEST, PEOPLE_FOLLOW_SUCCESS, PEOPLE_FOLLOW_FAILURE,
  PEOPLE_UNFOLLOW_REQUEST, PEOPLE_UNFOLLOW_SUCCESS, PEOPLE_UNFOLLOW_FAILURE,
} from '../constants/people';

const updateItem = (list: List, item: Item): List => list.map(l => (l.id !== item.id ? l : item));

export default function (state = {
  isFetching: false,
  people: [],
  followSuccess: false,
  unfollowSuccess: false,
  errorMessage: '',
  keywordFilter: '',
  usertypeFilter: '',
  disabledFilter: false,
  offset: 0,
  limit: 20,
  total: 0,
}, action) {
  switch (action.type) {
    case PEOPLE_BROWSE_REQUEST:
      return {
        ...state,
        isFetching: true,
        // people: [],
      };
    case PEOPLE_BROWSE_SUCCESS:
      return {
        ...state,
        people: state.people.concat(...action.people),
        offset: action.offset + action.limit,
        limit: action.limit,
        total: action.total,
        isFetching: false,
      };
    case PEOPLE_BROWSE_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.errorMessage,
      };
    case PEOPLE_FOLLOW_REQUEST:
      return {
        ...state,
        followSuccess: false,
      };
    case PEOPLE_FOLLOW_SUCCESS:
      return {
        ...state,
        people: updateItem(state.people, action.person),
        followSuccess: true,
      };
    case PEOPLE_FOLLOW_FAILURE:
      return {
        ...state,
        followSuccess: false,
        errorMessage: action.errorMessage,
      };
    case PEOPLE_UNFOLLOW_REQUEST:
      return {
        ...state,
        unfollowSuccess: false,
      };
    case PEOPLE_UNFOLLOW_SUCCESS:
      return {
        ...state,
        people: updateItem(state.people, action.person),
        unfollowSuccess: true,
      };
    case PEOPLE_UNFOLLOW_FAILURE:
      return {
        ...state,
        unfollowSuccess: false,
        errorMessage: action.errorMessage,
      };
    default:
      return state;
  }
}
