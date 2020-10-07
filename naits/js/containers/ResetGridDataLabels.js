import React from 'react'
import { connect } from 'react-redux'
import { ComponentManager } from 'components/ComponentsIndex'

class ResetGridDataLabels extends React.Component {
  componentWillReceiveProps (nextProps) {
    if (this.props.gridLang !== nextProps.gridLang) {
      // remove all grid reducers
      for (const property in this.props.componentIndex) {
        if (this.props.componentIndex.hasOwnProperty(property)) {
          ComponentManager.cleanComponentReducerState(property)
        }
      }
    }
  }

  render () {
    return this.props.children
  }
}

const mapStateToProps = state => ({
  gridLang: state.intl.locale,
  componentIndex: state.componentIndex
})

export default connect(mapStateToProps)(ResetGridDataLabels)
