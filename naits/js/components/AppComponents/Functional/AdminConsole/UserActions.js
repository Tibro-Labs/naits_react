import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import consoleStyle from './AdminConsole.module.css'
import * as config from 'config/config'
import { store } from 'tibro-redux'
import { massUserAction, resetUser } from './admConsoleActions.js'
import { alertUser } from 'tibro-components'
import { connect } from 'react-redux'
import { formatAlertType } from 'functions/utils'
import { ComponentManager, GridManager } from 'components/ComponentsIndex'

class UserActions extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: null
    }
  }

  componentWillReceiveProps (nextProps) {
    if ((this.props.userAction !== nextProps.userAction) &&
      nextProps.userAction) {
      this.setState({
        alert: alertUser(true, formatAlertType(nextProps.userAction), this.context.intl.formatMessage({
          id: nextProps.userAction,
          defaultMessage: nextProps.userAction
        }) || ' ', null,
        () => {
          store.dispatch(resetUser())
        })
      })
      this.reloadData(nextProps)
    }
  }

  reloadData = (props) => {
    let selectedGridRows = this.props.selectedGridRows
    let gridId = selectedGridRows.gridId
    ComponentManager.setStateForComponent(gridId, 'selectedIndexes', [])
    GridManager.reloadGridData(gridId)
  }

  actionPrompt = (actionName, subActionName) => {
    // create an input element in current document
    let wrapper = document.createElement('div')
    ReactDOM.render(
      <input id='alertInput' type='text' className='form-control' />, wrapper
    )
    let element = wrapper.firstChild
    // enter suspension reason
    this.setState({alert: alertUser(
      true, 'info', this.context.intl.formatMessage({
        id: `${config.labelBasePath}.main.user_suspend_reason`,
        defaultMessage: `${config.labelBasePath}.main.user_suspend_reason`
      }),
      null,
      () => {
        // get user input note and execute action
        let note = document.getElementById('alertInput').value
        note = note.replace(/[^a-zA-Z0-9\s]/gi, '')
        this.executeAction(actionName, subActionName, note)
      },
      true, true,
      this.context.intl.formatMessage({
        id: `${config.labelBasePath}.main.suspend_user`,
        defaultMessage: `${config.labelBasePath}.main.suspend_user`
      }),
      this.context.intl.formatMessage({
        id: `${config.labelBasePath}.main.forms.cancel`,
        defaultMessage: `${config.labelBasePath}.main.forms.cancel`
      }), true, null, false, element
    )})
  }

  executeAction = (actionName, subActionName, promptMessage, actionText) => {
    let userAction = subActionName.toLowerCase()
    function prompt (component, onConfirmCallback) {
      component.setState({
        alert: alertUser(
          true,
          'warning',
          component.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.execute_action_${userAction}`,
            defaultMessage: `${config.labelBasePath}.actions.execute_action_${userAction}`
          }),
          null,
          onConfirmCallback,
          () => component.setState({alert: alertUser(false, 'info', '')}),
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
    const { svSession, selectedRows } = this.props
    if (selectedRows && selectedRows.length > 0) {
      const note = promptMessage || 'null'
      const objectArray = selectedRows
      prompt(this, () => this.props.massUserAction(svSession, actionName, subActionName, note, objectArray))
    }
  }

  render () {
    let disabled = false
    let component = null
    if (this.props.selectedRows.length === 0) {
      disabled = true
    }

    component = <div
      id='change_the_status_of_user'
      {...disabled
        ? {className: consoleStyle.disabledButton}
        : {className: consoleStyle.conButton}
      }>
      <div id='change_the_status_of_user' className={consoleStyle['gauge-conButton']}>
        {this.context.intl.formatMessage({
          id: `${config.labelBasePath}.change_the_status_of_user`,
          defaultMessage: `${config.labelBasePath}.change_the_status_of_user`
        })}
        <div
          id='create_sublist'
          className={consoleStyle['dropdown-content']}>
          <div onClick={() => this.executeAction('CHANGE_STATUS', 'INACTIVE')}>{this.context.intl.formatMessage({ id: `${config.labelBasePath}.main.inactivate_user`, defaultMessage: `${config.labelBasePath}.main.inactivate_user` })}</div>
          <div onClick={() => this.executeAction('CHANGE_STATUS', 'VALID')}> {this.context.intl.formatMessage({ id: `${config.labelBasePath}.main.validate_user`, defaultMessage: `${config.labelBasePath}.main.validate_user` })}</div>
          <div onClick={() => this.actionPrompt('CHANGE_STATUS', 'SUSPENDED')}> {this.context.intl.formatMessage({ id: `${config.labelBasePath}.main.suspend_user`, defaultMessage: `${config.labelBasePath}.main.suspend_user` })}</div>
        </div>
      </div>
    </div>
    return (
      <div id='usrActions' className={consoleStyle.componentContainer}>
        <button id='resetUserPassword'
          {...disabled
            ? {className: consoleStyle.disabledButton}
            : {className: consoleStyle.conButton}
          }
          onClick={() => this.executeAction('RESET_PASS', 'null')}
        >
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.reset_password`,
            defaultMessage: `${config.labelBasePath}.main.reset_password`
          })}
        </button>
        {component}
      </div>
    )
  }
}

UserActions.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapDispatchToProps = dispatch => ({
  massUserAction: (...params) => {
    dispatch(massUserAction(...params))
  }
})

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
  userAction: state.admConsoleRequests.userActionsResult,
  selectedGridRows: state.selectedGridRows
})

export default connect(mapStateToProps, mapDispatchToProps)(UserActions)
