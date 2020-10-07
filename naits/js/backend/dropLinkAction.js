import axios from 'axios'
import * as config from 'config/config.js'
import { store } from 'tibro-redux'

export function resetLink () {
  return function (dispatch) {
    dispatch({ type: 'RESET_DROP_LINK_OBJECTS', payload: null })
  }
}

export function dropLinkAction (session) {
  function getData () {
    let verbPath, restUrl, objectId1
    const selectedObjects = store.getState().gridConfig.gridHierarchy
    const selectedGridRows = store.getState().selectedGridRows.selectedGridRows
    const componentToDisplay = store.getState().componentToDisplay.componentToDisplay
    let rows = []
    let linkName = ''
    let objectId2 = ''
    for (let i = 0; i < selectedObjects.length; i++) {
      if (selectedObjects.length > 0 && selectedObjects[i].active) {
        objectId2 = selectedObjects[i].row['HOLDING.OBJECT_ID']
      }
    }
    if (componentToDisplay.length > 0) {
      linkName = componentToDisplay[0].props.gridProps.linkName
    }
    for (let i = 0; i < selectedGridRows.length; i++) {
      if (selectedGridRows.length > 0) {
        objectId1 = selectedGridRows[i]['HOLDING_RESPONSIBLE.OBJECT_ID']
        verbPath = config.svConfig.triglavRestVerbs.DROP_LINK_OBJECTS
        restUrl = config.svConfig.restSvcBaseUrl + verbPath
        restUrl = restUrl.replace('%session', session)
        restUrl = restUrl.replace('%objectId1', objectId1)
        restUrl = restUrl.replace('%tableName1', 'HOLDING_RESPONSIBLE')
        restUrl = restUrl.replace('%objectId2', objectId2)
        restUrl = restUrl.replace('%tableName2', 'HOLDING')
        restUrl = restUrl.replace('%linkName', linkName)
        rows.push(axios.get(restUrl))
      }
    }
    return rows
  }

  return function (dispatch) {
    axios.all(getData())
      .then(axios.spread(function (response) {
        dispatch({ type: 'DROP_LINK_OBJECTS_FULFILLED', payload: response })
      })).catch((error) => {
        dispatch({ type: 'DROP_LINK_OBJECTS_REJECTED', payload: error })
      })
  }
}
