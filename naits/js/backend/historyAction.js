export function historyAction (argsObject) {
  return function (dispatch) {
    dispatch({ type: 'CLEAR_HISTORY_DATA', payload: argsObject })
  }
}
