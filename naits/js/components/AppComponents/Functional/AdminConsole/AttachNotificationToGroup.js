import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as config from 'config/config'
import { notificationAttachmentPostMethod } from './admConsoleActions'
import { generateUserGroupsDropdown } from './utils/generateDropdownOptions'
import consoleStyle from './AdminConsole.module.css'
import { alertUser } from 'tibro-components'
import { store } from 'tibro-redux'
import { ComponentManager, GridInModalLinkObjects } from 'components/ComponentsIndex'

class AttachNotificationToGroup extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showPopup: false,
      user: '',
      userGroups: null,
      selectedUserGroup: ''
    }
  }

  componentDidMount () {
    this.setState({
      userGroups: generateUserGroupsDropdown(
        this.props.admConsoleRequests.userGroups
      )
    })
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.admConsoleRequests.data !== nextProps.admConsoleRequests.data) {
      this.setState({ user: '', selectedUserGroup: '' })
    }
  }

  chooseGroup = (event) => {
    this.setState({ selectedUserGroup: event.target.value })
  }

  showModal = () => {
    this.setState({ showPopup: true })
  }

  closeModal = () => {
    this.setState({ showPopup: false })
    ComponentManager.cleanComponentReducerState('SVAROG_USERS')
  }

  chooseItem = () => {
    const chosenItemValue = store.getState()['SVAROG_USERS'].rowClicked['SVAROG_USERS.USER_NAME']
    if (chosenItemValue) {
      this.setState({ user: chosenItemValue })
      this.closeModal()
    }
  }

  applyNotification = (webService, actionName) => {
    const { user, selectedUserGroup } = this.state
    function prompt (component, onConfirmCallback) {
      component.setState({
        alert: alertUser(
          true,
          'warning',
          component.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.execute_action`,
            defaultMessage: `${config.labelBasePath}.actions.execute_action`
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
    const { svSession, selectedRows } = this.props
    if (user && selectedRows.length > 0) {
      const server = config.svConfig.restSvcBaseUrl +
        config.svConfig.triglavRestVerbs[webService]
      const params = `/${svSession}/${encodeURIComponent(user)}/${actionName}`
      const objectArray = selectedRows
      const restUrl = server + params
      prompt(this, () => this.props.notificationAttachmentPostMethod(restUrl, objectArray))
    } else if (selectedUserGroup && selectedRows.length > 0) {
      const server = config.svConfig.restSvcBaseUrl +
        config.svConfig.triglavRestVerbs[webService]
      const params = `/${svSession}/${selectedUserGroup}/${actionName}`
      const objectArray = selectedRows
      const restUrl = server + params
      prompt(this, () => this.props.notificationAttachmentPostMethod(restUrl, objectArray))
    }
  }

  render () {
    const { user, selectedUserGroup, userGroups } = this.state
    let disabledUser = false
    let disabledUserGroup = false
    if (!user || this.props.selectedRows.length === 0) {
      disabledUser = true
    }
    if (!selectedUserGroup || this.props.selectedRows.length === 0) {
      disabledUserGroup = true
    }
    let userComponent = <div
      id='add_or_remove_user_container'
      {...disabledUser
        ? { className: consoleStyle.disabledButton }
        : { className: consoleStyle.conButton }
      }
      style={{ marginTop: '1rem', marginLeft: '1rem' }}
    >
      <div id='add_or_remove_user' className={consoleStyle['gauge-conButton']}>
        {this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.add_or_remove_notifications_for_user`,
          defaultMessage: `${config.labelBasePath}.main.add_or_remove_notifications_for_user`
        })}
        <div
          id='create_sublist'
          className={consoleStyle['dropdown-content']}>
          <div onClick={() => this.applyNotification('ADD_NOTIFICATION_TO_GROUP', 'ASSIGN')}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.add_notifications_for_user`,
              defaultMessage: `${config.labelBasePath}.main.add_notifications_for_user`
            })}
          </div>
          <div onClick={() => this.applyNotification('ADD_NOTIFICATION_TO_GROUP', 'UNASSIGN')}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.remove_notifications_for_user`,
              defaultMessage: `${config.labelBasePath}.main.remove_notifications_for_user`
            })}
          </div>
        </div>
      </div>
    </div>
    let userGroupComponent = <div
      id='add_or_remove_user_groups_container'
      {...disabledUserGroup
        ? { className: consoleStyle.disabledButton }
        : { className: consoleStyle.conButton }
      }
      style={{ marginTop: '1rem', marginRight: '1rem' }}
    >
      <div
        id='add_or_remove_user_groups'
        className={consoleStyle['gauge-conButton']}
      >
        {this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.add_or_remove_notifications_for_group`,
          defaultMessage: `${config.labelBasePath}.main.add_or_remove_notifications_for_group`
        })}
        <div
          id='create_sublist'
          className={consoleStyle['dropdown-content']}>
          <div onClick={() => this.applyNotification('ADD_NOTIFICATION_TO_GROUP', 'ASSIGN')}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.add_notifications_for_group`,
              defaultMessage: `${config.labelBasePath}.main.add_notifications_for_group`
            })}
          </div>
          <div onClick={() => this.applyNotification('ADD_NOTIFICATION_TO_GROUP', 'UNASSIGN')}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.remove_notifications_for_group`,
              defaultMessage: `${config.labelBasePath}.main.remove_notifications_for_group`
            })}
          </div>
        </div>
      </div>
    </div>
    return (
      <div id='notificationsContainer' className={consoleStyle.componentContainer}>
        {this.state.showPopup &&
          <GridInModalLinkObjects
            loadFromParent
            linkedTable={'SVAROG_USERS'}
            onRowSelect={this.chooseItem}
            key={'SVAROG_USERS'}
            closeModal={this.closeModal}
          />
        }
        <input
          id='user'
          placeholder={this.context.intl.formatMessage(
            {
              id: config.labelBasePath + '.login.user_name',
              defaultMessage: config.labelBasePath + '.login.user_name'
            }
          )}
          value={user}
          className={`form-control ${consoleStyle.userInput}`}
          style={{ marginLeft: '1rem' }}
          onClick={this.showModal}
        />
        {userComponent}
        <div className={consoleStyle.verticalLine} />
        <select id='userGroups'
          className={consoleStyle.dropdown}
          style={{ marginTop: '1rem' }}
          onChange={this.chooseGroup}
          value={selectedUserGroup}
        >
          <option
            id='blankPlaceholder'
            key='blankPlaceholder'
            value=''
            selected disabled hidden
          >
            {this.context.intl.formatMessage(
              {
                id: config.labelBasePath + '.main.select_user_group',
                defaultMessage: config.labelBasePath + '.main.select_user_group'
              }
            )}
          </option>
          {userGroups}
        </select>
        {userGroupComponent}
      </div>
    )
  }
}

AttachNotificationToGroup.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapDispatchToProps = dispatch => ({
  notificationAttachmentPostMethod: (...params) => {
    dispatch(notificationAttachmentPostMethod(...params))
  }
})

const mapStateToProps = (state) => ({
  admConsoleRequests: state.admConsoleRequests
})

export default connect(mapStateToProps, mapDispatchToProps)(AttachNotificationToGroup)
