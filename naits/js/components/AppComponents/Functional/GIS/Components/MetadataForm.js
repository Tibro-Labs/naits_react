import React from 'react'
import PropTypes from 'prop-types'
import { WrapItUp as Enhancer, ComponentManager, FormManager } from 'components/ComponentsIndex'
import { store, saveFormData } from 'tibro-redux'
import * as config from 'config/config'

import SidePanel from './SidePanel'
import IStore from './IStore'
import { Sofi } from '../ModuleIndex'
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa'

class MetadataForm extends React.Component {
  static propTypes = {
    geomId: PropTypes.string,
    geomTable: PropTypes.string,
    geomParentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), /*eslint-disable-line*/
    formContent: PropTypes.bool,
    readOnly: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
      PropTypes.object
    ])
  }
  constructor (props) {
    super(props)
    this.state = {
      displayForm: null,
      showHeader: (this.props.geomTable === 'QUARANTINE' || this.props.geomTable === 'HOLDING'),
      dataContent: 'geometry',
      linkGridMsg: 'Linked data'
    }
    this.generateForm = this.generateForm.bind(this)
    this.buildContent = this.buildContent.bind(this)
    this.getLinkMessage = this.getLinkMessage.bind(this)
    this.toggleDataContent = this.toggleDataContent.bind(this)
  }

  generateForm (props) {
    const token = store.getState().security.svSession
    const { geomId, geomTable } = props
    if (geomTable) {
      const params = []
      params.push({
        'PARAM_NAME': 'formWeWant',
        'PARAM_VALUE': geomTable
      }, {
        'PARAM_NAME': 'session',
        'PARAM_VALUE': token
      }, {
        'PARAM_NAME': 'object_id',
        'PARAM_VALUE': geomId || 0
      }, {
        'PARAM_NAME': 'table_name',
        'PARAM_VALUE': geomTable
      })
      let displayForm = FormManager.generateForm(
        geomTable + '_METADATA_' + geomId,
        geomTable + '_METADATA_' + geomId,
        params,
        'formData',
        'GET_FORM_BUILDER',
        'GET_UISCHEMA',
        'GET_TABLE_FORMDATA',
        this.closeWindow.bind(this),
        this.saveQ.bind(this),
        null,
        null,
        this.props.geomTable === 'STRAY_PET_LOCATION' ? 'strayPetLocationForm' : 'gisMetadataForm',
        null,
        this.props.readOnly || null,
        this.onAlertClose.bind(this),
        null)
      this.setState({ displayForm: displayForm })
    }
  }

  saveQ (formData) {
    const session = store.getState().security.svSession
    let formValues = formData.formData
    const params = []
    const currState = store.getState()
    const storeData = currState.gis.data
    params.push({
      'PARAM_NAME': 'table_name',
      'PARAM_VALUE': storeData.geomTable
    },
    {
      'PARAM_NAME': 'object_id',
      'PARAM_VALUE': Number(storeData.geomId) || 0
    },
    {
      'PARAM_NAME': 'geom',
      'PARAM_VALUE': storeData.geomCoords
    }, {
      'PARAM_NAME': 'radius',
      'PARAM_VALUE': String(storeData.qRadius)
    },
    {
      'PARAM_NAME': 'jsonString',
      'PARAM_VALUE': formValues
    })
    const activeForm = storeData.geomTable + '_METADATA_' + (storeData.geomId || '')
    saveFormData(activeForm, 'SAVE_QUARANTINE', session, params)
  }

  closeWindow () {
    this.state.dataContent === 'grid' && this.toggleDataContent()

    this.props.geomTable === 'QUARANTINE'
      ? Sofi.Tools.removeDrawnItems()
      : ComponentManager.setStateForComponent('GeomMetadata', 'formContent', false)
  }

  onAlertClose () {
    Sofi.Tools.removeDrawnQuarantine()
  }

  getLinkMessage () {
    let verb = this.state.dataContent === 'geometry' ? 'Show ' : 'Hide '
    if (this.props.geomTable === 'QUARANTINE') { return verb + 'quarantined holdings for this area' }
    if (this.props.geomTable === 'HOLDING') { return verb + 'incoming animal movements at this location' }

    return 'Show link grid'
  }

  toggleDataContent () {
    if (this.state.dataContent === 'geometry') {
      this.setState({ dataContent: 'grid' })
      IStore.setData({ dataContent: 'grid' })
      // enable pointer events across all menus
      document.getElementById('mapToolbar').style.pointerEvents = 'none'
      document.getElementById('layerPanel').style.pointerEvents = 'none'
    } else {
      this.setState({ dataContent: 'geometry' })
      IStore.setData({ dataContent: 'geometry' })
      // disable pointer events across all menus
      document.getElementById('mapToolbar').style.pointerEvents = 'visiblePainted'
      document.getElementById('layerPanel').style.pointerEvents = 'visiblePainted'
    }
  }

  buildContent () {
    const { displayForm } = this.state
    let header = null

    if (this.state.showHeader) {
      header = <div id='linkGridHeader' style={{ border: '1px solid black', display: 'inline-flex', width: '100%' }}>
        <button
          type='button'
          id='gis_linkGrid_btn'
          key='gis_linkGrid_btn'
          className='toolbarBtn'
          data-tip='Expand'
          style={{ float: 'left', border: 'none', height: 'unset' }}
          onClick={this.toggleDataContent}
        >
          {
            this.state.dataContent === 'geometry'
              ? <FaAngleDoubleLeft style={{ width: '20px', height: '20px', color: 'rgb(249, 235, 210)' }} />
              : <FaAngleDoubleRight style={{ width: '20px', height: '20px', color: 'rgb(249, 235, 210)' }} />
          }
        </button>
        <span
          id='linkgGrid_label'
          className='gisCRS'
          style={{ border: 'none', width: '100%', textAlign: 'left', marginTop: '10px', marginBottom: '10px', marginLeft: '5px' }}
        >
          {this.getLinkMessage()}
        </span>
      </div>
    }

    return <div>
      {header}
      {displayForm}
    </div>
  }

  componentWillReceiveProps (nextProps) {
    // FIX ME, class method deprecated, find a different solution
    for (const key in nextProps) {
      if (nextProps.hasOwnProperty(key)) {
        const value = nextProps[key]
        this.setState({ [key]: value })
      }
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.geomId !== this.props.geomId || prevProps.geomTable !== this.props.geomTable) {
      if (this.props.geomId) {
        this.props.geomTable === 'QUARANTINE' || this.props.geomTable === 'HOLDING'
          ? this.setState({ showHeader: true }) // eslint-disable-line
          : this.setState({ showHeader: false }) // eslint-disable-line
      }

      this.generateForm(this.props)
    }
    this.props.refFunction(this)
  }

  render () {
    const { formContent } = this.props
    return formContent
      ? <SidePanel content={this.buildContent()} />
      : <SidePanel
        content={this.context.intl.formatMessage({
          id: `${config.labelBasePath}.gis.selectLayerToShowData`,
          defaultMessage: `${config.labelBasePath}.gis.selectLayerToShowData`
        })}
        style={{ fontSize: '20px', color: 'rgb(249, 235, 210)', textAlign: 'center', padding: '20px' }}
      />
  }
}

MetadataForm.defaultProps = {
  formContent: false,
  readOnly: true
}

MetadataForm.contextTypes = {
  intl: PropTypes.object.isRequired
}

export default Enhancer(MetadataForm, 'genericComponent', 'MetadataForm', true)
