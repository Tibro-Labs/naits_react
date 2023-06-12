
export function releasedPetsReducer (state = { dateFrom: null, dateTo: null, filterTheGrid: false }, action) {
  switch (action.type) {
    case 'SET_THE_RELEASED_PETS_FILTER_DATE_FROM':
      return { ...state, dateFrom: action.payload }
    case 'SET_THE_RELEASED_PETS_FILTER_DATE_TO':
      return { ...state, dateTo: action.payload }
    case 'FILTER_THE_RELEASED_PETS_GRID':
      return { ...state, filterTheGrid: true }
    case 'RESET_FILTERING_THE_RELEASED_PETS_GRID':
      return { ...state, filterTheGrid: false }
    case 'RESET_THE_RELEASED_PETS_FILTER_PARAMS':
      return { ...state, dateFrom: null, dateTo: null, filterTheGrid: false }
    default: return state
  }
}
