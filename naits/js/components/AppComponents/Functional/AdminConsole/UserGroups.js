import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import axios from 'axios'
import * as config from 'config/config'
import { userAttachmentPostMethod } from './admConsoleActions'
import consoleStyle from './AdminConsole.module.css'
import { alertUser, Select } from 'tibro-components'

class UserGroups extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: null,
      userGroups: [],
      selectedUserGroup: null
    }
  }

  componentDidMount () {
    // Get all the user groups
    this.getAllUserGroups()
    // Change the style of the user groups dropdown
    this.changeSelectWrapperStyle()
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.displayGrid !== nextProps.displayGrid) {
      this.setState({ selectedUserGroup: null })
    }

    if (this.props.admConsoleRequests.data !== nextProps.admConsoleRequests.data) {
      this.setState({ selectedUserGroup: null })
    }
  }

  getAllUserGroups = async () => {
    let server = config.svConfig.restSvcBaseUrl
    let verbPath = config.svConfig.triglavRestVerbs.BASE_DATA
    let restUrl = `${server}${verbPath}`
    restUrl = restUrl.replace('%session', this.props.svSession)
    restUrl = restUrl.replace('%gridName', 'SVAROG_USER_GROUPS')

    try {
      const res = await axios.get(restUrl)
      let userGroups = []
      res.data.forEach(userGroup => userGroups.push({
        value: userGroup['SVAROG_USER_GROUPS.GROUP_NAME'],
        label: userGroup['SVAROG_USER_GROUPS.GROUP_NAME']
      }))
      this.setState({ userGroups })
    } catch (err) {
      this.setState({
        alert: alertUser(
          true,
          'error',
          this.context.intl.formatMessage({
            id: err,
            defaultMessage: err
          }),
          null,
          () => {
            this.setState({ alert: false })
          }
        )
      })
    }
  }

  chooseGroup = (selectedUserGroup) => {
    this.setState({ selectedUserGroup })
  }

  applyUserGroup = (webService, actionName) => {
    let userGroups = actionName.toLowerCase()
    function prompt (component, onConfirmCallback) {
      component.setState({
        alert: alertUser(
          true,
          'warning',
          component.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.execute_action_${userGroups}`,
            defaultMessage: `${config.labelBasePath}.actions.execute_action_${userGroups}`
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
    const { selectedUserGroup } = this.state
    const { svSession, selectedRows } = this.props
    if (selectedUserGroup.value && selectedRows.length > 0) {
      const server = config.svConfig.restSvcBaseUrl +
        config.svConfig.triglavRestVerbs[webService]
      const params = `/${svSession}/${selectedUserGroup.value}`
      const objectArray = selectedRows
      const restUrl = server + params
      prompt(this, () => this.props.userAttachmentPostMethod(restUrl, actionName, objectArray))
    }
  }

  changeSelectWrapperStyle = () => {
    const selectWrapper = document.getElementsByClassName('Select-multi-value-wrapper')
    selectWrapper[1].style.marginRight = '2.7rem'
  }

  render () {
    let disabled = false
    let component = null
    if (!this.state.selectedUserGroup || this.props.selectedRows.length === 0) {
      disabled = true
    }
    component = <div
      id='add_or_remove_user_groups'
      {...disabled
        ? { className: consoleStyle.disabledButton }
        : { className: consoleStyle.conButton }
      }>
      <div id='add_or_remove_user_groups' className={consoleStyle['gauge-conButton']}>
        {this.context.intl.formatMessage({
          id: `${config.labelBasePath}.add_or_remove_user_groups`,
          defaultMessage: `${config.labelBasePath}.add_or_remove_user_groups`
        })}
        <div
          id='create_sublist'
          className={consoleStyle['dropdown-content']}>
          <div onClick={() => this.applyUserGroup('ADD_USERS_TO_GROUP', 'ADD_GROUP')}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.add_users_to_group`,
              defaultMessage: `${config.labelBasePath}.main.add_users_to_group`
            })}
          </div>
          <div onClick={() => this.applyUserGroup('REMOVE_USERS_FROM_GROUP', 'REMOVE_GROUP')}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.remove_users_from_group`,
              defaultMessage: `${config.labelBasePath}.main.remove_users_from_group`
            })}
          </div>
        </div>
      </div>
    </div>
    return (
      <div id='groupsContainer' className={consoleStyle.componentContainer}>
        <Select
          className={consoleStyle.CustomMultiSelectDropdown}
          removeSelected
          onChange={this.chooseGroup}
          options={this.state.userGroups}
          value={this.state.selectedUserGroup}
          noResultsText={this.context.intl.formatMessage(
            {
              id: config.labelBasePath + '.main.no_user_group_found',
              defaultMessage: config.labelBasePath + '.main.no_user_group_found'
            }
          )}
          placeholder={
            this.context.intl.formatMessage(
              {
                id: config.labelBasePath + '.main.select_user_group',
                defaultMessage: config.labelBasePath + '.main.select_user_group'
              }
            )
          }
        />
        {component}
      </div>
    )
  }
}

UserGroups.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapDispatchToProps = dispatch => ({
  userAttachmentPostMethod: (...params) => {
    dispatch(userAttachmentPostMethod(...params))
  }
})

const mapStateToProps = (state) => ({
  admConsoleRequests: state.admConsoleRequests
})

export default connect(mapStateToProps, mapDispatchToProps)(UserGroups)
