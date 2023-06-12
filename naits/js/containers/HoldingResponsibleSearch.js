import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { alertUser } from 'tibro-components'
import HoldingResponsibleSearchLocationModal from './HoldingResponsibleSearchLocationModal'
import * as config from 'config/config'
import searchStyle from './SearchStyles.module.css'

class HoldingResponsibleSearch extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      idNo: '',
      firstName: '',
      lastName: '',
      fullName: '',
      geoCode: '',
      phoneNumber: '',
      showGeoLocationSearchModal: false
    }

    this.geoLocationInput = React.createRef()
  }

  displayModal = () => {
    this.setState({ showGeoLocationSearchModal: true })
    if (this.geoLocationInput && this.geoLocationInput.current) {
      this.geoLocationInput.current.blur()
    }
  }

  closeModal = () => {
    this.setState({ showGeoLocationSearchModal: false })
  }

  handleSearch = (e) => {
    e.preventDefault()
    const { idNo, firstName, lastName, fullName, geoCode, phoneNumber } = this.state
    if (!idNo && !firstName && !fullName && !geoCode && !phoneNumber) {
      const enterSomeValuesLabel = this.context.intl.formatMessage({
        id: `${config.labelBasePath}.main.search.enter_some_values`, defaultMessage: `${config.labelBasePath}.main.search.enter_some_values`
      })
      alertUser(true, 'info', enterSomeValuesLabel)
    } else {
      const searchData = {
        criteria: 'CUSTOM_HOLDING_RESPONSIBLE_SEARCH',
        idNo: idNo.trim() || null,
        firstName: firstName.trim() || null,
        lastName: lastName.trim() || null,
        fullName: fullName.trim() || null,
        geoCode: geoCode || null,
        phoneNumber: phoneNumber.trim() || null
      }
      this.props.waitForSearch(searchData)
    }
  }

  onLocationChange = (code, name) => {
    this.setState({ geoCode: code })
    if (this.geoLocationInput && this.geoLocationInput.current) {
      this.geoLocationInput.current.value = name
    }
    this.closeModal()
  }

  clearLocation = () => {
    this.setState({ geoCode: '' })
    if (this.geoLocationInput && this.geoLocationInput.current) {
      this.geoLocationInput.current.value = ''
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  generateInputs = () => {
    const inputs = (
      <React.Fragment>
        <div style={{ marginTop: '1rem' }}>
          <p className={searchStyle.searchPrompt} style={{ marginTop: '0' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.search.by_nat_reg_no`, defaultMessage: `${config.labelBasePath}.main.search.by_nat_reg_no`
            })}
          </p>
          <input
            id='holdingResponsibleIdNo'
            name='idNo'
            className={`${searchStyle.input}`}
            style={{ background: '#e9f1da', borderRadius: '5px', width: '100%', paddingLeft: '8px' }}
            minLength={4}
            onChange={this.onChange}
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <p className={searchStyle.searchPrompt} style={{ marginTop: '0' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.search.by_holding_resp_first_name`, defaultMessage: `${config.labelBasePath}.main.search.by_holding_resp_first_name`
            })}
          </p>
          <input
            id='holdingResponsibleFirstName'
            name='firstName'
            className={`${searchStyle.input}`}
            style={{ background: '#e9f1da', borderRadius: '5px', width: '100%', paddingLeft: '8px' }}
            minLength={4}
            onChange={this.onChange}
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <p className={searchStyle.searchPrompt} style={{ marginTop: '0' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.search.by_holding_resp_last_name`, defaultMessage: `${config.labelBasePath}.main.search.by_holding_resp_last_name`
            })}
          </p>
          <input
            id='holdingResponsibleLastName'
            name='lastName'
            className={`${searchStyle.input}`}
            style={{ background: '#e9f1da', borderRadius: '5px', width: '100%', paddingLeft: '8px' }}
            minLength={4}
            onChange={this.onChange}
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <p className={searchStyle.searchPrompt} style={{ marginTop: '0' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.search.by_holding_resp_full_name`, defaultMessage: `${config.labelBasePath}.main.search.by_holding_resp_full_name`
            })}
          </p>
          <input
            id='holdingResponsibleFullName'
            name='fullName'
            className={`${searchStyle.input}`}
            style={{ background: '#e9f1da', borderRadius: '5px', width: '100%', paddingLeft: '8px' }}
            minLength={4}
            onChange={this.onChange}
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <p className={searchStyle.searchPrompt} style={{ marginTop: '0' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.search.by_geoastat_code`, defaultMessage: `${config.labelBasePath}.main.search.by_geoastat_code`
            })}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '90% 10%' }}>
            <input
              ref={this.geoLocationInput}
              readOnly
              id='geoCode'
              name='geoCode'
              className={`${searchStyle.input}`}
              style={{ background: '#e9f1da', borderRadius: '5px 0 0 5px', width: '100%', paddingLeft: '8px', cursor: 'pointer' }}
              onClick={this.displayModal}
            />
            <button
              type='button'
              id='clearSelectedLocation'
              className='btn_delete_form'
              style={{ borderRadius: '0 5px 5px 0', padding: '1px' }}
              onClick={this.clearLocation}
            >X</button>
          </div>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <p className={searchStyle.searchPrompt} style={{ marginTop: '0' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.search.by_holding_resp_phone_no`, defaultMessage: `${config.labelBasePath}.main.search.by_holding_resp_phone_no`
            })}
          </p>
          <input
            id='holdingResponsiblePhoneNumber'
            name='phoneNumber'
            className={`${searchStyle.input}`}
            style={{ background: '#e9f1da', borderRadius: '5px', width: '100%', paddingLeft: '8px' }}
            minLength={4}
            onChange={this.onChange}
          />
        </div>
      </React.Fragment>
    )

    return inputs
  }

  generateSearchButton = () => {
    const searchButton = (
      <div style={{ marginTop: '1rem' }}>
        <button type='submit' id='searchHoldingResponsibles' className={searchStyle.button} style={{ width: '100%', borderRadius: '5px', fontSize: '1.3em' }}>
          {this.context.intl.formatMessage({ id: `${config.labelBasePath}.main.search`, defaultMessage: `${config.labelBasePath}.main.search` })}
        </button>
      </div>
    )

    return searchButton
  }

  render () {
    return (
      <React.Fragment>
        <form
          id='holding_responsible_multi_filter_search_filters'
          className={searchStyle.search}
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', borderTopLeftRadius: '0', borderTopRightRadius: '0', marginTop: '-0.1rem' }}
          onSubmit={(e) => this.handleSearch(e)}
        >
          {this.generateInputs()}
          {this.generateSearchButton()}
        </form>
        {this.state.showGeoLocationSearchModal && <HoldingResponsibleSearchLocationModal onLocationChange={this.onLocationChange} closeModal={this.closeModal} />}
      </React.Fragment>
    )
  }
}

HoldingResponsibleSearch.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession
})

export default connect(mapStateToProps)(HoldingResponsibleSearch)
