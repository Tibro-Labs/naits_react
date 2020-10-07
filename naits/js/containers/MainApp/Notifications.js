import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { alertUser } from 'tibro-components'
import NotificationBadge, { Effect } from 'react-notification-badge'
import { notificationAction } from 'backend/notificationAction'
import { renderToStaticMarkup } from 'react-dom/server'
import style from './Notifications.module.css'

class Notifications extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: undefined,
      toggleNotifications: false,
      notificationMessages: undefined
    }
  }

  componentDidMount () {
    this.props.notificationAction(this.props.svSession)
  }

  componentWillReceiveProps (nextProps) {
    this.menageNotifications(nextProps)
  }

  menageNotifications = (nextProps) => {
    if ((this.props.notificationMessages !== nextProps.notificationMessages) && nextProps.notificationMessages) {
      const notificationMessages = nextProps.notificationMessages.map((element, index) => {
        // callculate heigh percent
        let heightPercent
        if (nextProps.notificationCount < 4) {
          heightPercent = 50
        } else {
          heightPercent = 100
        }

        const notification = (<div key={`notificationToolbar${index}`}>
          <p>Type: {element[0].TYPE}</p>
          <p>Sender: {element[3].SENDER}</p>
          <p>Message: {element[2].MESSAGE}</p>
        </div>)
        return (<div
          style={{ height: `calc(${heightPercent}% / ${nextProps.notificationCount})` }}
          onClick={(e) => {
            e.preventDefault()
            this.showFullNotification(element[1].TITLE, notification)
          }}
          className={style.scrollLeft}
          key={`notificationsT${index}`}
        >
          <p>
            {element[1].TITLE}
          </p>
        </div>)
      })
      this.setState({ notificationMessages })
    }
  }

  showFullNotification = (title, msg) => {
    const message = document.createElement('div')
    message.innerHTML = renderToStaticMarkup(msg)
    // used to set li item as inactive in MainMenuTop
    this.props.hoverCallback()
    this.setState({
      alert: alertUser(
        true,
        'info',
        title,
        null,
        () => this.setState({ alert: alertUser(false) }),
        null, null, null, null, null, null, null,
        message
      )
    })
  }

  // this.props.hoverCallback is used to set li item as inactive in MainMenuTop

  dropdown = () => (<div>
    {
      this.props.toggleNotifications && <div
        onClick={this.props.hoverCallback}
        style={{
          position: 'fixed',
          backgroundColor: 'rgba(36, 19, 8, 0.9)',
          boxShadow: 'rgba(0, 0, 0, 0.5) 1px 1px 20px',
          borderRadius: '5px',
          height: '32%',
          width: '25%',
          top: '55px'
        }}
      >
        {this.state.notificationMessages}
      </div>
    }
  </div>)
  notificationBadge = () => (<NotificationBadge
    containerStyle={{ position: 'relative', width: 'auto', height: 'auto' }}
    count={this.props.notificationCount}
    effect={Effect.SCALE}
    style={{
      top: '24px', left: '15px', bottom: '', right: ''
    }}
  />)

  render () {
    return (
      <div>
        {this.state.alert}
        {this.notificationBadge()}
        {this.dropdown()}
      </div>
    )
  }
}

Notifications.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  svSession: state.security.svSession,
  notificationCount: state.notificationReducer.count,
  notificationMessages: state.notificationReducer.messages
})

const mapDispatchToProps = dispatch => ({
  notificationAction: (svSession) => {
    dispatch(notificationAction(svSession))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notifications)
