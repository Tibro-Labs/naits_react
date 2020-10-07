import axios from 'axios'
import * as config from 'config/config.js'
import { store } from 'tibro-redux'

// HOLDING_BOOK: '/naits_triglav_plugin/ApplicationServices/getNextOrPreviousHolding/%session/%holdingObjId/%direction'
// direction can be FORWARD or BACKWARD
export function holdingBookAction (argsObject) {
  return function (dispatch) {
    let verbPath
    let restUrl

    const tempVar = 'HOLDING_BOOK'

    verbPath = config.svConfig.triglavRestVerbs.HOLDING_BOOK
    restUrl = config.svConfig.restSvcBaseUrl + verbPath

    restUrl = restUrl.replace('%session', store.getState().security.svSession)
    restUrl = restUrl.replace('%holdingObjId', argsObject.holdingObjId)
    restUrl = restUrl.replace('%direction', argsObject.direction)

    dispatch({ type: `${tempVar}_DATA_PENDING`, payload: undefined })
    axios.get(restUrl)
      .then((response) => {
        dispatch({ type: `${tempVar}_DATA_FULFILLED`, payload: response.data })
        if (argsObject.callback instanceof Function && !(response.data instanceof Error)) {
          // give callback response data from axios
          argsObject.callback(response.data)
        }
      }).catch((err) => {
        dispatch({ type: `${tempVar}_DATA_REJECTED`, payload: err })
        if (argsObject.callback instanceof Function) {
          // give callback response data from axios
          if (err.response && err.response.data && err.response.data.split(',') && err.response.data.split(',')[1]) {
            argsObject.callback(err)
          }
        }
      })
  }
}
