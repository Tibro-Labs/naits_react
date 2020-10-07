import React from 'react'
import { Route, Switch } from 'react-router-dom'

import { NotFound } from 'containers/ContainersIndex'
import { menuConfig } from 'config/menuConfig.js'
import { userInfoAction } from 'backend/userInfoAction.js'
import { connect } from 'react-redux'
import createHashHistory from 'history/createHashHistory'
import PropTypes from 'prop-types'

const hashHistory = createHashHistory()

function DynamicRoutesHOC (WrappedComponent) {
  class DynamicRoutesHOC extends React.Component {
    static propTypes = {
      jsonlist: PropTypes.string.isRequired
    }

    constructor (props) {
      super(props)
      this.state = {
        isBusy: false
      }
    }

    componentDidMount () {
      this.props.userInfoAction(this.props.svSession, 'ALLOWED_CUSTOM_OBJECTS')
      if (!this.props.svSession) {
        hashHistory.push('/')
      }
    }

    componentWillReceiveProps (nextProps) {
      if (this.props.isBusy !== nextProps.isBusy) {
        this.setState({ isBusy: nextProps.isBusy })
      }
    }

    getConfigRoutes = () => menuConfig(this.props.jsonlist, this.context.intl).LIST_OF_ITEMS.map((configElement, index) => {
      if (!configElement.ROUTE) {
        console.warn(`Missing ROUTE for ${configElement.LABEL} in menuConfig.js`)
      }

      return (
        <Route
          key={`DynamicRoutes${index}`}
          exact
          path={`${this.props.match.url}/${configElement.ROUTE}`}
          render={
            () => (<WrappedComponent {...this.props} >
              {this.props.showComponent}
            </WrappedComponent>)
          }
        />

      )
    })

    render () {
      return (
        <Switch>
          {this.getConfigRoutes()}
          {!this.state.isBusy && <Route component={NotFound} status={404} />}
        </Switch>
      )
    }
  }
  const mapStateToProps = state => ({
    svSession: state.security.svSession,
    userInfo: state.userInfoReducer,
    isBusy: state.userInfoReducer.isBusy
  })

  const mapDispatchToProps = dispatch => ({
    userInfoAction: (svSession, actionType, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) => {
      dispatch(userInfoAction(svSession, actionType, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12))
    }
  })

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(DynamicRoutesHOC)
}

export default DynamicRoutesHOC
