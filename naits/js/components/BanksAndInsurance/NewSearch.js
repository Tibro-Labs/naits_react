import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import { store, removeAsyncReducer, dataToRedux } from 'tibro-redux'
import { alertUser } from 'tibro-components'
import { GridManager, ComponentManager } from 'components/ComponentsIndex'
import * as config from 'config/config.js'
import { strcmp, isValidArray, formatAlertType, onGridSelectionChange } from 'functions/utils'
import mainStyle from './BanksAndInsurance.module.css'

class NewSearch extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      holdingResponsibleId: '',
      recipientEmail: '',
      pdfDocument: '',
      holdingsGrid: undefined,
      animalsGrid: undefined,
      selectedAnimals: []
    }
  }

  componentWillUnmount () {
    ComponentManager.cleanComponentReducerState('ANIMALS_PER_HOLDINGS')
    ComponentManager.cleanComponentReducerState('HOLDINGS_PER_HOLDING_RESPONSIBLE')
    store.dispatch({ type: 'UPDATE_SELECTED_GRID_ROWS', payload: [[], 'HOLDINGS_PER_HOLDING_RESPONSIBLE'] })
  }

  printAnimalRecord = () => {
    const { session } = this.props
    const { selectedAnimals } = this.state
    if (!isValidArray(selectedAnimals, 1)) {
      alertUser(true, 'warning',
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.alert.empty_selection`,
          defaultMessage: `${config.labelBasePath}.alert.empty_selection`
        })
      )
    } else if (isValidArray(selectedAnimals, 2)) {
      alertUser(true, 'warning',
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.alert.only_one_record_can_be_selected`,
          defaultMessage: `${config.labelBasePath}.alert.only_one_record_can_be_selected`
        })
      )
    } else {
      selectedAnimals.forEach(row => {
        const animalObjId = row['ANIMAL.OBJECT_ID']
        const url = `${config.svConfig.restSvcBaseUrl}/naits_triglav_plugin/report/generatePdf/${session}/${animalObjId}/AR_main`
        window.open(url, '_blank')
      })
    }
  }

  handleAnimalRowSelection = (selectedRows) => {
    this.setState({ selectedAnimals: selectedRows })
  }

  generateAnimalsGrid = (holdingObjIds) => {
    const { session } = this.props
    const gridParams = []
    gridParams.push({
      PARAM_NAME: 'session',
      PARAM_VALUE: session
    }, {
      PARAM_NAME: 'holdingObjIds',
      PARAM_VALUE: holdingObjIds.join(',')
    }, {
      PARAM_NAME: 'objectType',
      PARAM_VALUE: 'ANIMAL'
    }, {
      PARAM_NAME: 'gridConfigWeWant',
      PARAM_VALUE: 'ANIMAL'
    })
    const animalsGridId = 'ANIMALS_PER_HOLDINGS'
    const animalsGrid = GridManager.generateExportableGridWithCustomBtn(
      animalsGridId, animalsGridId, 'CUSTOM_GRID',
      'GET_ANIMALS_BY_HOLDINGS', gridParams, 'CUSTOM', () => { }, null,
      true, this.handleAnimalRowSelection, 350, 1100, false, () => { }, false
    )
    removeAsyncReducer(store, animalsGridId)
    dataToRedux(null, 'componentIndex', animalsGridId, '')
    this.setState({ selectedAnimals: [], animalsGrid: undefined }, () => this.setState({ animalsGrid }))
  }

  displayAnimals = () => {
    const { selectedGridRows } = this.props
    if (!isValidArray(selectedGridRows, 1)) {
      alertUser(true, 'warning',
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.alert.empty_selection`,
          defaultMessage: `${config.labelBasePath}.alert.empty_selection`
        })
      )
    } else {
      const holdingObjIds = []
      selectedGridRows.forEach(row => {
        holdingObjIds.push(row['HOLDING.OBJECT_ID'])
      })
      this.generateAnimalsGrid(holdingObjIds)
      ComponentManager.cleanComponentReducerState('ANIMALS_PER_HOLDINGS')
    }
  }

  printHoldingCertificate = () => {
    const { selectedGridRows, session } = this.props
    if (!isValidArray(selectedGridRows, 1)) {
      alertUser(true, 'warning',
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.alert.empty_selection`,
          defaultMessage: `${config.labelBasePath}.alert.empty_selection`
        })
      )
    } else if (isValidArray(selectedGridRows, 2)) {
      alertUser(true, 'warning',
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.alert.only_one_record_can_be_selected`,
          defaultMessage: `${config.labelBasePath}.alert.only_one_record_can_be_selected`
        })
      )
    } else {
      selectedGridRows.forEach(row => {
        const holdingObjId = row['HOLDING.OBJECT_ID']
        const url = `${config.svConfig.restSvcBaseUrl}/naits_triglav_plugin/report/generatePdf/${session}/${holdingObjId}/HC_main`
        window.open(url, '_blank')
      })
    }
  }

  generateHoldingsGrid = () => {
    const { session } = this.props
    const { holdingResponsibleId } = this.state
    const gridParams = []
    gridParams.push({
      PARAM_NAME: 'session',
      PARAM_VALUE: session
    }, {
      PARAM_NAME: 'holdingResponsibleId',
      PARAM_VALUE: holdingResponsibleId
    }, {
      PARAM_NAME: 'objectType',
      PARAM_VALUE: 'HOLDING'
    }, {
      PARAM_NAME: 'gridConfigWeWant',
      PARAM_VALUE: 'HOLDING'
    })
    const holdingsGridId = 'HOLDINGS_PER_HOLDING_RESPONSIBLE'
    const holdingsGrid = GridManager.generateExportableGridWithCustomBtn(
      holdingsGridId, holdingsGridId, 'CUSTOM_GRID',
      'GET_HOLDINGS_BY_HOLDING_RESPONSIBLE_ID', gridParams, 'CUSTOM', () => { }, null,
      true, onGridSelectionChange, 350, 1100, false, () => { }, false
    )
    this.setState({ holdingsGrid })
  }

  onChange = e => {
    if (strcmp(e.target.name, 'pdfDocument')) {
      this.setState({ [e.target.name]: e.target.files[0] })
    } else {
      this.setState({ [e.target.name]: e.target.value })
    }
  }

  submitSearchForm = (e) => {
    e.preventDefault()
    const { session, parentComponent } = this.props
    const { holdingResponsibleId, recipientEmail, pdfDocument, holdingsGrid, animalsGrid } = this.state
    parentComponent.setState({ loading: true })
    if (holdingsGrid) {
      this.setState({ holdingsGrid: undefined })
      ComponentManager.cleanComponentReducerState('HOLDINGS_PER_HOLDING_RESPONSIBLE')
      store.dispatch({ type: 'UPDATE_SELECTED_GRID_ROWS', payload: [[], 'HOLDINGS_PER_HOLDING_RESPONSIBLE'] })
    }
    if (animalsGrid) {
      this.setState({ animalsGrid: undefined })
      ComponentManager.cleanComponentReducerState('ANIMALS_PER_HOLDINGS')
    }
    const verbPath = config.svConfig.triglavRestVerbs.SEND_EMAIL_IF_HOLDING_RESP_EXISTS
    const url = `${config.svConfig.restSvcBaseUrl}${verbPath}/${session}/${holdingResponsibleId}/${recipientEmail}`
    const data = new FormData()
    data.append('file', pdfDocument)
    const reqConfig = { method: 'post', data, url }
    axios(reqConfig).then(res => {
      parentComponent.setState({ loading: false })
      const resType = formatAlertType(res.data)
      alertUser(true, resType, this.context.intl.formatMessage({ id: res.data, defaultMessage: res.data }))
      this.generateHoldingsGrid()
    }).catch(err => {
      console.error(err)
      parentComponent.setState({ loading: false })
      alertUser(true, 'error', err)
    })
  }

  render () {
    const { holdingsGrid, animalsGrid } = this.state
    const holdingResponsibleLabel = this.context.intl.formatMessage({
      id: config.labelBasePath + '.main.holding_responsible_nat_reg_num',
      defaultMessage: config.labelBasePath + '.main.holding_responsible_nat_reg_num'
    })
    const emailLabel = this.context.intl.formatMessage({
      id: config.labelBasePath + '.main.recipient_email',
      defaultMessage: config.labelBasePath + '.main.recipient_email'
    })
    const attachmentLabel = this.context.intl.formatMessage({
      id: config.labelBasePath + '.main.attachment',
      defaultMessage: config.labelBasePath + '.main.attachment'
    })
    const searchLabel = this.context.intl.formatMessage({
      id: config.labelBasePath + '.main.search',
      defaultMessage: config.labelBasePath + '.main.search'
    })
    const displayAnimalsLabel = this.context.intl.formatMessage({
      id: config.labelBasePath + '.main.display_animal_list',
      defaultMessage: config.labelBasePath + '.main.display_animal_list'
    })
    const printHoldingCertificateLabel = this.context.intl.formatMessage({
      id: config.labelBasePath + '.print.HC_main',
      defaultMessage: config.labelBasePath + '.print.HC_main'
    })
    const printAnimalRecordLabel = this.context.intl.formatMessage({
      id: config.labelBasePath + '.print.animal_record',
      defaultMessage: config.labelBasePath + '.print.animal_record'
    })

    return (
      <React.Fragment>
        <form id='search-form' className={`${mainStyle['search-form']}`} onSubmit={this.submitSearchForm} onChange={this.onChange}>
          <div className={`form-group field field-string ${mainStyle['width-20']}`} style={{ marginRight: '0.5rem' }}>
            <label htmlFor='holdingResponsibleId' className={mainStyle['color-white']}>{holdingResponsibleLabel}*</label>
            <input type='text' name='holdingResponsibleId' id='holdingResponsibleId' className='form-control' required />
          </div>
          <div className={`form-group field field-string ${mainStyle['width-20']}`} style={{ marginRight: '0.5rem' }}>
            <label htmlFor='recipientEmail' className={mainStyle['color-white']}>{emailLabel}*</label>
            <input type='text' name='recipientEmail' id='recipientEmail' className='form-control' required />
          </div>
          <div className={`form-group field field-string ${mainStyle['width-20']}`}>
            <label htmlFor='pdfDocument' className={mainStyle['color-white']}>{attachmentLabel}*</label>
            <input type='file' name='pdfDocument' id='pdfDocument' className='form-control' required />
          </div>
          <div id='btnSeparator' className='search-form-btn-separator'>
            <button type='submit' id='save_form_btn' className={`btn-success btn_save_form ${mainStyle['submit-search-btn']}`}>
              {searchLabel}
            </button>
          </div>
        </form>
        {holdingsGrid && (
          <div className={mainStyle['holdings-container']}>
            {holdingsGrid}
            <div className={mainStyle['holding-buttons-container']}>
              <button id='printHoldingCertificate' className='btn-success btn_save_form' onClick={this.printHoldingCertificate}>
                {printHoldingCertificateLabel}
              </button>
              <button id='displayAnimals' className='btn-success btn_save_form' onClick={this.displayAnimals}>
                {displayAnimalsLabel}
              </button>
            </div>
          </div>
        )}
        {animalsGrid && (
          <div className={mainStyle['holdings-container']}>
            {animalsGrid}
            <div className={mainStyle['holding-buttons-container']}>
              <button id='printHoldingCertificate' className='btn-success btn_save_form' onClick={this.printAnimalRecord}>
                {printAnimalRecordLabel}
              </button>
            </div>
          </div>
        )}
      </React.Fragment>
    )
  }
}

NewSearch.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession,
  selectedGridRows: state.selectedGridRows.selectedGridRows
})

export default connect(mapStateToProps)(NewSearch)
