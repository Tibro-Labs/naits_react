import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import axios from 'axios'
import { alertUser } from 'tibro-components'
import { store } from 'tibro-redux'
import { connect } from 'react-redux'
import { ComponentManager, ResultsGrid } from 'components/ComponentsIndex'
import * as config from 'config/config.js'
import { menuConfig } from 'config/menuConfig'
import { $, formatAlertType, setInputFilter } from 'functions/utils'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'

class ApplyStratificationFilter extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: null,
      showPopup: false,
      showResults: false,
      gridToDisplay: 'STRAT_FILTER',
      reRender: '',
      regions: '',
      municipalities: '',
      communities: '',
      villages: '',
      holdings: '',
      animals: '',
      numOfRegions: null,
      numOfMunics: null,
      numOfCommuns: null,
      numOfVillages: null
    }
  }

  componentDidMount () {
    // Attach click event listeners
    this.attachClickEventListeners()
    // Get the applied population numbers
    this.getPopulationNumbers()
  }

  attachClickEventListeners = () => {
    const applyFilterBtn = document.getElementById('apply_strat_filter')
    if (applyFilterBtn) {
      applyFilterBtn.onclick = this.displayPopupOnClick
    }

    const appliedFilterBtn = document.getElementById('applied_strat_filter')
    if (appliedFilterBtn) {
      appliedFilterBtn.onclick = this.displayResultsPopupOnClick
    }
  }

  getPopulationNumbers = async () => {
    const server = config.svConfig.restSvcBaseUrl
    let verbPath = config.svConfig.triglavRestVerbs.GET_STRATIFICATION_NUMBERS
    let url = `${server}/${verbPath}`
    url = url.replace('%sessionId', this.props.svSession)
    url = url.replace('%populationId', this.props.objectId)

    try {
      const res = await axios.get(url)
      if (Object.keys(res.data).length === 0 && res.data.constructor === Object) {
        // Test data
        this.setState({
          numOfRegions: 5,
          numOfMunics: 50,
          numOfCommuns: 300,
          numOfVillages: 1000
        })
      } else {
        this.setState({
          numOfRegions: parseInt(res.data.REGIONS),
          numOfMunics: parseInt(res.data.MUNICS),
          numOfCommuns: parseInt(res.data.COMMUNS),
          numOfVillages: parseInt(res.data.VILLAGES)
        })
      }
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
            this.setState({ alert: false })
          }
        )
      })
    }
  }

  componentDidUpdate (nextProps, nextState) {
    if (this.state.showPopup !== nextState.showPopup) {
      const { numOfRegions, numOfMunics, numOfCommuns, numOfVillages } = this.state
      const regionsInput = $('regions')
      const municsInput = $('municipalities')
      const communsInput = $('communities')
      const villagesInput = $('villages')
      const animalsInput = $('animals')
      const holdingsInput = $('holdings')
      if (regionsInput) {
        /**
         * Sets an input filter that only accepts numeric values smaller or equal to the
         * number of regions available from the geo-location filter
         */
        setInputFilter(regionsInput, function (value) {
          return /^\d*$/.test(value) && (value === '' || parseInt(value) <= numOfRegions)
        })
      }
      if (municsInput) {
        /**
         * Sets an input filter that only accepts numeric values smaller or equal to the
         * number of municipalities available from the geo-location filter
         */
        setInputFilter(municsInput, function (value) {
          return /^\d*$/.test(value) && (value === '' || parseInt(value) <= numOfMunics)
        })
      }
      if (communsInput) {
        /**
         * Sets an input filter that only accepts numeric values smaller or equal to the
         * number of communities available from the geo-location filter
         */
        setInputFilter(communsInput, function (value) {
          return /^\d*$/.test(value) && (value === '' || parseInt(value) <= numOfCommuns)
        })
      }
      if (villagesInput) {
        /**
         * Sets an input filter that only accepts numeric values smaller or equal to the
         * number of villages available from the geo-location filter
         */
        setInputFilter(villagesInput, function (value) {
          return /^\d*$/.test(value) && (value === '' || parseInt(value) <= numOfVillages)
        })
      }
      if (animalsInput) {
        /**
         * Sets an input filter that only accepts numeric values larger than 0
         */
        setInputFilter(animalsInput, function (value) {
          return /^\d*$/.test(value)
        })
      }
      if (holdingsInput) {
        /**
         * Sets an input filter that only accepts numeric values larger than 0
         */
        setInputFilter(holdingsInput, function (value) {
          return /^\d*$/.test(value)
        })
      }
    }

    if (this.props.populationStatusHasBeenUpdated !== nextProps.populationStatusHasBeenUpdated) {
      this.getPopulationNumbers()
    }
  }

  displayPopupOnClick = () => {
    this.setState({ showPopup: true })
  }

  displayResultsPopupOnClick = () => {
    this.setState({ showResults: true })
  }

  closeModal = () => {
    this.setState({
      showPopup: false,
      regions: '',
      municipalities: '',
      communities: '',
      villages: '',
      holdings: '',
      animals: ''
    })
  }

  closeResultsModal = () => {
    this.setState({
      showResults: false,
      regions: '',
      municipalities: '',
      communities: '',
      villages: '',
      holdings: '',
      animals: ''
    })

    const { gridToDisplay } = this.state
    const { objectId } = this.props
    ComponentManager.cleanComponentReducerState(`${gridToDisplay}_${objectId}`)
  }

  close = () => {
    this.setState({
      alert: false,
      regions: '',
      municipalities: '',
      communities: '',
      villages: '',
      holdings: '',
      animals: ''
    })
  }

  closeAlert = () => {
    this.setState({ alert: false })
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  applyStratificationFilter = async () => {
    const { regions, municipalities, communities, villages, holdings, animals } = this.state
    if ((!regions && !municipalities && !communities && !villages) ||
      (!regions && !municipalities && !communities) ||
      (!regions && !municipalities && !villages) ||
      (!regions && !municipalities) || (!regions) || (!municipalities) ||
      (!communities) || (!villages)) {
      this.setState({
        alert: alertUser(
          true,
          'error',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.enter_all_area_unit_fields`,
            defaultMessage: `${config.labelBasePath}.main.enter_all_area_unit_fields`
          }),
          null,
          () => {
            this.closeAlert()
          }
        )
      })
    } else if (regions.startsWith('0') || municipalities.startsWith('0') || communities.startsWith('0') ||
      villages.startsWith('0') || holdings.startsWith('0') || animals.startsWith('0')) {
      this.setState({
        alert: alertUser(
          true,
          'error',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.entered_number_cannot_start_with_zero`,
            defaultMessage: `${config.labelBasePath}.main.entered_number_cannot_start_with_zero`
          }),
          null,
          () => {
            this.closeAlert()
          }
        )
      })
    } else {
      const server = config.svConfig.restSvcBaseUrl
      let verbPath = config.svConfig.triglavRestVerbs.APPLY_STRATIFICATION_FILTER
      let url = `${server}/${verbPath}`
      url = url.replace('%sessionId', this.props.svSession)
      url = url.replace('%populationId', this.props.objectId)
      let paramsArray = [{
        ...regions && { NUM_REGIONS: parseInt(regions) },
        ...municipalities && { NUM_MUNICS: parseInt(municipalities) },
        ...communities && { NUM_COMMUNS: parseInt(communities) },
        ...villages && { NUM_VILLAGES: parseInt(villages) },
        ...holdings && { NUM_HOLDINGS: parseInt(holdings) },
        ...animals && { NUM_ANIMALS: parseInt(animals) }
      }]

      try {
        const res = await axios({
          method: 'post',
          url,
          data: JSON.stringify({ paramsArray })
        })
        const responseType = formatAlertType(res.data)
        this.setState({
          alert: alertUser(
            true,
            responseType,
            this.context.intl.formatMessage({
              id: res.data,
              defaultMessage: res.data
            }),
            null,
            () => {
              this.close()
              this.closeModal()
              store.dispatch({ type: 'STRAT_FILTER_HAS_BEEN_APPLIED' })
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
              this.close()
              this.closeModal()
            }
          )
        })
      }
    }
  }

  render () {
    const currentPopulationStatus = this.props.componentStack[0].row['POPULATION.STATUS']
    const currentPopulationExtractionType = this.props.componentStack[0].row['POPULATION.EXTRACTION_TYPE']
    const { numOfRegions, numOfMunics, numOfCommuns, numOfVillages } = this.state
    const searchPopup = <div id='search_modal' className='modal to-front' style={{ display: 'flex' }}>
      <div
        id='search_modal_content'
        className='modal-content'
        style={{ width: '45%', height: '65%', marginLeft: '30%', marginTop: '10rem' }}
      >
        <div className='modal-header' />
        <div
          id='search_modal_body'
          className='modal-body'
          style={{ color: 'white', paddingLeft: '5rem', paddingRight: '5rem', paddingTop: '5rem' }}
        >
          <div id='stratificationForm'>
            <h3
              id='areaHeading'
              style={{ textAlign: 'center', color: '#EAF4F4', marginBottom: '1rem' }}
            >
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.enter_number_area_units`,
                defaultMessage: `${config.labelBasePath}.main.enter_number_area_units`
              })}
            </h3>
            <h4
              id='secondAreaHeading'
              style={{ textAlign: 'center', color: '#EAF4F4', marginBottom: '2rem' }}
            >
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.available_area_units_strat_filter`,
                defaultMessage: `${config.labelBasePath}.main.available_area_units_strat_filter`
              })}
            </h4>
            <p
              style={{
                textAlign: 'center',
                fontSize: 'large',
                fontWeight: 'bold',
                marginTop: '1rem'
              }}
            >
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.population_all_fields_mandatory`,
                defaultMessage: `${config.labelBasePath}.main.population_all_fields_mandatory`
              })}!
            </p>
            <div style={{ display: 'inline-flex', marginLeft: '4rem' }}>
              <div className='form-group' style={{ display: 'inline-grid', marginRight: '4rem' }}>
                <label htmlFor='regions' style={{ textAlign: 'center' }}>
                  {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.cnt.region`,
                    defaultMessage: `${config.labelBasePath}.cnt.region`
                  })}
                </label>
                <p style={{ textAlign: 'center' }}>(Max. {numOfRegions})</p>
                <input
                  id='regions'
                  type='text'
                  name='regions'
                  onChange={this.onChange}
                  className='form-control'
                  style={{ width: '10rem', float: 'left' }}
                />
              </div>
              <div className='form-group' style={{ display: 'inline-grid', marginRight: '4rem' }}>
                <label htmlFor='municipalities' style={{ textAlign: 'center' }}>
                  {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.cnt.munic`,
                    defaultMessage: `${config.labelBasePath}.cnt.munic`
                  })}
                </label>
                <p style={{ textAlign: 'center' }}>(Max. {numOfMunics})</p>
                <input
                  id='municipalities'
                  type='text'
                  name='municipalities'
                  onChange={this.onChange}
                  className='form-control'
                  style={{ width: '10rem', float: 'left' }}
                />
              </div>
              <div className='form-group' style={{ display: 'inline-grid', marginRight: '4rem' }}>
                <label htmlFor='communities' style={{ textAlign: 'center' }}>
                  {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.cnt.commun`,
                    defaultMessage: `${config.labelBasePath}.cnt.commun`
                  })}
                </label>
                <p style={{ textAlign: 'center' }}>(Max. {numOfCommuns})</p>
                <input
                  id='communities'
                  type='text'
                  name='communities'
                  onChange={this.onChange}
                  className='form-control'
                  style={{ width: '10rem', float: 'left' }}
                />
              </div>
              <div className='form-group' style={{ display: 'inline-grid', marginRight: '4rem' }}>
                <label htmlFor='villages' style={{ textAlign: 'center' }}>
                  {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.cnt.village`,
                    defaultMessage: `${config.labelBasePath}.cnt.village`
                  })}
                </label>
                <p style={{ textAlign: 'center' }}>(Max. {numOfVillages})</p>
                <input
                  id='villages'
                  type='text'
                  name='villages'
                  onChange={this.onChange}
                  className='form-control'
                  style={{ width: '10rem', float: 'left' }}
                />
              </div>
            </div>
            <hr style={{ marginBottom: '25px' }} />
            <h3
              id='holdingsAndAnimalsHeading'
              style={{ textAlign: 'center', color: '#EAF4F4', marginBottom: '1rem' }}
            >
              {currentPopulationExtractionType === 'ANIMAL'
                ? this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.enter_number_of_holdings_and_animals`,
                  defaultMessage: `${config.labelBasePath}.main.enter_number_of_holdings_and_animals`
                })
                : this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.enter_number_of_holdings`,
                  defaultMessage: `${config.labelBasePath}.main.enter_number_of_holdings`
                })
              }
            </h3>
            <div style={{ display: 'inline-flex', marginLeft: '18rem' }}>
              <div
                className='form-group'
                style={{
                  display: 'inline-grid',
                  marginRight: '4rem',
                  marginLeft: currentPopulationExtractionType === 'HOLDING' ? '85px' : null
                }}
              >
                <label htmlFor='holdings' style={{ textAlign: 'center' }}>
                  {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.cnt.holding`,
                    defaultMessage: `${config.labelBasePath}.cnt.holding`
                  })}
                </label>
                <input
                  id='holdings'
                  type='text'
                  name='holdings'
                  onChange={this.onChange}
                  className='form-control'
                  style={{ width: '10rem', float: 'left' }}
                />
              </div>
              {currentPopulationExtractionType === 'ANIMAL' &&
                <div
                  className='form-group'
                  style={{
                    display: 'inline-grid',
                    marginRight: '4rem',
                    marginLeft: '5px'
                  }}
                >
                  <label htmlFor='animals' style={{ textAlign: 'center' }}>
                    {this.context.intl.formatMessage({
                      id: `${config.labelBasePath}.main.animal.general`,
                      defaultMessage: `${config.labelBasePath}.main.animal.general`
                    })}:
                  </label>
                  <input
                    id='animals'
                    type='text'
                    name='animals'
                    onChange={this.onChange}
                    className='form-control'
                    style={{ width: '10rem', float: 'left' }}
                  />
                </div>
              }
            </div>
            <hr />
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button
                id='applyStratification'
                className='btn btn-success'
                style={{ marginRight: '1.3rem' }}
                onClick={this.applyStratificationFilter}
              >
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.apply_strat_filter`,
                  defaultMessage: `${config.labelBasePath}.main.apply_strat_filter`
                })}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div id='modal_close_btn' type='button' className='js-components-AppComponents-Functional-GridInModalLinkObjects-module-close'
        style={{
          position: 'absolute',
          right: 'calc(24.5% - 9px)',
          top: '165px',
          width: '32px',
          height: '32px',
          opacity: '1'
        }}
        onClick={() => this.closeModal()} data-dismiss='search_modal' />
    </div>

    const gridConfig = menuConfig('GRID_CONFIG', this.context.intl)
    const appliedStratFilters = <div id='search_modal' className='modal to-front' style={{ display: 'flex' }}>
      <div id='search_modal_content' className='modal-content'>
        <div className='modal-header' />
        <div id='search_modal_body' className='modal-body'>
          <ResultsGrid
            key={`${this.state.gridToDisplay}_${this.props.objectId}`}
            id={`${this.state.gridToDisplay}_${this.props.objectId}`}
            gridToDisplay={this.state.gridToDisplay}
            gridConfig={gridConfig}
            onRowSelectProp={() => { }}
            customGridDataWS='GET_APPLIED_STRAT_FILTERS'
            parentId={this.props.objectId}
          />
        </div>
      </div>
      <div id='modal_close_btn' type='button' className='js-components-AppComponents-Functional-GridInModalLinkObjects-module-close'
        style={{
          position: 'absolute',
          right: 'calc(11% - 9px)',
          top: '44px',
          width: '32px',
          height: '32px',
          opacity: '1'
        }}
        onClick={() => this.closeResultsModal()} data-dismiss='modal' />
    </div>

    return (
      <React.Fragment>
        <button
          id='reRenderBtnFive'
          style={{ display: 'none' }}
          onClick={() => {
            document.getElementById('reRenderFinalFive') && document.getElementById('reRenderFinalFive').click()
          }}
        />
        <button
          id='reRenderFinalFive'
          style={{ display: 'none' }}
          onClick={() => this.setState({ reRender: 'reRenderFinalFive' })}
        />
        <div
          style={{
            width: '180px',
            cursor: currentPopulationStatus === 'VALID' || currentPopulationStatus === 'DRAFT' ? 'none' : 'pointer',
            pointerEvents: currentPopulationStatus === 'VALID' || currentPopulationStatus === 'DRAFT' ? 'none' : null,
            backgroundColor: currentPopulationStatus === 'VALID' || currentPopulationStatus === 'DRAFT' ? '#333333' : 'rgba(36, 19, 8, 0.9)',
            boxShadow: currentPopulationStatus === 'VALID' || currentPopulationStatus === 'DRAFT' ? '1px 1px 10px #090E06' : '1px 1px 10px rgb(36, 19, 8)',
            color: currentPopulationStatus === 'VALID' || currentPopulationStatus === 'DRAFT' ? '#66717E' : '#FFFFFF'
          }}
          id='stratification_filter_container'
          className={styles.container}
        >
          <p style={{ marginLeft: '15px', width: '80px' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.actions.stratify_population`,
              defaultMessage: `${config.labelBasePath}.actions.stratify_population`
            })}
          </p>
          <div id='stratification_filter' style={{ marginLeft: '10px' }} className={styles['gauge-container']}>
            <svg
              viewBox='0 0 320.281 320.281'
              style={{ fill: currentPopulationStatus === 'VALID' || currentPopulationStatus === 'DRAFT' ? '#66717E' : '#FFFFFF' }}
              className={styles.svgUtil}
            >
              <g>
                <path d='M260.727,115.941l-97.891,53.473V57.89c0-4.971-4.029-9-9-9c-74.823,0-135.695,60.873-135.695,135.695
                s60.873,135.696,135.695,135.696s135.696-60.873,135.696-135.696c0-22.735-5.739-45.234-16.596-65.067
                C270.551,115.161,265.087,113.561,260.727,115.941z M153.836,302.281c-64.897,0-117.695-52.798-117.695-117.696
                c0-61.871,47.984-112.745,108.695-117.354v117.354c0,3.177,1.675,6.119,4.408,7.741c2.733,1.622,6.119,1.682,8.906,0.158
                l103.007-56.267c6.807,15.117,10.375,31.667,10.375,48.369C271.531,249.482,218.733,302.281,153.836,302.281z' />
                <path d='M301.035,70.59c-23.221-42.42-67.63-69.468-115.896-70.588c-4.974-0.1-9.089,3.817-9.207,8.785l-2.995,126.658
                c-0.076,3.215,1.569,6.226,4.314,7.898c1.436,0.875,3.058,1.314,4.684,1.314c1.482,0,2.968-0.366,4.314-1.102L297.455,82.81
                c2.096-1.145,3.651-3.076,4.322-5.368C302.449,75.15,302.182,72.685,301.035,70.59z M191.3,120.286l2.406-101.733
                c35.355,3.565,67.468,23.126,86.91,52.944L191.3,120.286z' />
              </g><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g />
            </svg>
            <div className={styles['dropdown-content']} style={{ right: '-20px', minWidth: '180px' }}>
              <div key='apply_strat_filter' id='apply_strat_filter'>
                {
                  this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.main.apply_strat_filter`,
                    defaultMessage: `${config.labelBasePath}.main.apply_strat_filter`
                  })
                }
              </div>
              <div key='applied_strat_filter' id='applied_strat_filter'>
                {
                  this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.main.applied_strat_filters`,
                    defaultMessage: `${config.labelBasePath}.main.applied_strat_filters`
                  })
                }
              </div>
            </div>
          </div>
        </div>
        {this.state.showPopup &&
          ReactDOM.createPortal(searchPopup, document.getElementById('app'))
        }
        {this.state.showResults &&
          ReactDOM.createPortal(appliedStratFilters, document.getElementById('app'))
        }
      </React.Fragment>
    )
  }
}

ApplyStratificationFilter.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  populationStatusHasBeenUpdated: state.updatePopulationStatus.populationStatusHasBeenUpdated
})

export default connect(mapStateToProps)(ApplyStratificationFilter)
