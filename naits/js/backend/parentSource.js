export function parentSource (state = { HOLDING: null }, action) {
  switch (action.type) {
    case 'GET_HOLDING_PER_EXP_QUARANTINE_DATA_FULFILLED': {
      return {
        ...state,
        HOLDING: action.payload
      }
    }
    case 'GET_HOLDING_PER_EXP_QUARANTINE_DATA_PENDING':
    case 'GET_HOLDING_PER_EXP_QUARANTINE_DATA_REJECTED': {
      return {
        ...state,
        HOLDING: null
      }
    }
    default: {
      return state
    }
  }
}
