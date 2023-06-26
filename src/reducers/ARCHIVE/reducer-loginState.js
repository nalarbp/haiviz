import {initialState} from '../reducers'

const LOGIN_STATE= "LOGIN_STATE"

const loginStateReducer = (prevState, action) => {
  switch (action.type) {
    case LOGIN_STATE:
      return action.payload
      break;
    default:
    if (prevState) {
      return prevState
    } else {
      return initialState.loginState;
    }
  }
}

export default loginStateReducer
//
