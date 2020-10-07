import React from 'react'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'
import { menuConfig } from 'config/menuConfig.js'
import componentStyle from './main.module.css'
import createHashHistory from 'history/createHashHistory'
import styles from './UserMenuStyle.module.css'
import CSSModules from 'react-css-modules'
import { store } from 'tibro-redux'
import { userInfoAction } from 'backend/userInfoAction.js'
import * as config from 'config/config.js'

const hashHistory = createHashHistory()

// main menu top- tells the Main app parent which function needs to be dispatched
// or which grid should be shown in the main content
class UserMenuCircles extends React.Component {
  static propTypes = {
  }
  constructor (props) {
    super(props)
    this.state = {
      hover: false,
      activeMenu: ''
    }
  }

  componentDidMount () {
    const session = store.getState().security.svSession
    store.dispatch(userInfoAction(session, 'ALLOWED_CUSTOM_OBJECTS'))
  }

  toggleMenu = () => {
    if (this.state.activeMenu === '') {
      this.setState({ activeMenu: 'active' })
    } else if (this.state.activeMenu === 'active') {
      this.setState({ activeMenu: '' })
    }
  }

  hover = (selectedCircle, boolean) => () => {
    if (this.state.hover === false) {
      this.setState({ [selectedCircle]: boolean })
      this.setState({ hover: boolean })
    } else if (this.state.hover === true) {
      this.setState({ [selectedCircle]: boolean })
      this.setState({ hover: boolean })
    }
  }

  transitionToDataScreen = (pathRoute, id) => () => {
    this.setState({ activeMenu: '' }, hashHistory.push(`/main/dynamic/${pathRoute}`))
    if (id === 'EXPORT_CERT') {
      this.setState({ activeMenu: '' }, hashHistory.push(`/main/export_certificate`))
    }
    if (id === 'ANIMAL' && pathRoute !== 'animal') {
      this.setState({ activeMenu: '' }, hashHistory.push(`/main/export_cert`))
    }
  }

  cssAnimation = (isMenuActive, selectedCircle, degrees) => {
    if (!isMenuActive) {
      return { pointerEvents: 'none' }
    }
    if (!selectedCircle) {
      return { transition: 'transform 0.2s ease-in-out', transform: `translateY(-15em) rotate(${degrees})` }
    }
    return { transition: 'transform 0.2s   ease-in-out', transform: `scale(1.2) translateY(-13em) rotate(${degrees})` }
  }

  render () {
    let tempCSSclass = ''
    // Iterate js/config/menuConfig.js for MAIN_PALLETE
    const getMenuBoxesFromConfig = menuConfig('MAIN_PALETTE', this.context.intl).LIST_OF_ITEMS.map((configElement, index) => {
      // Check if CSS class is present, return warning and default CSS class if not
      if (!componentStyle[configElement.ROUTE.toLowerCase()]) {
        tempCSSclass = 'defaultImgClass'
        console.warn(`Missing CSS class in MainPalette.module.css for configElement: ${configElement.ROUTE.toLowerCase()}. Default class "defaultImgClass" will be used`)
      } else {
        tempCSSclass = configElement.ROUTE.toLowerCase()
      }

      const degrees = 360 / menuConfig('MAIN_PALETTE', this.context.intl).LIST_OF_ITEMS.length
      const defaultItemDegree = `${degrees / -2 + degrees * (index)}deg`
      const activeItemDegree = `${degrees / 2 - degrees * (index)}deg`
      return (
        <div
          onMouseOver={this.hover(`centerCircles${index}`, true)}
          onMouseOut={this.hover(`centerCircles${index}`, false)}
          key={`centerBox${index}`}
          id={`centerBox${index}`}
          className={this.props.styles.rotater}
          style={{ transform: `rotate(${defaultItemDegree})` }}
        >
          <div
            className={`${this.props.styles.btn} ${this.props.styles['btn-icon']}`}
            data-tip={this.context.intl.formatMessage({
              id: [`${config.labelBasePath}.main.${configElement.LABEL}`],
              defaultMessage: [`${config.labelBasePath}.main.${configElement.LABEL}`]
            })}
            data-effect='float'
            data-event-off='mouseout'
            onClick={this.transitionToDataScreen(configElement.ROUTE, configElement.ID)}
            style={this.cssAnimation(this.state.activeMenu, this.state[`centerCircles${index}`], activeItemDegree)}
          >
            <div className={`${this.props.styles.fa} ${componentStyle[tempCSSclass]}`} />
          </div>
        </div>

      )
    })

    ReactTooltip.rebuild()

    return (

      <div styleName={`menu ${this.state.activeMenu}`} onClick={this.toggleMenu}>
        <div
          data-tip={!this.state.activeMenu
            ? this.context.intl.formatMessage({ id: `${config.labelBasePath}.main.show_menu_toggle`, defaultMessage: `${config.labelBasePath}.main.show_menu_toggle` })
            : this.context.intl.formatMessage({ id: `${config.labelBasePath}.main.hide_menu_toggle`, defaultMessage: `${config.labelBasePath}.main.hide_menu_toggle` })
          }
          data-effect='float'
          data-event-off='click'
          styleName='btn trigger'
        >
          <span styleName='line' />
        </div>
        <div id='icons'>
          {getMenuBoxesFromConfig}
        </div>
      </div>
    )
  }
}

UserMenuCircles.contextTypes = {
  intl: PropTypes.object.isRequired
}

export default CSSModules(UserMenuCircles, styles, { allowMultiple: true, handleNotFoundStyleName: 'log' })
