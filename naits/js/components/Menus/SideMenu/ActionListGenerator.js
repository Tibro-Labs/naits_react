import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { isValidArray, isValidObject, strcmp } from 'functions/utils'
import {
  ExecuteActionOnSelectedRows, DropLinkBetweenPersonAndHolding,
  AnimalMassGenerator, StandAloneAction, ChangeHoldingStatus,
  SetActivityPeriod, ChangeTransferStatus, MoveItemsToOrgUnit,
  ReverseTransfer, IndividualReverseTransfer, ChangePetPassportStatus,
  ReplacePetId, ReturnPetToSourceHolding, PetDirectMovement
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
      gridId = key + '_' + linkName
      selectedObject = componentToDisplay[0].props.selectedObject
    }
  }

  if (isValidObject(gridProps, 1)) {
    if (isValidArray(subModuleActions, 1) &&
      !strcmp(selectedObject, 'HOLDING_RESPONSIBLE') && !strcmp(selectedObject, 'MOVEMENT_DOC')
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
        } else if (strcmp(selectedObject, 'HOLDING_RESPONSIBLE')) {
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
            <AnimalMassGenerator gridType={menuType} />,
            <StandAloneAction
              hasPrompt
              promptTitle='naits.main.actions.apply_inventory_items_prompt_title'
              promptMessage='naits.main.actions.apply_inventory_items_prompt_message'
              imgSrc='/naits/img/massActionsIcons/checklist.png'
              actionParams={
                {
                  method: 'get',
                  urlCode: 'APPLY_INVENTORY_ITEMS',
                  session: props.session,
                  mainParam: props.gridProps.parentId,
                  nameLabel: 'naits.main.actions.apply_inventory_items'
                }
              }
            />
          )
        } else if (strcmp(selectedObject, 'TRANSFER')) {
          returnedComponent.push(
            <ChangeTransferStatus
              action='update' gridType={menuType}
              customGridId={props.gridProps.customId}
              selectedObject={selectedObject}
            />,
            <ReverseTransfer
              gridType={menuType}
              customGridId={props.gridProps.customId}
              selectedObject={selectedObject}
            />
          )
        } else if (strcmp(selectedObject, 'INVENTORY_ITEM')) {
          returnedComponent.push(
            <IndividualReverseTransfer
              gridId={gridId}
              gridType={menuType}
              selectedObject={selectedObject}
            />
          )
        } else if (strcmp(selectedObject, 'HEALTH_PASSPORT')) {
          returnedComponent.push(
            <ChangePetPassportStatus
              gridType={menuType}
              selectedObject={selectedObject}
            />
          )
        } else if (strcmp(selectedObject, 'PET_MOVEMENT') &&
          strcmp(props.gridProps.customId, 'OUTGOING_MOVEMENT')) {
          returnedComponent.push(
            <ReturnPetToSourceHolding
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

    case 'SVAROG_ORG_UNITS': {
      if (gridId) {
        if (strcmp(selectedObject, 'TRANSFER')) {
          returnedComponent.push(
            <ChangeTransferStatus
              action='update'
              gridType={menuType}
              customGridId={props.gridProps.customId}
              selectedObject={selectedObject}
            />,
            <ReverseTransfer
              gridType={menuType}
              customGridId={props.gridProps.customId}
              selectedObject={selectedObject}
            />
          )
        } else if (strcmp(selectedObject, 'INVENTORY_ITEM')) {
          returnedComponent.push(
            <MoveItemsToOrgUnit
              gridId={gridId}
              gridType={menuType}
              selectedObject={selectedObject}
            />,
            <IndividualReverseTransfer
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
      }
      break
    }

    default: {
      break
    }
  }

  const component = <div>{returnedComponent}</div>
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
