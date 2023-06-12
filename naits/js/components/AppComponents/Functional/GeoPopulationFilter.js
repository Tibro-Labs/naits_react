import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import { store } from 'tibro-redux'
import { alertUser, DependencyDropdowns } from 'tibro-components'
import { GridManager } from 'components/ComponentsIndex'
import * as config from 'config/config.js'
import { formatAlertType } from 'functions/utils'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'

class GeoPopulationFilter extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: null,
      showSearchPopup: false,
      reRender: ''
    }

    this.displayPopupOnClick = this.displayPopupOnClick.bind(this)
  }

  componentDidMount () {
    // Attach click event listener
    this.attachClickEventListener()
  }

  componentDidUpdate (nextProps) {
    if (this.props.linkedPopulationToArea !== nextProps.linkedPopulationToArea) {
      GridManager.reloadGridData(`AREA_${nextProps.objectId}_AREA_POPULATION`)
    }
  }

  attachClickEventListener = () => {
    const geoFilterButton = document.getElementById('add_geo_filter_container')
    if (geoFilterButton) {
      geoFilterButton.onclick = this.displayPopupOnClick
    }
  }

  addGeoFilter = async (location) => {
    if (location) {
      const server = config.svConfig.restSvcBaseUrl
      let verbPath = config.svConfig.triglavRestVerbs.LINK_POPULATION_TO_AREA
      let url = `${server}/${verbPath}`
      url = url.replace('%sessionId', this.props.svSession)
      url = url.replace('%objectId', this.props.objectId)
      url = url.replace('%geostatCode', location)

      try {
        const res = await axios.get(url)
        if (res.data.includes('error')) {
          store.dispatch({ type: 'LINK_POPULATION_WITH_AREA_REJECTED', payload: res.data })
        } else if (res.data.includes('success')) {
          store.dispatch({ type: 'LINK_POPULATION_WITH_AREA_FULFILLED', payload: res.data })
        }
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
              store.dispatch({ type: 'LINK_POPULATION_WITH_AREA_RESET' })
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
              store.dispatch({ type: 'LINK_POPULATION_WITH_AREA_RESET' })
            }
          )
        })
      }
    }
  }

  chooseItem = () => {
    let location = null
    let regionElement = null
    let municipalityElement = null
    let communityElement = null
    let villageElement = null
    let region = null
    let municipality = null
    let community = null
    let village = null

    regionElement = document.getElementById('root_holding.location.info_REGION_CODE')
    region = regionElement.options[regionElement.selectedIndex].value
    municipalityElement = document.getElementById('root_holding.location.info_MUNIC_CODE')
    if (!municipalityElement) {
      municipality = null
    } else {
      municipality = municipalityElement.options[municipalityElement.selectedIndex].value
    }
    communityElement = document.getElementById('root_holding.location.info_COMMUN_CODE')
    if (!communityElement) {
      community = null
    } else {
      community = communityElement.options[communityElement.selectedIndex].value
    }
    villageElement = document.getElementById('root_holding.location.info_VILLAGE_CODE')
    if (!villageElement) {
      village = null
    } else {
      village = villageElement.options[villageElement.selectedIndex].value
    }
    location = village || community || municipality || region

    if (location) {
      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.confirm_area_population_link`,
            defaultMessage: `${config.labelBasePath}.alert.confirm_area_population_link`
          }),
          null,
          () => {
            this.addGeoFilter(location)
            this.closeModal()
            this.setState({ alert: alertUser(false, 'info', '') })
          },
          () => this.close(),
          true,
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.apply`,
            defaultMessage: `${config.labelBasePath}.actions.apply`
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
    } else {
      this.setState({
        alert: alertUser(true, 'error',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.no_region_selected_admconsole`,
            defaultMessage: `${config.labelBasePath}.alert.no_region_selected_admconsole`
          }),
          null,
          () => this.setState({ alert: alertUser(false, 'info', '') }))
      })
    }
  }

  displayPopupOnClick (e) {
    e.preventDefault()
    const currentPopulationStatus = this.props.componentStack[0].row['POPULATION.STATUS']
    if (currentPopulationStatus === 'FINAL') {
      this.setState({
        alert: alertUser(
          true,
          'error',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.error.cannotEditPopulationWithFinalStatus`,
            defaultMessage: `${config.labelBasePath}.error.cannotEditPopulationWithFinalStatus`
          }),
          null,
          () => {
            this.close()
          }
        )
      })
    } else {
      this.setState({ showSearchPopup: true })
    }
  }

  closeModal = () => {
    this.setState({ showSearchPopup: false })
  }

  close = () => {
    this.setState({ alert: false })
  }

  render () {
    const currentPopulationStatus = this.props.componentStack[0].row['POPULATION.STATUS']
    const searchPopup = <div id='search_modal' className='modal to-front' style={{ display: 'flex' }}>
      <div id='search_modal_content' className='modal-content' style={{ width: '80%' }}>
        <div className='modal-header' />
        <div id='search_modal_body' className='modal-body' style={{ color: 'white', padding: '10rem 30rem 10rem 30rem' }}>
          <DependencyDropdowns tableName='HOLDING' spread='down' />
          <button id='submit' className='btn btn-success' onClick={() => this.chooseItem()}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.link_location_and_population`,
              defaultMessage: `${config.labelBasePath}.main.link_location_and_population`
            })}
          </button>
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
        onClick={() => this.closeModal()} data-dismiss='search_modal' />
    </div>

    return (
      <React.Fragment>
        <button
          id='reRenderBtnFour'
          style={{ display: 'none' }}
          onClick={() => {
            document.getElementById('reRenderFinalFour') && document.getElementById('reRenderFinalFour').click()
          }}
        />
        <button
          id='reRenderFinalFour'
          style={{ display: 'none' }}
          onClick={() => this.setState({ reRender: 'reRenderFinalFour' })}
        />
        <div
          id='add_geo_filter_container'
          className={styles.container}
          style={{
            cursor: 'pointer',
            marginRight: '7px',
            pointerEvents: currentPopulationStatus === 'FINAL' ? 'none' : null,
            backgroundColor: currentPopulationStatus === 'FINAL' ? '#333333' : 'rgba(36, 19, 8, 0.9)',
            boxShadow: currentPopulationStatus === 'FINAL' ? '1px 1px 10px rgb(36, 19, 8)' : '1px 1px 10px #090E06',
            color: currentPopulationStatus === 'FINAL' ? '#66717E' : '#FFFFFF'
          }}
        >
          <p style={{ marginTop: '2px' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.add_geo_filter`,
              defaultMessage: `${config.labelBasePath}.main.add_geo_filter`
            })}
          </p>
          <div id='add_geo_filter' className={styles['gauge-container']}>
            <svg
              viewBox='0 0 512 512'
              style={{ fill: currentPopulationStatus === 'FINAL' ? '#66717E' : '#FFFFFF' }}
              className={styles.svgUtil}
            >
              <g>
                <g>
                  <path
                    d='M444.943,347.699c-4.394-3.522-10.815-2.815-14.337,1.582c-4.661,5.818-9.703,11.489-14.982,16.858
                    c-3.95,4.016-3.895,10.475,0.12,14.424c1.986,1.953,4.569,2.927,7.151,2.927c2.64,0,5.277-1.018,7.273-3.047
                    c5.761-5.859,11.265-12.052,16.356-18.406C450.047,357.64,449.339,351.222,444.943,347.699z'
                  />
                </g>
              </g>
              <g>
                <g>
                  <path
                    d='M404.879,390.097c-3.403-4.489-9.802-5.371-14.291-1.966c-38.569,29.235-85.309,46.179-135.164,49
                    c-5.624,0.318-9.925,5.135-9.607,10.759c0.307,5.428,4.804,9.624,10.174,9.624c0.194,0,0.389-0.005,0.585-0.017
                    c53.918-3.051,104.52-21.416,146.335-53.11C407.4,400.984,408.281,394.587,404.879,390.097z'
                  />
                </g>
              </g>
              <g>
                <g>
                  <path
                    d='M504.755,199.948c0-0.001,0-0.001-0.001-0.002c-5.817-22.133-15.065-43.336-27.491-63.023
                    c-17.666-27.99-40.935-51.967-69.158-71.266C363.825,35.381,311.228,19.378,256,19.378c-15.448,0-30.959,1.291-46.103,3.837
                    c-42.923,7.216-83.441,24.689-117.168,50.531c-49.576,37.985-81.659,91.227-90.339,149.919C0.804,234.386,0,245.264,0,256
                    c0,42.127,12.129,83.49,35.075,119.617c22.189,34.936,53.913,64.224,91.743,84.698c0.003,0.002,0.006,0.004,0.009,0.005
                    c21.464,11.616,44.583,20.243,68.715,25.645c19.732,4.417,40.074,6.656,60.458,6.656c49.509,0,97.548-13.086,138.924-37.842
                    c40.419-24.183,72.565-58.22,92.963-98.427C503.888,324.811,512,291.048,512,256C512,237.098,509.562,218.24,504.755,199.948z
                    M412.152,94.092c12.785,10.373,24.232,21.918,34.257,34.545l-20.162-4.63c-6.466-1.485-13.11,0.087-18.227,4.308
                    c-5.118,4.222-7.922,10.448-7.691,17.08c0.01,0.274-0.127,0.539-0.359,0.689l-14.81,9.673c-0.249,0.162-0.566,0.172-0.824,0.024
                    L363.474,143.9c-1.856-1.058-2.813-3.249-2.325-5.33l4.694-20.037c0.503-2.146,2.393-3.686,4.596-3.747l17.674-0.492
                    C399.968,113.964,409.836,105.307,412.152,94.092z M126.715,414.119l-2.982,20.807C59.64,394.883,20.398,327.546,20.398,256
                    c0-6.33,0.308-12.715,0.919-19.083l13.65,2.206c3.437,0.556,6.949,0.838,10.436,0.838h6.914c9.584,0,19.103,3.144,26.802,8.852
                    l10.476,7.766c0.896,0.664,1.48,1.682,1.599,2.792l1.42,13.137c0.229,2.125-1.244,4.055-3.355,4.393
                    c-11.911,1.905-20.745,12.437-20.55,24.497l0.746,46.244c0.085,5.254,1.814,10.239,5.002,14.415l16.623,21.78
                    c7.843,10.278,18.449,17.937,30.671,22.152C125.135,407.156,127.223,410.575,126.715,414.119z M192.423,464.242
                    c-17.254-4.427-33.891-10.659-49.622-18.587l4.105-28.639c1.895-13.213-5.889-25.96-18.506-30.311
                    c-8.41-2.9-15.708-8.172-21.105-15.244l-16.622-21.779c-0.524-0.686-0.808-1.506-0.822-2.369l-0.746-46.243
                    c-0.032-1.983,1.421-3.714,3.378-4.027c12.844-2.055,21.81-13.795,20.412-26.728l-1.42-13.138
                    c-0.729-6.75-4.276-12.941-9.731-16.985l-10.476-7.766c-11.19-8.295-25.023-12.864-38.951-12.864h-6.914
                    c-2.4,0-4.815-0.194-7.181-0.576l-13.932-2.252c9.889-49.492,38.323-94.217,80.844-126.797
                    c29.971-22.964,65.793-38.765,103.851-45.846c5.773,4.803,10.241,10.963,13.03,18.011l0.578,1.463
                    c1.448,3.659,2.412,7.497,2.863,11.407l0.514,4.45c0.913,7.915-0.298,15.955-3.5,23.25l-5.546,12.635
                    c-3.631,8.268-9.588,15.183-17.229,19.993l-6.91,4.351c-7.001,4.407-11.094,12.279-10.682,20.542l0.934,18.667
                    c0.047,0.953-0.396,1.586-0.776,1.95c-0.38,0.363-1.031,0.774-1.983,0.687c-0.841-0.08-1.582-0.572-1.983-1.316l-8.487-15.761
                    c-2.938-5.459-8.049-9.545-14.021-11.212l-29.996-8.372c-7.883-2.2-16.329-1.546-23.779,1.84l-7.143,3.247
                    c-15.028,6.831-23.241,23.464-19.529,39.547c1.469,6.369,4.69,12.18,9.311,16.801l19.489,19.49
                    c1.099,1.097,2.152,2.268,3.133,3.478l13.361,16.479c5.9,7.277,14.647,11.446,24.013,11.445c0.032,0,0.063,0,0.095,0l36.401-0.111
                    c0.011,0,0.021,0,0.033,0c3.726,0,7.205,1.997,9.083,5.218c4.37,7.493,11.742,12.834,20.226,14.652l13.639,2.922
                    c2.999,0.643,5.561,2.555,7.029,5.248l6.587,12.076c2.641,4.842,6.636,8.722,11.553,11.221l30.957,15.731
                    c2.546,1.294,4.017,4.066,3.664,6.9c-0.205,1.642-1,3.15-2.24,4.246l-11.759,10.402c-3.315,2.932-5.889,6.673-7.444,10.818
                    l-2.564,6.836c-0.78,2.083-2.406,3.766-4.462,4.618l-12.525,5.193c-10.668,4.423-17.563,14.745-17.563,26.295
                    c0,1.298-0.319,2.594-0.922,3.745L192.423,464.242z M256,472.223c-14.387,0-28.747-1.203-42.851-3.584l29.352-55.996
                    c2.129-4.06,3.255-8.631,3.255-13.216c0-3.273,1.954-6.199,4.977-7.453l12.526-5.193c7.254-3.009,12.994-8.95,15.749-16.299
                    l2.563-6.832c0.389-1.036,1.032-1.971,1.86-2.704l11.759-10.402c4.96-4.388,8.143-10.424,8.965-16.993
                    c1.419-11.339-4.473-22.437-14.662-27.616l-30.958-15.731c-1.228-0.624-2.227-1.594-2.886-2.804l-6.587-12.076
                    c-4.316-7.915-11.848-13.536-20.663-15.426l-13.638-2.922c-2.886-0.618-5.394-2.436-6.881-4.984
                    c-5.523-9.467-15.749-15.338-26.704-15.338c-0.032,0-0.063,0-0.095,0l-36.4,0.111c-0.011,0-0.021,0-0.033,0
                    c-3.186,0-6.162-1.418-8.169-3.893l-13.362-16.479c-1.426-1.759-2.959-3.461-4.555-5.056l-19.488-19.488
                    c-1.915-1.914-3.249-4.322-3.858-6.962c-1.538-6.667,1.866-13.561,8.094-16.392l7.143-3.247c3.089-1.403,6.589-1.675,9.857-0.763
                    l29.996,8.372c0.657,0.184,1.219,0.633,1.543,1.234l8.488,15.762c3.638,6.756,10.37,11.223,18.009,11.951
                    c6.629,0.633,13.197-1.646,18.013-6.249c4.816-4.603,7.386-11.06,7.054-17.714l-0.934-18.667c-0.045-0.91,0.405-1.776,1.176-2.261
                    l6.91-4.351c11.105-6.992,19.763-17.039,25.039-29.055l5.546-12.635c4.654-10.602,6.413-22.285,5.086-33.789l-0.514-4.45
                    c-0.655-5.68-2.055-11.257-4.16-16.575l-0.579-1.464c-1.955-4.938-4.486-9.571-7.515-13.834h0.013
                    c7.483-0.654,15.01-0.983,22.52-0.983c49.28,0,96.25,13.738,136.193,39.782l0.076,9.449c0.021,2.626-2.098,4.822-4.723,4.896
                    l-17.673,0.492c-11.454,0.318-21.278,8.332-23.89,19.487l-4.694,20.035c-2.534,10.816,2.438,22.211,12.09,27.708l20.861,11.881
                    c3.274,1.864,6.887,2.792,10.492,2.792c4.031,0,8.053-1.16,11.581-3.463l14.81-9.673c6.172-4.03,9.846-11.11,9.59-18.475
                    c-0.004-0.106-0.014-0.391,0.287-0.638c0.304-0.249,0.578-0.183,0.68-0.161l22.874,5.253c0.568,0.131,1.149,0.239,1.733,0.322
                    l16.17,2.321c7.032,11.706,12.847,23.961,17.384,36.627l-15.799-3.819c-0.63-0.152-1.274-0.283-1.915-0.386l-17.252-2.782
                    c-18.733-3.021-37.783,3.341-50.941,17.026l-2.596,2.7c-7.696,8.004-12.903,17.992-15.059,28.884l-6.578,33.245
                    c-2.294,11.589-1.02,23.443,3.683,34.281c8.211,18.921,26.041,32.128,46.531,34.466l3.196,0.365
                    c8.762,1.002,17.784-0.043,26.085-3.017l10.879-3.897c1.938-0.695,4.115-0.086,5.416,1.52l1.428,1.763
                    c0.667,0.824,1.05,1.86,1.082,2.917l0.516,17.729C429.455,424.098,346.343,472.223,256,472.223z M482.538,315.632l-1.189-1.47
                    c-4.887-6.037-12.171-9.364-19.652-9.364c-2.844,0-5.717,0.481-8.497,1.477l-10.879,3.896c-5.377,1.927-11.222,2.603-16.893,1.954
                    l-3.195-0.365c-13.27-1.515-24.817-10.068-30.134-22.32c-3.047-7.018-3.872-14.695-2.387-22.2l6.578-33.245
                    c1.396-7.054,4.768-13.522,9.753-18.705l2.596-2.7c8.521-8.861,20.856-12.983,32.99-11.025l17.25,2.782
                    c0.122,0.02,0.245,0.044,0.368,0.074l27.225,6.579c3.406,14.75,5.129,29.859,5.129,44.999
                    C491.602,276.427,488.563,296.38,482.538,315.632z'
                  />
                </g>
              </g><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g />
            </svg>
          </div>
          {this.state.showSearchPopup &&
            ReactDOM.createPortal(searchPopup, document.getElementById('app'))
          }
        </div>
      </React.Fragment>
    )
  }
}

GeoPopulationFilter.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  linkedPopulationToArea: state.linkedObjects.linkedPopulationToArea
})

export default connect(mapStateToProps)(GeoPopulationFilter)
