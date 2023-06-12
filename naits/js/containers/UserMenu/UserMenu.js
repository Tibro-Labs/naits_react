import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import loginStyle from 'components/LogonComponents/LoginForm/LoginFormStyle.module.css'
import { getLabels, getLocaleId } from 'client.js'
import { store, dataToRedux, lastSelectedItem } from 'tibro-redux'
import UserMenuCircles from './UserMenuCircles'
import GlobalSearch from './GlobalSearch'
import ErrorBoundary from 'components/AppComponents/Functional/ErrorBoundary.js'
import SearchCircle from './SearchCircle'
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
import { isValidArray, gaEventTracker, selectObject } from 'functions/utils'

const hashHistory = createHashHistory()

const activeStyle = {
  borderStyle: 'solid',
  borderWidth: '2px',
  borderColor: '#e0ab10',
  background: 'rgba(0, 0, 0, 0.23)'
}

class UserMenu extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      allowedObjects: undefined
    }
  }

  componentDidMount () {
    // Get linked holding/s for the current user, if any
    this.getLinkedHoldingsForCurrentUser()
    const session = this.props.svSession
    const server = config.svConfig.restSvcBaseUrl
    if (!this.props.theWsForCheckingIfUserIsAdminWasCalledAlready) {
      const verbPath = config.svConfig.triglavRestVerbs.IS_USER_ADMIN
      const restUrl = `${server}${verbPath}/${session}`
      store.dispatch(checkIfUserHasAdmGroup(restUrl))
    }

    if (!this.props.theWsForUserGroupsWasCalledAlready) {
      const userGroupsVerbPath = config.svConfig.triglavRestVerbs.GET_USER_GROUPS
      const url = `${server}${userGroupsVerbPath}/${session}`
      store.dispatch(getUserGroups(url))
    }

    this.getAllowedObjects(this.props)

    if (this.props.gridHierarchy.length > 0) {
      store.dispatch(lastSelectedItem('resetState'))
    }

    if (!this.props.localeObjId) {
      getLocaleId(store.getState().intl.locale.replace('-', '_'))
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.userInfo.allowedObjectsForSideMenu !== nextProps.userInfo.allowedObjectsForSideMenu) {
      this.getAllowedObjects(nextProps)
    }
  }

  getLinkedHoldingsForCurrentUser = async () => {
    const server = config.svConfig.restSvcBaseUrl
    const verbPath = config.svConfig.triglavRestVerbs.GET_LINKED_HOLDINGS_PER_USER
    let url = `${server}${verbPath}`
    url = url.replace('%session', this.props.svSession)
    try {
      const res = await axios.get(url)
      if (res.data && res.data instanceof Array) {
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
      } else {
        store.dispatch({ type: 'USER_IS_NOT_LINKED_TO_ANY_HOLDINGS' })
      }
    } catch (err) {
      console.error(err)
    }
  }

  getAllowedObjects = props => {
    const { userInfo } = props
    if (userInfo.allowedObjectsForSideMenu && userInfo.allowedObjectsForSideMenu.LIST_OF_ITEMS && isValidArray(userInfo.allowedObjectsForSideMenu.LIST_OF_ITEMS, 1)) {
      let allowedObjects = []
      userInfo.allowedObjectsForSideMenu.LIST_OF_ITEMS.forEach(item => {
        allowedObjects.push(item.ID)
      })
      this.setState({ allowedObjects })
    }
  }

  render () {
    let shouldFixThePadding = false
    if (navigator.userAgent.includes('Chrome')) {
      const currentChromeVersion = navigator.userAgent.match(/.*Chrome\/([0-9.]+)/)[1].split('.')[0]
      if (currentChromeVersion && parseInt(currentChromeVersion) >= 87) {
        shouldFixThePadding = true
      }
    }

    let shouldDisplaySearchCircle = false
    if (this.state.allowedObjects) {
      const exportCert = this.state.allowedObjects.includes('EXPORT_CERT')
      const inventoryItem = this.state.allowedObjects.includes('INVENTORY_ITEM')
      const movementDoc = this.state.allowedObjects.includes('MOVEMENT_DOC')
      if (!exportCert && !inventoryItem && !movementDoc) {
        shouldDisplaySearchCircle = false
      } else {
        shouldDisplaySearchCircle = true
      }
    }

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
                {shouldDisplaySearchCircle && <SearchCircle />}
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
              <td
                id='columnCenter'
                className={menuStyle.columnCenter}
                style={{ paddingTop: shouldFixThePadding ? '8em' : '10em', paddingBottom: shouldFixThePadding ? '25em' : null }}
              >
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
  localeObjId: state.userInfoReducer.localeObjId,
  isAdmin: state.userInfoReducer.isAdmin,
  gridHierarchy: state.gridConfig.gridHierarchy,
  theWsForUserGroupsWasCalledAlready: state.userInfoReducer.theWsForUserGroupsWasCalledAlready,
  theWsForCheckingIfUserIsAdminWasCalledAlready: state.userInfoReducer.theWsForCheckingIfUserIsAdminWasCalledAlready
})

export default connect(mapStateToProps)(UserMenu)
