export function writeComponentToStoreAction (component) {
  return function (dispatch) {
    dispatch({ type: 'WRITE_COMPONENT_TO_STORE', payload: component })
  }
}
