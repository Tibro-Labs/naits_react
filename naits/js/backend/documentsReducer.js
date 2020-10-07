export function documentsReducer (state = {
  json: undefined,
  formData: undefined,
  uiSchema: undefined,
  error: undefined
}, action) {
  switch (action.type) {
    // getSvCodes
    case 'YES_NO_JSON_DATA_PENDING': {
      return {
        ...state, json: undefined
      }
    }
    case 'YES_NO_JSON_DATA_FULFILLED': {
      return {
        ...state, json: action.payload, error: undefined
      }
    }
    case 'YES_NO_JSON_DATA_REJECTED': {
      return {
        ...state, json: undefined, error: action.payload
      }
    }
    case 'YES_NO_FORM_DATA_PENDING': {
      return {
        ...state, formData: undefined
      }
    }
    case 'YES_NO_FORM_DATA_FULFILLED': {
      return {
        ...state, formData: action.payload, error: undefined
      }
    }
    case 'YES_NO_FORM_DATA_REJECTED': {
      return {
        ...state, formData: undefined, error: action.payload
      }
    }
  }
  return state
}
