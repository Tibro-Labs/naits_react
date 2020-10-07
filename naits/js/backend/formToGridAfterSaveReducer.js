// catch form save
export function formToGridAfterSaveReducer (state = {
  HOLDINGPIC: undefined,
  HOLDING_RESPONSIBLE_REG_NUM: undefined,
  PET_PKID: undefined,
  STRAY_PET_ID: undefined,
  QUARANTINE_ID: undefined,
  POPULATION_ID: undefined,
  LAB_SAMPLE_ID: undefined,
  LAB_TEST_TYPE_PKID: undefined
}, action) {
  switch (action.type) {
    case 'HOLDING_FORM/SAVE_FORM_DATA': {
      return {
        ...state, HOLDINGPIC: action.payload.PIC
      }
    }
    case 'RESET_HOLDING_FORM_REDUCER': {
      return {
        ...state, HOLDINGPIC: undefined
      }
    }
    case 'HOLDING_RESPONSIBLE_FORM/SAVE_FORM_DATA': {
      return {
        ...state, HOLDING_RESPONSIBLE_REG_NUM: action.payload.NAT_REG_NUMBER
      }
    }
    case 'RESET_HOLDING_RESPONSIBLE_FORM_REDUCER': {
      return {
        ...state, HOLDING_RESPONSIBLE_REG_NUM: undefined
      }
    }
    case 'PET_FORM/SAVE_FORM_DATA': {
      return {
        ...state, PET_PKID: action.payload.pkid
      }
    }
    case 'RESET_PET_FORM_REDUCER': {
      return {
        ...state, PET_PKID: undefined
      }
    }
    case 'STRAY_PET_FORM/SAVE_FORM_DATA': {
      return {
        ...state, STRAY_PET_ID: action.payload.PET_ID
      }
    }
    case 'STRAY_PET_FORM_REDUCER': {
      return {
        ...state, STRAY_PET_ID: undefined
      }
    }
    case 'QUARANTINE_FORM/SAVE_FORM_DATA': {
      return {
        ...state, QUARANTINE_ID: action.payload.QUARANTINE_ID
      }
    }
    case 'QUARANTINE_FORM_REDUCER': {
      return {
        ...state, QUARANTINE_ID: undefined
      }
    }
    case 'POPULATION_FORM/SAVE_FORM_DATA': {
      return {
        ...state, POPULATION_ID: action.payload.POPULATION_ID
      }
    }
    case 'POPULATION_FORM_REDUCER': {
      return {
        ...state, POPULATION_ID: undefined
      }
    }
    case 'LAB_SAMPLE_FORM/SAVE_FORM_DATA': {
      return {
        ...state, LAB_SAMPLE_ID: action.payload.SAMPLE_ID
      }
    }
    case 'LAB_SAMPLE_FORM_REDUCER': {
      return {
        ...state, SAMPLE_ID: undefined
      }
    }
    case 'LAB_TEST_TYPE_FORM/SAVE_FORM_DATA': {
      return {
        ...state, LAB_TEST_TYPE_PKID: action.payload.pkid
      }
    }
    case 'LAB_TEST_TYPE_FORM_REDUCER': {
      return {
        ...state, LAB_TEST_TYPE_PKID: undefined
      }
    }
  }
  return state
}
