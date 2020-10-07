import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ComponentManager, ResultsGrid } from 'components/ComponentsIndex'
import { store } from 'tibro-redux'
import { menuConfig } from 'config/menuConfig'

class InputSearchCampaignWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showSearchPopup: false,
      elementIdName: null,
      fieldIdName: 'CAMPAIGN_NAME',
      fieldIdNameAlt: 'VACC_EVENT_OBJ_ID',
      gridToDisplay: 'VACCINATION_EVENT',
      filterGrid: false
    }
    this.displayPopupOnClick = this.displayPopupOnClick.bind(this)
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
        element.onfocus = this.displayPopupOnClick
      }
    })
  }

  displayPopupOnClick (event) {
    event.preventDefault()
    this.setState({ showSearchPopup: true, filterGrid: false })
    event.target.blur()
  }

  chooseItem (comp) {
    const { elementIdName, fieldIdName, elementPrefix } = comp.state

    const grid = this.state.gridToDisplay + '_' + this.state.fieldIdName
    const chosenItemValue = store.getState()[grid].rowClicked[`${this.state.gridToDisplay}.CAMPAIGN_NAME`]
    const campaignObjectId = store.getState()[grid].rowClicked[`${this.state.gridToDisplay}.OBJECT_ID`]

    if (chosenItemValue && campaignObjectId) {
      if (elementIdName) {
        document.getElementById(elementIdName).value = chosenItemValue
      }
      const formid = comp.props.formid
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
        newTableData[this.state.fieldIdNameAlt] = campaignObjectId
        ComponentManager.setStateForComponent(formid, 'formTableData', newTableData)
        comp.props.formInstance.setState({ formTableData: newTableData })
      }
      if (comp.props.handleValueChange && comp.props.handleValueChange instanceof Function) {
        let value
        let altValue
        if (chosenItemValue && campaignObjectId) {
          value = chosenItemValue
          altValue = campaignObjectId
        }
        comp.props.handleValueChange(null, value)
        comp.props.handleValueChange(null, altValue)
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
            gridConfig={gridConfig}
            // gridType='LIKE'
            onRowSelectProp={() => this.chooseItem(this)}
            customGridDataWS='GET_VALID_CAMPAIGN_EVENTS'
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

InputSearchCampaignWrapper.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  showGridToDisplay: state.VACCINATION_EVENT_CAMPAIGN_NAME,
  svSession: state.security.svSession
})

export default connect(mapStateToProps)(InputSearchCampaignWrapper)
