import {NEW_MAP_ZOOM_LEVEL, NEW_MAP_DRAG_X, NEW_MAP_DRAG_Y} from '../utils/constants';
import {initialState} from '../reducers'


export const floorplanZoomLevelReducer = (prevState, action) => {
  switch (action.type) {
    case NEW_MAP_ZOOM_LEVEL:
      return action.floorplanZoomLevel
    default:
    if (prevState) {
      return prevState}
    else {return initialState.floorplanZoomLevel}

  }
}

export const floorplanDragX = (prevState, action) => {
  switch (action.type) {
    case NEW_MAP_DRAG_X:
    //console.log(action.floorplanDragLocationX);
      return action.floorplanDragLocationX
    default:
    if (prevState) {
      return prevState}
    else {return initialState.floorplanDragLocationX}
  }
}

export const floorplanDragY = (prevState, action) => {
  switch (action.type) {
    case NEW_MAP_DRAG_Y:
      return action.floorplanDragLocationY
    default:
    if (prevState) {
      return prevState}
    else {return initialState.floorplanDragLocationY }
  }
}
