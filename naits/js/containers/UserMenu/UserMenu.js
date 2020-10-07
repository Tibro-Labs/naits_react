import React from 'react'
import PropTypes from 'prop-types'
import loginStyle from 'components/LogonComponents/LoginForm/LoginFormStyle.module.css'
import { getLabels, getLocaleId } from 'client.js'
import { store, dataToRedux, lastSelectedItem } from 'tibro-redux'
import UserMenuCircles from './UserMenuCircles'
import GlobalSearch from './GlobalSearch'
import ErrorBoundary from 'components/AppComponents/Functional/ErrorBoundary.js'
import UserProfileCircle from './UserProfileCircle'
import MessagingSubsystemCircle from './MessagingSubsystemCircle'
import NotificationBox from './NotificationBox'
import ReportCircle from './ReportCircle'
import ManualsCircle from './ManualsCircle'
import menuStyle from './main.module.css'
import animations from './animations.module.css'
import clockStyle from './digiClock.module.css'
import * as config from 'config/config.js'
import createHashHistory from 'history/createHashHistory'
import Clock from 'react-live-clock'
import moment from 'moment'
import ReactTooltip from 'react-tooltip'
import { LoggedInAs } from 'components/ComponentsIndex'
import { checkIfUserHasAdmGroup } from 'backend/checkIfUserHasAdmGroup'
import { getUserGroups } from 'backend/getUserGroups'
import { connect } from 'react-redux'
import { gaEventTracker } from 'functions/utils'

const hashHistory = createHashHistory()

const activeStyle = {
  borderStyle: 'solid',
  borderWidth: '2px',
  borderColor: '#e0ab10',
  background: 'rgba(0, 0, 0, 0.23)'
}

class UserMenu extends React.Component {
  componentDidMount () {
    const session = this.props.svSession
    let server = config.svConfig.restSvcBaseUrl
    let verbPath = config.svConfig.triglavRestVerbs.IS_USER_ADMIN
    let restUrl = `${server}${verbPath}/${session}`
    store.dispatch(checkIfUserHasAdmGroup(restUrl))

    let userGroupsVerbPath = config.svConfig.triglavRestVerbs.GET_USER_GROUPS
    let url = `${server}${userGroupsVerbPath}/${session}`
    store.dispatch(getUserGroups(url))

    if (this.props.gridHierarchy.length > 0) {
      store.dispatch(lastSelectedItem('resetState'))
    }
    getLocaleId(store.getState().intl.locale.replace('-', '_'))
  }

  render () {
    const labels = this.context.intl
    const locale = labels.locale
    const date = new Date()
    return (
      <div className={animations.fadeIn + ' ' + menuStyle.fullContainer} >
        <ReactTooltip className='mainPalette_tooltip' key='mainMenu_tooltip' />
        <table className={menuStyle.table}>
          <tbody>
            <tr>
              <td id='columnLeft' className={menuStyle.columnLeft}>
                {/* Left-hand side components */}
                <UserProfileCircle />
                <NotificationBox />
                <div
                  data-tip={labels.formatMessage({ id: `${config.labelBasePath}.main.nav_bar_logout`, defaultMessage: `${config.labelBasePath}.main.nav_bar_logout` })}
                  data-effect='float'
                  data-event-off='mouseout'
                  onClick={
                    () => dataToRedux(null, 'security', 'svSessionMsg', 'MAIN_LOGOUT', this.props.svSession)
                  }
                  className={`${menuStyle.logoutBoxImg} ${menuStyle['hvr-float-shadow']} ${animations.fadeIn}`}
                />
              </td>
              <td id='columnCenter' className={menuStyle.columnCenter}>
                {/* Centered components */}
                <ErrorBoundary>
                  <GlobalSearch {...this.props} />
                </ErrorBoundary>
                <UserMenuCircles />
                <MessagingSubsystemCircle />
              </td>
              <td id='columnRight' className={menuStyle.columnRight}>
                {/* Right-hand side components */}
                <div style={{ position: 'absolute', right: '1%', top: '1%' }}>
                  <LoggedInAs textColor='white' />
                  <button
                    style={{ background: 'rgba(0, 0, 0, 0.23)' }}
                    {...locale === 'ka-GE' && { style: activeStyle }}
                    className={loginStyle.language}
                    onClick={() => {
                      getLabels(null, 'ka-GE')
                      gaEventTracker(
                        'LANGUAGE',
                        'Clicked the Georgian language button on the main page',
                        `MAIN_SCREEN | ${config.version} (${config.currentEnv})`
                      )
                    }}>
                    KA
                  </button>
                  <button
                    style={{ background: 'rgba(0, 0, 0, 0.23)' }}
                    {...locale === 'en-US' && { style: activeStyle }}
                    className={loginStyle.language}
                    onClick={() => {
                      getLabels(null, 'en-US')
                      gaEventTracker(
                        'LANGUAGE',
                        'Clicked the English language button on the main page',
                        `MAIN_SCREEN | ${config.version} (${config.currentEnv})`
                      )
                    }}>
                    EN
                  </button>
                </div>
                <div className={clockStyle.digitalClockContainer}>
                  <Clock format='HH:mm:ss' ticking className={`${clockStyle.digitalClock} ${menuStyle.fadeIn}`} />
                  <p>{moment(date).format('LL')}</p>
                </div>
                <ReportCircle />
                <ManualsCircle />
                {/* Link to admin console */}
                {this.props.isAdmin &&
                  <div
                    data-tip={labels.formatMessage({ id: `${config.labelBasePath}.main.admin_console`, defaultMessage: `${config.labelBasePath}.main.admin_console` })}
                    data-effect='float'
                    data-event-off='mouseout'
                    onClick={() => hashHistory.push('/main/console')}
                    className={`${menuStyle.admConsoleBoxImg} ${menuStyle['hvr-float-shadow']} ${menuStyle.fadeIn}`}
                  />
                }
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

UserMenu.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  isAdmin: state.userInfoReducer.isAdmin,
  gridHierarchy: state.gridConfig.gridHierarchy
})

export default connect(mapStateToProps)(UserMenu)
