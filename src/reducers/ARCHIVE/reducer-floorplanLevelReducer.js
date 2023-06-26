import {NEW_FLOORPLAN_LEVEL, NEW_DATASET} from '../utils/constants';
import {initialState} from '../reducers'


const floorplanLevelReducer = (prevState, action) => {
  //console.log('#RDC-metadata', '++:', prevState, '&&:', action);
  switch (action.type) {
    case NEW_FLOORPLAN_LEVEL:
      return action.payload
    default:
    if (prevState) {
      return prevState}
    else {return initialState.floorplanLevel}

  }


}

export default floorplanLevelReducer
