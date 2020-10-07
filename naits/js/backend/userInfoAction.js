import axios from 'axios'
import * as config from 'config/config.js'

export function userInfoAction (svSession, actionType, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, json) {
  return function (dispatch) {
    let verbPath
    let restUrl
    switch (actionType) {
      case 'GET_BASIC': {
        verbPath = config.svConfig.triglavRestVerbs.MAIN_GET_BASIC_USER_DATA
        restUrl = config.svConfig.restSvcBaseUrl + verbPath
        break
      }
      case 'GET_FULL': {
        verbPath = config.svConfig.triglavRestVerbs.MAIN_GET_FULL_USER_DATA
        restUrl = config.svConfig.restSvcBaseUrl + verbPath
        restUrl = restUrl.replace('%objectId', $1)
        break
      }
      case 'EDIT': {
        verbPath = config.svConfig.triglavRestVerbs.MAIN_EDIT_USER_CONTACT_DATA
        restUrl = config.svConfig.restSvcBaseUrl + verbPath
        restUrl = restUrl.replace('%firstName', $1)
        restUrl = restUrl.replace('%lastName', $2)
        break
      }
      case 'SAVE': {
        verbPath = config.svConfig.triglavRestVerbs.MAIN_SAVE_USER_CONTACT_DATA2
        restUrl = config.svConfig.restSvcBaseUrl + verbPath
        restUrl = restUrl.replace('%objectId', $1)
        restUrl = restUrl.replace('%objectIdName', $2)
        restUrl = restUrl.replace('%streetType', $3)
        restUrl = restUrl.replace('%streetName', $4)
        restUrl = restUrl.replace('%houseNumber', $5)
        restUrl = restUrl.replace('%postalCode', $6)
        restUrl = restUrl.replace('%city', $7)
        restUrl = restUrl.replace('%state', $8)
        restUrl = restUrl.replace('%phoneNumber', $9)
        restUrl = restUrl.replace('%mobileNumber', $10)
        restUrl = restUrl.replace('%fax', $11)
        restUrl = restUrl.replace('%email', $12)
        break
      }
      case 'CHANGEPASS': {
        verbPath = config.svConfig.triglavRestVerbs.MAIN_CHANGEPASS
        restUrl = config.svConfig.restSvcBaseUrl + verbPath
        restUrl = restUrl.replace('%oldPass', $1)
        restUrl = restUrl.replace('%newPass', $2)
        break
      }
      case 'ALLOWED_CUSTOM_OBJECTS': {
        verbPath = config.svConfig.triglavRestVerbs.MAIN_ALLOWED_CUSTOM_OBJECTS_PER_USER
        restUrl = config.svConfig.restSvcBaseUrl + verbPath
        break
      }
    }

    restUrl = restUrl.replace('%session', svSession)
    if (actionType.match(/^(GET_BASIC|GET_FULL|EDIT|SAVE|CHANGEPASS|ALLOWED_CUSTOM_OBJECTS)$/)) {
      dispatch({ type: `${actionType}_USER_DATA_PENDING`, payload: undefined })
      if (actionType.match(/^(SAVE)$/)) {
        axios({
          method: 'post',
          url: restUrl,
          data: json,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
          .then((response) => {
            dispatch({ type: `${actionType}_USER_DATA_FULFILLED`, payload: response.data })
          }).catch((err) => {
            dispatch({ type: `${actionType}_USER_DATA_REJECTED`, payload: err })
          })
      } else {
        axios.get(restUrl)
          .then((response) => {
            dispatch({ type: `${actionType}_USER_DATA_FULFILLED`, payload: response.data })
          }).catch((err) => {
            dispatch({ type: `${actionType}_USER_DATA_REJECTED`, payload: err })
          })
      }
    }
  }
}

export function getLocaleObjectId (url) {
  return function (dispatch) {
    axios.get(url)
      .then((response) => {
        dispatch({ type: 'GET_LOCALE_OBJ_ID_FULFILLED', payload: response.data })
      }).catch((err) => {
        dispatch({ type: 'GET_LOCALE_OBJ_ID_REJECTED', payload: err })
      })
  }
}
