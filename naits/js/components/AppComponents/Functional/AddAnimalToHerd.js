import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import axios from 'axios'
import { alertUser } from 'tibro-components'
import { updateSelectedRows } from 'tibro-redux'
import { ComponentManager, GridManager, ResultsGrid, Loading } from 'components/ComponentsIndex'
import { menuConfig } from 'config/menuConfig'
import * as config from 'config/config.js'
import { strcmp, isValidArray, formatAlertType, onGridSelectionChange } from 'functions/utils'
import style from 'components/AppComponents/ExecuteActions/ExecuteActionOnSelectedRows.module.css'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'

class AddAnimalToHerd extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      availableAnimalsGrid: undefined,
      availableAnimalsGridId: ''
    }
  }

  addAnimalsToHerdPrompt = () => {
    const { selectedGridRows, herdAnimalType } = this.props
    if (!isValidArray(selectedGridRows, 1)) {
      alertUser(true, 'warning',
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.alert.empty_selection`,
          defaultMessage: `${config.labelBasePath}.alert.empty_selection`
        })
      )
    } else {
      const filteredGridRows = selectedGridRows.filter(row => row['ANIMAL.ANIMAL_CLASS'] === herdAnimalType)
      if (isValidArray(filteredGridRows, 1)) {
        alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.add_animal_to_herd_prompt`,
            defaultMessage: `${config.labelBasePath}.alert.add_animal_to_herd_prompt`
          }) + '?', null, () => this.addAnimalsToHerdAction(filteredGridRows, herdAnimalType), () => { }, true,
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.yes`,
            defaultMessage: `${config.labelBasePath}.main.yes`
          }),
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.no`,
            defaultMessage: `${config.labelBasePath}.main.no`
          })
        )
      } else {
        alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.animal_type_does_not_match_the_herd_type`,
            defaultMessage: `${config.labelBasePath}.alert.animal_type_does_not_match_the_herd_type`
          })
        )
      }
    }
  }

  addAnimalsToHerdAction = (objectArray, herdAnimalType) => {
    const { herdObjId, herdContactPersonId, gridId, session } = this.props
    const { availableAnimalsGridId } = this.state
    this.setState({ loading: true })
    const actionType = 'HERD_ACTIONS'
    const actionName = 'ADD_ANIMAL_TO_HERD'
    const paramsArray = [{
      MASS_PARAM_ACTION: actionType,
      MASS_PARAM_SUBACTION: actionName,
      MASS_PARAM_ANIMAL_CLASS: herdAnimalType,
      MASS_PARAM_HERD_OBJ_ID: herdObjId,
      MASS_PARAM_HERD_NAME: '',
      MASS_PARAM_HERD_CONTACT_PERSON_ID: herdContactPersonId,
      MASS_PARAM_HERD_NOTE: ''
    }]
    const verbPath = config.svConfig.triglavRestVerbs.ADD_ANIMAL_TO_HERD
    const url = `${config.svConfig.restSvcBaseUrl}${verbPath}/${session}`
    const reqConfig = { method: 'post', url, data: JSON.stringify({ objectArray, paramsArray }) }
    axios(reqConfig).then(res => {
      if (res.data) {
        this.setState({ loading: false })
        const resType = formatAlertType(res.data)
        alertUser(true, resType, this.context.intl.formatMessage({ id: res.data, defaultMessage: res.data }))
        if (strcmp(resType, 'success')) {
          this.props.updateSelectedRows([], null)
          ComponentManager.setStateForComponent(gridId, 'selectedIndexes', [])
          GridManager.reloadGridData(gridId)
          this.closeAvailableAnimalsGrid(availableAnimalsGridId)
        }
      }
    }).catch(err => {
      console.error(err)
      alertUser(true, 'error', err)
      this.setState({ loading: false })
    })
  }

  onClick = () => {
    const { gridId, herdObjId, herdAnimalType } = this.props
    const id = `${gridId}_${herdAnimalType}`
    this.setState({ availableAnimalsGridId: id })
    // First, reset the selected rows state, just in case we have lingering data from the initial animals grid
    this.props.updateSelectedRows([], null)
    ComponentManager.setStateForComponent(gridId, 'selectedIndexes', [])
    // And also, clean-up the previous available animals grid state
    ComponentManager.cleanComponentReducerState(id)

    const btnId = 'add_animal_to_herd_btn'
    const gridConfig = menuConfig('GRID_CONFIG', this.context.intl)
    const availableAnimalsGrid = <div id='search_modal' className='modal to-front' style={{ display: 'flex' }}>
      <div id='search_modal_content' className='modal-content'>
        <div className='modal-header' />
        <div id='search_modal_body' className='modal-body'>
          <button id={btnId} className='btn-success' style={{ marginTop: '1rem', fontSize: 'x-large', padding: '0.5rem' }} onClick={this.addAnimalsToHerdPrompt}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.add_animal_to_herd`,
              defaultMessage: `${config.labelBasePath}.main.add_animal_to_herd`
            })}
          </button>
          <ResultsGrid key={id} id={id} gridToDisplay='ANIMAL' gridConfig={gridConfig} enableMultiSelect onSelectChangeFunct={onGridSelectionChange}
            customGridDataWS='GET_AVAILABLE_ANIMALS_PER_TYPE' herdObjId={herdObjId} herdAnimalType={herdAnimalType}
          />
        </div>
      </div>
      <div id='modal_close_btn' type='button' className='js-components-AppComponents-Functional-GridInModalLinkObjects-module-close'
        style={{ position: 'absolute', right: 'calc(11% - 9px)', top: '44px', width: '32px', height: '32px', opacity: '1' }}
        onClick={() => this.closeAvailableAnimalsGrid(id)} data-dismiss='modal' />
    </div>

    this.setState({ availableAnimalsGrid: undefined }, () => this.setState({ availableAnimalsGrid }))
  }

  closeAvailableAnimalsGrid = gridId => {
    this.setState({ availableAnimalsGrid: undefined, availableAnimalsGridId: '' })
    this.props.updateSelectedRows([], null)
    ComponentManager.setStateForComponent(gridId, 'selectedIndexes', [])
    ComponentManager.cleanComponentReducerState(gridId)
  }

  render () {
    const btnId = 'add_animal_to_herd'
    return <React.Fragment>
      <button id={btnId} onClick={this.onClick} className={styles.container} style={{ cursor: 'pointer', marginRight: '7px', color: 'white', width: '150px' }}>
        <span id='add_animal_to_herd_description' className={style.actionText} style={{ marginLeft: '3%', marginTop: '10px' }}>
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.add_animal_to_herd`,
            defaultMessage: `${config.labelBasePath}.main.add_animal_to_herd`
          })}
        </span>
        <img id='add_animal_to_herd_img' src='/naits/img/MainPalette/3_animals/animals_final.svg' />
      </button>
      {this.state.loading && <Loading />}
      {this.state.availableAnimalsGrid}
    </React.Fragment>
  }
}

AddAnimalToHerd.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession,
  selectedGridRows: state.selectedGridRows.selectedGridRows
})

const mapDispatchToProps = dispatch => ({
  updateSelectedRows: (...params) => {
    dispatch(updateSelectedRows(...params))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(AddAnimalToHerd)
