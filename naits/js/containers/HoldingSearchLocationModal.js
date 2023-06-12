import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { DependencyDropdowns, alertUser } from 'tibro-components'
import * as config from 'config/config'
import { $ } from 'functions/utils'

class HoldingSearchLocationModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  chooseItem = () => {
    let code = null
    let name = null
    let el
    if ((el = $('root_holding.location.info_VILLAGE_CODE')) && (code = el.value)) {
      name = el.options[el.selectedIndex].text
    } else if ((el = $('root_holding.location.info_COMMUN_CODE')) && (code = el.value)) {
      name = el.options[el.selectedIndex].text
    } else if ((el = $('root_holding.location.info_MUNIC_CODE')) && (code = el.value)) {
      name = el.options[el.selectedIndex].text
    } else if ((el = $('root_holding.location.info_REGION_CODE')) && (code = el.value)) {
      name = el.options[el.selectedIndex].text
    }

    const chosenItemCode = code
    const chosenItemName = name

    if (chosenItemCode && chosenItemName) {
      this.props.onLocationChange(chosenItemCode, chosenItemName)
    } else {
      const warningLabel = this.context.intl.formatMessage({
        id: `${config.labelBasePath}.alert.no_region_selected_admconsole`,
        defaultMessage: `${config.labelBasePath}.alert.no_region_selected_admconsole`
      })
      alertUser(true, 'warning', warningLabel)
    }
  }

  closeModal = () => {
    this.props.closeModal()
  }

  generateSearchPopup = () => {
    const searchPopup = (
      <div id='search_modal' className='modal to-front' style={{ display: 'flex' }}>
        <div id='search_modal_content' className='modal-content' style={{ width: '80%' }}>
          <div className='modal-header' />
          <div id='search_modal_body' className='modal-body' style={{ color: 'white', padding: '10rem 30rem 10rem 30rem' }}>
            <DependencyDropdowns tableName='HOLDING' spread='down' />
            <button id='submit' className='btn btn-success' onClick={this.chooseItem}>
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.select_location`,
                defaultMessage: `${config.labelBasePath}.main.select_location`
              })}
            </button>
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
          onClick={this.closeModal} data-dismiss='modal' />
      </div>
    )

    return searchPopup
  }

  render () {
    return ReactDOM.createPortal(this.generateSearchPopup(), document.getElementById('app'))
  }
}

HoldingSearchLocationModal.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession
})

export default connect(mapStateToProps)(HoldingSearchLocationModal)
