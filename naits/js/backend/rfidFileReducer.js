export function rfidFileReducer (state = {
  rfidFileHasBeenUploaded: false
}, action) {
  switch (action.type) {
    case 'RFID_FILE_HAS_BEEN_UPLOADED':
      return { ...state, rfidFileHasBeenUploaded: true }
    case 'RESET_RFID_FILE_UPLOAD':
      return { ...state, rfidFileHasBeenUploaded: false }
    default:
      return state
  }
}
