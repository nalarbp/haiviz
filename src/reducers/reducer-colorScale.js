import {
  INIT_COLOR_SCALE_ALL,
  COLOR_TYPE,
  COLOR_MAP
} from "../utils/constants";
import { initialState } from "../reducers";

const colorscaleReducer = (prevState, action) => {
  switch (action.type) {
    case INIT_COLOR_SCALE_ALL:
      let newStateColor_init = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState) {
        newStateColor_init = action.payload;
      }
      return newStateColor_init;

    case COLOR_TYPE:
      let newStateColor_type = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState.colorType) {
        newStateColor_type.colorType = action.payload;
      }
      return newStateColor_type;

    case COLOR_MAP:
      let newStateColor_map = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState.colorMap) {
        newStateColor_map.colorMap = action.payload;
      }
      return newStateColor_map;

    default:
      if (prevState) {
        return prevState;
      } else {
        return initialState.colorScale;
      }
  }
};

export default colorscaleReducer;
