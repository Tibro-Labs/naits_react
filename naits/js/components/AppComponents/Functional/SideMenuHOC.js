import React from 'react'
import * as config from 'config/config.js'
import Menu from 'react-burger-menu/lib/menus/push'
import componentStyle from './SideMenuHOC.module.css'
import { connect } from 'react-redux'
import { userInfoAction } from 'backend/userInfoAction'
import PropTypes from 'prop-types'
import { store, lastSelectedItem } from 'tibro-redux'
import axios from 'axios'

const styles = {
  bmBurgerButton: {
    position: 'relative',
    width: '36px',
    height: '30px',
    left: '2rem',
    top: '1rem',
    zIndex: '2000'
  },
  bmBurgerBars: {
    background: 'rgb(165, 165, 165)'
  },
  bmCrossButton: {
    height: '24px',
    width: '24px'
  },
  bmCross: {
    background: '#bdc3c7'
  },
  bmMenu: {
    backgroundImage: 'url(img/BG_MainContent.png)',

    fontSize: '1.15em'
  },
  bmMorphShape: {
    fill: '#373a47'
  },
  bmItemList: {
    color: '#b8b7ad'
  },
  bmOverlay: {
    background: 'rgba(0, 0, 0, 0.3)'
  }

}

function SideMenuHOC (WrappedComponent) {
  class SideMenuHOC extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        SideMenuIsOpen: '',
        menuItems: [],
        initialUrls: [],
        userIsLinkedToOneHolding: false,
        userIsLinkedToTwoOrMoreHoldings: false
      }
    }

    isMenuOpen = (state) => {
      this.setState({ SideMenuIsOpen: state.isOpen })
      return state.isOpen
    }

    filterList = (event) => {
      // filter sidebar list
      let updatedList = []
      let routeList = []
      const tempObject = {}

      this.props.userInfo.allowedObjects.LIST_OF_ITEMS.map((configElement) => {
        updatedList.push(configElement.LABEL)
        routeList.push(configElement.ROUTE)
        return Object.assign(tempObject, { [configElement.ROUTE]: configElement.LABEL })
      })
      // convert to 2d array
      const newObj = Object.entries(tempObject)
      // parse from user input
      const arrayTest = (arr) => {
        let resp = false
        arr.forEach((str) => {
          if (str.toLowerCase().search(event.target.value.toLowerCase()) !== -1) resp = true
        })
        return resp
      }

      const result = newObj.filter(arrayTest)

      updatedList = result.map(element => element[1])
      routeList = result.map(element => element[0])

      this.setState({ menuItems: updatedList, initialUrls: routeList })
    }

    componentWillReceiveProps (nextProps) {
      if (this.props.userInfo.allowedObjects !== nextProps.userInfo.allowedObjects) {
        // fill state from config file on initial render
        const linkText = nextProps.userInfo.allowedObjects.LIST_OF_ITEMS.map(configElement => configElement.LABEL)
        const routes = nextProps.userInfo.allowedObjects.LIST_OF_ITEMS.map(configElement => configElement.ROUTE)
        this.setState({ menuItems: linkText, initialUrls: routes })
      }
    }

    componentDidMount () {
      this.props.userInfoAction(this.props.svSession, 'ALLOWED_CUSTOM_OBJECTS')
      if (!this.props.userIsLinkedToOneHolding && !this.props.userIsLinkedToTwoOrMoreHoldings) {
        this.getLinkedHoldingsForCurrentUser()
      }
    }

    getLinkedHoldingsForCurrentUser = async () => {
      const server = config.svConfig.restSvcBaseUrl
      const session = this.props.svSession
      const verbPath = config.svConfig.triglavRestVerbs.GET_LINKED_HOLDINGS_PER_USER
      let url = `${server}${verbPath}`
      url = url.replace('%session', session)
      try {
        const res = await axios.get(url)
        if (res.data && res.data.length === 1) {
          store.dispatch({ type: 'USER_IS_LINKED_TO_ONE_HOLDING' })
          this.setState({ userIsLinkedToOneHolding: true, userIsLinkedToTwoOrMoreHoldings: false })
        } else if (res.data && res.data.length > 1) {
          store.dispatch({ type: 'USER_IS_LINKED_TO_TWO_OR_MORE_HOLDINGS' })
          this.setState({ userIsLinkedToOneHolding: false, userIsLinkedToTwoOrMoreHoldings: true })
        } else if (res.data.length === 0) {
          store.dispatch({ type: 'USER_IS_NOT_LINKED_TO_ANY_HOLDINGS' })
        }
      } catch (err) {
        console.error(err)
      }
    }

    finalMenuList = (state) => {
      if (this.state.menuItems && this.state.initialUrls) {
        const urls = this.state.initialUrls
        let finalMenuList = null
        let finalMenu = null
        let generateMenuForExportCertificate = null
        finalMenuList = this.state.menuItems.map((item, index) => {
          finalMenu = (<li key={`liSideMenu${index}${item}`}>
            <a id={item} className={`${componentStyle.searchResults} menu-item`}
              href={`#/main/dynamic/${urls[index]}`}
              onClick={() => store.dispatch(lastSelectedItem('resetState'))}>
              {this.context.intl.formatMessage({
                id: [`${config.labelBasePath}.main.${item}`], defaultMessage: [`${config.labelBasePath}.main.${item}`]
              })}
            </a>
          </li>)
          generateMenuForExportCertificate = (<li key={`liSideMenu${index}${item}`}>
            <a id={item} className={`${componentStyle.searchResults} menu-item`}
              href={`#/main/export_certificate`}
              onClick={() => store.dispatch(lastSelectedItem('resetState'))}>
              {this.context.intl.formatMessage({
                id: [`${config.labelBasePath}.main.${item}`], defaultMessage: [`${config.labelBasePath}.main.${item}`]
              })}
            </a>
          </li>)
          if (item !== 'export_cert.general') {
            return finalMenu
          } else return generateMenuForExportCertificate
        }
        )
        return finalMenuList
      }
    }

    render () {
      return (
        <div id='outerContainer' className={componentStyle.mainHeight}>
          {(this.state.userIsLinkedToOneHolding || this.state.userIsLinkedToTwoOrMoreHoldings) ||
            (this.props.userIsLinkedToOneHolding || this.props.userIsLinkedToTwoOrMoreHoldings) ? null
            : <Menu
              onStateChange={this.isMenuOpen}
              styles={styles}
              pageWrapId='page-wrap'
              outerContainerId='outerContainer'
              burgerButtonClassName={
                this.state.SideMenuIsOpen ? componentStyle.hideButton : componentStyle.fadeIn
              }
            >

              <input type='text' className={componentStyle.search} placeholder='Type to search' onChange={this.filterList} />
              <ul className={componentStyle.unorderedList}>
                <li key='liSideMenu Main Screen'>
                  <a
                    id='Main Screen'
                    className={`${componentStyle.searchResults} menu-item`}
                    href='#/default'
                  >{this.context.intl.formatMessage(
                      {
                        id: [`${config.labelBasePath}.main.main_screen`],
                        defaultMessage: [`${config.labelBasePath}.main.main_screen`]
                      }
                    )}
                  </a>
                </li>
                {this.finalMenuList(this.state)}
              </ul>
            </Menu>
          }
          <main id='page-wrap' className={componentStyle.inheritHeight}>
            <WrappedComponent {...this.props} />
          </main>
        </div>)
    }
  }
  SideMenuHOC.contextTypes = {
    intl: PropTypes.object.isRequired
  }
  const mapStateToProps = state => ({
    svSession: state.security.svSession,
    userInfo: state.userInfoReducer,
    userIsLinkedToOneHolding: state.linkedHolding.userIsLinkedToOneHolding,
    userIsLinkedToTwoOrMoreHoldings: state.linkedHolding.userIsLinkedToTwoOrMoreHoldings
  })

  const mapDispatchToProps = dispatch => ({
    userInfoAction: (svSession, actionType, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) => {
      dispatch(userInfoAction(svSession, actionType, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12))
    }
  })

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(SideMenuHOC)
}

export default SideMenuHOC
