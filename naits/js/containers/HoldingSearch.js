import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { alertUser } from 'tibro-components'
import HoldingSearchLocationModal from './HoldingSearchLocationModal'
import * as config from 'config/config'
import searchStyle from './SearchStyles.module.css'

class HoldingSearch extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      holdingType: '',
      name: '',
      pic: '',
      keeperId: '',
      geoCode: '',
      address: '',
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
    const { holdingType, name, pic, keeperId, geoCode, address } = this.state
    if (!holdingType && !name && !pic && !keeperId && !geoCode && !address) {
      const enterSomeValuesLabel = this.context.intl.formatMessage({
        id: `${config.labelBasePath}.main.search.enter_some_values`, defaultMessage: `${config.labelBasePath}.main.search.enter_some_values`
      })
      alertUser(true, 'info', enterSomeValuesLabel)
    } else {
      const searchData = {
        criteria: 'CUSTOM_HOLDING_SEARCH',
        holdingType: holdingType.trim() || null,
        name: name.trim() || null,
        pic: pic.trim() || null,
        keeperId: keeperId.trim() || null,
        geoCode: geoCode || null,
        address: address.trim() || null
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
    const { holdingTypes } = this.props
    const inputs = (
      <React.Fragment>
        <div style={{ marginTop: '1rem' }}>
          <p className={searchStyle.searchPrompt} style={{ marginTop: '0' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.form_labels.holding.type`, defaultMessage: `${config.labelBasePath}.form_labels.holding.type`
            })}
          </p>
          <select
            onChange={this.onChange}
            id='holdingTypeSearchValue'
            name='holdingType'
            className={searchStyle.dropdown}
          >
            <option disabled selected hidden value=''>
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.select_holding_type`,
                defaultMessage: `${config.labelBasePath}.main.select_holding_type`
              })}
            </option>
            <option value=''>{' '}</option>
            {holdingTypes}
          </select>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <p className={searchStyle.searchPrompt} style={{ marginTop: '0' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.search.by_holding_name`, defaultMessage: `${config.labelBasePath}.main.search.by_holding_name`
            })}
          </p>
          <input
            id='holdingName'
            name='name'
            className={`${searchStyle.input}`}
            style={{ background: '#e9f1da', borderRadius: '5px', width: '100%', paddingLeft: '8px' }}
            minLength={4}
            onChange={this.onChange}
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <p className={searchStyle.searchPrompt} style={{ marginTop: '0' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.search.by_holding_pic`, defaultMessage: `${config.labelBasePath}.main.search.by_holding_pic`
            })}
          </p>
          <input
            id='holdingId'
            name='pic'
            className={`${searchStyle.input}`}
            style={{ background: '#e9f1da', borderRadius: '5px', width: '100%', paddingLeft: '8px' }}
            minLength={4}
            onChange={this.onChange}
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <p className={searchStyle.searchPrompt} style={{ marginTop: '0' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.search.by_nat_reg_no`, defaultMessage: `${config.labelBasePath}.main.search.by_nat_reg_no`
            })}
          </p>
          <input
            id='keeperId'
            name='keeperId'
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
              id: `${config.labelBasePath}.main.search.by_physical_address`, defaultMessage: `${config.labelBasePath}.main.search.by_physical_address`
            })}
          </p>
          <input
            id='address'
            name='address'
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
        <button type='submit' id='searchHoldings' className={searchStyle.button} style={{ width: '100%', borderRadius: '5px', fontSize: '1.3em' }}>
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
          id='holding_multi_filter_search_filters'
          className={searchStyle.search}
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', borderTopLeftRadius: '0', borderTopRightRadius: '0', marginTop: '-0.1rem' }}
          onSubmit={(e) => this.handleSearch(e)}
        >
          {this.generateInputs()}
          {this.generateSearchButton()}
        </form>
        {this.state.showGeoLocationSearchModal && <HoldingSearchLocationModal onLocationChange={this.onLocationChange} closeModal={this.closeModal} />}
      </React.Fragment>
    )
  }
}

HoldingSearch.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession
})

export default connect(mapStateToProps)(HoldingSearch)
