import {NEW_TREE_ZOOM_LEVEL} from '../utils/constants';
import {initialState} from '../reducers'


const treeZoomLevelReducer = (prevState, action) => {
  switch (action.type) {
    case NEW_TREE_ZOOM_LEVEL:
      return action.treeZoomLevel
    default:
    if (prevState) {
      return prevState}
    else {return initialState.treeZoomLevel}

  }


}

export default treeZoomLevelReducer
