import axios from 'axios'

/* Get user group - currently only return true/false
if the user has/does not hve ADMIN privileges (has admin group) */
export function checkIfUserHasAdmGroup (restUrl) {
  return function (dispatch) {
    axios.get(restUrl).then((response) => {
      dispatch({ type: 'IS_USER_ADMIN_FULFILLED', payload: response.data })
    }).catch((error) => {
      dispatch({ type: 'IS_USER_ADMIN_REJECTED', payload: error })
    })
  }
}
