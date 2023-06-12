export function noteDescriptionReducer (state = {
  addedANewNote: false
}, action) {
  switch (action.type) {
    case 'SET_NOTE_DESCRIPTION_FULFILLED':
      return { ...state, addedANewNote: true }
    case 'SET_NOTE_DESCRIPTION_REJECTED':
    case 'SET_NOTE_DESCRIPTION_RESET':
      return { ...state, addedANewNote: false }
    default:
      return state
  }
}
