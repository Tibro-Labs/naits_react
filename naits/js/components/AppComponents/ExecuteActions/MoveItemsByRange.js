import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import { alertUser } from 'tibro-components'
import { store } from 'tibro-redux'
import * as config from 'config/config.js'
import { ComponentManager, GridInModalLinkObjects, ResultsGrid, Loading } from 'components/ComponentsIndex'
import { setInputFilter, disableEvents, calcDifference, formatAlertType, strcmp } from 'functions/utils'
import modalStyle from 'components/AppComponents/Functional/GridInModalLinkObjects.module.css'
import style from './ExecuteActionOnSelectedRows.module.css'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'
import consoleStyle from 'components/AppComponents/Functional/AdminConsole/AdminConsole.module.css'

class MoveItemsByRange extends React.Component {
  constructor (props) {
    super(props)
    const selectedObjects = props.gridHierarchy.filter(el => {
      return el.active === true
    })
    let gridToDisplay = 'SVAROG_ORG_UNITS'
    let orgUnitType = ''
    if (selectedObjects[0].gridType === 'SVAROG_ORG_UNITS') {
      if (selectedObjects[0].row[selectedObjects[0].gridType + '.ORG_UNIT_TYPE'] === 'VILLAGE_OFFICE') {
        gridToDisplay = 'HOLDING'
        orgUnitType = selectedObjects[0].row[selectedObjects[0].gridType + '.ORG_UNIT_TYPE']
      }
    }
    this.state = {
      alert: undefined,
      loading: false,
      showForm: false,
      showPopup: false,
      showHoldingPopup: false,
      tagTypes: ['7', '8', '1', '6', '4', '3', '2', '5'],
      tagTypesLabels: ['pet_rfid', 'rfid_tag', 'cattle', 'pet', 'pig_tag', 'sheep_tag', 'small_ruminants', 'ungulates'],
      selectedTagType: '',
      rangeFromInput: '',
      rangeToInput: '',
      quantityInput: '',
      reasonInput: '',
      destination: 'community',
      chosenDestination: '',
      currentOrgUnitName: '',
      currentOrgUnitType: '',
      currentOrgUnitObjId: '',
      transferType: '',
      gridTypeCall: '',
      filterValue: '',
      gridToDisplay,
      orgUnitType
    }
  }

  componentDidMount () {
    this.setState({ selectedTagType: '7' })
    this.getOrgUnitName()
  }

  componentDidUpdate (nextProps, nextState) {
    if (this.state.showForm !== nextState.showForm) {
      const destinationInput = document.getElementById('destinationInput')
      const rangeFromInput = document.getElementById('rangeFromInput')
      const rangeToInput = document.getElementById('rangeToInput')
      const quantityInput = document.getElementById('quantityInput')
      if (rangeFromInput) {
        setInputFilter(rangeFromInput, function (value) {
          return /^\d*$/.test(value)
        })
      }
      if (rangeToInput) {
        setInputFilter(rangeToInput, function (value) {
          return /^\d*$/.test(value)
        })
      }
      if (quantityInput) {
        setInputFilter(quantityInput, function (value) {
          return /^\d*$/.test(value)
        })
      }
      if (destinationInput) {
        disableEvents(destinationInput)
      }
    }
  }

  getOrgUnitName = () => {
    if (this.props.gridHierarchy) {
      this.props.gridHierarchy.forEach(grid => {
        if (grid.gridType === 'SVAROG_ORG_UNITS' && grid.row && grid.row['SVAROG_ORG_UNITS.NAME']) {
          this.setState({ currentOrgUnitName: grid.row['SVAROG_ORG_UNITS.NAME'], currentOrgUnitType: grid.row['SVAROG_ORG_UNITS.ORG_UNIT_TYPE'] })
        } else if (grid.gridType === 'HOLDING' && grid.row && grid.row['HOLDING.PIC']) {
          this.setState({ currentOrgUnitName: grid.row['HOLDING.PIC'] })
        }
      })
    }
  }

  showForm = transferType => {
    this.setState({ showForm: true, transferType }, () => {
      if (strcmp(transferType, 'reverse')) {
        const { currentOrgUnitType } = this.state
        if (currentOrgUnitType && (currentOrgUnitType.includes('REGION') || currentOrgUnitType.includes('MUNICIPALITY') ||
          currentOrgUnitType.includes('COMMUNITY') || currentOrgUnitType.includes('VILLAGE'))) {
          this.setState({ gridTypeCall: 'GET_BYOBJECTID' })
        } else {
          this.setState({ gridTypeCall: 'GET_TABLE_WITH_LIKE_FILTER_2' })
        }
      } else {
        this.setState({ gridTypeCall: 'GET_VALID_ORG_UNITS' })
      }
    })
  }

  closeForm = () => {
    this.setState({
      alert: undefined,
      showForm: false,
      selectedTagType: '7',
      rangeFromInput: '',
      rangeToInput: '',
      quantityInput: '',
      reasonInput: '',
      destination: 'community',
      chosenDestination: '',
      transferType: '',
      gridTypeCall: ''
    })
  }

  transitionToPopup = () => {
    const { destination } = this.state
    if (strcmp(destination, 'community')) {
      this.setState({ gridToDisplay: 'SVAROG_ORG_UNITS', showPopup: true, gridTypeCall: 'GET_VALID_ORG_UNITS' })
    } else if (strcmp(destination, 'holding')) {
      this.setState({ gridToDisplay: 'HOLDING', showHoldingPopup: true })
    }
  }

  handleDestination = e => {
    this.setState({ destination: e.target.value }, () => this.displayDestinationSelectionAlert())
  }

  displayDestinationSelectionAlert = () => {
    const promptLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.alert.move_items_by_range_arrival_place_prompt`,
      defaultMessage: `${config.labelBasePath}.alert.move_items_by_range_arrival_place_prompt`
    })
    const continueLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.forms.continue`,
      defaultMessage: `${config.labelBasePath}.main.forms.continue`
    })
    const cancelLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.forms.cancel`,
      defaultMessage: `${config.labelBasePath}.main.forms.cancel`
    })

    let wrapper = document.createElement('div')
    ReactDOM.render(
      <div style={{ marginLeft: '12px' }}>
        <label htmlFor='selectedDestination' style={{ padding: '0.9rem 2px' }}>
          {this.context.intl.formatMessage(
            {
              id: config.labelBasePath + '.form_labels.subject_to',
              defaultMessage: config.labelBasePath + '.form_labels.subject_to'
            }
          )}:
        </label>
        <select
          name='selectedDestination'
          id='selectedDestination'
          value={this.state.destination}
          className={consoleStyle.campaignDropdown}
          style={{ marginLeft: '1rem' }}
          onChange={this.handleDestination}
        >
          <option key='community' value='community'>
            {this.context.intl.formatMessage(
              {
                id: config.labelBasePath + '.grid_labels.holding.commun_code',
                defaultMessage: config.labelBasePath + '.grid_labels.holding.commun_code'
              }
            )}
          </option>
          <option key='holding' value='holding'>
            {this.context.intl.formatMessage(
              {
                id: config.labelBasePath + '.main.holding',
                defaultMessage: config.labelBasePath + '.main.holding'
              }
            )}
          </option>
        </select>
      </div>,
      wrapper
    )
    alertUser(
      true, 'info', promptLabel, '', () => this.transitionToPopup(), () => { },
      true, continueLabel, cancelLabel, true, null, true, wrapper
    )
  }

  showPopup = transferType => {
    if (strcmp(this.state.orgUnitType, 'VILLAGE_OFFICE') && strcmp(transferType, 'reverse')) {
      this.setState({ gridToDisplay: 'SVAROG_ORG_UNITS', showPopup: true })
    } else if (strcmp(this.state.orgUnitType, 'VILLAGE_OFFICE') && strcmp(transferType, 'direct')) {
      this.setState({ gridToDisplay: 'HOLDING', showPopup: true })
    } else if (strcmp(this.state.currentOrgUnitType, 'MUNICIPALITY_OFFICE') && strcmp(transferType, 'direct')) {
      this.displayDestinationSelectionAlert()
    } else {
      this.setState({ showPopup: true })
    }
  }

  closePopup = () => {
    this.setState({ showPopup: false })
    ComponentManager.cleanComponentReducerState(`${this.state.gridToDisplay}_${this.state.gridTypeCall}`)
  }

  closeHoldingPopup = () => {
    this.setState({ showHoldingPopup: false })
    ComponentManager.cleanComponentReducerState(this.state.gridToDisplay)
  }

  close = () => {
    this.setState({ alert: undefined })
  }

  handleTagTypeSelection = e => {
    this.setState({ selectedTagType: e.target.value })
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleDestinationSelection = () => {
    const { gridToDisplay, gridTypeCall, destination } = this.state
    let chosenDestinationObjId, chosenDestinationAltParam
    if (this.state.gridToDisplay === 'HOLDING') {
      if (strcmp(destination, 'holding')) {
        chosenDestinationObjId = store.getState()[gridToDisplay].rowClicked['HOLDING.OBJECT_ID']
        chosenDestinationAltParam = store.getState()[gridToDisplay].rowClicked['HOLDING.PIC']
        this.setState({ chosenDestination: chosenDestinationObjId })
        document.getElementById('destinationInput').value = chosenDestinationAltParam
        this.closeHoldingPopup()
      } else {
        chosenDestinationObjId = store.getState()[`${gridToDisplay}_${gridTypeCall}`].rowClicked['HOLDING.OBJECT_ID']
        chosenDestinationAltParam = store.getState()[`${gridToDisplay}_${gridTypeCall}`].rowClicked['HOLDING.PIC']
        this.setState({ chosenDestination: chosenDestinationObjId })
        document.getElementById('destinationInput').value = chosenDestinationAltParam
        this.closePopup()
      }
    } else {
      chosenDestinationObjId = store.getState()[`${gridToDisplay}_${gridTypeCall}`].rowClicked['SVAROG_ORG_UNITS.OBJECT_ID']
      chosenDestinationAltParam = store.getState()[`${gridToDisplay}_${gridTypeCall}`].rowClicked['SVAROG_ORG_UNITS.NAME']
      this.setState({ chosenDestination: chosenDestinationObjId })
      document.getElementById('destinationInput').value = chosenDestinationAltParam
      this.closePopup()
    }
  }

  moveItemsPrompt = () => {
    const { rangeFromInput, rangeToInput, chosenDestination } = this.state
    if ((!rangeFromInput && !rangeToInput && !chosenDestination) ||
      !rangeFromInput || !rangeToInput || !chosenDestination) {
      this.setState({
        alert: alertUser(
          true,
          'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.add_value_for_all_inputs_with_asterisk`,
            defaultMessage: `${config.labelBasePath}.alert.add_value_for_all_inputs_with_asterisk`
          }), null, () => { this.close() }
        )
      })
    } else if (parseInt(rangeToInput) < parseInt(rangeFromInput)) {
      this.setState({
        alert: alertUser(
          true,
          'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.error.startTagIdCannotBeLargerThanEndTagId`,
            defaultMessage: `${config.labelBasePath}.error.startTagIdCannotBeLargerThanEndTagId`
          }), null, () => { this.close() }
        )
      })
    } else {
      const rangeDiff = calcDifference(parseInt(rangeToInput), parseInt(rangeFromInput))
      if (rangeDiff > 10000) {
        this.setState({
          alert: alertUser(
            true,
            'warning',
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.error.transferRangeIsOverLimit`,
              defaultMessage: `${config.labelBasePath}.error.transferRangeIsOverLimit`
            }), null, () => { this.close() }
          )
        })
      } else {
        this.setState({
          alert: alertUser(
            true,
            'warning',
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.alert.confirm_move_items_by_range`,
              defaultMessage: `${config.labelBasePath}.alert.confirm_move_items_by_range`
            }), null, () => { this.moveItems() }, () => { this.close() }, true,
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.yes`,
              defaultMessage: `${config.labelBasePath}.main.yes`
            }),
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.no`,
              defaultMessage: `${config.labelBasePath}.main.no`
            })
          )
        })
      }
    }
  }

  moveItems = () => {
    this.setState({ loading: true })
    const { selectedTagType, rangeFromInput, rangeToInput, quantityInput, reasonInput, chosenDestination } = this.state
    const server = config.svConfig.restSvcBaseUrl
    let preCheckVerbPath = config.svConfig.triglavRestVerbs.PRECHECK_MOVE_ITEMS_BY_RANGE
    preCheckVerbPath = preCheckVerbPath.replace('%session', this.props.session)
    const preCheckUrl = `${server}${preCheckVerbPath}`
    let moveItemsVerbPath = config.svConfig.triglavRestVerbs.MOVE_ITEMS_BY_RANGE
    moveItemsVerbPath = moveItemsVerbPath.replace('%session', this.props.session)
    const moveItemsUrl = `${server}${moveItemsVerbPath}`
    const paramsArray = [{
      MASS_PARAM_TAG_TYPE: selectedTagType,
      MASS_PARAM_RANGE_FROM: parseInt(rangeFromInput),
      MASS_PARAM_RANGE_TO: parseInt(rangeToInput),
      MASS_PARAM_SENDER_OBJ_ID: this.props.parentId,
      MASS_PARAM_DESTINATION_OBJ_ID: chosenDestination,
      ...quantityInput && { MASS_PARAM_QUANTITY: parseInt(quantityInput) },
      ...reasonInput && { MASS_PARAM_REASON: reasonInput }
    }]
    axios.post(preCheckUrl, JSON.stringify({ paramsArray })).then(res => {
      if (res.data) {
        const resType = formatAlertType(res.data)
        if (strcmp(resType, 'success')) {
          axios.post(moveItemsUrl, JSON.stringify({ paramsArray }))
          const secondLabel = this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.second`,
            defaultMessage: `${config.labelBasePath}.main.second`
          })
          const secondsLabel = this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.seconds`,
            defaultMessage: `${config.labelBasePath}.main.seconds`
          })
          const minuteLabel = this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.minute`,
            defaultMessage: `${config.labelBasePath}.main.minute`
          })
          const minutesLabel = this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.minutes`,
            defaultMessage: `${config.labelBasePath}.main.minutes`
          })
          const estimationLabel = this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.generate_transfer_eta`,
            defaultMessage: `${config.labelBasePath}.alert.generate_transfer_eta`
          })
          const rangeDiff = calcDifference(parseInt(rangeToInput), parseInt(rangeFromInput))
          let etaLabel = ''
          const eta = rangeDiff * 0.25
          if (eta < 60) {
            if (eta < 1) {
              etaLabel = `${estimationLabel}: 1 ${secondLabel}`
            } else {
              if (eta === 1) {
                etaLabel = `${estimationLabel}: 1 ${secondLabel}`
              } else {
                etaLabel = `${estimationLabel}: ${Math.round(eta)} ${secondsLabel}`
              }
            }
          } else {
            if (eta <= 120) {
              etaLabel = `${estimationLabel}: 1 ${minuteLabel}`
            } else {
              etaLabel = `${estimationLabel}: ${Math.floor(eta / 60)} ${minutesLabel}`
            }
          }

          this.setState({
            alert: alertUser(
              true, 'info',
              this.context.intl.formatMessage({
                id: `${config.labelBasePath}.alert.transfer_process_has_been_started`,
                defaultMessage: `${config.labelBasePath}.alert.transfer_process_has_been_started`
              }), etaLabel, () => { this.closeForm() }
            ),
            loading: false
          })
        } else {
          if (res.data.includes('naits.error.senderDoesNotHaveInventoryItemsDefinedInTheRange')) {
            const splitRes = res.data.split('[')
            this.setState({
              alert: alertUser(
                true, resType, this.context.intl.formatMessage({
                  id: splitRes[0],
                  defaultMessage: splitRes[0]
                }), splitRes[1].slice(0, -1)
              ),
              loading: false
            })
          } else {
            this.setState({
              alert: alertUser(
                true, resType, this.context.intl.formatMessage({
                  id: res.data,
                  defaultMessage: res.data
                })
              ),
              loading: false
            })
          }
        }
      }
    }).catch(err => {
      console.error(err)
      this.setState({ alert: alertUser(true, 'error', err), loading: false })
    })
  }

  render () {
    const { customGridId } = this.props
    const { loading, tagTypes, tagTypesLabels, currentOrgUnitName, transferType } = this.state
    let externalId = null
    let parentOrgUnitObjId = null
    const currentOrgUnit = this.props.gridHierarchy.filter((element) => {
      return (element.active === true)
    })
    if (currentOrgUnit[0]) {
      externalId = currentOrgUnit[0].row['SVAROG_ORG_UNITS.EXTERNAL_ID'] || currentOrgUnit[0].row['HOLDING.VILLAGE_CODE']
      parentOrgUnitObjId = currentOrgUnit[0].row['SVAROG_ORG_UNITS.PARENT_OU_ID'] || null
    }

    const popup = (<div id='search_modal' className='modal' style={{ display: 'flex' }}>
      <div id='search_modal_content' className='modal-content'>
        <div className='modal-header' />
        <div id='search_modal_body' className='modal-body'>
          <ResultsGrid
            id={this.state.gridToDisplay + '_' + this.state.gridTypeCall}
            key='SVAROG_ORG_UNITS_SEARCH'
            gridToDisplay={this.state.gridToDisplay}
            onRowSelectProp={this.handleDestinationSelection}
            gridTypeCall={this.state.gridTypeCall}
            filterValue={this.state.filterValue}
            externalId={externalId}
            orgUnitObjId={parentOrgUnitObjId}
          />
        </div>
      </div>
      <div id='modal_close_btn' type='button' className={modalStyle.close}
        style={{
          position: 'absolute',
          right: 'calc(11% - 9px)',
          top: '44px',
          width: '32px',
          height: '32px',
          opacity: '1'
        }}
        onClick={this.closePopup} data-dismiss='modal' />
    </div>)

    const holdingPopup = (
      <GridInModalLinkObjects
        loadFromParent
        linkedTable='HOLDING'
        onRowSelect={this.handleDestinationSelection}
        key='HOLDING_SEARCH'
        closeModal={this.closeHoldingPopup}
        isFromMoveItemsByRangeAction
        externalId={externalId}
      />
    )

    let label = ''
    if (strcmp(transferType, 'reverse')) {
      label = this.context.intl.formatMessage({
        id: `${config.labelBasePath}.main.move_items_backwards`,
        defaultMessage: `${config.labelBasePath}.main.move_items_backwards`
      })
    } else {
      label = this.context.intl.formatMessage({
        id: `${config.labelBasePath}.main.move_items_by_range`,
        defaultMessage: `${config.labelBasePath}.main.move_items_by_range`
      })
    }

    const form = (
      <div id='form_modal' className='modal' style={{ display: 'block' }}>
        <div id='form_modal_content' className='modal-content disable_scroll_bar'>
          {loading && <Loading />}
          <div className='modal-header'>
            <button id='modal_close_btn' type='button' className='close'
              onClick={this.closeForm} >&times;</button>
          </div>
          <div id='form_modal_body' className='modal-body'>
            <div
              id='move_items_by_range_form'
              className='form-test custom-modal-content disable_scroll_bar container'
              style={{ color: '#ffffff' }}
            >
              <legend style={{ textAlign: 'center', marginTop: '1rem' }}>{label}</legend>
              <div className='form-group field field-object' style={{ textAlign: 'center' }}>
                <fieldset>
                  <legend>
                    {this.context.intl.formatMessage({
                      id: `${config.labelBasePath}.form_labels.transfer_range.info`,
                      defaultMessage: `${config.labelBasePath}.form_labels.transfer_range.info`
                    })}
                  </legend>
                  <div className='form-group field field-string'>
                    <label htmlFor='rangeFromInput'>
                      {this.context.intl.formatMessage({
                        id: `${config.labelBasePath}.main.range_from`,
                        defaultMessage: `${config.labelBasePath}.main.range_from`
                      })}*
                    </label>
                    <input
                      type='text'
                      id='rangeFromInput'
                      name='rangeFromInput'
                      onChange={this.handleChange}
                      className='form-control'
                      style={{ width: '163px', marginTop: '2px' }}
                    />
                  </div>
                  <div className='form-group field field-string'>
                    <label htmlFor='rangeToInput'>
                      {this.context.intl.formatMessage({
                        id: `${config.labelBasePath}.main.range_to`,
                        defaultMessage: `${config.labelBasePath}.main.range_to`
                      })}*
                    </label>
                    <input
                      type='text'
                      id='rangeToInput'
                      name='rangeToInput'
                      onChange={this.handleChange}
                      className='form-control'
                      style={{ width: '163px', marginTop: '2px' }}
                    />
                  </div>
                  <div className='form-group field field-string'>
                    <label htmlFor='tagType'>
                      {this.context.intl.formatMessage(
                        {
                          id: `${config.labelBasePath}.main.inv_item_tag_type`,
                          defaultMessage: `${config.labelBasePath}.main.inv_item_tag_type`
                        }
                      )}*
                    </label>
                    <select
                      id='tagType'
                      className='form-control'
                      style={{
                        backgroundColor: '#e3eedd',
                        color: '#000000',
                        marginTop: '2px',
                        width: 'auto'
                      }}
                      onChange={this.handleTagTypeSelection}
                    >
                      {tagTypes.map((tag, index) => {
                        return <option key={tag} value={tag}>
                          {this.context.intl.formatMessage(
                            {
                              id: `${config.labelBasePath}.tag.${tagTypesLabels[index]}`,
                              defaultMessage: `${config.labelBasePath}.tag.${tagTypesLabels[index]}`
                            }
                          )}
                        </option>
                      })}
                    </select>
                  </div>
                  <div className='form-group field field-string'>
                    <label htmlFor='quantityInput'>
                      {this.context.intl.formatMessage({
                        id: `${config.labelBasePath}.form_labels.quantity`,
                        defaultMessage: `${config.labelBasePath}.form_labels.quantity`
                      })}
                    </label>
                    <input
                      type='text'
                      id='quantityInput'
                      name='quantityInput'
                      onChange={this.handleChange}
                      className='form-control'
                      style={{ width: 'auto', marginTop: '2px' }}
                    />
                  </div>
                </fieldset>
              </div>
              <div className='form-group field field-object' style={{ textAlign: 'center' }}>
                <fieldset>
                  <legend>
                    {this.context.intl.formatMessage({
                      id: `${config.labelBasePath}.form_labels.dept_arr.info`,
                      defaultMessage: `${config.labelBasePath}.form_labels.dept_arr.info`
                    })}
                  </legend>
                  <div className='form-group field field-string'>
                    <label htmlFor='departureInput'>
                      {this.context.intl.formatMessage({
                        id: `${config.labelBasePath}.form_labels.subject_from`,
                        defaultMessage: `${config.labelBasePath}.form_labels.subject_from`
                      })}
                    </label>
                    <input
                      type='text'
                      id='departureInput'
                      className='form-control'
                      readOnly
                      value={this.state.currentOrgUnitName}
                      style={{ width: 'auto', marginTop: '2px' }}
                    />
                  </div>
                  <div className='form-group field field-string'>
                    <label htmlFor='destinationInput'>
                      {this.context.intl.formatMessage({
                        id: `${config.labelBasePath}.form_labels.subject_to`,
                        defaultMessage: `${config.labelBasePath}.form_labels.subject_to`
                      })}*
                    </label>
                    <input
                      type='text'
                      id='destinationInput'
                      name='destinationInput'
                      onClick={() => this.showPopup(this.state.transferType)}
                      className='form-control'
                      style={{ width: 'auto', marginTop: '2px' }}
                    />
                  </div>
                </fieldset>
              </div>
              <div className='form-group field field-object' style={{ textAlign: 'center' }}>
                <fieldset>
                  <legend>
                    {this.context.intl.formatMessage({
                      id: `${config.labelBasePath}.form_labels.transfer.reason`,
                      defaultMessage: `${config.labelBasePath}.form_labels.transfer.reason`
                    })}
                  </legend>
                  <div className='form-group field field-string'>
                    <label htmlFor='reasonInput'>
                      {this.context.intl.formatMessage({
                        id: `${config.labelBasePath}.form_labels.transfer.reason`,
                        defaultMessage: `${config.labelBasePath}.form_labels.transfer.reason`
                      })}
                    </label>
                    <textarea
                      id='reasonInput'
                      name='reasonInput'
                      onChange={this.handleChange}
                      className='form-control'
                      style={{ width: 'auto', marginTop: '2px' }}
                    />
                  </div>
                </fieldset>
              </div>
              <div style={{ marginTop: '3rem', float: 'right', marginRight: '5px' }}>
                <button id='moveItems' className='btn-success btn_save_form' onClick={this.moveItemsPrompt}>{label}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )

    return (
      customGridId && !strcmp(customGridId, 'TRANSFER_INCOME') &&
      <React.Fragment>
        <div
          id='move_items_by_range_container'
          className={styles.container}
          style={{
            cursor: 'pointer',
            marginRight: '7px',
            color: 'white',
            display: strcmp(customGridId, 'INVENTORY_ITEM_HOLDING') ? 'none' : null
          }}
          onClick={() => this.showForm('direct')}
        >
          <p style={{ marginTop: '2px' }}>{label}</p>
          <div id='move_items_by_range' className={styles['gauge-container']}>
            <svg viewBox='0 0 58 58' className={styles.svgUtil} style={{ fill: '#ffffff' }}>
              <g>
                <path d='M45.5,44c-3.86,0-7,3.141-7,7s3.14,7,7,7s7-3.141,7-7S49.36,44,45.5,44z M45.5,56c-2.757,0-5-2.243-5-5s2.243-5,5-5
                s5,2.243,5,5S48.257,56,45.5,56z'
                />
                <path d='M50.793,30.293L46.5,34.586V13.92c3.387-0.488,6-3.401,6-6.92c0-3.859-3.14-7-7-7s-7,3.141-7,7c0,3.519,2.613,6.432,6,6.92
                v20.666l-4.293-4.293c-0.391-0.391-1.023-0.391-1.414,0s-0.391,1.023,0,1.414l6,6C44.988,37.902,45.244,38,45.5,38
                s0.512-0.098,0.707-0.293l6-6c0.391-0.391,0.391-1.023,0-1.414S51.184,29.902,50.793,30.293z M40.5,7c0-2.757,2.243-5,5-5
                s5,2.243,5,5s-2.243,5-5,5S40.5,9.757,40.5,7z'
                />
                <path d='M33.423,50.618c-0.051-0.123-0.124-0.233-0.217-0.326l-5.999-5.999c-0.391-0.391-1.023-0.391-1.414,0s-0.391,1.023,0,1.414
                L30.086,50h-7.812c-4.838,0-8.774-3.937-8.774-8.774V13.92c3.387-0.488,6-3.401,6-6.92c0-3.859-3.14-7-7-7s-7,3.141-7,7
                c0,3.519,2.613,6.432,6,6.92v27.305C11.5,47.167,16.333,52,22.274,52h7.812l-4.293,4.293c-0.391,0.391-0.391,1.023,0,1.414
                C25.988,57.902,26.244,58,26.5,58s0.512-0.098,0.707-0.293l5.999-5.999c0.093-0.092,0.166-0.203,0.217-0.326
                C33.524,51.138,33.524,50.862,33.423,50.618z M7.5,7c0-2.757,2.243-5,5-5s5,2.243,5,5s-2.243,5-5,5S7.5,9.757,7.5,7z'
                />
              </g><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g />
            </svg>
          </div>
        </div>
        {currentOrgUnitName && !strcmp(currentOrgUnitName, 'HEADQUARTER') && <div
          id='partial_reverse_transfer_container'
          className={styles.container}
          style={{ cursor: 'pointer', marginRight: '7px', color: 'white', width: '155px' }}
          onClick={() => this.showForm('reverse')}
        >
          <p style={{ marginTop: '2px', marginLeft: '13px' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.move_items_backwards`,
              defaultMessage: `${config.labelBasePath}.main.move_items_backwards`
            })}
          </p>
          <div id='partial_reverse_transfer' className={styles['gauge-container']} style={{ marginRight: '-12px' }}>
            <img
              id='partial_reverse_transfer_img' className={style.actionImg} style={{ height: '45px', marginTop: '7%' }}
              src='/naits/img/massActionsIcons/undo.png'
            />
          </div>
        </div>}
        {this.state.showForm &&
          ReactDOM.createPortal(form, document.getElementById('app'))
        }
        {this.state.showPopup &&
          ReactDOM.createPortal(popup, document.getElementById('app'))
        }
        {this.state.showHoldingPopup &&
          ReactDOM.createPortal(holdingPopup, document.getElementById('app'))
        }
      </React.Fragment>
    )
  }
}

MoveItemsByRange.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession,
  gridHierarchy: state.gridConfig.gridHierarchy
})

export default connect(mapStateToProps)(MoveItemsByRange)
