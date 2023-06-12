export function dropLinkReducer (state = {
  isLoading: false,
  message: undefined,
  error: undefined,
  removedKeeperFromHolding: false
}, action) {
  switch (action.type) {
    case 'THE_KEEPER_HAS_BEEN_REMOVED':
      return { ...state, isLoading: true }
    case 'RESET_DROP_LINK_OBJECTS': {
      return {
        ...state, isLoading: false, message: undefined, error: undefined, removedKeeperFromHolding: false
      }
    }
    case 'DROP_LINK_OBJECTS_FULFILLED': {
      return {
        ...state, isLoading: false, message: action.payload.data, error: undefined, removedKeeperFromHolding: true
      }
    }
    case 'DROP_LINK_OBJECTS_REJECTED': {
      return {
        ...state, isLoading: false, message: undefined, error: action.payload.data || action.payload, removedKeeperFromHolding: false
      }
    }
  }

  return state
}
