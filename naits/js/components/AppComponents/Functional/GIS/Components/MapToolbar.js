import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ReactTooltip from 'react-tooltip'
import * as config from 'config/config'
import { Sofi } from '../ModuleIndex'

import { MdMyLocation } from 'react-icons/md'
import { FaRegTrashAlt, FaRulerCombined, FaRulerHorizontal } from 'react-icons/fa'

class MapToolbar extends React.Component {
  static propTypes = {
    zoomLevel: PropTypes.number.isRequired,
    rootData: PropTypes.object
  }
  constructor (props) {
    super(props)
    this.state = {
      tools: undefined,
      mapScales: undefined
    }
    this.configuration = {
      quarantine: [
        {
          id: 'declareQ',
          class: 'toolbarBtn',
          style: {
            marginRight: '0px'
          },
          onClick: 'declareQ',
          iconType: 'declareQ',
          label: ''
        }
      ],
      navigation: [
        {
          id: 'myLocation',
          class: 'toolbarBtn',
          style: {
            marginRight: '0px'
          },
          onClick: 'myLocation',
          iconType: 'myLocation',
          label: ''
        }
      ],
      measurement: [
        {
          id: 'measureLength',
          class: 'toolbarBtn',
          style: {
            marginRight: '0px'
          },
          onClick: 'measureLength',
          iconType: 'measureLength',
          label: ''
        },
        {
          id: 'measureArea',
          class: 'toolbarBtn',
          style: {
            marginRight: '0px'
          },
          onClick: 'measureArea',
          iconType: 'measureArea',
          label: ''
        }
      ],
      removeDrawnItems: [
        {
          id: 'removeDrawnItems',
          class: 'toolbarBtn',
          style: {
            marginRight: '0px'
          },
          onClick: 'removeDrawnItems',
          iconType: 'removeDrawnItems',
          label: ''
        }
      ]
    }
    this.btnGrpStyle = {
      quarantine: {
        height: '100%',
        float: 'left'
      },
      navigation: {
        height: '100%',
        float: 'right'
      },
      measurement: {
        height: '100%',
        float: 'left'
      },
      removeDrawnItems: {
        height: '100%',
        float: 'left'
      }
    }

    this.updateMapZoom = this.updateMapZoom.bind(this)
  }

  updateMapZoom (e) {
    Sofi.Utils.setMapView(Sofi.Map.getCenter(), Number(e.target.value))
  }

  componentDidMount () {
    // Generate tools
    let tools = []
    Object.keys(this.configuration).map(items => {
      let btnGrp = []
      this.configuration[items].map(btn => {
        let btnElement =
          (<button
            type='button'
            id={btn.id}
            key={btn.id}
            className={btn.class}
            data-tip={`${this.context.intl.formatMessage({
              id: `${config.labelBasePath}.gis.${btn.id}`,
              defaultMessage: `${config.labelBasePath}.gis.${btn.id}`
            })}`}
            /* data-effect={btn.dataEffect} */
            style={btn.style}
            {...btn.onClick === 'declareQ' && { onClick: () => { Sofi.Tools.declareQuarantine() } }}
            {...btn.onClick === 'myLocation' && { onClick: () => { Sofi.Utils.setOrigin() } }}
            {...btn.onClick === 'measureLength' && { onClick: () => { Sofi.Tools.measureDistance() } }}
            {...btn.onClick === 'measureArea' && { onClick: () => { Sofi.Tools.measureArea() } }}
            {...btn.onClick === 'removeDrawnItems' && { onClick: () => { Sofi.Tools.removeDrawnItems() } }}
          >
            {btn.iconType === 'declareQ' && <svg className='QuarantineIcon' />}
            {btn.iconType === 'myLocation' && <MdMyLocation style={{ width: '15px', height: '15px', color: 'rgb(249, 235, 210)' }} />}
            {btn.iconType === 'measureLength' && <FaRulerHorizontal style={{ width: '15px', height: '15px', color: 'rgb(249, 235, 210)' }} />}
            {btn.iconType === 'measureArea' && <FaRulerCombined style={{ width: '15px', height: '15px', color: 'rgb(249, 235, 210)' }} />}
            {btn.iconType === 'removeDrawnItems' && <FaRegTrashAlt style={{ width: '15px', height: '15px', color: 'rgb(249, 235, 210)' }} />}
            {btn.label}
          </button>)

        btnGrp.push(btnElement)
      })

      let btnGrpDiv = <div id={items} key={items} className='btn-group' style={this.btnGrpStyle[items]}>
        <ReactTooltip place='bottom' type='dark' effect='float' delayShow={500} className='gisTooltip' />
        {btnGrp}
      </div>

      tools.push(btnGrpDiv)
    })
    this.setState({ tools: tools })

    // Generate map scales
    const scaleArr = []
    Sofi.CRS.scaleList.map((e, i) => {
      scaleArr.push(<option key={i} value={i} >1:{e}</option>)
    })
    this.setState({ mapScales: scaleArr })
  }

  componentDidUpdate () {
    if (this.props.gridType === 'PET') {
      const declareQuarantineBtn = document.getElementById('declareQ')
      if (declareQuarantineBtn) {
        declareQuarantineBtn.style.display = 'none'
      }
    }
  }

  render () {
    return <div id='mapToolbar' className='mapToolbar' >
      <div className='scalePanel'>
        <select
          id='scaleDropdown'
          className='scale_dropdown'
          data-tip={`${this.context.intl.formatMessage({
            id: `${config.labelBasePath}.gis.mapScale`,
            defaultMessage: `${config.labelBasePath}.gis.mapScale`
          })}`}
          style={{ backgroundImage: 'url(img/BG_MainContent.png)', padding: '10px' }}
          value={this.props.zoomLevel}
          onChange={this.updateMapZoom}>
          {this.state.mapScales}
        </select>
      </div>
      <span
        id='CRSBtn'
        data-tip={`${this.context.intl.formatMessage({
          id: `${config.labelBasePath}.gis.coordinateReferenceSystem`,
          defaultMessage: `${config.labelBasePath}.gis.coordinateReferenceSystem`
        })}`}
        style={{ padding: '13px' }}
        className='gisCRS' >{Sofi.CRS.native.code}</span>
      {this.state.tools}
    </div>
  }
}

MapToolbar.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => {
  const { gis: { data } } = state
  return {
    zoomLevel: data.zoomLevel,
    rootData: data.rootData,
    gridType: data.rootData.type
  }
}

export default connect(mapStateToProps)(MapToolbar)
