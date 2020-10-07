export function massActionReducer (state = {
  result: null
}, action) {
  switch (action.type) {
    case 'RESET_STANDALONE_ACTION':
    case 'RESET_GENERATE_INVENTORY_ITEM':
    case 'RESET_LAB_SAMPLE_ACTION':
    case 'RESET_CHANGE_STATUS':
    case 'RESET_MOVE_INVENTORY_ITEM':
    case 'RESET_CHANGE_STATUS_OF_HOLDING':
    case 'RESET_CREATE_TRANSFER':
    case 'RESET_ANIMAL': {
      return {
        ...state, result: null
      }
    }

    case 'STANDALONE_ACTION_FULFILLED':
    case 'STANDALONE_ACTION_REJECTED':
    case 'GENERATE_INVENTORY_ITEM_FULFILLED':
    case 'GENERATE_INVENTORY_ITEM_REJECTED':
    case 'EXPORT_ANIMAL_FULFILLED':
    case 'EXPORT_ANIMAL_REJECTED':
    case 'LAB_SAMPLE_ACTION_FULFILLED':
    case 'LAB_SAMPLE_ACTION_REJECTED':
    case 'MOVE_INVENTORY_ITEM_FULFILLED':
    case 'MOVE_INVENTORY_ITEM_REJECTED':
    case 'CHANGE_STATUS_FULFILLED':
    case 'CHANGE_STATUS_REJECTED':
    case 'CREATE_TRANSFER_FULFILLED':
    case 'CREATE_TRANSFER_REJECTED':
    case 'SET_ACTIVITY_PERIOD_FULFILLED':
    case 'SET_ACTIVITY_PERIOD_REJECTED':
    case 'MOVE_TO_ORG_UNIT_FULFILLED':
    case 'MOVE_TO_ORG_UNIT_REJECTED': {
      return {
        ...state, result: action.payload.data
      }
    }
  }
  return state
}
