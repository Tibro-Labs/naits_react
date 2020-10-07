export function dropLinkReducer (state = {
  message: null,
  error: null,
  removedKeeperFromHolding: false
}, action) {
  switch (action.type) {
    case 'RESET_DROP_LINK_OBJECTS': {
      return {
        ...state, message: null, error: null, removedKeeperFromHolding: false
      }
    }
    case 'DROP_LINK_OBJECTS_FULFILLED': {
      return {
        ...state, message: action.payload.data, error: null, removedKeeperFromHolding: true
      }
    }
    case 'DROP_LINK_OBJECTS_REJECTED': {
      return {
        ...state, message: null, error: action.payload.data, removedKeeperFromHolding: false
      }
    }
  }

  return state
}
