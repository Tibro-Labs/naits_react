import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import * as config from 'config/config.js'
import { menuConfig } from 'config/menuConfig'
import { store, executeActionOnObjects, updateSelectedRows } from 'tibro-redux'
import { massAnimalOrFlockAction, executeActionOnSelectedRows } from 'backend/executeActionOnSelectedRows.js'
import { massPetAction } from 'backend/massPetAction'
import { massObjectHandlerAction } from 'backend/massObjectHandlerAction'
import { alertUser, Select } from 'tibro-components'
import ActionsList from './ActionsList'
import { ComponentManager, GridManager, SearchPopup, ResultsGrid, GridInModalLinkObjects } from 'components/ComponentsIndex'
import DatePicker from 'react-date-picker'
import {
  convertToShortDate,
  formatAlertType,
  isValidArray,
  strcmp,
  capitalizeFirstLetter,
  insertSpaceAfterAChar
} from 'functions/utils'
import { reset } from 'backend/standAloneAction.js'
import { exportAnimal, resetAnimal } from 'backend/exportAnimalAction.js'
import { changeStatus, resetObject } from 'backend/changeStatusAction.js'
import { generationInventoryItem } from 'backend/generationInventoryItemAction.js'
import { moveInventoryItem } from 'backend/moveInventoryItemAction.js'
import { labSampleAction, resetLabSample } from 'backend/labSampleAction.js'
import { changeMovementDocStatus } from 'backend/changeMovementDocStatus'
import { executeMassActionExtended } from 'backend/executeMassActionExtended'
import CustomForm from './CustomForm'
import FlockMovementCustomForm from './FlockMovementCustomForm'
import style from 'components/AppComponents/ExecuteActions/ExecuteActionOnSelectedRows.module.css'

class ExecuteActionOnSelectedRows extends React.Component {
  static propTypes = {
    // the id of the grid which the actions are executed upon
    gridId: PropTypes.string.isRequired
  }
  constructor (props) {
    super(props)
    this.state = {
      alert: undefined,
      showAlert: false,
      showSearchPopup: false,
      inputElementId: 'selectAnimalShelter',
      shelterObjId: '',
      showAdoptionAlert: false,
      showAdoptionSearchPopup: false,
      adoptionInputElementId: 'selectResponsible',
      responsibleObjId: '',
      ownerName: '',
      showOwnerSearchGrid: 'HOLDING_RESPONSIBLE',
      subMenu: null,
      modalIsOpen: false,
      searchGrid: 'HOLDING',
      showSearchGrid: 'LABORATORY',
      date: null,
      actionText: null,
      actionLabel: null,
      actionName: null,
      subActionName: null,
      actionParam: null,
      transportType: null,
      transporterLicense: null,
      animalMvmReason: null,
      activityDate: null,
      slaughterOrDestroyDate: null,
      selectedPassportDeclineReason: null,
      passportDeclineReasons: [],
      estimateDayOfArrival: null,
      estimateDayOfDeparture: null,
      disinfectionDate: null,
      actionsContainer: document.getElementById('fixedActionMenu'),
      noUnitsTreated: null,
      isInAffectedArea: null,
      isInActiveQuarantine: null,
      holdingType: null,
      destroyedReason: ''
    }

    this.displayPopupOnClick = this.displayPopupOnClick.bind(this)
    this.displayAdoptionPopupOnClick = this.displayAdoptionPopupOnClick.bind(this)
  }

  componentDidMount () {
    this.props.updateSelectedRows([], null)
    store.dispatch({ type: 'CLEAN_ACTION_STATE', payload: null })

    // Get the valid vaccination events, depending of the type of the currently selected holding
    this.getValidVaccEventsForHolding()

    // Check if the current holding is located in an infected area
    if (this.props.gridId.includes('QUARANTINE')) {
      this.checkIfHoldingIsInAffectedArea()
    }
  }

  componentWillReceiveProps (nextProps) {
    let responseDestination = nextProps.massActionResult || nextProps.actionResult
    if (this.props.gridId !== nextProps.gridId) {
      this.props.updateSelectedRows([], null)
      store.dispatch({ type: 'CLEAN_ACTION_STATE', payload: null })
    }
    if (nextProps.customGridId && this.props.customGridId !== nextProps.customGridId) {
      this.props.updateSelectedRows([], null)
      store.dispatch({ type: 'CLEAN_ACTION_STATE', payload: null })
    }
    if (responseDestination &&
      (this.props.massActionResult !== nextProps.massActionResult ||
        this.props.actionResult !== nextProps.actionResult)) {
      const responseType = formatAlertType(responseDestination)
      if (responseType.toLowerCase() === 'success' &&
        strcmp(nextProps.executedActionType, 'START_MOVEMENT')) {
        // get the object aray by splitting the response - it's always the last parameter
        const resArray = responseDestination.split('_')
        let objectId = 'null'
        if (resArray.length > 1) {
          objectId = resArray.pop()
        }
        const responseText = resArray.join('')

        // create custom clickable button since google disallows popups by default
        let element = document.createElement('span')
        element.id = 'alertExtension'

        ReactDOM.render(<button
          id='generate_print'
          className={'swal-button swal-button--danger'}
          onClick={() => {
            // generate print here
            let url = config.svConfig.triglavRestVerbs.GET_REPORT
            url = url.replace('%session', nextProps.svSession)
            url = url.replace('%objectId', objectId)
            url = url.replace('%reportName', 'MHC_Wrapper')
            const report = `${config.svConfig.restSvcBaseUrl}/${url}`
            window.open(report, '_blank')
          }}>
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.print`,
            defaultMessage: `${config.labelBasePath}.print`
          })}
        </button>, element)

        // Provide an option to print the movement document
        this.setState({
          alert: alertUser(
            true,
            responseType,
            this.context.intl.formatMessage({
              id: responseText,
              defaultMessage: responseText
            }),
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.print_movement_doc`,
              defaultMessage: `${config.labelBasePath}.main.print_movement_doc`
            }),
            () => {
              this.setState({ alert: alertUser(false, 'info', '') })
              this.refreshDataActionCallback(nextProps)
            },
            null,
            false,
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.forms.close`,
              defaultMessage: `${config.labelBasePath}.main.forms.close`
            }),
            null,
            true,
            '#555',
            true,
            element
          )
        })
      } else {
        this.setState({
          alert: alertUser(
            true,
            responseType,
            this.context.intl.formatMessage({
              id: responseDestination,
              defaultMessage: responseDestination
            }) || '',
            null
          )
        })
        this.refreshDataActionCallback(nextProps)
        this.setState({
          shelterObjId: '',
          activityDate: null,
          estimateDayOfArrival: null,
          estimateDayOfDeparture: null,
          disinfectionDate: null,
          showAlert: false,
          showAdoptionAlert: false,
          responsibleObjId: '',
          ownerName: ''
        })
      }
    }
  }

  componentDidUpdate (nextProps, nextState) {
    if (this.state.showAlert !== nextState.showAlert) {
      const shelterInput = document.getElementById(this.state.inputElementId)
      if (shelterInput) {
        shelterInput.onclick = this.displayPopupOnClick
      }
    }

    if (this.state.showAdoptionAlert !== nextState.showAdoptionAlert) {
      const shelterInput = document.getElementById(this.state.adoptionInputElementId)
      if (shelterInput) {
        shelterInput.onclick = this.displayAdoptionPopupOnClick
      }
    }
  }

  refreshDataActionCallback = (nextProps) => {
    this.props.updateSelectedRows([], null)
    ComponentManager.setStateForComponent(nextProps.selectableGridId, 'selectedIndexes', [])
    store.dispatch({ type: 'CLEAN_ACTION_STATE', payload: null })
    store.dispatch(reset())
    store.dispatch(resetObject())
    store.dispatch(resetAnimal())
    store.dispatch(resetLabSample())
    if (nextProps.selectableGridId) {
      GridManager.reloadGridData(nextProps.selectableGridId)
      let altGridId = null
      altGridId = nextProps.selectableGridId.slice(0, -1)
      altGridId = `${altGridId}2`
      GridManager.reloadGridData(altGridId)
    }
    this.setState({ alert: alertUser(false, 'info', '') })
    this.closeModal()
  }

  componentWillUnmount () {
    this.props.updateSelectedRows([], null)
    store.dispatch({ type: 'CLEAN_ACTION_STATE', payload: null })
    this.setState({ holdingType: null })
  }

  handleReasonSelection = (selectedReason) => {
    this.setState({ selectedPassportDeclineReason: selectedReason })
    this.passportRequestPrompt('decline', selectedReason)
  }

  getValidVaccEventsForHolding = async () => {
    const server = config.svConfig.restSvcBaseUrl
    const session = this.props.svSession
    const gridHierarchy = this.props.gridHierarchy
    let holdingType
    gridHierarchy.map(singleGrid => {
      if (singleGrid && singleGrid.active && singleGrid.row['HOLDING.TYPE']) {
        holdingType = singleGrid.row['HOLDING.TYPE']
        this.setState({ holdingType })
      } else if (singleGrid && singleGrid.active && !singleGrid.row['HOLDING.TYPE']) {
        holdingType = '6'
      }
    })
    let verbPath = config.svConfig.triglavRestVerbs.GET_VALID_VACCINATION_EVENTS_FOR_HOLDING
    let url = `${server}${verbPath}`
    url = url.replace('%session', session)
    url = url.replace('%holdingType', holdingType)
    try {
      const res = await axios.get(url)
      this.setState({ subMenu: res.data })
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

  checkIfHoldingIsInAffectedArea = async () => {
    const { svSession } = this.props
    const objects = this.props.gridHierarchy
    const altObjects = Object.keys(store.getState()).some((key) => key.indexOf('ANIMAL'))
    let holdingObjectId
    objects.forEach(grid => {
      if (grid.gridId === 'HOLDING') {
        holdingObjectId = grid.row['HOLDING.OBJECT_ID']
      } else if (grid.gridId === 'ANIMAL') {
        holdingObjectId = grid.row['ANIMAL.PARENT_ID']
      } else if (altObjects) {
        if (store.getState().parentSource.HOLDING) {
          holdingObjectId = store.getState().parentSource.HOLDING.object_id
        } else {
          holdingObjectId = null
        }
      }
    })
    const server = config.svConfig.restSvcBaseUrl
    let wsPath = config.svConfig.triglavRestVerbs.IS_HOLDING_INFECTED
    wsPath = wsPath.replace('%session', svSession)
    wsPath = wsPath.replace('%objectId', holdingObjectId)
    let reqUrl = `${server}${wsPath}`
    try {
      const res = await axios.get(reqUrl)
      this.setState({
        isInAffectedArea: res.data.isInAffectedArea,
        isInActiveQuarantine: res.data.isInActiveQuarantine
      })
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

  passportRequestPrompt = (actionText, selectedReason) => {
    let actionName
    switch (actionText) {
      case 'accept':
        actionName = 'accept'
        break
      case 'decline':
        actionName = 'decline'
        break
    }

    actionText = capitalizeFirstLetter(actionText)

    if (isValidArray(this.props.selectedGridRows, 1)) {
      if (actionName === 'accept') {
        this.setState({
          alert: alertUser(
            true,
            'warning',
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.actions.confirm_accept_passport_request`,
              defaultMessage: `${config.labelBasePath}.actions.confirm_accept_passport_request`
            }),
            null,
            () => this.handlePassportRequest('accept'),
            () => this.setState({
              alert: alertUser(false, 'info', '')
            }),
            true,
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.actions.accept`,
              defaultMessage: `${config.labelBasePath}.actions.accept`
            }),
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.forms.cancel`,
              defaultMessage: `${config.labelBasePath}.main.forms.cancel`
            }),
            true,
            null,
            true
          )
        })
      } else if (actionName === 'decline') {
        const { passportDeclineReasons } = this.state
        let wrapper = document.createElement('div')
        ReactDOM.render(
          <Select
            multi
            removeSelected
            onChange={this.handleReasonSelection}
            value={selectedReason}
            placeholder={this.context.intl.formatMessage(
              {
                id: config.labelBasePath + '.form_labels.reason',
                defaultMessage: config.labelBasePath + '.form_labels.reason'
              }
            )}
            options={passportDeclineReasons}
          />,
          wrapper
        )

        this.setState({
          alert: alertUser(
            true,
            'warning',
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.actions.confirm_decline_passport_request`,
              defaultMessage: `${config.labelBasePath}.actions.confirm_decline_passport_request`
            }),
            null,
            () => this.handlePassportRequest('decline'),
            () => this.setState({
              alert: alertUser(false, 'info', ''),
              selectedPassportDeclineReason: null
            }),
            true,
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.actions.decline`,
              defaultMessage: `${config.labelBasePath}.actions.decline`
            }),
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.forms.cancel`,
              defaultMessage: `${config.labelBasePath}.main.forms.cancel`
            }),
            true,
            null,
            true,
            wrapper
          )
        })
      }
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

  handlePassportRequest = (actionName) => {
    const { selectedPassportDeclineReason } = this.state
    let selectedReasons = []
    let joinedReasons
    if (actionName === 'decline') {
      if (selectedPassportDeclineReason && selectedPassportDeclineReason.length > 0 && selectedPassportDeclineReason !== []) {
        selectedPassportDeclineReason.map(reason => selectedReasons.push(reason))
        joinedReasons = selectedReasons.join()
      }
    }
    const actionType = 'UPDATE_STATUS'
    let paramsArray
    switch (actionName) {
      case 'accept':
        paramsArray = [{
          MASS_PARAM_TBL_NAME: this.props.gridType,
          MASS_PARAM_ACTION: actionType,
          MASS_PARAM_SUBACTION: 'ACCEPT_REQUEST',
          MASS_PARAM_ACTION_PARAM: null
        }]
        store.dispatch(massObjectHandlerAction(
          this.props.svSession, actionType, actionName, this.props.selectedGridRows, paramsArray
        ))
        break
      case 'decline':
        paramsArray = [{
          MASS_PARAM_TBL_NAME: this.props.gridType,
          MASS_PARAM_ACTION: actionType,
          MASS_PARAM_SUBACTION: 'DECLINE_REQUEST'
        }]
        if (joinedReasons) {
          paramsArray[0]['MASS_PARAM_ADDITIONAL_PARAM'] = joinedReasons
        }
        store.dispatch(massObjectHandlerAction(
          this.props.svSession, actionType, actionName, this.props.selectedGridRows, paramsArray
        ))
        this.setState({ selectedPassportDeclineReason: null })
        break
    }
  }

  petMassActionPrompt = (actionName, campaignObjId, campaignLabel) => {
    let warningText = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.actions.default_date_msg`,
      defaultMessage: `${config.labelBasePath}.actions.default_date_msg`
    })

    let actionText
    switch (actionName) {
      case 'vaccination':
        actionText = this.context.intl.formatMessage({
          id: `${config.labelBasePath}.actions.vaccination`,
          defaultMessage: `${config.labelBasePath}.actions.vaccination`
        })
        break
      case 'sampling':
        actionText = this.context.intl.formatMessage({
          id: `${config.labelBasePath}.actions.sampling`,
          defaultMessage: `${config.labelBasePath}.actions.sampling`
        })
        break
      case 'campaign':
        actionText = insertSpaceAfterAChar(campaignLabel, '/')
        warningText = ''
        break
      case 'released':
        actionText = this.context.intl.formatMessage({
          id: `${config.labelBasePath}.actions.released`,
          defaultMessage: `${config.labelBasePath}.actions.released`
        })
        break
      case 'died':
        actionText = this.context.intl.formatMessage({
          id: `${config.labelBasePath}.actions.died`,
          defaultMessage: `${config.labelBasePath}.actions.died`
        })
        break
      case 'died_euthanasia':
        actionText = this.context.intl.formatMessage({
          id: `${config.labelBasePath}.actions.died_euthanasia`,
          defaultMessage: `${config.labelBasePath}.actions.died_euthanasia`
        })
        break
    }

    let wrapper = document.createElement('div')
    ReactDOM.render(
      <React.Fragment>
        <label htmlFor='activityDate' style={{ marginRight: '8px' }}>{this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.set_activity_date`,
          defaultMessage: `${config.labelBasePath}.main.set_activity_date`
        })}
        </label>
        <input
          style={{ border: 'none', height: '40px', color: '#000', backgroundColor: '#eff0f1' }}
          type='date'
          name='activityDate'
          onChange={this.setActivityDate}
          value={this.state.activityDate}
        />
      </React.Fragment>,
      wrapper
    )

    if (isValidArray(this.props.selectedGridRows, 1)) {
      this.setState({
        alert: alertUser(
          true,
          'warning',
          actionName === 'released' || actionName === 'died' || actionName === 'died_euthanasia'
            ? this.context.intl.formatMessage({
              id: `${config.labelBasePath}.actions.change_pet_status_prompt`,
              defaultMessage: `${config.labelBasePath}.actions.change_pet_status_prompt`
            }) + ' ' + '"' + actionText + '"' + ' ? ' + warningText
            : this.context.intl.formatMessage({
              id: `${config.labelBasePath}.actions.prompt_text`,
              defaultMessage: `${config.labelBasePath}.actions.prompt_text`
            }) + ' ' + '"' + actionText + '"' + ' ? ' + warningText,
          null,
          () => this.executeMassPetAction(actionName, campaignObjId),
          () => this.setState({
            alert: alertUser(false, 'info', ''),
            activityDate: null
          }),
          true,
          actionName === 'released' || actionName === 'died' || actionName === 'died_euthanasia'
            ? this.context.intl.formatMessage({
              id: `${config.labelBasePath}.actions.change`,
              defaultMessage: `${config.labelBasePath}.actions.change`
            }) : this.context.intl.formatMessage({
              id: `${config.labelBasePath}.actions.execute`,
              defaultMessage: `${config.labelBasePath}.actions.execute`
            }),
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.forms.cancel`,
            defaultMessage: `${config.labelBasePath}.main.forms.cancel`
          }),
          true,
          null,
          true,
          actionName === 'campaign' ? null : wrapper
        )
      })
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

  petMovementPrompt = () => {
    if (isValidArray(this.props.selectedGridRows, 1)) {
      this.setState({ showAlert: true })
      let wrapper = document.createElement('div')
      ReactDOM.render(
        <div style={{ marginLeft: '12px' }}>
          <label htmlFor='selectAnimalShelter' style={{ marginRight: '8px' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.select_animal_shelter`,
              defaultMessage: `${config.labelBasePath}.main.select_animal_shelter`
            })}
          </label>
          <br />
          <input
            style={{ border: 'none', height: '40px', color: '#000', backgroundColor: '#eff0f1', marginBottom: '1rem' }}
            type='text'
            id='selectAnimalShelter'
            name='selectAnimalShelter'
          />
          <br />
          <label htmlFor='activityDate' style={{ marginRight: '8px' }}>{this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.set_activity_date`,
            defaultMessage: `${config.labelBasePath}.main.set_activity_date`
          })}
          </label>
          <br />
          <input
            style={{ border: 'none', height: '40px', color: '#000', backgroundColor: '#eff0f1' }}
            type='date'
            name='activityDate'
            onChange={this.setActivityDate}
            value={this.state.activityDate}
          />
        </div>,
        wrapper
      )

      this.setState({
        alert: alertUser(
          true,
          'info',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.create_pet_movement`,
            defaultMessage: `${config.labelBasePath}.main.create_pet_movement`
          }),
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.default_date_msg`,
            defaultMessage: `${config.labelBasePath}.actions.default_date_msg`
          }),
          () => {
            this.executeMassPetAction('create_movement', this.state.shelterObjId)
          },
          () => {
            this.close()
          },
          true,
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.move`,
            defaultMessage: `${config.labelBasePath}.actions.move`
          }),
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.forms.cancel`,
            defaultMessage: `${config.labelBasePath}.main.forms.cancel`
          }),
          true,
          null,
          true,
          wrapper
        )
      })
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

    if (!this.state.shelterObjId) {
      const submitBtn = document.getElementsByClassName('swal-button swal-button--confirm')
      if (submitBtn) {
        if (submitBtn[0].classList.contains('swal-button--danger')) {
          submitBtn[0].removeAttribute('disabled')
        } else {
          submitBtn[0].setAttribute('disabled', '')
        }
      }
    }
  }

  petAdoptionPrompt = () => {
    if (isValidArray(this.props.selectedGridRows, 1)) {
      this.setState({ showAdoptionAlert: true })
      let wrapper = document.createElement('div')
      ReactDOM.render(
        <div style={{ marginLeft: '12px' }}>
          <label htmlFor='selectResponsible' style={{ marginRight: '8px' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.select_pet_owner`,
              defaultMessage: `${config.labelBasePath}.main.select_pet_owner`
            })}
          </label>
          <br />
          <input
            style={{ border: 'none', height: '40px', color: '#000', backgroundColor: '#eff0f1', marginBottom: '1rem' }}
            type='text'
            id='selectResponsible'
            name='selectResponsible'
            value={this.state.ownerName}
          />
          <br />
          <label htmlFor='activityDate' style={{ marginRight: '8px', marginTop: '1rem' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.set_adoption_date`,
              defaultMessage: `${config.labelBasePath}.main.set_adoption_date`
            })}
          </label>
          <br />
          <input
            style={{ border: 'none', height: '40px', color: '#000', backgroundColor: '#eff0f1' }}
            type='date'
            id='activityDate'
            name='activityDate'
            onChange={this.setActivityDate}
            value={this.state.activityDate}
          />
        </div>,
        wrapper
      )

      this.setState({
        alert: alertUser(
          true,
          'info',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.adopt_selected_pet`,
            defaultMessage: `${config.labelBasePath}.main.adopt_selected_pet`
          }),
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.default_date_msg`,
            defaultMessage: `${config.labelBasePath}.actions.default_date_msg`
          }),
          () => {
            this.executeMassPetAction('adopted', this.state.responsibleObjId)
          },
          () => {
            this.close()
          },
          true,
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.adopt`,
            defaultMessage: `${config.labelBasePath}.main.adopt`
          }),
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.forms.cancel`,
            defaultMessage: `${config.labelBasePath}.main.forms.cancel`
          }),
          true,
          null,
          true,
          wrapper
        )
      })
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

    if (!this.state.responsibleObjId) {
      const submitBtn = document.getElementsByClassName('swal-button swal-button--confirm')
      if (submitBtn) {
        if (submitBtn[0].classList.contains('swal-button--danger')) {
          submitBtn[0].removeAttribute('disabled')
        } else {
          submitBtn[0].setAttribute('disabled', '')
        }
      }
    }
  }

  displayPopupOnClick (event) {
    event.preventDefault()
    this.setState({ showSearchPopup: true })
    event.target.blur()
    const alertOverlay = document.getElementsByClassName('swal-overlay')
    alertOverlay[0].style.display = 'none'
  }

  chooseItem = () => {
    const shelterObjId = String(store.getState()[`${this.state.searchGrid}_${this.state.inputElementId}`].rowClicked[`${this.state.searchGrid}.OBJECT_ID`])
    const shelterPic = store.getState()[`${this.state.searchGrid}_${this.state.inputElementId}`].rowClicked[`${this.state.searchGrid}.PIC`]
    this.setState({ shelterObjId })
    const shelterInput = document.getElementById(this.state.inputElementId)
    shelterInput.value = shelterPic
    const submitBtn = document.getElementsByClassName('swal-button swal-button--confirm')
    if (submitBtn) {
      submitBtn[0].removeAttribute('disabled')
    }
    this.closeSearchPopup()
  }

  displayAdoptionPopupOnClick (event) {
    event.preventDefault()
    this.setState({ showAdoptionSearchPopup: true })
    event.target.blur()
    const alertOverlay = document.getElementsByClassName('swal-overlay')
    alertOverlay[0].style.display = 'none'
  }

  chooseOwner = () => {
    const ownerName = store.getState()[`${this.state.showOwnerSearchGrid}`].rowClicked[`${this.state.showOwnerSearchGrid}.FULL_NAME`]
    const responsibleObjId = String(store.getState()[`${this.state.showOwnerSearchGrid}`].rowClicked[`${this.state.showOwnerSearchGrid}.OBJECT_ID`])
    this.setState({ responsibleObjId, ownerName })
    const ownerInput = document.getElementById(this.state.adoptionInputElementId)
    ownerInput.value = ownerName
    const submitBtn = document.getElementsByClassName('swal-button swal-button--confirm')
    if (submitBtn) {
      submitBtn[0].removeAttribute('disabled')
    }
  }

  executeMassPetAction = (actionName, additionalParam) => {
    if (actionName === 'create_movement' && additionalParam === '') {
      this.close()
    } else if (actionName === 'create_movement' && additionalParam === '' && !this.state.activityDate) {
      this.close()
    } else if (actionName === 'adopted' && additionalParam === '') {
      this.close()
    } else if (actionName === 'adopted' && additionalParam === '' && !this.state.activityDate) {
      this.close()
    } else {
      let shortDate
      if (!this.state.activityDate) {
        shortDate = convertToShortDate(new Date(), 'y-m-d')
      } else {
        shortDate = this.state.activityDate
      }

      let paramsArray
      let actionType
      const massPetActionType = 'MASS_PET_ACTION'
      switch (actionName) {
        case 'vaccination':
        case 'sampling':
          actionType = 'ACTIVITY'
          paramsArray = [{
            MASS_PARAM_TBL_NAME: this.props.gridType,
            MASS_PARAM_ACTION: actionType,
            MASS_PARAM_SUBACTION: actionName.toUpperCase(),
            MASS_PARAM_ACTION_DATE: shortDate
          }]
          store.dispatch(massPetAction(
            this.props.svSession, massPetActionType, actionName, this.props.selectedGridRows, paramsArray
          ))
          this.setState({ activityDate: null })
          break
        case 'campaign':
          actionType = 'ACTIVITY'
          paramsArray = [{
            MASS_PARAM_TBL_NAME: this.props.gridType,
            MASS_PARAM_ACTION: actionType,
            MASS_PARAM_SUBACTION: actionName.toUpperCase(),
            MASS_PARAM_ADDITIONAL_PARAM: additionalParam
          }]
          store.dispatch(massPetAction(
            this.props.svSession, massPetActionType, actionName, this.props.selectedGridRows, paramsArray
          ))
          break
        case 'released':
        case 'died':
        case 'died_euthanasia':
          actionType = 'UPDATE_STATUS'
          paramsArray = [{
            MASS_PARAM_TBL_NAME: this.props.gridType,
            MASS_PARAM_ACTION: actionType,
            MASS_PARAM_ACTION_DATE: shortDate,
            MASS_PARAM_SUBACTION: actionName.toUpperCase()
          }]
          store.dispatch(massPetAction(
            this.props.svSession, massPetActionType, actionName, this.props.selectedGridRows, paramsArray
          ))
          break
        case 'create_movement':
          paramsArray = [{
            MASS_PARAM_TBL_NAME: this.props.gridType,
            MASS_PARAM_ACTION: actionName.toUpperCase(),
            MASS_PARAM_ACTION_DATE: shortDate,
            MASS_PARAM_ADDITIONAL_PARAM: additionalParam
          }]
          store.dispatch(massPetAction(
            this.props.svSession, massPetActionType, actionName, this.props.selectedGridRows, paramsArray
          ))
          break
        case 'adopted':
          paramsArray = [{
            MASS_PARAM_TBL_NAME: this.props.gridType,
            MASS_PARAM_ACTION: actionName.toUpperCase(),
            MASS_PARAM_SUBACTION: actionName.toUpperCase(),
            MASS_PARAM_ACTION_DATE: shortDate,
            MASS_PARAM_ADDITIONAL_PARAM: additionalParam
          }]
          store.dispatch(massPetAction(
            this.props.svSession, massPetActionType, actionName, this.props.selectedGridRows, paramsArray
          ))
          break
      }
    }
  }

  prompt = (component, onConfirmCallback, actionText, warning) => {
    const warningText = warning || ''
    component.setState({
      alert: alertUser(
        true,
        'warning',
        // The holding is in an affected area
        this.state.isInAffectedArea === 'true' ? component.context.intl.formatMessage({
          id: `${config.labelBasePath}.actions.is_in_affected_area`,
          defaultMessage: `${config.labelBasePath}.actions.is_in_affected_area`
        }) + ' ' + component.context.intl.formatMessage({
          id: `${config.labelBasePath}.actions.prompt_text`,
          defaultMessage: `${config.labelBasePath}.actions.prompt_text`
        }) + ' ' + '"' + actionText + '"' + ' ? '
          // The holding is in an active quarantine
          : this.state.isInActiveQuarantine === 'true' ? component.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.is_in_active_quarantine`,
            defaultMessage: `${config.labelBasePath}.actions.is_in_active_quarantine`
          }) + ' ' + component.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.prompt_text`,
            defaultMessage: `${config.labelBasePath}.actions.prompt_text`
          }) + ' ' + '"' + actionText + '"' + ' ? '
            // The holding is both in an affected area and in an active quarantine
            : this.state.isInAffectedArea === 'true' && this.state.isInActiveQuarantine === 'true'
              ? component.context.intl.formatMessage({
                id: `${config.labelBasePath}.actions.is_in_quarantine_and_affected`,
                defaultMessage: `${config.labelBasePath}.actions.is_in_quarantine_and_affected`
              }) + ' ' + component.context.intl.formatMessage({
                id: `${config.labelBasePath}.actions.prompt_text`,
                defaultMessage: `${config.labelBasePath}.actions.prompt_text`
              }) + ' ' + '"' + actionText + '"' + ' ? '
              // The default message
              : component.context.intl.formatMessage({
                id: `${config.labelBasePath}.actions.prompt_text`,
                defaultMessage: `${config.labelBasePath}.actions.prompt_text`
              }) + ' ' + '"' + actionText + '"' + ' ? ' + warningText,
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

  massActionPrompt = (actionText) => {
    let wrapper = document.createElement('div')
    ReactDOM.render(
      <input
        type='date'
        style={{ border: 'none', height: '40px', color: '#000', backgroundColor: '#eff0f1' }}
        name='activityDate'
        id='activityDate'
        onChange={this.setActivityDate}
        value={this.state.activityDate}
      />,
      wrapper)

    this.setState({
      alert: alertUser(
        true,
        'warning',
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.actions.prompt_text`,
          defaultMessage: `${config.labelBasePath}.actions.prompt_text`
        }) + ' ' + '"' + actionText + '"' + ' ? ',
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.actions.default_date_msg`,
          defaultMessage: `${config.labelBasePath}.actions.default_date_msg`
        }),
        () => {
          this.executeMassActivityAction()
          this.setState({
            alert: alertUser(false, 'info', ''),
            activityDate: null,
            actionText: null,
            subActionName: null
          })
        },
        () => this.setState({
          alert: alertUser(false, 'info', ''),
          activityDate: null,
          actionText: null,
          subActionName: null
        }),
        true,
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.actions.execute`,
          defaultMessage: `${config.labelBasePath}.actions.execute`
        }),
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.forms.cancel`,
          defaultMessage: `${config.labelBasePath}.main.forms.cancel`
        }),
        true,
        null,
        true,
        wrapper
      )
    })
  }

  handleReasonParamChange = e => {
    this.setState({ destroyedReason: e.target.value })
  }

  slaughterAndDestroyPrompt = (actionText, actionLabel) => {
    this.setState({ actionText, actionLabel })
    let wrapper = document.createElement('div')
    ReactDOM.render(
      <React.Fragment>
        <input
          type='date'
          style={{ border: 'none', height: '40px', color: '#000', backgroundColor: '#eff0f1' }}
          name='slaughterOrDestroyDate'
          id='slaughterOrDestroyDate'
          onChange={this.setActivityDate}
          value={this.state.slaughterOrDestroyDate}
        />
        {actionText === 'destroyed' &&
          <div key='reasonParamContainer' style={{ marginTop: '2rem' }}>
            <label htmlFor='reasonParam'>
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.grid_labels.area_health.reason`,
                defaultMessage: `${config.labelBasePath}.grid_labels.area_health.reason`
              })}
            </label>
            <textarea
              style={{ minWidth: '400px' }}
              maxLength='500'
              name='reasonParam'
              id='reasonParam'
              key='reasonParam'
              onChange={this.handleReasonParamChange}
            />
          </div>
        }
      </React.Fragment>,
      wrapper)

    if (isValidArray(this.props.selectedGridRows, 1)) {
      this.setState({
        alert: alertUser(
          true,
          'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.prompt_text`,
            defaultMessage: `${config.labelBasePath}.actions.prompt_text`
          }) + ' ' + '"' + actionLabel + '"' + ' ? ',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.default_date_msg`,
            defaultMessage: `${config.labelBasePath}.actions.default_date_msg`
          }),
          () => {
            this.executeSlaughterOrDestroyAction(actionText)
            this.setState({
              alert: alertUser(false, 'info', ''),
              actionText: null,
              actionLabel: null,
              slaughterOrDestroyDate: null
            })
          },
          () => this.setState({
            alert: alertUser(false, 'info', ''),
            actionText: null,
            actionLabel: null,
            slaughterOrDestroyDate: null,
            destroyedReason: ''
          }),
          true,
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.execute`,
            defaultMessage: `${config.labelBasePath}.actions.execute`
          }),
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.forms.cancel`,
            defaultMessage: `${config.labelBasePath}.main.forms.cancel`
          }),
          true,
          null,
          true,
          wrapper
        )
      })
    } else {
      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.empty_selection`,
            defaultMessage: `${config.labelBasePath}.alert.empty_selection`
          }), null,
          () => this.setState({ alert: alertUser(false, 'info', ''), actionText: null, actionLabel: null })
        )
      })
    }
  }

  executeSlaughterOrDestroyAction = (actionText) => {
    const { destroyedReason } = this.state
    let shortDate
    if (!this.state.slaughterOrDestroyDate) {
      shortDate = convertToShortDate(new Date(), 'y-m-d')
    } else {
      shortDate = this.state.slaughterOrDestroyDate
    }

    const massActionType = 'EXECUTE_ACTION_ON_ROWS'
    const actionType = 'RETIRE'
    switch (actionText) {
      case 'slaughtrd':
      case 'destroyed':
        const paramsArray = [{
          MASS_PARAM_TBL_NAME: this.props.gridType,
          MASS_PARAM_ACTION: actionType,
          MASS_PARAM_SUBACTION: actionText.toUpperCase(),
          MASS_PARAM_DATE_OF_MOVEMENT: shortDate,
          ...destroyedReason && { MASS_PARAM_REASON: destroyedReason }
        }]
        store.dispatch(massAnimalOrFlockAction(
          this.props.svSession, massActionType, actionText, this.props.selectedGridRows, paramsArray
        ))
        this.setState({ slaughterOrDestroyDate: null, actionLabel: null, destroyedReason: '' })
        break
    }
  }

  executeMassActivityAction = () => {
    const {
      actionName, subActionName, activityDate, actionParam, transportType, transporterLicense,
      estimateDayOfArrival, estimateDayOfDeparture, disinfectionDate, animalMvmReason
    } = this.state
    let shortDate
    !activityDate ? shortDate = convertToShortDate(new Date(), 'y-m-d') : shortDate = activityDate
    this.inputDataBeforeSubmit(
      () => this.props.executeActionOnSelectedRows(
        this.props.svSession, this.props.gridType, 'EXECUTE_ACTION_ON_ROWS',
        actionName, subActionName, this.props.selectedGridRows,
        actionParam, shortDate, 'null', 'null',
        transportType || 'null', transporterLicense || this.state.noUnitsTreated || 'null', // this param is sometimes used for flock activity
        estimateDayOfArrival || 'null', estimateDayOfDeparture || 'null',
        disinfectionDate || 'null', animalMvmReason || 'null')
    )
  }

  inputDataBeforeSubmit = (onConfirmCallback) => {
    if (strcmp(this.props.gridType, 'FLOCK')) {
      let element = document.createElement('div')
      element.id = 'alertExtension'

      ReactDOM.render(<input
        id='noUnitsTreated'
        className='form-control'
        onChange={(event) => this.setState({ noUnitsTreated: event.target.value })}
        placeholder={this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.number_of_units_treated`,
          defaultMessage: `${config.labelBasePath}.main.number_of_units_treated`
        })} />,
      element)
      // enter suspension reason
      this.setState({
        alert: alertUser(
          true,
          'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.please_input_number_of_units_treated`,
            defaultMessage: `${config.labelBasePath}.main.please_input_number_of_units_treated`
          }),
          null,
          onConfirmCallback,
          () => this.setState({ alert: alertUser(false, 'info', '') }),
          true,
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.execute`,
            defaultMessage: `${config.labelBasePath}.actions.execute`
          }),
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.forms.cancel`,
            defaultMessage: `${config.labelBasePath}.main.forms.cancel`
          }),
          true,
          null,
          true,
          element)
      }
      )
    } else {
      onConfirmCallback()
    }
  }

  initiateFlockMovement = (actionText, actionName, subActionName, actionParam, datePicked,
    transportType, transporterLicense, estimateDayOfArrival,
    estimateDayOfDeparture, disinfectionDate, animalMvmReason,
    totalUnits, maleUnits, femaleUnits, adultsUnits) => {
    store.dispatch({ type: 'CLEAN_ACTION_STATE', payload: null })
    let warning = ''
    if (totalUnits === '0' &&
      maleUnits === '0' &&
      femaleUnits === '0' &&
      adultsUnits === '0') {
      warning = this.context.intl.formatMessage({
        id: `${config.labelBasePath}.alert.all_flock_units_will_be_moved`,
        defaultMessage: `${config.labelBasePath}.alert.all_flock_units_will_be_moved`
      })
    }
    if (isValidArray(this.props.selectedGridRows, 1)) {
      if (datePicked) {
        if (this.state.date) {
          const shortDate = convertToShortDate(this.state.date, 'y-m-d')
          this.prompt(this, () => this.props.executeMassActionExtended(
            'MOVE_FLOCK_UNITS', this.props.svSession, this.props.gridType, 'EXECUTE_ACTION_ON_ROWS',
            actionName, subActionName, this.props.selectedGridRows,
            actionParam, shortDate, 'null', 'null',
            transportType || 'null', transporterLicense || 'null',
            estimateDayOfArrival || 'null', estimateDayOfDeparture || 'null',
            disinfectionDate || 'null', animalMvmReason || 'null',
            totalUnits, maleUnits, femaleUnits, adultsUnits), actionText, warning)
        } else {
          this.setState({
            alert: alertUser(true, 'warning',
              this.context.intl.formatMessage({
                id: `${config.labelBasePath}.alert.no_date_selected`,
                defaultMessage: `${config.labelBasePath}.alert.no_date_selected`
              }), null,
              () => this.setState({ alert: alertUser(false, 'info', '') })
            )
          })
        }
      } else {
        this.prompt(this, () => this.props.executeMassActionExtended(
          'MOVE_FLOCK_UNITS', this.props.svSession,
          this.props.gridType, 'EXECUTE_ACTION_ON_ROWS', actionName,
          subActionName, this.props.selectedGridRows, actionParam,
          'null', 'null', 'null',
          transportType || 'null', transporterLicense || 'null',
          estimateDayOfArrival || 'null', estimateDayOfDeparture || 'null',
          disinfectionDate || 'null', animalMvmReason || 'null',
          totalUnits, maleUnits, femaleUnits, adultsUnits), actionText, warning)
      }
    }
  }

  executeAction = (actionText, actionName, subActionName, actionParam, datePicked,
    transportType, transporterLicense, estimateDayOfArrival,
    estimateDayOfDeparture, disinfectionDate, animalMvmReason) => {
    store.dispatch({ type: 'CLEAN_ACTION_STATE', payload: null })
    if (!actionParam) {
      if (this.props.gridType === 'ANIMAL_MOVEMENT' || this.props.gridType === 'FLOCK_MOVEMENT') {
        this.props.gridHierarchy.forEach(grid => {
          if (grid.gridType === 'HOLDING') {
            actionParam = grid.row['HOLDING.OBJECT_ID']
          }
        })
      } else {
        actionParam = 'null'
      }
    }

    if (actionName === 'activity') {
      this.setState({ actionText, actionName, subActionName, actionParam })
    }

    if (isValidArray(this.props.selectedGridRows, 1)) {
      switch (actionName) {
        case 'pendingExport': {
          this.prompt(this, () => this.props.exportAnimal(this.props.svSession,
            actionName, actionParam, this.props.selectedGridRows), actionText)
          break
        }
        case 'change_status': {
          this.prompt(this, () => this.props.changeStatus(this.props.svSession,
            subActionName, null, null, this.props.selectedGridRows), actionText)
          break
        }
        case 'generate_inventory_item': {
          this.prompt(this, () => this.props.generationInventoryItem(this.props.svSession, this.props.selectedGridRows), actionText)
          break
        }
        case 'move_inventory_item': {
          this.prompt(this, () => this.props.moveInventoryItem(this.props.svSession, this.props.selectedGridRows), actionText)
          break
        }
        case 'change_the_status_of_lab_sample':
        case 'sample_action':
        case 'set_health_status_to_results': {
          this.prompt(this, () => this.props.labSampleAction(this.props.svSession, actionName, subActionName, actionParam,
            this.props.selectedGridRows), actionText)
          break
        }
        case 'change_movement_doc_status': {
          this.prompt(this, () => store.dispatch(changeMovementDocStatus(this.props.svSession, subActionName, this.props.selectedGridRows)), actionText)
          break
        }
        default: {
          if (datePicked) {
            if (this.state.date) {
              const shortDate = convertToShortDate(this.state.date, 'y-m-d')
              this.prompt(this, () => this.props.executeActionOnSelectedRows(
                this.props.svSession, this.props.gridType, 'EXECUTE_ACTION_ON_ROWS',
                actionName, subActionName, this.props.selectedGridRows,
                actionParam, shortDate, 'null', 'null',
                transportType || 'null', transporterLicense || 'null',
                estimateDayOfArrival || 'null', estimateDayOfDeparture || 'null',
                disinfectionDate || 'null', animalMvmReason || 'null'), actionText)
            } else {
              this.setState({
                alert: alertUser(true, 'warning',
                  this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.alert.no_date_selected`,
                    defaultMessage: `${config.labelBasePath}.alert.no_date_selected`
                  }), null,
                  () => this.setState({ alert: alertUser(false, 'info', '') })
                )
              })
            }
          } else if (actionName === 'activity') {
            this.massActionPrompt(actionText)
          } else {
            this.prompt(this, () => this.props.executeActionOnSelectedRows(this.props.svSession,
              this.props.gridType, 'EXECUTE_ACTION_ON_ROWS', actionName,
              subActionName, this.props.selectedGridRows, actionParam,
              'null', 'null', 'null',
              transportType || 'null', transporterLicense || 'null',
              estimateDayOfArrival || 'null', estimateDayOfDeparture || 'null',
              disinfectionDate || 'null', animalMvmReason || 'null'), actionText)
          }
        }
      }
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

  finishMovementPrompt = (date) => {
    let holdingObjectId
    const gridHierarchy = this.props.gridHierarchy
    gridHierarchy.forEach(grid => {
      if (grid.gridType === 'HOLDING') {
        holdingObjectId = grid.row['HOLDING.OBJECT_ID']
      }
    })
    let wrapper = document.createElement('div')
    ReactDOM.render(
      <React.Fragment>
        <label htmlFor='setFinishMovementDate' style={{ marginRight: '8px' }}>
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.form_labels.arrival_date`,
            defaultMessage: `${config.labelBasePath}.form_labels.arrival_date`
          })}
        </label>
        <input
          style={{ border: 'none', height: '40px', color: '#000', backgroundColor: '#eff0f1' }}
          type='date'
          name='setFinishMovementDate'
          onChange={this.setDate}
          value={date}
        />
      </React.Fragment>,
      wrapper
    )

    let shortDate
    !date ? shortDate = convertToShortDate(new Date(), 'y-m-d') : shortDate = date

    if (isValidArray(this.props.selectedGridRows, 1)) {
      this.setState({
        alert: alertUser(
          true,
          'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.prompt_text`,
            defaultMessage: `${config.labelBasePath}.actions.prompt_text`
          }) + ' ' + '"' + this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.finish_movement`,
            defaultMessage: `${config.labelBasePath}.actions.finish_movement`
          }) + '"' + ' ? ',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.default_date_msg`,
            defaultMessage: `${config.labelBasePath}.actions.default_date_msg`
          }),
          () => {
            this.props.executeActionOnSelectedRows(
              this.props.svSession, this.props.gridType, 'EXECUTE_ACTION_ON_ROWS',
              'move', 'FINISH_MOVEMENT', this.props.selectedGridRows, holdingObjectId,
              shortDate, 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null'
            )
            this.setState({
              alert: alertUser(false, 'info', ''),
              date: null
            })
          },
          () => this.setState({
            alert: alertUser(false, 'info', ''),
            date: null
          }),
          true,
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.execute`,
            defaultMessage: `${config.labelBasePath}.actions.execute`
          }),
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.forms.cancel`,
            defaultMessage: `${config.labelBasePath}.main.forms.cancel`
          }),
          true,
          null,
          true,
          wrapper
        )
      })
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

  moveItems = () => {
    const gridType = this.props.gridType
    const row = store.getState()[`${this.state.searchGrid}_SEARCH`].rowClicked
    const destination = row[this.state.searchGrid + '.OBJECT_ID']
    const transportType = document.getElementById('transportType')
    const animalMvmReason = document.getElementById('animalMvmReason')
    const transporterLicense = document.getElementById('transporterLicense')
    const transportTypeVal = transportType.value
    const transportTypeLbl = transportType[0].label
    const animalReason = animalMvmReason.value
    const animalReasonLbl = animalMvmReason[0].label
    const transporterLicenseVal = transporterLicense.value
    const transporterLicenseLbl = transporterLicense.placeholder
    const estimateDayOfArrival = convertToShortDate(this.state.estimateDayOfArrival, 'y-m-d')
    const estimateDayOfDeparture = convertToShortDate(this.state.estimateDayOfDeparture, 'y-m-d')
    const disinfectionDate = convertToShortDate(this.state.disinfectionDate, 'y-m-d')
    const disinfectionDateLbl = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.desinfection_date`,
      defaultMessage: `${config.labelBasePath}.main.desinfection_date`
    })
    const estimateDayOfArrivalLbl = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.estimate_day_of_arrival`,
      defaultMessage: `${config.labelBasePath}.main.estimate_day_of_arrival`
    })
    const estimateDayOfDepartureLbl = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.estimate_day_of_departure`,
      defaultMessage: `${config.labelBasePath}.main.estimate_day_of_departure`
    })
    const valid = (strcmp(transportTypeVal, 'VEHICLE') && transporterLicenseVal) || (strcmp(transportTypeVal, 'FOOT') && !transporterLicenseVal)
    const validReason = animalReason
    let validDate
    if (strcmp(transportTypeVal, 'VEHICLE')) {
      validDate = estimateDayOfArrival && estimateDayOfDeparture && disinfectionDate
    } else if (strcmp(transportTypeVal, 'FOOT')) {
      validDate = estimateDayOfArrival && estimateDayOfDeparture
    }

    if (valid && validReason && validDate) {
      if (gridType === 'ANIMAL') {
        this.executeAction(this.context.intl.formatMessage({
          id: `${config.labelBasePath}.actions.start_movement`,
          defaultMessage: `${config.labelBasePath}.actions.start_movement`
        }), 'move', 'START_MOVEMENT', destination, false, transportTypeVal,
        transporterLicenseVal || 'null', estimateDayOfArrival, estimateDayOfDeparture,
        disinfectionDate || 'null', animalReason)
      } else if (gridType === 'FLOCK') {
        const totalUnits = document.getElementById('totalUnits').value || '0'
        const maleUnits = document.getElementById('maleUnits').value || '0'
        const femaleUnits = document.getElementById('femaleUnits').value || '0'
        const adultsUnits = document.getElementById('adultsUnits').value || '0'
        if (femaleUnits !== '0' && adultsUnits === null) {
          this.setState({
            alert: alertUser(true, 'warning',
              this.context.intl.formatMessage({
                id: `${config.labelBasePath}.alert.parameters_missing`,
                defaultMessage: `${config.labelBasePath}.alert.parameters_missing`
              }),
              this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.flock.adults`,
                defaultMessage: `${config.labelBasePath}.main.flock.adults`
              }),
              () => this.setState({ alert: alertUser(false, 'info', '') }))
          })
        } else {
          this.initiateFlockMovement(this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.start_movement`,
            defaultMessage: `${config.labelBasePath}.actions.start_movement`
          }), 'move', 'START_MOVEMENT', destination, false, transportTypeVal,
          transporterLicenseVal || 'null', estimateDayOfArrival, estimateDayOfDeparture,
          disinfectionDate || 'null', animalReason, totalUnits, maleUnits, femaleUnits, adultsUnits)
        }
      }
    } else {
      let message = ''
      if (!transportTypeVal) {
        this.setState({
          alert: alertUser(true, 'warning',
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.alert.parameters_missing`,
              defaultMessage: `${config.labelBasePath}.alert.parameters_missing`
            }),
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.transport_type`,
              defaultMessage: `${config.labelBasePath}.main.transport_type`
            }),
            () => this.setState({ alert: alertUser(false, 'info', '') }))
        })
      }
      if (transportTypeVal === 'VEHICLE') {
        if (!transportTypeVal) message = message + transportTypeLbl + ' '
        if (!animalReason) message = message + animalReasonLbl + ' '
        if (!transporterLicenseVal) message = message + transporterLicenseLbl + ' '
        if (!disinfectionDate) message = message + disinfectionDateLbl + ' '
        if (!estimateDayOfArrival) message = message + estimateDayOfArrivalLbl + ' '
        if (!estimateDayOfDeparture) message = message + estimateDayOfDepartureLbl + ' '
        this.setState({
          alert: alertUser(true, 'warning',
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.alert.movement_parameters_missing`,
              defaultMessage: `${config.labelBasePath}.alert.movement_parameters_missing`
            }),
            message,
            () => this.setState({ alert: alertUser(false, 'info', '') }))
        })
      }
      if (transportTypeVal === 'FOOT') {
        if (transporterLicenseVal) {
          this.setState({
            alert: alertUser(true, 'warning',
              this.context.intl.formatMessage({
                id: `${config.labelBasePath}.alert.remove_transporter_license`,
                defaultMessage: `${config.labelBasePath}.alert.remove_transporter_license`
              }),
              null,
              () => this.setState({ alert: alertUser(false, 'info', '') }))
          })
        } else {
          if (!transportTypeVal) message = message + transportTypeLbl + ' '
          if (!animalReason) message = message + animalReasonLbl + ' '
          if (!estimateDayOfArrival) message = message + estimateDayOfArrivalLbl + ' '
          if (!estimateDayOfDeparture) message = message + estimateDayOfDepartureLbl + ' '
          this.setState({
            alert: alertUser(true, 'warning',
              this.context.intl.formatMessage({
                id: `${config.labelBasePath}.alert.movement_parameters_missing`,
                defaultMessage: `${config.labelBasePath}.alert.movement_parameters_missing`
              }),
              message,
              () => this.setState({ alert: alertUser(false, 'info', '') }))
          })
        }
      }
    }
  }

  asigneeToLab = () => {
    const row = store.getState()[`${this.state.showSearchGrid}_SEARCH`].rowClicked
    const labName = row['LABORATORY.LAB_NAME']
    if (labName) {
      this.executeAction(this.context.intl.formatMessage({
        id: `${config.labelBasePath}.actions.assignee_to_laboratory`,
        defaultMessage: `${config.labelBasePath}.actions.assignee_to_laboratory`
      }), 'sample_action', 'ASSIGN_LAB', labName, false)
    } else {
      this.setState({
        alert: alertUser(true, 'warning', this.context.intl.formatMessage({
          id: `${config.labelBasePath}.alert.no_destination_found`,
          defaultMessage: `${config.labelBasePath}.alert.no_destination_found`
        }), null,
        () => this.setState({ alert: alertUser(false, 'info', '') }))
      })
    }
  }

  searchDestination = () => {
    if (isValidArray(this.props.selectedGridRows, 1)) {
      this.setState({ modalIsOpen: true })
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

  close = () => {
    this.setState({
      alert: false,
      showAlert: false,
      showAdoptionAlert: false,
      showSearchPopup: false,
      shelterObjId: '',
      responsibleObjId: '',
      ownerName: '',
      activityDate: null,
      showAdoptionSearchPopup: false
    })
  }

  closeSearchPopup = () => {
    this.setState({ showSearchPopup: false })
    const alertOverlay = document.getElementsByClassName('swal-overlay')
    alertOverlay[0].style.display = 'block'
    ComponentManager.cleanComponentReducerState(`${this.state.searchGrid}_${this.state.inputElementId}`)
  }

  closeAdoptionSearchPopup = () => {
    this.setState({ showAdoptionSearchPopup: false })
    const alertOverlay = document.getElementsByClassName('swal-overlay')
    alertOverlay[0].style.display = 'block'
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false, estimateDayOfArrival: null, estimateDayOfDeparture: null })
  }

  setDate = e => {
    this.setState({ date: e.target.value })
    this.finishMovementPrompt(e.target.value)
  }

  setActivityDate = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  setDateFrom = (date) => {
    this.setState({ estimateDayOfDeparture: date })
  }

  setDateOfArrival = (date) => {
    this.setState({ estimateDayOfArrival: date })
  }

  setDisinfectionDate = (date) => {
    this.setState({ disinfectionDate: date })
  }

  render () {
    let component = null
    let { disinfectionDate } = this.state
    let { componentToDisplay, gridHierarchy } = this.props
    // eslint-disable-next-line no-unused-vars
    let gridId, parentId, showGrid, linkName, key, homeId, exportCertId
    const objects = gridHierarchy
    const nowBtnText = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.now`,
      defaultMessage: `${config.labelBasePath}.main.now`
    })
    objects.map(singleObj => {
      if (singleObj.gridId === 'HOLDING') {
        homeId = singleObj.row['HOLDING.OBJECT_ID']
      } else if (singleObj.gridType === 'EXPORT_CERT') {
        exportCertId = singleObj.row['EXPORT_CERT.OBJECT_ID']
      }
    })

    const gridConfig = menuConfig('GRID_CONFIG', this.context.intl)
    const searchPopup = <div id='search_modal' className='modal to-front' style={{ display: 'flex' }}>
      <div id='search_modal_content' className='modal-content'>
        <div className='modal-header' />
        <div id='search_modal_body' className='modal-body'>
          <ResultsGrid
            key={this.state.searchGrid + '_' + this.state.inputElementId}
            id={this.state.searchGrid + '_' + this.state.inputElementId}
            gridToDisplay={this.state.searchGrid}
            gridConfig={gridConfig}
            onRowSelectProp={this.chooseItem}
            customGridDataWS='GET_SHELTERS'
          />
        </div>
      </div>
      <div id='modal_close_btn' type='button' className='js-components-AppComponents-Functional-GridInModalLinkObjects-module-close'
        style={{
          position: 'absolute',
          right: 'calc(11% - 9px)',
          top: '44px',
          width: '32px',
          height: '32px',
          opacity: '1'
        }}
        onClick={() => this.closeSearchPopup(this)} data-dismiss='modal' />
    </div>

    const ownerSearchPopup = <div id='search_modal_owner' className='modal' style={{ display: 'flex' }}>
      <div id='search_modal_content_owner' className='modal-content'>
        <div className='modal-header' />
        <div id='search_modal_body_owner' className='modal-body'>
          <GridInModalLinkObjects
            loadFromParent
            linkedTable={this.state.showOwnerSearchGrid}
            onRowSelect={this.chooseOwner}
            key={this.state.showOwnerSearchGrid + '_' + this.state.adoptionInputElementId}
            closeModal={this.closeAdoptionSearchPopup}
          />
        </div>
      </div>
    </div>

    if (componentToDisplay.length > 0) {
      componentToDisplay.map(singleComponent => {
        parentId = singleComponent.props.objectId
        showGrid = singleComponent.props.showGrid
        linkName = singleComponent.props.linkName
        if (showGrid && linkName) {
          gridId = showGrid + '_' + parentId + '_' + linkName + '1'
        } else {
          key = singleComponent.key
          gridId = key
        }
      })
    }

    const dateFields = <div id='popUpContainer' className={style.popUpContainer}
      style={{ marginTop: '1rem' }}>
      <div>
        <div style={{ color: 'white' }}>
          {this.context.intl.formatMessage(
            {
              id: `${config.labelBasePath}.main.estimate_day_of_departure`,
              defaultMessage: `${config.labelBasePath}.main.estimate_day_of_departure`
            }
          )}
        </div>
        <DatePicker
          key='from'
          required
          className='datePicker'
          onChange={this.setDateFrom}
          value={this.state.estimateDayOfDeparture}
        />
        <button
          id='from'
          className='btn-success buttonNowInline'
          onClick={() => this.setDateFrom(new Date())}>
          {nowBtnText}
        </button>
      </div>
      <div style={{ marginLeft: '1rem' }}>
        <div style={{ color: 'white' }}>
          {this.context.intl.formatMessage(
            {
              id: `${config.labelBasePath}.main.estimate_day_of_arrival`,
              defaultMessage: `${config.labelBasePath}.main.estimate_day_of_arrival`
            }
          )}
        </div>
        <DatePicker
          key='to'
          required
          className='datePicker'
          onChange={this.setDateOfArrival}
          value={this.state.estimateDayOfArrival}
        />
        <button
          id='to'
          className='btn-success buttonNowInline'
          onClick={() => this.setDateOfArrival(new Date())} >
          {nowBtnText}
        </button>
      </div>
      <div style={{ marginLeft: '1rem' }}>
        <div style={{ color: 'white' }}>
          {this.context.intl.formatMessage(
            {
              id: `${config.labelBasePath}.main.desinfection_date`,
              defaultMessage: `${config.labelBasePath}.main.desinfection_date`
            }
          )}
        </div>
        <div>
          <DatePicker
            id='disinfectionDate'
            required
            className='datePicker'
            onChange={this.setDisinfectionDate}
            value={disinfectionDate}
          />
          <button
            id='disinfectionDate'
            className='btn-success buttonNowInline'
            onClick={() => this.setDisinfectionDate(new Date())}>
            {nowBtnText}
          </button>
        </div>
      </div>
    </div>

    const actionsList = [
      <ActionsList
        key={this.props.gridId + '_' + homeId}
        menuItemActions={this.props.menuItemActions}
        homeId={homeId}
        exportCertId={exportCertId}
        gridId={this.props.gridId}
        selectedGridRows={this.props.selectedGridRows.gridId}
        executeAction={this.executeAction}
        finishMovementPrompt={this.finishMovementPrompt}
        petMassActionPrompt={this.petMassActionPrompt}
        passportRequestPrompt={this.passportRequestPrompt}
        slaughterAndDestroyPrompt={this.slaughterAndDestroyPrompt}
        searchDestination={this.searchDestination}
        petMovementPrompt={this.petMovementPrompt}
        petAdoptionPrompt={this.petAdoptionPrompt}
        subMenu={this.state.subMenu}
        holdingType={this.state.holdingType}
      />
    ]

    component = <div id='dynamicActionList'>
      {this.state.alert}
      {this.state.modalIsOpen &&
        <div id='search_modal' className='modal to-front' style={{ display: 'block' }}>
          <div id='search_modal_content' className='modal-content'>
            <div className='modal-header'>
              <button id='modal_close_btn' type='button' className='close'
                onClick={this.closeModal} data-dismiss='modal'>&times;</button>
            </div>
            <div id='search_modal_body' className='modal-body'>
              {(this.props.gridType === 'LAB_SAMPLE' || this.props.gridType === 'LABORATORY') &&
                <SearchPopup
                  gridToDisplay='LABORATORY'
                  onRowSelect={this.asigneeToLab}
                  customSearch
                />
              }
              {this.props.gridType === 'ANIMAL' &&
                <SearchPopup
                  gridToDisplay={this.state.searchGrid}
                  onRowSelect={this.moveItems}
                  CustomForm={CustomForm}
                  dateFields={dateFields}
                />
              }
              {this.props.gridType === 'FLOCK' &&
                <SearchPopup
                  gridToDisplay={this.state.searchGrid}
                  onRowSelect={this.moveItems}
                  CustomForm={FlockMovementCustomForm}
                  dateFields={dateFields}
                />
              }
            </div>
          </div>
        </div>
      }
      {/* Renders action menu list in a different parent container */}
      {ReactDOM.createPortal(actionsList, this.state.actionsContainer)}
      {this.state.showSearchPopup && ReactDOM.createPortal(searchPopup, document.getElementById('app').parentNode)}
      {this.state.showAdoptionSearchPopup && ReactDOM.createPortal(ownerSearchPopup, document.getElementById('app').parentNode)}
    </div>

    const portalValidation = () => {
      if (this.props.gridType === 'STRAY_PET') {
        return null
      }

      if (this.props.gridType === 'PET_MOVEMENT') {
        return null
      }

      if (this.props.gridHierarchy[0].gridType === 'HOLDING' && this.props.gridType === 'SVAROG_ORG_UNITS') {
        return null
      }

      const portalComponent = actionsList
      const parentContainer = this.state.actionsContainer

      if (parentContainer === null) {
        return <React.Fragment>{portalComponent}</React.Fragment>
      } else {
        return component
      }
    }

    return (
      portalValidation()
    )
  }
}

ExecuteActionOnSelectedRows.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  selectableGridId: state.selectedGridRows.gridId,
  selectedGridRows: state.selectedGridRows.selectedGridRows,
  gridHierarchy: state.gridConfig.gridHierarchy,
  svSession: state.security.svSession,
  massActionResult: state.massActionResult.result,
  executedActionType: state.massActionResult.executedActionType,
  componentToDisplay: state.componentToDisplay.componentToDisplay,
  actionResult: state.massAction.result,
  getUserGroups: state.userInfoReducer.getUsers
})

const mapDispatchToProps = dispatch => ({
  updateSelectedRows: (...params) => {
    dispatch(updateSelectedRows(...params))
  },
  executeActionOnObjects: (...params) => {
    dispatch(executeActionOnObjects(...params))
  },
  exportAnimal: (...params) => {
    dispatch(exportAnimal(...params))
  },
  changeStatus: (...params) => {
    dispatch(changeStatus(...params))
  },
  generationInventoryItem: (...params) => {
    dispatch(generationInventoryItem(...params))
  },
  moveInventoryItem: (...params) => {
    dispatch(moveInventoryItem(...params))
  },
  labSampleAction: (...params) => {
    dispatch(labSampleAction(...params))
  },
  executeActionOnSelectedRows: (...params) => {
    dispatch(executeActionOnSelectedRows(...params))
  },
  massAnimalOrFlockAction: (...params) => {
    dispatch(massAnimalOrFlockAction(...params))
  },
  massPetAction: (...params) => {
    dispatch(massPetAction(...params))
  },
  massObjectHandlerAction: (...params) => {
    dispatch(massObjectHandlerAction(...params))
  },
  executeMassActionExtended: (...params) => {
    dispatch(executeMassActionExtended(...params))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(ExecuteActionOnSelectedRows)
