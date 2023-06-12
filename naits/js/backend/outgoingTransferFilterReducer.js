export function outgoingTransferFilterReducer (state = {
  tagType: null, startTagId: null, endTagId: null, dateFrom: null, dateTo: null, filterTheGrid: false
}, action) {
  switch (action.type) {
    case 'SET_THE_OUTGOING_TRANSFER_FILTER_TAG_TYPE':
      return { ...state, tagType: action.payload }
    case 'SET_THE_OUTGOING_TRANSFER_FILTER_START_TAG_ID':
      return { ...state, startTagId: action.payload }
    case 'SET_THE_OUTGOING_TRANSFER_FILTER_END_TAG_ID':
      return { ...state, endTagId: action.payload }
    case 'SET_THE_OUTGOING_TRANSFER_FILTER_DATE_FROM':
      return { ...state, dateFrom: action.payload }
    case 'SET_THE_OUTGOING_TRANSFER_FILTER_DATE_TO':
      return { ...state, dateTo: action.payload }
    case 'FILTER_THE_OUTGOING_TRANSFER_GRID':
      return { ...state, filterTheGrid: true }
    case 'RESET_FILTERING_THE_OUTGOING_TRANSFER_GRID':
      return { ...state, filterTheGrid: false }
    case 'RESET_THE_OUTGOING_TRANSFER_FILTER_PARAMS':
      return { ...state, tagType: null, startTagId: null, endTagId: null, dateFrom: null, dateTo: null, filterTheGrid: false }
    default: return state
  }
}
