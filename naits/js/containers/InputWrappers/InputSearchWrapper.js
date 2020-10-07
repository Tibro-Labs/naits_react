import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { DependencyDropdowns, alertUser } from 'tibro-components'
import { ComponentManager } from 'components/ComponentsIndex'
import { $ } from 'functions/utils'
import * as config from 'config/config'

export default class InputSearchWrapper extends React.Component {
  constructor (props) {
    super(props)
    let fieldIdName = props.fieldIdName || 'VILLAGE_NAME'
    let fieldIdCode = props.fieldIdCode || 'VILLAGE_CODE'
    this.state = {
      alert: false,
      showSearchPopup: false,
      elementIdName: null,
      elementIdCode: null,
      elementPrefix: null,
      fieldIdName: fieldIdName,
      fieldIdCode: fieldIdCode
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
      } else if (element.id.includes(this.state.fieldIdCode)) {
        let elementPrefix = element.id.replace('root_', '')
        elementPrefix = elementPrefix.replace(`_${this.state.fieldIdCode}`, '')
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
    this.setState({ showSearchPopup: true })
    event.target.blur()
  }

  chooseItem (comp) {
    const { elementIdName, elementIdCode, elementPrefix,
      fieldIdName, fieldIdCode } = comp.state
    const formid = comp.props.formid

    if (formid && (!$('root_holding.location.info_VILLAGE_CODE') || !$('root_holding.location.info_VILLAGE_CODE').value)) {
      // THE FORM REQUIRES A VILLAGE
      return
    }

    let code = null
    let name = null
    let el
    if ((el = $('root_holding.location.info_VILLAGE_CODE')) && (code = el.value)) {
      name = el.innerText
    } else if ((el = $('root_holding.location.info_COMMUN_CODE')) && (code = el.value)) {
      name = el.innerText
    } else if ((el = $('root_holding.location.info_MUNIC_CODE')) && (code = el.value)) {
      name = el.innerText
    } else if ((el = $('root_holding.location.info_REGION_CODE')) && (code = el.value)) {
      name = el.innerText
    }

    const chosenItemCode = code
    const chosenItemName = name

    if (chosenItemCode && chosenItemName) {
      if (elementIdCode) {
        document.getElementById(elementIdCode).value = chosenItemCode
      }
      if (elementIdName) {
        document.getElementById(elementIdName).value = chosenItemName
      }

      if (formid) {
        let newTableData = ComponentManager.getStateForComponent(formid, 'formTableData')
        if (newTableData.constructor === Object && !newTableData[elementPrefix]) {
          newTableData[elementPrefix] = {}
          newTableData[elementPrefix][fieldIdName] = chosenItemName
          newTableData[elementPrefix][fieldIdCode] = chosenItemCode
        } else {
          newTableData[elementPrefix][fieldIdName] = chosenItemName
          newTableData[elementPrefix][fieldIdCode] = chosenItemCode
        }
        ComponentManager.setStateForComponent(formid, 'formTableData', newTableData)
        comp.props.formInstance.setState({ formTableData: newTableData })
      }

      if (comp.props.handleValueChange && comp.props.handleValueChange instanceof Function) {
        let value
        if (elementIdCode) {
          value = chosenItemCode
        } else if (elementIdName) {
          value = chosenItemName
        }
        comp.props.handleValueChange(null, value)
      }
      comp.closeModal()
    } else {
      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.no_region_selected_admconsole`,
            defaultMessage: `${config.labelBasePath}.alert.no_region_selected_admconsole`
          }), null,
          () => {
            this.setState({ alert: false })
          }
        )
      })
    }
  }

  closeModal = () => {
    this.setState({ showSearchPopup: false })
  }

  render () {
    const searchPopup = <div id='search_modal' className='modal to-front' style={{ display: 'flex' }}>
      <div id='search_modal_content' className='modal-content' style={{ width: '80%' }}>
        <div className='modal-header' />
        <div id='search_modal_body' className='modal-body' style={{ color: 'white', padding: '10rem 30rem 10rem 30rem' }}>
          <DependencyDropdowns tableName='HOLDING' spread='down' />
          <button id='submit' className='btn btn-success' onClick={() => this.chooseItem(this)}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.select_location`,
              defaultMessage: `${config.labelBasePath}.main.select_location`
            })}
          </button>
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

InputSearchWrapper.contextTypes = {
  intl: PropTypes.object.isRequired
}
