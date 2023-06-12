import React from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { alertUser } from 'tibro-components'
import { store } from 'tibro-redux'
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
    const youHaveUnreadMsgsLabel = this.context.intl.formatMessage({
      id: 'naits.main.you_have_unread_messages',
      defaultMessage: 'naits.main.you_have_unread_messages'
    })
    const openInboxLabel = this.context.intl.formatMessage({
      id: 'naits.main.open_inbox',
      defaultMessage: 'naits.main.open_inbox'
    })
    const dismissLabel = this.context.intl.formatMessage({
      id: 'naits.main.dismiss',
      defaultMessage: 'naits.main.dismiss'
    })
    const server = config.svConfig.restSvcBaseUrl
    let verbPath = config.svConfig.triglavRestVerbs.GET_NUMBER_OF_UNREAD_OF_MSGS_PER_USER
    verbPath = verbPath.replace('%session', this.props.session)
    const url = `${server}${verbPath}`
    axios.get(url).then(res => {
      this.setState({ unread: res.data })
      if (res.data > 0 && !this.props.weDismissedTheUnreadMessagesAlert) {
        alertUser(true, 'info', youHaveUnreadMsgsLabel + '.', null, () => {
          store.dispatch({ type: 'WE COME FROM THE UNREAD MESSAGES ALERT' })
          hashHistory.push('/chats')
        }, () => store.dispatch({ type: 'WE DISMISSED THE UNREAD MESSAGES ALERT' }), true, openInboxLabel, dismissLabel)
      }
    }).catch(err => console.error(err))
  }

  render () {
    return (
      <div className={animations.fadeIn}>
        <div className={style.messagesContainer} onClick={() => hashHistory.push('/chats')}>
          <span className={style.messagesTitle}>
            {this.context.intl.formatMessage({
              id: 'naits.main.messages',
              defaultMessage: 'naits.main.messages'
            })}
          </span>
          <div className={`badge badge-danger ${style.notificationsCircle}`}><span className={style.notificationNumber}>{this.state.unread}</span></div>
        </div>
      </div>
    )
  }
}

MessagingSubsystemCircle.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession,
  weDismissedTheUnreadMessagesAlert: state.unreadMessagesAlert.weDismissedTheUnreadMessagesAlert
})

export default connect(mapStateToProps)(MessagingSubsystemCircle)
