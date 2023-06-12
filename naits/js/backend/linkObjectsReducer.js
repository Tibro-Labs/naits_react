export function linkObjectsReducer (state = {
  isLoading: false,
  linkedHoldingToQuarantine: false,
  addedKeeperToHolding: false,
  linkedOwnerToPet: false,
  linkedPopulationToArea: false
}, action) {
  switch (action.type) {
    /**
     * This fires when a holding has been linked to a quarantine,
     * a keeper has been added to a holding, an onwer has been
     * linked to a pet or an area unit has been linked to a population
     * */
    case 'LINK_OBJECTS_DATA_PENDING':
      return {
        ...state, linkedHoldingToQuarantine: false, addedKeeperToHolding: false, linkedOwnerToPet: false, isLoading: true
      }
    case 'LINK_OBJECTS_DATA_FULFILLED':
      return {
        ...state, linkedHoldingToQuarantine: true, addedKeeperToHolding: true, linkedOwnerToPet: true, isLoading: false
      }
    case 'LINK_OBJECTS_DATA_REJECTED':
      return {
        ...state, linkedHoldingToQuarantine: false, addedKeeperToHolding: false, linkedOwnerToPet: false, isLoading: false
      }
    case 'ADD_LAST_SELECTED_ITEM':
      return {
        ...state, linkedHoldingToQuarantine: false, addedKeeperToHolding: false, linkedOwnerToPet: false
      }
    // This fires after the quarantine record info has been refreshed
    case 'GET_HOLDING_PER_EXP_QUARANTINE_DATA_FULFILLED':
      return {
        ...state, linkedHoldingToQuarantine: false, addedKeeperToHolding: false, linkedOwnerToPet: false
      }
    // This fires when a population has been linked with area
    case 'LINK_POPULATION_WITH_AREA_FULFILLED':
      return {
        ...state, linkedPopulationToArea: true, payload: action.payload
      }
    case 'LINK_POPULATION_WITH_AREA_REJECTED':
      return {
        ...state, linkedPopulationToArea: false, payload: action.payload
      }
    case 'LINK_POPULATION_WITH_AREA_RESET':
      return {
        ...state, linkedPopulationToArea: false, payload: action.payload
      }
    default:
      return state
  }
}
