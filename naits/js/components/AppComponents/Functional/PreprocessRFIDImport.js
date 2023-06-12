import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { connect } from 'react-redux'
import { GridManager, alertUser } from 'tibro-components'
import Loading from 'components/Loading'
import * as config from 'config/config.js'
import style from 'components/AppComponents/ExecuteActions/ExecuteActionOnSelectedRows.module.css'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'
import { formatAlertType } from 'functions/utils'

class PreprocessRFIDImport extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: false
    }
  }

  preprocessRfidImportPrompt = () => {
    this.setState({
      alert: alertUser(
        true, 'warning',
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.preprocess_rfid_import_prompt`,
          defaultMessage: `${config.labelBasePath}.main.preprocess_rfid_import_prompt`
        }), null, () => this.preprocessRfidImport(), () => this.close(), true,
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.yes`,
          defaultMessage: `${config.labelBasePath}.main.yes`
        }),
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.no`,
          defaultMessage: `${config.labelBasePath}.main.no`
        })
      )
    })
  }

  preprocessRfidImport = () => {
    this.setState({ loading: true })
    let objectArray
    if (this.props.gridHierarchy) {
      this.props.gridHierarchy.forEach(grid => {
        if (grid.active && grid.gridType === 'RFID_INPUT') {
          objectArray = [grid.row]
        }
      })
    }
    let paramsArray = [{
      MASS_PARAM_TBL_NAME: this.props.gridType,
      MASS_PARAM_ACTION: 'ACCEPTED'
    }]
    const verbPath = config.svConfig.triglavRestVerbs.MASS_OBJECT_HANDLER
    const url = `${config.svConfig.restSvcBaseUrl}${verbPath}/${this.props.session}`

    axios({
      method: 'post',
      url,
      data: JSON.stringify({ objectArray, paramsArray })
    }).then(res => {
      const responseType = formatAlertType(res.data)
      this.setState({
        alert: alertUser(
          true, responseType,
          this.context.intl.formatMessage({
            id: res.data,
            defaultMessage: res.data
          }), null
        ),
        loading: false
      })
      GridManager.reloadGridData(`${this.props.selectedObject}_${this.props.parentId}`)
    }).catch(err => {
      this.setState({
        alert: alertUser(
          true, 'error',
          this.context.intl.formatMessage({
            id: err,
            defaultMessage: err
          }), null
        ),
        loading: false
      })
    })
  }

  close = () => {
    this.setState({ alert: false })
  }

  render () {
    return (
      <React.Fragment>
        {this.state.loading && <Loading />}
        <div
          id='preproccess_rfid_import_container'
          className={styles.container}
          style={{ cursor: 'pointer', marginRight: '7px', color: 'white' }}
          onClick={this.preprocessRfidImportPrompt}
        >
          <p style={{ width: '73px' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.preproccess_rfid_import`,
              defaultMessage: `${config.labelBasePath}.main.preproccess_rfid_import`
            })}
          </p>
          <div id='preproccess_rfid_import' className={styles['gauge-container']}>
            <img
              id='change_status_img' className={style.actionImg}
              style={{ height: '45px', marginTop: '7%', marginLeft: '14px' }}
              src='/naits/img/MainPalette/note.png'
            />
          </div>
        </div>
      </React.Fragment>
    )
  }
}

PreprocessRFIDImport.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession,
  gridHierarchy: state.gridConfig.gridHierarchy
})

export default connect(mapStateToProps)(PreprocessRFIDImport)
