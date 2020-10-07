export function formToGridResetAction (table) {
  return function (dispatch) {
    dispatch({ type: `RESET_${table}_FORM_REDUCER`, payload: undefined })
  }
}
