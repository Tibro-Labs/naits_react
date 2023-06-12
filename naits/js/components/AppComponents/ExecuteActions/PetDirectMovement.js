import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Loading from 'components/Loading'
import axios from 'axios'
import { connect } from 'react-redux'
import { store } from 'tibro-redux'
import { alertUser } from 'tibro-components'
import * as config from 'config/config.js'
import { GridManager, FormManager, ComponentManager, GridInModalLinkObjects } from 'components/ComponentsIndex'
import { CustomPetCollectFormWrapper } from 'containers/InputWrappers'
import style from 'components/AppComponents/ExecuteActions/ExecuteActionOnSelectedRows.module.css'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'
import { formatAlertType, convertToShortDate } from 'functions/utils'

class PetDirectMovement extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: null,
      loading: false,
      displayDirectMovementModal: false,
      activityDate: null,
      gridToDisplay: 'PET',
      inputElementId: 'selectPet',
      holdingObjectId: '',
      selectedPetId: '',
      selectedPetObjId: '',
      currentHolding: [],
      petCollectionForm: undefined,
      strayPetAddressInput: '',
      strayPetWeightInput: '',
      strayPetResponsibleNameInput: '',
      strayPetResponsibleSurnameInput: '',
      strayPetResponsibleNatRegNumInput: '',
      collectionType: ''
    }
  }

  componentDidMount () {
    // Get the currently selected holding's data & its object id
    this.getCurrentHoldingDataAndObjId()
  }

  getCurrentHoldingDataAndObjId = () => {
    let holdingObjectId
    let currentHolding = []
    this.props.gridHierarchy.map(singleGrid => {
      if (singleGrid.active && singleGrid.gridType === 'HOLDING') {
        holdingObjectId = singleGrid.row['HOLDING.OBJECT_ID']
        delete singleGrid.row['ROW_ID']
        currentHolding.push(singleGrid.row)
        this.setState({ holdingObjectId, currentHolding })
      }
    })
  }

  setActivityDate = event => {
    this.setState({ activityDate: event.target.value })
  }

  petDirectMovementAction = async () => {
    if (this.state.selectedPetObjId === '') {
      this.close()
    } else {
      this.setState({ loading: true })
      const objectArray = this.state.currentHolding
      const tableName = 'HOLDING'
      const actionType = 'DIRECT_MOVEMENT'
      let shortDate
      if (!this.state.activityDate) {
        shortDate = convertToShortDate(new Date(), 'y-m-d')
      } else {
        shortDate = this.state.activityDate
      }

      const paramsArray = [{
        MASS_PARAM_TBL_NAME: tableName,
        MASS_PARAM_ACTION: actionType,
        MASS_PARAM_ACTION_DATE: shortDate,
        MASS_PARAM_ADDITIONAL_PARAM: this.state.selectedPetObjId
      }]

      const verbPath = config.svConfig.triglavRestVerbs.MASS_PET_ACTION
      const url = `${config.svConfig.restSvcBaseUrl}${verbPath}/${this.props.session}`

      try {
        const res = await axios({
          method: 'post',
          url: url,
          data: JSON.stringify({ objectArray, paramsArray })
        })

        if (res.data.includes('error')) {
          store.dispatch({ type: 'PET_DIRECT_MOVEMENT_ACTION_REJECTED', payload: res.data })
        } else if (res.data.includes('success')) {
          store.dispatch({ type: 'PET_DIRECT_MOVEMENT_ACTION_FULFILLED', payload: res.data })
        }
        const responseType = formatAlertType(res.data)
        this.setState({
          alert: alertUser(
            true,
            responseType,
            this.context.intl.formatMessage({
              id: res.data,
              defaultMessage: res.data
            }),
            null,
            () => {
              if (responseType === 'success') {
                this.prepareCollectionLocationForm()
              } else {
                store.dispatch({ type: 'RESET_LAST_PET_MOVEMENT' })
                this.close()
              }
            }
          ),
          loading: false
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
          ),
          loading: false
        })
      }
    }
  }

  reloadData = () => {
    GridManager.reloadGridData(`${this.props.selectedObject}_${this.state.holdingObjectId}_ALL_PETS`)
    store.dispatch({ type: 'PET_DIRECT_MOVEMENT_ACTION_RESET' })
    this.setState({
      petCollectionForm: undefined,
      selectedPetId: '',
      selectedPetObjId: '',
      activityDate: null
    })
  }

  closeCollectionDetailsForm = () => {
    this.setState({
      petCollectionForm: undefined,
      strayPetAddressInput: '',
      strayPetWeightInput: '',
      strayPetResponsibleNameInput: '',
      strayPetResponsibleSurnameInput: '',
      strayPetResponsibleNatRegNumInput: '',
      collectionType: '',
      selectedPetId: '',
      selectedPetObjId: ''
    })
  }

  chooseItem = () => {
    if (!store.getState()[`${this.state.gridToDisplay}`].rowClicked[`${this.state.gridToDisplay}.PET_ID`]) {
      this.setState({
        alert: alertUser(
          true, 'error',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.error.select_pet_with_valid_id`,
            defaultMessage: `${config.labelBasePath}.error.select_pet_with_valid_id`
          })
        )
      })
    } else {
      const selectedPetObjId = String(store.getState()[`${this.state.gridToDisplay}`].rowClicked[`${this.state.gridToDisplay}.OBJECT_ID`])
      const selectedPetId = String(store.getState()[`${this.state.gridToDisplay}`].rowClicked[`${this.state.gridToDisplay}.PET_ID`])
      this.setState({ selectedPetObjId, selectedPetId })
      const server = config.svConfig.restSvcBaseUrl
      const verbPath = config.svConfig.triglavRestVerbs.CHECK_IF_PET_ALREADY_EXISTS_IN_ANOTHER_HOLDING
      let url = `${server}${verbPath}`
      url = url.replace('%sessionId', this.props.session)
      url = url.replace('%petId', selectedPetId)
      axios.get(url).then(res => {
        if (res.data && res.data.LABEL_CODE) {
          const holdingName = res.data.NAME || ''
          const holdingPic = res.data.PIC || ''
          let wrapper = document.createElement('div')
          ReactDOM.render(
            <div style={{ marginLeft: '12px' }}>
              <label htmlFor='setActivityDate' style={{ marginRight: '8px' }}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.set_activity_date`,
                  defaultMessage: `${config.labelBasePath}.main.set_activity_date`
                })}
              </label>
              <br />
              <input
                style={{ border: 'none', height: '40px', color: '#000', backgroundColor: '#eff0f1' }}
                type='date'
                name='setActivityDate'
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
                id: res.data.LABEL_CODE,
                defaultMessage: res.data.LABEL_CODE
              }) + ': ' + holdingName + ' ' + holdingPic + '. ' +
              this.context.intl.formatMessage({
                id: `${config.labelBasePath}.alert.move_pet_to_holding_prompt`,
                defaultMessage: `${config.labelBasePath}.alert.move_pet_to_holding_prompt`
              }),
              this.context.intl.formatMessage({
                id: `${config.labelBasePath}.actions.default_date_msg`,
                defaultMessage: `${config.labelBasePath}.actions.default_date_msg`
              }),
              () => this.petDirectMovementAction(),
              () => this.close(),
              true,
              this.context.intl.formatMessage({
                id: `${config.labelBasePath}.actions.proceed`,
                defaultMessage: `${config.labelBasePath}.actions.proceed`
              }),
              this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.no`,
                defaultMessage: `${config.labelBasePath}.main.no`
              }),
              true,
              null,
              true,
              wrapper
            )
          })
        } else {
          let wrapper = document.createElement('div')
          ReactDOM.render(
            <div style={{ marginLeft: '12px' }}>
              <label htmlFor='setActivityDate' style={{ marginRight: '8px' }}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.set_activity_date`,
                  defaultMessage: `${config.labelBasePath}.main.set_activity_date`
                })}
              </label>
              <br />
              <input
                style={{ border: 'none', height: '40px', color: '#000', backgroundColor: '#eff0f1' }}
                type='date'
                name='setActivityDate'
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
                id: `${config.labelBasePath}.main.pet_direct_movement`,
                defaultMessage: `${config.labelBasePath}.main.pet_direct_movement`
              }),
              this.context.intl.formatMessage({
                id: `${config.labelBasePath}.actions.default_date_msg`,
                defaultMessage: `${config.labelBasePath}.actions.default_date_msg`
              }),
              () => this.petDirectMovementAction(),
              () => this.close(),
              true,
              this.context.intl.formatMessage({
                id: `${config.labelBasePath}.actions.proceed`,
                defaultMessage: `${config.labelBasePath}.actions.proceed`
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
      }).catch(err => console.error(err))

      let additionalVerbPath = config.svConfig.triglavRestVerbs.GET_LAST_PET_MOVEMENT
      additionalVerbPath = additionalVerbPath.replace('%session', this.props.session)
      additionalVerbPath = additionalVerbPath.replace('%objectId', selectedPetObjId)
      const additionalUrl = `${server}${additionalVerbPath}`
      axios.get(additionalUrl).then(res => {
        if (res.data && typeof res.data === 'number' && res.data !== 0) {
          store.dispatch({ type: 'LAST_PET_MOVEMENT_FULFILLED', payload: res.data })
        }
      }).catch(err => {
        store.dispatch({ type: 'LAST_PET_MOVEMENT_REJECTED' })
        console.error(err)
      })
    }
  }

  prepareCollectionLocationForm = () => {
    const { selectedPetObjId, holdingObjectId } = this.state
    this.closeModal()
    this.setState({ loading: true })
    this.displayCollectionLocationForm(selectedPetObjId, holdingObjectId)
  }

  displayCollectionLocationForm = (petObjId, currentHoldingObjId) => {
    const formId = 'STRAY_PET_LOCATION_ADDITIONAL_FORM'
    const params = []
    params.push({
      PARAM_NAME: 'formWeWant',
      PARAM_VALUE: 'STRAY_PET_LOCATION'
    }, {
      PARAM_NAME: 'session',
      PARAM_VALUE: this.props.session
    }, {
      PARAM_NAME: 'table_name',
      PARAM_VALUE: 'STRAY_PET_LOCATION'
    }, {
      PARAM_NAME: 'object_id',
      PARAM_VALUE: 0
    }, {
      PARAM_NAME: 'parent_id',
      PARAM_VALUE: petObjId
    }, {
      PARAM_NAME: 'locationReason',
      PARAM_VALUE: '1'
    }, {
      PARAM_NAME: 'currentHoldingObjId',
      PARAM_VALUE: currentHoldingObjId
    })

    const collectionDetailsForm = FormManager.generateForm(
      formId, formId, params, 'formData',
      'GET_FORM_BUILDER', 'GET_UISCHEMA', 'EXTENDED_CUSTOM_GET_TABLE_FORMDATA',
      this.closeCollectionDetailsForm, null, null, null, null, null, 'closeAndDelete',
      () => this.closeCollectionDetailsForm(), undefined, undefined,
      undefined, CustomPetCollectFormWrapper
    )

    this.setState({ loading: false, showCollectionDetailsForm: true, collectionDetailsForm })
  }

  closeCollectionDetailsForm = () => {
    this.reloadData()
    store.dispatch({ type: 'RESET_PET_FORM_AFTER_SAVE' })
    store.dispatch({ type: 'RESET_LAST_PET_MOVEMENT' })
    this.setState({ showCollectionDetailsForm: false, collectionDetailsForm: undefined })
  }

  displayDirectMovementModal () {
    this.setState({ displayDirectMovementModal: true })
  }

  close = () => {
    this.setState({ alert: false, activityDate: null })
  }

  closeModal = () => {
    this.setState({
      alert: false,
      displayDirectMovementModal: false
    })
    ComponentManager.cleanComponentReducerState(`${this.state.gridToDisplay}`)
  }

  render () {
    const searchPopup = <div id='search_modal' className='modal' style={{ display: 'flex' }}>
      <div id='search_modal_content' className='modal-content'>
        <div className='modal-header' />
        <div id='search_modal_body' className='modal-body'>
          <GridInModalLinkObjects
            loadFromParent
            linkedTable={this.state.gridToDisplay}
            onRowSelect={this.chooseItem}
            key={this.state.gridToDisplay + '_' + this.state.inputElementId}
            closeModal={this.closeModal}
            isFromPetDirectMovement
          />
        </div>
      </div>
    </div>

    return (
      <div id='pet_direct_movement_container'>
        <button
          id='pet_direct_movement'
          className={styles.container} style={{ cursor: 'pointer', width: '150px', color: 'white' }}
          onClick={() => this.displayDirectMovementModal()}
        >
          <span
            id='pet_direct_movement_action_text'
            className={style.actionText} style={{ marginLeft: '1%', wordWrap: 'inherit' }}
          >
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.pet_direct_movement`,
              defaultMessage: `${config.labelBasePath}.main.pet_direct_movement`
            })}
          </span>
          <img id='animal_mass_img' src='/naits/img/massActionsIcons/transfer_animal.png' />
        </button>
        {this.state.showCollectionDetailsForm &&
          <div id='form_modal' className='modal' style={{ display: 'block' }}>
            <div id='form_modal_content' className='modal-content'>
              <div id='form_modal_body' className='modal-body' style={{ marginTop: '1rem' }}>
                {this.state.collectionDetailsForm}
              </div>
            </div>
          </div>
        }
        {this.state.displayDirectMovementModal && ReactDOM.createPortal(searchPopup, document.getElementById('app').parentNode)}
        {this.state.petCollectionForm && ReactDOM.createPortal(this.state.petCollectionForm, document.getElementById('app').parentNode)}
        {this.state.loading && <Loading />}
      </div>
    )
  }
}

PetDirectMovement.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  gridHierarchy: state.gridConfig.gridHierarchy,
  session: state.security.svSession,
  petHasBeenMoved: state.petDirectMovement.petHasBeenMoved
})

export default connect(mapStateToProps)(PetDirectMovement)
