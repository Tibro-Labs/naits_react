import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import { alertUser } from 'tibro-components'
import { store } from 'tibro-redux'
import Loading from 'components/Loading'
import { isValidArray, strcmp, isValidObject } from 'functions/utils'
import * as config from 'config/config'
import searchStyle from './SearchStyles.module.css'

class AnimalSearch extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      renderInputs: false,
      statuses: {},
      classes: {},
      breeds: {},
      colors: {},
      countries: {},
      animalId: '',
      animalStatus: '',
      animalClass: '',
      animalBreed: '',
      animalColor: '',
      animalCountry: ''
    }
  }

  componentDidMount () {
    this.getFilterValues()
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.animalId && this.props.noResults !== nextProps.noResults && nextProps.noResults) {
      alertUser(
        true, 'info',
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.alert.no_animal_id_found`,
          defaultMessage: `${config.labelBasePath}.alert.no_animal_id_found`
        }),
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.alert.search_replaced_ear_tags`,
          defaultMessage: `${config.labelBasePath}.alert.search_replaced_ear_tags`
        }),
        () => {
          this.props.waitForSearch({ value: this.state.animalId, criteria: 'OLD_EAR_TAG' })
        },
        () => { }, true,
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.yes`,
          defaultMessage: `${config.labelBasePath}.main.yes`
        }),
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.no`,
          defaultMessage: `${config.labelBasePath}.main.no`
        })
      )
    }
  }

  getFilterValues = () => {
    this.setState({ loading: true })
    const { session } = this.props
    let wsPath = config.svConfig.triglavRestVerbs.GET_FORM_BUILDER
    wsPath = wsPath.replace('%session', session)
    wsPath = wsPath.replace('%formWeWant', 'ANIMAL')
    const finalUrl = `${config.svConfig.restSvcBaseUrl}${wsPath}`
    const statuses = {}
    const classes = {}
    const colors = {}
    const countries = {}
    const animalStatuses = [
      'VALID', 'LOST', 'POSTMORTEM', 'EXPORTED', 'SOLD', 'PENDING_EX',
      'TRANSITION', 'DESTROYED', 'PREMORTEM', 'ABSENT', 'DIED', 'SLAUGHTRD'
    ]
    const animalStatusesObjArr = animalStatuses.map(status => {
      return {
        label: this.context.intl.formatMessage({
          id: `${config.labelBasePath}.status.${status.toLowerCase()}`, defaultMessage: `${config.labelBasePath}.status.${status.toLowerCase()}`
        }),
        value: status
      }
    })
    axios.get(finalUrl).then(res => {
      if (res.data) {
        const basicInfo = res.data.properties['animal.basic_info'].properties
        const description = res.data.properties['animal.description'].properties
        basicInfo.COUNTRY.enum.forEach((country, i) => {
          Reflect.set(countries, country, basicInfo.COUNTRY.enumNames[i])
        })
        description.ANIMAL_CLASS.enum.forEach((animalClass, i) => {
          Reflect.set(classes, animalClass, description.ANIMAL_CLASS.enumNames[i])
        })
        description.COLOR.enum.forEach((color, i) => {
          Reflect.set(colors, color, description.COLOR.enumNames[i])
        })
        animalStatusesObjArr.forEach(status => {
          Reflect.set(statuses, status.value, status.label)
        })

        this.setState({ statuses, classes, colors, countries, loading: false, renderInputs: true })
      }
    }).catch(err => {
      console.error(err)
      this.setState({ loading: false })
      alertUser(true, 'error', err)
    })
  }

  getBreeds = (animalClass) => {
    this.setState({ breeds: {}, animalBreed: '' })
    const { session } = this.props
    const wsPath = `naits_triglav_plugin/ApplicationServices/getDependentDropdown/${session}/ANIMAL/${animalClass}`
    const url = `${config.svConfig.restSvcBaseUrl}/${wsPath}`
    axios.get(url).then(res => {
      const breeds = {}
      if (res.data && res.data.items && isValidArray(res.data.items, 1)) {
        res.data.items.forEach(animalBreed => {
          Reflect.set(breeds, animalBreed.CODE_VALUE, animalBreed.LBL_TRANSL)
        })
      }
      this.setState({ breeds })
    }).catch(err => {
      console.error(err)
      alertUser(true, 'error', err)
    })
  }

  handleSearch = (e) => {
    e.preventDefault()
    store.dispatch({ type: 'RESET_ANIMAL_SEARCH' })
    const { animalId, animalStatus, animalClass, animalBreed, animalColor, animalCountry } = this.state
    if (!animalId && !animalStatus && !animalClass && !animalColor && !animalCountry) {
      const enterSomeValuesLabel = this.context.intl.formatMessage({
        id: `${config.labelBasePath}.main.search.enter_some_values`, defaultMessage: `${config.labelBasePath}.main.search.enter_some_values`
      })
      alertUser(true, 'info', enterSomeValuesLabel)
    } else {
      const searchData = {
        criteria: 'CUSTOM_ANIMAL_SEARCH',
        animalId: animalId.trim() || null,
        animalStatus: animalStatus || null,
        animalClass: animalClass || null,
        animalBreed: animalBreed || null,
        animalColor: animalColor || null,
        animalCountry: animalCountry || null
      }
      if (animalStatus && (strcmp(animalStatus, 'LOST') || strcmp(animalStatus, 'TRANSITION'))) {
        store.dispatch({ type: 'CHANGED_CUSTOM_ANIMAL_STATUS_SEARCH_CRITERIA', payload: animalStatus })
      }
      this.props.waitForSearch(searchData)
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
    if (strcmp(e.target.name, 'animalClass')) {
      this.getBreeds(e.target.value)
    }
  }

  generateInputs = () => {
    const { statuses, classes, breeds, colors, countries } = this.state
    const inputs = (
      <React.Fragment>
        <div style={{ marginTop: '1rem' }}>
          <p className={searchStyle.searchPrompt} style={{ marginTop: '0' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.search.by_animal_id`, defaultMessage: `${config.labelBasePath}.main.search.by_animal_id`
            })}
          </p>
          <input
            id='animalId'
            name='animalId'
            className={`${searchStyle.input}`}
            style={{ background: '#e9f1da', borderRadius: '5px', width: '100%', paddingLeft: '8px' }}
            minLength={4}
            onChange={this.onChange}
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <p className={searchStyle.searchPrompt} style={{ marginTop: '0' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.animal_status`, defaultMessage: `${config.labelBasePath}.main.animal_status`
            })}
          </p>
          <select
            onChange={this.onChange}
            id='animalStatus'
            name='animalStatus'
            className={searchStyle.dropdown}
          >
            <option disabled selected hidden value='' />
            {Object.keys(statuses).map((status, i) => <option key={status} value={status}>{Object.values(statuses)[i]}</option>)}
          </select>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <p className={searchStyle.searchPrompt} style={{ marginTop: '0' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.search.by_animal_class`, defaultMessage: `${config.labelBasePath}.main.search.by_animal_class`
            })}
          </p>
          <select
            onChange={this.onChange}
            id='animalClass'
            name='animalClass'
            className={searchStyle.dropdown}
          >
            <option disabled selected hidden value='' />
            {Object.keys(classes).map((animalClass, i) => <option key={animalClass} value={animalClass}>{Object.values(classes)[i]}</option>)}
          </select>
        </div>
        {isValidObject(breeds, 1) && <div style={{ marginTop: '1rem' }}>
          <p className={searchStyle.searchPrompt} style={{ marginTop: '0' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.search.by_animal_breed`, defaultMessage: `${config.labelBasePath}.main.search.by_animal_breed`
            })}
          </p>
          <select
            onChange={this.onChange}
            id='animalBreed'
            name='animalBreed'
            className={searchStyle.dropdown}
          >
            <option disabled selected hidden value='' />
            {Object.keys(breeds).map((animalBreed, i) => <option key={animalBreed} value={animalBreed}>{Object.values(breeds)[i]}</option>)}
          </select>
        </div>}
        <div style={{ marginTop: '1rem' }}>
          <p className={searchStyle.searchPrompt} style={{ marginTop: '0' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.search.by_color`, defaultMessage: `${config.labelBasePath}.main.search.by_color`
            })}
          </p>
          <select
            onChange={this.onChange}
            id='animalColor'
            name='animalColor'
            className={searchStyle.dropdown}
          >
            <option disabled selected hidden value='' />
            {Object.keys(colors).map((animalColor, i) => <option key={animalColor} value={animalColor}>{Object.values(colors)[i]}</option>)}
          </select>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <p className={searchStyle.searchPrompt} style={{ marginTop: '0' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.search.country`, defaultMessage: `${config.labelBasePath}.main.search.country`
            })}
          </p>
          <select
            onChange={this.onChange}
            id='animalCountry'
            name='animalCountry'
            className={searchStyle.dropdown}
          >
            <option disabled selected hidden value='' />
            {Object.keys(countries).map((country, i) => <option key={country} value={country}>{Object.values(countries)[i]}</option>)}
          </select>
        </div>
      </React.Fragment>
    )

    return inputs
  }

  generateSearchButton = () => {
    const searchButton = (
      <div style={{ marginTop: '1rem' }}>
        <button type='submit' id='searchAnimals' className={searchStyle.button} style={{ width: '100%', borderRadius: '5px', fontSize: '1.3em' }}>
          {this.context.intl.formatMessage({ id: `${config.labelBasePath}.main.search`, defaultMessage: `${config.labelBasePath}.main.search` })}
        </button>
      </div>
    )

    return searchButton
  }

  render () {
    const { loading, renderInputs } = this.state

    return (
      <React.Fragment>
        {loading && <Loading />}
        <form
          id='animal_multi_filter_search_filters'
          className={searchStyle.search}
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', borderTopLeftRadius: '0', borderTopRightRadius: '0', marginTop: '-0.1rem' }}
          onSubmit={(e) => this.handleSearch(e)}
        >
          {renderInputs && (
            <React.Fragment>
              {this.generateInputs()}
              {this.generateSearchButton()}
            </React.Fragment>
          )}
        </form>
      </React.Fragment>
    )
  }
}

AnimalSearch.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession,
  noResults: state.searchAndLoad.noResults
})

export default connect(mapStateToProps)(AnimalSearch)
