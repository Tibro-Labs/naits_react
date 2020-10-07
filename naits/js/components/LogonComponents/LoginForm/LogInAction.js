import md5 from 'md5'
import { connect } from 'react-redux'
import { dataToRedux, svSessionRegxp } from 'tibro-redux'

const login = (username, password) => {
  // purge redux state of any unneeded errors
  dataToRedux(null, 'security', 'lastError', undefined)
  // main login dispatch, first argument is a callback
  dataToRedux(
    (response) => { // callback
    // save cookie and get user type as callback
      if (svSessionRegxp(response)) {
        dataToRedux(null, 'security', 'svSessionMsg', 'OK')
        // write logged in user name to store
        dataToRedux(null, 'security', 'currentUser', username)
      }
    },
    // first dispatch arguments
    'security', 'svSession', 'MAIN_LOGIN', username, md5(password)
  )
}

export default function LogInAction (targetComponent) {
  const mapDispatchToProps = () => ({
    login: (username, password) => login(username, password)
  })

  const mapStateToProps = state => ({
    lastError: state.security.lastError
  })

  return connect(mapStateToProps, mapDispatchToProps)(targetComponent)
}
