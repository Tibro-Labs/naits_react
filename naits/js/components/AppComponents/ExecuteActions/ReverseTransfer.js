import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import axios from 'axios'
import * as config from 'config/config.js'
import style from './ExecuteActionOnSelectedRows.module.css'
import { alertUser } from 'tibro-components'
import { store, updateSelectedRows } from 'tibro-redux'
import { strcmp, isValidArray, formatAlertType } from 'functions/utils'
import { ComponentManager, GridManager, Loading } from 'components/ComponentsIndex'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'

class ReverseTransfer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: undefined,
      loading: false
    }
  }

  componentWillUnmount () {
    updateSelectedRows([], null)
    store.dispatch({ type: 'CLEAN_ACTION_STATE', payload: null })
  }

  close = () => this.setState({ alert: alertUser(false, 'info', '') })

  reverseTransferPrompt = () => {
    const { selectedGridRows } = this.props
    if (!isValidArray(selectedGridRows, 1)) {
      return this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.empty_selection`,
            defaultMessage: `${config.labelBasePath}.alert.empty_selection`
          }), null, () => this.setState({ alert: alertUser(false, 'info', '') })
        )
      })
    } else if (isValidArray(selectedGridRows, 2)) {
      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.error.pleaseSelectOneTransferToUseReverseAction`,
            defaultMessage: `${config.labelBasePath}.error.pleaseSelectOneTransferToUseReverseAction`
          }), null, () => this.setState({ alert: alertUser(false, 'info', '') })
        )
      })
    } else {
      this.setState({
        alert: alertUser(
          true, 'warning', this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.reverse_transfer_prompt`,
            defaultMessage: `${config.labelBasePath}.main.reverse_transfer_prompt`
          }), null, () => this.reverseTransfer(), () => this.close(),
          true, this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.execute`,
            defaultMessage: `${config.labelBasePath}.actions.execute`
          }), this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.forms.cancel`,
            defaultMessage: `${config.labelBasePath}.main.forms.cancel`
          }), true, null, true
        )
      })
    }
  }

  reverseTransfer = () => {
    this.setState({ loading: true })
    const selectedTransferObjId = this.props.selectedGridRows[0]['TRANSFER.OBJECT_ID']
    const verbPath = config.svConfig.triglavRestVerbs.CREATE_REVERSE_TRANSFER
    const restUrl = `${config.svConfig.restSvcBaseUrl}${verbPath}/${this.props.session}/${selectedTransferObjId}`
    axios.get(restUrl).then(res => {
      if (res.data) {
        const responseType = formatAlertType(res.data)
        this.setState({
          alert: alertUser(
            true, responseType, this.context.intl.formatMessage({
              id: res.data,
              defaultMessage: res.data
            }), null, () => this.close()
          ),
          loading: false
        })

        if (strcmp(responseType, 'success')) {
          this.reloadData()
        }
      }
    }).catch(err => {
      console.error(err)
      this.setState({ alert: alertUser(true, 'error', err), loading: false })
    })
  }

  reloadData = () => {
    const { selectedObject, parentId, customGridId } = this.props
    const gridId = `${selectedObject}_${parentId}_${customGridId}`

    updateSelectedRows([], null)
    store.dispatch({ type: 'CLEAN_ACTION_STATE', payload: null })
    ComponentManager.setStateForComponent(gridId, null, {
      selectedIndexes: []
    })
    GridManager.reloadGridData(gridId)
  }

  render () {
    const { gridType, selectedObjects, customGridId } = this.props
    let component = null
    if (customGridId === 'TRANSFER_OUTCOME') {
      return null
    } else {
      selectedObjects.map(singleObj => {
        const isActive = singleObj.active
        if (isActive && singleObj.row[gridType + '.ORG_UNIT_TYPE'] === 'HEADQUARTER') {
          return null
        }
        if (gridType) {
          if (isActive) {
            component = <div
              id='reverse_transfer'
              className={styles.container} style={{ cursor: 'pointer', marginRight: '7px', color: 'white' }}
              onClick={this.reverseTransferPrompt}
            >
              <p style={{ marginTop: '2px' }}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.reverse_transfer`,
                  defaultMessage: `${config.labelBasePath}.reverse_transfer`
                })}
              </p>
              <div id='reverse_transfer' className={styles['gauge-container']}>
                <img id='change_status_img' className={style.actionImg} style={{ height: '45px', marginTop: '7%' }}
                  src='/naits/img/massActionsIcons/undo.png' />
              </div>
            </div>
          }
        }
      })
    }
    return (
      <React.Fragment>
        {component}
        {this.state.loading && <Loading />}
      </React.Fragment>
    )
  }
}

ReverseTransfer.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession,
  selectedObjects: state.gridConfig.gridHierarchy,
  selectedGridRows: state.selectedGridRows.selectedGridRows
})

export default connect(mapStateToProps)(ReverseTransfer)
