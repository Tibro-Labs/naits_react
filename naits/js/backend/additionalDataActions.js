import axios from 'axios'
import { store } from 'tibro-redux'
import { isValidArray } from 'functions/utils'
import * as config from 'config/config.js'

// Get keeper info for selected holding
export function getAdditionalHoldingData (session, holdingId) {
  let holdingRow
  const items = store.getState().gridConfig.gridHierarchy
  for (let i = 0; i < items.length; i++) {
    if (items[i].active && items[i].gridType === 'HOLDING' && items[i].row['HOLDING.OBJECT_ID'] === holdingId) {
      holdingRow = items[i].row
    }
  }

  let server = config.svConfig.restSvcBaseUrl
  let verbPath = config.svConfig.triglavRestVerbs

  function getKeeper () {
    const restUrl = `${server}${verbPath.GET_HOLDING_KEEPER_INFO}/${session}/${holdingId}`
    return axios.get(restUrl)
  }

  function getVillage () {
    const codeValue = holdingRow['HOLDING.VILLAGE_CODE']
    let restUrl = `${server}${verbPath.GET_TABLE_WITH_LIKE_FILTER}`
    restUrl = restUrl.replace('%svSession', session)
    restUrl = restUrl.replace('%objectName', 'SVAROG_CODES')
    restUrl = restUrl.replace('%searchBy', 'CODE_VALUE')
    restUrl = restUrl.replace('%searchForValue', codeValue)
    restUrl = restUrl.replace('%rowlimit', '100')
    return axios.get(restUrl)
  }

  return function (dispatch) {
    axios.all([getKeeper(), getVillage()])
      .then(axios.spread(function (keeper, village) {
        // Both requests are now complete
        dispatch({ type: 'GET_KEEPER_FULFILLED', payload: keeper })
        if (isValidArray(village.data, 1)) {
          if (village.data.length === 1) {
            const villageName = village.data[0]['SVAROG_CODES.LABEL_CODE']
            dispatch({ type: 'GET_VILLAGE_FULFILLED', payload: villageName })
          } else if (village.data.length > 1) {
            const villageName = village.data[0]['SVAROG_CODES.LABEL_CODE']
            console.warn('Found multiple villages with the same name.')
            dispatch({ type: 'GET_VILLAGE_FULFILLED', payload: villageName })
          } else {
            dispatch({ type: 'GET_VILLAGE_FULFILLED', payload: 'N/A' })
          }
        }
      })).catch((error) => {
        dispatch({ type: 'GET_KEEPER_REJECTED', payload: error })
        dispatch({ type: 'GET_VILLAGE_REJECTED', payload: error })
      })
  }
}

export function getObjectSummary (session, objectType, objectId) {
  return function (dispatch) {
    let verbPath
    let restUrl

    verbPath = config.svConfig.triglavRestVerbs.GET_OBJECT_SUMMARY
    restUrl = `${config.svConfig.restSvcBaseUrl}${verbPath}/${session}/${objectType}/${objectId}`

    axios.get(restUrl)
      .then((response) => {
        // write objects to store
        dispatch({
          type: 'GET_OBJECT_SUMMARY_FULFILLED',
          object: objectType,
          payload: response
        })
      }).catch((error) => {
        dispatch({
          type: 'GET_OBJECT_SUMMARY_REJECTED',
          object: objectType,
          payload: error
        })
      })
  }
}
