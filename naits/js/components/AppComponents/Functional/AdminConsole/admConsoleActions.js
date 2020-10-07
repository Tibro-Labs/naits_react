import axios from 'axios'
import * as config from 'config/config.js'

export function assignOrUnasignPackagePermissionOnUserOrGroup (restUrl, objectArray) {
  return function (dispatch) {
    dispatch({ type: 'ASSIGN_PACKAGE_PENDING' })
    axios({
      method: 'post',
      url: restUrl,
      data: JSON.stringify({ objectArray }),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .then((response) => {
        dispatch({ type: 'ASSIGN_PACKAGE_FULFILLED', payload: response })
      }).catch((err) => {
        dispatch({ type: 'ASSIGN_PACKAGE_REJECTED', payload: err })
      })
  }
}

export function userAttachmentPostMethod (restUrl, actionType, objectArray) {
  return function (dispatch) {
    dispatch({ type: 'REMOVE_ORG_UNIT_PENDING' })
    axios({
      method: 'post',
      url: restUrl,
      data: JSON.stringify({ objectArray }),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then((response) => {
      dispatch({ type: 'REMOVE_ORG_UNIT_FULFILLED', payload: response })
    }).catch((err) => {
      dispatch({ type: 'REMOVE_ORG_UNIT_REJECTED', payload: err })
    })
  }
}

export function assignUserToLaboratory (restUrl, actionType, objectArray) {
  return function (dispatch) {
    dispatch({ type: actionType + '_PENDING' })
    axios({
      method: 'post',
      url: restUrl,
      data: JSON.stringify({ objectArray }),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then((response) => {
      dispatch({ type: actionType + '_FULFILLED', payload: response })
    }).catch((err) => {
      dispatch({ type: actionType + '_REJECTED', payload: err })
    })
  }
}

export function fetchUserGroups (restUrl) {
  return function (dispatch) {
    dispatch({ type: 'FETCH_USER_GROUPS_PENDING' })
    axios.get(restUrl).then((response) => {
      dispatch({ type: 'FETCH_USER_GROUPS_FULFILLED', payload: response })
    }).catch((error) => {
      dispatch({ type: 'FETCH_USER_GROUPS_REJECTED', payload: error })
    })
  }
}

export function fetchFilterId (restUrl) {
  return function (dispatch) {
    dispatch({ type: 'FETCH_CRITERIA_TYPE_PENDING' })
    axios.get(restUrl).then((response) => {
      dispatch({ type: 'FETCH_CRITERIA_TYPE_FULFILLED', payload: response })
    }).catch((error) => {
      dispatch({ type: 'FETCH_CRITERIA_TYPE_REJECTED', payload: error })
    })
  }
}

export function resetUser () {
  return function (dispatch) {
    dispatch({ type: 'RESET_MASS_USER_ACTION', payload: null })
  }
}
export function massUserAction (svSession, actionName, subActionName, note, objectArray) {
  return function (dispatch) {
    const verbPath = config.svConfig.triglavRestVerbs.MASS_USER_ACTION
    const restUrl = `${config.svConfig.restSvcBaseUrl}${verbPath}/${svSession}/${actionName}/${subActionName}/${note}`
    axios({
      method: 'post',
      url: restUrl,
      data: objectArray !== null ? JSON.stringify({ objectArray }) : JSON.stringify({ 'actionName': actionName }),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .then((response) => {
        dispatch({ type: 'MASS_USER_ACTION_FULFILLED', payload: response })
      }).catch((error) => {
        dispatch({ type: 'MASS_USER_ACTION_REJECTED', payload: error })
      })
  }
}

export function resetConsoleReducerState (actionType) {
  return function (dispatch) {
    dispatch({ type: actionType, payload: null })
  }
}

export function notificationAttachmentPostMethod (restUrl, objectArray) {
  return function (dispatch) {
    dispatch({ type: 'ATTACH_NOTIFICATION_PENDING' })
    axios({
      method: 'post',
      url: restUrl,
      data: JSON.stringify({ objectArray }),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then((response) => {
      dispatch({ type: 'ATTACH_NOTIFICATION_FULFILLED', payload: response })
    }).catch((err) => {
      dispatch({ type: 'ATTACH_NOTIFICATION_REJECTED', payload: err })
    })
  }
}
