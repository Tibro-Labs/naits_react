import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import * as config from 'config/config.js'
import { menuConfig } from 'config/menuConfig'
import { alertUser } from 'tibro-components'
import { store } from 'tibro-redux'
import { ResultsGrid, GridManager } from 'components/ComponentsIndex'
import style from 'components/AppComponents/ExecuteActions/ExecuteActionOnSelectedRows.module.css'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'
import { formatAlertType } from 'functions/utils'

class SendPassportRequestToVetStation extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: null,
      showAlert: false,
      showSearchPopup: false,
      inputElementId: 'selectVetStation',
      vetStationObjId: '',
      gridToDisplay: 'HOLDING'
    }

    this.displayPopupOnClick = this.displayPopupOnClick.bind(this)
  }

  componentDidUpdate (nextProps, nextState) {
    if (this.state.showAlert !== nextState.showAlert) {
      const ownerInput = document.getElementById(this.state.inputElementId)
      ownerInput.onclick = this.displayPopupOnClick
    }

    if (this.props.passportRequestHasBeenSent !== nextProps.passportRequestHasBeenSent) {
      let firstGridId = `PASSPORT_REQUEST_${nextProps.objectId}1`
      let secondGridId = `PASSPORT_REQUEST_${nextProps.objectId}2`
      GridManager.reloadGridData(firstGridId)
      GridManager.reloadGridData(secondGridId)
      store.dispatch({ type: 'SEND_PASSPORT_REQUEST_RESET' })
    }
  }

  sendPassportRequest = () => {
    const { vetStationObjId } = this.state
    if (vetStationObjId === '') {
      this.close()
    } else {
      let server = config.svConfig.restSvcBaseUrl
      let verbPath = config.svConfig.triglavRestVerbs.SEND_PASSPORT_REQUEST
      let restUrl = `${server}${verbPath}`
      restUrl = restUrl.replace('%sessionId', this.props.svSession)
      restUrl = restUrl.replace('%petObjectId', this.props.objectId)
      restUrl = restUrl.replace('%vetStationObjectId', vetStationObjId)

      axios.get(restUrl).then(res => {
        if (res.data.includes('error')) {
          store.dispatch({ type: 'SEND_PASSPORT_REQUEST_REJECTED', payload: res.data })
        } else if (res.data.includes('success')) {
          store.dispatch({ type: 'SEND_PASSPORT_REQUEST_FULFILLED', payload: res.data })
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
            null
          )
        })
      })
      this.setState({ showAlert: false })
    }
  }

  showAlert = () => {
    this.setState({ showAlert: true })
    let wrapper = document.createElement('div')
    ReactDOM.render(
      <div style={{ marginLeft: '12px' }}>
        <label htmlFor='selectVetStation' style={{ marginRight: '8px' }}>
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.select_vet_station`,
            defaultMessage: `${config.labelBasePath}.main.select_vet_station`
          })}
        </label>
        <input
          style={{ border: 'none', height: '40px', color: '#000', backgroundColor: '#eff0f1', marginBottom: '1rem' }}
          type='text'
          id='selectVetStation'
          name='selectVetStation'
        />
      </div>,
      wrapper
    )

    this.setState({
      alert: alertUser(
        true,
        'info',
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.create_and_send_passport_request`,
          defaultMessage: `${config.labelBasePath}.main.create_and_send_passport_request`
        }),
        null,
        () => {
          this.sendPassportRequest()
        },
        () => {
          this.close()
        },
        true,
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.send`,
          defaultMessage: `${config.labelBasePath}.main.send`
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

  close = () => {
    this.setState({
      alert: false, showAlert: false, showSearchPopup: false
    })
  }

  chooseItem = () => {
    const vetStationObjId = store.getState()[`${this.state.gridToDisplay}_${this.state.inputElementId}`].rowClicked[`${this.state.gridToDisplay}.OBJECT_ID`]
    const vetStationPic = store.getState()[`${this.state.gridToDisplay}_${this.state.inputElementId}`].rowClicked[`${this.state.gridToDisplay}.PIC`]
    this.setState({ vetStationObjId })
    const vetStationInput = document.getElementById(this.state.inputElementId)
    vetStationInput.value = vetStationPic
    this.closeModal()
  }

  render () {
    const gridConfig = menuConfig('GRID_CONFIG', this.context.intl)
    const searchPopup = <div id='search_modal' className='modal to-front' style={{ display: 'flex' }}>
      <div id='search_modal_content' className='modal-content'>
        <div className='modal-header' />
        <div id='search_modal_body' className='modal-body'>
          <ResultsGrid
            key={this.state.gridToDisplay + '_' + this.state.inputElementId}
            id={this.state.gridToDisplay + '_' + this.state.inputElementId}
            gridToDisplay={this.state.gridToDisplay}
            gridConfig={gridConfig}
            onRowSelectProp={this.chooseItem}
            customGridDataWS='GET_VET_STATIONS'
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
        onClick={() => this.closeModal(this)} data-dismiss='modal' />
    </div>
    return (
      <React.Fragment>
        <div
          id='send_passport_request'
          className={styles.container}
          style={{ cursor: 'pointer', marginRight: '7px', color: 'white' }}
          onClick={this.showAlert}
        >
          <p>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.send_passport_request`,
              defaultMessage: `${config.labelBasePath}.main.send_passport_request`
            })}
          </p>
          <div id='send_passport_request' className={styles['gauge-container']}>
            <img
              id='change_status_img' className={style.actionImg}
              style={{ height: '45px', marginTop: '7%', marginLeft: '14px' }}
              src='/naits/img/massActionsIcons/actions_general.png'
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

SendPassportRequestToVetStation.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  passportRequestHasBeenSent: state.passportRequest.passportRequestHasBeenSent,
  passportRequestMessage: state.passportRequest.passportRequestMessage
})

export default connect(mapStateToProps)(SendPassportRequestToVetStation)
