import {NEW_METADATA, NEW_DATASET} from '../utils/constants';
import {initialState} from '../reducers'


const metadataReducer = (prevState, action) => {
  //console.log('#RDC-metadata', '++:', prevState, '&&:', action);
  switch (action.type) {
    case NEW_METADATA:
      return action.payload
    case NEW_DATASET:
    if (action.payload.metadata.patients[0]) {
      return action.payload.metadata
    }
    default:
    if (prevState) {
      return prevState}
    else {return initialState.metadata}
  }
}

export default metadataReducer
