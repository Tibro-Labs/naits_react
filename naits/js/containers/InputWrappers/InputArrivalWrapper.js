import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ComponentManager, GridInModalLinkObjects } from 'components/ComponentsIndex'
import { store } from 'tibro-redux'

class InputArrivalWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showSearchPopup: false,
      elementIdName: null,
      fieldIdName: null,
      filedIdNameAlt: 'DESTINATION_OBJ_ID',
      gridToDisplay: 'SVAROG_ORG_UNITS',
      filterGrid: false
    }
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

    const chosenItemValue = store.getState()[gridToDisplay].rowClicked[`${gridToDisplay}.NAME`]
    const chosenAltValue = String(store.getState()[gridToDisplay].rowClicked[`${gridToDisplay}.OBJECT_ID`])

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
  }

  render () {
    const searchPopup = <div id='search_modal' className='modal' style={{ display: 'flex' }}>
      <div id='search_modal_content' className='modal-content'>
        <div className='modal-header' />
        <div id='search_modal_body' className='modal-body'>
          <GridInModalLinkObjects
            loadFromParent
            gridTypeCall='GET_TABLE_WITH_LIKE_FILTER_2'
            linkedTable={this.state.gridToDisplay}
            onRowSelect={this.chooseItem}
            key={this.state.gridToDisplay + '_' + this.state.fieldIdName}
            closeModal={this.closeModal}
          />
        </div>
      </div>
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

InputArrivalWrapper.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  svSession: state.security.svSession
})

export default connect(mapStateToProps)(InputArrivalWrapper)
