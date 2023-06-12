import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { alertUser } from 'tibro-components'
import { store } from 'tibro-redux'
import { ComponentManager, GridManager, Loading } from 'components/ComponentsIndex'
import { moveInventoryItem, resetObject } from 'backend/moveInventoryItemAction'
import { strcmp, isValidArray, formatAlertType } from 'functions/utils'
import * as config from 'config/config'
import style from 'components/AppComponents/ExecuteActions/ExecuteActionOnSelectedRows.module.css'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'

class ReleaseInventoryItems extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: undefined
    }
  }

  componentWillReceiveProps (nextProps) {
    if ((this.props.actionResult !== nextProps.actionResult) && nextProps.actionResult) {
      const responseType = formatAlertType(nextProps.actionResult)
      this.setState({
        alert: alertUser(
          true, responseType, this.context.intl.formatMessage({
            id: nextProps.actionResult,
            defaultMessage: nextProps.actionResult
          }), null, () => this.props.resetObject()
        )
      })
      if (strcmp(responseType, 'success')) {
        this.resetAndReload()
      }
    }
  }

  resetAndReload = () => {
    const { customGridId, parentId } = this.props
    const firstGridId = `${customGridId}_${parentId}_1`
    const secondGridId = `${customGridId}_${parentId}_2`
    store.dispatch({ type: 'UPDATE_SELECTED_GRID_ROWS', payload: [[], firstGridId] })
    store.dispatch({ type: 'UPDATE_SELECTED_GRID_ROWS', payload: [[], secondGridId] })
    GridManager.reloadGridData(firstGridId)
    GridManager.reloadGridData(secondGridId)
    ComponentManager.setStateForComponent(firstGridId, 'selectedIndexes', [])
    ComponentManager.setStateForComponent(secondGridId, 'selectedIndexes', [])
  }

  showAlert = () => {
    const actionLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.actions.move_inventory_item`,
      defaultMessage: `${config.labelBasePath}.actions.move_inventory_item`
    })
    if (isValidArray(this.props.selectedGridRows, 1)) {
      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.prompt_text`,
            defaultMessage: `${config.labelBasePath}.actions.prompt_text`
          }) + ` "${actionLabel}"?`, null,
          () => this.releaseInventoryItems(),
          () => this.setState({ alert: alertUser(false, 'info', '') }),
          true, this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.execute`,
            defaultMessage: `${config.labelBasePath}.actions.execute`
          }),
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.forms.cancel`,
            defaultMessage: `${config.labelBasePath}.main.forms.cancel`
          }), true, null, true
        )
      })
    } else {
      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.empty_selection`,
            defaultMessage: `${config.labelBasePath}.alert.empty_selection`
          }), null, () => this.setState({ alert: alertUser(false, 'info', '') })
        )
      })
    }
  }

  releaseInventoryItems = () => {
    const { session, selectedGridRows } = this.props
    this.props.moveInventoryItem(session, selectedGridRows)
  }

  render () {
    return (
      <React.Fragment>
        <div
          id='release_inv_items_container'
          className={styles.container}
          style={{ cursor: 'pointer', marginRight: '7px', color: 'white', width: 'auto' }}
          onClick={this.showAlert}
        >
          <p style={{ marginTop: '2px' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.actions.move_inventory_item`,
              defaultMessage: `${config.labelBasePath}.actions.move_inventory_item`
            })}
          </p>
          <div id='release_inv_items' className={styles['gauge-container']} style={{ width: 'auto' }}>
            <img
              id='release_inv_items_img' className={style.actionImg}
              style={{ height: '45px', marginTop: '7%', marginLeft: '14px' }}
              src='/naits/img/massActionsIcons/move.png'
            />
          </div>
        </div>
        {this.props.isLoading && <Loading />}
      </React.Fragment>
    )
  }
}

ReleaseInventoryItems.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession,
  selectedGridRows: state.selectedGridRows.selectedGridRows,
  actionResult: state.massAction.result,
  isLoading: state.massAction.isLoading
})

const mapDispatchToProps = dispatch => ({
  moveInventoryItem: (...params) => {
    dispatch(moveInventoryItem(...params))
  },
  resetObject: (...params) => {
    dispatch(resetObject(...params))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(ReleaseInventoryItems)
