export function messagesReducer (state = {
  createConvFormShouldClose: false
}, action) {
  switch (action.type) {
    case 'CLOSE_CONVERSATION_FORM':
      return {
        ...state, createConvFormShouldClose: true
      }
    case 'RESET_CLOSE_CONVERSATION_FORM':
      return {
        ...state, createConvFormShouldClose: false
      }
    default:
      return state
  }
}
