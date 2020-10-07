import React from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import animations from './animations.module.css'
import style from './MessagingSubsystemCircle.module.css'
import createHashHistory from 'history/createHashHistory'
import * as config from 'config/config'
const hashHistory = createHashHistory()

class MessagingSubsystemCircle extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      unread: 0
    }
  }

  componentDidMount () {
    // Get number of unread messages
    this.getNumOfUnreadMsgs()
  }

  getNumOfUnreadMsgs = () => {
    const server = config.svConfig.restSvcBaseUrl
    let verbPath = config.svConfig.triglavRestVerbs.COUNT_UNREAD_MSGS
    verbPath = verbPath.replace('%session', this.props.session)
    let url = `${server}${verbPath}`
    axios.get(url)
      .then(res => this.setState({ unread: res.data }))
      .catch(err => console.error(err))
  }

  render () {
    return (
      <div className={animations.fadeIn}>
        <div
          onClick={() => hashHistory.push('/messages')}
          className={style.messagesContainer}
        >
          <span>
            {this.context.intl.formatMessage({
              id: 'naits.main.messages',
              defaultMessage: 'naits.main.messages'
            })}
          </span>
          <div className={style.notificationsCircle}>{this.state.unread}</div>
        </div>
      </div>
    )
  }
}

MessagingSubsystemCircle.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession
})

export default connect(mapStateToProps)(MessagingSubsystemCircle)
