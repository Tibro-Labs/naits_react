import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import axios from 'axios'
import Loading from 'components/Loading'
import * as config from 'config/config.js'
import style from 'components/AppComponents/ExecuteActions/ExecuteActionOnSelectedRows.module.css'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'
import { alertUser } from 'tibro-components'
import { store } from 'tibro-redux'
import { strcmp, isValidArray, formatAlertType } from 'functions/utils'
import { ComponentManager, GridManager } from 'components/ComponentsIndex'

class InactivatePetOwner extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      alert: null
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.linkName !== nextProps.linkName) {
      const { selectedObject, petObjId, linkName } = this.props
      ComponentManager.setStateForComponent(`${selectedObject}_${petObjId}_${linkName}`, 'selectedIndexes', [])
      store.dispatch({ type: 'UPDATE_SELECTED_GRID_ROWS', payload: [[], `${selectedObject}_${petObjId}_${linkName}`] })
    }
  }

  componentWillUnmount () {
    const { selectedObject, petObjId, linkName } = this.props
    store.dispatch({ type: 'UPDATE_SELECTED_GRID_ROWS', payload: [[], `${selectedObject}_${petObjId}_${linkName}`] })
  }

  showAlert = () => {
    if (!isValidArray(this.props.selectedGridRows, 1)) {
      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.empty_selection`,
            defaultMessage: `${config.labelBasePath}.alert.empty_selection`
          }), null, () => this.setState({ alert: alertUser(false, 'info', '') })
        )
      })
    } else if (isValidArray(this.props.selectedGridRows, 2)) {
      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.only_one_record_can_be_selected`,
            defaultMessage: `${config.labelBasePath}.alert.only_one_record_can_be_selected`
          }), null, () => this.setState({ alert: alertUser(false, 'info', '') })
        )
      })
    } else {
      let ownerObjId = ''
      this.props.selectedGridRows.forEach(row => {
        if (row['HOLDING_RESPONSIBLE.OBJECT_ID']) {
          ownerObjId = row['HOLDING_RESPONSIBLE.OBJECT_ID']
        }
      })
      this.setState({
        alert: alertUser(
          true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.inactivate_pet_owner`,
            defaultMessage: `${config.labelBasePath}.alert.inactivate_pet_owner`
          }), null, () => this.inactivatePetOwner(ownerObjId),
          () => this.setState({ alert: alertUser(false, 'info', '') }),
          true,
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.yes`,
            defaultMessage: `${config.labelBasePath}.main.yes`
          }),
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.no`,
            defaultMessage: `${config.labelBasePath}.main.no`
          }), true, null, true
        )
      })
    }
  }

  inactivatePetOwner = (ownerObjId) => {
    const { session, petObjId } = this.props
    this.setState({ loading: true })
    let verbPath = config.svConfig.triglavRestVerbs.INACTIVATE_PET_OWNER
    verbPath = verbPath.replace('%sessionId', session)
    verbPath = verbPath.replace('%ownerObjId', ownerObjId)
    verbPath = verbPath.replace('%petObjId', petObjId)
    const url = `${config.svConfig.restSvcBaseUrl}${verbPath}`

    axios.get(url).then(res => {
      const alertType = formatAlertType(res.data)
      this.setState({
        alert: alertUser(true, alertType, this.context.intl.formatMessage({
          id: res.data,
          defaultMessage: res.data
        })),
        loading: false
      })
      this.setState({ loading: false })
      this.reloadData()
    }).catch(err => {
      console.error(err)
      this.setState({ alert: alertUser(true, 'error', err), loading: false })
      this.reloadData()
    })
  }

  reloadData = () => {
    const { petObjId, linkName, selectedObject } = this.props
    ComponentManager.setStateForComponent(`${selectedObject}_${petObjId}_${linkName}`, 'selectedIndexes', [])
    GridManager.reloadGridData(`${selectedObject}_${petObjId}_${linkName}`)
    store.dispatch({ type: 'UPDATE_SELECTED_GRID_ROWS', payload: [[], `${selectedObject}_${petObjId}_${linkName}`] })
  }

  render () {
    const { linkName } = this.props

    if (linkName && (strcmp(linkName, 'PET_OWNER'))) {
      return (
        <React.Fragment>
          <button
            id='inactivate_pet_owner'
            className={styles.container} style={{ cursor: 'pointer', marginRight: '7px', color: 'white' }}
            onClick={this.showAlert}
          >
            <span
              id='inactivate_pet_owner_description'
              className={style.actionText}
              style={{ marginLeft: '-2%', marginTop: '8px' }}
            >
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.inactivate_pet_owner`,
                defaultMessage: `${config.labelBasePath}.main.inactivate_pet_owner`
              })}
            </span>
            <img id='inactivate_pet_owner_img' src='/naits/img/massActionsIcons/x-button.png' />
          </button>
          {this.state.loading && <Loading />}
        </React.Fragment>
      )
    } else {
      return null
    }
  }
}

InactivatePetOwner.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession,
  selectedGridRows: state.selectedGridRows.selectedGridRows
})

export default connect(mapStateToProps)(InactivatePetOwner)
