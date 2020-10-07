import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import axios from 'axios'
import { connect } from 'react-redux'
import { store } from 'tibro-redux'
import { alertUser } from 'tibro-components'
import { ComponentManager, ResultsGrid } from 'components/ComponentsIndex'
import * as config from 'config/config.js'
import { menuConfig } from 'config/menuConfig'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'

class StratifyPopulation extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: null,
      reRender: '',
      gridToDisplay: 'STRAT_FILTER',
      appliedFilters: null,
      showAppliedFilters: false
    }
  }

  componentDidMount () {
    // Get all the applied stratification filters, if any exist
    this.getAppliedStratFilters()
    // Attach click event listener
    this.attachClickEventListener()
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.populationFilterHasBeenApplied !== nextProps.populationFilterHasBeenApplied) {
      this.getAppliedStratFilters()
      store.dispatch({ type: 'STRAT_FILTER_RESET' })
    }
  }

  attachClickEventListener = () => {
    const selectAppliedStratFiltersBtn = document.getElementById('select_applied_strat_filter')
    if (selectAppliedStratFiltersBtn) {
      selectAppliedStratFiltersBtn.onclick = this.displayAppliedStratFilters
    }
  }

  getAppliedStratFilters = async () => {
    const server = config.svConfig.restSvcBaseUrl
    let verbPath = config.svConfig.triglavRestVerbs.GET_APPLIED_STRAT_FILTERS
    let url = `${server}${verbPath}`
    url = url.replace('%session', this.props.svSession)
    url = url.replace('%parentId', this.props.objectId)

    try {
      const res = await axios.get(url)
      this.setState({ appliedFilters: res.data.length })
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

  stratifyPopulation = (populationObjId) => {
    const currentPopulationId = this.props.componentStack[0].row['POPULATION.POPULATION_ID']
    let url = config.svConfig.triglavRestVerbs.STRATIFY_POPULATION
    url = url.replace('%sessionId', this.props.svSession)
    url = url.replace('%populationId', this.props.objectId)
    url = url.replace('%fileSuffix', currentPopulationId)
    url = url.replace('%populationObjId', populationObjId)
    window.open(`${config.svConfig.restSvcBaseUrl}/${url}`, '_blank')
  }

  displayAppliedStratFilters = () => {
    if (this.state.appliedFilters === 0) {
      this.setState({
        alert: alertUser(
          true,
          'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.strat_filter_not_applied`,
            defaultMessage: `${config.labelBasePath}.main.strat_filter_not_applied`
          }),
          null,
          () => {
            this.close()
          }
        )
      })
    } else {
      this.setState({ showAppliedFilters: true })
    }
  }

  handleFilterSelection = () => {
    const { gridToDisplay } = this.state
    const populationObjId = store.getState()[`${gridToDisplay}_${this.props.objectId}`].rowClicked[`${gridToDisplay}.OBJECT_ID`]
    if (populationObjId) {
      this.setState({
        alert: alertUser(
          true,
          'info',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.generate_stratified_sample`,
            defaultMessage: `${config.labelBasePath}.actions.generate_stratified_sample`
          }),
          null,
          () => {
            this.stratifyPopulation(populationObjId)
            this.closeModal()
          },
          () => {
            this.close()
          },
          true,
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.generate`,
            defaultMessage: `${config.labelBasePath}.main.generate`
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

  close = () => {
    this.setState({ alert: false })
  }

  closeModal = () => {
    this.setState({ showAppliedFilters: false })
    const { gridToDisplay } = this.state
    const { objectId } = this.props
    ComponentManager.cleanComponentReducerState(`${gridToDisplay}_${objectId}`)
  }

  render () {
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
            onRowSelectProp={() => this.handleFilterSelection()}
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
        onClick={() => this.closeModal()} data-dismiss='modal' />
    </div>

    const currentPopulationStatus = this.props.componentStack[0].row['POPULATION.STATUS']
    return (
      <React.Fragment>
        <button
          id='reRenderBtnSix'
          style={{ display: 'none' }}
          onClick={() => {
            document.getElementById('reRenderFinalSix') && document.getElementById('reRenderFinalSix').click()
          }}
        />
        <button
          id='reRenderFinalSix'
          style={{ display: 'none' }}
          onClick={() => this.setState({ reRender: 'reRenderFinalSix' })}
        />
        <div
          style={{
            width: '155px',
            cursor: 'pointer',
            marginRight: '7px',
            pointerEvents: currentPopulationStatus !== 'FINAL' ? 'none' : null,
            backgroundColor: currentPopulationStatus !== 'FINAL' ? '#333333' : 'rgba(36, 19, 8, 0.9)',
            boxShadow: currentPopulationStatus !== 'FINAL' ? '1px 1px 10px rgb(36, 19, 8)' : '1px 1px 10px #090E06',
            color: currentPopulationStatus !== 'FINAL' ? '#66717E' : '#FFFFFF'
          }}
          id='stratify_population_container'
          className={styles.container}
        >
          <p>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.stratify_population`,
              defaultMessage: `${config.labelBasePath}.main.stratify_population`
            })}
          </p>
          <div
            id='stratify_population'
            className={styles['gauge-container']}
            style={{ marginLeft: '4px' }}
          >
            <svg
              viewBox='0 0 484.032 484.032'
              style={{ fill: currentPopulationStatus === 'VALID' || currentPopulationStatus === 'DRAFT' ? '#66717E' : '#FFFFFF' }}
              className={styles.svgUtil}
            >
              <g>
                <path d='M200.811,400.709v-45.331h59.7l-10.999-14.32h-48.701v-47.004h107.376v26.268l13.479,5.328V177.303
                c0-1.872,0.352-3.653,0.831-5.368v-9.823h6.402c3.437-2.867,7.811-4.662,12.63-4.662h58.486c4.818,0,9.192,1.795,12.629,4.662
                h20.009v53.686h-12.78v14.317h12.78v49.629h-12.78v14.313h12.78v26.547l14.315-5.659V32.873c0-9.207-7.491-16.698-16.693-16.698
                H16.698C7.485,16.175,0,23.672,0,32.873v365.862c0,5.65,2.84,10.636,7.154,13.661v2.633h5.989c1.149,0.253,2.331,0.398,3.554,0.398
                h289.986l-11.322-14.719H200.811z M322.503,30.484h107.76c1.315,0,2.391,1.072,2.391,2.389v48.12h-110.15V30.484z M322.503,95.306
                h110.15v52.493h-110.15V95.306z M200.811,30.484h107.376v50.509H200.811V30.484z M200.811,95.306h107.376v52.493H200.811V95.306z
                M200.811,162.113h107.376v53.686H200.811V162.113z M200.811,230.116h107.376v49.629H200.811V230.116z M66.006,400.709H15.458
                c-0.673-0.416-1.149-1.133-1.149-1.987v-43.344h51.697V400.709z M66.006,341.058H14.309v-47.004h51.697V341.058z M66.006,279.745
                H14.309v-49.629h51.697V279.745z M66.006,215.799H14.309v-53.686h51.697V215.799z M66.006,147.799H14.309V95.306h51.697V147.799z
                M186.494,400.709H80.319v-45.331h106.175V400.709z M186.494,341.058H80.319v-47.004h106.175V341.058z M186.494,279.745H80.319
                v-49.629h106.175V279.745z M186.494,215.799H80.319v-53.686h106.175V215.799z M186.494,147.799H80.319V95.306h106.175V147.799z
                M186.494,80.988H80.319v-50.51h106.175V80.988z M482.817,322.224l-110.2,143.355c-1.116,1.434-2.831,2.278-4.646,2.278
                c-1.813,0-3.535-0.845-4.643-2.278l-110.2-143.355c-0.813-1.051-1.22-2.309-1.22-3.568c0-1.242,0.394-2.471,1.178-3.522
                c1.568-2.091,4.383-2.885,6.816-1.917l72.969,28.832V173.101c0-3.234,2.621-5.844,5.855-5.844h58.486
                c3.227,0,5.85,2.618,5.85,5.844v168.942l72.969-28.832c2.452-0.968,5.24-0.179,6.822,1.922
                C484.438,317.233,484.425,320.134,482.817,322.224z'
                />
              </g><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g />
            </svg>
            <div className={styles['dropdown-content']} style={{ right: '-19px', minWidth: '155px' }}>
              <div key='select_applied_strat_filter' id='select_applied_strat_filter'>
                {
                  this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.main.select_one_strat_filter`,
                    defaultMessage: `${config.labelBasePath}.main.select_one_strat_filter`
                  })
                }
              </div>
            </div>
          </div>
        </div>
        {this.state.showAppliedFilters &&
          ReactDOM.createPortal(appliedStratFilters, document.getElementById('app'))
        }
      </React.Fragment>
    )
  }
}

StratifyPopulation.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  populationFilterHasBeenApplied: state.populationStratification.populationFilterHasBeenApplied
})

export default connect(mapStateToProps)(StratifyPopulation)
