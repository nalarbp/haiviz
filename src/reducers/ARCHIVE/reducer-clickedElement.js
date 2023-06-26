import {CLICKED_ELEMENT} from '../utils/constants';
import {initialState} from '../reducers'


const clickedElementReducer = (state, action) => {
  //console.log('#RDC-ClickedEl', action.type);
  switch (action.type) {
    case CLICKED_ELEMENT:
      return action.clickedElement
    default:
      return initialState.clickedElement
  }
}

export default clickedElementReducer
//
