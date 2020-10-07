export function passportRequestReducer (state = {
  passportRequestHasBeenSent: null,
  passportRequestMessage: null,
  passportRequestHasBeenCanceled: null,
  passportRequestCancelMessage: null
}, action) {
  switch (action.type) {
    case 'SEND_PASSPORT_REQUEST_FULFILLED':
      return {
        ...state, passportRequestHasBeenSent: true, passportRequestMessage: action.payload
      }
    case 'SEND_PASSPORT_REQUEST_REJECTED':
      return {
        ...state, passportRequestHasBeenSent: false, passportRequestMessage: action.payload
      }
    case 'SEND_PASSPORT_REQUEST_RESET':
      return {
        ...state, passportRequestHasBeenSent: null, passportRequestMessage: null
      }
    case 'CANCEL_PASSPORT_REQUEST_FULFILLED':
      return {
        ...state, passportRequestHasBeenCanceled: true, passportRequestCancelMessage: action.payload
      }
    case 'CANCEL_PASSPORT_REQUEST_REJECTED':
      return {
        ...state, passportRequestHasBeenCanceled: false, passportRequestCancelMessage: action.payload
      }
    case 'CANCEL_PASSPORT_REQUEST_RESET':
      return {
        ...state, passportRequestHasBeenCanceled: null, passportRequestCancelMessage: null
      }
    default:
      return state
  }
}
