import {NEW_FILTERED_ENTRY_ID} from '../utils/constants';
import {initialState} from '../reducers'


const filteredEntryIDReducer = (state, action) => {
  //console.log('#RDC-filteredEntryID');
  switch (action.type) {
    case NEW_FILTERED_ENTRY_ID:
      return action.filteredEntryID
    default:
      return initialState.filteredEntryID
  }
}

export default filteredEntryIDReducer
