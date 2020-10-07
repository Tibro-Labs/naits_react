import axios from 'axios'
import * as config from 'config/config.js'

export function setActivityPeriodAction (session, holdingObjId, objectArray, dateFrom, dateTo) {
  return function (dispatch) {
    const verbPath = config.svConfig.triglavRestVerbs.SET_ACTIVITY_PERIOD
    const restUrl = `${config.svConfig.restSvcBaseUrl}${verbPath}/${session}/${holdingObjId}/${dateFrom}/${dateTo}`
    axios({
      method: 'post',
      url: restUrl,
      data: JSON.stringify({objectArray}),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .then((response) => {
        dispatch({ type: 'SET_ACTIVITY_PERIOD_FULFILLED', payload: response })
      }).catch((error) => {
        dispatch({ type: 'SET_ACTIVITY_PERIOD_REJECTED', payload: error })
      })
  }
}
