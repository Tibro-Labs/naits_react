import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import { alertUser } from 'tibro-components'
import { store } from 'tibro-redux'
import Loading from 'components/Loading'
import * as config from 'config/config'
import searchStyle from './SearchStyles.module.css'

class FlockSearch extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      renderInputs: false,
      statuses: {},
      classes: {},
      colors: {},
      flockId: '',
      flockStatus: '',
      flockClass: '',
      flockColor: ''
    }
  }

  componentDidMount () {
    this.getFilterValues()
  }

  getFilterValues = () => {
    this.setState({ loading: true })
    const { session } = this.props
    let wsPath = config.svConfig.triglavRestVerbs.GET_FORM_BUILDER
    wsPath = wsPath.replace('%session', session)
    wsPath = wsPath.replace('%formWeWant', 'FLOCK')
    const finalUrl = `${config.svConfig.restSvcBaseUrl}${wsPath}`
    const statuses = {}
    const classes = {}
    const colors = {}
    const flockStatuses = [
      'VALID', 'LOST', 'POSTMORTEM', 'EXPORTED', 'SOLD', 'PENDING_EX',
      'TRANSITION', 'DESTROYED', 'PREMORTEM', 'ABSENT', 'DIED', 'SLAUGHTRD'
    ]
    const flockStatusesObjArr = flockStatuses.map(status => {
      return {
        label: this.context.intl.formatMessage({
          id: `${config.labelBasePath}.status.${status.toLowerCase()}`, defaultMessage: `${config.labelBasePath}.status.${status.toLowerCase()}`
        }),
        value: status
      }
    })
    axios.get(finalUrl).then(res => {
      if (res.data) {
        const description = res.data.properties['flock.info'].properties
        description.ANIMAL_TYPE.enum.forEach((animalClass, i) => {
          Reflect.set(classes, animalClass, description.ANIMAL_TYPE.enumNames[i])
        })
        description.EAR_TAG_COLOR.enum.forEach((color, i) => {
          Reflect.set(colors, color, description.EAR_TAG_COLOR.enumNames[i])
        })
        flockStatusesObjArr.forEach(status => {
          Reflect.set(statuses, status.value, status.label)
        })

        this.setState({ statuses, classes, colors, loading: false, renderInputs: true })
      }
    }).catch(err => {
      console.error(err)
      this.setState({ loading: false })
      alertUser(true, 'error', err)
    })
  }

  handleSearch = (e) => {
    e.preventDefault()
    store.dispatch({ type: 'RESET_ANIMAL_SEARCH' })
    const { flockId, flockStatus, flockClass, flockColor } = this.state
    if (!flockId && !flockStatus && !flockClass && !flockColor) {
      const enterSomeValuesLabel = this.context.intl.formatMessage({
        id: `${config.labelBasePath}.main.search.enter_some_values`, defaultMessage: `${config.labelBasePath}.main.search.enter_some_values`
      })
      alertUser(true, 'info', enterSomeValuesLabel)
    } else {
      const searchData = {
        criteria: 'CUSTOM_FLOCK_SEARCH',
        flockId: flockId || null,
        flockStatus: flockStatus || null,
        flockClass: flockClass || null,
        flockColor: flockColor || null
      }
      this.props.waitForSearch(searchData)
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  generateInputs = () => {
    const { statuses, classes, colors } = this.state
    const inputs = (
      <React.Fragment>
        <div style={{ marginTop: '1rem' }}>
          <p className={searchStyle.searchPrompt} style={{ marginTop: '0' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.flock.flock_id`, defaultMessage: `${config.labelBasePath}.main.flock.flock_id`
            })}
          </p>
          <input
            id='flockId'
            name='flockId'
            className={`${searchStyle.input}`}
            style={{ background: '#e9f1da', borderRadius: '5px', width: '100%', paddingLeft: '8px' }}
            minLength={4}
            onChange={this.onChange}
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <p className={searchStyle.searchPrompt} style={{ marginTop: '0' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.grid_labels.flock.status`, defaultMessage: `${config.labelBasePath}.grid_labels.flock.status`
            })}
          </p>
          <select
            onChange={this.onChange}
            id='flockStatus'
            name='flockStatus'
            className={searchStyle.dropdown}
          >
            <option disabled selected hidden value='' />
            {Object.keys(statuses).map((status, i) => <option key={status} value={status}>{Object.values(statuses)[i]}</option>)}
          </select>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <p className={searchStyle.searchPrompt} style={{ marginTop: '0' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.flock.animal_type`, defaultMessage: `${config.labelBasePath}.main.flock.animal_type`
            })}
          </p>
          <select
            onChange={this.onChange}
            id='flockClass'
            name='flockClass'
            className={searchStyle.dropdown}
          >
            <option disabled selected hidden value='' />
            {Object.keys(classes).map((animalClass, i) => <option key={animalClass} value={animalClass}>{Object.values(classes)[i]}</option>)}
          </select>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <p className={searchStyle.searchPrompt} style={{ marginTop: '0' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.flock.ear_tag_color`, defaultMessage: `${config.labelBasePath}.main.flock.ear_tag_color`
            })}
          </p>
          <select
            onChange={this.onChange}
            id='flockColor'
            name='flockColor'
            className={searchStyle.dropdown}
          >
            <option disabled selected hidden value='' />
            {Object.keys(colors).map((animalColor, i) => <option key={animalColor} value={animalColor}>{Object.values(colors)[i]}</option>)}
          </select>
        </div>
      </React.Fragment>
    )

    return inputs
  }

  generateSearchButton = () => {
    const searchButton = (
      <div style={{ marginTop: '1rem' }}>
        <button type='submit' id='searchFlocks' className={searchStyle.button} style={{ width: '100%', borderRadius: '5px', fontSize: '1.3em' }}>
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
          id='flock_multi_filter_search_filters'
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

FlockSearch.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession
})

export default connect(mapStateToProps)(FlockSearch)
