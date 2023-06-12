export function changeStatusOfHoldingReducer (state = {
  result: null,
  holdingStatusHasChanged: false,
  holdingTypeHasChanged: false,
  shouldRefreshSideMenu: false,
  shouldRefreshPrintBadgeAndSummaryInfo: false
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
    case 'HOLDING_TYPE_HAS_CHANGED':
      return {
        ...state, holdingTypeHasChanged: true
      }
    case 'CLOSED_THE_HOLDING_FORM_ALERT':
      return {
        ...state, holdingTypeHasChanged: false, shouldRefreshSideMenu: true
      }
    case 'RESET_HOLDING_TYPE_CHANGE':
      return {
        ...state, shouldRefreshSideMenu: false
      }
    default:
      return state
  }
}
