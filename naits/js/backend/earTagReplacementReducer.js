export function earTagReplacementReducer (state = {
  message: null,
  error: null,
  earTagHasBeenChanged: false
}, action) {
  switch (action.type) {
    case 'RESET_EAR_TAG_REPLACEMENT': {
      return {
        ...state, message: null, error: null, earTagHasBeenChanged: false
      }
    }
    case 'EAR_TAG_REPLACEMENT_FULFILLED': {
      return {
        ...state, message: action.payload.data, error: null, earTagHasBeenChanged: true
      }
    }
    case 'EAR_TAG_REPLACEMENT_REJECTED': {
      return {
        ...state, message: null, error: action.payload.message, earTagHasBeenChanged: false
      }
    }
  }

  return state
}
