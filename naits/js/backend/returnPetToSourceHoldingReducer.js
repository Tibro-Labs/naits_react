export function returnPetToSourceHoldingReducer (state = {
  petHasBeenReturned: null,
  petReturnActionMessage: null
}, action) {
  switch (action.type) {
    case 'RETURN_PET_ACTION_FULFILLED':
      return {
        ...state, petHasBeenReturned: true, petReturnActionMessage: action.payload
      }
    case 'RETURN_PET_ACTION_REJECTED':
      return {
        ...state, petHasBeenReturned: false, petReturnActionMessage: action.payload
      }
    case 'RETURN_PET_ACTION_RESET':
      return {
        ...state, petHasBeenReturned: null, petReturnActionMessage: null
      }
    default:
      return state
  }
}
