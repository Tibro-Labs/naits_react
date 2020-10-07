import axios from 'axios'
import * as config from 'config/config.js'
import { store } from 'tibro-redux'

// LINK_OBJECTS: '/ReactElements/linkObjects/%session/%objectId1/%tableName1/%objectId2/%tableName2/%linkName',
export function linkObjectsAction (argsObject) {
  return function (dispatch) {
    let verbPath
    let restUrl

    const tempVar = 'LINK_OBJECTS'

    verbPath = config.svConfig.triglavRestVerbs.LINK_OBJECTS
    restUrl = config.svConfig.restSvcBaseUrl + verbPath

    restUrl = restUrl.replace('%session', store.getState().security.svSession)
    restUrl = restUrl.replace('%objectId1', argsObject.objectId1)
    restUrl = restUrl.replace('%tableName1', argsObject.tableName1)
    restUrl = restUrl.replace('%objectId2', argsObject.objectId2)
    restUrl = restUrl.replace('%tableName2', argsObject.tableName2)
    restUrl = restUrl.replace('%linkName', argsObject.linkName)

    dispatch({ type: `${tempVar}_DATA_PENDING`, payload: undefined })
    axios.get(restUrl)
      .then((response) => {
        dispatch({ type: `${tempVar}_DATA_FULFILLED`, payload: response.data })
        if (argsObject.callback instanceof Function && !(response.data instanceof Error)) {
          // give callback response data from axios
          argsObject.callback('success', response.data, argsObject.parrentGridId)
        }
      }).catch((err) => {
        dispatch({ type: `${tempVar}_DATA_REJECTED`, payload: err })
        if (argsObject.callback instanceof Function) {
          // give callback response data from axios
          if (err.response && err.response.data) {
            let errMessage = err.response.data.split(',')[2]
            let labelCode = errMessage.split(':')[1]
            argsObject.callback('error', labelCode, argsObject.parrentGridId)
          }
        }
      })
  }
}
