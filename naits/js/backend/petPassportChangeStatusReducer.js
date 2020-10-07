export function petPassportChangeStatusReducer (state = {
  petPassportStatusHasChanged: null,
  petPassportStatusMessage: null
}, action) {
  switch (action.type) {
    case 'CHANGE_PET_PASSPORT_STATUS_FULFILLED':
      return {
        ...state, petPassportStatusHasChanged: true, petPassportStatusMessage: action.payload
      }
    case 'CHANGE_PET_PASSPORT_STATUS_REJECTED':
      return {
        ...state, petPassportStatusHasChanged: false, petPassportStatusMessage: action.payload
      }
    case 'CHANGE_PET_PASSPORT_STATUS_RESET':
      return {
        ...state, petPassportStatusHasChanged: null, petPassportStatusMessage: null
      }
    default:
      return state
  }
}
