export function getOrgUnitByObjectIdReducer (state = {
  noOrgUnitFound: false
}, action) {
  switch (action.type) {
    case 'GET_ORG_UNIT_BY_OBJECT_ID_DATA_FULFILLED':
      return {
        ...state, noOrgUnitFound: false
      }
    case 'GET_ORG_UNIT_BY_OBJECT_ID_DATA_REJECTED':
      return {
        ...state, noOrgUnitFound: true
      }
    default:
      return state
  }
}
