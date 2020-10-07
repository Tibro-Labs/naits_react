import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import { menuConfig } from 'config/menuConfig.js'
import { sideMenuConfig } from 'config/sideMenuConfig.js'
import * as config from 'config/config.js'
import ReactTooltip from 'react-tooltip'
import createHashHistory from 'history/createHashHistory'
import sideMenuStyle from 'modulesCSS/SideMenu.module.css'
import {
  EditSingleRecord,
  EditSelectedItem,
  GridContent,
  MultiGrid,
  ActionListGenerator,
  AcceptAnimals,
  GridWithSearch
} from 'components/ComponentsIndex'
import InputWrappers from 'containers/InputWrappers'
import FormExtensions from 'containers/FormExtensions'
import MenuExtensions from 'containers/MenuExtensions'
import BrowseHoldings from './BrowseHoldings'
import { store } from 'tibro-redux'
import { writeComponentToStoreAction } from 'backend/writeComponentToStoreAction'
import { isValidObject, isValidArray, swapItems } from 'functions/utils'
const hashHistory = createHashHistory()

// side menu rendered depending on selected item from main top menu
// functions called by the side menu items are defined in the parent component, result from those functions
// are passed to the other child (grid/form - right component)
// optional prop - Record Info used to display selected item from main menus
class SideMenu extends React.Component {
  static propTypes = {
    menuType: PropTypes.string.isRequired,
    stateTooltip: PropTypes.bool.isRequired,
    parentId: PropTypes.number.isRequired,
    objectId: PropTypes.number.isRequired,
    configuration: PropTypes.func.isRequired,
    componentStack: PropTypes.array,
    lastSelectedItem: PropTypes.func.isRequired
    // dataSource: PropTypes.string
  }
  constructor (props) {
    super(props)
    this.state = {
      listItemId: undefined,
      isActive: false,
      animalBelongsToSlaughterhouse: null,
      stateTooltip: this.props.stateTooltip,
      selectedObject: this.props.menuType,
      subModuleActions: []
    }
  }

  componentDidMount () {
    if (sideMenuConfig(`SIDE_MENU_${this.props.menuType}`, this.context.intl) &&
      sideMenuConfig(`SIDE_MENU_${this.props.menuType}`, this.context.intl).LIST_OF_ITEMS) {
      sideMenuConfig(`SIDE_MENU_${this.props.menuType}`, this.context.intl).LIST_OF_ITEMS.map(
        element => {
          if (element.TYPE === this.props.menuType && element.SELECTED_BY_DEFAULT) {
            document.getElementById(element.ID) && document.getElementById(element.ID).click()
          }
        }
      )
    }

    // Check if an animal is currently selected and if it belongs to a slaughterhouse
    if (this.props.gridToDisplay === 'ANIMAL' && this.props.gridType === 'ANIMAL') {
      const server = config.svConfig.restSvcBaseUrl
      const verbPath = config.svConfig.triglavRestVerbs.IS_ANIMAL_IN_SLAUGHTERHOUSE
      const session = this.props.svSession
      const animalObjId = this.props.objectId
      const restUrl = `${server}${verbPath}/${session}/${animalObjId}`

      axios.get(restUrl).then(res => this.setState({ animalBelongsToSlaughterhouse: res.data }))
    }

    this.generateSubModuleActions(this.props)
    document.getElementById('clearReturnedComponentSideMenu') && document.getElementById('clearReturnedComponentSideMenu').click()
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.stateTooltip !== nextProps.stateTooltip) {
      this.setState({ stateTooltip: nextProps.stateTooltip })
    }
    if (this.props.selectedItems !== nextProps.selectedItems) {
      this.setState({ subModuleActions: [] }, () => {
        this.generateSubModuleActions(nextProps)
      })
    }
    if (nextProps.addedKeeperToHolding) {
      this.generateMenu()
    }
    if (nextProps.removedKeeperFromHolding) {
      this.generateMenu()
    }
  }

  generateSubModuleActions = (props) => {
    if (isValidArray(props.selectedItems, 1)) {
      props.selectedItems.forEach(grid => {
        if (grid.active) {
          const configedMenu = sideMenuConfig(`SIDE_MENU_${props.menuType}`, this.context.intl)
          const subModules = configedMenu.SUB_MODULES
          if (isValidObject(subModules, 1)) {
            const type = grid.row[props.menuType + '.TYPE']
            if (subModules[type]) {
              this.setState({ subModuleActions: subModules[type].ACTIONS_ENABLED })
            }
          }
        }
      })
    }
  }

  generateForm = (params) => {
    const FormExtension = FormExtensions[params.formExtension]
    let returnedComponent = []

    returnedComponent.push(
      <ActionListGenerator
        menuType={this.props.menuType}
        selectedObject={params.varType}
        menuItemActions={params.menuItemActions}
        subModuleActions={this.state.subModuleActions}
      />
    )
    if (params.isSingle) {
      returnedComponent.push(
        <EditSingleRecord
          showForm={params.varType}
          parentId={this.props.objectId}
          inputWrapper={InputWrappers[params.inputWrapper]}
          FormExtension={FormExtension}
          key={`${params.varType}_${this.props.objectId}_${this.props.menuType}`}
          hideBtns={params.disableFormEdit}
        />
      )
    } else {
      returnedComponent.push(
        <EditSelectedItem
          showForm={params.varType}
          parentId={this.props.parentId}
          objectId={this.props.objectId}
          inputWrapper={InputWrappers[params.inputWrapper]}
          FormExtension={FormExtension}
          key={`${params.varType}_${this.props.objectId}`}
          hideBtns={params.disableFormEdit}
        />
      )
    }
    this.setState({ selectedObject: params.varType }, () =>
      store.dispatch(writeComponentToStoreAction(returnedComponent))
    )
  }

  generateSearchableGrid = (params) => {
    const gridConfig = menuConfig('GRID_CONFIG', this.context.intl)

    const FormExtension = FormExtensions[params.formExtension]
    const gridProps = {
      showGrid: params.varType,
      parentType: this.props.menuType,
      parentId: this.props.objectId,
      isContainer: params.isContainer,
      linkName: params.linkName,
      linkNote: params.linkNote,
      linkedTable: params.linkedTable,
      gridConfig: gridConfig,
      multiGrid: params.multiGrid,
      searchParams: params.searchParams,
      inputWrapper: InputWrappers[params.inputWrapper],
      coreObject: params.coreObject,
      FormExtension: FormExtension,
      disableEdit: params.disableEdit,
      customWs: params.customWs,
      key: `${params.varType}_${this.props.objectId}`,
      hideBtns: params.disableFormEdit,
      disableEditForSubmodules: params.disableEditForSubmodules,
      disableChechBoxFromGrid: params.disableChechBoxFromGrid,
      disableAddRow: params.disableAddRow,
      customRowSelect: params.customRowSelect,
      customDelete: params.customDelete,
      isSpecificType: params.isSpecificType,
      customId: params.customId,
      customGridId: params.customGridId,
      column: params.column,
      valueForCol: params.valueForCol
    }

    let returnedComponent = []
    returnedComponent.push(
      <ActionListGenerator
        menuType={this.props.menuType}
        selectedObject={params.varType}
        menuItemActions={params.menuItemActions}
        subModuleActions={this.state.subModuleActions}
        gridProps={gridProps}
        key={params.varType + '_SEARCHABLE_ACTIONS'}
      />
    )

    returnedComponent.push(
      <GridWithSearch
        noModal
        loadFromParent
        linkedTable={params.varType}
        key={params.varType + '_SEARCHABLE'}
        {...gridProps}
      />
    )
    this.setState({ selectedObject: params.varType }, () =>
      store.dispatch(writeComponentToStoreAction(returnedComponent))
    )
  }

  generateGrid = (params) => {
    let toggleCustomButton = false
    let formFieldsToBeEcluded
    menuConfig('SIMPLE_FORM_EXCLUDE') && menuConfig('SIMPLE_FORM_EXCLUDE').LIST_OF_ITEMS.map((element) => {
      // check if 'ANIMAL' === 'ANIMAL'
      // to use excluded simple grid button
      if (params.varType === element.TABLE) {
        toggleCustomButton = true
        formFieldsToBeEcluded = element.EXCLUDED_FIELDS
      }
    })
    menuConfig('SHOW_GRIDMODAL_TO_LINK_TO_TABLE') && menuConfig('SHOW_GRIDMODAL_TO_LINK_TO_TABLE').map((element) => {
      if ((params.linkedTable === element.TABLE) && element.LINKS) {
        element.LINKS.map(
          linksElement => {
            if (linksElement === params.linkName) {
              toggleCustomButton = true
            }
          }
        )
      }
    })

    const gridConfig = menuConfig('GRID_CONFIG', this.context.intl)
    const FormExtension = FormExtensions[params.formExtension]
    const gridProps = {
      gridInModal: this.props.gridInModal,
      toggleCustomButton: toggleCustomButton,
      formFieldsToBeEcluded: formFieldsToBeEcluded,
      enableMultiSelect: this.props.enableMultiSelect,
      onSelectChangeFunct: this.props.onSelectChangeFunct,
      showGrid: params.varType,
      parentType: this.props.menuType,
      parentId: this.props.objectId,
      isContainer: params.isContainer,
      linkName: params.linkName,
      linkNote: params.linkNote,
      linkedTable: params.linkedTable,
      gridConfig: gridConfig,
      multiGrid: params.multiGrid,
      searchParams: params.searchParams,
      inputWrapper: InputWrappers[params.inputWrapper],
      coreObject: params.coreObject,
      FormExtension: FormExtension,
      disableEdit: params.disableEdit,
      customWs: params.customWs,
      key: `${params.varType}_${this.props.objectId}`,
      hideBtns: params.disableFormEdit,
      disableEditForSubmodules: params.disableEditForSubmodules,
      disableChechBoxFromGrid: params.disableChechBoxFromGrid,
      disableAddRow: params.disableAddRow,
      customRowSelect: params.customRowSelect,
      customDelete: params.customDelete,
      isSpecificType: params.isSpecificType,
      customId: params.customId,
      customGridId: params.customGridId
    }

    let returnedComponent = []
    let menuItemActions = params.menuItemActions

    if (params.varType === 'ANIMAL_QUARANTINE') {
      try {
        gridProps.showGrid = 'ANIMAL'
        gridProps.parentId = this.props.parentSource.HOLDING.object_id
      } catch (error) {
        console.error('No parent found for selected object type; web service returned null or undefined' + error)
      }
    }

    returnedComponent.push(
      <ActionListGenerator
        menuType={this.props.menuType}
        selectedObject={params.varType}
        menuItemActions={menuItemActions}
        subModuleActions={this.state.subModuleActions}
        gridProps={gridProps}
      />
    )

    if (this.state.subModuleActions.includes('accept') && ['ANIMAL_MOVEMENT', 'FLOCK_MOVEMENT'].includes(params.varType)) {
      returnedComponent.push(
        <AcceptAnimals
          key={gridProps.key + '_ACCEPT_ACTION'}
          gridId={gridProps.key}
          gridType={gridProps.showGrid}
          menuItemActions={this.state.subModuleActions}
        />
      )
    }
    if (this.state.subModuleActions.includes('accept') && ['ANIMAL', 'FLOCK'].includes(params.varType)) {
      returnedComponent.push(
        <AcceptAnimals
          key={gridProps.key + '_DIRECT_TRANSFER'}
          gridId={gridProps.key}
          gridType={gridProps.showGrid}
        />
      )
    }

    if (params.multiGrid) {
      returnedComponent.push(
        <MultiGrid {...gridProps} />
      )
    } else {
      returnedComponent.push(
        <GridContent {...gridProps} />
      )
    }

    this.setState({ selectedObject: params.varType }, () =>
      store.dispatch(writeComponentToStoreAction(returnedComponent))
    )
  }

  showLpis = () => {
    hashHistory.push('/main/lpis')
  }

  highlightActivatedElement = (listItemId) => {
    this.setState({ isActive: true, listItemId })
  }

  clearReturnedComponent = () => {
    this.setState(
      {
        isActive: false,
        listItemId: undefined,
        selectedObject: this.props.menuType
      }
    )
    store.dispatch(writeComponentToStoreAction(null))
  }

  generateMenu = () => {
    const { isActive, listItemId } = this.state
    const { menuType, selectedItems, gridType, gridToDisplay } = this.props
    let getUsers = this.props.getUserGroups
    let htmlBuffer = []
    const documentBuffer = []
    let documentsFound = 0
    let holdingType, holdingStatus
    if (gridType === 'HOLDING') {
      selectedItems.forEach(grid => {
        holdingType = grid.row['HOLDING.TYPE']
        holdingStatus = grid.row['HOLDING.STATUS']
      })
    }
    if (menuType) {
      let splitGetUsers = getUsers.split(',')
      let configedMenu, listOfButtons
      if (['FVIRO'].includes(splitGetUsers[0]) || ['CVIRO'].includes(splitGetUsers[0]) || ['LABORANT'].includes(splitGetUsers[0])) {
        if (gridType === 'HOLDING' && holdingStatus === 'NO-KEEPER') {
          listOfButtons = []
        } else if (gridType === 'HOLDING' && holdingStatus !== 'NO-KEEPER' &&
          (holdingType === '15' || holdingType === '16')) {
          listOfButtons = []
        } else {
          configedMenu = sideMenuConfig(`SIDE_MENU_${menuType}_${splitGetUsers[0]}`, this.context.intl)
          listOfButtons = configedMenu.LIST_OF_ITEMS
        }
      } else {
        configedMenu = sideMenuConfig(`SIDE_MENU_${menuType}`, this.context.intl)
        let listOfItems = configedMenu.LIST_OF_ITEMS
        // Checks for a holding of type Animal shelter without a keeper
        if (gridType === 'HOLDING' && holdingStatus === 'NO-KEEPER' && holdingType === '15') {
          swapItems(listOfItems, 3, 2)
          const newListOfButtons = listOfItems.splice(3, 20)
          listOfButtons = newListOfButtons
          // Checks for a holding of type Vet station without a keeper
        } else if (gridType === 'HOLDING' && holdingStatus === 'NO-KEEPER' && holdingType === '16') {
          swapItems(listOfItems, 3, 2)
          const newListOfButtons = listOfItems.splice(3, 20)
          listOfButtons = newListOfButtons
          // Checks for holdings without a type and without a keeper
        } else if (gridType === 'HOLDING' && holdingStatus === 'NO-KEEPER' && !holdingType) {
          const newListOfButtons = listOfItems.splice(4, 25)
          listOfButtons = newListOfButtons
          // Checks for all other holdings without a keeper
        } else if (gridType === 'HOLDING' && holdingStatus === 'NO-KEEPER' && holdingType !== '15') {
          const newListOfButtons = listOfItems.splice(4, 25)
          listOfButtons = newListOfButtons
        } else {
          // Holdings of type Animal shelter
          if (gridType === 'HOLDING' && holdingType === '15') {
            swapItems(listOfItems, 3, 2)
            swapItems(listOfItems, 19, 3)
            swapItems(listOfItems, 21, 4)
            swapItems(listOfItems, 22, 5)
            const newListOfButtons = listOfItems.splice(6, 22)
            listOfButtons = newListOfButtons
          }
          // Holdings of type Vet station
          if (gridType === 'HOLDING' && holdingType === '16') {
            swapItems(listOfItems, 3, 2)
            swapItems(listOfItems, 18, 3)
            swapItems(listOfItems, 20, 4)
            const newListOfButtons = listOfItems.splice(5, 20)
            listOfButtons = newListOfButtons
          }
          // Holdings without a type
          if (!holdingType && listOfItems.length > 10) {
            listOfItems.splice(18, 19)
          }
          // All other types of holdings
          if (gridType === 'HOLDING' && (holdingType !== '15' || holdingType !== '16')) {
            listOfItems.splice(18, 19)
          }
        }
        // Checks for the Pet button in the Health passport screen
        if (gridToDisplay === 'HOLDING' && gridType === 'HEALTH_PASSPORT') {
          if (holdingType !== '16') {
            const newListOfButtons = listOfItems.splice(1, 1)
            listOfButtons = newListOfButtons
          }
        }
        listOfButtons = listOfItems
      }
      let subModuleItem
      const objects = selectedItems
      const len = objects.length
      if (isValidArray(objects, 2)) {
        for (let i = 0; i < len; i++) {
          if (objects[i].active) {
            for (let j = 0; j < len; j++) {
              if (objects[j].gridId === 'HOLDING') {
                if (objects[i].row[menuType + '.PARENT_ID'] === objects[j].row['HOLDING.OBJECT_ID'] && i !== j) {
                  const configedMenu = sideMenuConfig(`SIDE_MENU_HOLDING`, this.context.intl)
                  const subModules = configedMenu.SUB_MODULES
                  if (isValidObject(subModules, 1)) {
                    if (objects[j].row[objects[j].gridId + '.TYPE']) {
                      subModuleItem = subModules[objects[j].row[objects[j].gridId + '.TYPE']]
                    }
                  }
                }
              }
            }
          }
        }
      } else if (isValidArray(objects, 1)) {
        const configedMenu = sideMenuConfig(`SIDE_MENU_HOLDING`, this.context.intl)
        const subModules = configedMenu.SUB_MODULES
        if (isValidObject(subModules, 1)) {
          objects.forEach(obj => {
            if ((obj.active && obj.gridType === 'ANIMAL' && obj.row['ANIMAL.STATUS'] === 'POSTMORTEM') &&
              this.state.animalBelongsToSlaughterhouse) {
              subModuleItem = subModules['7']
            } else if ((obj.active && obj.gridType === 'ANIMAL' && obj.row['ANIMAL.STATUS'] === 'SLAUGHTRD') &&
              this.state.animalBelongsToSlaughterhouse) {
              subModuleItem = subModules['7']
            } else if (obj.active && obj.gridType === 'ANIMAL' && obj.row['ANIMAL.STATUS'] === 'PREMORTEM' &&
              this.state.animalBelongsToSlaughterhouse) {
              subModuleItem = subModules['7']
            } else if (obj.active && obj.gridType === 'ANIMAL' && obj.row['ANIMAL.STATUS'] === 'DESTROYED' &&
              this.state.animalBelongsToSlaughterhouse) {
              subModuleItem = subModules['7']
            }
          })
        }
      }
      let type
      let isSpecificType
      if (isValidArray(selectedItems, 1)) {
        for (let i = 0; i < len; i++) {
          if (selectedItems[i].active) {
            const configedMenu = sideMenuConfig(`SIDE_MENU_${menuType}`, this.context.intl)
            const subModules = configedMenu.SUB_MODULES
            if (isValidObject(subModules, 1)) {
              type = selectedItems[i].row[menuType + '.TYPE'] ||
                selectedItems[i].row[menuType + '.' + menuType + '_TYPE'] ||
                selectedItems[i].row[menuType + '.' + 'ORG_UNIT_TYPE']

              if (subModules[type]) {
                isSpecificType = subModules[type]
              }
            }
          }
        }
      }

      for (let i = 0; i < listOfButtons.length; i++) {
        const obj = listOfButtons[i]
        const varKey = obj.ID
        const varId = obj.ID
        const varLabel = obj.LABEL
        const varFunc = obj.FUNCTION
        const varType = obj.TYPE
        const linkName = obj.LINKNAME
        const linkNote = obj.LINKNOTE
        const linkedTable = obj.LINKEDTABLE
        const isSingle = obj.ISSINGLE
        const isContainer = obj.ISCONTAINER
        const floatHelper = obj.FLOATHELPER
        const isDocument = obj.DOCUMENT
        const multiGrid = obj.MULTIGRID
        const searchParams = obj.SEARCH_PARAMS
        const inputWrapper = obj.INPUT_WRAPPER
        const coreObject = obj.GENERATE_CORE
        const formExtension = obj.FORM_EXTENSION
        let disableEdit = obj.DISABLE_EDIT
        let disableFormEdit = obj.DISABLE_FORM_EDIT
        const customWs = obj.CUSTOM_WS
        let menuItemActions = obj.ACTIONS_ENABLED
        const disableEditForSubmodules = obj.DISABLE_EDIT_FOR_SUBMODULES
        const disableChechBoxFromGrid = obj.DISABLE_SELECT_ROW
        const disableAddRow = obj.DISABLE_ADD_ROW
        const customRowSelect = obj.CUSTOM_ROW_SELECT
        const customDelete = obj.CUSTOM_DELETE
        const customId = obj.CUSTOM_ID
        const customGridId = obj.CUSTOM_GRID_ID
        const column = obj.COLUMN
        const valueForCol = obj.VALUE_FOR_COL
        const htmlElement =
          (<li
            id={varId}
            key={varKey}
            type='button'
            data-tip={floatHelper}
            data-effect='float'
            data-event-off='mouseout'
            {...varFunc === 'grid' && {
              onClick: () => {
                if (isValidObject(subModuleItem, 1)) {
                  if (this.props.gridType === 'STRAY_PET') {
                    disableFormEdit = 'delete'
                  } else {
                    disableEdit = disableEditForSubmodules
                    disableFormEdit = disableEditForSubmodules
                  }
                }
                this.highlightActivatedElement(varId)
                const params = {
                  varType,
                  isContainer,
                  linkName,
                  linkedTable,
                  linkNote,
                  menuItemActions,
                  searchParams,
                  multiGrid,
                  inputWrapper,
                  coreObject,
                  formExtension,
                  disableEdit,
                  customWs,
                  disableFormEdit,
                  disableEditForSubmodules,
                  disableChechBoxFromGrid,
                  disableAddRow,
                  customRowSelect,
                  customDelete,
                  isSpecificType,
                  customId,
                  customGridId
                }
                this.generateGrid(params)
              }
            }}
            {...varFunc === 'form' && {
              onClick: () => {
                if (isValidObject(subModuleItem, 1)) {
                  disableEdit = disableEditForSubmodules
                  disableFormEdit = disableEditForSubmodules
                }
                this.highlightActivatedElement(varId)
                const params = {
                  varType,
                  isSingle,
                  inputWrapper,
                  formExtension,
                  disableFormEdit,
                  disableEdit,
                  disableEditForSubmodules,
                  menuItemActions,
                  isSpecificType,
                  customId,
                  customGridId
                }
                this.generateForm(params)
              }
            }}
            {...varFunc === 'search' && {
              onClick: () => {
                this.highlightActivatedElement(varId)
                const params = {
                  varType,
                  isContainer,
                  linkName,
                  linkedTable,
                  linkNote,
                  menuItemActions,
                  searchParams,
                  multiGrid,
                  inputWrapper,
                  coreObject,
                  formExtension,
                  disableEdit,
                  customWs,
                  disableFormEdit,
                  disableEditForSubmodules,
                  disableChechBoxFromGrid,
                  disableAddRow,
                  customRowSelect,
                  customDelete,
                  isSpecificType,
                  customId,
                  customGridId,
                  column,
                  valueForCol
                }
                this.generateSearchableGrid(params)
              }
            }}
            {...isActive && listItemId === varId
              ? { className: `list-group-item ${sideMenuStyle.li_item} ${sideMenuStyle.li_item_clicked}` }
              : { className: `list-group-item ${sideMenuStyle.li_item}` }
            }
          >
            {varLabel}
          </li>)
        if (isDocument) {
          documentsFound++
          documentBuffer.push(htmlElement)
        } else {
          if (obj.DISABLE_FOR && obj.DISABLE_FOR.includes(type)) {
            continue
          } else {
            htmlBuffer.push(htmlElement)
          }
        }
      }
      if (isValidObject(subModuleItem, 1)) {
        let additionalMenuItems = []
        const items = subModuleItem.ADDITIONAL_MENU_ITEMS
        if (subModuleItem.FOR_OBJECTS.includes(this.props.gridType)) {
          let premortemAnimal
          let isHoldingSlaughterhouse
          for (let i = 0; i < objects.length; i++) {
            if (objects[i].active && objects[i].row['ANIMAL.STATUS'] === 'PREMORTEM') {
              premortemAnimal = true
            }

            if (objects[i].row['HOLDING.TYPE'] === '7') {
              isHoldingSlaughterhouse = true
            }
          }
          let Component
          if (premortemAnimal && !isHoldingSlaughterhouse && !this.state.animalBelongsToSlaughterhouse) {
            Component = MenuExtensions[items[0]]
            additionalMenuItems.push(
              <Component
                key={items[0]}
                isActive={this.state.isActive}
                listItemId={this.state.listItemId}
                highlightActivatedElement={this.highlightActivatedElement}
                generateForm={this.generateForm}
                generateGrid={this.generateGrid}
              />
            )
          } else {
            for (let i = 0; i < items.length; i++) {
              Component = MenuExtensions[items[i]]
              additionalMenuItems.push(
                <Component
                  key={items[i]}
                  isActive={this.state.isActive}
                  listItemId={this.state.listItemId}
                  highlightActivatedElement={this.highlightActivatedElement}
                  generateForm={this.generateForm}
                  generateGrid={this.generateGrid}
                />
              )
            }
          }
        }
        htmlBuffer.push(additionalMenuItems)
      } else {
        if (this.props.menuType === 'PET' && this.props.parentGrid === 'PET') {
          let Component = MenuExtensions['CollectionLocation']
          let ComponentTwo = MenuExtensions['ReleaseLocation']
          let additionalMenuItems = []
          additionalMenuItems.push(
            <Component
              key='CollectionLocation'
              isActive={this.state.isActive}
              listItemId={this.state.listItemId}
              highlightActivatedElement={this.highlightActivatedElement}
              generateForm={this.generateForm}
              generateGrid={this.generateGrid}
            />,
            <ComponentTwo
              key='ReleaseLocation'
              isActive={this.state.isActive}
              listItemId={this.state.listItemId}
              highlightActivatedElement={this.highlightActivatedElement}
              generateForm={this.generateForm}
              generateGrid={this.generateGrid}
            />
          )
          htmlBuffer.push(additionalMenuItems)
        }
      }
      return { htmlBuffer, documentsFound, documentBuffer }
    }
  }

  render () {
    const { stateTooltip } = this.state
    const { menuType } = this.props
    const menu = this.generateMenu()
    return (
      <div
        id='searchDiv'
        className={sideMenuStyle.sideDiv}
      >
        {stateTooltip && <ReactTooltip />}
        {menuType === 'HOLDING' && <BrowseHoldings holdingObjId={this.props.objectId} clearReturnedComponent={this.clearReturnedComponent} />}
        {this.props.children}
        <ul id='sidemenu_list' className={`list-group ${sideMenuStyle.ul_item}`}>
          {menu.htmlBuffer}
          {menu.documentsFound > 0 &&
            <ul
              id='displayDocuments'
              className={sideMenuStyle.ul_item}
            >
              <label id='documents_label' className={sideMenuStyle.collapsibleMenuHeading} htmlFor='documents_btn'>
                Documents
                <span id='collapsible_indicator' className={`${sideMenuStyle.collapsibleIndicator} glyphicon glyphicon-menu-down`} />
              </label>
              <ul id='sidemenu_documents' className={`${sideMenuStyle.ul_item} ${sideMenuStyle.collapsibleMenu}`}> {menu.documentBuffer} </ul>
            </ul>}
        </ul>
        <button
          style={
            {
              height: '0px',
              width: '0px',
              display: 'none'
            }
          }
          id='clearReturnedComponentSideMenu'
          onClick={this.clearReturnedComponent}
        />
      </div>
    )
  }
}

SideMenu.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  svSession: state.security.svSession,
  stateTooltip: state.stateTooltip.stateTooltip,
  selectedItems: state.gridConfig.gridHierarchy,
  parentSource: state.parentSource,
  componentToDisplay: state.componentToDisplay.componentToDisplay,
  getUserGroups: state.userInfoReducer.getUsers,
  addedKeeperToHolding: state.linkedObjects.addedKeeperToHolding,
  removedKeeperFromHolding: state.dropLink.removedKeeperFromHolding
})

export default connect(mapStateToProps)(SideMenu)
