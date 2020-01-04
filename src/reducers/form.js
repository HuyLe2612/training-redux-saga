import * as toggleForm from './../constants/form';

var initialState = false;

var reducer = (state = initialState, action ) =>{
  switch(action.type){
    case toggleForm.TOGGLE_FORM:
      return !state;
    default: return state;
  }
};
export default reducer;