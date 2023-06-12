import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { isValidArray, isValidObject, strcmp } from 'functions/utils'
import {
  ExecuteActionOnSelectedRows, DropLinkBetweenPersonAndHolding,
  AnimalMassGenerator, StandAloneAction, ChangeHoldingStatus,
  SetActivityPeriod, MoveItemsToOrgUnit, MoveItemsByRange,
  MassInventoryItemStatusChange, ChangePetPassportStatus, ReplacePetId,
  PetDirectMovement, InactivatePetOwner, PreprocessRFIDImport, RFIDActions,
  MultiPrintSlaughterhouseLabels, FilterTransfersByRange,
  OutgoingTransferFilter, IncomingTransferFilter,
  ReverseTransfer, CheckRangeValidity, RemoveAnimalFromHerd,
  AddAnimalToHerd, AssignHerdLabSampleToLaboratory
} from 'components/ComponentsIndex'

function findParentId (props) {
  let parentId = 'null'
  props.gridHierarchy.map(grid => {
    if (strcmp(grid.gridType, props.menuType)) {
      parentId = grid.row[props.menuType + '.OBJECT_ID']
    }
  })
  return parentId
}

function findObjectSubType (props) {
  let objectSubType = 'null'
  props.gridHierarchy.map(grid => {
    if (strcmp(grid.gridType, props.menuType)) {
      objectSubType = grid.row[props.menuType + '.TYPE']
    }
  })
  return objectSubType
}

function getHerdAnimalType (props) {
  let herdAnimalType = 'null'
  props.gridHierarchy.map(grid => {
    if (strcmp(grid.gridType, props.menuType)) {
      herdAnimalType = grid.row[props.menuType + '.ANIMAL_TYPE']
    }
  })
  return herdAnimalType
}

function getHerdContactPersonId (props) {
  let herdContactPersonId = 'null'
  props.gridHierarchy.map(grid => {
    if (strcmp(grid.gridType, props.menuType)) {
      herdContactPersonId = grid.row[props.menuType + '.CONTACT_PERSON_ID']
    }
  })
  return herdContactPersonId
}

const ActionListGenerator = (props) => {
  let { menuItemActions, subModuleActions, gridProps, menuType, componentToDisplay } = props
  let gridId, linkName, objectId, selectedObject
  const returnedComponent = []

  if (isValidArray(componentToDisplay, 1)) {
    let key = componentToDisplay[1].props.showForm
    if (key) {
      key = componentToDisplay[1].props.showForm
      objectId = componentToDisplay[1].props.objectId
      gridId = key + '_' + 'FORM' + '_' + objectId
      selectedObject = componentToDisplay[0].props.selectedObject
    } else {
      linkName = componentToDisplay[0].props.gridProps.linkName
      key = componentToDisplay[0].props.gridProps.key
      if (linkName) {
        gridId = key + '_' + linkName
      } else {
        if (strcmp(menuType, 'HERD')) {
          gridId = `${key}1`
        } else {
          gridId = key
        }
      }
      selectedObject = componentToDisplay[0].props.selectedObject
    }
  }

  if (isValidObject(gridProps, 1)) {
    if (isValidArray(subModuleActions, 1) &&
      !strcmp(selectedObject, 'HOLDING_RESPONSIBLE') && !strcmp(selectedObject, 'MOVEMENT_DOC') &&
      !strcmp(selectedObject, 'LAB_SAMPLE') && !strcmp(gridProps.customId, 'TERMINATED_ANIMALS') && !strcmp(gridProps.customId, 'TERMINATED_PETS') &&
      !strcmp(gridProps.customId, 'FINISHED_ANIMAL_MOVEMENTS') && !strcmp(gridProps.customId, 'FINISHED_FLOCK_MOVEMENTS') &&
      !strcmp(gridProps.customId, 'PET_QUARANTINE')
    ) {
      returnedComponent.push(
        <ExecuteActionOnSelectedRows
          key={gridProps.key + '_ACTIONS'}
          gridId={gridProps.key}
          gridType={gridProps.showGrid}
          menuItemActions={subModuleActions}
        />
      )
    } else if (isValidArray(menuItemActions, 1) &&
      !strcmp(selectedObject, 'HOLDING_RESPONSIBLE')
    ) {
      returnedComponent.push(
        <ExecuteActionOnSelectedRows
          gridProps={gridProps}
          key={gridProps.key + '_ACTIONS'}
          gridId={gridProps.key}
          customGridId={gridProps.customGridId || null}
          gridType={gridProps.showGrid}
          menuItemActions={menuItemActions}
        />
      )
    }
  }

  switch (menuType) {
    case 'HOLDING': {
      const objectSubType = findObjectSubType(props)
      if (gridId && menuType) {
        if (strcmp(selectedObject, 'HOLDING')) {
          returnedComponent.push(
            <ChangeHoldingStatus gridType={menuType} gridId={gridId} />
          )
        } else if (strcmp(selectedObject, 'HOLDING_RESPONSIBLE') && !strcmp(linkName, 'HOLDING_RESPONSIBLE_HISTORY')) {
          returnedComponent.push(
            <DropLinkBetweenPersonAndHolding
              gridType={menuType}
              selectedObject={selectedObject}
              linkName={linkName}
            />,
            <SetActivityPeriod gridId={gridId} objectType='HOLDING_HERDER' holdingObjId={gridProps.parentId} />
          )
        } else if (strcmp(selectedObject, 'ANIMAL') && objectSubType !== '7') {
          returnedComponent.push(
            <AnimalMassGenerator gridType={menuType} />
          )
        } else if (strcmp(selectedObject, 'ANIMAL') && strcmp(objectSubType, '7')) {
          returnedComponent.push(
            <MultiPrintSlaughterhouseLabels
              gridType={menuType}
              selectedObject={selectedObject}
            />
          )
        } else if (strcmp(selectedObject, 'INVENTORY_ITEM')) {
          const parentObjId = findParentId(props)
          returnedComponent.push(
            <MoveItemsByRange
              gridId={gridId}
              gridType={menuType}
              selectedObject={selectedObject}
              customGridId={gridProps.customId}
              parentId={parentObjId}
            />
          )
        } else if (strcmp(selectedObject, 'TRANSFER')) {
          const parentId = findParentId(props)
          returnedComponent.push(
            <FilterTransfersByRange
              gridType={menuType}
              selectedObject={selectedObject}
              customGridId={props.gridProps.customId}
              parentId={parentId}
            />,
            <ReverseTransfer
              gridType={menuType}
              selectedObject={selectedObject}
              customGridId={props.gridProps.customId}
              parentId={parentId}
            />
          )
        } else if (strcmp(selectedObject, 'HEALTH_PASSPORT')) {
          returnedComponent.push(
            <ChangePetPassportStatus
              gridType={menuType}
              selectedObject={selectedObject}
            />
          )
        } else if (strcmp(selectedObject, 'PET')) {
          returnedComponent.push(
            <PetDirectMovement
              gridType={menuType}
              selectedObject={selectedObject}
            />
          )
        }
      }
      break
    }

    case 'HERD': {
      const herdObjId = findParentId(props)
      if (strcmp(selectedObject, 'ANIMAL')) {
        const herdAnimalType = getHerdAnimalType(props)
        const herdContactPersonId = getHerdContactPersonId(props)
        returnedComponent.push(
          <AddAnimalToHerd
            gridType={menuType}
            gridId={gridId}
            herdObjId={herdObjId}
            herdAnimalType={herdAnimalType}
            herdContactPersonId={herdContactPersonId}
            selectedObject={selectedObject}
          />,
          <RemoveAnimalFromHerd
            gridType={menuType}
            gridId={gridId}
            herdObjId={herdObjId}
            selectedObject={selectedObject}
          />
        )
      } else if (strcmp(selectedObject, 'LAB_SAMPLE')) {
        returnedComponent.push(
          <AssignHerdLabSampleToLaboratory
            gridType={menuType}
            gridId={gridId}
            herdObjId={herdObjId}
            selectedObject={selectedObject}
          />
        )
      }
      break
    }

    case 'SVAROG_ORG_UNITS': {
      if (gridId) {
        if (strcmp(selectedObject, 'TRANSFER')) {
          const parentObjId = findParentId(props)
          returnedComponent.push(
            <ReverseTransfer
              gridType={menuType}
              selectedObject={selectedObject}
              customGridId={props.gridProps.customId}
              parentId={parentObjId}
            />
          )
          if (strcmp(gridProps.customId, 'TRANSFER_OUTCOME')) {
            returnedComponent.push(
              <OutgoingTransferFilter
                gridType={menuType}
                selectedObject={selectedObject}
                customGridId={props.gridProps.customId}
                parentId={parentObjId}
              />
            )
          } else if (strcmp(gridProps.customId, 'TRANSFER_INCOME')) {
            returnedComponent.push(
              <IncomingTransferFilter
                gridType={menuType}
                selectedObject={selectedObject}
                customGridId={props.gridProps.customId}
                parentId={parentObjId}
              />
            )
          }
        } else if (strcmp(selectedObject, 'INVENTORY_ITEM')) {
          const parentObjId = findParentId(props)
          returnedComponent.push(
            <CheckRangeValidity
              gridId={gridId}
              gridType={menuType}
              selectedObject={selectedObject}
              parentId={parentObjId}
            />,
            <MoveItemsToOrgUnit
              gridId={gridId}
              gridType={menuType}
              selectedObject={selectedObject}
            />,
            <MoveItemsByRange
              gridId={gridId}
              gridType={menuType}
              selectedObject={selectedObject}
              customGridId={gridProps.customId}
              parentId={parentObjId}
            />,
            <MassInventoryItemStatusChange
              gridId={gridId}
              gridType={menuType}
              selectedObject={selectedObject}
            />
          )
        }
      }
      break
    }

    case 'MOVEMENT_DOC': {
      let parentObjId = findParentId(props)
      returnedComponent.push(
        <StandAloneAction
          hasPrompt
          promptTitle='naits.main.actions.check_movement_document_prompt_title'
          promptMessage='naits.main.actions.check_movement_document_prompt_message'
          imgSrc='/naits/img/massActionsIcons/replace.png'
          actionParams={
            {
              method: 'get',
              urlCode: 'CHECK_MOVEMENT_DOCUMENT',
              session: props.session,
              mainParam: parentObjId,
              nameLabel: 'naits.main.actions.check_movement_document'
            }
          }
        />
      )
      break
    }

    case 'PET': {
      if (strcmp(selectedObject, 'HEALTH_PASSPORT')) {
        returnedComponent.push(
          <ChangePetPassportStatus
            gridType={menuType}
            selectedObject={selectedObject}
          />
        )
      } else if (strcmp(selectedObject, 'INVENTORY_ITEM')) {
        returnedComponent.push(
          <ReplacePetId
            gridType={menuType}
            selectedObject={selectedObject}
          />
        )
      } else if (strcmp(selectedObject, 'HOLDING_RESPONSIBLE')) {
        const petObjId = findParentId(props)
        returnedComponent.push(
          <InactivatePetOwner
            gridType={menuType}
            selectedObject={selectedObject}
            petObjId={petObjId}
            linkName={linkName}
          />
        )
      }
      break
    }

    case 'RFID_INPUT': {
      if (strcmp(selectedObject, 'RFID_INPUT_STATE')) {
        let parentObjId = findParentId(props)
        returnedComponent.push(
          <PreprocessRFIDImport
            gridType={menuType}
            selectedObject={selectedObject}
            parentId={parentObjId}
          />,
          <RFIDActions
            gridType={menuType}
            selectedObject={selectedObject}
            parentId={parentObjId}
          />
        )
      }
      break
    }

    default: {
      break
    }
  }

  const component = <div id='action-list'>{returnedComponent}</div>
  const parentComponent = document.getElementById('fixedActionMenu')
  const portalValidation = () => {
    if (parentComponent === null) {
      return null
    } else {
      return ReactDOM.createPortal(component, parentComponent)
    }
  }

  return (
    portalValidation()
  )
}

const mapStateToProps = state => ({
  session: state.security.svSession,
  componentToDisplay: state.componentToDisplay.componentToDisplay,
  isAdmin: state.userInfoReducer.isAdmin,
  userGroup: state.userInfoReducer.getUsers,
  gridHierarchy: state.gridConfig.gridHierarchy
})

export default connect(mapStateToProps)(ActionListGenerator)
