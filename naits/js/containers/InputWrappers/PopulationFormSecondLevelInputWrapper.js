import React from 'react'
import ReactDOM from 'react-dom'
import { menuConfig } from 'config/menuConfig'
import { store } from 'tibro-redux'
import { ComponentManager, ResultsGrid } from 'components/ComponentsIndex'
import { connect } from 'react-redux'
import { $ } from 'functions/utils'

class PopulationFormSecondLevelInputWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showSearchPopup: false,
      elementIdName: null,
      altElementPrefix: 'population.basic_info',
      campaignObjId: 'CAMPAIGN_OBJ_ID',
      fieldIdName: 'CAMPAIGN_NAME',
      campaignInput: 'root_population.vacc_filter_CAMPAIGN_NAME',
      extractionType: 'root_population.basic_info_EXTRACTION_TYPE',
      gridToDisplay: 'VACCINATION_EVENT',
      formSectionsClassName: 'form-group field field-object',
      missingTagDropdown: 'root_population.filter_missing_tag_EAR_TAG_FILTER',
      missingTagFrom: 'root_population.filter_missing_tag_FILTER_MISSING_TAG_FROM',
      missingTagTo: 'root_population.filter_missing_tag_FILTER_MISSING_TAG_TO'
    }
  }

  componentDidMount () {
    const {
      formSectionsClassName,
      fieldIdName,
      extractionType,
      missingTagDropdown,
      missingTagFrom,
      missingTagTo
    } = this.state
    const formSections = document.getElementsByClassName(formSectionsClassName)
    const formSectionsArr = Array.from(formSections)
    formSectionsArr[7].style.display = 'none'
    if (this.props.gridHierarchy[0].row['POPULATION.EXTRACTION_TYPE'] !== 'ANIMAL') {
      formSectionsArr[4].style.display = 'none'
      formSectionsArr[5].style.display = 'none'
      formSectionsArr[6].style.display = 'none'
    } else if (this.props.gridHierarchy[0].row['POPULATION.EXTRACTION_TYPE'] === 'ANIMAL') {
      const inputs = Array.from(document.getElementsByTagName('input'))
      inputs.forEach((element) => {
        if (element.id.includes(fieldIdName)) {
          let elementPrefix = element.id.replace('root_', '')
          elementPrefix = elementPrefix.replace(`_${fieldIdName}`, '')
          this.setState({
            elementIdName: element.id,
            elementPrefix: elementPrefix
          })
          element.onclick = this.displayPopupOnClick
        }
      })
    }

    const extractionTypeDropdown = document.getElementById(extractionType)
    if (extractionTypeDropdown) {
      extractionTypeDropdown.setAttribute('disabled', '')
    }

    const tagDropdown = $(missingTagDropdown)
    const tagFrom = $(missingTagFrom)
    const tagTo = $(missingTagTo)
    if (tagDropdown && tagFrom && tagTo) {
      tagDropdown.setAttribute('disabled', '')
      tagFrom.setAttribute('disabled', '')
      tagTo.setAttribute('disabled', '')
    }
  }

  componentWillReceiveProps (nextProps) {
    // If the user removes the previously selected campaign, remove the campaign object id
    let newTableData = ComponentManager.getStateForComponent(nextProps.formid, 'formTableData')
    if (newTableData) {
      if (newTableData['population.vacc_filter']) {
        if (!newTableData['population.vacc_filter'].CAMPAIGN_NAME) {
          newTableData['population.basic_info'].CAMPAIGN_OBJ_ID = undefined
          newTableData['population.vacc_filter'].DISEASE_VACCINATION = undefined

          const vaccDiseaseDropdown = document.getElementById('root_population.vacc_filter_DISEASE_VACCINATION')
          if (vaccDiseaseDropdown) {
            vaccDiseaseDropdown.value = ''
          }
        }
      }
    }
  }

  displayPopupOnClick = e => {
    e.preventDefault()
    this.setState({ showSearchPopup: true })
    e.target.blur()
  }

  closeModal = () => {
    const { gridToDisplay, fieldIdName } = this.state
    const { formid } = this.props
    this.setState({ showSearchPopup: false })
    ComponentManager.cleanComponentReducerState(`${gridToDisplay}_${fieldIdName}_${formid}`)
  }

  chooseItem = () => {
    const { elementIdName, fieldIdName, elementPrefix, gridToDisplay, altElementPrefix, campaignObjId } = this.state
    const { formid } = this.props

    const chosenItemValue = store.getState()[`${gridToDisplay}_${fieldIdName}_${formid}`].rowClicked[`${gridToDisplay}.CAMPAIGN_NAME`]
    const campaignObjectId = String(store.getState()[`${gridToDisplay}_${fieldIdName}_${formid}`].rowClicked[`${gridToDisplay}.OBJECT_ID`])

    if (chosenItemValue && campaignObjectId) {
      if (elementIdName) {
        document.getElementById(elementIdName).value = chosenItemValue
      }

      if (formid) {
        let newTableData = ComponentManager.getStateForComponent(formid, 'formTableData')
        if (newTableData && newTableData.constructor === Object && !newTableData[elementPrefix]) {
          newTableData[elementPrefix] = {}
          newTableData[elementPrefix][fieldIdName] = chosenItemValue
        } else {
          if (!newTableData) {
            newTableData = {}
            newTableData[elementPrefix] = {}
          }
          newTableData[elementPrefix][fieldIdName] = chosenItemValue
        }
        newTableData[altElementPrefix][campaignObjId] = campaignObjectId
        ComponentManager.setStateForComponent(formid, 'formTableData', newTableData)
        this.props.formInstance.setState({ formTableData: newTableData })
      }
      if (this.props.handleValueChange && this.props.handleValueChange instanceof Function) {
        let value
        let altValue
        if (chosenItemValue && campaignObjectId) {
          value = chosenItemValue
          altValue = campaignObjectId
        }
        this.props.handleValueChange(null, value)
        this.props.handleValueChange(null, altValue)
      }
      this.closeModal()
    }
  }

  render () {
    const { gridToDisplay, fieldIdName } = this.state
    const gridConfig = menuConfig('GRID_CONFIG', this.context.intl)
    const searchPopup = <div id='search_modal' className='modal' style={{ display: 'flex' }}>
      <div id='search_modal_content' className='modal-content'>
        <div className='modal-header' />
        <div id='search_modal_body' className='modal-body'>
          <ResultsGrid
            key={`${gridToDisplay}_${fieldIdName}_${this.props.formid}`}
            id={`${gridToDisplay}_${fieldIdName}_${this.props.formid}`}
            gridToDisplay={gridToDisplay}
            gridConfig={gridConfig}
            onRowSelectProp={() => this.chooseItem()}
            customGridDataWS='GET_INACTIVE_ANIMAL_OR_HOLDING_CAMPAIGNS'
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
    return (
      <div>
        {this.state.showSearchPopup &&
          ReactDOM.createPortal(searchPopup, document.getElementById('app'))
        }
        {this.props.children}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  gridHierarchy: state.gridConfig.gridHierarchy
})

export default connect(mapStateToProps)(PopulationFormSecondLevelInputWrapper)
