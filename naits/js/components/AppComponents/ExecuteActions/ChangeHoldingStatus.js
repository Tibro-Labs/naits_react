import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as config from 'config/config.js'
import style from './ExecuteActionOnSelectedRows.module.css'
import { alertUser } from 'tibro-components'
import { changeStatusOfHoldingAction, resetHolding } from 'backend/changeStatusOfHoldingAction'
import { store } from 'tibro-redux'
import { formatAlertType } from 'functions/utils'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'

class ChangeHoldingStatus extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: null
    }
  }

  componentWillReceiveProps (nextProps) {
    if ((this.props.changeStatus !== nextProps.changeStatus) &&
      nextProps.changeStatus) {
      this.setState({
        alert: alertUser(true, formatAlertType(nextProps.changeStatus), this.context.intl.formatMessage({
          id: nextProps.changeStatus,
          defaultMessage: nextProps.changeStatus
        }) || ' ', null,
        () => {
          store.dispatch(resetHolding())
        })
      })
    }
  }

  changeStatusOfHolding = (status) => {
    let gridType = this.props.gridType
    let objectId
    let changeStatus = status.toLowerCase()
    let selectedObjects = this.props.selectedObjects
    function prompt (component, onConfirmCallback) {
      component.setState({
        alert: alertUser(
          true,
          'warning',
          component.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.change_status_${changeStatus}`,
            defaultMessage: `${config.labelBasePath}.main.change_status_${changeStatus}`
          }),
          null,
          onConfirmCallback,
          () => component.setState({ alert: alertUser(false, 'info', '') }),
          true,
          component.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.execute`,
            defaultMessage: `${config.labelBasePath}.actions.execute`
          }),
          component.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.forms.cancel`,
            defaultMessage: `${config.labelBasePath}.main.forms.cancel`
          }),
          true,
          null,
          true
        )
      })
    }

    selectedObjects.forEach(grid => {
      gridType = grid.gridType
      objectId = grid.row[`${gridType}.OBJECT_ID`]

      if (grid.active && objectId) {
        prompt(this, () => this.props.changeStatusOfHoldingAction(this.props.svSession, objectId, status))
      }
    })
  }

  render () {
    const { gridType, selectedObjects } = this.props
    let component = null
    if (gridType) {
      selectedObjects.forEach(grid => {
        const isActive = grid.active
        if (isActive) {
          component = <div
            id='change_status'
            className={styles.container} style={{ cursor: 'pointer', marginRight: '7px', color: 'white' }} >
            <p style={{ marginTop: '2px' }}>
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.change_status_of_holding`,
                defaultMessage: `${config.labelBasePath}.main.change_status_of_holding`
              })}
            </p>
            <div id='change_status' className={styles['gauge-container']}>
              <div
                id='create_sublist'
                className={styles['dropdown-content']} style={{ marginTop: '105%' }}>
                <div onClick={() => this.changeStatusOfHolding('VALID')}>{this.context.intl.formatMessage({ id: `${config.labelBasePath}.valid`, defaultMessage: `${config.labelBasePath}.valid` })}</div>
                <div onClick={() => this.changeStatusOfHolding('SUSPENDED')}> {this.context.intl.formatMessage({ id: `${config.labelBasePath}.suspended`, defaultMessage: `${config.labelBasePath}.suspended` })}</div>
                <div onClick={() => this.changeStatusOfHolding('TERMINATED')}> {this.context.intl.formatMessage({ id: `${config.labelBasePath}.terminated`, defaultMessage: `${config.labelBasePath}.terminated` })}</div>
              </div>
              <img id='change_status_img' className={style.actionImg} style={{ height: '45px', marginTop: '7%' }}
                src='/naits/img/massActionsIcons/exchange.png' />
            </div>
          </div>
        }
      })
    }
    return component
  }
}

ChangeHoldingStatus.contextTypes = {
  intl: PropTypes.object.isRequired
}

ChangeHoldingStatus.propTypes = {
  gridType: PropTypes.string.isRequired
}

const mapDispatchToProps = dispatch => ({
  changeStatusOfHoldingAction: (...params) => {
    dispatch(changeStatusOfHoldingAction(...params))
  }
})

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
  actionResult: state.massAction.result,
  selectedObjects: state.gridConfig.gridHierarchy,
  changeStatus: state.changeStatus.result,
  componentToDisplay: state.componentToDisplay.componentToDisplay
})

export default connect(mapStateToProps, mapDispatchToProps)(ChangeHoldingStatus)
