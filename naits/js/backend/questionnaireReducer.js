export function questionnaireReducer (state = { component: undefined }, action) {
  switch (action.type) {
    case 'DISPLAY_QUESTIONNAIRES':
      return { ...state, component: action.payload }
    case 'CLOSE_QUESTIONNAIRES':
      return { ...state, component: undefined }
    default: return state
  }
}
