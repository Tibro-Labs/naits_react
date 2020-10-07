import axios from 'axios'
import * as config from 'config/config.js'

export function resetLabSample () {
  return function (dispatch) {
    dispatch({ type: 'RESET_LAB_SAMPLE_ACTION', payload: null })
  }
}

export function labSampleAction (session, actionName, subActionName, actionParam, objectArray) {
  return function (dispatch) {
    const verbPath = config.svConfig.triglavRestVerbs.LAB_SAMPLE_ACTION
    const restUrl = `${config.svConfig.restSvcBaseUrl}${verbPath}/${session}/${actionName}/${subActionName}/${actionParam}`
    axios({
      method: 'post',
      url: restUrl,
      data: JSON.stringify({objectArray}),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .then((response) => {
        dispatch({ type: 'LAB_SAMPLE_ACTION_FULFILLED', payload: response })
      }).catch((error) => {
        dispatch({ type: 'LAB_SAMPLE_ACTION_REJECTED', payload: error })
      })
  }
}
