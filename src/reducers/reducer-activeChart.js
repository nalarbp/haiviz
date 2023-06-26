import {
  ACTIVE_CHART,
  INACTIVE_CHART,
  MULTI_ACTIVE_CHART,
  MULTI_INACTIVE_CHART
} from "../utils/constants";
import { initialState } from "../reducers";
//

const activeChartReducer = (prevState, action) => {
  switch (action.type) {
    case ACTIVE_CHART:
      //get list of charts that must be active and used to render side menu
      //clone previous state and change the object which the key is on action.activechart
      let newState = Object.assign({}, prevState);
      if (action.chartId) {
        newState[action.chartId].show = true;
      }
      return newState;

    case INACTIVE_CHART:
      let newState2 = Object.assign({}, prevState);
      if (action.chartId) {
        newState2[action.chartId].show = false;
      }
      return newState2;

    case MULTI_ACTIVE_CHART:
      return action.payload;

    case MULTI_INACTIVE_CHART:
      return action.payload;

    default:
      if (prevState) {
        return prevState;
      } else {
        return initialState.activeChart;
      }
  }
};

export default activeChartReducer;
///

// switch (action.type) {
//   case ACTIVE_CHART:
//     let newState = Object.assign({}, prevState)
//     if (action.activeChart) {
//       switch (action.activeChart) {
//         case 'gantt':
//           newState['gantt'].show = true;
//           newState['idxCol'].show = true;
//           break;
//         case 'floorplan':
//           newState['floorplan'].show = true;
//           break;
//         default:
//         newState[action.activeChart].show = true;
//       }
//     }
//     else if (action.inactiveChart) {
//       switch (action.inactiveChart) {
//         case 'gantt':
//           newState['gantt'].show = false;
//           newState['idxCol'].show = false;
//           break;
//         case 'home':
//           newState['home'] = true;
//           break;
//         case 'floorplan':
//           newState['floorplan'].show = false;
//           break;
//         default:
//         newState[action.inactiveChart].show = false;
//       }
//     }
//     return newState
//
//
//   case ADD_FLOORPLAN:
//     return action.newActiveChart
//   default:
//   if (prevState) {
//     return prevState}
//   else {return initialState.activeChart}
//
// }
