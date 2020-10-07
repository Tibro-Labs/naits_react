import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import axios from 'axios'
import { connect } from 'react-redux'
import * as config from 'config/config'
import { ComponentManager, GridInModalLinkObjects } from 'components/ComponentsIndex'
import { store } from 'tibro-redux'

class InputStrayPetReleaseWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showSearchPopup: false,
      elementIdName: null,
      fieldIdName: 'RELEASE_LOCATION',
      gridToDisplay: 'AREA',
      filterGrid: false
    }
  }

  componentDidMount () {
    const inputs = Array.from(document.getElementsByTagName('input'))
    inputs.forEach((element, index) => {
      if (element.id.includes(this.state.fieldIdName)) {
        let elementPrefix = element.id.replace('root_', '')
        elementPrefix = elementPrefix.replace(`_${this.state.fieldIdName}`, '')
        this.setState({
          elementIdName: element.id,
          elementPrefix: elementPrefix
        })
        element.onclick = this.displayPopupOnClick
      }
    })
  }

  displayPopupOnClick = (event) => {
    event.preventDefault()
    this.setState({ showSearchPopup: true, filterGrid: false })
    event.target.blur()
  }

  chooseItem = async () => {
    const { gridToDisplay, elementIdName, fieldIdName, elementPrefix } = this.state

    const chosenItemValue = store.getState()[gridToDisplay].rowClicked[`${gridToDisplay}.${gridToDisplay}_NAME`]
    const chosenItemType = store.getState()[gridToDisplay].rowClicked[`${gridToDisplay}.OBJECT_TYPE`]

    const server = config.svConfig.restSvcBaseUrl
    const verbPath = config.svConfig.triglavRestVerbs.TRANSLATE_CODE_ITEM
    let restUrl = `${server}${verbPath}`
    restUrl = restUrl.replace('%svSession', this.props.svSession)
    restUrl = restUrl.replace('%typeId', chosenItemType)
    restUrl = restUrl.replace('%fieldName', 'AREA_NAME')
    restUrl = restUrl.replace('%fieldValue', chosenItemValue)
    restUrl = restUrl.replace('%locale', this.props.locale)
    const response = await axios.get(restUrl)
    const areaCode = response.data

    if (chosenItemValue && areaCode) {
      if (elementIdName) {
        document.getElementById(elementIdName).value = areaCode
      }
      const formid = this.props.formid
      if (formid) {
        let newTableData = ComponentManager.getStateForComponent(formid, 'formTableData')
        if (newTableData && newTableData.constructor === Object && !newTableData[elementPrefix]) {
          if (elementPrefix !== fieldIdName) {
            // field code has prefix
            newTableData[elementPrefix] = {}
            newTableData[elementPrefix][fieldIdName] = areaCode
          } else {
            // field code has no prefix
            newTableData[fieldIdName] = areaCode
          }
        } else {
          if (elementPrefix !== fieldIdName) {
            if (!newTableData) {
              newTableData = {}
              newTableData[elementPrefix] = {}
            }
            newTableData[elementPrefix][fieldIdName] = areaCode
          } else {
            if (!newTableData) {
              newTableData = {}
            }
            newTableData[fieldIdName] = areaCode
          }
        }
        // add dest obj id in form data state
        ComponentManager.setStateForComponent(formid, 'formTableData', newTableData)
        this.props.formInstance.setState({ formTableData: newTableData })
      }
      if (this.props.handleValueChange && this.props.handleValueChange instanceof Function) {
        if (areaCode) {
          this.props.handleValueChange(null, areaCode)
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
    const searchPopup = <div id='search_modal' className='modal' style={{ display: 'flex' }}>
      <div id='search_modal_content' className='modal-content'>
        <div className='modal-header' />
        <div id='search_modal_body' className='modal-body'>
          <GridInModalLinkObjects
            loadFromParent
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

InputStrayPetReleaseWrapper.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
  locale: state.intl.locale
})

export default connect(mapStateToProps)(InputStrayPetReleaseWrapper)
