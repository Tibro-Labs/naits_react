import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as config from 'config/config.js'
import style from './ExecuteActionOnSelectedRows.module.css'
import { alertUser } from 'tibro-components'
import { moveToOrgUnitAction } from 'backend/moveToOrgUnitAction'
import { store, updateSelectedRows } from 'tibro-redux'
import { formatAlertType, strcmp, isValidArray } from 'functions/utils'
import { ComponentManager, GridManager, GridInModalLinkObjects, ResultsGrid, Loading } from 'components/ComponentsIndex'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'
import modalStyle from 'components/AppComponents/Functional/GridInModalLinkObjects.module.css'
import consoleStyle from 'components/AppComponents/Functional/AdminConsole/AdminConsole.module.css'

class MoveItemsToOrgUnit extends React.Component {
  constructor (props) {
    super(props)
    let gridTypeCall = 'GET_VALID_ORG_UNITS'
    const selectedObjects = props.selectedObjects.filter(el => {
      return el.active === true
    })
    let gridToDisplay = 'SVAROG_ORG_UNITS'
    if (selectedObjects[0].gridType === 'SVAROG_ORG_UNITS') {
      if (selectedObjects[0].row[selectedObjects[0].gridType + '.ORG_UNIT_TYPE'] === 'VILLAGE_OFFICE') {
        gridToDisplay = 'HOLDING'
      }
    }
    this.state = {
      alert: null,
      loading: false,
      popup: false,
      showHoldingPopup: false,
      currentOrgUnitName: '',
      currentOrgUnitType: '',
      destination: 'community',
      gridToDisplay: gridToDisplay,
      gridTypeCall: gridTypeCall
    }
  }

  componentDidMount () {
    this.getOrgUnitName()
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
          store.dispatch({ type: 'RESET_STANDALONE_ACTION', payload: null })
          this.props.updateSelectedRows([], null)
          this.setState({ alert: alertUser(false, 'info', '') })
          this.reloadData(nextProps)
          this.closeHoldingPopup()
        })
      })
    }
  }

  componentWillUnmount () {
    this.props.updateSelectedRows([], null)
    store.dispatch({ type: 'CLEAN_ACTION_STATE', payload: null })
    store.dispatch({ type: 'RESET_STANDALONE_ACTION', payload: null })
  }

  reloadData = (props) => {
    const gridId = props.selectedGrid.gridId
    ComponentManager.setStateForComponent(gridId)
    ComponentManager.setStateForComponent(gridId, null, {
      selectedIndexes: []
    })
    GridManager.reloadGridData(gridId)
  }

  getOrgUnitName = () => {
    if (this.props.selectedObjects) {
      this.props.selectedObjects.forEach(grid => {
        if (grid.gridType === 'SVAROG_ORG_UNITS' && grid.row && grid.row['SVAROG_ORG_UNITS.NAME']) {
          this.setState({ currentOrgUnitName: grid.row['SVAROG_ORG_UNITS.NAME'], currentOrgUnitType: grid.row['SVAROG_ORG_UNITS.ORG_UNIT_TYPE'] })
        } else if (grid.gridType === 'HOLDING' && grid.row && grid.row['HOLDING.PIC']) {
          this.setState({ currentOrgUnitName: grid.row['HOLDING.PIC'] })
        }
      })
    }
  }

  closeHoldingPopup = () => {
    this.setState({ showHoldingPopup: false })
    ComponentManager.cleanComponentReducerState(this.state.gridToDisplay)
  }

  transitionToPopup = () => {
    const { destination } = this.state
    if (strcmp(destination, 'community')) {
      this.setState({ gridToDisplay: 'SVAROG_ORG_UNITS', popup: true, showHoldingPopup: false, gridTypeCall: 'GET_VALID_ORG_UNITS' })
    } else if (strcmp(destination, 'holding')) {
      this.setState({ gridToDisplay: 'HOLDING', showHoldingPopup: true, popup: false })
    }
  }

  handleDestination = e => {
    this.setState({ destination: e.target.value }, () => this.displayDestinationSelectionAlert())
  }

  displayDestinationSelectionAlert = () => {
    const promptLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.alert.move_selected_items_arrival_place_prompt`,
      defaultMessage: `${config.labelBasePath}.alert.move_selected_items_arrival_place_prompt`
    })
    const continueLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.forms.continue`,
      defaultMessage: `${config.labelBasePath}.main.forms.continue`
    })
    const cancelLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.forms.cancel`,
      defaultMessage: `${config.labelBasePath}.main.forms.cancel`
    })

    let wrapper = document.createElement('div')
    ReactDOM.render(
      <div style={{ marginLeft: '12px' }}>
        <label htmlFor='selectedDestination' style={{ padding: '0.9rem 2px' }}>
          {this.context.intl.formatMessage(
            {
              id: config.labelBasePath + '.form_labels.subject_to',
              defaultMessage: config.labelBasePath + '.form_labels.subject_to'
            }
          )}:
        </label>
        <select
          name='selectedDestination'
          id='selectedDestination'
          value={this.state.destination}
          className={consoleStyle.campaignDropdown}
          style={{ marginLeft: '1rem' }}
          onChange={this.handleDestination}
        >
          <option key='community' value='community'>
            {this.context.intl.formatMessage(
              {
                id: config.labelBasePath + '.grid_labels.holding.commun_code',
                defaultMessage: config.labelBasePath + '.grid_labels.holding.commun_code'
              }
            )}
          </option>
          <option key='holding' value='holding'>
            {this.context.intl.formatMessage(
              {
                id: config.labelBasePath + '.main.holding',
                defaultMessage: config.labelBasePath + '.main.holding'
              }
            )}
          </option>
        </select>
      </div>,
      wrapper
    )
    alertUser(
      true, 'info', promptLabel, '', () => this.transitionToPopup(), () => { },
      true, continueLabel, cancelLabel, true, null, true, wrapper
    )
  }

  searchOrgUnit = () => {
    if (!isValidArray(this.props.selectedGridRows, 1)) {
      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.empty_selection`,
            defaultMessage: `${config.labelBasePath}.alert.empty_selection`
          }), null,
          () => this.setState({ alert: alertUser(false, 'info', '') })
        )
      })
    } else if (this.props.selectedGridRows.length > 100) {
      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.max_inventory_items_number_is_100`,
            defaultMessage: `${config.labelBasePath}.alert.max_inventory_items_number_is_100`
          }), null,
          () => this.setState({ alert: alertUser(false, 'info', '') })
        )
      })
    } else {
      if (strcmp(this.state.currentOrgUnitType, 'MUNICIPALITY_OFFICE')) {
        this.displayDestinationSelectionAlert()
      } else {
        this.setState({ popup: true, showHoldingPopup: false })
      }
    }
  }

  close = () => {
    this.setState({ popup: false })
    ComponentManager.cleanComponentReducerState(`${this.state.gridToDisplay}_${this.state.gridTypeCall}`)
  }

  moveItemsToOrgUnit = () => {
    let selectedObjects = this.props.selectedObjects
    function prompt (component, onConfirmCallback) {
      component.setState({
        alert: alertUser(
          true,
          'warning',
          component.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.move_selected_inventory_items_to_org_unit_prompt`,
            defaultMessage: `${config.labelBasePath}.main.move_selected_inventory_items_to_org_unit_prompt`
          }),
          null,
          () => {
            onConfirmCallback()
            component.close()
          },
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
    selectedObjects.map(singleObj => {
      const { gridToDisplay, gridTypeCall } = this.state
      if (singleObj.active && this.props.selectedGridRows.length > 0) {
        let chosenOrgUnitObjectId
        if (this.state.gridToDisplay === 'HOLDING') {
          chosenOrgUnitObjectId = store.getState()[gridToDisplay].rowClicked['HOLDING.OBJECT_ID']
        } else {
          chosenOrgUnitObjectId = store.getState()[`${gridToDisplay}_${gridTypeCall}`].rowClicked['SVAROG_ORG_UNITS.OBJECT_ID']
        }
        prompt(this, () => {
          this.props.moveToOrgUnitAction(
            this.props.svSession,
            this.props.selectedObject,
            chosenOrgUnitObjectId,
            this.props.selectedGridRows
          )
        })
      }
    })
  }

  render () {
    let component = null
    let externalId = null
    const selectedOrgUnit = this.props.selectedObjects.filter((element) => {
      return (element.active === true)
    })
    if (selectedOrgUnit[0]) {
      externalId = selectedOrgUnit[0].row['SVAROG_ORG_UNITS.EXTERNAL_ID'] || null
    }
    const holdingPopup = (
      <GridInModalLinkObjects
        loadFromParent
        linkedTable='HOLDING'
        onRowSelect={this.moveItemsToOrgUnit}
        key='HOLDING_SEARCH'
        closeModal={this.closeHoldingPopup}
        isFromMoveSelectedItemsAction
        isFromMoveItemsByRangeAction
        externalId={externalId}
      />
    )
    component = <div
      id='move_items_to_org_unit_container'
      className={styles.container}
      style={{ width: 'auto', cursor: 'pointer', marginRight: '7px', color: 'white' }}
      onClick={this.searchOrgUnit}>
      <p style={{ marginTop: '0' }}>
        {this.context.intl.formatMessage({
          id: `${config.labelBasePath}.move_items_to_org_unit`,
          defaultMessage: `${config.labelBasePath}.move_items_to_org_unit`
        })}
      </p>
      <div id='move_items_to_org_unit' style={{ left: '-6%' }} className={styles['gauge-container']}>
        <img
          id='change_status_img'
          className={style.actionImg}
          style={{ height: '45px', marginTop: '7%' }}
          src='/naits/img/massActionsIcons/exchange.png'
        />
      </div>
    </div>
    return <React.Fragment>
      {this.state.loading ? <Loading /> : null}
      {component}
      {this.state.popup && <div id='search_modal' className='modal' style={{ display: 'flex' }}>
        <div id='search_modal_content' className='modal-content'>
          <div className='modal-header' />
          <div id='search_modal_body' className='modal-body'>
            <ResultsGrid
              id={this.state.gridToDisplay + '_' + this.state.gridTypeCall}
              key='SVAROG_ORG_UNITS_SEARCH'
              gridToDisplay={this.state.gridToDisplay}
              onRowSelectProp={this.moveItemsToOrgUnit}
              gridTypeCall={this.state.gridTypeCall}
              externalId={externalId}
            />
          </div>
        </div>
        <div id='modal_close_btn' type='button' className={modalStyle.close}
          style={{
            position: 'absolute',
            right: 'calc(11% - 9px)',
            top: '44px',
            width: '32px',
            height: '32px',
            opacity: '1'
          }}
          onClick={this.close} data-dismiss='modal' />
      </div>}
      {this.state.showHoldingPopup &&
        ReactDOM.createPortal(holdingPopup, document.getElementById('app'))
      }
    </React.Fragment>
  }
}

MoveItemsToOrgUnit.contextTypes = {
  intl: PropTypes.object.isRequired
}

MoveItemsToOrgUnit.propTypes = {
  gridType: PropTypes.string.isRequired
}

const mapDispatchToProps = dispatch => ({
  updateSelectedRows: (...params) => {
    dispatch(updateSelectedRows(...params))
  },
  moveToOrgUnitAction: (...params) => {
    dispatch(moveToOrgUnitAction(...params))
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
  isLoading: state.moveToOrgUnit.loading
})

export default connect(mapStateToProps, mapDispatchToProps)(MoveItemsToOrgUnit)
