export function unreadMessagesAlertReducer (state = {
  weComeFromTheUnreadMessagesAlert: false, weDismissedTheUnreadMessagesAlert: false
}, action) {
  switch (action.type) {
    case 'WE COME FROM THE UNREAD MESSAGES ALERT':
      return { ...state, weComeFromTheUnreadMessagesAlert: true }
    case 'WE DISMISSED THE UNREAD MESSAGES ALERT':
      return { ...state, weDismissedTheUnreadMessagesAlert: true }
    case 'RESET_THE_UNREAD_MESSAGES_ALERT_STATE':
      return { ...state, weComeFromTheUnreadMessagesAlert: false, weDismissedTheUnreadMessagesAlert: true }
    default: return state
  }
}
