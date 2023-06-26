import {TRANS_LINK_THRESHOLD} from '../utils/constants';
import {initialState} from '../reducers'


const transLinkReducer = (state, action) => {
  //console.log('#RDC-ClickedEl', action.type, action.thresholdValue);
  switch (action.type) {
    case TRANS_LINK_THRESHOLD:
      return action.thresholdValue
    default:
      return initialState.transLink
  }
}

export default transLinkReducer
//
