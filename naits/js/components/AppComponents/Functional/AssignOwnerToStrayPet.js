import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import axios from 'axios'
import { alertUser } from 'tibro-components'
import { store } from 'tibro-redux'
import { GridInModalLinkObjects } from 'components/ComponentsIndex'
import * as config from 'config/config.js'
import style from 'components/AppComponents/ExecuteActions/ExecuteActionOnSelectedRows.module.css'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'
import { convertToShortDate, formatAlertType, selectObject } from 'functions/utils'

class AssignOwnerToStrayPet extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: null,
      showWarningAlert: false,
      showInputsAlert: null,
      showSearchPopup: false,
      inputElementId: 'selectStrayPetOwner',
      gridToDisplay: 'HOLDING_RESPONSIBLE',
      ownerObjId: null,
      ownerName: null,
      rowData: null,
      adoptionDate: null
    }

    this.displayPopupOnClick = this.displayPopupOnClick.bind(this)
  }

  componentDidUpdate () {
    if (this.state.showInputsAlert) {
      const ownerInput = document.getElementById(this.state.inputElementId)
      if (ownerInput) {
        ownerInput.onclick = this.displayPopupOnClick
      }
    }
  }

  showAlert = () => {
    this.setState({ showInputsAlert: true })
    let wrapper = document.createElement('div')
    ReactDOM.render(
      <div style={{ marginLeft: '12px' }}>
        <label htmlFor='selectStrayPetOwner' style={{ marginRight: '8px' }}>
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.select_stray_pet_owner`,
            defaultMessage: `${config.labelBasePath}.main.select_stray_pet_owner`
          })}
        </label>
        <input
          style={{ border: 'none', height: '40px', color: '#000', backgroundColor: '#eff0f1', marginBottom: '1rem' }}
          type='text'
          id='selectStrayPetOwner'
          name='selectStrayPetOwner'
          value={this.state.ownerName}
        />
        <br />
        <label htmlFor='setAdoptionDate' style={{ marginRight: '8px', marginTop: '1rem' }}>
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.set_adoption_date`,
            defaultMessage: `${config.labelBasePath}.main.set_adoption_date`
          })}
        </label>
        <br />
        <input
          style={{ border: 'none', height: '40px', color: '#000', backgroundColor: '#eff0f1' }}
          type='date'
          id='setAdoptionDate'
          name='setAdoptionDate'
          onChange={this.setAdoptionDate}
          value={this.state.adoptionDate}
        />
      </div>,
      wrapper
    )

    this.setState({
      alert: alertUser(
        true,
        'info',
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.assign_owner_to_stray_pet`,
          defaultMessage: `${config.labelBasePath}.main.assign_owner_to_stray_pet`
        }),
        null,
        () => {
          this.assignOwnerToStrayPet()
        },
        () => {
          this.close()
        },
        true,
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.assign_owner_to_stray_pet`,
          defaultMessage: `${config.labelBasePath}.main.assign_owner_to_stray_pet`
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

  close = () => {
    this.setState({
      alert: false,
      showInputsAlert: false,
      showWarningAlert: false,
      showSearchPopup: false,
      ownerObjId: null,
      ownerName: null,
      adoptionDate: null
    })
  }

  displayPopupOnClick (event) {
    event.preventDefault()
    this.setState({ showSearchPopup: true })
    event.target.blur()
    const alertOverlay = document.getElementsByClassName('swal-overlay')
    alertOverlay[0].style.display = 'none'
  }

  closeModal = () => {
    this.setState({ showSearchPopup: false })
    const alertOverlay = document.getElementsByClassName('swal-overlay')
    alertOverlay[0].style.display = 'block'
  }

  setAdoptionDate = (event) => {
    this.setState({ adoptionDate: convertToShortDate(new Date(event.target.value), 'y-m-d') })
    if (event.target.value === '') {
      this.setState({ adoptionDate: null })
    }
  }

  chooseItem = () => {
    const ownerName = store.getState()[`${this.state.gridToDisplay}`].rowClicked[`${this.state.gridToDisplay}.FULL_NAME`]
    const ownerObjId = store.getState()[`${this.state.gridToDisplay}`].rowClicked[`${this.state.gridToDisplay}.OBJECT_ID`]
    this.setState({ ownerObjId, ownerName })
    const ownerInput = document.getElementById(this.state.inputElementId)
    ownerInput.value = ownerName
  }

  assignOwnerToStrayPet = () => {
    const { ownerObjId, adoptionDate } = this.state
    if (!ownerObjId && !adoptionDate) {
      this.setState({ showInputsAlert: false, showWarningAlert: true })
      this.setState({
        alert: alertUser(
          true,
          'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.selectOwnerAndAdoptionDate`,
            defaultMessage: `${config.labelBasePath}.main.selectOwnerAndAdoptionDate`
          }),
          null,
          () => {
            this.showAlert()
            this.setState({ showWarningAlert: false })
          }
        )
      })
    } else if (!ownerObjId && adoptionDate) {
      this.setState({ showInputsAlert: false, showWarningAlert: true })
      this.setState({
        alert: alertUser(
          true,
          'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.selectOwnerAndAdoptionDate`,
            defaultMessage: `${config.labelBasePath}.main.selectOwnerAndAdoptionDate`
          }),
          null,
          () => {
            this.showAlert()
            this.setState({ showWarningAlert: false })
          }
        )
      })
    } else if (ownerObjId && !adoptionDate) {
      this.setState({ showInputsAlert: false, showWarningAlert: true })
      this.setState({
        alert: alertUser(
          true,
          'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.selectOwnerAndAdoptionDate`,
            defaultMessage: `${config.labelBasePath}.main.selectOwnerAndAdoptionDate`
          }),
          null,
          () => {
            this.showAlert()
            this.setState({ showWarningAlert: false })
          }
        )
      })
    } else {
      let url = `${config.svConfig.restSvcBaseUrl}${config.svConfig.triglavRestVerbs.ASSIGN_OWNER_TO_STRAY_PET}`
      url = url.replace('%session', this.props.svSession)
      url = url.replace('%strayPetId', this.props.objectId)
      url = url.replace('%personObjId', ownerObjId)
      url = url.replace('%adoptionDate', adoptionDate)

      axios.get(url).then(res => {
        const responseType = formatAlertType(res.data)
        const splitResponse = res.data.split('_')
        if (responseType.toLowerCase() === 'success') {
          store.dispatch({ type: 'PET_ADOPTION_FULFILLED', payload: res.data })
          const server = config.svConfig.restSvcBaseUrl
          let verbPath = config.svConfig.triglavRestVerbs.GET_BYOBJECTID
          verbPath = verbPath.replace('%session', this.props.svSession)
          verbPath = verbPath.replace('%objectId', splitResponse[1])
          verbPath = verbPath.replace('%objectName', 'PET')
          let url = `${server}${verbPath}`

          axios.get(url).then(response => this.setState({ rowData: response.data }))

          this.setState({
            alert: alertUser(
              true,
              responseType,
              this.context.intl.formatMessage({
                id: splitResponse[0],
                defaultMessage: splitResponse[0]
              }),
              null,
              () => {
                selectObject('PET', this.state.rowData[0])
              },
              () => {
                this.close()
              },
              true,
              this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.go_to_pet`,
                defaultMessage: `${config.labelBasePath}.main.go_to_pet`
              }),
              this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.forms.close`,
                defaultMessage: `${config.labelBasePath}.main.forms.close`
              }),
              false,
              '#7CD1F9',
              null
            )
          })
        } else if (responseType.toLowerCase() === 'error') {
          store.dispatch({ type: 'PET_ADOPTION_REJECTED', payload: res.data })
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
              }
            )
          })
        } else {
          store.dispatch({ type: 'PET_ADOPTION_REJECTED', payload: res.data })
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
              }
            )
          })
        }
      })
      this.setState({ showInputsAlert: false, showWarningAlert: false })
    }
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
      <React.Fragment>
        <div
          id='assign_owner_to_stray_pet'
          className={styles.container}
          style={{ cursor: 'pointer', marginRight: '7px', color: 'white' }}
          onClick={this.showAlert}
        >
          <p>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.assign_owner_to_stray_pet`,
              defaultMessage: `${config.labelBasePath}.main.assign_owner_to_stray_pet`
            })}
          </p>
          <div id='assign_owner_to_stray_pet' className={styles['gauge-container']}>
            <img
              id='change_status_img'
              className={style.actionImg}
              style={{ height: '45px', marginTop: '7%', marginLeft: '2rem' }}
              src='/naits/img/MainPalette/20_pet/stray_pet.png'
            />
          </div>
        </div>
        {this.state.showSearchPopup &&
          ReactDOM.createPortal(searchPopup, document.getElementById('app').parentNode)
        }
      </React.Fragment>
    )
  }
}

AssignOwnerToStrayPet.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  newPetObjId: state.petAdoption.newPetObjId,
  strayPetHasBeenAdopted: state.petAdoption.strayPetHasBeenAdopted,
  responseMessage: state.petAdoption.responseMessage
})

export default connect(mapStateToProps)(AssignOwnerToStrayPet)
