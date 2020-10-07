import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import {setRootInfoData} from 'tibro-redux'
import InfoList from './InfoList'

class RootInfo extends React.Component {
  static propTypes = {
    rootData: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    content: PropTypes.object.isRequired
  }

  componentDidMount () {
    this.props.setRootInfoData(this.props.rootData, this.props.config)
  }

  render () {
    return <InfoList {...this.props} />
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    rootData: state.gis.data.rootData,
    config: state.gis.config.rootInfo,
    content: state.gis.data.rootInfo
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setRootInfoData: (...params) => { dispatch(setRootInfoData(...params)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RootInfo)
