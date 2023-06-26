import {initialState} from '../reducers'

//constants
const FP_NEW_ZOOM_LEVEL = 'FP_NEW_ZOOM_LEVEL';
const FP_NEW_DRAG_X = 'FP_NEW_DRAG_X';
const FP_NEW_DRAG_Y = 'FP_NEW_DRAG_Y';

//Initial state: floorplan_controller:{zoomLevel:1, dragX:10, dragY:10}

export const floorplan_controller = (prevState, action) => {
  switch (action.type) {
    case FP_NEW_ZOOM_LEVEL:
      return action.floorplanZoomLevel

    default:
    if (prevState) {
      return prevState}
    else {return initialState.floorplanZoomLevel}

  }
}
