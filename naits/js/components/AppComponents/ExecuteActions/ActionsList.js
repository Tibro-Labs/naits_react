import React from 'react'
import PropTypes from 'prop-types'
import * as config from 'config/config.js'
import style from './ExecuteActionOnSelectedRows.module.css'
import { isValidArray, insertSpaceAfterAChar } from 'functions/utils'
import { userAttachmentPostMethod, resetConsoleReducerState } from '../Functional/AdminConsole/admConsoleActions'
import ResponseHandler from '../Functional/AdminConsole/ResponseHandler'
import { store, updateSelectedRows } from 'tibro-redux'
import { alertUser } from 'tibro-components'
import { connect } from 'react-redux'
import { ComponentManager, GridManager } from 'components/ComponentsIndex'

class ActionsList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: null
    }
    this.generateSubMenu = this.generateSubMenu.bind(this)
    this.generateEvents = this.generateEvents.bind(this)
    // this.generateGenerateInventoryEvents = this.generateGenerateInventoryEvents.bind(this)
  }

  generateSubMenu (props, type) {
    let component = null
    const slaughteredLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.actions.slaughtered`,
      defaultMessage: `${config.labelBasePath}.actions.slaughtered`
    })
    const diedLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.actions.died`,
      defaultMessage: `${config.labelBasePath}.actions.died`
    })
    const lostLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.actions.lost`,
      defaultMessage: `${config.labelBasePath}.actions.lost`
    })
    const soldLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.actions.sold`,
      defaultMessage: `${config.labelBasePath}.actions.sold`
    })
    const absentLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.actions.absent`,
      defaultMessage: `${config.labelBasePath}.actions.absent`
    })
    const destroyedLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.actions.destroyed`,
      defaultMessage: `${config.labelBasePath}.actions.destroyed`
    })
    if (props.holdingType === '7') {
      component = <div>
        <li id='slaughtered'
          key='slaughtered'
          onClick={() => props.slaughterAndDestroyPrompt('slaughtrd', slaughteredLabel)}>
          {slaughteredLabel}
        </li>
        <li id='destroyed'
          key='destroyed'
          onClick={() => props.slaughterAndDestroyPrompt('destroyed', destroyedLabel)}>
          {destroyedLabel}
        </li>
      </div>
    } else {
      component = <div>
        <li id='slaughtered'
          key='slaughtered'
          onClick={() => props.executeAction(slaughteredLabel, type, 'slaughtrd')}>
          {slaughteredLabel}
        </li>
        <li id='died'
          key='died'
          onClick={() => props.executeAction(diedLabel, type, 'died')}>
          {diedLabel}
        </li>
        <li id='lost'
          key='lost'
          onClick={() => props.executeAction(lostLabel, type, 'lost')}>
          {lostLabel}
        </li>
        <li id='sold'
          key='sold'
          onClick={() => props.executeAction(soldLabel, type, 'sold')}>
          {soldLabel}
        </li>
        <li id='absent'
          key='absent'
          onClick={() => props.executeAction(absentLabel, type, 'absent')}>
          {absentLabel}
        </li>
        <li id='destroyed'
          key='destroyed'
          onClick={() => props.executeAction(destroyedLabel, type, 'destroyed')}>
          {destroyedLabel}
        </li>
      </div>
    }
    return (
      <ul id={type + '_sublist'} key={type + '_sublist'}>
        {component}
      </ul>
    )
  }

  generateLabSampleSubMenu (props, type) {
    let component = null
    const received = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.actions.received`,
      defaultMessage: `${config.labelBasePath}.actions.received`
    })
    const rejectedLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.actions.rejected`,
      defaultMessage: `${config.labelBasePath}.actions.rejected`
    })
    component = <div>
      <li id='received'
        key='received'
        onClick={() => props.executeAction(received, type, 'RECEIVED')}>
        {received}
      </li>
      <li id='rejected'
        key='rejected'
        onClick={() => props.executeAction(rejectedLabel, type, 'REJECTED')}>
        {rejectedLabel}
      </li>
    </div>

    return (
      <ul id={type + '_sublist'} key={type + '_sublist'}>
        {component}
      </ul>
    )
  }

  generateHealthStatusMenu (props, type) {
    let component = null
    const negativeLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.actions.negative`,
      defaultMessage: `${config.labelBasePath}.actions.negative`
    })
    const positiveLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.actions.positive`,
      defaultMessage: `${config.labelBasePath}.actions.positive`
    })
    const inconclusiveLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.actions.inconclusive`,
      defaultMessage: `${config.labelBasePath}.actions.inconclusive`
    })
    component = <div>
      <li id='negative'
        key='negative'
        onClick={() => props.executeAction(negativeLabel, type, 'NEGATIVE')}>
        {negativeLabel}
      </li>
      <li id='positive'
        key='positive'
        onClick={() => props.executeAction(positiveLabel, type, 'POSITIVE')}>
        {positiveLabel}
      </li>
      <li id='inconclusive'
        key='inconclusive'
        onClick={() => props.executeAction(inconclusiveLabel, type, 'INCONCLUSIVE')}>
        {inconclusiveLabel}
      </li>
    </div>

    return (
      <ul id={type + '_sublist'} key={type + '_sublist'} className={style.ul_item}>
        {component}
      </ul>
    )
  }

  changeMovementDocStatus = (props, type) => {
    let component = null
    const released = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.actions.released`,
      defaultMessage: `${config.labelBasePath}.actions.released`
    })
    const cancelled = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.actions.cancelled`,
      defaultMessage: `${config.labelBasePath}.actions.cancelled`
    })
    component = <div>
      {!(props.menuItemActions.includes('omit_release')) &&
        <li id='released'
          key='released'
          onClick={() => props.executeAction(released, type, 'RELEASED')}>
          {released}
        </li>
      }
      <li id='cancelled'
        key='cancelled'
        onClick={() => props.executeAction(cancelled, type, 'CANCELLED')}>
        {cancelled}
      </li>
    </div>

    return (
      <ul id={type + '_sublist'} key={type + '_sublist'}>
        {component}
      </ul>
    )
  }

  movementStatus = (props, type) => {
    let component = null
    const cancelMovement = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.actions.cancel_movement`,
      defaultMessage: `${config.labelBasePath}.actions.cancel_movement`
    })
    const finishMovement = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.actions.finish_movement`,
      defaultMessage: `${config.labelBasePath}.actions.finish_movement`
    })
    component = <div>
      <li id='cancel'
        key='cancel'
        onClick={() => props.executeAction(cancelMovement, 'move', 'CANCEL_MOVEMENT', props.homeId, null)}>
        {cancelMovement}
      </li>
      <li id='finish'
        key='finish'
        onClick={() => props.finishMovementPrompt(null)}>
        {finishMovement}
      </li>
    </div>

    return (
      <ul id={type + '_sublist'} key={type + '_sublist'}>
        {component}
      </ul>
    )
  }

  generateEvents (props, type) {
    let component = null
    let list = []
    const physicalCheck = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.actions.physicalCheck`,
      defaultMessage: `${config.labelBasePath}.actions.physicalCheck`
    })
    if (props.subMenu) {
      if (isValidArray(props.subMenu.items, 1)) {
        const items = props.subMenu.items
        if (items) {
          items.map((item, index) => {
            let eventLabel = item.NOTE
            if (this.props.holdingType === '15') {
              list.push(
                <li id={`${type}_${index}`} key={`${type}_${index}`}
                  onClick={() => props.petMassActionPrompt('campaign', item.object_id, eventLabel)}>
                  {eventLabel}
                </li>
              )
            } else {
              list.push(
                <li id={`${type}_${index}`} key={`${type}_${index}`}
                  onClick={() => props.executeAction(insertSpaceAfterAChar(eventLabel, '/'), type, 'null', item.object_id)}>
                  {eventLabel}
                </li>
              )
            }
          })
        }
      }
    }
    if (this.props.holdingType === '15') {
      component = <React.Fragment>
        <li id='sublist_item_0'
          key='sublist_item_0'
          {... { onClick: () => props.petMassActionPrompt('vaccination', null, null) }}
        >
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.vaccination`,
            defaultMessage: `${config.labelBasePath}.actions.vaccination`
          })}
        </li>
        <li id='sublist_item_1'
          key='sublist_item_1'
          {... { onClick: () => props.petMassActionPrompt('sampling', null, null) }}
        >
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.sampling`,
            defaultMessage: `${config.labelBasePath}.actions.sampling`
          })}
        </li>
      </React.Fragment>
    } else {
      component = <div>
        <li id='physicalCheck'
          key='physicalCheck'
          onClick={() => props.executeAction(physicalCheck, type, 'PHYSICAL_CHECK')}>
          {physicalCheck}
        </li>
      </div>
    }
    return (
      <ul id={type + '_sublist'} key={type + '_sublist'}>
        {component}
        {list}
      </ul>
    )
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
    let userGroup = null
    let gridType = null
    const { svSession, gridHierarchy } = this.props
    let selectedObjects = gridHierarchy
    if (selectedObjects.length > 0) {
      selectedObjects.map(singleObj => {
        if (singleObj.active) {
          gridType = singleObj.gridType
          userGroup = singleObj.row[`${gridType}.GROUP_NAME`]
        }
      })
    }
    if (userGroup && this.props.selectedGridRows.length > 0) {
      const server = `${config.svConfig.restSvcBaseUrl}${config.svConfig.triglavRestVerbs[webService]}`
      const params = `/${svSession}/${userGroup}`
      const objectArray = this.props.selectedGridRows
      const restUrl = server + params
      prompt(this, () => store.dispatch(userAttachmentPostMethod(restUrl, actionName, objectArray)))
    } else {
      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.empty_selection`,
            defaultMessage: `${config.labelBasePath}.alert.empty_selection`
          }), null,
          () => this.setState({ alert: alertUser(false, 'info', '') })
        )
      })
    }
  }

  onAlertClose = () => {
    // Reset console reducer state
    store.dispatch(
      resetConsoleReducerState('RESET_CONSOLE_REDUCER_STATE')
    )
    // Reload data in current grid
    let gridId = this.props.gridId
    store.dispatch(updateSelectedRows([], null))
    ComponentManager.setStateForComponent(gridId + '_USER_DEFAULT_GROUP', 'selectedIndexes', [])
    GridManager.reloadGridData(gridId + '_USER_DEFAULT_GROUP')
    ComponentManager.setStateForComponent(gridId + '_USER_GROUP', 'selectedIndexes', [])
    GridManager.reloadGridData(gridId + '_USER_GROUP')
  }

  generateMenu (props, type) {
    let activityItem = null
    let petActivityItem = null
    let petStatusItem = null
    let petMovementItem = null
    let passportRequestItem = null
    let retireItem = null
    let generateDeathCertificates = null
    let sampleItem = null
    let movementItem = null
    let pendingExportItem = null
    let changeStatusItem = null
    let generateInventoryItem = null
    let moveInventoryItem = null
    let cancelMovementItem = null
    let labSampleItem = null
    let heathStatus = null
    let changeMovDocStatus = null
    let finishItems = null
    let unassignUser = null
    let message = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.actions.start_movement`,
      defaultMessage: `${config.labelBasePath}.actions.start_movement`
    })

    let { componentToDisplay } = this.props
    let gridId, parentId, showGrid, linkName, key
    if (componentToDisplay.length > 0) {
      componentToDisplay.map(component => {
        parentId = component.props.parentId
        showGrid = component.props.showGrid
        linkName = component.props.linkName

        if (showGrid && linkName) {
          gridId = showGrid + '_' + parentId + '_' + linkName + '1'
        } else {
          key = component.key
          gridId = key
        }
      })
    }

    props.menuItemActions.forEach((element) => {
      switch (element) {
        case 'activity': {
          activityItem = <li id='activity' key='activity' className={style.li_item}>
            <div className={style.imgTxtHolder}>
              <span id='activity_text' className={style.actionText}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.actions.activity`,
                  defaultMessage: `${config.labelBasePath}.actions.activity`
                })}
              </span>
              <img id='activity_img' className={style.actionImg}
                src='/naits/img/massActionsIcons/vaccinate_animal.png' />
            </div>
            {this.generateEvents(props, 'activity')}
          </li>
          break
        }
        case 'retire': {
          retireItem = <li id='retire' key='retire' className={style.li_item}>
            <div className={style.imgTxtHolder}>
              <span id='kill_text' className={style.actionText}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.actions.retire`,
                  defaultMessage: `${config.labelBasePath}.actions.retire`
                })}
              </span>
              <img id='kill_img' className={style.actionImg}
                src='/naits/img/massActionsIcons/kill_animal.png' />
            </div>
            {this.generateSubMenu(props, 'retire')}
          </li>
          break
        }

        case 'pet_activity': {
          message = this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.pet_activity`,
            defaultMessage: `${config.labelBasePath}.actions.pet_activity`
          })
          petActivityItem = <li id='pet_activity' key='pet_activity' className={style.li_item}>
            <div className={style.imgTxtHolder}>
              <span id='activity_text' className={style.actionText}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.actions.pet_activity`,
                  defaultMessage: `${config.labelBasePath}.actions.pet_activity`
                })}
              </span>
              <img id='activity_img' className={style.actionImg}
                src='/naits/img/massActionsIcons/vaccinate_animal.png' />
            </div>
            {this.generateEvents(props, 'pet_activity')}
            {/* <li id='sublist_item_2'
                key='sublist_item_2'
                {... { onClick: () => props.petMassActionPrompt('disinfection') }}
              >
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.actions.disinfection`,
                  defaultMessage: `${config.labelBasePath}.actions.disinfection`
                })}
              </li> */}
          </li>
          break
        }

        case 'pet_status': {
          message = this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.change_pet_status`,
            defaultMessage: `${config.labelBasePath}.actions.change_pet_status`
          })
          petStatusItem = <li id='pet_status' key='pet_status' className={style.li_item}>
            <div className={style.imgTxtHolder}>
              <span id='status_text' className={style.actionText}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.actions.change_pet_status`,
                  defaultMessage: `${config.labelBasePath}.actions.change_pet_status`
                })}
              </span>
              <img id='status_img' className={style.actionImg}
                src='/naits/img/massActionsIcons/changeStatus.png' />
            </div>
            <ul id='pet_status_sublist'>
              <li id='sublist_item_0'
                key='sublist_item_0'
                {... { onClick: () => props.petMassActionPrompt('released', null, null) }}
              >
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.actions.released`,
                  defaultMessage: `${config.labelBasePath}.actions.released`
                })}
              </li>
              <li id='sublist_item_1'
                key='sublist_item_1'
                {... { onClick: () => props.petMassActionPrompt('died', null, null) }}
              >
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.actions.died`,
                  defaultMessage: `${config.labelBasePath}.actions.died`
                })}
              </li>
              <li id='sublist_item_2'
                key='sublist_item_2'
                {... { onClick: () => props.petMassActionPrompt('died_euthanasia', null, null) }}
              >
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.actions.died_euthanasia`,
                  defaultMessage: `${config.labelBasePath}.actions.died_euthanasia`
                })}
              </li>
              <li id='sublist_item_3'
                key='sublist_item_3'
                {... { onClick: () => props.petAdoptionPrompt() }}
              >
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.actions.adopted`,
                  defaultMessage: `${config.labelBasePath}.actions.adopted`
                })}
              </li>
            </ul>
          </li>
          break
        }

        case 'pet_movement': {
          message = this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.move_pet`,
            defaultMessage: `${config.labelBasePath}.actions.move_pet`
          })
          petMovementItem = <li id='pet_movement' key='pet_movement' className={style.li_item}>
            <div className={style.imgTxtHolder}>
              <span id='pet_movement_text' className={style.actionText}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.actions.move`,
                  defaultMessage: `${config.labelBasePath}.actions.move`
                })}
              </span>
              <img id='move_img' className={style.actionImg}
                src='/naits/img/massActionsIcons/move_animal.png' />
            </div>
            <ul id='move_sublist' key='move_sublist'>
              <li id='sublist_item_0'
                key='sublist_item_0'
                {... { onClick: () => props.petMovementPrompt() }}
              >
                {message}
              </li>
            </ul>
          </li>
          break
        }

        case 'passport_request': {
          passportRequestItem = <li id='passport_request' key='passport_request' className={style.li_item}>
            <div className={style.imgTxtHolder}>
              <span id='activity_text' className={style.actionText}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.actions.passport_request`,
                  defaultMessage: `${config.labelBasePath}.actions.passport_request`
                })}
              </span>
              <img id='activity_img' className={style.actionImg}
                src='/naits/img/massActionsIcons/animal_health.png' />
            </div>
            <ul id='passport_request_sublist' key='passport_request_sublist'>
              <li id='sublist_item_0'
                key='sublist_item_0'
                {... { onClick: () => props.passportRequestPrompt('accept') }}
              >
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.actions.accept_passport_request`,
                  defaultMessage: `${config.labelBasePath}.actions.accept_passport_request`
                })}
              </li>
              <li id='sublist_item_1'
                key='sublist_item_1'
                {... { onClick: () => props.passportRequestPrompt('decline') }}
              >
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.actions.decline_passport_request`,
                  defaultMessage: `${config.labelBasePath}.actions.decline_passport_request`
                })}
              </li>
            </ul>
          </li>
          break
        }

        case 'movement': {
          if (props.gridId.indexOf('ANIMAL_MOVEMENT') > -1 || props.gridId.indexOf('FLOCK_MOVEMENT') > -1) {
            message = this.context.intl.formatMessage({
              id: `${config.labelBasePath}.actions.finish_movement`,
              defaultMessage: `${config.labelBasePath}.actions.finish_movement`
            })
          }
          movementItem = <li id='move' key='move' className={style.li_item}>
            <div className={style.imgTxtHolder}>
              <span id='move_text' className={style.actionText}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.actions.move`,
                  defaultMessage: `${config.labelBasePath}.actions.move`
                })}
              </span>
              <img id='move_img' className={style.actionImg}
                src='/naits/img/massActionsIcons/move_animal.png' />
            </div>
            <ul id='move_sublist' key='move_sublist'>
              <li id='sublist_item_0'
                key='sublist_item_0'
                {...props.gridId.indexOf('ANIMAL_MOVEMENT') > -1 || props.gridId.indexOf('FLOCK_MOVEMENT') > -1
                  ? { onClick: () => props.executeAction(message, 'move', 'FINISH_MOVEMENT', props.homeId, true) }
                  : { onClick: () => props.searchDestination() }
                }
              >
                {message}
              </li>
            </ul>
          </li>
          break
        }

        case 'cancel_movement': {
          if ((props.gridId.indexOf('ANIMAL_MOVEMENT') > -1 && !gridId.includes('ANIMAL_MOVEMENT_HOLDING')) || (props.gridId.indexOf('FLOCK_MOVEMENT') > -1 && !gridId.includes('FLOCK_MOVEMENT_HOLDING'))) {
            message = this.context.intl.formatMessage({
              id: `${config.labelBasePath}.actions.cancel_movement`,
              defaultMessage: `${config.labelBasePath}.actions.cancel_movement`
            })
          }
          cancelMovementItem = <li id='move' key='move' className={style.li_item}>
            <div className={style.imgTxtHolder}>
              <span id='move_text' className={style.actionText}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.actions.move`,
                  defaultMessage: `${config.labelBasePath}.actions.move`
                })}
              </span>
              <img id='move_img' className={style.actionImg}
                src='/naits/img/massActionsIcons/move_animal.png' />
            </div>
            <ul id='move_sublist' key='move_sublist'>
              <li id='sublist_item_0'
                key='sublist_item_0'
                {...((props.gridId.indexOf('ANIMAL_MOVEMENT') > -1 && !gridId.includes('ANIMAL_MOVEMENT_HOLDING')) || (props.gridId.indexOf('FLOCK_MOVEMENT') > -1 && !gridId.includes('FLOCK_MOVEMENT_HOLDING')))
                  ? { onClick: () => props.executeAction(message, 'move', 'CANCEL_MOVEMENT', props.homeId, null) }
                  : { onClick: () => props.searchDestination() }
                }
              >
                {message}
              </li>
            </ul>
          </li>
          break
        }

        case 'finish_movement': {
          finishItems = <li id='finish_movement' key='finish_movement' className={style.li_item}>
            <div className={style.imgTxtHolder}>
              <span id='kill_text' className={style.actionText}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.actions.move`,
                  defaultMessage: `${config.labelBasePath}.actions.move`
                })}
              </span>
              <img id='kill_img' className={style.actionImg}
                src='/naits/img/massActionsIcons/move_animal.png' />
            </div>
            {this.movementStatus(props, 'move')}
          </li>
          break
        }

        case 'sample_action': {
          message = this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.assign_lab`,
            defaultMessage: `${config.labelBasePath}.actions.assign_lab`
          })
          sampleItem = <li id='sample_action' key='sample_action' className={style.li_item}>
            <div className={style.imgTxtHolder}>
              <span id='kill_text' className={style.actionText}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.actions.sample_action`,
                  defaultMessage: `${config.labelBasePath}.actions.sample_action`
                })}
              </span>
              <img id='generate_premortem_img' className={style.actionImg}
                src='/naits/img/massActionsIcons/generate.png' />
            </div>
            <ul id='generate_premortem_sublist' key='generate_premortem_sublist'>
              <li id='sublist_item_0'
                key='sublist_item_0'
                {... { onClick: () => props.searchDestination() }}
              >
                {message}
              </li>
            </ul>
          </li>
          break
        }

        case 'generateDeathCertificates': {
          if (props.holdingType === '7') {
            const messagePremortem = this.context.intl.formatMessage({
              id: `${config.labelBasePath}.actions.generatePremortem`,
              defaultMessage: `${config.labelBasePath}.actions.generatePremortem`
            })
            const messagePostmortem = this.context.intl.formatMessage({
              id: `${config.labelBasePath}.actions.generatePostmortem`,
              defaultMessage: `${config.labelBasePath}.actions.generatePostmortem`
            })
            generateDeathCertificates = <li id='generateDeathCertificates' key='generateDeathCertificates' className={style.li_item}>
              <div className={style.imgTxtHolder}>
                <span id='kill_text' className={style.actionText}>
                  {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.actions.other`,
                    defaultMessage: `${config.labelBasePath}.actions.other`
                  })}
                </span>
                <img id='generate_premortem_img' className={style.actionImg}
                  src='/naits/img/massActionsIcons/generate.png' />
              </div>
              <ul id='generate_premortem_sublist' key='generate_premortem_sublist'>
                <li id='sublist_item_0'
                  key='sublist_item_0'
                  {... { onClick: () => props.executeAction(messagePremortem, 'other', 'GENERATE_PREMORTEM') }}
                >
                  {messagePremortem}
                </li>
                <li id='sublist_item_1'
                  key='sublist_item_1'
                  {... { onClick: () => props.executeAction(messagePostmortem, 'other', 'GENERATE_POSTMORTEM') }}
                >
                  {messagePostmortem}
                </li>
              </ul>
            </li>
          }
          break
        }

        case 'pendingExport': {
          message = this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.pending_export`,
            defaultMessage: `${config.labelBasePath}.actions.pending_export`
          })
          pendingExportItem = <li id='pendingExport' key='pendingExport' className={style.li_item}>
            <div className={style.imgTxtHolder}>
              <span id='move_text' className={style.actionText}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.actions.pendingExport`,
                  defaultMessage: `${config.labelBasePath}.actions.pendingExport`
                })}
              </span>
              <img id='move_img' className={style.actionImg}
                src='/naits/img/massActionsIcons/move_animal.png' />
            </div>
            <ul id='pendingExport_sublist' key='pendingExport_sublist'>
              <li id='sublist_item_0'
                key='sublist_item_0'
                {... { onClick: () => props.executeAction(message, 'pendingExport', 'EXPORT_ANIMAL', props.exportCertId, true) }}
              >
                {message}
              </li>
            </ul>
          </li>
          break
        }
        case 'change_the_status_of_lab_sample': {
          if (this.props.getUserGroups !== 'CVIRO') {
            labSampleItem = <li id='change_the_status' key='change_the_status' className={style.li_item}>
              <div className={style.imgTxtHolder}>
                <span id='kill_text' className={style.actionText}>
                  {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.change_status`,
                    defaultMessage: `${config.labelBasePath}.change_status`
                  })}
                </span>
                <img id='kill_img' className={style.actionImg}
                  src='/naits/img/massActionsIcons/changeStatus.png' />
              </div>
              {this.generateLabSampleSubMenu(props, 'change_the_status_of_lab_sample')}
            </li>
          }
          break
        }
        case 'set_health_status_to_results': {
          heathStatus = <li id='set_health_status_to_results' key='set_health_status_to_results' className={style.li_item}>
            <div className={style.imgTxtHolder}>
              <span id='animal_health_status' className={style.actionText}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.set_health_status_to_results`,
                  defaultMessage: `${config.labelBasePath}.set_health_status_to_results`
                })}
              </span>
              <img id='animal_health_status' className={style.actionImg}
                src='/naits/img/massActionsIcons/animal_health.png' />
            </div>
            {this.generateHealthStatusMenu(props, 'set_health_status_to_results')}
          </li>
          break
        }
        case 'change_status': {
          message = this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.change_status_delivered`,
            defaultMessage: `${config.labelBasePath}.actions.change_status_delivered`
          })
          changeStatusItem = <li id='change_status' key='change_status' className={style.li_item}>
            <div className={style.imgTxtHolder}>
              <span id='move_text' className={style.actionText}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.actions.change_status`,
                  defaultMessage: `${config.labelBasePath}.actions.change_status`
                })}
              </span>
              <img id='move_img' className={style.actionImg}
                src='/naits/img/massActionsIcons/change_status.png' />
            </div>
            <ul id='changeStatus_sublist' key='changeStatus_sublist'>
              <li id='sublist_item_0'
                key='sublist_item_0'
                {... { onClick: () => props.executeAction(message, 'change_status', 'DELIVERED', 'null', true) }}
              >
                {message}
              </li>
            </ul>
          </li>
          break
        }

        case 'generate_inventory_item': {
          message = this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.generate_inventory_item`,
            defaultMessage: `${config.labelBasePath}.actions.generate_inventory_item`
          })
          generateInventoryItem = <li id='generate_inventory_item' key='generate_inventory_item' className={style.li_item}>
            <div className={style.imgTxtHolder}>
              <span id='generate_inventory_item_text' className={style.actionText}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.actions.generate_inventory_item`,
                  defaultMessage: `${config.labelBasePath}.actions.generate_inventory_item`
                })}
              </span>
              <img id='generate_inventory_item_img' className={style.actionImg}
                src='/naits/img/massActionsIcons/generate.png' />
            </div>
            <ul id='generate_inventory_item_sublist' key='generate_inventory_item_sublist'>
              <li id='sublist_item_0'
                key='sublist_item_0'
                {... { onClick: () => props.executeAction(message, 'generate_inventory_item', 'null', 'null', true) }}
              >
                {message}
              </li>
            </ul>
          </li>
          break
        }
        case 'move_inventory_item': {
          message = this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.move_inventory_item`,
            defaultMessage: `${config.labelBasePath}.actions.move_inventory_item`
          })
          moveInventoryItem = <li id='move_inventory_item' key='move_inventory_item' className={style.li_item}>
            <div className={style.imgTxtHolder}>
              <span id='generate_inventory_item_text' className={style.actionText}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.actions.move_inventory_item`,
                  defaultMessage: `${config.labelBasePath}.actions.move_inventory_item`
                })}
              </span>
              <img id='generate_inventory_item_img' className={style.actionImg}
                src='/naits/img/massActionsIcons/move.png' />
            </div>
            <ul id='generate_inventory_item_sublist' key='generate_inventory_item_sublist'>
              <li id='sublist_item_0'
                key='sublist_item_0'
                {... { onClick: () => props.executeAction(message, 'move_inventory_item', 'null', 'null', true) }}
              >
                {message}
              </li>
            </ul>
          </li>
          break
        }
        case 'change_movement_doc_status': {
          changeMovDocStatus = <li id='change_mov_doc_status' key='change_mov_doc_status' className={style.li_item}
          >
            <div className={style.imgTxtHolder}>
              <span id='kill_text' className={style.actionText}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.change_status`,
                  defaultMessage: `${config.labelBasePath}.change_status`
                })}
              </span>
              <img id='stat_img' className={style.actionImg}
                src='/naits/img/massActionsIcons/changeStatus.png' />
            </div>
            {this.changeMovementDocStatus(this.props, 'change_movement_doc_status')}
          </li>
          break
        }
        case 'unassign_user': {
          unassignUser = <li id='unassign_user' key='unassign_user' className={style.li_item}
            onClick={() => this.applyUserGroup('REMOVE_USERS_FROM_GROUP', 'REMOVE_GROUP')}>
            <div className={style.imgTxtHolder}>
              <span id='unassign_text' className={style.actionText}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.remove_users_from_group`,
                  defaultMessage: `${config.labelBasePath}.main.remove_users_from_group`
                })}
              </span>
              <img id='stat_img' className={style.actionImg}
                src='/naits/img/massActionsIcons/changeStatus.png' />
            </div>
          </li>
          break
        }
      }
    })
    let list = <div id='activateMenu' className={style.menuActivator}>
      <div id='activateImgHolder' className={style.imgTxtHolder}>
        <span id='move_text' className={style.actionText}>
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.form_labels.flock.actions`,
            defaultMessage: `${config.labelBasePath}.form_labels.flock.actions`
          })}
        </span>
        <img id='move_img' className={style.actionImg}
          src='/naits/img/massActionsIcons/actions_general.png' />
      </div>
      <ul id='actionMenu' className={'list-group ' + style.ul_item} >
        {retireItem}
        {finishItems}
        {petActivityItem}
        {petStatusItem}
        {petMovementItem}
        {passportRequestItem}
        {activityItem}
        {movementItem}
        {pendingExportItem}
        {changeStatusItem}
        {generateInventoryItem}
        {moveInventoryItem}
        {generateDeathCertificates}
        {cancelMovementItem}
        {labSampleItem}
        {sampleItem}
        {changeMovDocStatus}
        {heathStatus}
        {unassignUser}
      </ul>
    </div>
    return list
  }

  render () {
    let menu = this.generateMenu(this.props)
    return <React.Fragment>
      <ResponseHandler
        responseState='admConsoleRequests'
        onAlertClose={this.onAlertClose}
      />
      {this.state.alert}
      {menu}
    </React.Fragment>
  }
}

ActionsList.contextTypes = {
  intl: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
  componentToDisplay: state.componentToDisplay.componentToDisplay,
  gridHierarchy: state.gridConfig.gridHierarchy,
  getUserGroups: state.userInfoReducer.getUsers,
  svSession: state.security.svSession,
  selectedGridRows: state.selectedGridRows.selectedGridRows
})

export default connect(mapStateToProps)(ActionsList)
