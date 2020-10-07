import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import axios from 'axios'
import * as config from 'config/config'
import { assignOrUnasignPackagePermissionOnUserOrGroup } from './admConsoleActions'
import consoleStyle from './AdminConsole.module.css'
import { alertUser, Select } from 'tibro-components'

class Permissions extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      permissions: null,
      permissionPackages: []
    }
  }

  componentDidMount () {
    // Get all the available permissions
    this.getAvailablePermissions()
    // Change the style of the permissions dropdown
    this.changeSelectWrapperStyle()
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.displayGrid !== nextProps.displayGrid) {
      this.setState({ permissions: null })
    }

    if (this.props.admConsoleRequests.data !== nextProps.admConsoleRequests.data) {
      this.setState({ permissions: null })
    }
  }

  getAvailablePermissions = async () => {
    let server = config.svConfig.restSvcBaseUrl
    let verbPath = config.svConfig.triglavRestVerbs.GET_DYNAMIC_DROPDOWN_OPTIONS
    let restUrl = `${server}${verbPath}/${this.props.svSession}/USER_PACKAGE_PERMISSIONS`

    try {
      const res = await axios.get(restUrl)
      let resString = res.data.replace('[', '')
      resString = resString.replace(']', '')
      const resList = resString.split(', ')
      // Generate permission options objects
      let permissionPackages = []
      if (resList && resList.constructor === Array && resList.length > 0) {
        resList.forEach(permission => permissionPackages.push({
          value: permission,
          label: permission
        }))
      }
      this.setState({ permissionPackages })
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

  choosePermission = (selectedPermission) => {
    this.setState({ permissions: selectedPermission })
  }

  applyPermission = (type) => {
    const { permissions } = this.state
    const { svSession, selectedRows } = this.props
    function prompt (component, onConfirmCallback) {
      component.setState({
        alert: alertUser(
          true,
          'warning',
          component.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.apply_permission`,
            defaultMessage: `${config.labelBasePath}.actions.apply_permission`
          }) + ' ' + component.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.select_user`,
            defaultMessage: `${config.labelBasePath}.actions.select_user`
          }) + '?',
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
    if (permissions && selectedRows.length > 0) {
      let permissionValues = []
      permissions.forEach(permission => permissionValues.push(permission.value))
      const server = config.svConfig.restSvcBaseUrl
      let verbPath = config.svConfig.triglavRestVerbs.ATTACH_PERMISSION_ONTO_USER_OR_GROUP
      let params = `/${svSession}/${permissionValues}/${type}`
      let url = `${server}${verbPath}${params}`
      prompt(this, () => this.props.assignOrUnasignPackagePermissionOnUserOrGroup(url, selectedRows))
    }
  }

  changeSelectWrapperStyle = () => {
    const selectWrapper = document.getElementsByClassName('Select-multi-value-wrapper')
    selectWrapper[0].style.marginRight = '6rem'
  }

  render () {
    let disabled = false
    if ((!this.state.permissions || this.state.permissions.length === 0) || this.props.selectedRows.length === 0) {
      disabled = true
    }
    return (
      <div id='permissionsContainer' className={consoleStyle.componentContainer}>
        <Select
          className={consoleStyle.CustomMultiSelectDropdown}
          multi
          removeSelected
          onChange={this.choosePermission}
          options={this.state.permissionPackages}
          value={this.state.permissions}
          noResultsText={this.context.intl.formatMessage(
            {
              id: config.labelBasePath + '.main.no_package_found',
              defaultMessage: config.labelBasePath + '.main.no_package_found'
            }
          )}
          placeholder={
            this.context.intl.formatMessage(
              {
                id: config.labelBasePath + '.main.select_permission_pkgs',
                defaultMessage: config.labelBasePath + '.main.select_permission_pkgs'
              }
            )
          }
        />
        <div
          id='attachPermisison'
          {...disabled
            ? { className: consoleStyle.disabledButton }
            : { className: consoleStyle.conButton }
          }>
          <div className={consoleStyle['gauge-conButton']}>
            {this.context.intl.formatMessage(
              {
                id: `${config.labelBasePath}.main.apply_permission`,
                defaultMessage: `${config.labelBasePath}.main.apply_permission`
              }
            )}
            <div
              id='create_sublist'
              className={consoleStyle['dropdown-content']}>
              <div onClick={() => this.applyPermission('ASSIGN')}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.assign_permission`,
                  defaultMessage: `${config.labelBasePath}.main.assign_permission`
                })}
              </div>
              <div onClick={() => this.applyPermission('UNASSIGN')}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.unassign_permission`,
                  defaultMessage: `${config.labelBasePath}.main.unassign_permission`
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Permissions.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  admConsoleRequests: state.admConsoleRequests
})

const mapDispatchToProps = dispatch => ({
  assignOrUnasignPackagePermissionOnUserOrGroup: (...params) => {
    dispatch(assignOrUnasignPackagePermissionOnUserOrGroup(...params))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Permissions)
