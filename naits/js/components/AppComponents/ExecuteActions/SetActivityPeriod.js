import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as config from 'config/config'
import DatePicker from 'react-date-picker'
import { store } from 'tibro-redux'
import { alertUser } from 'tibro-components'
import { isValidArray, strcmp, convertToShortDate, formatAlertType, gaEventTracker } from 'functions/utils'
import { ComponentManager, GridManager } from 'components/ComponentsIndex'
import { setActivityPeriodAction } from 'backend/setActivityPeriodAction'
import badge from 'components/AppComponents/Presentational/Badges/Badges.module.css'
import style from 'components/AppComponents/ExecuteActions/ExecuteActionOnSelectedRows.module.css'

class SetActivityPeriod extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: null,
      dateFrom: null,
      dateTo: null
    }
  }

  componentWillUpdate (nextProps, nextState) {
    if ((nextState.dateFrom && this.state.dateFrom !== nextState.dateFrom) ||
      (nextState.dateTo && this.state.dateTo !== nextState.dateTo)) {
      ReactDOM.render(
        <div>
          <div>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.date_from`,
              defaultMessage: `${config.labelBasePath}.main.date_from`
            })}
          </div>
          <DatePicker
            name='from'
            key='from'
            required
            className='datePicker date-picker-alert'
            onChange={this.setDateFrom}
            value={nextState.dateFrom}
          />
          <div>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.date_to`,
              defaultMessage: `${config.labelBasePath}.main.date_to`
            })}
          </div>
          <DatePicker
            name='to'
            key='to'
            required
            className='datePicker date-picker-alert'
            onChange={this.setDateTo}
            value={nextState.dateTo}
          />
        </div>, document.getElementById('alertExtension')
      )
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.massActionResult && this.props.massActionResult !== nextProps.massActionResult) {
      this.setState({
        alert: alertUser(true, formatAlertType(nextProps.massActionResult), this.context.intl.formatMessage({
          id: nextProps.massActionResult,
          defaultMessage: nextProps.massActionResult
        }) || ' ', null,
        () => {
          store.dispatch({ type: 'RESET_STANDALONE_ACTION', payload: null })
        })
      })
      this.reloadData(nextProps)
      this.setState({ dateFrom: null, dateTo: null })
    }
  }

  reloadData = (props) => {
    ComponentManager.setStateForComponent(props.gridId, 'selectedIndexes', [])
    GridManager.reloadGridData(props.gridId)
    store.dispatch({ type: 'UPDATE_SELECTED_GRID_ROWS', payload: [[], props.gridId] })
  }

  setDateFrom = (date) => {
    this.setState({ dateFrom: date })
  }

  setDateTo = (date) => {
    this.setState({ dateTo: date })
  }

  actionPrompt = () => {
    let type = this.props.objectType.toLowerCase()
    if (this.props.selectedGridRows.length > 0) {
      // create an input element in current document
      let element = document.createElement('div')
      element.id = 'alertExtension'
      ReactDOM.render(
        <div>
          <div>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.date_from`,
              defaultMessage: `${config.labelBasePath}.main.date_from`
            })}
          </div>
          <DatePicker
            key='from'
            required
            className='datePicker date-picker-alert'
            onChange={this.setDateFrom}
            value={this.state.dateFrom}
          />
          <div>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.date_to`,
              defaultMessage: `${config.labelBasePath}.main.date_to`
            })}
          </div>
          <DatePicker
            key='to'
            required
            className='datePicker date-picker-alert'
            onChange={this.setDateTo}
            value={this.state.dateTo}
          />
        </div>, element
      )
      // enter suspension reason
      this.setState({
        alert: alertUser(
          true, 'info', this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.enter_activity_period_dates`,
            defaultMessage: `${config.labelBasePath}.main.enter_activity_period_dates`
          }),
          null,
          this.setActivityPeriod,
          true, true,
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.set_activity_period_for_${type}`,
            defaultMessage: `${config.labelBasePath}.set_activity_period_for_${type}`
          }),
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.forms.cancel`,
            defaultMessage: `${config.labelBasePath}.main.forms.cancel`
          }), true, null, false, element
        )
      })
    } else {
      this.setState({
        alert: alertUser(true, 'info',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.check_${type}`,
            defaultMessage: `${config.labelBasePath}.alert.check_${type}`
          }), null,
          () => this.setState({ alert: alertUser(false, 'info', '') })
        )
      })
    }
  }

  setActivityPeriod = () => {
    const { dateFrom, dateTo } = this.state
    store.dispatch({ type: 'RESET_STANDALONE_ACTION', payload: null })
    if (dateFrom && dateTo) {
      this.props.setActivityPeriodAction(
        this.props.svSession,
        this.props.holdingObjId,
        this.props.selectedGridRows,
        convertToShortDate(dateFrom, 'y-m-d'),
        convertToShortDate(dateTo, 'y-m-d')
      )
    }
  }

  render () {
    const { objectType, componentToDisplay } = this.props
    let linkName
    if (isValidArray(componentToDisplay, 1)) {
      linkName = componentToDisplay[0].props.gridProps.linkName
    }
    let type = linkName.toLowerCase()
    let btn = null
    if (this.props.gridId && strcmp(objectType, linkName)) {
      btn = <div>
        <button
          id='set_activity_period'
          className={badge.container}
          style={{ cursor: 'pointer', marginRight: '7px', color: 'white' }}
          onClick={() => {
            this.actionPrompt()
            gaEventTracker(
              'ACTION',
              'Clicked the Set activity period button',
              `${this.props.objectType} | ${config.version} (${config.currentEnv})`
            )
          }}
        >
          <span
            id='set_activity_txt'
            className={style.actionText}
            style={{ marginLeft: '-4%', marginTop: '6.5%', cursor: 'pointer' }}
          >
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.set_activity_period_for_${type}`,
              defaultMessage: `${config.labelBasePath}.set_activity_period_for_${type}`
            })}
          </span>
          <img id='set_activity_img' src='/naits/img/massActionsIcons/userActions.png' />
        </button>
      </div>
    }
    return <React.Fragment>
      {this.state.alert}
      {btn}
    </React.Fragment>
  }
}

SetActivityPeriod.contextTypes = {
  intl: PropTypes.object.isRequired
}

SetActivityPeriod.propTypes = {
  gridId: PropTypes.string.isRequired,
  objectType: PropTypes.string.isRequired
}

const mapDispatchToProps = dispatch => ({
  setActivityPeriodAction: (...params) => {
    dispatch(setActivityPeriodAction(...params))
  }
})

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
  selectedObjects: state.gridConfig.gridHierarchy,
  componentToDisplay: state.componentToDisplay.componentToDisplay,
  massActionResult: state.massAction.result,
  selectedGridRows: state.selectedGridRows.selectedGridRows
})

export default connect(mapStateToProps, mapDispatchToProps)(SetActivityPeriod)
