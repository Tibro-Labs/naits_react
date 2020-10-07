export function writeObjectToStoreReducer (state = {}, action) {
  switch (action.type) {
    case 'WRITE_OBJECT_TO_STORE': {
      return {...state, ...action.payload}
    }
  }
  return state
}
