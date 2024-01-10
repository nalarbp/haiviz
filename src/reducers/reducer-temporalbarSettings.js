import * as constant from "../utils/constants";
import { initialState } from "../reducers";

const temporalbarSettingsReducer = (prevState, action) => {
  switch (action.type) {
    case constant.NEW_CHART_MODE_TEMP:
      let newState_chartMode = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState.chartMode) {
        newState_chartMode.chartMode = action.payload;
      }
      return newState_chartMode;

    case constant.NEW_SCALE_MODE_TEMP:
      let newState_scaleMode = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState.scaleMode) {
        newState_scaleMode.scaleMode = action.payload;
      }
      return newState_scaleMode;

    case constant.NEW_RESIZE_SIGNAL_TEMP:
      let newState_resizeSignal = Object.assign({}, prevState);
      if (action.payload !== prevState.isUserStartResize) {
        newState_resizeSignal.isUserStartResize = action.payload;
      }
      return newState_resizeSignal;

    case constant.NEW_ISANIMATION_PLAYING_TEMP:
      let newState_isAnimPlayingSignal = Object.assign({}, prevState);
      //console.log("reducer", action.payload, prevState.isAnimationPlaying);
      if (action.payload !== prevState.isAnimationPlaying) {
        newState_isAnimPlayingSignal.isAnimationPlaying = action.payload;
      }
      return newState_isAnimPlayingSignal;

    default:
      if (prevState) {
        return prevState;
      } else {
        return initialState.temporalbarSettings;
      }
  }
};

export default temporalbarSettingsReducer;
