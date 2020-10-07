import React from 'react'
import PropTypes from 'prop-types'
import CustomForm from './CustomForm'
import { SearchStyles } from 'containers/ContainersIndex'
import * as config from 'config/config'

/* Extended for with more parameters for flock movement */
export default class FlockMovementCustomForm extends React.Component {
  render () {
    const units = <React.Fragment>
      <input
        id='totalUnits'
        type='number'
        placeholder={this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.total_flock_units`,
          defaultMessage: `${config.labelBasePath}.main.total_flock_units`
        })}
        className={'form-control ' + SearchStyles['simple-input']}
      />
      <input
        id='maleUnits'
        type='number'
        placeholder={this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.total_flock_male_units`,
          defaultMessage: `${config.labelBasePath}.main.total_flock_male_units`
        })}
        className={'form-control ' + SearchStyles['simple-input']}
      />
      <input
        id='femaleUnits'
        type='number'
        placeholder={this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.total_flock_female_units`,
          defaultMessage: `${config.labelBasePath}.main.total_flock_female_units`
        })}
        className={'form-control ' + SearchStyles['simple-input']}
      />
      <input
        id='adultsUnits'
        type='number'
        placeholder={this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.total_flock_adult_units`,
          defaultMessage: `${config.labelBasePath}.main.total_flock_adult__units`
        })}
        className={'form-control ' + SearchStyles['simple-input']}
      />
    </React.Fragment>
    if (this.props.unitsOnly) {
      return units
    } else {
      return <CustomForm {...this.props} >
        {units}
      </CustomForm>
    }
  }
}

FlockMovementCustomForm.contextTypes = {
  intl: PropTypes.object.isRequired
}
