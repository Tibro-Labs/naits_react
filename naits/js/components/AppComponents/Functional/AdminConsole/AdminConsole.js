import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { store, updateSelectedRows } from 'tibro-redux'
import { ComponentManager, MainContent, GridManager, Loading } from 'components/ComponentsIndex'
import Permissions from './Permissions'
import UserGroups from './UserGroups'
import UserActions from './UserActions'
import UserOrgUnits from './UserOrgUnits'
import AssigneLaborantToLaboratories from './AssigneLaborantToLaboratories'
import LinkUserWithHolding from './LinkUserWithHolding'
import DeleteAnimal from './DeleteAnimal'
import RegistrationForm from './RegistrationForm'
import AttachNotificationToGroup from './AttachNotificationToGroup'
import * as config from 'config/config'
import style from 'containers/MainNavigation.module.css'
import { resetConsoleReducerState, fetchUserGroups } from './admConsoleActions'
import createHashHistory from 'history/createHashHistory'
import sideMenuStyle from 'modulesCSS/SideMenu.module.css'
import consoleStyle from './AdminConsole.module.css'
import ResponseHandler from './ResponseHandler'

const hashHistory = createHashHistory()

const items = [
  {
    id: 'consoleGroups',
    objectType: 'SVAROG_USER_GROUPS',
    labelCode: config.labelBasePath + '.main.user_groups',
    enablePermission: true,
    enableOrgUnitsMenu: true,
    enableNextMenu: true
  }, {
    id: 'consoleUsers',
    objectType: 'SVAROG_USERS',
    labelCode: config.labelBasePath + '.main.users',
    enablePermission: true,
    enableUserGroups: true,
    enableUserAction: true,
    enableNextMenu: true,
    enableOrgUnitsMenu: true,
    enableAsigneeToLab: true,
    enableHoldingLink: true
  },
  {
    /* New edit form */
    id: 'consoleSvarogLabels',
    objectType: 'SVAROG_LABELS',
    labelCode: config.labelBasePath + '.main.svarog_labels',
    enableNextMenu: false,
    enableEditForm: true,
    parentId: 'localeObjId'
  },
  {
    id: 'consoleUserOrgUnits',
    objectType: 'SVAROG_ORG_UNITS',
    labelCode: config.labelBasePath + '.main.org_units',
    enableEditForm: true,
    enableInsertNewRow: true
  },
  {
    id: 'consoleSvarogCodes',
    objectType: 'SVAROG_CODES',
    labelCode: config.labelBasePath + '.main.svarog_codes',
    enableNextMenu: true,
    enableEditForm: false
  },
  {
    id: 'consoleLaboratory',
    objectType: 'LABORATORY',
    labelCode: config.labelBasePath + '.main.laboratory',
    enableEditForm: true
  },
  {
    id: 'consoleLaboratoryTestType',
    objectType: 'LAB_TEST_TYPE',
    labelCode: config.labelBasePath + '.main.test_type',
    enableEditForm: true
  },
  {
    id: 'consoleNotifications',
    objectType: 'SVAROG_NOTIFICATION',
    labelCode: config.labelBasePath + '.main.notifications',
    enableEditForm: false,
    enableNextMenu: true,
    enableNotificationGroups: true
  }
]

/** Admin console module - allows editing of system tables such as users
  * and groups for authorized users.
  * KNI 04.10.2018
*/

class AdminConsole extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      activeItem: null,
      displayGrid: null,
      displayAnimalRemovalForm: null,
      alert: null,
      enablePermission: false,
      enableUserGroups: false,
      enableUserAction: false,
      enableOrgUnitsMenu: false,
      enableAsigneeToLab: false,
      enableHoldingLink: false,
      enableNotificationGroups: false,
      enableNextMenu: true,
      enableEditForm: false,
      parentId: null,
      enableInsertNewRow: false
    }
    this.gridConfig = {
      SIZE: {
        HEIGHT: window.innerHeight - 300,
        WIDTH: '100%'
      }
    }
  }

  componentWillMount () {
    let server = config.svConfig.restSvcBaseUrl
    let verbPath = config.svConfig.triglavRestVerbs.BASE_DATA
    let restUrl = `${server}${verbPath}`
    restUrl = restUrl.replace('%session', this.props.svSession)
    restUrl = restUrl.replace('%gridName', 'SVAROG_USER_GROUPS')
    store.dispatch(fetchUserGroups(restUrl))
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.displayGrid !== prevState.displayGrid) {
      ComponentManager.cleanComponentReducerState(prevState.displayGrid)
    }
  }

  componentWillUnmount () {
    /* We need to clear the store of the selected indexes when the component is
    unmounted */
    store.dispatch(updateSelectedRows([], null))
    ComponentManager.cleanComponentReducerState(this.state.displayGrid)
  }

  onAlertClose = () => {
    // Reset console reducer state
    store.dispatch(
      resetConsoleReducerState('RESET_CONSOLE_REDUCER_STATE')
    )
    // Reload data in current grid
    store.dispatch(updateSelectedRows([], null))
    ComponentManager.setStateForComponent(this.state.displayGrid, 'selectedIndexes', [])
    GridManager.reloadGridData(this.state.displayGrid)
  }

  generateGrid (activeItem, objectType, enablePermission, enableUserGroups,
    enableUserAction, enableOrgUnitsMenu, enableNextMenu, enableEditForm,
    parentId, enableAsigneeToLab, enableInsertNewRow, enableHoldingLink,
    enableNotificationGroups) {
    /* We need to clear the store of the selected indexes when another type of
    grid is generated */
    if (this.state.displayGrid !== objectType) {
      store.dispatch(updateSelectedRows([], null))
    }
    this.setState({
      activeItem: activeItem,
      displayGrid: objectType,
      form: null,
      displayAnimalRemovalForm: null,
      enablePermission: enablePermission,
      enableUserGroups: enableUserGroups,
      enableUserAction: enableUserAction,
      enableOrgUnitsMenu: enableOrgUnitsMenu,
      enableNextMenu: enableNextMenu,
      enableEditForm: enableEditForm,
      parentId: parentId,
      enableAsigneeToLab: enableAsigneeToLab,
      enableHoldingLink: enableHoldingLink,
      enableInsertNewRow: enableInsertNewRow,
      enableNotificationGroups: enableNotificationGroups
    })
  }

  generateForm (activeItem, objectType) {
    /* We need to clear the store of the selected indexes when another type of
    grid is generated */
    const form = <RegistrationForm svSession={this.props.svSession} />
    this.setState({
      activeItem: activeItem,
      displayGrid: null,
      displayAnimalRemovalForm: null,
      form: form
    })
  }

  handleRowSelectionChange (selectedRows, gridId) {
    /* Custom row exclusion method for certain grids
    Allows only one row to be seleced at a time */
    if (gridId === 'SVAROG_USER_GROUPS') {
      const validRows = []
      validRows.push(selectedRows[selectedRows.length - 1])
      const key = gridId + '.OBJECT_ID'
      const gridRows = store.getState()[gridId].rows
      if (validRows[0]) {
        for (let i = 0; i < gridRows.length; i++) {
          if (gridRows[i][key] === validRows[0][key]) {
            ComponentManager.setStateForComponent(gridId, 'selectedIndexes', [i])
            break
          }
        }
        store.dispatch(updateSelectedRows(validRows, gridId))
      } else {
        ComponentManager.setStateForComponent(gridId, 'selectedIndexes', [])
        store.dispatch(updateSelectedRows([], null))
      }
    } else {
      store.dispatch(updateSelectedRows(selectedRows, gridId))
    }
  }

  editItemOnRowClick () {
    this.generateForm(this.props)
  }

  onRowSelect = () => {
    if (this.state.enableNextMenu) {
      hashHistory.push('/main/sv_data')
    } else {
      this.editItemOnRowClick()
    }
  }

  render () {
    const { displayAnimalRemovalForm, displayGrid } = this.state
    let menu = []
    items.forEach(item => {
      let parentId
      const id = item.id
      const objectType = item.objectType
      const labelCode = item.labelCode
      const enablePermission = item.enablePermission
      const enableUserGroups = item.enableUserGroups
      const enableUserAction = item.enableUserAction
      const enableOrgUnitsMenu = item.enableOrgUnitsMenu
      const enableNextMenu = item.enableNextMenu
      const enableEditForm = item.enableEditForm
      if (item.parentId) {
        parentId = this.props[item.parentId]
      }
      const enableAsigneeToLab = item.enableAsigneeToLab
      const enableHoldingLink = item.enableHoldingLink
      const enableInsertNewRow = item.enableInsertNewRow
      const enableNotificationGroups = item.enableNotificationGroups
      menu.push(
        <li
          id={id}
          key={id}
          {...this.state.activeItem === id
            ? { className: `list-group-item ${sideMenuStyle.li_item} ${sideMenuStyle.li_item_clicked}` }
            : { className: `list-group-item ${sideMenuStyle.li_item}` }
          }
          onClick={() => this.generateGrid(id, objectType, enablePermission,
            enableUserGroups, enableUserAction, enableOrgUnitsMenu, enableNextMenu,
            enableEditForm, parentId, enableAsigneeToLab, enableInsertNewRow, enableHoldingLink,
            enableNotificationGroups)}
        >
          {this.context.intl.formatMessage({
            id: labelCode, defaultMessage: labelCode
          })}
        </li>
      )
    })
    return (
      <div>
        <ResponseHandler
          responseState='admConsoleRequests'
          onAlertClose={this.onAlertClose}
        />
        <div id='consoleSideMenu' className={sideMenuStyle.sideDiv}>
          <ul id='consoleItemsList' className={sideMenuStyle.ul_item}>
            {menu}
            <li
              id='consoleAnimalDeletion'
              key='consoleAnimalDeletion'
              {...this.state.activeItem === 'consoleAnimalDeletion'
                ? { className: `list-group-item ${sideMenuStyle.li_item} ${sideMenuStyle.li_item_clicked}` }
                : { className: `list-group-item ${sideMenuStyle.li_item}` }
              }
              onClick={() => this.setState({
                form: null, displayGrid: null, activeItem: 'consoleAnimalDeletion', displayAnimalRemovalForm: true
              })}
            >
              {this.context.intl.formatMessage({
                id: config.labelBasePath + '.main.animal_deletion',
                defaultMessage: config.labelBasePath + '.main.animal_deletion'
              })}
            </li>
            <li
              id='consoleHolding'
              key='consoleHolding'
              {...this.state.activeItem === 'consoleHolding'
                ? { className: `list-group-item ${sideMenuStyle.li_item} ${sideMenuStyle.li_item_clicked}` }
                : { className: `list-group-item ${sideMenuStyle.li_item}` }
              }
              onClick={() => hashHistory.push('/main/dynamic/holding')}
            >
              {this.context.intl.formatMessage({
                id: config.labelBasePath + '.main.holding.general',
                defaultMessage: config.labelBasePath + '.main.holding.general'
              })}
            </li>
            <li
              id='consoleQuestionnaires'
              key='consoleQuestionnaires'
              {...this.state.activeItem === 'consoleQuestionnaires'
                ? { className: `list-group-item ${sideMenuStyle.li_item} ${sideMenuStyle.li_item_clicked}` }
                : { className: `list-group-item ${sideMenuStyle.li_item}` }
              }
              onClick={() => hashHistory.push('/questionnaires')}
            >
              {this.context.intl.formatMessage({
                id: config.labelBasePath + '.main.questionnaire.list',
                defaultMessage: config.labelBasePath + '.main.questionnaire.list'
              })}
            </li>
            <li
              id='registerUser'
              key='registerUser'
              {...this.state.activeItem === 'registerUser'
                ? { className: `list-group-item ${sideMenuStyle.li_item} ${sideMenuStyle.li_item_clicked}` }
                : { className: `list-group-item ${sideMenuStyle.li_item}` }
              }
              onClick={() => this.generateForm('registerUser', 'registrationForm')}
            >
              {this.context.intl.formatMessage({
                id: config.labelBasePath + '.main.adm_register',
                defaultMessage: config.labelBasePath + '.main.adm_register'
              })}
            </li>
          </ul>
        </div>
        <div id='displayAllRecords' className='displayContent'>
          {this.state.form}
          <span
            className={style.imgGeorgia}
            style={{
              display: displayGrid ? 'none' : null,
              marginTop: displayAnimalRemovalForm ? '12rem' : null
            }}
          >
            <img src='img/georgia_coat_of_arms.png' />
          </span>
          {this.props.admConsoleRequests.isBusy && <Loading />}
          {this.props.admConsoleRequests.isLoadingOrgUnits &&
            <h2 className={consoleStyle.loadingMessage}>
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.adm_console_wait_until_finished`,
                defaultMessage: `${config.labelBasePath}.main.adm_console_wait_until_finished`
              })}
            </h2>
          }
          {displayAnimalRemovalForm && <DeleteAnimal />}
          {this.state.displayGrid &&
            <div id='container' className={consoleStyle.itemsContainer}>
              <div className='firstContainer' style={{ display: 'inline-flex', marginTop: '0.5rem' }}>
                {this.state.enablePermission &&
                  <Permissions
                    svSession={this.props.svSession}
                    selectedRows={this.props.selectedRows}
                    displayGrid={this.state.displayGrid}
                  />
                }
                {this.state.enableUserAction &&
                  <UserActions
                    svSession={this.props.svSession}
                    selectedRows={this.props.selectedRows}
                  />
                }
              </div>
              <div className='secondContainer' style={{ display: 'inline-flex', marginTop: '0.5rem' }}>
                {this.state.enableUserGroups &&
                  <UserGroups
                    svSession={this.props.svSession}
                    selectedRows={this.props.selectedRows}
                  />
                }
                {this.state.enableAsigneeToLab &&
                  <AssigneLaborantToLaboratories
                    svSession={this.props.svSession}
                    selectedRows={this.props.selectedRows}
                  />
                }
                {this.state.enableHoldingLink &&
                  <LinkUserWithHolding
                    svSession={this.props.svSession}
                    selectedRows={this.props.selectedRows}
                  />
                }
                {this.state.enableNotificationGroups &&
                  <AttachNotificationToGroup
                    svSession={this.props.svSession}
                    selectedRows={this.props.selectedRows}
                  />
                }
              </div>
              <div className='thirdContainer' style={{ marginTop: '0.5rem' }}>
                {this.state.enableOrgUnitsMenu &&
                  <UserOrgUnits
                    svSession={this.props.svSession}
                    selectedRows={this.props.selectedRows}
                    gridToDisplay={this.state.displayGrid}
                  />
                }
              </div>
              <MainContent
                gridToDisplay={this.state.displayGrid}
                onSelectChangeFunct={this.handleRowSelectionChange}
                enableMultiSelect
                insertRow={this.state.enableInsertNewRow}
                gridConfig={this.gridConfig}
                onRowSelectProp={this.onRowSelect}
                allowEdit={this.state.enableEditForm}
                parentId={this.state.parentId}
                isFromAdmConsole
              />
            </div>
          }
        </div>
      </div>
    )
  }
}

AdminConsole.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
  selectedRows: state.selectedGridRows.selectedGridRows,
  admConsoleRequests: state.admConsoleRequests,
  selectedItemFromGrid: state.gridConfig.gridHierarchy,
  localeObjId: state.userInfoReducer.localeObjId
})

export default connect(mapStateToProps)(AdminConsole)
