import React from 'react'
import PropTypes from 'prop-types'
import UserProfile from './UserProfile'
import * as config from 'config/config'
import { getLabels } from 'client.js'
import { store, dataToRedux } from 'tibro-redux'
import loginStyle from 'components/LogonComponents/LoginForm/LoginFormStyle.module.css'
import menuStyle from 'containers/UserMenu/main.module.css'
import animations from 'containers/UserMenu/animations.module.css'
import createHashHistory from 'history/createHashHistory'
const hashHistory = createHashHistory()

export default class UserMustChangePassword extends React.Component {
  render () {
    return (
      <div>
        <UserProfile
          onAlertClose={this.props.onAlertClose}
          hideCloseButton={this.props.hideCloseButton}
          forcePassChange={this.props.forcePassChange}
        />
        <div
          data-tip={this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.nav_bar_logout`,
            defaultMessage: `${config.labelBasePath}.main.nav_bar_logout`
          })}
          data-effect='float'
          data-event-off='mouseout'
          className={`${menuStyle.logoutBoxImg} ${menuStyle['hvr-float-shadow']} ${animations.fadeIn}`}
          onClick={
            () => dataToRedux(() => hashHistory.push('/'), 'security', 'svSessionMsg', 'MAIN_LOGOUT', store.getState().security.svSession)
          }
        />
        <div style={{ position: 'absolute', right: '1%', top: '1%' }}>
          <button style={{ background: 'rgba(0, 0, 0, 0.23)' }} className={loginStyle.language} onClick={() => getLabels(null, 'ka-GE')}>KA</button>
          <button style={{ background: 'rgba(0, 0, 0, 0.23)' }} className={loginStyle.language} onClick={() => getLabels(null, 'en-US')}>EN</button>
        </div>
      </div>
    )
  }
}

UserMustChangePassword.contextTypes = {
  intl: PropTypes.object.isRequired
}
