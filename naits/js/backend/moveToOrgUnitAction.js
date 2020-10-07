import axios from 'axios'
import * as config from 'config/config.js'

export function moveToOrgUnitAction (session, tableName, orgUnitId, objectArray) {
  return function (dispatch) {
    dispatch({ type: 'MOVE_TO_ORG_UNIT_PENDING' })
    const verbPath = config.svConfig.triglavRestVerbs.MOVE_INV_ITEM_TO_ORG_UNIT
    const restUrl = `${config.svConfig.restSvcBaseUrl}${verbPath}/${session}/${tableName}/${orgUnitId}`
    axios({
      method: 'post',
      url: restUrl,
      data: JSON.stringify({ objectArray }),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .then((response) => {
        dispatch({ type: 'MOVE_TO_ORG_UNIT_FULFILLED', payload: response })
      }).catch((error) => {
        dispatch({ type: 'MOVE_TO_ORG_UNIT_REJECTED', payload: error })
      })
  }
}
