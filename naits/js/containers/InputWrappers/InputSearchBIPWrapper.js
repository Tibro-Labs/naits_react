import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { ComponentManager, ResultsGrid } from 'components/ComponentsIndex'
import { store } from 'tibro-redux'
import { menuConfig } from 'config/menuConfig'

export default class InputSearchBIPWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showSearchPopup: false,
      elementIdName: null,
      elementIdCode: null,
      fieldIdName: 'BIP_HOLDING_ID',
      gridToDisplay: props.gridToDisplay || 'HOLDING'
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
    let gridToDisplay = this.state.gridToDisplay
    let filterVals
    const filterBy = 'TYPE'
    if (gridToDisplay) {
      // '14' is holding a type of border post
      filterVals = '14'
    }
    if (filterBy && filterVals) {
      this.setState({
        searchBy: filterBy,
        searchForValue: filterVals,
        showSearchPopup: true,
        renderGrid: true
      })
    } else {
      this.setState({ showSearchPopup: false })
    }
    event.target.blur()
  }

  chooseItem (comp) {
    const { elementIdName, fieldIdName, elementPrefix } = comp.state

    const grid = this.state.gridToDisplay + '_' + this.state.searchForValue
    const chosenItemValue = store.getState()[grid].rowClicked[`${this.state.gridToDisplay}.OBJECT_ID`]

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
    ComponentManager.cleanComponentReducerState(comp.state.gridToDisplay + '_' + comp.state.searchForValue)
  }

  render () {
    const gridConfig = menuConfig('GRID_CONFIG', this.context.intl)
    const searchPopup = <div id='search_modal' className='modal to-front' style={{ display: 'flex' }}>
      <div id='search_modal_content' className='modal-content'>
        <div className='modal-header' />
        <div id='search_modal_body' className='modal-body'>
          <ResultsGrid
            key={this.state.gridToDisplay + '_' + this.state.searchForValue}
            id={this.state.gridToDisplay + '_' + this.state.searchForValue}
            gridToDisplay={this.state.gridToDisplay}
            gridType='LIKE'
            gridConfig={gridConfig}
            onRowSelectProp={() => this.chooseItem(this)}
            filterBy={this.state.searchBy}
            filterVals={this.state.searchForValue}
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

InputSearchBIPWrapper.contextTypes = {
  intl: PropTypes.object.isRequired
}
