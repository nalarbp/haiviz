import { NEW_TREE, NEW_DATASET } from "../utils/constants";
import { initialState } from "../reducers";

const treeReducer = (prevState, action) => {
  //console.log('#RDC-metadata', '++:', prevState, '&&:', action);
  switch (action.type) {
    case NEW_TREE:
      return action.payload;
    case NEW_DATASET:
      if (action.payload.tree) {
        return action.payload.tree;
      }
      break;

    default:
      if (prevState) {
        return prevState;
      } else {
        return initialState.tree;
      }
  }
};

export default treeReducer;
