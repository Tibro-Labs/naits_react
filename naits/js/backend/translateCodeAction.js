import axios from 'axios'
import * as config from 'config/config.js'
import { store } from 'tibro-redux'

// TRANSLATE_CODE_ITEM: '/naits_triglav_plugin/ApplicationServices/translateCodeItem/%svSession/%typeId/%fieldName/%fieldValue/%locale',
export function translateCodeAction (argsObject) {
  return function (dispatch) {
    let verbPath
    let restUrl

    let typeId, fieldName, fieldValue, gridType, callback

    if (argsObject.props && argsObject.props.parentTypeId) {
      typeId = argsObject.props.parentTypeId
    }
    if (argsObject.state && argsObject.state.gridType) {
      gridType = argsObject.state.gridType
    }
    if (argsObject.element && argsObject.element.ID) {
      fieldName = argsObject.element.ID
    }
    if (gridType && fieldName) {
      fieldValue = argsObject.state[`${gridType}.${fieldName}`]
      if (argsObject.state[`${gridType}.${fieldName}`] === 'N/A') {
        fieldValue = undefined
      }
    }
    if (argsObject.callback) {
      callback = argsObject.callback
    }

    const tempVar = 'TRANSLATE_CODE_ITEM'

    verbPath = config.svConfig.triglavRestVerbs.TRANSLATE_CODE_ITEM
    restUrl = config.svConfig.restSvcBaseUrl + verbPath

    restUrl = restUrl.replace('%typeId', typeId)
    restUrl = restUrl.replace('%fieldName', fieldName)
    restUrl = restUrl.replace('%fieldValue', fieldValue)

    restUrl = restUrl.replace('%svSession', store.getState().security.svSession)
    restUrl = restUrl.replace('%locale', store.getState().intl.locale.replace('-', '_'))

    dispatch({ type: `${tempVar}_DATA_PENDING`, payload: undefined })
    axios.get(restUrl)
      .then((response) => {
        dispatch({ type: `${tempVar}_DATA_FULFILLED`, payload: response.data })
        if (callback instanceof Function && !(response.data instanceof Error)) {
          // give callback response data from axios
          callback(response.data)
          store.dispatch({ type: 'RESET_HOLDING_SIDE_MENU_CHANGE' })
          store.dispatch({ type: 'CLOSE_QUESTIONNAIRES' })
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
