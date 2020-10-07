export function customSearchCriteriaReducer (state = {
  petCriteria: '',
  movementDocCriteria: ''
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
    default:
      return state
  }
}
