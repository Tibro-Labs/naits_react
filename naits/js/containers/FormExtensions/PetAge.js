import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { ComponentManager } from 'components/ComponentsIndex'
import * as config from 'config/config'
import style from './AnimalAge.module.css'

export default class PetAge extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      container: null,
      initialBirthDate: null
    }
  }

  componentDidMount () {
    /* Get the container which will hold the fields when the form is mounted.
      Fields are rendered using React portals once the container is mounted. */
    let container = document.getElementById('root_pet.date_details__title')
    if (container) {
      container = container.parentElement
      this.setState({
        container: container,
        initialBirthDate: document.getElementById('root_pet.date_details_BIRTH_DATE').value
      })
    }
  }

  calculateAge = () => {
    /* Calculate the age using the input value, current system date and
      birth date (if already existing in form data). After calculation the new
      date is displayed in the field */
    const years = document.getElementById('petAgeYears').value
    const months = document.getElementById('petAgeMonths').value
    let currentDate = null
    if (years || months) {
      // Do the calculation of the new date
      currentDate = new Date()
      const subYears = Number(years)
      const subMonths = Number(months)

      currentDate.setYear(currentDate.getFullYear() - subYears)
      currentDate.setMonth(currentDate.getMonth() - subMonths)

      const currentYear = currentDate.getFullYear()
      let currentMonth = currentDate.getMonth() + 1
      let currentDay = currentDate.getDate()

      if (currentMonth < 10) currentMonth = '0' + currentMonth
      if (currentDay < 10) currentDay = '0' + currentDay

      const newDate = currentYear + '-' + currentMonth + '-' + currentDay

      // const newDate = newYear + '-' + currentMonth + '-' + currentDay
      document.getElementById('root_pet.date_details_BIRTH_DATE').value = newDate
      /* --> What follows is the actual date replacement in the form field
      and redux store state ---> */
      // Reform the new table data object with the new date field
      const formId = this.props.formInstance.state.id
      let newTableData = Object.assign({}, this.props.formInstance.state.formTableData)
      /* If the date object field in table data does not exist, insert a new one
      else if it does - modify it */
      if (newTableData.constructor === Object && !newTableData['pet.date_details']) {
        newTableData['pet.date_details'] = {}
        newTableData['pet.date_details'].BIRTH_DATE = newDate
      } else {
        newTableData['pet.date_details'].BIRTH_DATE = newDate
      }
      // Set the form state and redux store state to match the new date value
      ComponentManager.setStateForComponent(formId, 'formTableData', newTableData)
      this.props.formInstance.setState({ formTableData: newTableData })
    }
  }

  resetDate = () => {
    // Reset calculated date when button is clicked
    let birthDate = this.state.initialBirthDate
    document.getElementById('root_pet.date_details_BIRTH_DATE').value = birthDate
    document.getElementById('petAgeYears').value = ''
    document.getElementById('petAgeMonths').value = ''
  }

  render () {
    const input =
      <div
        id='petAgeExtension'
        className='form-group field field-string'>
        <label
          id='petAgeLabel'
          className={'control-label ' + style.label}
          htmlFor='petAgeExtension'>
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.pet_age`,
            defaultMessage: `${config.labelBasePath}.main.pet_age`
          })}
        </label>
        <input
          id='petAgeYears'
          className={'form-control ' + style.input}
          placeholder={this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.years`,
            defaultMessage: `${config.labelBasePath}.main.years`
          })}
        />
        <input
          id='petAgeMonths'
          className={'form-control ' + style.input}
          placeholder={this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.months`,
            defaultMessage: `${config.labelBasePath}.main.months`
          })}
        />
        <button
          id='resetDate'
          type='button'
          className={'btn btn_close_form ' + style.button}
          onClick={this.resetDate}
        >
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.reset_date`,
            defaultMessage: `${config.labelBasePath}.main.reset_date`
          })}
        </button>
        <button
          id='calculateAge'
          type='button'
          className={'btn-success btn_save_form ' + style.button}
          onClick={this.calculateAge}
        >
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.calculate_age`,
            defaultMessage: `${config.labelBasePath}.main.calculate_age`
          })}
        </button>
      </div>
    return (
      <div>
        {this.state.container &&
          ReactDOM.createPortal(input, this.state.container)
        }
        {this.props.children}
      </div>
    )
  }
}

PetAge.contextTypes = {
  intl: PropTypes.object.isRequired
}
