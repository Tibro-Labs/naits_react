import createReducer from 'redux-updeep'
import { prevReduxValueIfError, errTolastError } from 'functions/utils.js'
// this is not really needed
// we have it here just as an examlpe
const initialSecurityState = {
  currentUser: undefined,
  isBusy: false,
  lastError: undefined,
  svSession: undefined,
  svSessionMsg: undefined,
  userId: undefined,
  userInfo: undefined,
  userType: undefined
}

// define reducer, NAMESPACE for import is 'security'
// the above functions need to be called if we want errors
// to a specific key, otherwise createReducer() needs
// only two paramaters
export let security = createReducer('security', initialSecurityState, {

  'security/MAIN_LOGIN': (state, action) => {
    return prevReduxValueIfError(state, action)
  },
  'security/MAIN_LOGIN_ERROR': (state, action) => {
    return errTolastError(state, action)
  },
  'security/MAIN_USERTYPE': (state, action) => {
    return prevReduxValueIfError(state, action)
  },
  'security/MAIN_USERTYPE_ERROR': (state, action) => {
    return errTolastError(state, action)
  },
  'security/MAIN_ACTIVATE': (state, action) => {
    return prevReduxValueIfError(state, action)
  },
  'security/MAIN_ACTIVATE_ERROR': (state, action) => {
    return errTolastError(state, action)
  },
  'security/MAIN_RECOVERPASSSOP': (state, action) => {
    return prevReduxValueIfError(state, action)
  },
  'security/MAIN_RECOVERPASSSOP_ERROR': (state, action) => {
    return errTolastError(state, action)
  }

})
