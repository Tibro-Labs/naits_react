export function validationReducer (state = {
  message: null,
  error: null
}, action) {
  switch (action.type) {
    case 'RESET_VALIDATION': {
      return {
        ...state, message: null, error: null
      }
    }
    case 'VALIDATE_ANIMAL_ID_FULFILLED': {
      return {
        ...state, message: action.payload.data, error: null
      }
    }
    case 'VALIDATE_ANIMAL_ID_REJECTED': {
      return {
        ...state, message: null, error: action.payload
      }
    }
    case 'VALIDATE_RANGE_FULFILLED': {
      return {
        ...state, message: action.payload.data, error: null
      }
    }
    case 'VALIDATE_RANGE_REJECTED': {
      return {
        ...state, message: action.payload, error: null
      }
    }
  }
  return state
}
