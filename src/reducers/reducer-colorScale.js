import {
  INIT_COLOR_SCALE_ALL,
  COLOR_TYPE,
  COLOR_BY_SPECIES,
  COLOR_BY_LOCATION,
  COLOR_BY_SOURCETYPE,
  COLOR_BY_PROFILE_ONE,
  COLOR_BY_PROFILE_TWO,
  COLOR_BY_PROFILE_THREE
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

    case COLOR_BY_SPECIES:
      let newStateColor_bySpecies = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState.bySpecies) {
        newStateColor_bySpecies.bySpecies = action.payload;
      }
      return newStateColor_bySpecies;

    case COLOR_BY_LOCATION:
      let newStateColor_byLoc = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState.byLocation) {
        newStateColor_byLoc.byLocation = action.payload;
      }
      return newStateColor_byLoc; // if no change return same state with before

    case COLOR_BY_SOURCETYPE:
      let newStateColor_bySourceType = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState.bySourceType) {
        newStateColor_bySourceType.bySourceType = action.payload;
      }
      return newStateColor_bySourceType;

    case COLOR_BY_PROFILE_ONE:
      let newStateColor_byProfile1 = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState.byProfile1) {
        newStateColor_byProfile1.byProfile1 = action.payload;
      }
      return newStateColor_byProfile1;
    case COLOR_BY_PROFILE_TWO:
      let newStateColor_byProfile2 = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState.byProfile2) {
        newStateColor_byProfile2.byProfile2 = action.payload;
      }
      return newStateColor_byProfile2;
    case COLOR_BY_PROFILE_THREE:
      let newStateColor_byProfile3 = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState.byProfile3) {
        newStateColor_byProfile3.byProfile3 = action.payload;
      }
      return newStateColor_byProfile3;

    default:
      if (prevState) {
        return prevState;
      } else {
        return initialState.colorScale;
      }
  }
};

export default colorscaleReducer;
