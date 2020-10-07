import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setGisConfig, setGisService, setGisData, cleanGisStore } from 'tibro-redux'

import { Sofi } from './ModuleIndex'
import MetadataForm from './Components/MetadataForm'
import Inventory from './Components/Inventory'
import { prepareRootObject } from './Components/Utils'

import createHashHistory from 'history/createHashHistory'
const hashHistory = createHashHistory()

class Gis extends React.Component {
  static propTypes = {
    rootType: PropTypes.string.isRequired,
    rootData: PropTypes.object.isRequired,
    isInit: PropTypes.bool.isRequired
  }

  componentDidMount () {
    const config = Sofi.Factory.configuration(this.props.rootType)

    if (!config) {
      hashHistory.push('/default')
    } else {
      this.props.setGisData({ 'rootData': prepareRootObject(this.props.rootType, this.props.rootData) })
      this.props.setGisConfig(config)
      this.props.setGisService(config.service)
    }
  }

  componentWillUnmount () {
    Sofi.Tools.removeDrawnItems()
    this.props.cleanGisStore()
  }

  render () {
    return this.props.isInit &&
      <div id='gis' >
        <Inventory id='Inventory' />
        <MetadataForm id='GeomMetadata' />
      </div>
  }
}

const mapStateToProps = state => {
  const grids = state.gridConfig.gridHierarchy
  let activeGrid = {}
  if (grids) {
    grids.forEach(grid => {
      if (grid.active) {
        activeGrid = grid
      }
    })
    if (activeGrid) {
      return {
        rootType: activeGrid.gridType,
        rootData: activeGrid.row,
        isInit: state.gis.data.isInit
      }
    } else {
      return {
        rootType: '',
        rootData: '',
        isInit: false
      }
    }
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setGisConfig: (...args) => { dispatch(setGisConfig(...args)) },
    setGisService: (...args) => { dispatch(setGisService(...args)) },
    setGisData: (...args) => { dispatch(setGisData(...args)) },
    cleanGisStore: () => { dispatch(cleanGisStore()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Gis)
