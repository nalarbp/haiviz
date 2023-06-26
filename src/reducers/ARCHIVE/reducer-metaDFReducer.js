import {NEW_DF} from '../utils/constants';
import {initialState} from '../reducers'

const metaDFReducer = (prevState, action) => {
  //console.log('#RDC-metadata', '++:', prevState, '&&:', action);
  switch (action.type) {
    case NEW_DF:
      return action.payload
    default:
    if (prevState) {
      return prevState}
    else {return initialState.metadata}
  }
}

export default metaDFReducer
