import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import IStore from './IStore'
import LayerPanel from './LayerPanel'
import MapToolbar from './MapToolbar'
import MetadataGrid from './MetadataGrid'
// import {getBaseHeight} from './Utils.js'
import { Sofi } from '../ModuleIndex'

class Inventory extends React.Component {
    static propTypes = {
      token: PropTypes.string.isRequired,         /*eslint-disable-line*/
      vectorConfig: PropTypes.object.isRequired,
      rasterConfig: PropTypes.object.isRequired,
      rootData: PropTypes.object.isRequired,      /*eslint-disable-line*/
      dataContent: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
      mapOrigin: PropTypes.string.isRequired      /*eslint-disable-line*/
    }
    constructor (props) {
      super(props)
      this.getContent = this.getContent.bind(this)
    }

    componentDidMount () {
      IStore.setInventory(Object.assign(this.props.vectorConfig.permanent, this.props.vectorConfig.spatial))
      IStore.setInventory(Object.assign({}, this.props.rasterConfig))
    }

    componentDidUpdate (prevProps) {
      if (this.props.dataContent !== prevProps.dataContent && this.props.dataContent === 'geometry') {
        Sofi.Tools.removeDrawnItems()
        Sofi.Utils.setOrigin()
      }
    }

    getContent () {
      const {Components: { MapContainer }} = Sofi

      if (this.props.dataContent === 'geometry') {
        return <MapContainer />
      } else if (this.props.dataContent === 'grid') {
        return <MetadataGrid />
      } else {
        // default value
        return <MapContainer />
      }
    }

    render () {
      return <div id='inventory' className='inventory' >
        <LayerPanel />
        {this.getContent()}
        <MapToolbar />
      </div>
    }
}

const mapStateToProps = (state, ownProps) => {
  const {config: { rasterConfig, vectorConfig }, data} = state.gis
  return {
    token: state.security.svSession,
    vectorConfig: vectorConfig,
    rasterConfig: rasterConfig,
    rootData: data.rootData,
    dataContent: data.dataContent,
    mapOrigin: data.mapOrigin
  }
}

export default connect(mapStateToProps)(Inventory)
