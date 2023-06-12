import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { connect } from 'react-redux'
import ReCAPTCHA from 'react-google-recaptcha'
import { parseISO, differenceInYears, differenceInMonths, differenceInDays, addYears, addMonths, addDays } from 'date-fns'
import moment from 'moment'
import { alertUser } from 'tibro-components'
import { getLabels } from 'client.js'
import { Loading } from 'components/ComponentsIndex'
import { setCookie, getCookie } from 'functions/cookies'
import * as config from 'config/config'
import style from './PublicAnimal.module.css'
import loginStyle from 'components/LogonComponents/LoginForm/LoginFormStyle.module.css'

const activeStyle = {
  borderStyle: 'solid',
  borderWidth: '2px',
  borderColor: '#e0ab10',
  background: 'rgba(0, 0, 0, 0.23)'
}

class PublicAnimalLabels extends React.Component {
  constructor (props) {
    super(props)
    const currentLanguage = this.props.locale.split('-')[0]
    this.state = {
      currentLanguage,
      alert: undefined,
      loading: false,
      verified: false,
      companyName: '',
      animalId: '',
      animals: undefined,
      headingLabels: [
        'main.animal_status', 'main.animal_ear_tag', 'main.animal_species', 'grid_labels.animal.animal_race',
        'grid_labels.animal.gender', 'main.animal.birth_date', 'main.animal.animal_age',
        'main.animal.slaughter_date', 'main.animal_slaughter_location', 'main.print_labels'
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

  onCompanyNameChange = (e, animalObjId) => {
    this.setState({ companyName: e.target.value })
    const existingData = getCookie('publicAnimalLabelsCompanyName') || null
    const companyNameObj = existingData || JSON.stringify({})
    setCookie(
      'publicAnimalLabelsCompanyName',
      JSON.stringify({
        ...JSON.parse(companyNameObj),
        [animalObjId]: e.target.value
      })
    )
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
      this.setState({ loading: true, animals: undefined, companyName: '' })

      const verbPath = `${config.svConfig.restSvcBaseUrl}${config.svConfig.triglavRestVerbs.PUBLIC_ANIMAL_SEARCH}`
      const searchParams = `/${animalId}/${locale.replace('-', '_')}`
      const url = `${verbPath}${searchParams}`
      axios.get(url).then(res => {
        if (res.data && res.data instanceof Object) {
          if (Object.keys(res.data).length !== 0) {
            const animalsArr = Object.keys(res.data).map((key) => [Number(key), res.data[key]])
            let companyNameObj = null
            const companyNameCookie = getCookie('publicAnimalLabelsCompanyName')
            if (companyNameCookie) {
              companyNameObj = JSON.parse(companyNameCookie)
            }
            if (companyNameObj) {
              animalsArr.forEach(animal => {
                Object.keys(companyNameObj).forEach(key => {
                  if (Number(key) === animal[0]) {
                    this.setState({ companyName: companyNameObj[animal[0]] })
                  }
                })
              })
            }
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
        {animal[1]['STATUS']
          ? <td key={`ANIMAL_STATUS_${animal[1]['STATUS']}_${index}`} className={style['single-cell']}>{animal[1]['STATUS']}</td>
          : <td key='ANIMAL_STATUS_NOT_FOUND' className={style['single-cell']}>N/A</td>
        }
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
          ? <td key={`ANIMAL_GENDER_${animal[1]['GENDER']}_${index}`} className={style['single-cell']}>{animal[1]['GENDER']}</td>
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
        {animal[1]['STATUS'] && animal[1]['STATUS'] === 'POSTMORTEM' &&
          <td key={index + 2} className={style['single-cell-with-button-labels']}>
            <div>
              <input
                type='text'
                id='companyName'
                name='companyName'
                value={this.state.companyName}
                className={`form-control ${style['company-name-input']}`}
                onChange={(e) => this.onCompanyNameChange(e, animal[0])}
                placeholder={this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.company_name`,
                  defaultMessage: `${config.labelBasePath}.main.company_name`
                })}
              />
            </div>
            <div className={style['cell-button-labels-container']}>
              <button
                key={`${animal[1]['STATUS']}_${index}_1in1`}
                className={`btn btn-success ${style['labels-btn']}`}
                onClick={() => this.printPostmortemLabels(
                  animal[1]['ANIMAL_ID'],
                  animal[1]['NOT_TRANSLATED_ANIMAL_CLASS'],
                  'slaugh_1in1_final_geo'
                )}
              >
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.1_in_1_public`,
                  defaultMessage: `${config.labelBasePath}.main.1_in_1_public`
                })}
              </button>
              <button
                key={`${animal[1]['STATUS']}_${index}_6in1`}
                className={`btn btn-success ${style['labels-btn']}`}
                onClick={() => this.printPostmortemLabels(
                  animal[1]['ANIMAL_ID'],
                  animal[1]['NOT_TRANSLATED_ANIMAL_CLASS'],
                  'slaugh_6in1_final_geo'
                )}
              >
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.6_in_1_public`,
                  defaultMessage: `${config.labelBasePath}.main.6_in_1_public`
                })}
              </button>
            </div>
          </td>
        }
      </tr>
    ))
  }

  printPostmortemLabels = (animalId, animalClass, printName) => {
    const { companyName } = this.state
    const wsPath = `${config.svConfig.restSvcBaseUrl}/naits_triglav_plugin/PublicServices/getAnimalDetailsInPdfFormat`
    const url = `${wsPath}/${animalId}/${animalClass}/${printName}/${companyName || null}`
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
              id: `${config.labelBasePath}.main.animal_labels`,
              defaultMessage: `${config.labelBasePath}.main.animal_labels`
            })}
          </h1>
          <h4 className={style['heading-color']}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.animal_public_search_details`,
              defaultMessage: `${config.labelBasePath}.main.animal_public_search_details`
            })}
          </h4>
          <div className={style['search-container']}>
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
                  <tr>{this.generateTableHeadings()}</tr>
                </thead>
                <tbody>{this.generateTableRows()}</tbody>
              </table>
            </div>
          }
        </div>
      </div>
    )
  }
}

PublicAnimalLabels.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  locale: state.intl.locale
})

export default connect(mapStateToProps)(PublicAnimalLabels)
