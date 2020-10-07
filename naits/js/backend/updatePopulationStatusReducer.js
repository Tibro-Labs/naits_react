export function updatePopulationStatusReducer (state = {
  populationStatusHasBeenUpdated: false,
  populationStatusUpdateMessage: null
}, action) {
  switch (action.type) {
    case 'UPDATE_POPULATION_STATUS_FULFILLED':
      return {
        ...state, populationStatusHasBeenUpdated: true, populationStatusUpdateMessage: action.payload
      }
    case 'UPDATE_POPULATION_STATUS_REJECTED':
      return {
        ...state, populationStatusHasBeenUpdated: false, populationStatusUpdateMessage: action.payload
      }
    case 'UPDATE_POPULATION_STATUS_RESET':
      return {
        ...state, populationStatusHasBeenUpdated: false, populationStatusUpdateMessage: null
      }
    case 'POPULATION_SAMPLE_HAS_BEEN_GENERATED':
      return {
        ...state, populationStatusHasBeenUpdated: true, populationStatusUpdateMessage: null
      }
    default:
      return state
  }
}
