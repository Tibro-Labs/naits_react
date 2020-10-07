export function generateAnimalsReducer (state = {
  message: null,
  error: null
}, action) {
  switch (action.type) {
    case 'RESET_GENERATE_ANIMALS': {
      return {
        ...state, message: null, error: null
      }
    }
    case 'GENERATE_ANIMALS_FULFILLED': {
      return {
        ...state, message: action.payload.data, error: null
      }
    }
    case 'GENERATE_ANIMALS_REJECTED': {
      return {
        ...state, message: null, error: action.payload.data
      }
    }
  }

  return state
}
