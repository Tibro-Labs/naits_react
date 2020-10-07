import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as config from 'config/config.js'
import style from './ExecuteActionOnSelectedRows.module.css'
import { store } from 'tibro-redux'
import { alertUser } from 'tibro-components'
import { formatAlertType } from 'functions/utils'
import { executeActionOnSelectedRows } from 'backend/executeActionOnSelectedRows.js'

class UndoAnimalRetirement extends React.Component {
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
        alert: alertUser(true, formatAlertType(nextProps.massActionResult), this.context.intl.formatMessage({
          id: nextProps.massActionResult,
          defaultMessage: nextProps.massActionResult
        }) || ' ', null,
        () => {
          store.dispatch({ type: 'CLEAN_ACTION_STATE', payload: null })
        })
      })
    }
  }

  executeAction = (actionName, subActionName) => {
    store.dispatch({ type: 'CLEAN_ACTION_STATE', payload: null })
    function prompt (component, onConfirmCallback) {
      component.setState({
        alert: alertUser(
          true,
          'warning',
          component.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.prompt_text`,
            defaultMessage: `${config.labelBasePath}.actions.prompt_text`
          }) + ' ' + '"' +
          component.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.undo_retire`,
            defaultMessage: `${config.labelBasePath}.actions.undo_retire`
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

    this.props.selectedObjects.forEach(grid => {
      if (grid.active) {
        const objectArray = Array(grid.row)
        prompt(this, () => this.props.executeActionOnSelectedRows(
          this.props.svSession, this.props.gridType, 'EXECUTE_ACTION_ON_ROWS', actionName, subActionName,
          objectArray, 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null'
        ))
      }
    })
  }

  render () {
    const { gridType, selectedObjects } = this.props
    let component = null
    let type = gridType.toLowerCase()
    // double active flag hack
    if (gridType) {
      selectedObjects.forEach(grid => {
        const isActive = grid.active
        const status = grid.row[gridType + '.STATUS']
        if (isActive && status && status !== 'VALID') {
          component = <div
            id='undo_retire'
            className={style.menuActivator}
            onClick={() => this.executeAction('undo-retire', 'null')}>
            {this.state.alert}
            <span id='undo_text' className={style.actionText}>
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.actions.undo_${type}_retire`,
                defaultMessage: `${config.labelBasePath}.actions.undo_${type}_retire`
              })}
            </span>
            <img id='move_img' className={style.actionImg}
              src='/naits/img/massActionsIcons/undo.png' />
          </div>
        }
      })
    }
    return component
  }
}

UndoAnimalRetirement.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapDispatchToProps = dispatch => ({
  executeActionOnSelectedRows: (...params) => {
    dispatch(executeActionOnSelectedRows(...params))
  }
})

UndoAnimalRetirement.propTypes = {
  gridType: PropTypes.string.isRequired
}

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
  selectedObjects: state.gridConfig.gridHierarchy,
  massActionResult: state.massActionResult.result
})

export default connect(mapStateToProps, mapDispatchToProps)(UndoAnimalRetirement)
