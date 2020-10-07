import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as config from 'config/config.js'
import style from './ExecuteActionOnSelectedRows.module.css'
import { alertUser } from 'tibro-components'
import { resetObject, exportCertifiedAnimals } from 'backend/exportCertifiedAnimalsAction'
import { store, updateSelectedRows } from 'tibro-redux'
import { formatAlertType } from 'functions/utils'
import { ComponentManager, GridManager } from 'components/ComponentsIndex'
// import createHashHistory from 'history/createHashHistory'
// const hashHistory = createHashHistory()

class ExportCertifiedAnimals extends React.Component {
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
        alert: alertUser(true, 'info', nextProps.massActionResult || '', null,
          () => {
            store.dispatch({ type: 'CLEAN_ACTION_STATE', payload: null })
            this.setState({ alert: alertUser(false, 'info', '') })
          })
      })
    }
    if ((this.props.exportResult !== nextProps.exportResult) &&
      nextProps.exportResult) {
      this.setState({
        alert: alertUser(true, formatAlertType(nextProps.exportResult), this.context.intl.formatMessage({
          id: nextProps.exportResult,
          defaultMessage: nextProps.exportResult
        }) || ' ', null,
        () => {
          store.dispatch(resetObject())
        })
      })
      this.reloadData(nextProps)
    }
  }

  reloadData = (props) => {
    let gridId = 'ANIMAL'
    let showGrid, parentId, gridType
    if (this.props.selectedObjects.length > 0) {
      for (let i = 0; i < this.props.selectedObjects.length; i++) {
        gridType = this.props.selectedObjects[i].gridType
        parentId = this.props.selectedObjects[i].row['EXPORT_CERT.OBJECT_ID']
        showGrid = gridId + '_' + parentId + '_' + gridId + '_' + gridType
      }
      ComponentManager.setStateForComponent(showGrid)
      GridManager.reloadGridData(showGrid)
    }
  }

  exportCertifiedAnimals = (session, objectId) => {
    let gridType = this.props.gridType
    let selectedObjects = this.props.selectedObjects
    function prompt (component, onConfirmCallback) {
      component.setState({
        alert: alertUser(
          true,
          'warning',
          component.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.prompt_text`,
            defaultMessage: `${config.labelBasePath}.actions.prompt_text`
          }) + ' ' + '"' + component.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.export_certified_animals`,
            defaultMessage: `${config.labelBasePath}.actions.export_certified_animals`
          }) + '"' + '?',
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
    if (this.props.selectedGridRows && this.props.selectedGridRows.length > 0) {
      for (let i = 0; i < selectedObjects.length; i++) {
        gridType = this.props.selectedObjects[i].gridType
        let objectId = this.props.selectedObjects[i].row[`${gridType}.OBJECT_ID`]
        if (selectedObjects[i].active && objectId) {
          prompt(this, () => this.props.exportCertifiedAnimals(this.props.svSession, this.props.selectedGridRows, objectId))
        }
      }
    } else {
      this.setState({
        alert: alertUser(true, 'info',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.export_certified_check`,
            defaultMessage: `${config.labelBasePath}.alert.export_certified_check`
          }), null,
          () => this.setState({ alert: alertUser(false, 'info', '') })
        )
      })
    }
  }

  componentWillUnmount () {
    this.props.updateSelectedRows([], null)
    store.dispatch({ type: 'CLEAN_ACTION_STATE', payload: null })
  }

  render () {
    const { gridType, selectedObjects } = this.props
    let component = null
    if (gridType) {
      for (let i = 0; i < selectedObjects.length; i++) {
        const isActive = selectedObjects[i].active
        if (isActive) {
          component = <div
            id='export_certified_animals'
            className={style.menuActivator}
            onClick={() => this.exportCertifiedAnimals()}>
            {this.state.alert}
            <span id='selected_object_text' className={style.actionText}>
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.actions.export_certified_animals`,
                defaultMessage: `${config.labelBasePath}.actions.export_certified_animals`
              })}
            </span>
            <img id='move_img' className={style.actionImg}
              src='/naits/img/massActionsIcons/process.png' />
          </div>
        }
      }
    }
    return component
  }
}

ExportCertifiedAnimals.contextTypes = {
  intl: PropTypes.object.isRequired
}

ExportCertifiedAnimals.propTypes = {
  gridType: PropTypes.string.isRequired
}

const mapDispatchToProps = dispatch => ({
  updateSelectedRows: (...params) => {
    dispatch(updateSelectedRows(...params))
  },
  exportCertifiedAnimals: (...params) => {
    dispatch(exportCertifiedAnimals(...params))
  }
})

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
  exportResult: state.exportCertifiedAnimals.result,
  massActionResult: state.massActionResult.result,
  selectedObjects: state.gridConfig.gridHierarchy,
  selectedGridRows: state.selectedGridRows.selectedGridRows
})

export default connect(mapStateToProps, mapDispatchToProps)(ExportCertifiedAnimals)
