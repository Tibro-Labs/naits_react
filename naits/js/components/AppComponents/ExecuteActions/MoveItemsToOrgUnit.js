import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as config from 'config/config.js'
import style from './ExecuteActionOnSelectedRows.module.css'
import { alertUser } from 'tibro-components'
import { moveToOrgUnitAction } from 'backend/moveToOrgUnitAction'
import { store, updateSelectedRows } from 'tibro-redux'
import { formatAlertType } from 'functions/utils'
import { ComponentManager, GridManager, ResultsGrid, Loading } from 'components/ComponentsIndex'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'
import modalStyle from 'components/AppComponents/Functional/GridInModalLinkObjects.module.css'

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
      gridToDisplay: gridToDisplay,
      gridTypeCall: gridTypeCall
    }
  }

  componentWillReceiveProps (nextProps) {
    nextProps.isLoading ? this.setState({ loading: true }) : this.setState({ loading: false })
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
        })
      })
    }
  }

  reloadData = (props) => {
    const gridId = props.selectedGrid.gridId
    ComponentManager.setStateForComponent(gridId)
    ComponentManager.setStateForComponent(gridId, null, {
      selectedIndexes: []
    })
    GridManager.reloadGridData(gridId)
  }

  componentWillUnmount () {
    this.props.updateSelectedRows([], null)
    store.dispatch({ type: 'CLEAN_ACTION_STATE', payload: null })
    store.dispatch({ type: 'RESET_STANDALONE_ACTION', payload: null })
  }

  searchOrgUnit = () => {
    if (this.props.selectedGridRows.length > 0) {
      this.setState({ popup: true })
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
      if (singleObj.active && this.props.selectedGridRows.length > 0) {
        const externalId = singleObj.row['SVAROG_ORG_UNITS.EXTERNAL_ID'] || null
        let chosenOrgUnitObjectId
        if (this.state.gridToDisplay === 'HOLDING') {
          chosenOrgUnitObjectId = store.getState()[`HOLDING_${externalId}`].rowClicked['HOLDING.OBJECT_ID']
        } else {
          chosenOrgUnitObjectId = store.getState()[`${this.state.gridToDisplay}_${this.state.gridTypeCall}`].rowClicked['SVAROG_ORG_UNITS.OBJECT_ID']
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
    component = <div
      id='move_items_to_org_unit'
      className={styles.container}
      style={{ width: 'auto', cursor: 'pointer', marginRight: '7px', color: 'white' }}
      onClick={this.searchOrgUnit}>
      <p style={{ width: '15rem' }}>
        {this.context.intl.formatMessage({
          id: `${config.labelBasePath}.move_items_to_org_unit`,
          defaultMessage: `${config.labelBasePath}.move_items_to_org_unit`
        })}
      </p>
      <div id='move_items_to_org_unit' className={styles['gauge-container']}>
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
