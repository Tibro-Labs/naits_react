export function replacePetIdReducer (state = {
  petIdHasChanged: false,
  petIdReplacementMessage: null
}, action) {
  switch (action.type) {
    case 'REPLACE_PET_ID_FULFILLED':
      return {
        ...state, petIdHasChanged: true, petIdReplacementMessage: action.payload
      }
    case 'REPLACE_PET_ID_REJECTED':
      return {
        ...state, petIdHasChanged: false, petIdReplacementMessage: action.payload
      }
    case 'REPLACE_PET_ID_RESET':
      return {
        ...state, petIdHasChanged: false, petIdReplacementMessage: null
      }
    default:
      return state
  }
}
