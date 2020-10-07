export function searchAndLoadReducer (state = {
  noResults: false,
  aFilterHasBeenUsed: false
}, action) {
  switch (action.type) {
    case 'A_FILTER_HAS_BEEN_USED':
      return { ...state, aFilterHasBeenUsed: true }
    case 'NO_RESULTS_FOUND':
      return { ...state, noResults: true }
    case 'RESET_ANIMAL_SEARCH':
      return { ...state, noResults: false, aFilterHasBeenUsed: false }
    case 'RESET_SEARCH':
      return { ...state, noResults: false, aFilterHasBeenUsed: false }
    default:
      return state
  }
}
