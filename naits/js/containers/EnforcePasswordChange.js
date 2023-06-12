import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import * as config from 'config/config'
import UserMustChangePassword from 'components/AppComponents/Functional/UserProfile/UserMustChangePassword'
import { alertUser } from 'tibro-components'
import { store } from 'tibro-redux'
import { userInfoAction } from 'backend/userInfoAction'
import createHashHistory from 'history/createHashHistory'
const hashHistory = createHashHistory()

class EnforcePasswordChange extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      component: null,
      freeze: true,
      alert: null
    }
  }

  componentDidMount () {
    // Check if it's the current user's first login
    if (!this.props.theWsForPasswordChangeWasCalledAlready) {
      this.checkIfFirstLogin()
    } else {
      this.setState({ component: this.props.children, freeze: false })
    }
    // Get the current user's basic data
    if (!this.props.userInfo.userObjId) {
      this.props.userInfoAction(this.props.svSession, 'GET_BASIC')
    }
  }

  componentWillUnmount () {
    if (this.state.freeze && this.state.component !== null) {
      hashHistory.push('/default')
    }
  }

  checkIfFirstLogin = async () => {
    const server = config.svConfig.restSvcBaseUrl
    const webService = config.svConfig.triglavRestVerbs.CHECK_IF_FIRST_LOGIN
    let restUrl = `${server}${webService}/${this.props.svSession}`
    store.dispatch({ type: 'THE_WS_FOR_PASSWORD_CHANGE_WAS_CALLED_ALREADY' })
    try {
      const res = await axios.get(restUrl)
      if (res.data) {
        this.setState({
          freeze: true,
          component: <UserMustChangePassword
            onAlertClose={this.reloadOnPassChange}
            hideCloseButton
            forcePassChange />
        })
      } else {
        this.setState({ freeze: false, component: this.props.children })
      }
    } catch (error) {
      this.setState({
        alert: alertUser(true, 'error', error, null, () => {
          this.setState({
            alert: alertUser(false, 'info', '')
          })
        })
      })
    }
  }

  reloadOnPassChange () {
    location.reload()
  }

  render () {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        {this.state.alert}
        {this.state.component}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  svSession: state.security.svSession,
  userInfo: state.userInfoReducer,
  theWsForPasswordChangeWasCalledAlready: state.userInfoReducer.theWsForPasswordChangeWasCalledAlready
})

const mapDispatchToProps = dispatch => ({
  userInfoAction: (svSession, actionType, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) => {
    dispatch(userInfoAction(svSession, actionType, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(EnforcePasswordChange)
