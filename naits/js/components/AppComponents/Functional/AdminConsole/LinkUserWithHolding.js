import React from 'react'
import PropTypes from 'prop-types'
import consoleStyle from './AdminConsole.module.css'
import * as config from 'config/config'
import { GridInModalLinkObjects } from 'components/ComponentsIndex'
import { store } from 'tibro-redux'
import { alertUser } from 'tibro-components'
import { connect } from 'react-redux'
import { assignUserToLaboratory } from './admConsoleActions'

class LinkUserWithHolding extends React.Component {
  // USES SAME WS AS LINK WITH LABORATORY
  constructor (props) {
    super(props)
    this.state = {
      gridToDisplay: 'HOLDING',
      showSearchPopup: false,
      chosenValue: '',
      objectName: ''
    }
  }

  chooseItem = (params) => {
    const objId = store.getState()[this.state.gridToDisplay].rowClicked[this.state.gridToDisplay + '.OBJECT_ID']
    const objName = store.getState()[this.state.gridToDisplay].rowClicked[this.state.gridToDisplay + '.PIC']
    this.setState({ chosenValue: String(objId), objectName: String(objName) })
    this.closeModal()
  }

  showModal = () => {
    this.setState({
      showSearchPopup: true
    })
  }

  closeModal = () => {
    this.setState({
      showSearchPopup: false
    })
    document.getElementById('objId').blur()
  }

  linkObjects = (webService, actionName) => {
    let userAction = actionName.toLowerCase()
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
    const { chosenValue } = this.state
    const { svSession, selectedRows } = this.props
    if (chosenValue && selectedRows.length > 0) {
      const server = config.svConfig.restSvcBaseUrl +
        config.svConfig.triglavRestVerbs[webService]
      const params = `/${svSession}/${chosenValue}`
      const objectArray = selectedRows
      const restUrl = server + params
      prompt(this, () => {
        this.props.assignUserToLaboratory(restUrl, actionName, objectArray)
        this.setState({ chosenValue: '', objectName: '' })
      })
    }
  }

  render () {
    const { chosenValue, objectName } = this.state
    let disabled = false
    if (chosenValue === '' || this.props.selectedRows.length === 0) {
      disabled = true
    }
    return <div id='link_holding' className={consoleStyle.componentContainer}>
      <input id='objId'
        name='objId'
        type='text'
        value={objectName}
        className={consoleStyle.dropdown}
        onFocus={this.showModal}
        placeholder={this.context.intl.formatMessage({
          id: `${config.labelBasePath}.grid_labels.holding.pic`,
          defaultMessage: `${config.labelBasePath}.grid_labels.holding.pic`
        })} />
      <div
        id='link_user_and_holding'
        style={{ marginLeft: '-5px' }}
        {...disabled
          ? { className: consoleStyle.disabledButton }
          : { className: consoleStyle.conButton }
        }>
        <div id='link_holding_and_user' className={consoleStyle['gauge-conButton']}>
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.link_holding_and_users`,
            defaultMessage: `${config.labelBasePath}.link_holding_and_users`
          })}
          <div
            id='link_sublist'
            className={consoleStyle['dropdown-content']}>
            <div onClick={() =>
              this.linkObjects('ASSIGN_USER_TO_LABORATORY', 'LINK_HOLDING_AND_USER')}>
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.link_holding_and_users`,
                defaultMessage: `${config.labelBasePath}.main.link_holding_and_users`
              })}
            </div>
            <div onClick={() =>
              this.linkObjects('UNASSIGN_USER_FROM_LABORATORY', 'UNLINK_HOLDING_AND_USER')}>
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.unlink_holding_and_users`,
                defaultMessage: `${config.labelBasePath}.main.unlink_holding_and_users`
              })}
            </div>
          </div>
        </div>
      </div>
      {this.state.showSearchPopup &&
        <GridInModalLinkObjects
          loadFromParent
          linkedTable={this.state.gridToDisplay}
          onRowSelect={this.chooseItem}
          key={this.state.gridToDisplay}
          closeModal={this.closeModal}
        />
      }
    </div>
  }
}

LinkUserWithHolding.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapDispatchToProps = dispatch => ({
  assignUserToLaboratory: (...params) => {
    dispatch(assignUserToLaboratory(...params))
  }
})

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
  userAction: state.admConsoleRequests.userActionsResult,
  selectedGridRows: state.selectedGridRows
})

export default connect(mapStateToProps, mapDispatchToProps)(LinkUserWithHolding)
