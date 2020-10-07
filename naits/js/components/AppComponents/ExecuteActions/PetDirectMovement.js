import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import axios from 'axios'
import { connect } from 'react-redux'
import { store } from 'tibro-redux'
import { alertUser } from 'tibro-components'
import * as config from 'config/config.js'
import { GridManager, ComponentManager, GridInModalLinkObjects } from 'components/ComponentsIndex'
import style from 'components/AppComponents/ExecuteActions/ExecuteActionOnSelectedRows.module.css'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'
import { formatAlertType, convertToShortDate } from 'functions/utils'

class PetDirectMovement extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: null,
      showAlert: false,
      showSearchPopup: false,
      activityDate: null,
      gridToDisplay: 'PET',
      inputElementId: 'selectPet',
      holdingObjectId: '',
      selectedPetId: '',
      selectedPetObjId: '',
      currentHolding: []
    }

    this.displayPopupOnClick = this.displayPopupOnClick.bind(this)
  }

  componentDidMount () {
    // Get the currently selected holding's data & its object id
    this.getCurrentHoldingDataAndObjId()
  }

  componentDidUpdate (nextProps, nextState) {
    if (this.state.showAlert !== nextState.showAlert) {
      const petInput = document.getElementById(this.state.inputElementId)
      if (petInput) {
        petInput.onclick = this.displayPopupOnClick
      }
    }
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

  petDirectMovementPrompt () {
    this.setState({ showAlert: true })
    let wrapper = document.createElement('div')
    ReactDOM.render(
      <div style={{ marginLeft: '12px' }}>
        <label htmlFor='selectPet' style={{ marginRight: '8px' }}>
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.select_pet`,
            defaultMessage: `${config.labelBasePath}.main.select_pet`
          })}
        </label>
        <br />
        <input
          style={{ border: 'none', height: '40px', color: '#000', backgroundColor: '#eff0f1', marginBottom: '1rem' }}
          type='text'
          id='selectPet'
          name='selectPet'
          value={this.state.selectedPetId}
        />
        <br />
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
          id: `${config.labelBasePath}.actions.pet_direct_movement_prompt`,
          defaultMessage: `${config.labelBasePath}.actions.pet_direct_movement_prompt`
        }),
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.actions.default_date_msg`,
          defaultMessage: `${config.labelBasePath}.actions.default_date_msg`
        }),
        () => this.petDirectMovementAction(),
        () => this.close(),
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

    if (!this.state.selectedPetId) {
      const submitBtn = document.getElementsByClassName('swal-button swal-button--confirm')
      if (submitBtn) {
        submitBtn[0].setAttribute('disabled', '')
      }
    }
  }

  petDirectMovementAction = async () => {
    if (this.state.selectedPetObjId === '') {
      this.close()
    } else {
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
              this.close()
              GridManager.reloadGridData(`${this.props.selectedObject}_${this.state.holdingObjectId}1`)
              GridManager.reloadGridData(`${this.props.selectedObject}_${this.state.holdingObjectId}2`)
              store.dispatch({ type: 'PET_DIRECT_MOVEMENT_ACTION_RESET' })
            }
          )
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
  }

  chooseItem = () => {
    if (!store.getState()[`${this.state.gridToDisplay}`].rowClicked[`${this.state.gridToDisplay}.PET_ID`]) {
      let errorMsg = `
        <p id="errorMsg" style="color: red">
          ${this.context.intl.formatMessage({
        id: `${config.labelBasePath}.error.select_pet_with_valid_id`,
        defaultMessage: `${config.labelBasePath}.error.select_pet_with_valid_id`
      })}
        </p>
      `
      const petInput = document.getElementById(this.state.inputElementId)
      petInput.style.border = '1px solid red'
      petInput.insertAdjacentHTML('afterend', errorMsg)
      petInput.value = ''
      const submitBtn = document.getElementsByClassName('swal-button swal-button--confirm')
      submitBtn[0].setAttribute('disabled', '')
      this.closeModal()
    } else {
      const selectedPetObjId = String(store.getState()[`${this.state.gridToDisplay}`].rowClicked[`${this.state.gridToDisplay}.OBJECT_ID`])
      const selectedPetId = String(store.getState()[`${this.state.gridToDisplay}`].rowClicked[`${this.state.gridToDisplay}.PET_ID`])
      this.setState({ selectedPetObjId, selectedPetId })
      const petInput = document.getElementById(this.state.inputElementId)
      petInput.style.border = 'none'
      petInput.value = selectedPetId
      const submitBtn = document.getElementsByClassName('swal-button swal-button--confirm')
      submitBtn[0].removeAttribute('disabled')
      const errorMsg = document.getElementById('errorMsg')
      if (errorMsg) {
        errorMsg.style.display = 'none'
      }
      this.closeModal()
    }
  }

  displayPopupOnClick (event) {
    event.preventDefault()
    this.setState({ showSearchPopup: true })
    const errorMsg = document.getElementById('errorMsg')
    if (errorMsg) {
      errorMsg.style.display = 'none'
      const petInput = document.getElementById(this.state.inputElementId)
      petInput.style.border = 'none'
    }
    event.target.blur()
    const alertOverlay = document.getElementsByClassName('swal-overlay')
    alertOverlay[0].style.display = 'none'
  }

  close = () => {
    this.setState({
      alert: false,
      showAlert: false,
      showSearchPopup: false,
      selectedPetId: '',
      selectedPetObjId: '',
      activityDate: null
    })
  }

  closeModal = () => {
    this.setState({ showSearchPopup: false })
    const alertOverlay = document.getElementsByClassName('swal-overlay')
    alertOverlay[0].style.display = 'block'
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
          />
        </div>
      </div>
    </div>

    return (
      <div>
        <button
          id='pet_direct_movement'
          className={styles.container} style={{ cursor: 'pointer', marginRight: '7px', color: 'white' }}
          onClick={() => this.petDirectMovementPrompt()}
        >
          <span
            id='pet_direct_movement_action_text'
            className={style.actionText} style={{ padding: '4px', marginLeft: '-5%' }}
          >
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.pet_direct_movement`,
              defaultMessage: `${config.labelBasePath}.main.pet_direct_movement`
            })}
          </span>
          <img id='animal_mass_img' src='/naits/img/massActionsIcons/transfer_animal.png' />
        </button>
        {this.state.showSearchPopup && ReactDOM.createPortal(searchPopup, document.getElementById('app').parentNode)}
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
