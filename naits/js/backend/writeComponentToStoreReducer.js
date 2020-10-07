export function writeComponentToStoreReducer (state = {
  componentToDisplay: null
}, action) {
  switch (action.type) {
    case 'WRITE_COMPONENT_TO_STORE': {
      return {...state, componentToDisplay: action.payload}
    }
  }
  return state
}
