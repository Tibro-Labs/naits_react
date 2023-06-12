import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { store } from 'tibro-redux'
import { validateAnimalId, resetValidation } from 'backend/validationActions'
import { transferAnimalOrFlock, resetTransferAnimal } from 'backend/transferAction'
import { alertUser } from 'tibro-components'
import { GridManager } from 'components/ComponentsIndex'
import * as config from 'config/config'
import { formatAlertType } from 'functions/utils'

class InputWSValidationWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      elementId: 'root_animal.basic_info_ANIMAL_ID',
      animalClassElementId: 'root_animal.description_ANIMAL_CLASS',
      parentType: 'HOLDING',
      alert: null
    }
    this.validateInput = this.validateInput.bind(this)
  }

  componentDidUpdate () {
    const element = document.getElementById(this.state.animalClassElementId)
    if (element) {
      element.onchange = this.validateInput
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.validationMessage &&
      this.props.validationMessage !== nextProps.validationMessage) {
      if (nextProps.validationMessage.indexOf('naits.error') > -1) {
        // spawn regular error alert
        this.setState({
          alert: alertUser(
            true, 'error',
            this.context.intl.formatMessage({
              id: nextProps.validationMessage,
              defaultMessage: nextProps.validationMessage
            }),
            '',
            () => {
              this.setState({ alert: alertUser(false, 'info', '') })
              store.dispatch(resetValidation())
            }, undefined, false, undefined, undefined, false, '#5c821a', true
          )
        })
      } else {
        // prompt to move animal
        this.setState({
          alert: alertUser(
            true,
            'warning',
            this.context.intl.formatMessage({
              id: nextProps.validationMessage,
              defaultMessage: nextProps.validationMessage
            }),
            '',
            // on confirm MOVE
            () => {
              // transfer animal to holding if ear tag exists, and close alert
              const animalId = document.getElementById(this.state.elementId).value
              const animalClass = document.getElementById(this.state.animalClassElementId).value
              let object, destinationId
              if (this.props.gridHierarchy.length >= 2) {
                object = this.props.gridHierarchy[1].gridType
                destinationId = this.props.gridHierarchy[1].row[`${object}.OBJECT_ID`]
              } else {
                object = this.props.gridHierarchy[0].gridId
                destinationId = this.props.gridHierarchy[0].row[`${object}.OBJECT_ID`]
              }
              const paramsArray = [{
                MASS_PARAM_ANIMAL_FLOCK_ID: animalId,
                MASS_PARAM_HOLDING_OBJ_ID: destinationId,
                MASS_PARAM_ANIMAL_CLASS: animalClass
              }]
              store.dispatch(transferAnimalOrFlock(this.props.svSession, paramsArray))
              store.dispatch(resetTransferAnimal())
              store.dispatch(resetValidation())
            },
            // on cancel
            () => {
              this.setState({
                alert: alertUser(false, 'info', '')
              })
              document.getElementById(this.state.elementId).value = ''
              store.dispatch(resetTransferAnimal())
              store.dispatch(resetValidation())
            },
            true,
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.actions.move`,
              defaultMessage: `${config.labelBasePath}.actions.move`
            }),
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.forms.cancel`,
              defaultMessage: `${config.labelBasePath}.main.forms.cancel`
            }),
            true,
            '#5c821a',
            true
          )
        })
      }
    }
    if (nextProps.validationError &&
      this.props.validationError !== nextProps.validationError) {
      this.setState({
        alert: alertUser(
          true, formatAlertType(nextProps.validationError),
          nextProps.validationError,
          '',
          () => {
            this.setState({ alert: alertUser(false, 'info', '') })
            store.dispatch(resetValidation())
          }, undefined, false, undefined, undefined, false, '#5c821a', true
        )
      })
    }
    if (nextProps.transferResult &&
      nextProps.transferResult !== this.props.transferResult) {
      let responseDestination = nextProps.transferResult
      const responseType = formatAlertType(responseDestination)
      if (responseType.toLowerCase() === 'success') {
        // get the object aray by splitting the response - it's always the last parameter
        const resArray = responseDestination.split('_')
        let objectId = 'null'
        if (resArray.length > 1) {
          objectId = resArray.pop()
        }
        const responseText = resArray.join('')

        // create custom clickable button since google disallows popups by default
        let element = document.createElement('span')
        element.id = 'alertExtension'

        ReactDOM.render(<button
          id='generate_print'
          className={'swal-button swal-button--danger'}
          onClick={() => {
            // generate print here
            let url = config.svConfig.triglavRestVerbs.GET_REPORT
            url = url.replace('%session', nextProps.svSession)
            url = url.replace('%objectId', objectId)
            url = url.replace('%reportName', 'MHC_Wrapper')
            const report = `${config.svConfig.restSvcBaseUrl}/${url}`
            window.open(report, '_blank')
          }}>
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.print`,
            defaultMessage: `${config.labelBasePath}.print`
          })}
        </button>, element)

        // Provide an option to print the movement document
        this.setState({
          alert: alertUser(
            true,
            responseType,
            this.context.intl.formatMessage({
              id: responseText,
              defaultMessage: responseText
            }),
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.print_movement_doc`,
              defaultMessage: `${config.labelBasePath}.main.print_movement_doc`
            }),
            () => {
              this.setState({ alert: alertUser(false, 'info', '') })
              store.dispatch(resetTransferAnimal())
              this.reloadGridData(nextProps.transferResult)
            },
            null,
            false,
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.forms.close`,
              defaultMessage: `${config.labelBasePath}.main.forms.close`
            }),
            null,
            true,
            '#555',
            true,
            element
          )
        })
      } else {
        this.setState({
          alert: alertUser(
            true, formatAlertType(nextProps.transferResult),
            this.context.intl.formatMessage({
              id: nextProps.transferResult,
              defaultMessage: nextProps.transferResult
            }),
            '',
            () => {
              this.setState({ alert: alertUser(false, 'info', '') })
              store.dispatch(resetValidation())
            }, undefined, false, undefined, undefined, false, '#5c821a', true
          )
        })
      }
    }

    if (this.props.earTagHasBeenChanged !== nextProps.earTagHasBeenChanged) {
      let animalId
      nextProps.gridHierarchy.forEach(grid => {
        if (grid.active && grid.gridType === 'ANIMAL') {
          animalId = grid.row['ANIMAL.ANIMAL_ID']
        }
      })

      const animalIdInput = document.getElementById(this.state.elementId)
      if (animalIdInput && animalId) {
        animalIdInput.value = animalId
      }
    }
  }

  reloadGridData = () => {
    this.setState({ alert: alertUser(false, 'info', '') })
    document.getElementById('modal_close_btn').click()
    const grids = this.props.componentIndex
    for (const key in grids) {
      if (key.indexOf('ANIMAL') > -1) {
        GridManager.reloadGridData(key)
      }
    }
  }

  validateInput (event) {
    event.preventDefault()
    const grids = this.props.gridHierarchy
    let gridType, parentID
    if (grids.length > 0) {
      grids.forEach(grid => {
        if (grid.active) {
          gridType = grid.gridType
          parentID = grid.row[`${gridType}.OBJECT_ID`]
        }
      })
    }
    const animalId = document.getElementById(this.state.elementId).value
    const animalClass = document.getElementById(this.state.animalClassElementId).value
    const formData = this.props.formInstance.state.formTableData
    const parentId = parentID || '0'
    const objectId = formData.OBJECT_ID || '0'
    if (animalId && animalClass && objectId && parentId) {
      store.dispatch(
        validateAnimalId(this.props.svSession, objectId, animalId, animalClass, parentId)
      )
    }
  }

  render () {
    return this.props.children
  }
}

const mapStateToProps = state => ({
  svSession: state.security.svSession,
  gridHierarchy: state.gridConfig.gridHierarchy,
  componentIndex: state.componentIndex,
  validationMessage: state.validationResults.message,
  validationError: state.validationResults.error,
  transferResult: state.directTransfer.result,
  componentToDisplay: state.componentToDisplay.componentToDisplay,
  earTagHasBeenChanged: state.earTagReplacement.earTagHasBeenChanged
})

InputWSValidationWrapper.contextTypes = {
  intl: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(InputWSValidationWrapper)
