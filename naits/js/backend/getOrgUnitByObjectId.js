import axios from 'axios'
import * as config from 'config/config.js'
import { store } from 'tibro-redux'

export function getOrgUnitByObjectId (argsObject) {
  return function (dispatch) {
    let verbPath
    let restUrl

    const tempVar = 'GET_ORG_UNIT_BY_OBJECT_ID'

    verbPath = config.svConfig.triglavRestVerbs.GET_ORG_UNIT_BY_OBJECT_ID
    restUrl = config.svConfig.restSvcBaseUrl + verbPath

    restUrl = restUrl.replace('%sessionId', store.getState().security.svSession)
    restUrl = restUrl.replace('%objectId', argsObject.props.parentId)

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
