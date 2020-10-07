import React from 'react'
import PropTypes from 'prop-types'
import consoleStyle from './AdminConsole.module.css'
import * as config from 'config/config'
import { alertUser } from 'tibro-components'
import { store } from 'tibro-redux'
import { connect } from 'react-redux'
import { ComponentManager, GridManager, GridInModalLinkObjects } from 'components/ComponentsIndex'
import { assignUserToLaboratory } from './admConsoleActions'

class AssigneLaborantToLaboratories extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: null,
      showSearchPopup: false,
      gridToDisplay: 'LABORATORY',
      labObjId: '',
      labName: ''
    }
  }

  reloadData = (props) => {
    let selectedGridRows = this.props.selectedGridRows
    let gridId = selectedGridRows.gridId
    ComponentManager.setStateForComponent(gridId, 'selectedIndexes', [])
    GridManager.reloadGridData(gridId)
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
    document.getElementById('labObjId').blur()
  }

  chooseItem = () => {
    const labObjId = store.getState()[this.state.gridToDisplay].rowClicked[this.state.gridToDisplay + '.OBJECT_ID']
    const labName = store.getState()[this.state.gridToDisplay].rowClicked[this.state.gridToDisplay + '.LAB_NAME']
    this.setState({ labObjId: String(labObjId), labName: String(labName) })
    this.closeModal()
  }

  applyUserGroup = (webService, actionName) => {
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
    const { labObjId } = this.state
    const { svSession, selectedRows } = this.props
    if (labObjId && selectedRows.length > 0) {
      const server = config.svConfig.restSvcBaseUrl +
        config.svConfig.triglavRestVerbs[webService]
      const params = `/${svSession}/${labObjId}`
      const objectArray = selectedRows
      const restUrl = server + params
      prompt(this, () => {
        this.props.assignUserToLaboratory(restUrl, actionName, objectArray)
        this.setState({ labObjId: '', labName: '' })
      })
    }
  }

  render () {
    let disabled = false
    let component = null
    if (!this.state.labObjId || this.props.selectedRows.length === 0) {
      disabled = true
    }
    component = <div
      id='add_or_remove_laboratory'
      style={{ marginLeft: '-5px' }}
      {...disabled
        ? { className: consoleStyle.disabledButton }
        : { className: consoleStyle.conButton }
      }>
      <div id='assign_or_unassigne_laboratory' className={consoleStyle['gauge-conButton']}>
        {this.context.intl.formatMessage({
          id: `${config.labelBasePath}.assign_or_unassigne_laboratory`,
          defaultMessage: `${config.labelBasePath}.assign_or_unassigne_laboratory`
        })}
        <div
          id='create_sublist'
          className={consoleStyle['dropdown-content']}>
          <div
            onClick={() => this.applyUserGroup('ASSIGN_USER_TO_LABORATORY', 'ADD_LABORATORY')}
          >
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.asignee_user_to_laboratory`,
              defaultMessage: `${config.labelBasePath}.main.asignee_user_to_laboratory`
            })}
          </div>
          <div
            onClick={() => this.applyUserGroup('UNASSIGN_USER_FROM_LABORATORY', 'REMOVE_LABORATORY')}
          >
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.unAssigne_user_from_laboratory`,
              defaultMessage: `${config.labelBasePath}.main.unAssigne_user_from_laboratory`
            })}
          </div>
        </div>
      </div>
    </div>
    return (
      <div id='laboratoryContainer' className={consoleStyle.componentContainer}>
        <input
          id='labObjId'
          name='labObjId'
          type='text'
          value={this.state.labName}
          className={consoleStyle.dropdown}
          onClick={this.showModal}
          placeholder={
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.select_laboratory`,
              defaultMessage: `${config.labelBasePath}.main.select_laboratory`
            })
          }
        />
        {component}
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
    )
  }
}

AssigneLaborantToLaboratories.contextTypes = {
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
  selectedGridRows: state.selectedGridRows,
  getUserGroups: state.userInfoReducer.getUsers,
  admConsoleRequests: state.admConsoleRequests
})

export default connect(mapStateToProps, mapDispatchToProps)(AssigneLaborantToLaboratories)
