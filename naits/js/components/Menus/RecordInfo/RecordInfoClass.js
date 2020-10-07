import React from 'react'
import PropTypes from 'prop-types'
import { store } from 'tibro-redux'
import style from './RecordInfo.module.css'
import { connect } from 'react-redux'
import * as config from 'config/config.js'
import { reloadCachedSelectedObjectsData } from 'backend/reloadCachedSelectedObjectsData'
import { selectObject, gaEventTracker } from 'functions/utils'

class RecordInfoClass extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      pharagraphItemTitle: undefined

    }
  }

  componentDidMount () {
    // start functions
    this.loadFunctions(this.props)
  }

  componentWillReceiveProps (nextProps) {
    // start functions when data is changed (form is saved)
    if (this.props.gridConfig !== nextProps.gridConfig) {
      this.loadFunctions(nextProps)
    }

    // Reload the record info if a holding has been linked to a quarantine
    if (this.props.linkedHoldingToQuarantine !== nextProps.linkedHoldingToQuarantine) {
      reloadCachedSelectedObjectsData()
    }

    // Reload the record info if the pet ID has been changed
    if (this.props.petIdHasChanged !== nextProps.petIdHasChanged) {
      reloadCachedSelectedObjectsData()
    }

    // Reload the record info if the keeper/herder/associated has been removed
    if (this.props.removedKeeperFromHolding !== nextProps.removedKeeperFromHolding) {
      reloadCachedSelectedObjectsData()
    }

    // Reload the record info if the animal ear tag has been changed
    if (this.props.earTagHasBeenChanged !== nextProps.earTagHasBeenChanged) {
      reloadCachedSelectedObjectsData()
    }

    // Reload the record info if the population status has been updated
    if (this.props.populationStatusHasBeenUpdated !== nextProps.populationStatusHasBeenUpdated) {
      reloadCachedSelectedObjectsData()
    }

    // Reload the record info if the population name has been updated
    if (this.props.populationHasBeenUpdated !== nextProps.populationHasBeenUpdated) {
      reloadCachedSelectedObjectsData()
      store.dispatch({ type: 'RESET_STATE_AFTER_POPULATION_FORM_UPDATE' })
    }

    // Reload the record info if the holding status has been changed
    if (this.props.holdingStatusHasChanged !== nextProps.holdingStatusHasChanged) {
      reloadCachedSelectedObjectsData()
    }
  }

  loadFunctions = (props) => {
    this.setState(
      // first argument, function that returns an object
      this.currentRowToState(props),
      // second argument, setState callback
      () => {
        this.iterateConfig(
          this.state,
          props,
          this.translateCodes(
            this.createParagraphItems
          )
        )
      }
    )
  }

  // check if integer is a natural number
  isNatural = (n) => {
    if (typeof n !== 'number') {
      return false
    }
    return (n >= 0.0) && (Math.floor(n) === n) && n !== Infinity
  }
  // set selected row to state
  currentRowToState = (props) => {
    if (props && props.componentStack && props.componentStack.length) {
      let currentSelectedRowIndex
      props.componentStack.map((grid, index) => {
        if (grid.active) {
          currentSelectedRowIndex = index
        }
      })
      const currentSelectedRow = this.isNatural(currentSelectedRowIndex) && props.componentStack[currentSelectedRowIndex]

      return { ...currentSelectedRow.row, gridType: props.gridType }
    }
  }
  // iterate configuration prop
  iterateConfig = (state, props, callback) => {
    this.props.configuration(props.gridType, this.context.intl) &&
      props.configuration(props.gridType, this.context.intl).CHOSEN_ITEM &&
      props.configuration(props.gridType, this.context.intl).CHOSEN_ITEM.map(
        element => {
          if (callback instanceof Function) {
            callback(state, props, element)
          }
        }
      )
  }
  // translate codes from WS, see recordConfig.js
  translateCodes = (callback) => (state, props, element) => {
    if (element.ITEM_FUNC) {
      store.dispatch(element.ITEM_FUNC(
        // first argument is an object so we can use different functions from config file
        // the given function can use any of the data in the object
        {
          props,
          state,
          element,
          callback: (response) => {
            this.setState(
              { [`${props.gridType}.${element.ID}`]: response },
              () => {
                if (callback instanceof Function) {
                  callback(this.state, props, element)
                }
              }
            )
          }
        }
      ))
    } else {
      if (callback instanceof Function) {
        // state ass callback not this.state
        callback(state, props, element)
      }
    }
  }
  // create pharagraph items and set to state
  createParagraphItems = (state, props, element) => {
    const pharagraphItemTitle = [
      <p
        style={{ margin: '0' }}
        key={'record_info_' + props.gridType + 'title'} >
        {this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.${props.gridType.toLowerCase()}`,
          defaultMessage: `${config.labelBasePath}.main.${props.gridType.toLowerCase()}`
        })}
      </p>
    ]
    let pharagraphItem
    let style = { margin: '0' }
    let click
    const value = state[`${props.gridType}.${element.ID}`]

    if (element.LINK_TO_TABLE) {
      style = {
        margin: '0',
        color: '#c8990e',
        cursor: 'pointer'
      }
      click = () => {
        let found = false
        const objects = props.gridConfig.gridHierarchy
        for (let i = 0; i < objects.length; i++) {
          if (objects[i].gridId === element.LINK_TO_TABLE) {
            found = true
            selectObject(element.LINK_TO_TABLE)
            break
          }
        }
        if (!found) {
          let key
          let keys = Object.keys(value)
          let n = keys.length
          let row = {}
          while (n--) {
            key = keys[n]
            row[`${element.LINK_TO_TABLE}.${key.toUpperCase()}`] = value[key]
          }
          selectObject(element.LINK_TO_TABLE, row)
          if (props.gridToDisplay === 'HOLDING_RESPONSIBLE' && props.gridType === 'ANIMAL') {
            setTimeout(selectObject(element.LINK_TO_TABLE, row), 1000)
          }
        }
      }
      if (this.props.noHoldingFound) {
        pharagraphItem = null
      } else if (this.props.noOrgUnitFound) {
        pharagraphItem = null
      } else if (!(value instanceof Object)) {
        pharagraphItem = null
      } else {
        pharagraphItem = (value && <p onClick={click}
          style={style}
          key={'record_info_' + props.gridType + element.ID}
        >
          {props.gridType === 'INVENTORY_ITEM'
            ? `${element.LABEL}: ${value.NAME}`
            : `${element.LABEL}: ${value.PIC}`
          }
        </p>)
      }
    } else {
      pharagraphItem = (value && <p onClick={click}
        style={style}
        key={'record_info_' + props.gridType + element.ID}
      >
        {`${element.LABEL}: ${value}`}
      </p>)
    }
    this.setState({ pharagraphItemTitle, [element.ID]: pharagraphItem })
  }
  // render phararaph items
  renderParagraphItems = (state, props) => props.configuration(props.gridType, this.context.intl) &&
    props.configuration(props.gridType, this.context.intl).CHOSEN_ITEM &&
    props.configuration(props.gridType, this.context.intl).CHOSEN_ITEM.map(
      element => {
        return state[element.ID]
      }
    )

  onSelectedItem = () => {
    let gridType
    let holdingType
    if (this.props.selectedObjects.length > 0) {
      for (let i = 0; i < this.props.selectedObjects.length; i++) {
        if (this.props.selectedObjects[i].active) {
          gridType = this.props.selectedObjects[i].gridId
          holdingType = this.props.selectedObjects[i].row[`${gridType}.TYPE`]
        }
      }
    }
    let src
    switch (this.props.gridType) {
      case 'ANIMAL':
        src = '/naits/img/recordInfo/cow.png'
        break
      case 'PET':
        src = '/naits/img/recordInfo/pet.png'
        break
      case 'STRAY_PET':
        src = '/naits/img/recordInfo/pet.png'
        break
      case 'HOLDING_RESPONSIBLE':
        src = '/naits/img/recordInfo/holding_responsible.png'
        break
      case 'VACCINATION_EVENT':
        src = '/naits/img/recordInfo/medicine.png'
        break
      case 'QUARANTINE':
        src = '/naits/img/recordInfo/biohazard.png'
        break
      case 'AREA':
        src = '/naits/img/recordInfo/area_health.png'
        break
      case 'POPULATION':
        src = '/naits/img/recordInfo/population.png'
        break
      case 'SVAROG_ORG_UNITS':
        src = '/naits/img/recordInfo/transfer.png'
        break
      case 'EXPORT_CERT':
        src = '/naits/img/recordInfo/certificate.png'
        break
      case 'SAMPLE':
        src = '/naits/img/recordInfo/sample.png'
        break
      case 'ORDER':
        src = '/naits/img/recordInfo/order.png'
        break
      case 'TRANSFER':
        src = '/naits/img/recordInfo/transfer.png'
        break
      case 'SVAROG_USERS':
        src = '/naits/img/recordInfo/user.png'
        break
      case 'SVAROG_USER_GROUPS':
        src = '/naits/img/recordInfo/users.png'
        break
      case 'SVAROG_CODES':
        src = '/naits/img/recordInfo/code.png'
        break
      case 'LABORATORY':
        src = '/naits/img/recordInfo/labaratory.png'
        break
      case 'LAB_SAMPLE':
        src = '/naits/img/recordInfo/blood-test.png'
        break
      case 'LAB_TEST_TYPE':
        src = '/naits/img/recordInfo/test_type.png'
        break
      case 'MOVEMENT_DOC':
        src = '/naits/img/recordInfo/certificate.png'
        break
      case 'INVENTORY_ITEM':
        src = '/naits/img/MainPalette/19_inventory_item/inventory_item.svg'
    }
    switch (holdingType) {
      case '1':
        src = '/naits/img/recordInfo/village_pasture.png'
        break
      case '2':
        src = '/naits/img/recordInfo/remote_pasture.png'
        break
      case '3':
        src = '/naits/img/recordInfo/fair_expo.png'
        break
      case '4':
        src = '/naits/img/recordInfo/vet_supervision_points.png'
        break
      case '5':
        src = '/naits/img/recordInfo/commercial_farm.png'
        break
      case '6':
        src = '/naits/img/recordInfo/subsistence_farm.png'
        break
      case '7':
        src = '/naits/img/recordInfo/slaughter.png'
        break
      case '8':
        src = '/naits/img/recordInfo/farm.png'
        break
      case '9':
        src = '/naits/img/recordInfo/animal_hospital.png'
        break
      case '10':
        src = '/naits/img/recordInfo/animal_market.png'
        break
      case '14':
        src = '/naits/img/recordInfo/border_post.png'
        break
      case '15':
        src = '/naits/img/recordInfo/animal_shelter.png'
        break
      case '16':
        src = '/naits/img/recordInfo/veterinary_station.png'
        break
    }
    return <img id='show_picture' src={src} className={style.show_picture} />
  }

  render () {
    let keeper
    let village
    if (this.props.parentGrid === 'HOLDING' || this.props.parentGrid.endsWith('KEEPER')) {
      keeper = `${this.context.intl.formatMessage({
        id: `${config.labelBasePath}.main.holding.holding_keeper`,
        defaultMessage: `${config.labelBasePath}.main.holding.holding_keeper`
      })}: ${this.props.additionalData.HOLDING_KEEPER}`
      village = `${this.context.intl.formatMessage({
        id: `${config.labelBasePath}.grid_labels.village.village_name`,
        defaultMessage: `${config.labelBasePath}.grid_labels.village.village_name`
      })}: ${this.props.additionalData.HOLDING_VILLAGE}`
    }
    return (
      <div id='record_info' className={style.divMainContent}>
        <div id='selected_item' className={style.selected_item}>
          {this.state.pharagraphItemTitle}
          {this.renderParagraphItems(this.state, this.props)}
          {keeper}
          <br />
          {village}
        </div>
        <div id='picture_container' className={style.picture_container}>
          {this.onSelectedItem()}
        </div>
        <div>
          <button id='refresh_data' className='btn btn-success' style={{ float: 'right' }}
            onClick={() => {
              reloadCachedSelectedObjectsData()
              gaEventTracker(
                'REFRESH',
                `Clicked the refresh info button (${this.props.gridToDisplay})`,
                `RECORD_INFO | ${config.version} (${config.currentEnv})`
              )
            }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.refresh`,
              defaultMessage: `${config.labelBasePath}.main.refresh`
            })}
          </button>
        </div>
      </div>
    )
  }
}

RecordInfoClass.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  return ({
    gridConfig: state.gridConfig,
    additionalData: state.additionalData,
    selectedObjects: state.gridConfig.gridHierarchy,
    linkedHoldingToQuarantine: state.linkedObjects.linkedHoldingToQuarantine,
    noHoldingFound: state.getHoldingPic.noHoldingFound,
    noOrgUnitFound: state.getOrgUnitByObjectId.noOrgUnitFound,
    petIdHasChanged: state.replacePetId.petIdHasChanged,
    removedKeeperFromHolding: state.dropLink.removedKeeperFromHolding,
    earTagHasBeenChanged: state.earTagReplacement.earTagHasBeenChanged,
    populationStatusHasBeenUpdated: state.updatePopulationStatus.populationStatusHasBeenUpdated,
    populationHasBeenUpdated: state.additionalData.populationHasBeenUpdated,
    holdingStatusHasChanged: state.changeStatus.holdingStatusHasChanged
  })
}

export default connect(mapStateToProps)(RecordInfoClass)
