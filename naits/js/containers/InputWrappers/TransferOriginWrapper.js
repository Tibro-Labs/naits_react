import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ComponentManager, ResultsGrid } from 'components/ComponentsIndex'
import { store } from 'tibro-redux'
import style from 'components/AppComponents/Functional/GridInModalLinkObjects.module.css'

class TransferOriginWrapper extends React.Component {
  constructor (props) {
    super(props)
    let gridTypeCall = 'GET_VALID_ORG_UNITS'
    const selectedObjects = props.selectedObjects.filter(el => {
      return el.active === true
    })
    let gridToDisplay = 'SVAROG_ORG_UNITS'
    if (selectedObjects[0].gridType === 'SVAROG_ORG_UNITS') {
      if (selectedObjects[0].row[selectedObjects[0].gridType + '.ORG_UNIT_TYPE'] === 'VILLAGE_OFFICE') {
        gridToDisplay = 'HOLDING'
        // gridTypeCall = null
      }
    }
    this.state = {
      showSearchPopup: false,
      elementIdName: null,
      fieldIdName: null,
      filedIdNameAlt: 'DESTINATION_OBJ_ID',
      gridToDisplay: gridToDisplay,
      gridTypeCall: gridTypeCall,
      filterGrid: false
    }
    this.displayPopupOnClick = this.displayPopupOnClick.bind(this)
  }

  componentDidMount () {
    const inputs = Array.from(document.getElementsByTagName('input'))
    let fieldIdName = null

    // bind popup on focus event
    const bind = (comp, element, fieldIdName) => {
      let elementPrefix = element.id.replace('root_', '')
      elementPrefix = elementPrefix.replace(`_${fieldIdName}`, '')
      comp.setState({
        elementIdName: element.id,
        elementPrefix: elementPrefix
      })
      element.onclick = comp.displayPopupOnClick
      // element.onfocus = comp.displayPopupOnClick
    }

    inputs.forEach((element) => {
      if (element.id.includes('SUBJECT_TO')) {
        fieldIdName = 'SUBJECT_TO'
        this.setState({ fieldIdName })
        bind(this, element, fieldIdName)
      } else if (element.id.includes('ORG_UNIT_NAME')) {
        fieldIdName = 'ORG_UNIT_NAME'
        this.setState({ fieldIdName })
        bind(this, element, fieldIdName)
      }
    })
  }

  displayPopupOnClick = (event) => {
    event.preventDefault()
    this.setState({ showSearchPopup: true, filterGrid: false })
    event.target.blur()
  }

  chooseItem = () => {
    const { gridToDisplay, elementIdName, fieldIdName, elementPrefix } = this.state
    let chosenItemValue
    let chosenAltValue
    chosenItemValue = store.getState()[this.state.gridToDisplay + '_' + this.props.formId].rowClicked[`${gridToDisplay}.NAME`]
    chosenAltValue = String(store.getState()[this.state.gridToDisplay + '_' + this.props.formId].rowClicked[`${gridToDisplay}.OBJECT_ID`])

    if (chosenItemValue && chosenAltValue) {
      if (elementIdName) {
        document.getElementById(elementIdName).value = chosenItemValue
      }
      const formid = this.props.formid
      if (formid) {
        let newTableData = ComponentManager.getStateForComponent(formid, 'formTableData')
        if (newTableData && newTableData.constructor === Object && !newTableData[elementPrefix]) {
          if (elementPrefix !== fieldIdName) {
            // field code has prefix
            newTableData[elementPrefix] = {}
            newTableData[elementPrefix][fieldIdName] = chosenItemValue
          } else {
            // field code has no prefix
            newTableData[fieldIdName] = chosenItemValue
          }
        } else {
          if (elementPrefix !== fieldIdName) {
            if (!newTableData) {
              newTableData = {}
              newTableData[elementPrefix] = {}
            }
            newTableData[elementPrefix][fieldIdName] = chosenItemValue
          } else {
            if (!newTableData) {
              newTableData = {}
            }
            newTableData[fieldIdName] = chosenItemValue
          }
        }
        // add dest obj id in form data state
        newTableData[this.state.filedIdNameAlt] = chosenAltValue
        ComponentManager.setStateForComponent(formid, 'formTableData', newTableData)
        this.props.formInstance.setState({ formTableData: newTableData })
      }
      if (this.props.handleValueChange && this.props.handleValueChange instanceof Function) {
        if (chosenItemValue && chosenAltValue) {
          this.props.handleValueChange(null, chosenItemValue)
          this.props.handleValueChange(null, chosenAltValue)
        }
      }
    }
    this.closeModal()
  }

  closeModal = () => {
    this.setState({ showSearchPopup: false })
    ComponentManager.cleanComponentReducerState(this.state.gridToDisplay)
    ComponentManager.cleanComponentReducerState(this.state.gridToDisplay + '_' + this.props.formId)
  }

  render () {
    let externalId = null
    const selectedOrgUnit = this.props.selectedObjects.filter((element) => {
      return (element.active === true)
    })
    if (selectedOrgUnit[0]) {
      externalId = selectedOrgUnit[0].row['SVAROG_ORG_UNITS.EXTERNAL_ID'] || null
    }

    const searchPopup = <div id='search_modal' className='modal' style={{ display: 'flex' }}>
      <div id='search_modal_content' className='modal-content'>
        <div className='modal-header' />
        <div id='search_modal_body' className='modal-body'>
          <ResultsGrid
            key={this.state.gridToDisplay + '_' + this.props.formId}
            id={this.state.gridToDisplay + '_' + this.props.formId}
            gridToDisplay={this.state.gridToDisplay}
            onRowSelectProp={this.chooseItem}
            gridTypeCall={this.state.gridTypeCall}
            externalId={externalId}
          />
        </div>
      </div>
      <div id='modal_close_btn' type='button' className={style.close}
        style={{
          position: 'absolute',
          right: 'calc(11% - 9px)',
          top: '44px',
          width: '32px',
          height: '32px',
          opacity: '1'
        }}
        onClick={this.closeModal} data-dismiss='modal' />
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

TransferOriginWrapper.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
  selectedObjects: state.gridConfig.gridHierarchy
})

export default connect(mapStateToProps)(TransferOriginWrapper)
