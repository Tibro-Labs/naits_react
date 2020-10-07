export function moveToOrgUnitReducer (state = {
  loading: false
}, action) {
  switch (action.type) {
    case 'MOVE_TO_ORG_UNIT_PENDING':
      return { ...state, loading: true }
    case 'MOVE_TO_ORG_UNIT_FULFILLED':
      return { ...state, loading: false }
    case 'MOVE_TO_ORG_UNIT_REJECTED':
      return { ...state, loading: false }
    default:
      return state
  }
}
