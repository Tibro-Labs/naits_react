export function terminatedAnimalsReducer (state = { dateFrom: null, dateTo: null, filterTheGrid: false }, action) {
  switch (action.type) {
    case 'SET_THE_TERMINATED_ANIMALS_FILTER_DATE_FROM':
      return { ...state, dateFrom: action.payload }
    case 'SET_THE_TERMINATED_ANIMALS_FILTER_DATE_TO':
      return { ...state, dateTo: action.payload }
    case 'FILTER_THE_TERMINATED_ANIMALS_GRID':
      return { ...state, filterTheGrid: true }
    case 'RESET_FILTERING_THE_TERMINATED_ANIMALS_GRID':
      return { ...state, filterTheGrid: false }
    case 'RESET_THE_TERMINATED_ANIMALS_FILTER_PARAMS':
      return { ...state, dateFrom: null, dateTo: null, filterTheGrid: false }
    default: return state
  }
}
