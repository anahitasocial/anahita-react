import actorsReducer from './actors';

export default function (state = {
  usertypeFilter: '',
  disabledFilter: false,
}, action) {
  return actorsReducer(state, action);
}
