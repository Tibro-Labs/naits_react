import axios from 'axios'
import * as config from 'config/config.js'

export function notificationAction (svSession) {
  return function (dispatch) {
    let verbPath
    let restUrl

    verbPath = config.svConfig.triglavRestVerbs.MAIN_NOTIFICATIONS
    restUrl = config.svConfig.restSvcBaseUrl + verbPath

    restUrl = restUrl.replace('%session', svSession)

    dispatch({ type: 'NOTIFICATION_DATA_PENDING', payload: undefined })
    axios.get(restUrl)
      .then((response) => {
        dispatch({ type: 'NOTIFICATION_DATA_FULFILLED', payload: response.data })
      }).catch((err) => {
        dispatch({ type: 'NOTIFICATION_DATA_REJECTED', payload: err })
      })
  }
}
