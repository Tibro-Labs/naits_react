import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import { alertUser } from 'tibro-components'
import { store, updateSelectedRows } from 'tibro-redux'
import { ComponentManager, GridManager, Loading, GridInModalLinkObjects } from 'components/ComponentsIndex'
import { strcmp, isValidArray, formatAlertType } from 'functions/utils'
import * as config from 'config/config'
import style from 'components/AppComponents/ExecuteActions/ExecuteActionOnSelectedRows.module.css'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'

class AssignHerdLabSampleToLaboratory extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      modal: undefined,
      modalKey: 'LABORATORY_SEARCH',
      secondaryTableName: 'LABORATORY',
      promptLabel: 'assign_herd_sample_to_lab_propmt',
      labSampleObjId: undefined
    }
  }

  onClick = () => {
    const { selectedGridRows, selectedObject } = this.props
    const { modalKey, secondaryTableName } = this.state
    if (!isValidArray(selectedGridRows, 1)) {
      alertUser(true, 'warning',
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.alert.empty_selection`,
          defaultMessage: `${config.labelBasePath}.alert.empty_selection`
        })
      )
    } else if (isValidArray(selectedGridRows, 2)) {
      alertUser(true, 'warning',
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.alert.only_one_record_can_be_selected`,
          defaultMessage: `${config.labelBasePath}.alert.only_one_record_can_be_selected`
        })
      )
    } else {
      const labSampleObjId = selectedGridRows[0][`${selectedObject}.OBJECT_ID`]
      const modal = <GridInModalLinkObjects key={modalKey} loadFromParent linkedTable={secondaryTableName} onRowSelect={this.onRowClick}
        closeModal={this.closeModal} isFromHerdLabSample
      />
      this.setState({ modal, labSampleObjId })
    }
  }

  closeModal = () => this.setState({ modal: undefined, labSampleObjId: undefined })

  onRowClick = () => {
    const { secondaryTableName, promptLabel, labSampleObjId } = this.state
    const laboratoryName = encodeURIComponent(store.getState()[secondaryTableName].rowClicked[`${secondaryTableName}.LAB_NAME`])
    alertUser(
      true, 'info', this.context.intl.formatMessage({
        id: `${config.labelBasePath}.alert.${promptLabel}`,
        defaultMessage: `${config.labelBasePath}.alert.${promptLabel}`
      }) + '?', null, () => this.assignHerdLabSampleToLaboratory(labSampleObjId, laboratoryName), () => { },
      true, this.context.intl.formatMessage({
        id: `${config.labelBasePath}.main.yes`,
        defaultMessage: `${config.labelBasePath}.main.yes`
      }),
      this.context.intl.formatMessage({
        id: `${config.labelBasePath}.main.no`,
        defaultMessage: `${config.labelBasePath}.main.no`
      })
    )
  }

  assignHerdLabSampleToLaboratory = (labSampleObjId, laboratoryName) => {
    this.setState({ loading: true })
    const { session, gridId } = this.props
    const secondGridId = gridId.replace(/.$/, '2')
    const verbPath = config.svConfig.triglavRestVerbs.ASSIGN_HERD_LAB_SAMPLE_TO_LABORATORY
    const url = `${config.svConfig.restSvcBaseUrl}${verbPath}/${session}/${labSampleObjId}/${laboratoryName}`
    axios.get(url).then(res => {
      if (res.data) {
        this.setState({ loading: false })
        const resType = formatAlertType(res.data)
        const resLabel = this.context.intl.formatMessage({ id: res.data, defaultMessage: res.data })
        alertUser(true, resType, resLabel)
        if (strcmp(resType, 'success')) {
          this.props.updateSelectedRows([], null)
          ComponentManager.setStateForComponent(gridId, 'selectedIndexes', [])
          ComponentManager.setStateForComponent(secondGridId, 'selectedIndexes', [])
          GridManager.reloadGridData(gridId)
          GridManager.reloadGridData(secondGridId)
          this.closeModal()
        }
      }
    }).catch(err => {
      console.error(err)
      alertUser(true, 'error', err)
      this.setState({ loading: false })
    })
  }

  render () {
    const btnId = 'assign_herd_lab_sample_to_laboratory'
    return <React.Fragment>
      <button id={btnId} onClick={this.onClick} className={styles.container} style={{ cursor: 'pointer', marginRight: '7px', color: 'white', width: '150px' }}>
        <span id='assign_herd_lab_sample_to_laboratory_description' className={style.actionText} style={{ marginLeft: '3%', marginTop: '1px' }}>
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.assign_sample_to_laboratory`,
            defaultMessage: `${config.labelBasePath}.assign_sample_to_laboratory`
          })}
        </span>
        <img id='assign_herd_lab_sample_to_laboratory_img' src='/naits/img/massActionsIcons/generate.png' />
      </button>
      {this.state.modal}
      {this.state.loading && <Loading />}
    </React.Fragment>
  }
}

AssignHerdLabSampleToLaboratory.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession,
  selectedGridRows: state.selectedGridRows.selectedGridRows
})

const mapDispatchToProps = dispatch => ({
  updateSelectedRows: (...params) => {
    dispatch(updateSelectedRows(...params))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(AssignHerdLabSampleToLaboratory)
