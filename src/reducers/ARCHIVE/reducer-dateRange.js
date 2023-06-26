import {NEW_DATE_RANGE} from '../utils/constants';
import {initialState} from '../reducers'


const dateRangeReducer = (state, action) => {
  //console.log('#RDC-dateRange', '++:', state, '&&:', action);
  switch (action.type) {
    case NEW_DATE_RANGE:
      //console.log( '2 run', dt); //retun good
      return action.dateRange
    default:
      //console.log( '1 run', initialState)
      return initialState.dateRange
  }
}

export default dateRangeReducer
