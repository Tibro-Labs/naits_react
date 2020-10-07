export function populationStratificationReducer (state = {
  populationFilterHasBeenApplied: false
}, action) {
  switch (action.type) {
    case 'STRAT_FILTER_HAS_BEEN_APPLIED':
      return {
        ...state, populationFilterHasBeenApplied: true
      }
    case 'STRAT_FILTER_RESET':
      return {
        ...state, populationFilterHasBeenApplied: false
      }
    default:
      return state
  }
}
