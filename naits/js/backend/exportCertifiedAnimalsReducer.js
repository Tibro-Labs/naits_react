export function exportCertifiedAnimalsReducer (state = {
  result: null
}, action) {
  switch (action.type) {
    case 'RESET_EXPORT_CERTIFIED_ANIMALS': {
      return {
        ...state, result: null
      }
    }
    case 'EXPORT_CERTIFIED_ANIMALS_FULFILLED':
    case 'EXPORT_CERTIFIED_ANIMALS_REJECTED':
    {
      return {
        ...state, result: action.payload.data
      }
    }
  }
  return state
}
