import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ComponentManager, ResultsGrid } from 'components/ComponentsIndex'
import { alertUser } from 'tibro-components'
import { store } from 'tibro-redux'
import { menuConfig } from 'config/menuConfig'
import * as config from 'config/config'

class InputCampaignWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: false,
      displayModal: false,
      activityTypeDropdownName: 'root_campaign.info_ACTIVITY_TYPE',
      testTypeFieldName: 'root_campaign.info_CAMPAIGN_TEST_TYPE',
      testTypeObjIdFieldName: 'TEST_TYPE_OBJ_ID',
      sectionName: 'campaign.info',
      testType: 'CAMPAIGN_TEST_TYPE',
      gridToDisplay: 'LAB_TEST_TYPE',
      activityType: '',
      activitySubType: '',
      disease: ''
    }
  }

  componentDidMount () {
    store.dispatch({ type: 'CAMPAIGN_FORM_IS_ACTIVE' })
    const testTypeInput = document.getElementById(this.state.testTypeFieldName)
    if (testTypeInput) {
      testTypeInput.onclick = this.displayModal
      testTypeInput.addEventListener('keydown', e => {
        e.preventDefault()
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.noResults) {
      document.getElementById('closeTestTypesModal') && document.getElementById('closeTestTypesModal').click()
      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.no_test_types_found`,
            defaultMessage: `${config.labelBasePath}.alert.no_test_types_found`
          }), null, () => this.setState({ alert: false })
        )
      })
    }
  }

  componentDidUpdate () {
    const activityTypeDropdown = document.getElementById(this.state.activityTypeDropdownName)
    if (activityTypeDropdown) {
      activityTypeDropdown.onchange = this.handleTypeChange
    }
  }

  handleTypeChange = () => {
    const { sectionName } = this.state
    let newTableData = ComponentManager.getStateForComponent(this.props.formid, 'formTableData')
    if (newTableData && newTableData[sectionName]) {
      newTableData[sectionName].DISEASE = undefined
    }
  }

  displayModal = e => {
    const { sectionName } = this.state
    if (this.props.formid) {
      let newTableData = ComponentManager.getStateForComponent(this.props.formid, 'formTableData')
      if (newTableData && newTableData[sectionName]) {
        if ((newTableData[sectionName].ACTIVITY_TYPE && newTableData[sectionName].ACTIVITY_TYPE === '2') &&
          newTableData[sectionName].ACTIVITY_SUBTYPE && newTableData[sectionName].DISEASE) {
          this.setState({
            activityType: newTableData[sectionName].ACTIVITY_TYPE,
            activitySubType: newTableData[sectionName].ACTIVITY_SUBTYPE,
            disease: newTableData[sectionName].DISEASE
          })
          e.preventDefault()
          this.setState({ displayModal: true })
          e.target.blur()
        } else {
          this.setState({
            alert: alertUser(true, 'warning',
              this.context.intl.formatMessage({
                id: `${config.labelBasePath}.alert.select_valid_campaign_activity_type`,
                defaultMessage: `${config.labelBasePath}.alert.select_valid_campaign_activity_type`
              }), null, () => this.setState({ alert: false })
            )
          })
        }
      }
    }
  }

  chooseTestType = () => {
    const { sectionName, testType, testTypeObjIdFieldName } = this.state
    const grid = `${this.state.gridToDisplay}_CUSTOM`
    const chosenTestType = store.getState()[grid].rowClicked[`${this.state.gridToDisplay}.TEST_NAME`]
    const testTypeObjId = String(store.getState()[grid].rowClicked[`${this.state.gridToDisplay}.OBJECT_ID`])
    if (chosenTestType && testTypeObjId) {
      const testTypeInput = document.getElementById(this.state.testTypeFieldName)
      if (testTypeInput) {
        testTypeInput.value = chosenTestType
      }

      if (this.props.formid) {
        let newTableData = ComponentManager.getStateForComponent(this.props.formid, 'formTableData')
        if (newTableData && newTableData.constructor === Object && !newTableData[sectionName]) {
          newTableData[sectionName] = {}
          newTableData[sectionName][testType] = chosenTestType
        } else {
          if (!newTableData) {
            newTableData = {}
            newTableData[sectionName] = {}
          }
          newTableData[sectionName][testType] = chosenTestType
        }
        newTableData[testTypeObjIdFieldName] = testTypeObjId
        ComponentManager.setStateForComponent(this.props.formid, 'formTableData', newTableData)
        this.props.formInstance.setState({ formTableData: newTableData })
      }
      if (this.props.handleValueChange && this.props.handleValueChange instanceof Function) {
        let value
        let altValue
        if (chosenTestType && testTypeObjId) {
          value = chosenTestType
          altValue = testTypeObjId
        }
        this.props.handleValueChange(null, value)
        this.props.handleValueChange(null, altValue)
      }
    }
    const activityTypeDropdown = document.getElementById('root_campaign.info_ACTIVITY_TYPE')
    const diseaseDropdown = document.getElementById('root_campaign.info_DISEASE')
    const activitySubTypeDropdown = document.getElementById('root_campaign.info_ACTIVITY_SUBTYPE')
    const scopeDropdown = document.getElementById('root_campaign.info_CAMPAIGN_SCOPE')
    if (activityTypeDropdown && diseaseDropdown && activitySubTypeDropdown && scopeDropdown) {
      activityTypeDropdown.setAttribute('disabled', '')
      diseaseDropdown.setAttribute('disabled', '')
      activitySubTypeDropdown.setAttribute('disabled', '')
      scopeDropdown.setAttribute('disabled', '')
    }
    this.closeModal()
  }

  closeModal = () => {
    store.dispatch({ type: 'CLOSED_THE_TEST_TYPES_MODAL' })
    this.setState({ displayModal: false, activityType: '', activitySubType: '', disease: '' })
    ComponentManager.cleanComponentReducerState(`${this.state.gridToDisplay}_CUSTOM`)
  }

  render () {
    const { gridToDisplay, displayModal, activityType, activitySubType, disease } = this.state
    const gridConfig = menuConfig('GRID_CONFIG', this.context.intl)
    const testTypesModal = <div id='search_modal' className='modal to-front' style={{ display: 'flex' }}>
      <div id='search_modal_content' className='modal-content'>
        <div className='modal-header' />
        <div id='search_modal_body' className='modal-body'>
          <ResultsGrid
            key={`${gridToDisplay}_CUSTOM`}
            id={`${gridToDisplay}_CUSTOM`}
            gridToDisplay={gridToDisplay}
            gridConfig={gridConfig}
            onRowSelectProp={() => this.chooseTestType()}
            customGridDataWS='GET_APPLICABLE_TEST_TYPES'
            activityType={activityType}
            activitySubType={activitySubType}
            disease={disease}
          />
        </div>
      </div>
      <div id='closeTestTypesModal' type='button' className='js-components-AppComponents-Functional-GridInModalLinkObjects-module-close'
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
    return (
      <React.Fragment>
        {displayModal && ReactDOM.createPortal(testTypesModal, document.getElementById('app'))}
        {this.props.children}
      </React.Fragment>
    )
  }
}

InputCampaignWrapper.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  noResults: state.searchAndLoad.noResults
})

export default connect(mapStateToProps)(InputCampaignWrapper)
