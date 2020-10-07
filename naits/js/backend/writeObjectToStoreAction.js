export function writeObjectToStore (object) {
  return function (dispatch) {
    dispatch({ type: 'WRITE_OBJECT_TO_STORE', payload: object })
  }
}
