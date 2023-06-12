export function rfidSecondLevelFormReducer (state = {
  rfidActionAndSubActionTypeHasChanged: false
}, action) {
  switch (action.type) {
    case 'RFID_ACTION_AND_SUBACTION_TYPE_HAS_CHANGED':
      return { ...state, rfidActionAndSubActionTypeHasChanged: true }
    case 'RESET_RFID_TYPE_CHANGE':
      return { ...state, rfidActionAndSubActionTypeHasChanged: false }
    default:
      return state
  }
}
