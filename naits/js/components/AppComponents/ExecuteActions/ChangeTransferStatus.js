import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as config from 'config/config.js'
import style from './ExecuteActionOnSelectedRows.module.css'
import { alertUser } from 'tibro-components'
import { updateStatus, resetObject } from 'backend/changeStatusAction'
import { store, updateSelectedRows } from 'tibro-redux'
import { formatAlertType, strcmp } from 'functions/utils'
import { ComponentManager, GridManager, Loading } from 'components/ComponentsIndex'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'

class ChangeTransferStatus extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: null,
      loading: false
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ loading: nextProps.isLoading })
    if ((this.props.massActionResult !== nextProps.massActionResult) &&
      nextProps.massActionResult) {
      this.setState({
        alert: alertUser(true, 'info', this.context.intl.formatMessage({
          id: nextProps.massActionResult,
          defaultMessage: nextProps.massActionResult
        }) || '', null,
        () => {
          store.dispatch({ type: 'CLEAN_ACTION_STATE', payload: null })
          this.props.updateSelectedRows([], null)
          this.setState({ alert: alertUser(false, 'info', '') })
          this.reloadData(nextProps)
        })
      })
    }
    if ((this.props.actionResult !== nextProps.actionResult) &&
      nextProps.actionResult) {
      this.setState({
        alert: alertUser(true, formatAlertType(nextProps.actionResult), this.context.intl.formatMessage({
          id: nextProps.actionResult,
          defaultMessage: nextProps.actionResult
        }) || ' ', null,
        () => {
          store.dispatch(resetObject())
          this.props.updateSelectedRows([], null)
          this.reloadData(nextProps)
        })
      })
    }
  }

  reloadData = (props) => {
    let gridIdPrime = props.selectedGrid.gridId.slice(0, -1) + '1'
    let gridIdSec = props.selectedGrid.gridId.slice(0, -1) + '2'

    ComponentManager.setStateForComponent(gridIdPrime)
    ComponentManager.setStateForComponent(gridIdPrime, null, {
      selectedIndexes: []
    })
    GridManager.reloadGridData(gridIdPrime)
    ComponentManager.setStateForComponent(gridIdSec)
    ComponentManager.setStateForComponent(gridIdSec, null, {
      selectedIndexes: []
    })
    GridManager.reloadGridData(gridIdSec)
  }

  componentWillUnmount () {
    this.props.updateSelectedRows([], null)
    store.dispatch({ type: 'CLEAN_ACTION_STATE', payload: null })
  }

  changeStatusAction = (status) => {
    const gridType = this.props.selectedObject
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
    for (let i = 0; i < selectedObjects.length; i++) {
      if (selectedObjects[i].active && this.props.selectedGridRows.length > 0) {
        let reducedGridRows = []
        this.props.selectedGridRows.map(row => {
          if (row['TRANSFER.OBJECT_ID'] && row['TRANSFER.PARENT_ID']) {
            reducedGridRows.push({
              'TRANSFER.OBJECT_ID': row['TRANSFER.OBJECT_ID'],
              'TRANSFER.PARENT_ID': row['TRANSFER.PARENT_ID']
            })
          }
        })
        prompt(this, () => this.props.updateStatus(this.props.svSession, gridType, status, reducedGridRows))
      } else {
        this.setState({
          alert: alertUser(true, 'warning',
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.alert.empty_selection`,
              defaultMessage: `${config.labelBasePath}.alert.empty_selection`
            }), null,
            () => this.setState({ alert: alertUser(false, 'info', '') })
          )
        })
      }
    }
  }

  render () {
    const { gridType, selectedObjects, customGridId } = this.props
    let component = null
    // double active flag hack
    if (gridType) {
      for (let i = 0; i < selectedObjects.length; i++) {
        const isActive = selectedObjects[i].active
        if (isActive) {
          component = <div
            id='change_status'
            className={styles.container} style={{ cursor: 'pointer', marginRight: '7px', color: 'white' }} >
            <p>
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.change_status`,
                defaultMessage: `${config.labelBasePath}.change_status`
              })}
            </p>
            <div id='change_status' className={styles['gauge-container']}>
              <div
                id='create_sublist'
                className={styles['dropdown-content']} style={{ marginTop: '105%' }}>
                <div onClick={() => this.changeStatusAction('CANCELED')}>
                  {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.canceled`,
                    defaultMessage: `${config.labelBasePath}.canceled`
                  })}
                </div>
                {!strcmp(customGridId, 'TRANSFER_OUTCOME') &&
                  <div onClick={() => this.changeStatusAction('DELIVERED')}>
                    {this.context.intl.formatMessage({
                      id: `${config.labelBasePath}.actions.change_status_delivered`,
                      defaultMessage: `${config.labelBasePath}.actions.change_status_delivered`
                    })}
                  </div>
                }
              </div>
              <img id='change_status_img' className={style.actionImg} style={{ height: '45px', marginTop: '7%' }}
                src='/naits/img/massActionsIcons/exchange.png' />
            </div>
          </div>
        }
      }
    }
    return (
      <React.Fragment>
        {this.state.loading && <Loading />}
        {component}
      </React.Fragment>
    )
  }
}

ChangeTransferStatus.contextTypes = {
  intl: PropTypes.object.isRequired
}

ChangeTransferStatus.propTypes = {
  gridType: PropTypes.string.isRequired
}

const mapDispatchToProps = dispatch => ({
  updateSelectedRows: (...params) => {
    dispatch(updateSelectedRows(...params))
  },
  updateStatus: (...params) => {
    dispatch(updateStatus(...params))
  }
})

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
  actionResult: state.massAction.result,
  selectedObjects: state.gridConfig.gridHierarchy,
  selectedGrid: state.selectedGridRows,
  selectedGridRows: state.selectedGridRows.selectedGridRows,
  massActionResult: state.massActionResult.result,
  componentToDisplay: state.componentToDisplay.componentToDisplay,
  isLoading: state.massAction.isLoading
})

export default connect(mapStateToProps, mapDispatchToProps)(ChangeTransferStatus)
