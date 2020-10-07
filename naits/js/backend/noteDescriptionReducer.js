export function noteDescriptionReducer (state = {
  addedANewNote: false,
  setNoteDescriptionMessage: null
}, action) {
  switch (action.type) {
    case 'SET_NOTE_DESCRIPTION_FULFILLED':
      return {
        ...state, addedANewNote: true, setNoteDescriptionMessage: action.payload
      }
    case 'SET_NOTE_DESCRIPTION_REJECTED':
      return {
        ...state, addedANewNote: false, setNoteDescriptionMessage: action.payload
      }
    case 'SET_NOTE_DESCRIPTION_RESET':
      return {
        ...state, addedANewNote: false, setNoteDescriptionMessage: null
      }
    default:
      return state
  }
}
