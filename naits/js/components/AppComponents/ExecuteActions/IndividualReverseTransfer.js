import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as config from 'config/config.js'
import style from './ExecuteActionOnSelectedRows.module.css'
import { alertUser } from 'tibro-components'
import { individualReverseTransfer } from 'backend/individualReverseTransfer'
import { store, updateSelectedRows } from 'tibro-redux'
import { isValidArray, formatAlertType } from 'functions/utils'
import { ComponentManager, GridManager } from 'components/ComponentsIndex'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'

class IndividualReverseTransfer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: null
    }
  }

  componentWillReceiveProps (nextProps) {
    if ((this.props.massActionResult !== nextProps.massActionResult) &&
      nextProps.massActionResult) {
      this.setState({
        alert: alertUser(true, formatAlertType(nextProps.massActionResult),
          this.context.intl.formatMessage({
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
  }

  reloadData = (props) => {
    if (props.selectedObject === 'INVENTORY_ITEM') {
      let gridId = props.selectedObject
      ComponentManager.setStateForComponent(gridId, null, {
        selectedIndexes: []
      })
      GridManager.reloadGridData(gridId)
    } else {
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
  }

  componentWillUnmount () {
    this.props.updateSelectedRows([], null)
    store.dispatch({ type: 'CLEAN_ACTION_STATE', payload: null })
  }

  close = () => {
    this.setState({ popup: false })
  }

  individualTransfer = () => {
    const { svSession, selectedObject, selectedGridRows } = this.props
    if (!isValidArray(selectedGridRows, 1)) {
      return this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.empty_selection`,
            defaultMessage: `${config.labelBasePath}.alert.empty_selection`
          }), null,
          () => this.setState({ alert: alertUser(false, 'info', '') })
        )
      })
    }

    let wrapper = document.createElement('div')
    this.setState({
      alert: alertUser(
        true,
        'warning',
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.individual_transfer`,
          defaultMessage: `${config.labelBasePath}.main.individual_transfer`
        }),
        null,
        () => {
          if (selectedGridRows.length > 0) {
            this.props.individualReverseTransfer(
              svSession,
              selectedObject,
              selectedGridRows
            )
            this.close()
          }
        },
        this.close,
        true,
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.actions.execute`,
          defaultMessage: `${config.labelBasePath}.actions.execute`
        }),
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.forms.cancel`,
          defaultMessage: `${config.labelBasePath}.main.forms.cancel`
        }),
        true,
        null,
        true,
        wrapper
      )
    })
  }

  render () {
    const { gridType, selectedObjects } = this.props
    let component = null
    if (gridType) {
      selectedObjects.map(singleObj => {
        const isActive = singleObj.active
        if (isActive && singleObj.row[gridType + '.ORG_UNIT_TYPE'] === 'HEADQUARTER') {
          return null
        }
        if (isActive) {
          component = <div
            id='individual_transfer'
            className={styles.container} style={{ cursor: 'pointer', marginRight: '7px', color: 'white' }}
            onClick={this.individualTransfer}
          >
            <p style={{ marginTop: '2px' }}>
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.individual_transfer`,
                defaultMessage: `${config.labelBasePath}.individual_transfer`
              })}
            </p>
            <div id='individual_transfer' className={styles['gauge-container']}>
              <img id='change_status_img' className={style.actionImg} style={{ height: '45px', marginTop: '7%' }}
                src='/naits/img/massActionsIcons/undo.png' />
            </div>
          </div>
        }
      })
    }
    return (
      <div>
        {component}
      </div>
    )
  }
}

IndividualReverseTransfer.contextTypes = {
  intl: PropTypes.object.isRequired
}

IndividualReverseTransfer.propTypes = {
  gridType: PropTypes.string.isRequired
}

const mapDispatchToProps = dispatch => ({
  updateSelectedRows: (...params) => {
    dispatch(updateSelectedRows(...params))
  },
  individualReverseTransfer: (...params) => {
    dispatch(individualReverseTransfer(...params))
  }
})

const mapStateToProps = state => ({
  svSession: state.security.svSession,
  selectedObjects: state.gridConfig.gridHierarchy,
  selectedGridRows: state.selectedGridRows.selectedGridRows,
  massActionResult: state.massActionResult.result
})

export default connect(mapStateToProps, mapDispatchToProps)(IndividualReverseTransfer)
