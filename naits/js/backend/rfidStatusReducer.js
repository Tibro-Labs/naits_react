export function rfidStatusReducer (state = {
  rfidStatusHasChanged: false
}, action) {
  switch (action.type) {
    case 'RFID_RESULT_HAS_BEEN_GENERATED':
      return { ...state, rfidStatusHasChanged: true }
    case 'RESET_RFID_STATUS_CHANGE':
      return { ...state, rfidStatusHasChanged: false }
    default:
      return state
  }
}
