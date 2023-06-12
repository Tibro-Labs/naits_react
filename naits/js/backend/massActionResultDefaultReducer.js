export function massActionResult (state = { result: null, executedActionType: null, loading: false }, action) {
  switch (action.type) {
    case 'EXECUTE_ACTION_ON_ROWS_PENDING': {
      return { ...state, result: action.payload, executedActionType: action.executedActionType, loading: true }
    }
    case 'EXECUTE_ACTION_ON_ROWS': {
      return { ...state, result: action.payload, executedActionType: action.executedActionType, loading: false }
    }
    case 'RESET_EXECUTE_ACTION_ON_ROWS':
      return { ...state, result: null, executedActionType: null, loading: false }
    case 'MASS_PET_ACTION_PENDING': {
      return { ...state, result: action.payload, executedActionType: action.executedActionType, loading: true }
    }
    case 'MASS_PET_ACTION': {
      return { ...state, result: action.payload, executedActionType: action.executedActionType, loading: false }
    }
    case 'UPDATE_STATUS':
      return { ...state, result: action.payload, executedActionType: action.executedActionType }
    case 'CLEAN_ACTION_STATE': {
      return { ...state, result: action.paylaod, executedActionType: action.paylaod }
    }
    default: {
      return state
    }
  }
}
