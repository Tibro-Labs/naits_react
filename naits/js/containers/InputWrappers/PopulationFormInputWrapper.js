import React from 'react'
import ReactDOM from 'react-dom'
import { menuConfig } from 'config/menuConfig'
import { store } from 'tibro-redux'
import { ComponentManager, ResultsGrid } from 'components/ComponentsIndex'
import { $ } from 'functions/utils'

class PopulationFormInputWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showSearchPopup: false,
      elementIdName: null,
      altElementPrefix: 'population.basic_info',
      campaignObjId: 'CAMPAIGN_OBJ_ID',
      fieldIdName: 'CAMPAIGN_NAME',
      gridToDisplay: 'VACCINATION_EVENT',
      formSectionsClassName: 'form-group field field-object',
      missingTagDropdown: 'root_population.filter_missing_tag_EAR_TAG_FILTER',
      missingTagFrom: 'root_population.filter_missing_tag_FILTER_MISSING_TAG_FROM',
      missingTagTo: 'root_population.filter_missing_tag_FILTER_MISSING_TAG_TO',
      extractionTypeDropdownElId: 'root_population.basic_info_EXTRACTION_TYPE',
      extractionType: ''
    }
  }

  componentDidMount () {
    const {
      formSectionsClassName,
      extractionTypeDropdownElId,
      fieldIdName,
      missingTagDropdown,
      missingTagFrom,
      missingTagTo
    } = this.state
    const formSections = document.getElementsByClassName(formSectionsClassName)
    const formSectionsArr = Array.from(formSections)
    formSectionsArr[1].id = 'shortInfo'
    formSectionsArr[2].id = 'ageFilter'
    formSectionsArr[3].id = 'genderFilter'
    formSectionsArr[4].id = 'vaccFilter'
    formSectionsArr[5].id = 'campaignFilter'
    formSectionsArr[6].id = 'positiveSuspectFilter'
    formSectionsArr[7].id = 'missingTagFilter'

    const extractionTypeDropdown = $(extractionTypeDropdownElId)
    if (extractionTypeDropdown) {
      extractionTypeDropdown.onchange = this.handleExtractionSelectionChange
    }

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

    const missingTagFilterSection = $('missingTagFilter')
    const tagDropdown = $(missingTagDropdown)
    const tagFrom = $(missingTagFrom)
    const tagTo = $(missingTagTo)
    if (missingTagFilterSection && tagDropdown && tagFrom && tagTo) {
      missingTagFilterSection.style.display = 'none'
      tagDropdown.setAttribute('disabled', '')
      tagFrom.setAttribute('disabled', '')
      tagTo.setAttribute('disabled', '')
    }

    this.sectionsStyleChange('initial')
  }

  componentDidUpdate (nextProps, nextState) {
    if (nextState.extractionType === 'HOLDING' || nextState.extractionType === '') {
      this.sectionsStyleChange('hide')
    } else {
      this.sectionsStyleChange('show')
    }

    // If the user removes the previously selected campaign, remove the campaign object id
    const formid = this.props.formid
    if (formid) {
      let newTableData = ComponentManager.getStateForComponent(formid, 'formTableData')
      if (newTableData) {
        if (newTableData['population.vacc_filter']) {
          if (!newTableData['population.vacc_filter'].CAMPAIGN_NAME) {
            newTableData['population.basic_info'].CAMPAIGN_OBJ_ID = undefined
          }
        }
      }
    }
  }

  sectionsStyleChange = (hideOrShow) => {
    let sectionsArr = []
    const vaccFilterSection = $('vaccFilter')
    const campaignFilter = $('campaignFilter')
    const positiveSuspectFilterSection = $('positiveSuspectFilter')

    if (vaccFilterSection && campaignFilter && positiveSuspectFilterSection) {
      sectionsArr.push(vaccFilterSection, campaignFilter, positiveSuspectFilterSection)
      if (hideOrShow === 'hide') {
        sectionsArr.map(section => {
          section.style.display = 'none'
        })
      } else if (hideOrShow === 'show') {
        sectionsArr.map(section => {
          section.style.display = 'table'
          section.style.animationName = 'slide-in-up'
          section.style.animationIterationCount = '1'
          section.style.animationTimingFunction = 'ease-in'
          section.style.animationDuration = '0.5s'
        })
      } else if (hideOrShow === 'initial') {
        sectionsArr.map(section => {
          section.style.display = 'none'
        })
      }
    }
  }

  handleExtractionSelectionChange = e => {
    this.setState({ extractionType: e.target.value })
  }

  displayPopupOnClick = e => {
    e.preventDefault()
    this.setState({ showSearchPopup: true })
    e.target.blur()
  }

  closeModal = () => {
    const { gridToDisplay, fieldIdName } = this.state
    this.setState({ showSearchPopup: false })
    ComponentManager.cleanComponentReducerState(`${gridToDisplay}_${fieldIdName}`)
  }

  chooseItem = () => {
    const { elementIdName, fieldIdName, elementPrefix, gridToDisplay, altElementPrefix, campaignObjId } = this.state

    const chosenItemValue = store.getState()[`${gridToDisplay}_${fieldIdName}`].rowClicked[`${gridToDisplay}.CAMPAIGN_NAME`]
    const campaignObjectId = String(store.getState()[`${gridToDisplay}_${fieldIdName}`].rowClicked[`${gridToDisplay}.OBJECT_ID`])

    if (chosenItemValue && campaignObjectId) {
      if (elementIdName) {
        document.getElementById(elementIdName).value = chosenItemValue
      }
      const formid = this.props.formid
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
            key={`${gridToDisplay}_${fieldIdName}`}
            id={`${gridToDisplay}_${fieldIdName}`}
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

export default PopulationFormInputWrapper
