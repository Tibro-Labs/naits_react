import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as config from 'config/config.js'
import style from './ExecuteActionOnSelectedRows.module.css'
import { alertUser } from 'tibro-components'
import { createReverseTransfer } from 'backend/createReverseTransfer'
import { store, updateSelectedRows } from 'tibro-redux'
import { isValidArray } from 'functions/utils'
import { ComponentManager, GridManager } from 'components/ComponentsIndex'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'

class ReverseTransfer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: null
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

  close = () => {
    this.setState({ popup: false })
  }

  reverseTransfer = () => {
    const { selectedGridRows, selectedObject } = this.props
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
    ReactDOM.render(
      <div style={{ marginLeft: '12px' }}>
        <label htmlFor='rangeFrom'>{this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.range_from`,
          defaultMessage: `${config.labelBasePath}.main.range_from`
        })}</label>
        <input
          type='number'
          id='rangeFrom'
          className={'form-control ' + style.input}
          defaultValue={selectedGridRows[0][selectedObject + '.START_TAG_ID']}
        />
        <label htmlFor='rangeTo'>{this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.range_to`,
          defaultMessage: `${config.labelBasePath}.main.range_to`
        })}</label>
        <input
          type='number'
          id='rangeTo'
          className={'form-control ' + style.input}
          defaultValue={selectedGridRows[0][selectedObject + '.END_TAG_ID']}
        />
        <br />
      </div>,
      wrapper
    )

    this.setState({
      alert: alertUser(
        true,
        'info',
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.reverse_transfer`,
          defaultMessage: `${config.labelBasePath}.main.reverse_transfer`
        }),
        null,
        () => {
          if (this.props.selectedGridRows.length > 0) {
            const rangeFrom = document.getElementById('rangeFrom').value
            const rangeTo = document.getElementById('rangeTo').value
            if (!rangeFrom && !rangeTo) {

            } else {
              this.props.createReverseTransfer(
                this.props.svSession,
                rangeFrom,
                rangeTo,
                this.props.selectedGridRows
              )
              this.close()
            }
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
    const { gridType, selectedObjects, customGridId } = this.props
    let component = null
    if (customGridId === 'TRANSFER_OUTCOME') {
      return null
    } else {
      selectedObjects.map(singleObj => {
        const isActive = singleObj.active
        if (isActive && singleObj.row[gridType + '.ORG_UNIT_TYPE'] === 'HEADQUARTER') {
          return null
        }
        if (gridType) {
          if (isActive) {
            component = <div
              id='reverse_transfer'
              className={styles.container} style={{ cursor: 'pointer', marginRight: '7px', color: 'white' }}
              onClick={this.reverseTransfer}
            >
              <p>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.reverse_transfer`,
                  defaultMessage: `${config.labelBasePath}.reverse_transfer`
                })}
              </p>
              <div id='reverse_transfer' className={styles['gauge-container']}>
                <img id='change_status_img' className={style.actionImg} style={{ height: '45px', marginTop: '7%' }}
                  src='/naits/img/massActionsIcons/undo.png' />
              </div>
            </div>
          }
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

ReverseTransfer.contextTypes = {
  intl: PropTypes.object.isRequired
}

ReverseTransfer.propTypes = {
  gridType: PropTypes.string.isRequired
}

const mapDispatchToProps = dispatch => ({
  updateSelectedRows: (...params) => {
    dispatch(updateSelectedRows(...params))
  },
  createReverseTransfer: (...params) => {
    dispatch(createReverseTransfer(...params))
  }
})

const mapStateToProps = state => ({
  svSession: state.security.svSession,
  selectedObjects: state.gridConfig.gridHierarchy,
  selectedGridRows: state.selectedGridRows.selectedGridRows,
  massActionResult: state.massActionResult.result
})

export default connect(mapStateToProps, mapDispatchToProps)(ReverseTransfer)
