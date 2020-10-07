import React from 'react'
import PropTypes from 'prop-types'
import style from './popup.module.css'
import NotificationBadge, { Effect } from 'react-notification-badge'
import * as config from 'config/config.js'
import { connect } from 'react-redux'
import { notificationAction } from 'backend/notificationAction'
import { alertUser } from 'tibro-components'
import { renderToStaticMarkup } from 'react-dom/server'

class NotificationBox extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showAlarm: style.showDiv,
      showBox: style.hideDiv,
      notificationMessages: undefined,
      lastNotificationRadius: undefined
    }
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

        // set last div border radius so it will "fit" in notification box
        if (nextProps.notificationCount > 3) {
          this.setState({ lastNotificationRadius: true })
        }
        const notification = (<div key={`notification${index}`}>
          <p>Type: {element[0].TYPE}</p>
          <p>Sender: {element[3].SENDER}</p>
          <p>Message: {element[2].MESSAGE}</p>
        </div>)
        return (<div
          style={{ height: `calc(${heightPercent}% / ${nextProps.notificationCount})` }}
          onClick={this.showFullNotification(element[1].TITLE, notification)}
          className={style.scrollLeft}
          key={`notifications${index}`}
        >
          <p>
            {element[1].TITLE}
          </p>
        </div>)
      })
      this.setState({ notificationMessages })
    }
  }

  showFullNotification = (title, msg) => () => {
    const message = document.createElement('div')
    message.innerHTML = renderToStaticMarkup(msg)
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

  componentDidMount () {
    // dispatch function that gets notifications
    this.props.notificationAction(this.props.svSession)
  }

  openNotificationBox = () => {
    this.setState({ showAlarm: style.hideDiv, showBox: style.showDiv })
  }

  closeNotificationBox = () => {
    this.setState({ showAlarm: style.showDiv, showBox: style.hideDiv })
  }

  render () {
    const labels = this.context.intl

    return (
      <div className={style.fadeIn}>
        {this.state.alert}
        <div
          className={`${style.popupBox} ${this.state.showBox} ${style.radius} ${
            this.state.lastNotificationRadius ? style.lastRadius : null
          }`}
        >
          <div
            onClick={this.closeNotificationBox}
            className='js-components-AppComponents-Functional-GridInModalLinkObjects-module-closeNotificationList'
            style={{ marginTop: '1px', marginRight: '-11px' }}
          />

          {this.state.notificationMessages}

        </div>
        <div id='showAlarm' className={`${style.mainDiv} ${this.state.showAlarm}`}>
          <NotificationBadge containerStyle={{ width: 'auto', height: 'auto' }} count={this.props.notificationCount} effect={Effect.SCALE} />
          <svg
            data-tip={labels.formatMessage({ id: `${config.labelBasePath}.main.show_notification_box`, defaultMessage: `${config.labelBasePath}.main.show_notification_box` })}
            data-effect='float'
            data-event-off='mouseout'
            onClick={this.openNotificationBox}
            className={style.circle}
            version='1.1'
            id='Capa_1'
            xmlns='http://www.w3.org/2000/svg'
            xmlnsXlink='http://www.w3.org/1999/xlink'
            x='0px'
            y='0px'
            viewBox='0 0 436.907 436.907'
            style={{ enableBackground: 'new 0 0 436.907 436.907' }}
            xmlSpace='preserve'
          >
            <circle style={{ fill: 'rgba(0,0,0,0.5)' }} cx='218.453' cy='218.453' r='218.453' />
            <g>
              <path
                style={{ opacity: '0.1', enableBackground: 'new' }}
                d='M424.832,290.077L235.232,100.45c-4.301-4.301-10.24-6.963-16.794-6.963
                c-13.073,0-23.688,10.615-23.688,23.689c0,4.642,1.365,8.943,3.652,12.595c-26.249,8.465-45.261,33.075-45.261,62.157v40.619
                l-37.786-37.786c-2.15-2.15-5.632-2.15-7.783,0c-22.46,22.46-22.767,58.675-1.092,81.579l-0.034,0.034l0.751,0.751
                c0.137,0.136,0.239,0.273,0.375,0.41c0.068,0.068,0.137,0.102,0.205,0.171l25.975,25.975c0.478,3.413,2.15,6.349,4.54,8.602
                l120.793,120.793C336.514,418.502,399.487,363.109,424.832,290.077z'
              />
              <g>
                <path
                  style={{ fill: '#3A556A' }}
                  d='M218.454,140.896c-13.073,0-23.708-10.636-23.708-23.71c0-13.071,10.636-23.707,23.708-23.707
                c13.073,0,23.707,10.636,23.707,23.707C242.161,130.26,231.527,140.896,218.454,140.896z M218.454,104.513
                c-6.988,0-12.674,5.686-12.674,12.672c0,6.99,5.686,12.676,12.674,12.676c6.988,0,12.672-5.686,12.672-12.676
                C231.127,110.199,225.442,104.513,218.454,104.513z'
                />
                <circle style={{ fill: '#3A556A' }} cx='218.453' cy='317.303' r='26.126' />
              </g>
              <path
                style={{ fill: '#FCD462' }}
                d='M218.453,126.607L218.453,126.607c-36.071,0-65.312,29.241-65.312,65.311v109.723h130.623V191.918
              C283.765,155.848,254.524,126.607,218.453,126.607z'
              />
              <path
                style={{ fill: '#F6C358' }}
                d='M288.99,287.273H147.917c-7.935,0-14.369,6.433-14.369,14.369s6.433,14.368,14.369,14.368H288.99
              c7.935,0,14.369-6.433,14.369-14.368S296.925,287.273,288.99,287.273z'
              />
              <g>
                <path
                  className={style.ringWaveColor}
                  d='M307.257,260.951c-1.412,0-2.823-0.539-3.901-1.616c-2.155-2.155-2.155-5.646,0-7.802
                c8.482-8.484,8.482-22.291,0-30.776c-2.155-2.155-2.155-5.647,0-7.802s5.65-2.155,7.802,0c12.785,12.787,12.785,33.592,0,46.379
                C310.082,260.413,308.669,260.951,307.257,260.951z'
                />
                <path
                  className={style.ringWaveColor}
                  d='M325.443,279.137c-1.412,0-2.823-0.539-3.901-1.616c-2.155-2.155-2.155-5.647,0-7.802
                c18.511-18.513,18.511-48.635,0-67.147c-2.155-2.155-2.155-5.647,0-7.802s5.647-2.155,7.802,0
                c22.812,22.816,22.812,59.935,0,82.751C328.268,278.599,326.855,279.137,325.443,279.137z'
                />
                <path
                  className={style.ringWaveColor}
                  d='M129.649,260.951c-1.412,0-2.825-0.539-3.901-1.616c-12.785-12.787-12.785-33.592,0-46.379
                c2.152-2.155,5.646-2.155,7.802,0c2.155,2.155,2.155,5.647,0,7.802c-8.482,8.484-8.482,22.291,0,30.776
                c2.155,2.155,2.155,5.646,0,7.802C132.473,260.413,131.061,260.951,129.649,260.951z'
                />
                <path
                  className={style.ringWaveColor}
                  d='M111.463,279.137c-1.412,0-2.823-0.539-3.901-1.616c-22.812-22.816-22.812-59.935,0-82.751
                c2.152-2.155,5.646-2.155,7.802,0c2.155,2.155,2.155,5.647,0,7.802c-18.511,18.513-18.511,48.635,0,67.147
                c2.155,2.155,2.155,5.647,0,7.802C114.287,278.599,112.875,279.137,111.463,279.137z'
                />
              </g>
            </g>
          </svg>
        </div>
      </div>
    )
  }
}

NotificationBox.contextTypes = {
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
)(NotificationBox)
