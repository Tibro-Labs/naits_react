import axios from 'axios'
import * as config from 'config/config.js'
import { strcmp } from 'functions/utils'

export function reset () {
  return function (dispatch) {
    dispatch({ type: 'RESET_STANDALONE_ACTION' })
  }
}

export function standAloneAction (actionParams) {
  return function (dispatch) {
    dispatch({ id: actionParams.urlCode, type: 'RESET_STANDALONE_ACTION' })
    const verbPath = config.svConfig.triglavRestVerbs[actionParams.urlCode]
    const restUrl = `${config.svConfig.restSvcBaseUrl}${verbPath}/${actionParams.session}/${actionParams.mainParam}`
    const requestObject = {
      method: actionParams.method,
      url: restUrl
    }
    const objectArray = actionParams.objectArray
    if (objectArray && strcmp(actionParams.method, 'post')) {
      requestObject.data = JSON.stringify({objectArray})
      requestObject.headers = { 'Content-Type': 'application/x-www-form-urlencoded' }
    }
    axios(requestObject)
      .then((response) => {
        dispatch({ id: actionParams.urlCode, type: 'STANDALONE_ACTION_FULFILLED', payload: response })
      }).catch((error) => {
        dispatch({ id: actionParams.urlCode, type: 'STANDALONE_ACTION_REJECTED', payload: error })
      })
  }
}
