export function transferAnimalReducer (state = {
  result: null,
  loading: false
}, action) {
  switch (action.type) {
    case 'RESET_TRANSFER_ANIMAL': {
      return {
        ...state, result: null, loading: false
      }
    }
    case 'TRANSFER_ANIMAL_PENDING': {
      return { ...state, result: action.payload, loading: true }
    }
    case 'TRANSFER_ANIMAL_FULFILLED':
    case 'TRANSFER_ANIMAL_REJECTED':
    {
      return {
        ...state, result: action.payload.data, loading: false
      }
    }
  }
  return state
}
