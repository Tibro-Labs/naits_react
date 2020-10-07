import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import { alertUser } from 'tibro-components'
import * as config from 'config/config'
import { setInputFilter, formatAlertType } from 'functions/utils'
import style from './AdminConsole.module.css'

class DeleteAnimal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: null,
      animals: ['cattle', 'buffalo', 'sheep', 'goat', 'pig', 'horse', 'donkey'],
      numValues: ['1', '2', '9', '10', '11', '12', '400'],
      animalIdInput: 'animalId',
      animalsDropdown: 'animalClassDropdown',
      dropdownName: 'selectedAnimalClass',
      animalId: '',
      selectedAnimalClass: ''
    }
  }

  componentDidMount () {
    // Set an input filter on the animal id input field that only accepts numeric values
    this.setAnimalIdInputFilter()
  }

  setAnimalIdInputFilter = () => {
    const animalIdInput = document.getElementById(this.state.animalIdInput)
    if (animalIdInput) {
      setInputFilter(animalIdInput, function (value) {
        return /^\d*$/.test(value)
      })
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  showAlert = () => {
    const { animalId, selectedAnimalClass } = this.state

    if (!animalId && !selectedAnimalClass) {
      this.setState({
        alert: alertUser(
          true,
          'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.enter_animal_id_and_class`,
            defaultMessage: `${config.labelBasePath}.alert.enter_animal_id_and_class`
          }),
          null,
          () => {
            this.closeAlert()
          }
        )
      })
    } else if (animalId && !selectedAnimalClass) {
      this.setState({
        alert: alertUser(
          true,
          'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.enter_animal_class`,
            defaultMessage: `${config.labelBasePath}.alert.enter_animal_class`
          }),
          null,
          () => {
            this.closeAlert()
          }
        )
      })
    } else if (selectedAnimalClass && !animalId) {
      this.setState({
        alert: alertUser(
          true,
          'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.enter_animal_id`,
            defaultMessage: `${config.labelBasePath}.alert.enter_animal_id`
          }),
          null,
          () => {
            this.closeAlert()
          }
        )
      })
    } else {
      this.setState({
        alert: alertUser(
          true,
          'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.delete_animal_prompt`,
            defaultMessage: `${config.labelBasePath}.main.delete_animal_prompt`
          }),
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.delete_record_prompt_message`,
            defaultMessage: `${config.labelBasePath}.main.delete_record_prompt_message`
          }),
          () => {
            this.deleteAnimal()
          },
          () => {
            this.closeAlert()
            this.setState({ animalId: '', selectedAnimalClass: '' })
          },
          true,
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.forms.delete`,
            defaultMessage: `${config.labelBasePath}.main.forms.delete`
          }),
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.forms.cancel`,
            defaultMessage: `${config.labelBasePath}.main.forms.cancel`
          }),
          true,
          null,
          true
        )
      })
    }
  }

  closeAlert = () => {
    this.setState({ alert: false })
  }

  deleteAnimal = async () => {
    const { session } = this.props
    const { animalId, selectedAnimalClass } = this.state
    const verbPath = config.svConfig.triglavRestVerbs.DELETE_ANIMAL_ADM_CONSOLE
    let url = `${config.svConfig.restSvcBaseUrl}${verbPath}`
    url = url.replace('%sessionId', session)
    url = url.replace('%animalId', animalId)
    url = url.replace('%animalClass', selectedAnimalClass)
    try {
      const res = await axios.get(url)
      const alertType = formatAlertType(res.data)
      this.setState({
        alert: alertUser(
          true,
          alertType,
          this.context.intl.formatMessage({
            id: res.data,
            defaultMessage: res.data
          }),
          null,
          () => {
            this.closeAlert()
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
            this.closeAlert()
          }
        )
      })
    }

    this.setState({ animalId: '', selectedAnimalClass: '' })
  }

  render () {
    const {
      animals,
      numValues,
      animalIdInput,
      animalsDropdown,
      dropdownName,
      animalId,
      selectedAnimalClass
    } = this.state

    return (
      <React.Fragment>
        <h1 className={`${style.deleteAnimalHeadingColor}`}>
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.animal_deletion`,
            defaultMessage: `${config.labelBasePath}.main.animal_deletion`
          })}
        </h1>
        <h4 className={`${style.deleteAnimalHeadingColor}`}>
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.animal_deletion_detailed`,
            defaultMessage: `${config.labelBasePath}.main.animal_deletion_detailed`
          })}
        </h4>
        <div className='form-group' style={{ display: 'inline-flex', marginTop: '1rem' }}>
          <div style={{ marginRight: '1.5rem' }}>
            <label htmlFor={animalIdInput}>
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.animal.animal_id`,
                defaultMessage: `${config.labelBasePath}.main.animal.animal_id`
              })}
            </label>
            <input
              className='form-control'
              type='text'
              id={animalIdInput}
              name={animalIdInput}
              onChange={this.onChange}
              value={animalId}
            />
          </div>
          <div>
            <label htmlFor={animalsDropdown}>
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.animal.animal_class`,
                defaultMessage: `${config.labelBasePath}.main.animal.animal_class`
              })}
            </label>
            <select
              className='form-control'
              style={{ backgroundColor: '#e3eedd', color: '#000000' }}
              name={dropdownName}
              id={animalsDropdown}
              onChange={this.onChange}
              value={selectedAnimalClass}
            >
              <option value='' defaultChecked />
              {animals.map((animal, index) => {
                return <option key={animal} value={numValues[index]}>
                  {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.main.${animal}`,
                    defaultMessage: `${config.labelBasePath}.main.${animal}`
                  })}
                </option>
              })}
            </select>
          </div>
        </div>
        <div className='form-group' style={{ marginTop: '1.2rem' }}>
          <button
            className={`btn ${style.deleteAnimalBtn}`}
            onClick={this.showAlert}
          >
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.actions.delete_animal`,
              defaultMessage: `${config.labelBasePath}.actions.delete_animal`
            })}
          </button>
        </div>
      </React.Fragment>
    )
  }
}

DeleteAnimal.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession
})

export default connect(mapStateToProps)(DeleteAnimal)
