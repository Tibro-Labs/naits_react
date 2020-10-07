import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import * as config from 'config/config'
import UserMustChangePassword from 'components/AppComponents/Functional/UserProfile/UserMustChangePassword'
import { alertUser } from 'tibro-components'
import { store } from 'tibro-redux'
import { selectObject } from 'functions/utils'
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
    // Get linked holding/s for the current user, if any
    this.getLinkedHoldingsForCurrentUser()
    // Check if it's the current user's first login
    this.checkIfFirstLogin()
  }

  componentWillUnmount () {
    if (this.state.freeze && this.state.component !== null) {
      hashHistory.push('/default')
    }
  }

  getLinkedHoldingsForCurrentUser = async () => {
    const server = config.svConfig.restSvcBaseUrl
    const verbPath = config.svConfig.triglavRestVerbs.GET_LINKED_HOLDINGS_PER_USER
    let url = `${server}${verbPath}`
    url = url.replace('%session', this.props.svSession)
    try {
      const res = await axios.get(url)
      if (res.data && res.data.length === 1) {
        store.dispatch({ type: 'USER_IS_LINKED_TO_ONE_HOLDING' })
        selectObject('HOLDING', res.data[0])
        hashHistory.push('/main/data/holding')
      } else if (res.data && res.data.length > 1) {
        store.dispatch({ type: 'USER_IS_LINKED_TO_TWO_OR_MORE_HOLDINGS' })
        hashHistory.push('/main/dynamic/holding')
      } else if (res.data.length === 0) {
        store.dispatch({ type: 'USER_IS_NOT_LINKED_TO_ANY_HOLDINGS' })
      }
    } catch (err) {
      console.error(err)
    }
  }

  checkIfFirstLogin = async () => {
    const server = config.svConfig.restSvcBaseUrl
    const webService = config.svConfig.triglavRestVerbs.CHECK_IF_FIRST_LOGIN
    let restUrl = `${server}${webService}/${this.props.svSession}`
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
  svSession: state.security.svSession
})

export default connect(mapStateToProps)(EnforcePasswordChange)
