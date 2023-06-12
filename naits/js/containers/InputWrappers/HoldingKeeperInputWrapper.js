import React from 'react'
import { store } from 'tibro-redux'

export default class HoldingKeeperInputWrapper extends React.Component {
  componentDidUpdate (nextProps) {
    if (nextProps.formInstance.props.saveExecuted) {
      store.dispatch({ type: 'LINK_OBJECTS_DATA_FULFILLED' })
    }
  }

  render () {
    return this.props.children
  }
}
