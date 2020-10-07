export function getHoldingPicReducer (state = {
  noHoldingFound: false
}, action) {
  switch (action.type) {
    case 'GET_HOLDING_PIC_DATA_FULFILLED':
      return {
        ...state, noHoldingFound: false
      }
    case 'GET_HOLDING_PIC_DATA_REJECTED':
      return {
        ...state, noHoldingFound: true
      }
    default:
      return state
  }
}
