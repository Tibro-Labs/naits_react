export function groupedSearchReducer (state = {
  searchFor: ''
}, action) {
  switch (action.type) {
    case 'INVENTORY_ITEM_GROUPED_SEARCH':
      return { ...state, searchFor: 'INVENTORY_ITEM' }
    case 'MOVEMENT_DOC_GROUPED_SEARCH':
      return { ...state, searchFor: 'MOVEMENT_DOC' }
    case 'RESET_GROUPED_SEARCH':
      return { ...state, searchFor: '' }
    default:
      return state
  }
}
