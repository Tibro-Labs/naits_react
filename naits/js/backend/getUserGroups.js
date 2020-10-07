import axios from 'axios'

export function resetUserGroups () {
  return function (dispatch) {
    dispatch({ type: 'RESET_GET_USER_GROUPS', payload: null })
  }
}

export function getUserGroups (restUrl) {
  return function (dispatch) {
    axios.get(restUrl).then((response) => {
      dispatch({ type: 'GET_USER_GROUPS_FULFILLED', payload: response.data })
    }).catch((error) => {
      dispatch({ type: 'GET_USER_GROUPS_REJECTED', payload: error })
    })
  }
}
