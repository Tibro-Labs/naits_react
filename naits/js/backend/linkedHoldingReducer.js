export function linkedHoldingReducer (state = {
  userIsLinkedToOneHolding: false,
  userIsLinkedToTwoOrMoreHoldings: false
}, action) {
  switch (action.type) {
    case 'USER_IS_LINKED_TO_ONE_HOLDING':
      return {
        ...state, userIsLinkedToOneHolding: true, userIsLinkedToTwoOrMoreHoldings: false
      }
    case 'USER_IS_LINKED_TO_TWO_OR_MORE_HOLDINGS':
      return {
        ...state, userIsLinkedToTwoOrMoreHoldings: true, userIsLinkedToOneHolding: false
      }
    case 'USER_IS_NOT_LINKED_TO_ANY_HOLDINGS':
      return {
        ...state, userIsLinkedToOneHolding: false, userIsLinkedToTwoOrMoreHoldings: false
      }
    default:
      return state
  }
}
