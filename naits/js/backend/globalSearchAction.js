import axios from 'axios'
import * as config from 'config/config.js'

export function globalSearchAction (svSession, tableName, searchCriteria, searchValue, rowLimit, callback, altParam) {
  return function (dispatch) {
    let verbPath
    let restUrl

    const tempVar = 'GLOBAL_SEARCH'

    verbPath = config.svConfig.triglavRestVerbs.GET_TABLE_WITH_LIKE_FILTER
    if (altParam) {
      verbPath = config.svConfig.triglavRestVerbs.GET_TABLE_WITH_LIKE_FILTER_2
    }
    restUrl = config.svConfig.restSvcBaseUrl + verbPath

    restUrl = restUrl.replace('%svSession', svSession)
    restUrl = restUrl.replace('%objectName', tableName)
    restUrl = restUrl.replace('%searchBy', searchCriteria)
    restUrl = restUrl.replace('%searchForValue', searchValue)
    restUrl = restUrl.replace('%rowlimit', rowLimit)

    dispatch({ type: `${tempVar}_DATA_PENDING`, payload: undefined })
    axios.get(restUrl)
      .then((response) => {
        dispatch({ type: `${tempVar}_DATA_FULFILLED`, payload: response.data })
        if (callback instanceof Function && !(response.data instanceof Error)) {
          // give callback response data from axios
          callback(response.data)
        }
      }).catch((err) => {
        dispatch({ type: `${tempVar}_DATA_REJECTED`, payload: err })
        if (callback instanceof Function) {
          // give callback response data from axios
          callback(err)
        }
      })
  }
}
