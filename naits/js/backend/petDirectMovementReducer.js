export function petDirectMovementReducer (state = {
  petHasBeenMoved: null,
  petDirectMovementActionMessage: null
}, action) {
  switch (action.type) {
    case 'PET_DIRECT_MOVEMENT_ACTION_FULFILLED':
      return {
        ...state, petHasBeenMoved: true, petDirectMovementActionMessage: action.payload
      }
    case 'PET_DIRECT_MOVEMENT_ACTION_REJECTED':
      return {
        ...state, petHasBeenMoved: false, petDirectMovementActionMessage: action.payload
      }
    case 'PET_DIRECT_MOVEMENT_ACTION_RESET':
      return {
        ...state, petHasBeenMoved: null, petDirectMovementActionMessage: null
      }
    default:
      return state
  }
}
