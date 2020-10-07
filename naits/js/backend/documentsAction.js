import axios from 'axios'
import * as config from 'config/config.js'

export function documentsAction (triglavMethod, svSession, parentId, parentTypeId, component) {
  return function (dispatch) {
    let verbPath
    let restUrl

    verbPath = config.svConfig.triglavRestVerbs[triglavMethod]
    restUrl = config.svConfig.restSvcBaseUrl + verbPath

    restUrl = restUrl.replace('%session', svSession)
    restUrl = restUrl.replace('%parentId', parentId)
    restUrl = restUrl.replace('%parentTypeId', parentTypeId)
    restUrl = restUrl.replace('%component', component)

    dispatch({ type: `${triglavMethod}_DATA_PENDING`, payload: undefined })
    axios.get(restUrl)
      .then((response) => {
        dispatch({ type: `${triglavMethod}_DATA_FULFILLED`, payload: response.data })
      }).catch((err) => {
        dispatch({ type: `${triglavMethod}_DATA_REJECTED`, payload: err })
      })
  }
}
