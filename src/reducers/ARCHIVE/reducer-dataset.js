// ga aktif
import {NEW_DATASET} from '../utils/constants'; //for showase dataset
import {initialState} from '../reducers'


const datasetReducer = (state, action) => {
  //console.log('#RDC-dataset');
  if (state !== undefined) {
    switch (action.type) {
      case NEW_DATASET:
        return action.payload //return rawDataset
      default:
        return state
    }
  }

  return initialState.dataset
}

export default datasetReducer
