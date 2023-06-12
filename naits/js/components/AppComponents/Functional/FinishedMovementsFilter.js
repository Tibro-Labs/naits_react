import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { store } from 'tibro-redux'
import PropTypes from 'prop-types'
import DatePicker from 'react-date-picker'
import * as config from 'config/config.js'
import { convertToShortDate } from 'functions/utils'
import style from '../ExecuteActions/ExecuteActionOnSelectedRows.module.css'

class FinishedMovementsFilter extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      dateFrom: null,
      dateTo: null
    }
  }

  componentWillUnmount () {
    store.dispatch({ type: 'RESET_THE_FINISHED_MOVEMENTS_FILTER_PARAMS' })
  }

  filterFinishedMovements = () => {
    const hiddenButton = document.getElementById('filterMovementsByDate')
    if (hiddenButton) {
      hiddenButton.click()
    }
  }

  setDateFrom = (date) => {
    this.setState({ dateFrom: date })
    const shortDateFrom = date ? convertToShortDate(date, 'y-m-d') : null
    store.dispatch({ type: 'SET_THE_FINISHED_MOVEMENTS_FILTER_DATE_FROM', payload: shortDateFrom })
  }

  setDateTo = (date) => {
    this.setState({ dateTo: date })
    const shortDateTo = date ? convertToShortDate(date, 'y-m-d') : null
    store.dispatch({ type: 'SET_THE_FINISHED_MOVEMENTS_FILTER_DATE_TO', payload: shortDateTo })
  }

  getComponent = () => {
    const { dateFrom, dateTo } = this.state
    const nowBtnText = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.now`,
      defaultMessage: `${config.labelBasePath}.main.now`
    })
    const filterText = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.filter_finished_movements_by_date`,
      defaultMessage: `${config.labelBasePath}.main.filter_finished_movements_by_date`
    })
    const component = (
      <div id='filterFinishedMovementsContainer' className={style.container}>
        <div className={style.title}>{filterText}</div>
        <div id='filterFinishedMovementsInputsContainer' className={style.customContainer}>
          <div style={{ marginTop: '-0.5rem' }}>
            <div>
              {this.context.intl.formatMessage({ id: `${config.labelBasePath}.main.date_from`, defaultMessage: `${config.labelBasePath}.main.date_from` })}
            </div>
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
          <div style={{ marginTop: '-0.5rem', marginLeft: '1.5rem' }}>
            <div>
              {this.context.intl.formatMessage({ id: `${config.labelBasePath}.main.date_to`, defaultMessage: `${config.labelBasePath}.main.date_to` })}
            </div>
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
          id='filterFinishedMovements'
          className={style.menuActivator}
          style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'baseline', width: '110px' }}
          onClick={() => this.filterFinishedMovements()}>
          <img
            id='filter_img'
            className={style.actionImg}
            style={{ marginTop: '7px', marginLeft: '4px', width: '40px' }}
            src='/naits/img/massActionsIcons/replace.png'
          />
        </div>
      </div>
    )

    return component
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

FinishedMovementsFilter.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession
})

export default connect(mapStateToProps)(FinishedMovementsFilter)
