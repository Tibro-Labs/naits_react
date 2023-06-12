import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { alertUser } from 'tibro-components'
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
  TerminatedAnimalsFilter,
  FinishedMovementDocumentsFilter,
  FinishedMovementsFilter,
  TerminatedPetsFilter,
  ReleasedPetsFilter,
  GridWithSearch
} from 'components/ComponentsIndex'
import InputWrappers from 'containers/InputWrappers'
import FormExtensions from 'containers/FormExtensions'
import MenuExtensions from 'containers/MenuExtensions'
import BrowseHoldings from './BrowseHoldings'
import { store } from 'tibro-redux'
import { writeComponentToStoreAction } from 'backend/writeComponentToStoreAction'
import { isValidObject, isValidArray, strcmp } from 'functions/utils'
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
      alert: undefined,
      listItemId: undefined,
      isActive: false,
      animalBelongsToSlaughterhouse: null,
      stateTooltip: this.props.stateTooltip,
      selectedObject: this.props.menuType,
      subModuleActions: [],
      changeHoldingPeopleState: false,
      changeHoldingPeopleSlaughterhouseState: false,
      changeMovementsState: false,
      changeMovementsSlaugherhouseState: false,
      changeOtherState: false,
      changeOtherSlaughterhouseState: false,
      changeInvetoryState: false,
      changePetsShelterState: false
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
    if (this.props.gridType === 'HOLDING') {
      this.displayOrHideHoldingPeople(false)
      this.displayOrHideHoldingPeopleInSlaughterhouse(false)
      this.displayOrHideMovements(false)
      this.displayOrHideMovementsInSlaughterhouse(false)
      this.displayOrHideOther(false)
      this.displayOrHideOtherInSlaughterhouse(false)
      this.displayOrHideInventory(false)
      this.displayOrHidePetShelter(false)
      this.hideButtons()
    }
    document.getElementById('clearReturnedComponentSideMenu') && document.getElementById('clearReturnedComponentSideMenu').click()
  }

  componentDidUpdate (nextProps, nextState) {
    if (nextProps.gridType === 'HOLDING') {
      if (this.state.changeHoldingPeopleState !== nextState.changeHoldingPeopleState) {
        this.handleDisplayingHoldingPeople(nextState.changeHoldingPeopleState)
      }

      if (this.state.changeHoldingPeopleSlaughterhouseState !== nextState.changeHoldingPeopleSlaughterhouseState) {
        this.handleDisplayingHoldingPeopleInSlaughterhouse(nextState.changeHoldingPeopleSlaughterhouseState)
      }

      if (this.state.changeMovementsState !== nextState.changeMovementsState) {
        this.handleDisplayingMovements(nextState.changeMovementsState)
      }

      if (this.state.changeMovementsSlaugherhouseState !== nextState.changeMovementsSlaugherhouseState) {
        this.handleDisplayingMovementsInSlaughterhouse(nextState.changeMovementsSlaugherhouseState)
      }

      if (this.state.changeOtherState !== nextState.changeOtherState) {
        this.handleDisplayingOther(nextState.changeOtherState)
      }

      if (this.state.changeOtherSlaughterhouseState !== nextState.changeOtherSlaughterhouseState) {
        this.handleDisplayingOtherInSlaughterhouse(nextState.changeOtherSlaughterhouseState)
      }

      if (this.state.changeInvetoryState !== nextState.changeInvetoryState) {
        this.handleDisplayingInventory(nextState.changeInvetoryState)
      }

      if (this.state.changePetsShelterState !== nextState.changePetsShelterState) {
        this.handleDisplayingPetsShelter(nextState.changePetsShelterState)
      }
    }
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
    if (this.props.shouldRefreshSideMenu !== nextProps.shouldRefreshSideMenu) {
      this.setState({
        alert: alertUser(
          true, 'info',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.reload_page`,
            defaultMessage: `${config.labelBasePath}.alert.reload_page`
          }), '', () => { location.reload() }
        )
      })
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
            } else {
              this.setState({ subModuleActions: [] })
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
      customGridId: params.customGridId,
      holdingType: params.holdingType,
      gridId: params.gridId
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
          customId={params.customId}
        />
      )
    }
    if (this.state.subModuleActions.includes('accept') && ['ANIMAL', 'FLOCK'].includes(params.varType)) {
      returnedComponent.push(
        <AcceptAnimals
          key={gridProps.key + '_DIRECT_TRANSFER'}
          gridId={gridProps.key}
          gridType={gridProps.showGrid}
          customId={params.customId}
        />
      )
    } else {
      // Enable the component for direct transfer of animals in holding of type Animal market
      if (gridProps.holdingType && strcmp(gridProps.holdingType, '10') && ['ANIMAL'].includes(params.varType)) {
        returnedComponent.push(
          <AcceptAnimals
            key={gridProps.key + '_DIRECT_TRANSFER'}
            gridId={gridProps.key}
            gridType={gridProps.showGrid}
            customId={params.customId}
          />
        )
      }
    }

    if (gridProps.customId && strcmp(gridProps.customId, 'TERMINATED_ANIMALS')) {
      returnedComponent.push(
        <TerminatedAnimalsFilter
          key={gridProps.key + '_FILTER_TERMINATED_ANIMALS'}
          gridId={gridProps.key}
          gridType={gridProps.showGrid}
          customId={params.customId}
        />
      )
    }

    if (gridProps.customId && strcmp(gridProps.customId, 'TERMINATED_PETS')) {
      returnedComponent.push(
        <TerminatedPetsFilter
          key={gridProps.key + '_FILTER_TERMINATED_PETS'}
          gridId={gridProps.key}
          gridType={gridProps.showGrid}
          customId={params.customId}
        />
      )
    }

    if (gridProps.customGridId && strcmp(gridProps.customGridId, 'RELEASED_PETS')) {
      returnedComponent.push(
        <ReleasedPetsFilter
          key={gridProps.key + '_FILTER_RELEASED_PETS'}
          gridId={gridProps.key}
          gridType={gridProps.showGrid}
          customId={params.customId}
          customGridId={params.customGridId}
        />
      )
    }

    if (gridProps.isSpecificType && gridProps.isSpecificType.TYPE && strcmp(gridProps.isSpecificType.TYPE, '7')) {
      if (gridProps.customGridId && strcmp(gridProps.customGridId, 'finished_incoming_movement_doc')) {
        returnedComponent.push(
          <FinishedMovementDocumentsFilter
            key={gridProps.key + '_FILTER_FINISHED_MOVEMENT_DOCUMENTS'}
            gridId={gridProps.key}
            gridType={gridProps.showGrid}
            customGridId={params.customGridId}
          />
        )
      } else if (gridProps.customId && strcmp(gridProps.customId, 'FINISHED_ANIMAL_MOVEMENTS')) {
        returnedComponent.push(
          <FinishedMovementsFilter
            key={gridProps.key + '_FILTER_MOVEMENTS'}
            gridId={gridProps.key}
            gridType={gridProps.showGrid}
            customId={params.customId}
          />
        )
      }
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

  hideButtons = () => {
    const terminatedAnimalsBtn = document.getElementById('list_item_terminated_animals')
    const incomingAnimalsBtn = document.getElementById('list_item_animal_movement')
    const finishedIncomingAnimalsBtn = document.getElementById('list_item_finished_animal_movement')
    const outgoingAnimalsBtn = document.getElementById('list_item_outgoing_animals')
    const finishedOutgoingAnimalsBtn = document.getElementById('list_item_finished_outgoing_animals')
    const incomingFlocksBtn = document.getElementById('list_item_flock_movement')
    const finishedIncomingFlockBtn = document.getElementById('list_item_finished_flock_movement')
    const outgoingFlocksBtn = document.getElementById('list_item_outgoing_flocks')
    const finishedOutgoingFlockBtn = document.getElementById('list_item_finished_outgoing_flocks')
    const incomingHerdsBtn = document.getElementById('list_item_herd_movement')
    const finishedIncomingHerdsBtn = document.getElementById('list_item_finished_herd_movement')
    const outgoingHerdsBtn = document.getElementById('list_item_outgoing_herds')
    const finishedOutgoingHerdsBtn = document.getElementById('list_item_finished_outgoing_herds')
    const finishedOutgoingMovementDocBtn = document.getElementById('finished_movement_document')
    const finishedIncomingMovementDocBtn = document.getElementById('finished_movement_document_incoming')
    const herderItem = document.getElementById('list_item_holding_herder')
    if (terminatedAnimalsBtn) {
      terminatedAnimalsBtn.style.display = 'none'
    }
    if (incomingAnimalsBtn) {
      incomingAnimalsBtn.style.display = 'none'
    }
    if (finishedIncomingAnimalsBtn) {
      finishedIncomingAnimalsBtn.style.display = 'none'
    }
    if (outgoingAnimalsBtn) {
      outgoingAnimalsBtn.style.display = 'none'
    }
    if (finishedOutgoingAnimalsBtn) {
      finishedOutgoingAnimalsBtn.style.display = 'none'
    }
    if (incomingFlocksBtn) {
      incomingFlocksBtn.style.display = 'none'
    }
    if (finishedIncomingFlockBtn) {
      finishedIncomingFlockBtn.style.display = 'none'
    }
    if (outgoingFlocksBtn) {
      outgoingFlocksBtn.style.display = 'none'
    }
    if (finishedOutgoingFlockBtn) {
      finishedOutgoingFlockBtn.style.display = 'none'
    }
    if (incomingHerdsBtn) {
      incomingHerdsBtn.style.display = 'none'
    }
    if (finishedIncomingHerdsBtn) {
      finishedIncomingHerdsBtn.style.display = 'none'
    }
    if (outgoingHerdsBtn) {
      outgoingHerdsBtn.style.display = 'none'
    }
    if (finishedOutgoingHerdsBtn) {
      finishedOutgoingHerdsBtn.style.display = 'none'
    }
    if (finishedOutgoingMovementDocBtn) {
      finishedOutgoingMovementDocBtn.style.display = 'none'
    }
    if (finishedIncomingMovementDocBtn) {
      finishedIncomingMovementDocBtn.style.display = 'none'
    }
    if (herderItem) {
      herderItem.style.display = 'none'
    }
    if (this.state.subModuleActions.includes('pet_quarantine')) {
      const activePetsItem = document.getElementById('list_item_pet')
      const terminatedPetsItem = document.getElementById('list_item_terminated_pet')
      const outgoingPetsItem = document.getElementById('list_item_outgoing_pets')
      if (activePetsItem) {
        activePetsItem.style.display = 'none'
      }
      if (terminatedPetsItem) {
        terminatedPetsItem.style.display = 'none'
      }
      if (outgoingPetsItem) {
        outgoingPetsItem.style.display = 'none'
      }
    }
  }

  clearReturnedComponent = () => {
    this.setState(
      {
        isActive: false,
        changeHoldingPeopleState: false,
        changeHoldingPeopleSlaughterhouseState: false,
        changeMovementsState: false,
        changeMovementsSlaugherhouseState: false,
        changeOtherState: false,
        changeOtherSlaughterhouseState: false,
        changeInvetoryState: false,
        changePetsShelterState: false,
        listItemId: undefined,
        selectedObject: this.props.menuType
      }
    )
    this.displayOrHideHoldingPeople(false)
    this.displayOrHideHoldingPeopleInSlaughterhouse(false)
    this.displayOrHideMovements(false)
    this.displayOrHideMovementsInSlaughterhouse(false)
    this.displayOrHideOther(false)
    this.displayOrHideOtherInSlaughterhouse(false)
    this.displayOrHideInventory(false)
    this.displayOrHidePetShelter(false)
    store.dispatch(writeComponentToStoreAction(null))
  }

  handleTerminatedAnimalsFilter = () => {
    store.dispatch({ type: 'FILTER_THE_TERMINATED_ANIMALS_GRID' })
  }

  handleFinishedMovementDocumentsFilter = () => {
    store.dispatch({ type: 'FILTER_THE_FINISHED_MOVEMENT_DOCUMENTS_GRID' })
  }

  handleFinishedMovementsFilter = () => {
    store.dispatch({ type: 'FILTER_THE_FINISHED_MOVEMENTS_GRID' })
  }

  handleOutgoingTransfersFilter = () => {
    store.dispatch({ type: 'FILTER_THE_OUTGOING_TRANSFER_GRID' })
  }

  handleIncomingTransfersFilter = () => {
    store.dispatch({ type: 'FILTER_THE_INCOMING_TRANSFER_GRID' })
  }

  handleTerminatedPetsFilter = () => {
    store.dispatch({ type: 'FILTER_THE_TERMINATED_PETS_GRID' })
  }

  handleReleasedPetsFilter = () => {
    store.dispatch({ type: 'FILTER_THE_RELEASED_PETS_GRID' })
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
        if (grid.active && grid.gridType === 'HOLDING') {
          holdingType = grid.row['HOLDING.TYPE']
          holdingStatus = grid.row['HOLDING.STATUS']
        }
      })
    }
    if (gridType === 'HEALTH_PASSPORT') {
      selectedItems.forEach(grid => {
        if (grid.gridType === 'HOLDING') {
          holdingType = grid.row['HOLDING.TYPE']
        }
      })
    }
    if (menuType) {
      let splitGetUsers = getUsers.split(',')
      let configedMenu, listOfButtons
      if (['FVIRO'].includes(splitGetUsers[0]) || ['CVIRO'].includes(splitGetUsers[0]) || ['LABORANT'].includes(splitGetUsers[0])) {
        if (gridType === 'HOLDING' && holdingStatus === 'NO-KEEPER') {
          listOfButtons = []
        } else if (gridType === 'HOLDING' && holdingStatus !== 'NO-KEEPER' &&
          (holdingType === '15' || holdingType === '16' || holdingType === '17')) {
          listOfButtons = []
        } else {
          configedMenu = sideMenuConfig(`SIDE_MENU_${menuType}_${splitGetUsers[0]}`, this.context.intl)
          listOfButtons = configedMenu.LIST_OF_ITEMS
        }
      } else {
        configedMenu = sideMenuConfig(`SIDE_MENU_${menuType}`, this.context.intl)
        let listOfItems = configedMenu.LIST_OF_ITEMS
        listOfButtons = listOfItems

        const outgoingMovementDocBtn = document.getElementById('movement_document')
        const finishedOutgoingMovementDocBtn = document.getElementById('finished_movement_document')
        const incomingMovementDocBtn = document.getElementById('movement_document_incoming')
        const finishedIncomingMovementDocBtn = document.getElementById('finished_movement_document_incoming')
        const animalsBtn = document.getElementById('list_item_animal')
        const flockBtn = document.getElementById('list_item_flock')
        const herdBtn = document.getElementById('list_item_herd')
        const labSampleBtn = document.getElementById('list_item_lab_sample')
        const quarantineBtn = document.getElementById('list_item_export_quarantine')
        const spotCheckBtn = document.getElementById('list_item_spot_check')
        const inventoryItemBtn = document.getElementById('list_item_ivinventory_item')
        const incomingTransferBtn = document.getElementById('list_item_income_transfer')
        const outgoingTransferBtn = document.getElementById('list_item_outcome_transfer')
        const orgUnitsBtn = document.getElementById('list_item_svarog_org_units')
        const petsBtn = document.getElementById('list_item_pet')
        const terminatedPetsBtn = document.getElementById('list_item_terminated_pet')
        const petPassportBtn = document.getElementById('list_item_pet_passport')
        const outgoingPetsBtn = document.getElementById('list_item_outgoing_pets')
        const incomingPetsBtn = document.getElementById('list_item_incoming_pets')
        const petQuarantineBtn = document.getElementById('list_item_pet_quarantine_shelter')

        // Checks for a holding of type Animal shelter without a keeper
        if (gridType === 'HOLDING' && holdingStatus === 'NO-KEEPER' && (holdingType === '15' || holdingType === '17')) {
          if (petsBtn) {
            petsBtn.style.display = 'none'
          }
          if (terminatedPetsBtn) {
            terminatedPetsBtn.style.display = 'none'
          }
          if (outgoingPetsBtn) {
            outgoingPetsBtn.style.display = 'none'
          }
          if (incomingPetsBtn) {
            incomingPetsBtn.style.display = 'none'
          }
          if (petQuarantineBtn) {
            petQuarantineBtn.style.display = 'none'
          }
          // Checks for a holding of type Vet station without a keeper
        } else if (gridType === 'HOLDING' && holdingStatus === 'NO-KEEPER' && holdingType === '16') {
          if (orgUnitsBtn) {
            orgUnitsBtn.style.display = 'none'
          }
          if (petPassportBtn) {
            petPassportBtn.style.display = 'none'
          }
          // Checks for holdings without a type and without a keeper
        } else if (gridType === 'HOLDING' && holdingStatus === 'NO-KEEPER' && !holdingType) {
          if (outgoingMovementDocBtn) {
            outgoingMovementDocBtn.style.display = 'none'
          }
          if (finishedOutgoingMovementDocBtn) {
            finishedOutgoingMovementDocBtn.style.display = 'none'
          }
          if (incomingMovementDocBtn) {
            incomingMovementDocBtn.style.display = 'none'
          }
          if (finishedIncomingMovementDocBtn) {
            finishedIncomingMovementDocBtn.style.display = 'none'
          }
          if (animalsBtn) {
            animalsBtn.style.display = 'none'
          }
          if (flockBtn) {
            flockBtn.style.display = 'none'
          }
          if (herdBtn) {
            herdBtn.style.display = 'none'
          }
          if (orgUnitsBtn) {
            orgUnitsBtn.style.display = 'none'
          }
          if (labSampleBtn) {
            labSampleBtn.style.display = 'none'
          }
          if (quarantineBtn) {
            quarantineBtn.style.display = 'none'
          }
          if (spotCheckBtn) {
            spotCheckBtn.style.display = 'none'
          }
          if (inventoryItemBtn) {
            inventoryItemBtn.style.display = 'none'
          }
          if (incomingTransferBtn) {
            incomingTransferBtn.style.display = 'none'
          }
          if (outgoingTransferBtn) {
            outgoingTransferBtn.style.display = 'none'
          }
          if (petsBtn) {
            petsBtn.style.display = 'none'
          }
          if (petPassportBtn) {
            petPassportBtn.style.display = 'none'
          }
          if (incomingPetsBtn) {
            incomingPetsBtn.style.display = 'none'
          }
          if (outgoingPetsBtn) {
            outgoingPetsBtn.style.display = 'none'
          }
          // Checks for all other holdings without a keeper
        } else if (gridType === 'HOLDING' && holdingStatus === 'NO-KEEPER' && holdingType &&
          (holdingType !== '7' || holdingType !== '15' || holdingType !== '16' || holdingType !== '17')) {
          if (animalsBtn) {
            animalsBtn.style.display = 'none'
          }
          if (flockBtn) {
            flockBtn.style.display = 'none'
          }
          if (herdBtn) {
            herdBtn.style.display = 'none'
          }
          if (outgoingMovementDocBtn) {
            outgoingMovementDocBtn.style.display = 'none'
          }
          if (incomingMovementDocBtn) {
            incomingMovementDocBtn.style.display = 'none'
          }
          if (labSampleBtn) {
            labSampleBtn.style.display = 'none'
          }
          if (quarantineBtn) {
            quarantineBtn.style.display = 'none'
          }
          if (spotCheckBtn) {
            spotCheckBtn.style.display = 'none'
          }
          if (inventoryItemBtn) {
            inventoryItemBtn.style.display = 'none'
          }
          if (incomingTransferBtn) {
            incomingTransferBtn.style.display = 'none'
          }
          if (outgoingTransferBtn) {
            outgoingTransferBtn.style.display = 'none'
          }
        } else {
          // Holdings of type Animal shelter
          if (gridType === 'HOLDING' && holdingType === '15') {
            if (incomingPetsBtn) {
              incomingPetsBtn.style.display = 'block'
            }
            if (petQuarantineBtn) {
              petQuarantineBtn.style.display = 'block'
            }
          }
          // Holdings of type Vet clinic
          if (gridType === 'HOLDING' && holdingType === '17') {
            if (petsBtn) {
              petsBtn.style.display = 'block'
            }
            if (outgoingPetsBtn) {
              outgoingPetsBtn.style.display = 'block'
            }
            if (incomingPetsBtn) {
              incomingPetsBtn.style.display = 'block'
            }
          }
          // Holdings of type Vet station
          if (gridType === 'HOLDING' && holdingType === '16') {
            if (orgUnitsBtn) {
              orgUnitsBtn.style.display = 'block'
            }
            if (petPassportBtn) {
              petPassportBtn.style.display = 'block'
            }
          }
          // Holdings without a type
          if (!holdingType && listOfItems.length > 10) {
            if (this.props.wasClickedFromRecentTab) {
              if (labSampleBtn) {
                labSampleBtn.style.display = 'none'
              }
              if (quarantineBtn) {
                quarantineBtn.style.display = 'none'
              }
              if (spotCheckBtn) {
                spotCheckBtn.style.display = 'none'
              }
              if (inventoryItemBtn) {
                inventoryItemBtn.style.display = 'none'
              }
              if (incomingTransferBtn) {
                incomingTransferBtn.style.display = 'none'
              }
              if (outgoingTransferBtn) {
                outgoingTransferBtn.style.display = 'none'
              }
              this.hideButtons()
            }
            if (orgUnitsBtn) {
              orgUnitsBtn.style.display = 'none'
            }
            if (petsBtn) {
              petsBtn.style.display = 'none'
            }
            if (petPassportBtn) {
              petPassportBtn.style.display = 'none'
            }
            if (incomingPetsBtn) {
              incomingPetsBtn.style.display = 'none'
            }
            if (outgoingPetsBtn) {
              outgoingPetsBtn.style.display = 'none'
            }
            if (animalsBtn) {
              animalsBtn.style.display = 'block'
            }
            if (flockBtn) {
              flockBtn.style.display = 'block'
            }
            if (herdBtn) {
              herdBtn.style.display = 'block'
            }
          }
          // All other types of holdings
          if (gridType === 'HOLDING' && holdingType && (holdingType !== '7' || holdingType !== '16' || holdingType !== '17')) {
            if (this.props.wasClickedFromRecentTab) {
              if (outgoingMovementDocBtn) {
                outgoingMovementDocBtn.style.display = 'none'
              }
              if (incomingMovementDocBtn) {
                incomingMovementDocBtn.style.display = 'none'
              }
              if (labSampleBtn) {
                labSampleBtn.style.display = 'none'
              }
              if (quarantineBtn) {
                quarantineBtn.style.display = 'none'
              }
              if (spotCheckBtn) {
                spotCheckBtn.style.display = 'none'
              }
              if (inventoryItemBtn) {
                inventoryItemBtn.style.display = 'none'
              }
              if (incomingTransferBtn) {
                incomingTransferBtn.style.display = 'none'
              }
              if (outgoingTransferBtn) {
                outgoingTransferBtn.style.display = 'none'
              }
              this.hideButtons()
            }
            if (animalsBtn) {
              animalsBtn.style.display = 'block'
            }
            if (flockBtn) {
              flockBtn.style.display = 'block'
            }
            if (herdBtn) {
              herdBtn.style.display = 'block'
            }
          }
        }
        // Checks for the Pet button in the Health passport screen
        if (gridToDisplay === 'HOLDING' && gridType === 'HEALTH_PASSPORT') {
          if (holdingType !== '16') {
            const newListOfButtons = listOfItems.splice(1, 1)
            listOfButtons = newListOfButtons
          }
        }
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
                selectedItems[i].row[menuType + '.' + 'ORG_UNIT_TYPE'] ||
                selectedItems[i].row[menuType + '.' + 'HOLDER_TYPE']

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
                const terminatedAnimalsBtn = document.getElementById('list_item_terminated_animals')
                const incomingAnimalsBtn = document.getElementById('list_item_animal_movement')
                const finishedIncomingAnimalsBtn = document.getElementById('list_item_finished_animal_movement')
                const outgoingAnimalsBtn = document.getElementById('list_item_outgoing_animals')
                const finishedOutgoingAnimalsBtn = document.getElementById('list_item_finished_outgoing_animals')
                const incomingFlocksBtn = document.getElementById('list_item_flock_movement')
                const finishedIncomingFlockBtn = document.getElementById('list_item_finished_flock_movement')
                const outgoingFlocksBtn = document.getElementById('list_item_outgoing_flocks')
                const finishedOutgoingFlockBtn = document.getElementById('list_item_finished_outgoing_flocks')
                const incomingHerdsBtn = document.getElementById('list_item_herd_movement')
                const finishedIncomingHerdsBtn = document.getElementById('list_item_finished_herd_movement')
                const outgoingHerdsBtn = document.getElementById('list_item_outgoing_herds')
                const finishedOutgoingHerdsBtn = document.getElementById('list_item_finished_outgoing_herds')
                if (varId === 'list_item_animal') {
                  if (terminatedAnimalsBtn) {
                    terminatedAnimalsBtn.style.display = 'block'
                    terminatedAnimalsBtn.style.paddingLeft = '2.5rem'
                  }
                  if (incomingAnimalsBtn) {
                    incomingAnimalsBtn.style.display = 'block'
                    incomingAnimalsBtn.style.paddingLeft = '2.5rem'
                  }
                  if (finishedIncomingAnimalsBtn) {
                    finishedIncomingAnimalsBtn.style.display = 'block'
                    finishedIncomingAnimalsBtn.style.paddingLeft = '2.5rem'
                  }
                  if (outgoingAnimalsBtn) {
                    outgoingAnimalsBtn.style.display = 'block'
                    outgoingAnimalsBtn.style.paddingLeft = '2.5rem'
                  }
                  if (finishedOutgoingAnimalsBtn) {
                    finishedOutgoingAnimalsBtn.style.display = 'block'
                    finishedOutgoingAnimalsBtn.style.paddingLeft = '2.5rem'
                  }
                  if (incomingFlocksBtn) {
                    incomingFlocksBtn.style.display = 'none'
                  }
                  if (finishedIncomingFlockBtn) {
                    finishedIncomingFlockBtn.style.display = 'none'
                  }
                  if (outgoingFlocksBtn) {
                    outgoingFlocksBtn.style.display = 'none'
                  }
                  if (finishedOutgoingFlockBtn) {
                    finishedOutgoingFlockBtn.style.display = 'none'
                  }
                  if (incomingHerdsBtn) {
                    incomingHerdsBtn.style.display = 'none'
                  }
                  if (finishedIncomingHerdsBtn) {
                    finishedIncomingHerdsBtn.style.display = 'none'
                  }
                  if (outgoingHerdsBtn) {
                    outgoingHerdsBtn.style.display = 'none'
                  }
                  if (finishedOutgoingHerdsBtn) {
                    finishedOutgoingHerdsBtn.style.display = 'none'
                  }
                } else {
                  if (varId !== 'list_item_terminated_animals' && varId !== 'list_item_animal_movement' &&
                    varId !== 'list_item_finished_animal_movement' && varId !== 'list_item_outgoing_animals' &&
                    varId !== 'list_item_finished_outgoing_animals') {
                    if (terminatedAnimalsBtn) {
                      terminatedAnimalsBtn.style.display = 'none'
                    }
                    if (incomingAnimalsBtn) {
                      incomingAnimalsBtn.style.display = 'none'
                    }
                    if (finishedIncomingAnimalsBtn) {
                      finishedIncomingAnimalsBtn.style.display = 'none'
                    }
                    if (outgoingAnimalsBtn) {
                      outgoingAnimalsBtn.style.display = 'none'
                    }
                    if (finishedOutgoingAnimalsBtn) {
                      finishedOutgoingAnimalsBtn.style.display = 'none'
                    }
                  }

                  if (varId === 'list_item_flock') {
                    if (incomingFlocksBtn) {
                      incomingFlocksBtn.style.display = 'block'
                      incomingFlocksBtn.style.paddingLeft = '2.5rem'
                    }
                    if (finishedIncomingFlockBtn) {
                      finishedIncomingFlockBtn.style.display = 'block'
                      finishedIncomingFlockBtn.style.paddingLeft = '2.5rem'
                    }
                    if (outgoingFlocksBtn) {
                      outgoingFlocksBtn.style.display = 'block'
                      outgoingFlocksBtn.style.paddingLeft = '2.5rem'
                    }
                    if (finishedOutgoingFlockBtn) {
                      finishedOutgoingFlockBtn.style.display = 'block'
                      finishedOutgoingFlockBtn.style.paddingLeft = '2.5rem'
                    }
                    if (incomingHerdsBtn) {
                      incomingHerdsBtn.style.display = 'none'
                    }
                    if (finishedIncomingHerdsBtn) {
                      finishedIncomingHerdsBtn.style.display = 'none'
                    }
                    if (outgoingHerdsBtn) {
                      outgoingHerdsBtn.style.display = 'none'
                    }
                    if (finishedOutgoingHerdsBtn) {
                      finishedOutgoingHerdsBtn.style.display = 'none'
                    }
                  }

                  if (varId === 'list_item_herd') {
                    if (incomingHerdsBtn) {
                      incomingHerdsBtn.style.display = 'block'
                      incomingHerdsBtn.style.paddingLeft = '2.5rem'
                    }
                    if (finishedIncomingHerdsBtn) {
                      finishedIncomingHerdsBtn.style.display = 'block'
                      finishedIncomingHerdsBtn.style.paddingLeft = '2.5rem'
                    }
                    if (outgoingHerdsBtn) {
                      outgoingHerdsBtn.style.display = 'block'
                      outgoingHerdsBtn.style.paddingLeft = '2.5rem'
                    }
                    if (finishedOutgoingHerdsBtn) {
                      finishedOutgoingHerdsBtn.style.display = 'block'
                      finishedOutgoingHerdsBtn.style.paddingLeft = '2.5rem'
                    }
                    if (incomingFlocksBtn) {
                      incomingFlocksBtn.style.display = 'none'
                    }
                    if (finishedIncomingFlockBtn) {
                      finishedIncomingFlockBtn.style.display = 'none'
                    }
                    if (outgoingFlocksBtn) {
                      outgoingFlocksBtn.style.display = 'none'
                    }
                    if (finishedOutgoingFlockBtn) {
                      finishedOutgoingFlockBtn.style.display = 'none'
                    }
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
                  customGridId,
                  holdingType
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
                this.hideButtons()
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
                this.hideButtons()
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
              : {
                className:
                  varId === 'list_item_holding_details' ? `${sideMenuStyle.custom_holding_li_item}`
                    : varId === 'list_item_animal' ? `${sideMenuStyle.custom_animal_li_item}`
                      : varId === 'list_item_flock' ? `${sideMenuStyle.custom_flock_li_item}`
                        : varId === 'list_item_herd' ? `${sideMenuStyle.custom_herd_li_item}`
                          : `list-group-item ${sideMenuStyle.li_item}`
              }
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

      const peopleListItem = (
        <li
          id='peopleListItem'
          className={`${sideMenuStyle.custom_li_item} custom_li_item_people`}
          onClick={this.displayOrHideHoldingPeople}
        >
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.people`,
            defaultMessage: `${config.labelBasePath}.main.people`
          })}
          <span style={{ float: 'right' }}>
            <i id='chevron_icon_people' class='fa fa-chevron-right' />
          </span>
        </li>
      )
      const peopleListItemSlaughterhouse = (
        <li
          id='peopleListItem'
          className={`${sideMenuStyle.custom_li_item} custom_li_item_people`}
          onClick={this.displayOrHideHoldingPeopleInSlaughterhouse}
        >
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.people`,
            defaultMessage: `${config.labelBasePath}.main.people`
          })}
          <span style={{ float: 'right' }}>
            <i id='chevron_icon_people_slaughterhouse' class='fa fa-chevron-right' />
          </span>
        </li>
      )

      const movementsItem = (
        <li
          id='movementsListItem'
          className={`${sideMenuStyle.custom_li_item} custom_li_item_movements`}
          onClick={this.displayOrHideMovements}
        >
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.movements`,
            defaultMessage: `${config.labelBasePath}.main.movements`
          })}
          <span style={{ float: 'right' }}>
            <i id='chevron_icon_movements' class='fa fa-chevron-right' />
          </span>
        </li>
      )
      const movementsItemSlaughterhouse = (
        <li
          id='movementsListItem'
          className={`${sideMenuStyle.custom_li_item} custom_li_item_movements`}
          onClick={this.displayOrHideMovementsInSlaughterhouse}
        >
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.movements`,
            defaultMessage: `${config.labelBasePath}.main.movements`
          })}
          <span style={{ float: 'right' }}>
            <i id='chevron_icon_movements_slaughterhouse' class='fa fa-chevron-right' />
          </span>
        </li>
      )

      const inventoryListItem = (
        <li
          id='inventoryListItem'
          className={`${sideMenuStyle.custom_li_item} custom_li_item_inventory`}
          onClick={this.displayOrHideInventory}
        >
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.inventory`,
            defaultMessage: `${config.labelBasePath}.main.inventory`
          })}
          <span style={{ float: 'right' }}>
            <i id='chevron_icon_inventory' class='fa fa-chevron-right' />
          </span>
        </li>
      )

      const otherListItem = (
        <li
          id='otherListItem'
          className={`${sideMenuStyle.custom_li_item} custom_li_item_other`}
          onClick={this.displayOrHideOther}
        >
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.other`,
            defaultMessage: `${config.labelBasePath}.main.other`
          })}
          <span style={{ float: 'right' }}>
            <i id='chevron_icon_other' class='fa fa-chevron-right' />
          </span>
        </li>
      )
      const otherListSlaughterhouseItem = (
        <li
          id='otherListItem'
          className={`${sideMenuStyle.custom_li_item} custom_li_item_other`}
          onClick={this.displayOrHideOtherInSlaughterhouse}
        >
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.other`,
            defaultMessage: `${config.labelBasePath}.main.other`
          })}
          <span style={{ float: 'right' }}>
            <i id='chevron_icon_other_slaughterhouse' class='fa fa-chevron-right' />
          </span>
        </li>
      )

      const petsShelterItem = (
        <li
          id='petsShelterItem'
          className={`${sideMenuStyle.custom_li_item} custom_li_item_other`}
          onClick={this.displayOrHidePetShelter}
        >
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.pets`,
            defaultMessage: `${config.labelBasePath}.main.pets`
          })}
          <span style={{ float: 'right' }}>
            <i id='chevron_icon_pets' class='fa fa-chevron-right' />
          </span>
        </li>
      )

      if (gridType === 'HOLDING') {
        if (['FVIRO'].includes(splitGetUsers[0]) || ['CVIRO'].includes(splitGetUsers[0]) || ['LABORANT'].includes(splitGetUsers[0])) {
          const labSampleBtn = document.getElementById('list_item_lab_sample')
          if (labSampleBtn) {
            labSampleBtn.style.display = 'block'
            labSampleBtn.style.paddingLeft = null
          }
        } else {
          if (!holdingType || (holdingType !== '7' && holdingType !== '15' && holdingType !== '16' && holdingType !== '17')) {
            htmlBuffer.splice(1, 0, peopleListItem)

            if (holdingStatus !== 'NO-KEEPER') {
              htmlBuffer.splice(7, 0, movementsItem)
              htmlBuffer.splice(28, 0, inventoryListItem)
              htmlBuffer.splice(32, 0, otherListItem)
            }
          } else if (holdingType === '7') {
            htmlBuffer.splice(1, 0, peopleListItemSlaughterhouse)

            if (holdingStatus !== 'NO-KEEPER') {
              htmlBuffer.splice(6, 0, movementsItemSlaughterhouse)
              htmlBuffer.splice(16, 0, inventoryListItem)
              htmlBuffer.splice(20, 0, otherListSlaughterhouseItem)
            }
          } else if (holdingType === '15') {
            htmlBuffer.splice(1, 0, peopleListItemSlaughterhouse)
            if (holdingStatus !== 'NO-KEEPER') {
              htmlBuffer.splice(6, 0, petsShelterItem)
            }
          } else if (holdingType === '16' || holdingType === '17') {
            htmlBuffer.splice(1, 0, peopleListItemSlaughterhouse)
          }
        }
      }
      return { htmlBuffer, documentsFound, documentBuffer }
    }
  }

  displayOrHideHoldingPeople = () => {
    this.setState(prevState => { this.setState({ changeHoldingPeopleState: !prevState.changeHoldingPeopleState }) })
  }

  displayOrHideHoldingPeopleInSlaughterhouse = () => {
    this.setState(prevState => { this.setState({ changeHoldingPeopleSlaughterhouseState: !prevState.changeHoldingPeopleSlaughterhouseState }) })
  }

  handleDisplayingHoldingPeople = show => {
    store.dispatch({ type: 'RESET_HISTORY_TAB' })
    const keeperItem = document.getElementById('list_item_holding_keeper')
    const herderItem = document.getElementById('list_item_holding_herder')
    const associatedItem = document.getElementById('list_item_holding_associated')
    const membershipItem = document.getElementById('list_item_holding_membership')
    const keeperHistoryItem = document.getElementById('list_item_holding_keeper_history')
    const chevronIcon = document.getElementById('chevron_icon_people')
    if (show) {
      if (keeperItem && herderItem && associatedItem && membershipItem && chevronIcon) {
        keeperItem.style.display = 'block'
        keeperItem.style.paddingLeft = '2.5rem'
        herderItem.style.display = 'block'
        herderItem.style.paddingLeft = '2.5rem'
        associatedItem.style.display = 'block'
        associatedItem.style.paddingLeft = '2.5rem'
        membershipItem.style.display = 'block'
        membershipItem.style.paddingLeft = '2.5rem'
        keeperHistoryItem.style.display = 'block'
        keeperHistoryItem.style.paddingLeft = '2.5rem'
        chevronIcon.className = 'fa fa-chevron-down'
      }
    } else {
      if (keeperItem && herderItem && associatedItem && membershipItem && chevronIcon) {
        keeperItem.style.display = 'none'
        herderItem.style.display = 'none'
        associatedItem.style.display = 'none'
        membershipItem.style.display = 'none'
        keeperHistoryItem.style.display = 'none'
        chevronIcon.className = 'fa fa-chevron-right'
      }
    }
  }

  handleDisplayingHoldingPeopleInSlaughterhouse = show => {
    store.dispatch({ type: 'RESET_HISTORY_TAB' })
    const keeperItem = document.getElementById('list_item_holding_keeper')
    const associatedItem = document.getElementById('list_item_holding_associated')
    const membershipItem = document.getElementById('list_item_holding_membership')
    const keeperHistoryItem = document.getElementById('list_item_holding_keeper_history')
    const chevronIcon = document.getElementById('chevron_icon_people_slaughterhouse')
    if (show) {
      if (keeperItem && associatedItem && chevronIcon) {
        keeperItem.style.display = 'block'
        keeperItem.style.paddingLeft = '2.5rem'
        associatedItem.style.display = 'block'
        associatedItem.style.paddingLeft = '2.5rem'
        membershipItem.style.display = 'block'
        membershipItem.style.paddingLeft = '2.5rem'
        keeperHistoryItem.style.display = 'block'
        keeperHistoryItem.style.paddingLeft = '2.5rem'
        chevronIcon.className = 'fa fa-chevron-down'
      }
    } else {
      if (keeperItem && associatedItem && chevronIcon) {
        keeperItem.style.display = 'none'
        associatedItem.style.display = 'none'
        membershipItem.style.display = 'none'
        keeperHistoryItem.style.display = 'none'
        chevronIcon.className = 'fa fa-chevron-right'
      }
    }
  }

  displayOrHideMovements = () => {
    this.setState(prevState => { this.setState({ changeMovementsState: !prevState.changeMovementsState }) })
  }

  handleDisplayingMovements = show => {
    store.dispatch({ type: 'RESET_HISTORY_TAB' })
    const outgoingDocsItem = document.getElementById('movement_document')
    const finishedOutgoingMovementDocBtn = document.getElementById('finished_movement_document')
    const incomingDocsItem = document.getElementById('movement_document_incoming')
    const finishedIncomingMovementDocBtn = document.getElementById('finished_movement_document_incoming')
    const chevronIcon = document.getElementById('chevron_icon_movements')
    if (show) {
      if (outgoingDocsItem && incomingDocsItem && chevronIcon) {
        outgoingDocsItem.style.display = 'block'
        outgoingDocsItem.style.paddingLeft = '2.5rem'
        finishedOutgoingMovementDocBtn.style.display = 'block'
        finishedOutgoingMovementDocBtn.style.paddingLeft = '2.5rem'
        incomingDocsItem.style.display = 'block'
        incomingDocsItem.style.paddingLeft = '2.5rem'
        finishedIncomingMovementDocBtn.style.display = 'block'
        finishedIncomingMovementDocBtn.style.paddingLeft = '2.5rem'
        chevronIcon.className = 'fa fa-chevron-down'
      }
    } else {
      if (outgoingDocsItem && incomingDocsItem && chevronIcon) {
        outgoingDocsItem.style.display = 'none'
        finishedOutgoingMovementDocBtn.style.display = 'none'
        incomingDocsItem.style.display = 'none'
        finishedIncomingMovementDocBtn.style.display = 'none'
        chevronIcon.className = 'fa fa-chevron-right'
      }
    }
  }

  displayOrHideMovementsInSlaughterhouse = () => {
    this.setState(prevState => { this.setState({ changeMovementsSlaugherhouseState: !prevState.changeMovementsSlaugherhouseState }) })
  }

  handleDisplayingMovementsInSlaughterhouse = show => {
    store.dispatch({ type: 'RESET_HISTORY_TAB' })
    const incomingDocsItem = document.getElementById('movement_document_incoming')
    const finishedIncomingMovementDocBtn = document.getElementById('finished_movement_document_incoming')
    const chevronIcon = document.getElementById('chevron_icon_movements_slaughterhouse')
    if (show) {
      if (incomingDocsItem && finishedIncomingMovementDocBtn && chevronIcon) {
        incomingDocsItem.style.display = 'block'
        incomingDocsItem.style.paddingLeft = '2.5rem'
        finishedIncomingMovementDocBtn.style.display = 'block'
        finishedIncomingMovementDocBtn.style.paddingLeft = '2.5rem'
        chevronIcon.className = 'fa fa-chevron-down'
      }
    } else {
      if (incomingDocsItem && chevronIcon) {
        incomingDocsItem.style.display = 'none'
        finishedIncomingMovementDocBtn.style.display = 'none'
        chevronIcon.className = 'fa fa-chevron-right'
      }
    }
  }

  displayOrHideOther = () => {
    this.setState(prevState => { this.setState({ changeOtherState: !prevState.changeOtherState }) })
  }

  handleDisplayingOther = show => {
    store.dispatch({ type: 'RESET_HISTORY_TAB' })
    const labSampleItem = document.getElementById('list_item_lab_sample')
    const quarantineItem = document.getElementById('list_item_export_quarantine')
    const spotCheckItem = document.getElementById('list_item_spot_check')
    const chevronIcon = document.getElementById('chevron_icon_other')
    if (show) {
      if (labSampleItem && quarantineItem && spotCheckItem && chevronIcon) {
        labSampleItem.style.display = 'block'
        labSampleItem.style.paddingLeft = '2.5rem'
        quarantineItem.style.display = 'block'
        quarantineItem.style.paddingLeft = '2.5rem'
        spotCheckItem.style.display = 'block'
        spotCheckItem.style.paddingLeft = '2.5rem'
        chevronIcon.className = 'fa fa-chevron-down'
      }
    } else {
      if (labSampleItem && quarantineItem && spotCheckItem && chevronIcon) {
        labSampleItem.style.display = 'none'
        quarantineItem.style.display = 'none'
        spotCheckItem.style.display = 'none'
        chevronIcon.className = 'fa fa-chevron-right'
      }
    }
  }

  displayOrHideOtherInSlaughterhouse = () => {
    this.setState(prevState => { this.setState({ changeOtherSlaughterhouseState: !prevState.changeOtherSlaughterhouseState }) })
  }

  handleDisplayingOtherInSlaughterhouse = show => {
    store.dispatch({ type: 'RESET_HISTORY_TAB' })
    const labSampleItem = document.getElementById('list_item_lab_sample')
    const chevronIcon = document.getElementById('chevron_icon_other_slaughterhouse')
    if (show) {
      if (labSampleItem && chevronIcon) {
        labSampleItem.style.display = 'block'
        labSampleItem.style.paddingLeft = '2.5rem'
        chevronIcon.className = 'fa fa-chevron-down'
      }
    } else {
      if (labSampleItem && chevronIcon) {
        labSampleItem.style.display = 'none'
        chevronIcon.className = 'fa fa-chevron-right'
      }
    }
  }

  displayOrHideInventory = () => {
    this.setState(prevState => { this.setState({ changeInvetoryState: !prevState.changeInvetoryState }) })
  }

  handleDisplayingInventory = show => {
    store.dispatch({ type: 'RESET_HISTORY_TAB' })
    const inventoryItem = document.getElementById('list_item_ivinventory_item')
    const incomingTransferItem = document.getElementById('list_item_income_transfer')
    const outgoingTransferItem = document.getElementById('list_item_outcome_transfer')
    const chevronIcon = document.getElementById('chevron_icon_inventory')
    if (show) {
      if (inventoryItem && incomingTransferItem && outgoingTransferItem && chevronIcon) {
        inventoryItem.style.display = 'block'
        inventoryItem.style.paddingLeft = '2.5rem'
        incomingTransferItem.style.display = 'block'
        incomingTransferItem.style.paddingLeft = '2.5rem'
        outgoingTransferItem.style.display = 'block'
        outgoingTransferItem.style.paddingLeft = '2.5rem'
        chevronIcon.className = 'fa fa-chevron-down'
      }
    } else {
      if (inventoryItem && incomingTransferItem && outgoingTransferItem && chevronIcon) {
        inventoryItem.style.display = 'none'
        incomingTransferItem.style.display = 'none'
        outgoingTransferItem.style.display = 'none'
        chevronIcon.className = 'fa fa-chevron-right'
      }
    }
  }

  handleDisplayingPetsShelter = show => {
    store.dispatch({ type: 'RESET_HISTORY_TAB' })
    const activePetsItem = document.getElementById('list_item_pet')
    const terminatedPetsItem = document.getElementById('list_item_terminated_pet')
    const outgoingPetsItem = document.getElementById('list_item_outgoing_pets')
    const chevronIcon = document.getElementById('chevron_icon_pets')
    if (show) {
      if (activePetsItem && terminatedPetsItem && outgoingPetsItem && chevronIcon) {
        activePetsItem.style.display = 'block'
        activePetsItem.style.paddingLeft = '2.5rem'
        terminatedPetsItem.style.display = 'block'
        terminatedPetsItem.style.paddingLeft = '2.5rem'
        outgoingPetsItem.style.display = 'block'
        outgoingPetsItem.style.paddingLeft = '2.5rem'
        chevronIcon.className = 'fa fa-chevron-down'
      }
    } else {
      if (activePetsItem && terminatedPetsItem && outgoingPetsItem && chevronIcon) {
        activePetsItem.style.display = 'none'
        terminatedPetsItem.style.display = 'none'
        outgoingPetsItem.style.display = 'none'
        chevronIcon.className = 'fa fa-chevron-right'
      }
    }
  }

  displayOrHidePetShelter = () => {
    this.setState(prevState => { this.setState({ changePetsShelterState: !prevState.changePetsShelterState }) })
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
        <button
          style={
            {
              height: '0px',
              width: '0px',
              display: 'none'
            }
          }
          id='filterTerminatedAnimalsByDate'
          onClick={this.handleTerminatedAnimalsFilter}
        />
        <button
          style={
            {
              height: '0px',
              width: '0px',
              display: 'none'
            }
          }
          id='filterMovementDocumentsByDate'
          onClick={this.handleFinishedMovementDocumentsFilter}
        />
        <button
          style={
            {
              height: '0px',
              width: '0px',
              display: 'none'
            }
          }
          id='filterMovementsByDate'
          onClick={this.handleFinishedMovementsFilter}
        />
        <button
          style={
            {
              height: '0px',
              width: '0px',
              display: 'none'
            }
          }
          id='filterOutgoingTransfers'
          onClick={this.handleOutgoingTransfersFilter}
        />
        <button
          style={
            {
              height: '0px',
              width: '0px',
              display: 'none'
            }
          }
          id='filterIncomingTransfers'
          onClick={this.handleIncomingTransfersFilter}
        />
        <button
          style={
            {
              height: '0px',
              width: '0px',
              display: 'none'
            }
          }
          id='filterTerminatedPetsByDate'
          onClick={this.handleTerminatedPetsFilter}
        />
        <button
          style={
            {
              height: '0px',
              width: '0px',
              display: 'none'
            }
          }
          id='filterReleasedPetsByDate'
          onClick={this.handleReleasedPetsFilter}
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
  removedKeeperFromHolding: state.dropLink.removedKeeperFromHolding,
  shouldRefreshSideMenu: state.changeStatus.shouldRefreshSideMenu,
  wasClickedFromRecentTab: state.historyReducer.wasClickedFromRecentTab
})

export default connect(mapStateToProps)(SideMenu)
