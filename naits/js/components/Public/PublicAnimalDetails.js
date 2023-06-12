import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import ReCAPTCHA from 'react-google-recaptcha'
import { parseISO, differenceInYears, differenceInMonths, differenceInDays, addYears, addMonths, addDays } from 'date-fns'
import moment from 'moment'
import { alertUser } from 'tibro-components'
import { getLabels } from 'client.js'
import { Loading } from 'components/ComponentsIndex'
import * as config from 'config/config'
import { isValidArray, isValidObject } from 'functions/utils'
import style from './PublicAnimal.module.css'
import loginStyle from 'components/LogonComponents/LoginForm/LoginFormStyle.module.css'

const activeStyle = {
  borderStyle: 'solid',
  borderWidth: '2px',
  borderColor: '#e0ab10',
  background: 'rgba(0, 0, 0, 0.23)'
}

class PublicAnimalDetails extends React.Component {
  constructor (props) {
    super(props)
    const currentLanguage = this.props.locale.split('-')[0]
    this.state = {
      currentLanguage,
      alert: undefined,
      loading: false,
      verified: false,
      animalId: '',
      animals: undefined,
      showHoldingDetailsModal: false,
      holdingDetailsModal: undefined,
      showVaccinationInfoModal: false,
      vaccinationInfoModal: undefined,
      headingLabels: [
        'main.animal_ear_tag', 'main.animal_species', 'grid_labels.animal.animal_race',
        'grid_labels.animal.gender', 'main.animal.birth_date', 'main.animal.animal_age',
        'main.animal.slaughter_date', 'main.animal_slaughter_location',
        'main.animal_holding_location_history', 'main.animal_vaccination_info', 'main.animal_details_public'
      ],
      holdingLocationHeadingLabels: [
        'grid_labels.holding.pic', 'grid_labels.village.region_code',
        'grid_labels.village.munic_code', 'grid_labels.village.village_code'
      ],
      vaccinationInfoHeadingLabels: ['main.animal_vaccinated_for', 'grid_labels.vaccination_event.immunization_period',
        'grid_labels.vaccination_book.campaign_name', 'form_labels.vaccination_date'
      ]
    }
  }

  componentDidMount () {
    moment.locale(this.state.currentLanguage)
  }

  validateCaptcha = captchaValue => {
    if (captchaValue) {
      this.setState({ verified: true })
      if (this.state.animalId && !this.state.animals) {
        setTimeout(this.searchAnimals(), 3000)
      }
    } else {
      this.setState({ verified: false })
    }
  }

  onAnimalIdChange = e => {
    this.setState({ animalId: e.target.value })
  }

  handleSearchByTheEnterKey = e => {
    if (e.keyCode === 13) {
      this.searchAnimals()
    }
  }

  searchAnimals = () => {
    const { locale } = this.props
    const { animalId, verified } = this.state
    if (!animalId) {
      this.setState({
        alert: alertUser(true, 'info', this.context.intl.formatMessage({
          id: `${config.labelBasePath}.alert.enter_animal_id`,
          defaultMessage: `${config.labelBasePath}.alert.enter_animal_id`
        }))
      })
    } else if (!verified) {
      this.setState({
        alert: alertUser(true, 'info', this.context.intl.formatMessage({
          id: `${config.labelBasePath}.alert.captcha_verification`,
          defaultMessage: `${config.labelBasePath}.alert.captcha_verification`
        }))
      })
    } else {
      this.setState({ loading: true, animals: undefined })

      const verbPath = `${config.svConfig.restSvcBaseUrl}${config.svConfig.triglavRestVerbs.PUBLIC_ANIMAL_SEARCH}`
      const searchParams = `/${animalId}/${locale.replace('-', '_')}`
      const url = `${verbPath}${searchParams}`
      axios.get(url).then(res => {
        if (res.data && res.data instanceof Object) {
          if (Object.keys(res.data).length !== 0) {
            const animalsArr = Object.keys(res.data).map((key) => [Number(key), res.data[key]])
            this.setState({ animals: animalsArr, loading: false })
          } else {
            this.setState({
              alert: alertUser(true, 'info', this.context.intl.formatMessage({
                id: `${config.labelBasePath}.alert.no_animals_found`,
                defaultMessage: `${config.labelBasePath}.alert.no_animals_found`
              })),
              loading: false
            })
          }
        }
      }).catch(err => {
        console.error(err)
        this.setState({ alert: alertUser(true, 'error', err), loading: false })
      })
    }
  }

  calculateAnimalAge = (birthDate, targetDateParam) => {
    const { currentLanguage } = this.state
    const yearLabel = currentLanguage === 'en' ? 'year' : 'წელი'
    const yearsLabel = currentLanguage === 'en' ? 'years' : 'წლები'
    const monthLabel = currentLanguage === 'en' ? 'month' : 'თვე'
    const monthsLabel = currentLanguage === 'en' ? 'months' : 'თვეები'
    const dayLabel = currentLanguage === 'en' ? 'day' : 'დღეს'
    const daysLabel = currentLanguage === 'en' ? 'days' : 'დღეები'
    const result = []
    let targetDate = targetDateParam ? parseISO(targetDateParam) : new Date()
    let age = parseISO(birthDate)

    const years = differenceInYears(targetDate, age)
    if (years > 0) {
      years === 1 ? result.push(`${years} ${yearLabel}`) : result.push(`${years} ${yearsLabel}`)
      age = addYears(age, years)
    }

    const months = differenceInMonths(targetDate, age)
    if (months > 0) {
      months === 1 ? result.push(`${months} ${monthLabel}`) : result.push(`${months} ${monthsLabel}`)
      age = addMonths(age, months)
    }

    const days = differenceInDays(targetDate, age)
    if (days > 0) {
      days === 1 ? result.push(`${days} ${dayLabel}`) : result.push(`${days} ${daysLabel}`)
      age = addDays(age, days)
    } else {
      result.push(`1 ${dayLabel}`)
    }

    return result.join(' ')
  }

  generateTableHeadings = () => {
    return this.state.headingLabels.map(label => (
      <th key={label} className={style['cell-heading']}>
        {this.context.intl.formatMessage({
          id: `${config.labelBasePath}.${label}`,
          defaultMessage: `${config.labelBasePath}.${label}`
        })}
      </th>
    ))
  }

  generateTableRows = () => {
    const { animals } = this.state

    return animals && animals.map((animal, index) => (
      <tr key={index + 1}>
        {animal[1]['ANIMAL_ID']
          ? <td key={`ANIMAL_ID_${animal[1]['ANIMAL_ID']}_${index}`} className={style['single-cell']}>{animal[1]['ANIMAL_ID']}</td>
          : <td key='ANIMAL_ID_NOT_FOUND' className={style['single-cell']}>N/A</td>
        }
        {animal[1]['ANIMAL_CLASS']
          ? <td key={`ANIMAL_CLASS_${animal[1]['ANIMAL_CLASS']}_${index}`} className={style['single-cell']}>{animal[1]['ANIMAL_CLASS']}</td>
          : <td key='ANIMAL_CLASS_NOT_FOUND' className={style['single-cell']}>N/A</td>
        }
        {animal[1]['ANIMAL_RACE']
          ? <td key={`ANIMAL_RACE_${animal[1]['ANIMAL_RACE']}_${index}`} className={style['single-cell']}>{animal[1]['ANIMAL_RACE']}</td>
          : <td key='ANIMAL_RACE_NOT_FOUND' className={style['single-cell']}>N/A</td>
        }
        {animal[1]['GENDER']
          ? <td key={`ANIMAL_GENDER_${animal['GENDER']}_${index}`} className={style['single-cell']}>{animal[1]['GENDER']}</td>
          : <td key='ANIMAL_GENDER_NOT_FOUND' className={style['single-cell']}>N/A</td>
        }
        {animal[1]['BIRTH_DATE']
          ? <td key={`ANIMAL_BIRTH_DATE_${animal[1]['BIRTH_DATE']}_${index}`} className={style['single-cell']}>
            {moment(animal[1]['BIRTH_DATE']).format('Do MMMM YYYY')}
          </td>
          : <td key='ANIMAL_BIRTH_DATE_NOT_FOUND' className={style['single-cell']}>N/A</td>
        }
        {animal[1]['BIRTH_DATE'] && !animal[1]['SLAUGHTER_DATE']
          ? <td key={`ANIMAL_AGE_${animal['BIRTH_DATE']}_${index}`} className={style['single-cell']}>
            {this.calculateAnimalAge(animal[1]['BIRTH_DATE'], '')}
          </td> : animal[1]['BIRTH_DATE'] && animal[1]['SLAUGHTER_DATE'] ? <td key={`ANIMAL_SLAUGHTER_DATE_AGE_${index}`} className={style['single-cell']}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.animal_has_been_slaughtered_at_age`,
              defaultMessage: `${config.labelBasePath}.main.animal_has_been_slaughtered_at_age`
            })}<br />
            {this.calculateAnimalAge(animal[1]['BIRTH_DATE'], animal[1]['SLAUGHTER_DATE'])}
          </td> : !animal[1]['BIRTH_DATE'] ? <td key='ANIMAL_AGE_NOT_FOUND' className={style['single-cell']}>N/A</td> : 'N/A'
        }
        {animal[1]['SLAUGHTER_DATE']
          ? <td key={`ANIMAL_SLAUGHTER_DATE_${index}`} className={style['single-cell']}>
            {moment(animal[1]['SLAUGHTER_DATE']).format('Do MMMM YYYY')}
          </td> : <td key='ANIMAL_SLAUGHTER_DATE_NOT_FOUND' className={style['single-cell']}>N/A</td>
        }
        {animal[1]['SLAUGHTER_DATE'] && animal[1]['REGION_CODE'] && animal[1]['MUNIC_CODE'] && animal[1]['VILLAGE_CODE']
          ? <td key={`ANIMAL_SLAUGHTER_LOCATION_${index}`} className={style['single-cell']}>
            {animal[1]['REGION_CODE']}, {animal[1]['MUNIC_CODE']}, <br />
            {animal[1]['VILLAGE_CODE']}
          </td> : <td key='ANIMAL_SLAUGHTER_LOCATION_NOT_FOUND' className={style['single-cell']}>N/A</td>
        }
        <td key={index + 2} className={style['single-cell-with-button']}>
          <button
            key={`${animal[1]['STATUS']}_${index}`}
            className={`btn btn-success ${style['details-report-btn']}`}
            onClick={() => {
              const params = {
                ...animal[1]['HOLDING_VISITS']['HOLDING'] && isValidArray(animal[1]['HOLDING_VISITS']['HOLDING'], 1) && {
                  holdingDetails: animal[1]['HOLDING_VISITS']['HOLDING']
                },
                ...animal[1]['HOLDING_VISITS']['HOLDING'] && isValidObject(animal[1]['HOLDING_VISITS']['HOLDING'], 1) && {
                  holdingDetails: [animal[1]['HOLDING_VISITS']['HOLDING']]
                },
                animalObjectId: animal[0],
                selectedAnimalEarTagNumber: animal[1]['ANIMAL_ID'],
                ...animal[1]['ANIMAL_CLASS'] && { selectedAnimalClass: animal[1]['ANIMAL_CLASS'] }
              }
              this.showHoldingDetailsModal(params)
            }}
          >
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.view_animal_holding_location_history`,
              defaultMessage: `${config.labelBasePath}.main.view_animal_holding_location_history`
            })}
          </button>
        </td>
        <td key={index + 3} className={style['single-cell-with-button']}>
          <button
            key={`${animal[1]['STATUS']}_${index}`}
            className={`btn btn-success ${style['details-report-btn']}`}
            onClick={() => {
              const params = {
                ...animal[1]['VACC_CAMPAIGNS']['VACCINE_PER_DISEASE_HISTORY'] && isValidArray(animal[1]['VACC_CAMPAIGNS']['VACCINE_PER_DISEASE_HISTORY'], 1) && {
                  vaccinationInfo: animal[1]['VACC_CAMPAIGNS']['VACCINE_PER_DISEASE_HISTORY']
                },
                ...animal[1]['VACC_CAMPAIGNS']['VACCINE_PER_DISEASE_HISTORY'] && isValidObject(animal[1]['VACC_CAMPAIGNS']['VACCINE_PER_DISEASE_HISTORY'], 1) && {
                  vaccinationInfo: Object.keys(animal[1]['VACC_CAMPAIGNS']['VACCINE_PER_DISEASE_HISTORY']).map((key) => [Number(key), animal[1]['VACC_CAMPAIGNS']['VACCINE_PER_DISEASE_HISTORY'][key]])
                },
                animalObjectId: animal[0],
                selectedAnimalEarTagNumber: animal[1]['ANIMAL_ID'],
                ...animal[1]['ANIMAL_CLASS'] && { selectedAnimalClass: animal[1]['ANIMAL_CLASS'] }
              }
              this.showVaccinationInfoModal(params)
            }}
          >
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.view_animal_vaccination_info`,
              defaultMessage: `${config.labelBasePath}.main.view_animal_vaccination_info`
            })}
          </button>
        </td>
        <td key={index + 4} className={style['single-cell-with-button']}>
          <button
            key={`${animal[1]['STATUS']}_${index}`}
            className={`btn btn-success ${style['details-report-btn']}`}
            onClick={() => {
              this.printAnimalDetails(animal[1]['ANIMAL_ID'], animal[1]['NOT_TRANSLATED_ANIMAL_CLASS'], 'public_animal_details_main')
            }}
          >
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.print_animal_details_public`,
              defaultMessage: `${config.labelBasePath}.main.print_animal_details_public`
            })}
          </button>
        </td>
      </tr>
    ))
  }

  generateHoldingLocationTableHeadings = () => {
    return this.state.holdingLocationHeadingLabels.map(label => (
      <th key={label} className={style['cell-heading']}>
        {this.context.intl.formatMessage({
          id: `${config.labelBasePath}.${label}`,
          defaultMessage: `${config.labelBasePath}.${label}`
        })}
      </th>
    ))
  }

  generateHoldingLocationTableRows = holdingDetails => {
    return holdingDetails && holdingDetails.map((detail, index) => (
      <tr key={index + 1}>
        {detail['PIC']
          ? <td key={`HOLDING_PIC_${index}`} className={style['single-cell']}>{detail['PIC']}</td>
          : <td key={`HOLDING_PIC_NOT_FOUND${index}`} className={style['single-cell']}>N/A</td>
        }
        {detail['REGION_CODE']
          ? <td key={`HOLDING_LOCATION_REGION_${index}`} className={style['single-cell']}>{detail['REGION_CODE']}</td>
          : <td key={`HOLDING_LOCATION_REGION_NOT_FOUND${index}`} className={style['single-cell']}>N/A</td>
        }
        {detail['MUNIC_CODE']
          ? <td key={`HOLDING_LOCATION_MUNIC_${index}`} className={style['single-cell']}>{detail['MUNIC_CODE']}</td>
          : <td key={`HOLDING_LOCATION_MUNIC_NOT_FOUND${index}`} className={style['single-cell']}>N/A</td>
        }
        {detail['VILLAGE_CODE']
          ? <td key={`HOLDING_LOCATION_VILLAGE_${index}`} className={style['single-cell']}>{detail['VILLAGE_CODE']}</td>
          : <td key={`HOLDING_LOCATION_VILLAGE_NOT_FOUND${index}`} className={style['single-cell']}>N/A</td>
        }
      </tr>
    ))
  }

  generateVaccinationInfoTableHeadings = () => {
    return this.state.vaccinationInfoHeadingLabels.map(label => (
      <th key={label} className={style['cell-heading']}>
        {this.context.intl.formatMessage({
          id: `${config.labelBasePath}.${label}`,
          defaultMessage: `${config.labelBasePath}.${label}`
        })}
      </th>
    ))
  }

  generateVaccinationInfoTableRows = vaccinationInfo => {
    return vaccinationInfo && vaccinationInfo.map((detail, index) => (
      <tr key={index + 1}>
        {detail[1]['DISEASE_NAME']
          ? <td key={`DISEASE_NAME_${index}`} className={style['single-cell']}>{detail[1]['DISEASE_NAME']}</td>
          : <td key={`DISEASE_NAME_NOT_FOUND${index}`} className={style['single-cell']}>N/A</td>
        }
        {detail[1]['IMMUNIZATION_PERIOD']
          ? <td key={`IMMUNIZATION_PERIOD_${index}`} className={style['single-cell']}>{detail[1]['IMMUNIZATION_PERIOD']}</td>
          : <td key={`IMMUNIZATION_PERIOD_NOT_FOUND${index}`} className={style['single-cell']}>N/A</td>
        }
        {detail[1]['CAMPAIGN_NAME']
          ? <td key={`CAMPAIGN_NAME_${index}`} className={style['single-cell']}>{detail[1]['CAMPAIGN_NAME']}</td>
          : <td key={`CAMPAIGN_NAME_NOT_FOUND${index}`} className={style['single-cell']}>N/A</td>
        }
        {detail[1]['DATE']
          ? <td key={`DATE_${index}`} className={style['single-cell']}>
            {moment(detail[1]['DATE']).format('Do MMMM YYYY')}
          </td> : <td key={`DATE_NOT_FOUND${index}`} className={style['single-cell']}>N/A</td>
        }
      </tr>
    ))
  }

  printAnimalDetails = (animalId, animalClass, reportName) => {
    const wsPath = `naits_triglav_plugin/PublicServices/getAnimalDetailsInPdfFormat/${animalId}/${animalClass}/${reportName}`
    const url = `${config.svConfig.restSvcBaseUrl}/${wsPath}`
    if (!this.state.verified) {
      this.setState({
        alert: alertUser(true, 'info', this.context.intl.formatMessage({
          id: `${config.labelBasePath}.alert.captcha_verification`,
          defaultMessage: `${config.labelBasePath}.alert.captcha_verification`
        }))
      })
    } else {
      window.open(url, '_blank')
    }
  }

  showHoldingDetailsModal = params => {
    const { selectedAnimalEarTagNumber, selectedAnimalClass, holdingDetails } = params

    const holdingDetailsModal = <div id='holding_details_modal' className='modal' style={{ display: 'block' }}>
      <div id='holding_details_modal_content' className={`modal-content disable_scroll_bar ${style['modal-content']}`}>
        <div className='modal-header'>
          <button id='modal_close_btn' type='button' className={`close ${style['close-btn']}`} onClick={this.closeHoldingDetailsModal}>&times;</button>
        </div>
        <div id='details_modal_body' className='modal-body'>
          <div id='holding_history_details' className={style['holding-history-details-container']}>
            <h1 className={style['modal-heading']}>
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.holding_location_history_desc`,
                defaultMessage: `${config.labelBasePath}.main.holding_location_history_desc`
              })}: {selectedAnimalEarTagNumber}{' '}
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.holding_location_history_desc_secondary`,
                defaultMessage: `${config.labelBasePath}.main.holding_location_history_desc_secondary`
              })}: {selectedAnimalClass}
            </h1>
            <hr />
            {holdingDetails &&
              <div className={`${style['modal-data-container']}`}>
                <table className={`table ${style['modal-table']}`}>
                  <thead>
                    <tr>{this.generateHoldingLocationTableHeadings()}</tr>
                  </thead>
                  <tbody>{this.generateHoldingLocationTableRows(holdingDetails)}</tbody>
                </table>
              </div>
            }
            {!holdingDetails &&
              <h3 className={`${style['modal-heading']} ${style['modal-heading-secondary']}`}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.no_animal_location_history_found`,
                  defaultMessage: `${config.labelBasePath}.main.no_animal_location_history_found`
                })}
              </h3>
            }
          </div>
        </div>
      </div>
    </div>

    this.setState({ showHoldingDetailsModal: true, holdingDetailsModal })
  }

  closeHoldingDetailsModal = () => {
    this.setState({ showHoldingDetailsModal: false, holdingDetailsModal: undefined })
  }

  showVaccinationInfoModal = params => {
    const { selectedAnimalEarTagNumber, selectedAnimalClass, vaccinationInfo } = params

    const vaccinationInfoModal = <div id='vaccination_info_modal' className='modal' style={{ display: 'block' }}>
      <div id='vaccination_info_modal_content' className={`modal-content disable_scroll_bar ${style['modal-content']}`}>
        <div className='modal-header'>
          <button id='modal_close_btn' type='button' className={`close ${style['close-btn']}`} onClick={this.closeVaccinationInfoModal}>&times;</button>
        </div>
        <div id='details_modal_body' className='modal-body'>
          <div id='vaccination_info_details' className={style['holding-history-details-container']}>
            <h1 className={style['modal-heading']}>
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.vaccination_info_desc`,
                defaultMessage: `${config.labelBasePath}.main.vaccination_info_desc`
              })}: {selectedAnimalEarTagNumber}{' '}
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.holding_location_history_desc_secondary`,
                defaultMessage: `${config.labelBasePath}.main.holding_location_history_desc_secondary`
              })}: {selectedAnimalClass}
            </h1>
            <hr />
            {vaccinationInfo &&
              <div className={`${style['modal-data-container']}`}>
                <table className={`table ${style['modal-table']}`}>
                  <thead>
                    <tr>{this.generateVaccinationInfoTableHeadings()}</tr>
                  </thead>
                  <tbody>{this.generateVaccinationInfoTableRows(vaccinationInfo)}</tbody>
                </table>
              </div>
            }
            {!vaccinationInfo && <h3 className={`${style['modal-heading']} ${style['modal-heading-secondary']}`}>
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.no_animal_vaccination_info_found`,
                defaultMessage: `${config.labelBasePath}.main.no_animal_vaccination_info_found`
              })}
            </h3>}
          </div>
        </div>
      </div>
    </div>

    this.setState({ showVaccinationInfoModal: true, vaccinationInfoModal })
  }

  closeVaccinationInfoModal = () => {
    this.setState({ showVaccinationInfoModal: false, vaccinationInfoModal: undefined })
  }

  render () {
    const { animals, currentLanguage } = this.state

    return (
      <div className={`displayContent ${style['component-container']}`}>
        <div className={style['language-buttons-container']}>
          <button
            {...currentLanguage === 'ka' && { style: activeStyle }}
            className={`${loginStyle.language} ${style['language-btn']}`}
            onClick={() => getLabels(null, 'ka-GE')}
          >
            KA
          </button>
          <button
            {...currentLanguage === 'en' && { style: activeStyle }}
            className={`${loginStyle.language} ${style['language-btn']}`}
            onClick={() => getLabels(null, 'en-US')}
          >
            EN
          </button>
        </div>
        <div className={style['content-container']}>
          <h1 className={style['heading-color']}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.animal_details`,
              defaultMessage: `${config.labelBasePath}.main.animal_details`
            })}
          </h1>
          <h4 className={style['heading-color']}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.animal_public_search_details`,
              defaultMessage: `${config.labelBasePath}.main.animal_public_search_details`
            })}
          </h4>
          <div className={style['search-container']}>
            <div className={style['search-input-container']}>
              <input
                className={style['search-input']}
                style={{ width: currentLanguage === 'en' ? '250px' : '400px' }}
                placeholder={this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.animal_ear_tag`,
                  defaultMessage: `${config.labelBasePath}.main.animal_ear_tag`
                })}
                type='text'
                id='animalId'
                name='animalId'
                onChange={this.onAnimalIdChange}
                value={this.state.animalId}
                onKeyDown={this.handleSearchByTheEnterKey}
              />
              <button id='search-btn' className={`${style['search-btn']}`} onClick={this.searchAnimals}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.search`,
                  defaultMessage: `${config.labelBasePath}.main.search`
                })}
              </button>
            </div>
            <div className={`${style['captcha-container']}`}>
              <ReCAPTCHA
                sitekey={config.captchaSiteKey}
                onChange={this.validateCaptcha}
                hl={currentLanguage}
              />
            </div>
          </div>
          {this.state.loading && <Loading />}
          {animals &&
            <div className={`${style['data-container']}`}>
              <table className={`table ${style['table']}`}>
                <thead>
                  <tr>
                    {this.generateTableHeadings()}
                  </tr>
                </thead>
                <tbody>{this.generateTableRows()}</tbody>
              </table>
            </div>
          }
          {this.state.showHoldingDetailsModal && ReactDOM.createPortal(this.state.holdingDetailsModal, document.getElementById('app'))}
          {this.state.showVaccinationInfoModal && ReactDOM.createPortal(this.state.vaccinationInfoModal, document.getElementById('app'))}
        </div>
      </div>
    )
  }
}

PublicAnimalDetails.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  locale: state.intl.locale
})

export default connect(mapStateToProps)(PublicAnimalDetails)
