import axios from 'axios'
import * as config from 'config/config.js'
import { store } from 'tibro-redux'

// GET_HOLDING_PIC: '/naits_triglav_plugin/ApplicationServices/getPicPerHolding/%session/$holdingId'
export function getHoldingPicAction (argsObject) {
  return function (dispatch) {
    let verbPath
    let restUrl

    const tempVar = 'GET_HOLDING_PIC'

    verbPath = config.svConfig.triglavRestVerbs.GET_HOLDING_PIC
    restUrl = config.svConfig.restSvcBaseUrl + verbPath

    restUrl = restUrl.replace('%svSession', store.getState().security.svSession)
    restUrl = restUrl.replace('%holdingId', argsObject.props.parentId)

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
          argsObject.callback(err)
        }
      })
  }
}

export function getHoldingPerExportQuarantine (argsObject) {
  return function (dispatch) {
    let verbPath
    let restUrl

    const tempVar = 'GET_HOLDING_PER_EXP_QUARANTINE'

    verbPath = config.svConfig.triglavRestVerbs[tempVar]
    restUrl = config.svConfig.restSvcBaseUrl + verbPath

    restUrl = restUrl.replace('%svSession', store.getState().security.svSession)
    restUrl = restUrl.replace('%quarantineObjId', argsObject.props.objectId)

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
          argsObject.callback(err)
        }
      })
  }
}
