import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { store } from 'tibro-redux'
import { alertUser } from 'tibro-components'
import * as config from 'config/config.js'
import { formatAlertType } from 'functions/utils'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'

class UpdatePopulationStatus extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: null,
      reRender: ''
    }
  }

  updatePopulationStatus = async () => {
    const session = this.props.svSession
    const verbPath = config.svConfig.triglavRestVerbs.MASS_OBJECT_HANDLER
    const url = `${config.svConfig.restSvcBaseUrl}${verbPath}/${session}`

    const objectArray = Array(this.props.componentStack[0].row)
    const actionName = 'UPDATE_STATUS'
    const subAction = 'FINAL'
    let paramsArray = [{
      MASS_PARAM_TBL_NAME: this.props.gridType,
      MASS_PARAM_ACTION: actionName,
      MASS_PARAM_SUBACTION: subAction
    }]

    if (objectArray) {
      try {
        const res = await axios({
          method: 'post',
          url: url,
          data: JSON.stringify({ objectArray, paramsArray })
        })
        if (res.data.includes('error')) {
          store.dispatch({ type: 'UPDATE_POPULATION_STATUS_REJECTED', payload: res.data })
        } else if (res.data.includes('success')) {
          store.dispatch({ type: 'UPDATE_POPULATION_STATUS_FULFILLED', payload: res.data })
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
              store.dispatch({ type: 'UPDATE_POPULATION_STATUS_RESET' })
              document.getElementById('reRenderBtnTwo') && document.getElementById('reRenderBtnTwo').click()
              document.getElementById('reRenderBtnThree') && document.getElementById('reRenderBtnThree').click()
              document.getElementById('reRenderBtnFour') && document.getElementById('reRenderBtnFour').click()
              document.getElementById('reRenderBtnFive') && document.getElementById('reRenderBtnFive').click()
              document.getElementById('reRenderBtnSix') && document.getElementById('reRenderBtnSix').click()
              setTimeout(() => {
                document.getElementById('reRenderBtnThree') && document.getElementById('reRenderBtnThree').click()
              }, 1000)
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
              this.setState({ alert: false })
            }
          )
        })
      }
    }
  }

  showAlert = () => {
    const currentPopulationStatus = this.props.componentStack[0].row['POPULATION.STATUS']
    if (currentPopulationStatus === 'FINAL') {
      this.setState({
        alert: alertUser(
          true,
          'error',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.error.populationAlreadyFinalized`,
            defaultMessage: `${config.labelBasePath}.error.populationAlreadyFinalized`
          }),
          null,
          () => {
            this.close()
          }
        )
      })
    } else if (currentPopulationStatus === 'VALID') {
      this.setState({
        alert: alertUser(
          true,
          'error',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.error.invalidStatusOfPopulation`,
            defaultMessage: `${config.labelBasePath}.error.invalidStatusOfPopulation`
          }),
          null,
          () => {
            this.close()
          }
        )
      })
    } else if (currentPopulationStatus === 'DRAFT') {
      this.setState({
        alert: alertUser(
          true,
          'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.update_population_status`,
            defaultMessage: `${config.labelBasePath}.actions.update_population_status`
          }),
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.update_population_status_desc`,
            defaultMessage: `${config.labelBasePath}.actions.update_population_status_desc`
          }),
          () => {
            this.updatePopulationStatus()
          },
          () => {
            this.close()
          },
          true,
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.change`,
            defaultMessage: `${config.labelBasePath}.actions.change`
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

  render () {
    const currentPopulationStatus = this.props.componentStack[0].row['POPULATION.STATUS']
    return (
      <React.Fragment>
        <button
          id='reRenderBtnThree'
          style={{ display: 'none' }}
          onClick={() => {
            document.getElementById('reRenderFinalThree') && document.getElementById('reRenderFinalThree').click()
          }}
        />
        <button
          id='reRenderFinalThree'
          style={{ display: 'none' }}
          onClick={() => this.setState({ reRender: 'reRenderFinalThree' })}
        />
        <div
          id='update_population_status_container'
          className={styles.container}
          style={{
            cursor: 'pointer',
            marginRight: '7px',
            pointerEvents: currentPopulationStatus === 'FINAL' || currentPopulationStatus === 'VALID' ? 'none' : null,
            backgroundColor: currentPopulationStatus === 'FINAL' || currentPopulationStatus === 'VALID' ? '#333333' : 'rgba(36, 19, 8, 0.9)',
            boxShadow: currentPopulationStatus === 'FINAL' || currentPopulationStatus === 'VALID' ? '1px 1px 10px rgb(36, 19, 8)' : '1px 1px 10px #090E06',
            color: currentPopulationStatus === 'FINAL' || currentPopulationStatus === 'VALID' ? '#66717E' : '#FFFFFF'
          }}
          onClick={this.showAlert}
        >
          <p>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.update_population_status`,
              defaultMessage: `${config.labelBasePath}.main.update_population_status`
            })}
          </p>
          <div id='update_population_status' className={styles['gauge-container']}>
            <svg
              viewBox='0 0 490.001 490.001'
              style={{ fill: currentPopulationStatus === 'FINAL' || currentPopulationStatus === 'VALID' ? '#66717E' : '#FFFFFF' }}
              className={styles.svgUtil}
            >
              <g>
                <g>
                  <path
                    d='M439.823,231.55c-12.7-7.6-23,0-27.1,5.2c-42.8,52.2-147.1,57.4-189.9,57.4c-2.1,0-4.2,0-5.2,0v-44.9
                    c0-20-21.9-25.9-33.4-15.6l-128.3,109.3c-9.8,8.3-9.8,23.3-0.1,31.7c39.5,33.9,128.4,110.5,128.4,110.5
                    c9.1,9.1,33.4,6.2,33.4-15.6v-41.7c0,0,0,0,0.1-0.1c42.9,1.2,166.5-10.6,230.5-171C452.323,247.25,448.323,236.65,439.823,231.55z
                    M221.823,385.95c-12.5,0-20.9-1-20.9-1c-12.5-2.5-24,7.1-24,19.8v19.8l-77.2-65.7l77.2-65.7v19.8c0,11.5,8.3,19.8,18.8,20.9
                    c1,0,10.4,1,27.1,1c38.6,0,98.1-4.2,147.1-25C320.923,374.55,259.323,385.95,221.823,385.95z'
                  />
                  <path
                    d='M77.323,253.15c42.8-52.2,147.1-57.4,189.9-57.4c2.1,0,4.2,0,5.2,0v44.9c0,20,21.9,25.9,33.4,15.6l128.3-109.2
                    c9.8-8.3,9.8-23.3,0.1-31.7c-39.5-34-128.5-110.5-128.5-110.5c-9.1-9.1-33.4-6.2-33.4,15.6v41.7c0,0,0,0-0.1,0.1
                    c-42.9-1.1-166.5,10.7-230.4,171.1c-4.2,9.4-0.1,20,8.3,25C62.823,265.95,73.123,258.35,77.323,253.15z M268.223,103.95
                    c12.5,0,20.9,1,20.9,1c12.5,2.5,24-7.1,24-19.8v-19.8l77.2,65.7l-77.2,65.7v-19.8c0-11.5-8.3-19.8-18.8-20.9c-1,0-10.4-1-27.1-1
                    c-38.6,0-98.1,4.2-147.1,25C169.123,115.45,230.623,103.95,268.223,103.95z'
                  />
                </g>
              </g><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g />
            </svg>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

UpdatePopulationStatus.contextTypes = {
  intl: PropTypes.object.isRequired
}

export default UpdatePopulationStatus
