export function customSearchCriteriaReducer (state = {
  petCriteria: '',
  movementDocCriteria: '',
  animalStatusCriteria: ''
}, action) {
  switch (action.type) {
    case 'CHANGED_CUSTOM_PET_SEARCH_CRITERIA':
      return {
        ...state, petCriteria: action.payload
      }
    case 'CHANGED_CUSTOM_MOVEMENT_DOC_SEARCH_CRITERIA':
      return {
        ...state, movementDocCriteria: action.payload
      }
    case 'CHANGED_CUSTOM_ANIMAL_STATUS_SEARCH_CRITERIA':
      return {
        ...state, animalStatusCriteria: action.payload
      }
    case 'RESET_ANIMAL_SEARCH':
      return { ...state, animalStatusCriteria: '' }
    default:
      return state
  }
}
