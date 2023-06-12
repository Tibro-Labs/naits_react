import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { store } from 'tibro-redux'
import DatePicker from 'react-date-picker'
import * as config from 'config/config.js'
import { strcmp, convertToShortDate, setInputFilter } from 'functions/utils'
import style from '../ExecuteActions/ExecuteActionOnSelectedRows.module.css'
import searchStyle from '../../../containers/SearchStyles.module.css'

class OutgoingTransferFilter extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      tagType: null,
      startTagId: null,
      endTagId: null,
      dateFrom: null,
      dateTo: null,
      tagTypes: ['7', '8', '1', '6', '4', '3', '2', '5'],
      tagTypesLabels: ['pet_rfid', 'rfid_tag', 'cattle', 'pet', 'pig_tag', 'sheep_tag', 'small_ruminants', 'ungulates']
    }

    this.startTagIdInput = React.createRef()
    this.endTagIdInput = React.createRef()
  }

  componentDidMount () {
    if (this.startTagIdInput && this.startTagIdInput.current) {
      setInputFilter(this.startTagIdInput.current, function (value) {
        return /^\d*$/.test(value)
      })
    }

    if (this.endTagIdInput && this.endTagIdInput.current) {
      setInputFilter(this.endTagIdInput.current, function (value) {
        return /^\d*$/.test(value)
      })
    }

    this.setState({ tagType: '7' })
    store.dispatch({ type: 'SET_THE_OUTGOING_TRANSFER_FILTER_TAG_TYPE', payload: '7' })
  }

  componentWillUnmount () {
    store.dispatch({ type: 'RESET_THE_OUTGOING_TRANSFER_FILTER_PARAMS' })
  }

  filterOutgoingTransfers = () => {
    const hiddenButton = document.getElementById('filterOutgoingTransfers')
    if (hiddenButton) {
      hiddenButton.click()
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value || null })
    if (strcmp(e.target.name, 'tagType')) {
      store.dispatch({ type: 'SET_THE_OUTGOING_TRANSFER_FILTER_TAG_TYPE', payload: e.target.value || null })
    } else if (strcmp(e.target.name, 'startTagId')) {
      store.dispatch({ type: 'SET_THE_OUTGOING_TRANSFER_FILTER_START_TAG_ID', payload: e.target.value || null })
    } else if (strcmp(e.target.name, 'endTagId')) {
      store.dispatch({ type: 'SET_THE_OUTGOING_TRANSFER_FILTER_END_TAG_ID', payload: e.target.value || null })
    }
  }

  setDateFrom = (date) => {
    this.setState({ dateFrom: date })
    const shortDateFrom = date ? convertToShortDate(date, 'y-m-d') : null
    store.dispatch({ type: 'SET_THE_OUTGOING_TRANSFER_FILTER_DATE_FROM', payload: shortDateFrom })
  }

  setDateTo = (date) => {
    this.setState({ dateTo: date })
    const shortDateTo = date ? convertToShortDate(date, 'y-m-d') : null
    store.dispatch({ type: 'SET_THE_OUTGOING_TRANSFER_FILTER_DATE_TO', payload: shortDateTo })
  }

  getComponent = () => {
    const { dateFrom, dateTo, tagTypes, tagTypesLabels } = this.state
    const nowBtnText = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.now`,
      defaultMessage: `${config.labelBasePath}.main.now`
    })
    const filterText = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.filter_outgoing_transfers`,
      defaultMessage: `${config.labelBasePath}.main.filter_outgoing_transfers`
    })

    return (
      <div
        id='filterOutgoingTransfersContainer'
        className={style.container}
        style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'center' }}
      >
        <div className={style.title}>{filterText}</div>
        <div id='filterOutgoingTransfersInputsContainer' className={style.customContainer}>
          <div>
            <p className={searchStyle.searchPrompt} style={{ marginTop: '0' }}>
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.grid_labels.transfer.tag_type`, defaultMessage: `${config.labelBasePath}.grid_labels.transfer.tag_type`
              })}
            </p>
            <select id='tagType' name='tagType' className={searchStyle.dropdown} style={{ marginTop: '0' }} onChange={this.onChange}>
              {tagTypes.map((tag, index) => {
                return <option key={tag} value={tag}>
                  {this.context.intl.formatMessage(
                    {
                      id: `${config.labelBasePath}.tag.${tagTypesLabels[index]}`,
                      defaultMessage: `${config.labelBasePath}.tag.${tagTypesLabels[index]}`
                    }
                  )}
                </option>
              })}
            </select>
          </div>
          <div style={{ marginLeft: '1rem' }}>
            <p className={searchStyle.searchPrompt} style={{ marginTop: '0' }}>
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.grid_labels.transfer.start_tag_id`, defaultMessage: `${config.labelBasePath}.grid_labels.transfer.start_tag_id`
              })}
            </p>
            <input
              ref={this.startTagIdInput}
              type='text'
              id='startTagId'
              name='startTagId'
              onChange={this.onChange}
              className={searchStyle.input}
              style={{ backgroundImage: 'none', paddingLeft: '5px', borderRadius: '5px', width: '100%' }}
            />
          </div>
          <div style={{ marginLeft: '1rem' }}>
            <p className={searchStyle.searchPrompt} style={{ marginTop: '0' }}>
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.grid_labels.transfer.end_tag_id`, defaultMessage: `${config.labelBasePath}.grid_labels.transfer.end_tag_id`
              })}
            </p>
            <input
              ref={this.endTagIdInput}
              type='text'
              id='endTagId'
              name='endTagId'
              onChange={this.onChange}
              className={searchStyle.input}
              style={{ backgroundImage: 'none', paddingLeft: '5px', borderRadius: '5px', width: '100%' }}
            />
          </div>
          <div style={{ marginLeft: '1rem' }}>
            <p className={searchStyle.searchPrompt} style={{ marginTop: '0' }}>
              {this.context.intl.formatMessage({ id: `${config.labelBasePath}.main.date_from`, defaultMessage: `${config.labelBasePath}.main.date_from` })}
            </p>
            <DatePicker
              key='dateFrom'
              className='datePicker'
              onChange={this.setDateFrom}
              value={dateFrom}
            />
            <button
              id='setDateFromNow'
              className={style.btn_save_formV2}
              style={{ marginTop: '0', height: '40px' }}
              onClick={() => this.setDateFrom(new Date())}>
              {nowBtnText}
            </button>
          </div>
          <div style={{ marginLeft: '1rem' }}>
            <p className={searchStyle.searchPrompt} style={{ marginTop: '0' }}>
              {this.context.intl.formatMessage({ id: `${config.labelBasePath}.main.date_to`, defaultMessage: `${config.labelBasePath}.main.date_to` })}
            </p>
            <DatePicker
              key='dateTo'
              className='datePicker'
              onChange={this.setDateTo}
              value={dateTo}
            />
            <button
              id='setDateToNow'
              className={style.btn_save_formV2}
              style={{ marginTop: '0', height: '40px' }}
              onClick={() => this.setDateTo(new Date())}>
              {nowBtnText}
            </button>
          </div>
        </div>
        <div
          id='filterOutgoingTransfers'
          className={style.menuActivator}
          style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'baseline', width: '110px' }}
          onClick={() => this.filterOutgoingTransfers()}>
          <img
            id='filter_img'
            className={style.actionImg}
            style={{ marginTop: '7px', marginLeft: '4px', width: '40px' }}
            src='/naits/img/massActionsIcons/replace.png'
          />
        </div>
      </div>
    )
  }

  render () {
    const portalComponent = <React.Fragment>{this.getComponent()}</React.Fragment>
    const parentContainer = document.getElementById('fixedActionMenu')

    const portalValidation = () => {
      if (parentContainer === null) {
        return portalComponent
      } else {
        return (
          <React.Fragment>
            {ReactDOM.createPortal(portalComponent, parentContainer)}
          </React.Fragment>
        )
      }
    }

    return (
      <React.Fragment>
        {portalValidation()}
      </React.Fragment>
    )
  }
}

OutgoingTransferFilter.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession
})

export default connect(mapStateToProps)(OutgoingTransferFilter)
