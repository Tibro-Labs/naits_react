export function unreadMessagesNumberReducer (state = {
  numOfUnreadInboxMsgs: 0, numOfUnreadArchivedMsgs: 0
}, action) {
  switch (action.type) {
    case 'NUMBER_OF_UNREAD_INBOX_MESSAGES':
      return { ...state, numOfUnreadInboxMsgs: action.payload.numOfUnreadInboxMsgs }
    case 'NUMBER_OF_UNREAD_ARCHIVED_MESSAGES':
      return { ...state, numOfUnreadArchivedMsgs: action.payload.numOfUnreadArchivedMsgs }
    case 'RESET_THE_NUMBER_OF_UNREAD_MESSAGES':
      return { ...state, numOfUnreadInboxMsgs: 0, numOfUnreadArchivedMsgs: 0 }
    default: return state
  }
}
