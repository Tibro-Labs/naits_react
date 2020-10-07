import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { ComponentManager, ResultsGrid } from 'components/ComponentsIndex'
import { store } from 'tibro-redux'
import { menuConfig } from 'config/menuConfig'

class InputTestTypeWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showSearchPopup: false,
      elementIdName: null,
      elementIdCode: null,
      fieldIdName: 'TEST_NAME',
      gridToDisplay: 'LAB_TEST_TYPE',
      testTypeField: 'root_lab_test_result.basic_info_TEST_TYPE',
      testType: null,
      labTestId: null
    }
    this.displayPopupOnClick = this.displayPopupOnClick.bind(this)
  }

  componentDidMount () {
    const inputs = Array.from(document.getElementsByTagName('input'))
    inputs.forEach((element, index) => {
      // find village name and village code IDs
      if (element.id.includes(this.state.fieldIdName)) {
        let elementPrefix = element.id.replace('root_', '')
        elementPrefix = elementPrefix.replace(`_${this.state.fieldIdName}`, '')
        this.setState({
          elementIdName: element.id,
          elementPrefix: elementPrefix
        })
        element.onclick = this.displayPopupOnClick
        element.onfocus = this.displayPopupOnClick
      } else if (element.id.includes(this.state.fieldIdName)) {
        let elementPrefix = element.id.replace('root_', '')
        elementPrefix = elementPrefix.replace(`_${this.state.fieldIdName}`, '')
        this.setState({
          elementIdCode: element.id,
          elementPrefix: elementPrefix
        })
        element.onclick = this.displayPopupOnClick
        element.onfocus = this.displayPopupOnClick
      }
    })
  }

  displayPopupOnClick (event) {
    event.preventDefault()
    event.target.blur()
    const { testTypeField } = this.state
    const testType = document.getElementById(testTypeField).value
    const labTestId = this.props.formInstance.state.formTableData.OBJECT_ID
    this.setState({ testType: testType, labTestId: labTestId, showSearchPopup: true })
  }

  chooseItem (comp) {
    const { elementIdName, fieldIdName, elementPrefix } = comp.state

    const grid = this.state.gridToDisplay + '_' + this.state.fieldIdName
    const chosenItemValue = store.getState()[grid].rowClicked[`${this.state.gridToDisplay}.TEST_NAME`]

    if (chosenItemValue) {
      if (elementIdName) {
        document.getElementById(elementIdName).value = chosenItemValue
      }
      const formid = comp.props.formid
      if (formid) {
        let newTableData = ComponentManager.getStateForComponent(formid, 'formTableData')
        if (newTableData.constructor === Object && !newTableData[elementPrefix]) {
          newTableData[elementPrefix] = {}
          newTableData[elementPrefix][fieldIdName] = chosenItemValue
        } else {
          newTableData[elementPrefix][fieldIdName] = chosenItemValue
        }
        ComponentManager.setStateForComponent(formid, 'formTableData', newTableData)
        comp.props.formInstance.setState({ formTableData: newTableData })
      }
      if (comp.props.handleValueChange && comp.props.handleValueChange instanceof Function) {
        let value
        if (chosenItemValue) {
          value = chosenItemValue
        }
        comp.props.handleValueChange(null, value)
      }
      comp.closeModal(comp)
    }
  }

  closeModal (comp, callback) {
    comp.setState({ showSearchPopup: false })
    ComponentManager.cleanComponentReducerState(comp.state.gridToDisplay + '_' + comp.state.fieldIdName)
  }

  render () {
    const gridConfig = menuConfig('GRID_CONFIG', this.context.intl)
    const searchPopup = <div id='search_modal' className='modal to-front' style={{ display: 'flex' }}>
      <div id='search_modal_content' className='modal-content'>
        <div className='modal-header' />
        <div id='search_modal_body' className='modal-body'>
          <ResultsGrid
            key={this.state.gridToDisplay + '_' + this.state.fieldIdName}
            id={this.state.gridToDisplay + '_' + this.state.fieldIdName}
            gridToDisplay={this.state.gridToDisplay}
            showGrid='LAB_TEST_TYPE'
            testType={this.state.testType}
            labTestId={this.state.labTestId}
            gridConfig={gridConfig}
            onRowSelectProp={() => this.chooseItem(this)}
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
        onClick={() => this.closeModal(this)} data-dismiss='modal' />
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

InputTestTypeWrapper.contextTypes = {
  intl: PropTypes.object.isRequired
}

export default InputTestTypeWrapper
