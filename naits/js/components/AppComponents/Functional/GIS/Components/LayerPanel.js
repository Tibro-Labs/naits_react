import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as config from 'config/config'

import RootInfo from './RootInfo'
import { convertToShortDate } from 'functions/utils'
import IStore from './IStore'

import DatePicker from 'react-date-picker'
import Toggle from 'react-toggle'
import ToggleCSS from 'react-toggle/style.css' /*eslint-disable-line*/

class LayerPanel extends React.Component {
  static propTypes = {
    inventory: PropTypes.object.isRequired,
    departureDate: PropTypes.string.isRequired, /*eslint-disable-line*/
    arrivalDate: PropTypes.string.isRequired, /*eslint-disable-line*/
    startDate: PropTypes.string.isRequired, /*eslint-disable-line*/
    expiryDate: PropTypes.string.isRequired, /*eslint-disable-line*/
    filterHistory: PropTypes.bool.isRequired /*eslint-disable-line*/
  }
  constructor (props) {
    super(props)
    this.lastMonth = (function () {
      // return 1st of last month
      // avoids returning this.date of last month, i.e one month ago
      // complications arise of unequal number of days in months
      // and then there is February. and leap year.
      let thisMonth = new Date().getMonth()
      let lastMonth = thisMonth === 0 ? 11 : thisMonth - 1
      let defaultVal = new Date()
      defaultVal.setMonth(lastMonth, 1)

      return defaultVal || null
    })()

    this.state = {
      layerList: null,
      departureDate: this.lastMonth,
      arrivalDate: new Date(),
      startDate: this.lastMonth,
      expiryDate: new Date()
    }
    this.filterMovements = this.filterMovements.bind(this)
    this.filterQuarantines = this.filterQuarantines.bind(this)
    this.filterHistory = this.filterHistory.bind(this)
  }

  filterMovements () {
    // call refresh map here
    IStore.setData({ refreshMap: true })
  }

  filterQuarantines () {
    IStore.setData({ refreshMap: true })
  }

  filterHistory () {
    IStore.setData({ filterHistory: !this.props.filterHistory })
  }

  componentDidMount () {
    IStore.setData({
      departureDate: convertToShortDate(this.state.departureDate, 'y-m-d'),
      arrivalDate: convertToShortDate(this.state.arrivalDate, 'y-m-d'),
      startDate: convertToShortDate(this.state.startDate, 'y-m-d'),
      expiryDate: convertToShortDate(this.state.expiryDate, 'y-m-d')
    })
  }

  componentDidUpdate (prevProps) {
    if (this.props.inventory !== prevProps.inventory) {
      this.setState({
        layerList: <ul style={{ listStyleType: 'circle', marginTop: '2%' }}> {Object.keys(this.props.inventory).map(k => {  //eslint-disable-line
          return <li
            key={this.props.inventory[k].name}
            className='layerListItem'
          >
            {this.props.inventory[k].name === 'Base' ? this.context.intl.formatMessage({
              id: `${config.labelBasePath}.gis.layer.base`,
              defaultMessage: `${config.labelBasePath}.gis.layer.base`
            }) : this.props.inventory[k].name === 'Humanitarian' ? this.context.intl.formatMessage({
              id: `${config.labelBasePath}.gis.layer.humanitarian`,
              defaultMessage: `${config.labelBasePath}.gis.layer.humanitarian`
            }) : this.props.inventory[k].name === 'Terrain' ? this.context.intl.formatMessage({
              id: `${config.labelBasePath}.gis.layer.terrain`,
              defaultMessage: `${config.labelBasePath}.gis.layer.terrain`
            }) : this.props.inventory[k].name === 'Topographic' ? this.context.intl.formatMessage({
              id: `${config.labelBasePath}.gis.layer.topographic`,
              defaultMessage: `${config.labelBasePath}.gis.layer.topographic`
            }) : this.props.inventory[k].name === 'Animal movements' ? this.context.intl.formatMessage({
              id: `${config.labelBasePath}.gis.layer.animalMovements`,
              defaultMessage: `${config.labelBasePath}.gis.layer.animalMovements`
            }) : this.props.inventory[k].name === 'Holdings' ? this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.holding.holdings`,
              defaultMessage: `${config.labelBasePath}.main.holding.holdings`
            }) : this.props.inventory[k].name === 'Municipalities' ? this.context.intl.formatMessage({
              id: `${config.labelBasePath}.gis.layer.municipalities`,
              defaultMessage: `${config.labelBasePath}.gis.layer.municipalities`
            }) : this.props.inventory[k].name === 'Quarantines' ? this.context.intl.formatMessage({
              id: `${config.labelBasePath}.gis.layer.quarantines`,
              defaultMessage: `${config.labelBasePath}.gis.layer.quarantines`
            }) : this.props.inventory[k].name === 'Villages' ? this.context.intl.formatMessage({
              id: `${config.labelBasePath}.gis.layer.villages`,
              defaultMessage: `${config.labelBasePath}.gis.layer.villages`
            }) : this.props.inventory[k].name === 'Pet Locations' ? 'Pet collection/release locations' : ''}
          </li>
        })} </ul>
      })
    }
  }

  render () {
    return <div id='layerPanel' className='layerPanel' >
      <RootInfo id='RootInfo' />
      <div id='layerList' className='layerList layerList-default'>
        <div className='layerList-heading'>
          <h3 className='layerList-title'>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.gis.layerList`,
              defaultMessage: `${config.labelBasePath}.gis.layerList`
            })}
          </h3>
        </div>
        <div className='layerList-body'>
          {this.state.layerList}
        </div>
      </div>
      {this.props.gridType !== 'PET' &&
        <React.Fragment>
          <div className='btn-group' style={{ display: 'grid', border: '1px solid black', margin: '10px', zIndex: 6100 }}>
            <div
              id='filterMovementStart'
              key='filterMovementStart'
              className='filterMovement'
            >
              <a style={{ color: 'rgb(249, 235, 210)', lineHeight: '5vh' }}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.form_labels.departure_date`,
                  defaultMessage: `${config.labelBasePath}.form_labels.departure_date`
                })}
              </a>
              <DatePicker
                required
                className='movementDatePicker'
                calendarClassName='gisCalendar'
                onChange={date => {
                  IStore.setData({ departureDate: convertToShortDate(date, 'y-m-d') || '1900-1-1' })
                  this.setState({ departureDate: date || '' })
                }}
                value={this.state.departureDate}
              />
            </div>
            <div
              id='filterMovementEnd'
              key='filterMovementEnd'
              className='filterMovement'
            >
              <a style={{ color: 'rgb(249, 235, 210)', lineHeight: '5vh' }}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.form_labels.arrival_date`,
                  defaultMessage: `${config.labelBasePath}.form_labels.arrival_date`
                })}
              </a>
              <DatePicker
                required
                className='movementDatePicker'
                calendarClassName='gisCalendar'
                onChange={date => {
                  IStore.setData({ arrivalDate: convertToShortDate(date, 'y-m-d') || '9999-1-1' })
                  this.setState({ arrivalDate: date || '' })
                }}
                value={this.state.arrivalDate}
              />
            </div>
            <button
              id='filterMovements'
              className='filterMovementBtn'
              onClick={this.filterMovements}
            >
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.gis.filterMovements`,
                defaultMessage: `${config.labelBasePath}.gis.filterMovements`
              })}
            </button>
          </div>
          <div className='btn-group' style={{ display: 'grid', border: '1px solid black', margin: '10px', zIndex: 6000 }}>
            {/* add history toggle here */}
            <div
              id='filterHistory'
              key='filterHistory'
              className='filterHistory'
            >
              <a style={{ color: 'rgb(249, 235, 210)', lineHeight: '4vh' }}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.gis.includeHistory`,
                  defaultMessage: `${config.labelBasePath}.gis.includeHistory`
                })}
              </a>
              <Toggle
                id='filterHistory_toggle'
                defaultChecked={false}
                onChange={this.filterHistory}
                className='movementDatePicker'
              />
            </div>
            <div
              id='filterQStart'
              key='filterQStart'
              className='filterMovement'
            >
              <a style={{ color: 'rgb(249, 235, 210)', lineHeight: '5vh' }}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.form_labels.date_from`,
                  defaultMessage: `${config.labelBasePath}.form_labels.date_from`
                })}
              </a>
              <DatePicker
                required
                className='movementDatePicker'
                calendarClassName='gisCalendar'
                onChange={date => {
                  IStore.setData({ startDate: convertToShortDate(date, 'y-m-d') || '1900-1-1' })
                  this.setState({ startDate: date || '' })
                }}
                value={this.state.startDate}
              />
            </div>
            <div
              id='filterQEnd'
              key='filterQEnd'
              className='filterMovement'
            >
              <a style={{ color: 'rgb(249, 235, 210)', lineHeight: '5vh' }}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.form_labels.date_to`,
                  defaultMessage: `${config.labelBasePath}.form_labels.date_to`
                })}
              </a>
              <DatePicker
                required
                className='movementDatePicker'
                calendarClassName='gisCalendar'
                onChange={date => {
                  IStore.setData({ expiryDate: convertToShortDate(date, 'y-m-d') || '9999-1-1' })
                  this.setState({ expiryDate: date || '' })
                }}
                value={this.state.expiryDate}
              />
            </div>
            <button
              id='filterQuarantines'
              className='filterMovementBtn'
              onClick={this.filterQuarantines}
            >
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.gis.filterQuarantines`,
                defaultMessage: `${config.labelBasePath}.gis.filterQuarantines`
              })}
            </button>
          </div>
        </React.Fragment>
      }
    </div>
  }
}

LayerPanel.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => {
  const { inventory, data } = state.gis
  return {
    inventory: inventory,
    departureDate: data.departureDate,
    arrivalDate: data.arrivalDate,
    startDate: data.startDate,
    expiryDate: data.expiryDate,
    filterHistory: data.filterHistory,
    gridType: data.rootData.type
  }
}

export default connect(mapStateToProps)(LayerPanel)
