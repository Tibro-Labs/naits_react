import React from 'react'
import PropTypes from 'prop-types'
import * as config from 'config/config.js'
import { menuConfig } from 'config/menuConfig'
import { connect } from 'react-redux'
import { dataToRedux } from 'tibro-redux'
import { alertUser } from 'tibro-components'
import { Footer, MainMenuTop } from 'components/ComponentsIndex'
import Navigator from 'components/AppComponents/Presentational/Navigator'
import { getLabels } from 'client.js'
import loginStyle from 'components/LogonComponents/LoginForm/LoginFormStyle.module.css'
import style from './MainApp.module.css'
/* Main app view, renders a top horizontal menu (main menu) and a collection of children,
depending on route given by menu and parent state KNI 28.03.2017 */
import UserProfilePopup from 'components/AppComponents/Functional/UserProfile/UserProfile'
import UserTour from 'components/AppComponents/Presentational/UserTour'
import Notifications from './Notifications'
import History from './History'
import createHashHistory from 'history/createHashHistory'
import { gaEventTracker } from 'functions/utils'

const activeStyle = {
  borderStyle: 'solid',
  borderWidth: '2px',
  borderColor: '#e0ab10'
}

class MainApp extends React.Component {
  constructor (props) {
    super(props)
    const currentPath = this.props.location.pathname
    this.state = {
      alert: undefined,
      gridToDisplay: currentPath.substr(currentPath.lastIndexOf('/') + 1).toUpperCase(),
      filterBy: undefined,
      filterVals: undefined,
      parentId: undefined,
      filterType: undefined,
      jsonlist: this.props.jsonlist,
      toggleUserProfilePopup: false,
      toggleNotifications: false,
      toggleHistory: false,
      hoverCallback: undefined,
      dynamicHelper: undefined
    }
    this.hashHistory = createHashHistory()
    this.showReactTooltip = this.showReactTooltip.bind(this)
    this.printExpire = this.printExpire.bind(this)
    this.logout = this.logout.bind(this)
    this.displayGrid = this.displayGrid.bind(this)
  }

  componentDidMount () {
    const jsonlist = 'MAIN_MENU'
    let configedMenu = menuConfig(this.state.jsonlist, this.context.intl)
    if (!this.state.jsonlist) {
      configedMenu = menuConfig(jsonlist, this.context.intl)
    }
    const listOfButtons = configedMenu.LIST_OF_ITEMS
    this.setState(
      () => listOfButtons.map(
        (element, index) => {
          if (element.LINK_ACTIVE) {
            return { gridToDisplay: this.props.gridToDisplay }
          }
        }
      )
    )
  }

  logout () {
    dataToRedux(null, 'security', 'svSessionMsg', 'MAIN_LOGOUT', this.props.svSession)
    localStorage.clear()
    this.hashHistory.push('/')
  }

  goToMainScreen = (event) => {
    event.preventDefault()
    this.hashHistory.push('/')
  }

  printExpire () {
    const url = `${config.svConfig.restSvcBaseUrl}/printGenerator/printExpire/${this.props.svSession}`
    window.open(url, 'Application print', '') // Add proper naming to file , igi 05052017
  }

  /* enable/disable tooltip f.r */
  showReactTooltip () {
    let path = this.props.location.pathname
    this.setState({ dynamicHelperPath: path })
    const labels = this.context.intl
    if (this.props.stateTooltip === false) {
      dataToRedux(null, 'stateTooltip', 'stateTooltip', true)
      this.setState({
        alert: alertUser(
          true, 'info',
          labels.formatMessage({ id: `${config.labelBasePath}.main.help_activated`, defaultMessage: `${config.labelBasePath}.main.help_activated` }),
          labels.formatMessage({ id: `${config.labelBasePath}.main.help_info`, defaultMessage: `${config.labelBasePath}.main.help_info` }),
          () => this.setState({ alert: alertUser(false) }), undefined, false, undefined, undefined, false, '#5c821a', true
        )
      })
    } else {
      dataToRedux(null, 'stateTooltip', 'stateTooltip', false)
      this.setState({
        alert: alertUser(
          true, 'info',
          labels.formatMessage({ id: `${config.labelBasePath}.main.help_deactivated`, defaultMessage: `${config.labelBasePath}.main.help_deactivated` }),
          '',
          () => this.setState({ alert: alertUser(false) }), undefined, false, undefined, undefined, false, '#5c821a', true
        )
      })
    }
  }

  /* Set state and display appropriate search grid KNI 28.03.2017 */
  displayGrid (tableName, cntrlForm, filterBy, filterVals) {
    if (tableName) {
      this.setState({ gridToDisplay: tableName, filterBy, filterVals })
    }
  }

  handleUserProfileClick = () => {
    this.setState({ toggleUserProfilePopup: !this.state.toggleUserProfilePopup })
  }

  toggleNotifications = callback => () => {
    // hoverCallback is used to set li item as inactive in MainMenuTop
    this.setState({ hoverCallback: callback, toggleNotifications: !this.state.toggleNotifications })
  }

  toggleHistory = callback => () => {
    // hoverCallback is used to set li item as inactive in MainMenuTop
    this.setState({ hoverCallback: callback, toggleHistory: !this.state.toggleHistory })
  }

  render () {
    const locale = this.context.intl.locale
    /* Clone this.props.children into {children}
    and map the given parent state/props KNI 28.03.2017 */
    const children = React.cloneElement(this.props.children, {
      className: style.children,
      gridToDisplay: this.state.gridToDisplay,
      filterBy: this.state.filterBy,
      filterVals: this.state.filterVals,
      filterType: this.state.filterType,
      parentId: this.state.parentId,
      key: this.props.gridToDisplay
    })
    return (
      <div className={`rootBg1 ${style.childrenFallback}`}>
        {this.state.alert}
        {/* <div className='leftD' />
          <div className='rightD' /> */}
        {/* Main horizontal menu used to display basic search grids KNI 28.03.2017 */}
        <MainMenuTop
          notificationBadge={
            {
              component: <Notifications hoverCallback={this.state.hoverCallback} toggleNotifications={this.state.toggleNotifications} />,
              toggleNotifications: this.toggleNotifications
            }
          }
          history={
            {
              component: <History hoverCallback={this.state.hoverCallback} toggleHistory={this.state.toggleHistory} />,
              toggleHistory: this.toggleHistory
            }
          }
          gridToDisplay={this.state.gridToDisplay}
          onMenuItemClick={this.displayGrid}
          printExpire={this.printExpire}
          showReactTooltip={this.showReactTooltip}
          logout={this.logout}
          defaultLinkRoute={this.props.location.pathname}
          toggleUserProfilePopup={this.handleUserProfileClick}
          goToLink={this.goToMainScreen}
          key='main_menu_top'
        >
          <button
            className={loginStyle.language}
            {...locale === 'ka-GE' && { style: activeStyle }}
            onClick={() => {
              getLabels(null, 'ka-GE')
              gaEventTracker(
                'LANGUAGE',
                'Clicked the Georgian language button in the navigation bar',
                `NAVBAR | ${config.version} (${config.currentEnv})`
              )
            }}>
            KA
          </button>
          <button
            className={loginStyle.language}
            {...locale === 'en-US' && { style: activeStyle }}
            onClick={() => {
              getLabels(null, 'en-US')
              gaEventTracker(
                'LANGUAGE',
                'Clicked the English language button in the navigation bar',
                `NAVBAR | ${config.version} (${config.currentEnv})`
              )
            }}>
            EN
          </button>
        </MainMenuTop>
        {/* Following line renders the cloned children with added parent state and props */}
        {this.state.toggleUserProfilePopup && <UserProfilePopup toggle={this.handleUserProfileClick} />}
        {children}
        <Navigator />
        <UserTour showReactTooltip={this.showReactTooltip} path={this.state.dynamicHelperPath} />
        <Footer context={this.context} />
      </div>
    )
  }
}

MainApp.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  svSession: state.security.svSession,
  stateTooltip: state.stateTooltip.stateTooltip
})

export default connect(mapStateToProps)(MainApp)
