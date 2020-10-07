export function changeStatusOfHoldingReducer (state = {
  result: null,
  holdingStatusHasChanged: false
}, action) {
  switch (action.type) {
    case 'RESET_CHANGE_STATUS_OF_HOLDING':
      return {
        ...state, result: null, holdingStatusHasChanged: false
      }
    case 'CHANGE_STATUS_OF_HOLDING_FULFILLED':
      return {
        ...state, result: action.payload.data, holdingStatusHasChanged: true
      }
    case 'CHANGE_STATUS_OF_HOLDING_REJECTED':
      return {
        ...state, result: action.payload.data, holdingStatusHasChanged: false
      }
    default:
      return state
  }
}
