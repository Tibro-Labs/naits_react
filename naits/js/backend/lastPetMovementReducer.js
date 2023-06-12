export function lastPetMovementReducer (state = {
  petMovementId: undefined
}, action) {
  switch (action.type) {
    case 'LAST_PET_MOVEMENT_FULFILLED':
      return { ...state, petMovementId: action.payload }
    case 'LAST_PET_MOVEMENT_REJECTED':
    case 'RESET_LAST_PET_MOVEMENT':
      return { ...state, petMovementId: undefined }
    default:
      return state
  }
}
