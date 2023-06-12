import axios from 'axios'
import * as config from 'config/config.js'

export function changeMovementDocStatus (session, status, objectArray) {
  return function (dispatch) {
    dispatch({ type: 'CHANGE_MOVEMENT_DOC_STATUS_PENDING' })
    const verbPath = config.svConfig.triglavRestVerbs['CHANGE_MOVEMENT_DOC_STATUS']
    const restUrl = `${config.svConfig.restSvcBaseUrl}${verbPath}/${session}/${status}`
    const requestObject = {
      method: 'post',
      url: restUrl,
      data: JSON.stringify({ objectArray }),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }
    axios(requestObject)
      .then((response) => {
        dispatch({ type: 'CHANGE_STATUS_FULFILLED', payload: response })
      }).catch((error) => {
        dispatch({ type: 'CHANGE_STATUS_REJECTED', payload: error })
      })
  }
}
