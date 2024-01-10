import * as constant from "../utils/constants";

// ======================= CHANGE SETTINGS ====================
export function changeTempResizeSignal(value) {
  return {
    type: constant.NEW_RESIZE_SIGNAL_TEMP,
    payload: value
  };
}
export function changeTempChartMode(value) {
  return {
    type: constant.NEW_CHART_MODE_TEMP,
    payload: value
  };
}
export function changeTempScaleMode(value) {
  return {
    type: constant.NEW_SCALE_MODE_TEMP,
    payload: value
  };
}
export function changeTempIsAnimationPlaying(value) {
  return {
    type: constant.NEW_ISANIMATION_PLAYING_TEMP,
    payload: value
  };
}
