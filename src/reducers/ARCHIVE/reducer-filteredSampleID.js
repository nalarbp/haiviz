import {NEW_FILTERED_SAMPLE_ID} from '../utils/constants';
import {initialState} from '../reducers'


const filteredSampleIDReducer = (state, action) => {
  switch (action.type) {
    case NEW_FILTERED_SAMPLE_ID:
      return action.filteredSampleID
    default:
      return initialState.filteredSampleID
  }
}

export default filteredSampleIDReducer
