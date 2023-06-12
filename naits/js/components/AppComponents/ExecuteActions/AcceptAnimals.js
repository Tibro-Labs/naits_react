import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as config from 'config/config.js'
import style from './ExecuteActionOnSelectedRows.module.css'
import { store } from 'tibro-redux'
import { massAnimalOrFlockAction } from 'backend/executeActionOnSelectedRows.js'
import { alertUser } from 'tibro-components'
import DatePicker from 'react-date-picker'
import { isValidArray, convertToShortDate, formatAlertType } from 'functions/utils'
import { SearchPopup, ComponentManager, GridManager, Loading } from 'components/ComponentsIndex'
import { transferAnimalOrFlock, resetTransferAnimal } from 'backend/transferAction'
import FlockMovementCustomForm from './FlockMovementCustomForm'

class AcceptAnimals extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: null,
      loading: false,
      fixedContainer: document.getElementById('fixedActionMenu'),
      showSearchPopup: null,
      gridToDisplay: 'HOLDING_RESPONSIBLE_SEARCH',
      showSearchGridToDisplay: props.gridType + '_SEARCH',
      elementItemId: 'textContainer',
      elementId: 'tagContainter',
      dateOfMovement: null,
      dateOfAdmittance: null
    }
    this.displayResultOnClick = this.displayResultOnClick.bind(this)
    this.showResultOnClick = this.showResultOnClick.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ loading: nextProps.isLoading })
    if ((this.props.directTransferMessage !== nextProps.directTransferMessage) &&
      nextProps.directTransferMessage) {
      this.setState({
        alert: alertUser(true, formatAlertType(nextProps.directTransferMessage),
          this.context.intl.formatMessage({
            id: nextProps.directTransferMessage,
            defaultMessage: nextProps.directTransferMessage
          }) || ' ', null,
          () => {
            store.dispatch(resetTransferAnimal())
            this.reloadData(nextProps)
          })
      })
      let responseDestination = nextProps.directTransferMessage
      const responseType = formatAlertType(responseDestination)
      if (responseType.toLowerCase() === 'success') {
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
              this.setState({ alert: alertUser(false, 'info', ''), dateOfAdmittance: null })
              store.dispatch(resetTransferAnimal())
              this.reloadData(nextProps)
              document.getElementById(this.state.elementItemId).value = ''
              document.getElementById(this.state.elementId).value = ''
              document.getElementById('modal_close_btn') && document.getElementById('modal_close_btn').click()
              this.resetFlockInputs()
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
      }
    }
    // Set the direct transfer message to the initial state
    store.getState().directTransfer.result = null
    if ((this.props.directTransferError !== nextProps.directTransferError) &&
      nextProps.directTransferError) {
      this.setState({
        alert: alertUser(true, formatAlertType(nextProps.directTransferError),
          this.context.intl.formatMessage({
            id: nextProps.directTransferError,
            defaultMessage: nextProps.directTransferError
          }) || ' ', null,
          () => {
            store.dispatch(resetTransferAnimal())
            this.reloadData(nextProps)
          })
      })
    }
  }

  componentWillUnmount () {
    const { gridToDisplay, showSearchGridToDisplay } = this.state
    ComponentManager.cleanComponentReducerState(gridToDisplay)
    ComponentManager.cleanComponentReducerState(showSearchGridToDisplay)
  }

  reloadData = (props) => {
    ComponentManager.setStateForComponent(props.gridId + '1', 'selectedIndexes', [])
    GridManager.reloadGridData(props.gridId + '1')
    ComponentManager.setStateForComponent(props.gridId + '2', 'selectedIndexes', [])
    GridManager.reloadGridData(props.gridId + '2')
  }

  resetFlockInputs = () => {
    const totalUnits = document.getElementById('totalUnits')
    const maleUnits = document.getElementById('maleUnits')
    const femaleUnits = document.getElementById('femaleUnits')
    const adultsUnits = document.getElementById('adultsUnits')

    if (totalUnits && maleUnits && femaleUnits && adultsUnits) {
      totalUnits.value = ''
      maleUnits.value = ''
      femaleUnits.value = ''
      adultsUnits.value = ''
    }
  }

  executeAcceptAnimalAction = () => {
    const { dateOfMovement, dateOfAdmittance, elementItemId, gridToDisplay } = this.state
    let gridType = this.props.gridType
    let objectId
    let type = gridType.toLowerCase()
    const warningText = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.error.accept_${type}`,
      defaultMessage: `${config.labelBasePath}.error.accept_${type}`
    })
    if (this.props.selectedObjects.length > 0) {
      this.props.selectedObjects.map(singleObj => {
        if (singleObj.active) {
          gridType = singleObj.gridId
          objectId = singleObj.row[`${gridType}.OBJECT_ID`]
        }
      })
    }
    const selectedGridRows = this.props.selectedGridRows
    const inputTextContainer = document.getElementById(elementItemId).value
    const grid = store.getState()[gridToDisplay]
    if (grid) {
      if (!dateOfMovement) {
        this.setState({
          alert: alertUser(true, 'info', warningText || ' ', null,
            () => { store.dispatch(resetTransferAnimal()) })
        })
      } else if (!dateOfAdmittance) {
        this.setState({
          alert: alertUser(true, 'info', warningText || ' ', null,
            () => { store.dispatch(resetTransferAnimal()) })
        })
      } else if (!inputTextContainer) {
        this.setState({
          alert: alertUser(true, 'info', warningText || ' ', null,
            () => { store.dispatch(resetTransferAnimal()) })
        })
      } else if ((isValidArray(selectedGridRows, 1)) && inputTextContainer && dateOfMovement && dateOfAdmittance) {
        const selectedRow = grid.rowClicked['HOLDING_RESPONSIBLE.OBJECT_ID']
        const shortDateOfMovement = convertToShortDate(dateOfMovement, 'y-m-d')
        const shortDateOfAdmittance = convertToShortDate(dateOfAdmittance, 'y-m-d')
        const massActionType = 'EXECUTE_ACTION_ON_ROWS'
        const actionType = 'MOVE'
        const subActionType = 'FINISH_MOVEMENT_SLAUGHTR'
        const paramsArray = [{
          MASS_PARAM_TBL_NAME: this.props.gridType,
          MASS_PARAM_ACTION: actionType,
          MASS_PARAM_SUBACTION: subActionType,
          MASS_PARAM_ADDITIONAL_PARAM: String(objectId),
          MASS_PARAM_DATE_OF_MOVEMENT: shortDateOfMovement,
          MASS_PARAM_DATE_OF_ADMISSION: shortDateOfAdmittance,
          MASS_PARAM_TRANSPORTER_PERSON_ID: String(selectedRow)
        }]
        store.dispatch(massAnimalOrFlockAction(
          this.props.svSession, massActionType, subActionType, this.props.selectedGridRows, paramsArray
        ))
        this.setState({ dateOfMovement: null, dateOfAdmittance: null })
        document.getElementById(elementItemId).value = ''
        ComponentManager.cleanComponentReducerState(gridToDisplay)
      }
    } else {
      this.setState({
        alert: alertUser(true, 'info', warningText || ' ', null,
          () => { store.dispatch(resetTransferAnimal()) })
      })
    }
  }

  executeTransferAnimalAction = () => {
    let gridType = this.props.gridType
    let type = gridType.toLowerCase()
    const warningText = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.error.direct_transfer_${type}`,
      defaultMessage: `${config.labelBasePath}.error.direct_transfer_${type}`
    })
    let destinationObjectId
    if (this.props.selectedObjects.length > 0) {
      this.props.selectedObjects.map(singleObj => {
        if (singleObj.active) {
          gridType = singleObj.gridType
          destinationObjectId = singleObj.row[`${gridType}.OBJECT_ID`]
        }
      })
    }
    const { showSearchGridToDisplay, elementId, elementItemId, gridToDisplay, dateOfAdmittance } = this.state
    const inputTextContainer = document.getElementById(elementItemId).value
    const grid = store.getState()[gridToDisplay]
    if (grid) {
      const transporterPersonId = grid.rowClicked['HOLDING_RESPONSIBLE.OBJECT_ID']
      let shortDateOfAdmittance
      let totalUnits = '0'
      let maleUnits = '0'
      let femaleUnits = '0'
      let adultsUnits = '0'
      if (type === 'animal') {
        const animalIdVal = document.getElementById(elementId).value
        if (!animalIdVal) {
          this.setState({
            alert: alertUser(true, 'info', warningText || ' ', null,
              () => { store.dispatch(resetTransferAnimal()) })
          })
        } else if (!dateOfAdmittance) {
          this.setState({
            alert: alertUser(true, 'info', warningText || ' ', null,
              () => { store.dispatch(resetTransferAnimal()) })
          })
        } else if (animalIdVal && dateOfAdmittance && inputTextContainer) {
          const animalId = store.getState()[showSearchGridToDisplay].rowClicked[this.props.gridType + '.ANIMAL_ID']
          const animalClass = store.getState()[showSearchGridToDisplay].rowClicked[this.props.gridType + '.ANIMAL_CLASS']
          shortDateOfAdmittance = convertToShortDate(dateOfAdmittance, 'y-m-d')
          const paramsArray = [{
            MASS_PARAM_ANIMAL_FLOCK_ID: String(animalId),
            MASS_PARAM_HOLDING_OBJ_ID: destinationObjectId,
            MASS_PARAM_ANIMAL_CLASS: animalClass,
            MASS_PARAM_DATE_OF_ADMISSION: shortDateOfAdmittance,
            MASS_PARAM_TRANSPORTER_PERSON_ID: String(transporterPersonId)
          }]
          this.setState({
            alert: alertUser(true, 'warning',
              this.context.intl.formatMessage({
                id: `${config.labelBasePath}.actions.prompt_text`,
                defaultMessage: `${config.labelBasePath}.actions.prompt_text`
              }) + '"' + this.context.intl.formatMessage({
                id: `${config.labelBasePath}.actions.direct_transfer_animal`,
                defaultMessage: `${config.labelBasePath}.actions.direct_transfer_animal`
              }) + '"' + '?', null,
              () => { store.dispatch(transferAnimalOrFlock(this.props.svSession, paramsArray)) },
              () => { store.dispatch(resetTransferAnimal()) },
              true,
              this.context.intl.formatMessage({
                id: `${config.labelBasePath}.actions.execute`,
                defaultMessage: `${config.labelBasePath}.actions.execute`
              }),
              this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.forms.cancel`,
                defaultMessage: `${config.labelBasePath}.main.forms.cancel`
              })
            )
          })
        }
      } else if (type === 'flock') {
        const flockIdVal = document.getElementById(elementId).value
        if (!flockIdVal) {
          this.setState({
            alert: alertUser(true, 'info', warningText || ' ', null,
              () => { store.dispatch(resetTransferAnimal()) })
          })
        } else if (!dateOfAdmittance) {
          this.setState({
            alert: alertUser(true, 'info', warningText || ' ', null,
              () => { store.dispatch(resetTransferAnimal()) })
          })
        } else if (flockIdVal && dateOfAdmittance && inputTextContainer) {
          const flockId = store.getState()[showSearchGridToDisplay].rowClicked[this.props.gridType + '.FLOCK_ID']
          const flockType = store.getState()[showSearchGridToDisplay].rowClicked[this.props.gridType + '.ANIMAL_TYPE']
          shortDateOfAdmittance = convertToShortDate(dateOfAdmittance, 'y-m-d')
          totalUnits = document.getElementById('totalUnits').value || '0'
          maleUnits = document.getElementById('maleUnits').value || '0'
          femaleUnits = document.getElementById('femaleUnits').value || '0'
          adultsUnits = document.getElementById('adultsUnits').value || '0'
          const paramsArray = [{
            MASS_PARAM_ANIMAL_FLOCK_ID: String(flockId),
            MASS_PARAM_HOLDING_OBJ_ID: destinationObjectId,
            MASS_PARAM_ANIMAL_CLASS: flockType,
            MASS_PARAM_DATE_OF_ADMISSION: shortDateOfAdmittance,
            MASS_PARAM_TRANSPORTER_PERSON_ID: String(transporterPersonId),
            MASS_PARAM_TOTAL_UNITS: parseInt(totalUnits),
            MASS_PARAM_MALE_UNITS: parseInt(maleUnits),
            MASS_PARAM_FEMALE_UNITS: parseInt(femaleUnits),
            MASS_PARAM_ADULT_UNITS: parseInt(adultsUnits)
          }]
          if (totalUnits === '0' &&
            maleUnits === '0' &&
            femaleUnits === '0' &&
            adultsUnits === '0') {
            const warning = this.context.intl.formatMessage({
              id: `${config.labelBasePath}.alert.all_flock_units_will_be_moved`,
              defaultMessage: `${config.labelBasePath}.alert.all_flock_units_will_be_moved`
            })
            this.setState({
              alert: alertUser(true, 'warning', warning, null,
                () => store.dispatch(transferAnimalOrFlock(this.props.svSession, paramsArray)),
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
                true
              )
            })
          } else {
            this.setState({
              alert: alertUser(true, 'warning',
                this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.actions.prompt_text`,
                  defaultMessage: `${config.labelBasePath}.actions.prompt_text`
                }) + '"' + this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.actions.direct_transfer_animal`,
                  defaultMessage: `${config.labelBasePath}.actions.direct_transfer_animal`
                }) + '"' + '?', null,
                () => { store.dispatch(transferAnimalOrFlock(this.props.svSession, paramsArray)) },
                () => { store.dispatch(resetTransferAnimal()) },
                true,
                this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.actions.execute`,
                  defaultMessage: `${config.labelBasePath}.actions.execute`
                }),
                this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.forms.cancel`,
                  defaultMessage: `${config.labelBasePath}.main.forms.cancel`
                })
              )
            })
          }
        }
      }
    } else {
      this.setState({
        alert: alertUser(true, 'info', warningText || ' ', null,
          () => { store.dispatch(resetTransferAnimal()) })
      })
    }
  }

  setDateFrom = (date) => {
    this.setState({ dateOfMovement: date })
  }

  setDateTo = (date) => {
    this.setState({ dateOfAdmittance: date })
  }

  chooseRowOnClick (component) {
    const { gridToDisplay, elementItemId } = component.state
    let selectedPersonValue = ''
    const fullName = store.getState()[gridToDisplay].rowClicked['HOLDING_RESPONSIBLE.FULL_NAME']
    const natRegNum = store.getState()[gridToDisplay].rowClicked['HOLDING_RESPONSIBLE.NAT_REG_NUMBER']
    if (fullName) {
      selectedPersonValue = fullName
    } else if (natRegNum) {
      selectedPersonValue = natRegNum
    }
    if (selectedPersonValue) {
      if (elementItemId) {
        document.getElementById(elementItemId).value = selectedPersonValue
      }
    }
    component.closeModal(component)
  }

  selectRowOnClick = (component) => {
    const { showSearchGridToDisplay, elementId } = component.state
    const selectedRow = store.getState()[showSearchGridToDisplay]
      .rowClicked[component.props.gridType + '.' + component.props.gridType + '_ID']
    if (selectedRow) {
      if (elementId) {
        document.getElementById(elementId).value = selectedRow
      }
    }
    component.closeModal(component)
  }

  displayResultOnClick (event) {
    event.preventDefault()
    event.target.blur()
    let comp = <div id='search_modal' className='modal to-front' style={{ display: 'block' }}>
      <div id='search_modal_content' className='modal-content'>
        <div className='modal-header' />
        <div id='search_modal_body' className='modal-body'>
          <SearchPopup
            gridToDisplay='HOLDING_RESPONSIBLE'
            onRowSelect={() => this.chooseRowOnClick(this)}
            customSearch
          />
        </div>
      </div>
      <div id='modal_close_btn' type='button' className='js-components-AppComponents-Functional-GridInModalLinkObjects-module-close'
        style={{
          position: 'absolute',
          right: 'calc(10% - 32px)',
          top: '43px',
          width: '32px',
          height: '32px',
          opacity: '1',
          backgroundColor: '#c8990e',
          borderRadius: '50%',
          cursor: 'pointer'
        }}
        onClick={() => this.closeModal(this)} />
    </div>
    this.setState({ showSearchPopup: comp })
  }

  showResultOnClick (event) {
    event.preventDefault()
    event.target.blur()
    let comp = <div id='search_modal' className='modal to-front' style={{
      display: 'block',
      zIndex: '9995',
      backgroundColor: 'rgba(0, 0, 0, 0.68)'
    }}>
      <div id='search_modal_content' className='modal-content'>
        <div className='modal-header' />
        <div id='search_modal_body' className='modal-body'>
          <SearchPopup
            gridToDisplay={this.props.gridType}
            onRowSelect={() => this.selectRowOnClick(this)}
            customSearch
          />
        </div>
      </div>
      <div id='modal_close_btn' type='button' className='js-components-AppComponents-Functional-GridInModalLinkObjects-module-close'
        style={{
          position: 'absolute',
          right: 'calc(10% - 32px)',
          top: '43px',
          width: '32px',
          height: '32px',
          opacity: '1',
          backgroundColor: '#c8990e',
          borderRadius: '50%',
          cursor: 'pointer'
        }}
        onClick={() => this.closeModal()} />
    </div>
    this.setState({ showSearchPopup: comp })
  }

  closeModal () {
    this.setState({ showSearchPopup: false })
  }

  render () {
    let { componentToDisplay } = this.props
    let gridId, parentId, showGrid, linkName, key
    let component = null
    const { dateOfMovement, dateOfAdmittance } = this.state
    const type = this.props.gridType.toLowerCase()
    const nowBtnText = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.now`,
      defaultMessage: `${config.labelBasePath}.main.now`
    })

    if (componentToDisplay.length > 0) {
      componentToDisplay.map((component, i) => {
        parentId = component.props.parentId
        showGrid = component.props.showGrid
        linkName = component.props.linkName
        if (showGrid && linkName) {
          gridId = showGrid + '_' + parentId + '_' + linkName + '1'
        } else {
          key = componentToDisplay[i].key
          gridId = key
        }
      })
    }

    if ((this.props.gridType === 'ANIMAL_MOVEMENT' && gridId.includes('ANIMAL_MOVEMENT_HOLDING')) || (this.props.gridType === 'FLOCK_MOVEMENT' && gridId.includes('FLOCK_MOVEMENT_HOLDING'))) {
      component = <div id='container' className={style.container}>
        <div className={style.title}>{this.context.intl.formatMessage(
          {
            id: `${config.labelBasePath}.main.accept_animal_${type}`,
            defaultMessage: `${config.labelBasePath}.main.accept_animal_${type}`
          }
        )}
        </div>
        <div id='popUpContainer' className={style.customContainer}>
          <input type='text'
            id='textContainer'
            className={style['fixed-input']}
            style={{ marginTop: '0.9rem' }}
            onClick={this.displayResultOnClick}
            placeholder={this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.transporter_name`,
              defaultMessage: `${config.labelBasePath}.main.transporter_name`
            }
            )}
          />
          <div style={{ marginTop: '3.5px' }}>
            <div style={{ marginTop: '-0.9rem' }}>
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.start_date_of_movement`,
                defaultMessage: `${config.labelBasePath}.main.start_date_of_movement`
              }
              )}
            </div>
            <DatePicker
              required
              className='datePicker'
              onChange={this.setDateFrom}
              value={dateOfMovement}
            />
            <button
              id='setDateNow1'
              className={style.btn_save_formV2}
              style={{ marginTop: '0', height: '40px' }}
              onClick={() => this.setDateFrom(new Date())}>
              {nowBtnText}
            </button>
          </div>
          <div style={{ marginLeft: '1rem', marginTop: '1.5px' }}>
            <div style={{ marginTop: '-0.8rem' }}>
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.date_of_addmitance`,
                defaultMessage: `${config.labelBasePath}.main.date_of_addmitance`
              }
              )}
            </div>
            <DatePicker
              required
              className='datePicker'
              onChange={this.setDateTo}
              value={dateOfAdmittance}
            />
            <button
              id='setDateNow2'
              className={style.btn_save_formV2}
              style={{ marginTop: '0', height: '40px' }}
              onClick={() => this.setDateTo(new Date())}>
              {nowBtnText}
            </button>
          </div>
        </div>
        <div
          id='accept'
          className={style.menuActivator}
          onClick={() => this.executeAcceptAnimalAction()}>
          <span id='accept_holding' className={style.actionText}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.actions.accept_animal_${type}`,
              defaultMessage: `${config.labelBasePath}.actions.accept_animal_${type}`
            })}
          </span>
          <img id='accept_img' className={style.actionImg}
            src='/naits/img/massActionsIcons/accept.png' />
        </div>
      </div>

      if (this.props.customId && this.props.customId.includes('FINISHED')) {
        component = null
      }
    } else if ((this.props.gridType === 'ANIMAL' || this.props.gridType === 'FLOCK') && !this.props.customId) {
      component = <div id='container' className={style.container}>
        <div className={style.title}>{this.context.intl.formatMessage(
          {
            id: `${config.labelBasePath}.main.direct_transfer_${type}`,
            defaultMessage: `${config.labelBasePath}.main.direct_transfer_${type}`
          }
        )}
        </div>
        <div id='popUpContainer' className={style.customContainer}>
          <input type='text'
            id='textContainer'
            className={'form-control ' + style['fixed-input']}
            onClick={this.displayResultOnClick}
            placeholder={this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.transporter_name`,
              defaultMessage: `${config.labelBasePath}.main.transporter_name`
            }
            )}
          />
          <input type='text'
            id='tagContainter'
            className={'form-control ' + style['fixed-input']}
            onClick={this.showResultOnClick}
            placeholder={this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.search.by_${type}_id`,
              defaultMessage: `${config.labelBasePath}.main.search.by_${type}_id`
            }
            )}
          />
          <div style={{ marginTop: '-0.9rem' }}>
            <div>
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.date_of_addmitance`,
                defaultMessage: `${config.labelBasePath}.main.date_of_addmitance`
              }
              )}
            </div>
            <DatePicker
              key='from'
              required
              className='datePicker'
              onChange={this.setDateTo}
              value={dateOfAdmittance}
            />
            <button
              id='setDateFromNow'
              className={style.btn_save_formV2}
              style={{ marginTop: '0', height: '40px' }}
              onClick={() => this.setDateTo(new Date())}>
              {nowBtnText}
            </button>
          </div>
        </div>
        {this.props.gridType === 'FLOCK' &&
          <FlockMovementCustomForm unitsOnly />
        }
        <div
          id='transfer'
          className={style.menuActivator}
          onClick={() => this.executeTransferAnimalAction('accept', 'null')}>
          <span id='transfer_animal' className={style.actionText}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.actions.direct_transfer_animal`,
              defaultMessage: `${config.labelBasePath}.actions.direct_transfer_animal`
            })}
          </span>
          <img id='transfer_img' className={style.actionImg} src='/naits/img/massActionsIcons/transfer_animal.png' />
        </div>
      </div>
    }

    const portalComponent = <React.Fragment>{component}</React.Fragment>
    const parentContainer = document.getElementById('fixedActionMenu')

    const portalValidation = () => {
      if (parentContainer === null) {
        return portalComponent
      } else {
        return (
          <React.Fragment>
            {ReactDOM.createPortal(portalComponent, parentContainer)}
            {this.state.showSearchPopup}
          </React.Fragment>
        )
      }
    }

    return (
      <React.Fragment>
        {this.state.loading ? <Loading /> : null}
        {portalValidation()}
      </React.Fragment>
    )
  }
}

AcceptAnimals.contextTypes = {
  intl: PropTypes.object.isRequired
}

AcceptAnimals.propTypes = {
  gridType: PropTypes.string.isRequired
}

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
  selectedObjects: state.gridConfig.gridHierarchy,
  selectedGridRows: state.selectedGridRows.selectedGridRows,
  massActionResult: state.massActionResult.result,
  directTransferMessage: state.directTransfer.result,
  directTransferError: state.directTransfer.error,
  isLoading: state.directTransfer.loading,
  componentToDisplay: state.componentToDisplay.componentToDisplay
})

export default connect(mapStateToProps)(AcceptAnimals)
