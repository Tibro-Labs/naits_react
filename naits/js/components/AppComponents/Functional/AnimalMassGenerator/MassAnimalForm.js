import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as config from 'config/config.js'
import { Loading, ComponentManager, GridManager } from 'components/ComponentsIndex'
import consoleStyle from 'components/AppComponents/Functional/AdminConsole/AdminConsole.module.css'
import { alertUser } from 'tibro-components'
import { dropdownConfig } from 'config/dropdownConfig.js'
import { store } from 'tibro-redux'
import { generateAnimalsAction, resetAnimal } from 'backend/generateAnimalsAction'
import { formatAlertType } from 'functions/utils'

class MassAnimalForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      animal_start_tag_id: '',
      animal_end_tag_id: '',
      animalGroups: null,
      startTagId: 'animal_start_tag_id',
      endTagId: 'animal_end_tag_id',
      animalGroup: null,
      setDropdownData: 'animalGroups',
      loading: false
    }
  }

  componentDidMount () {
    let config = dropdownConfig('ANIMAL_CATEGORY_DROPDOWN')
    // functional setState
    let options = []
    for (let key in config) {
      if (config.hasOwnProperty(key)) {
        const value = config[key]
        options.push(<option key={value} value={key}>
          {this.context.intl.formatMessage({ id: value.LABEL, defaultMessage: value.LABEL })}
        </option>)
      }
    }
    this.setState({ dropdownData: options })
  }
  chooseAnimalGroups = (event) => {
    this.setState({ 'animalGroup': event.target.value })
  }

  generateMassAnimals = () => {
    const { startTagId, endTagId, setDropdownData } = this.state
    const inputStartTagContainer = document.getElementById(startTagId).value
    const inputEndTagContainer = document.getElementById(endTagId).value
    const inputDropDownData = document.getElementById(setDropdownData).value
    let gridType = this.props.gridType
    let objectId
    if (this.props.selectedObjects.length > 0) {
      for (let i = 0; i < this.props.selectedObjects.length; i++) {
        if (this.props.selectedObjects[i].active) {
          gridType = this.props.selectedObjects[i].gridId
          objectId = this.props.selectedObjects[i].row[`${gridType}.OBJECT_ID`]
        }
      }
    }
    function prompt (component, onConfirmCallback) {
      component.setState({
        alert: alertUser(
          true,
          'warning',
          component.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.prompt_text`,
            defaultMessage: `${config.labelBasePath}.actions.prompt_text`
          }) + ' ' + '"' +
          component.context.intl.formatMessage({
            id: `${config.labelBasePath}.generate_mass_animal`,
            defaultMessage: `${config.labelBasePath}.generate_mass_animal`
          }) + '"' + '?',
          null,
          onConfirmCallback,
          () => component.setState({ alert: alertUser(false, 'info', '') }),
          true,
          component.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.execute`,
            defaultMessage: `${config.labelBasePath}.actions.execute`
          }),
          component.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.forms.cancel`,
            defaultMessage: `${config.labelBasePath}.main.forms.cancel`
          }),
          true,
          null,
          true
        )
      })
    }
    const inputStartTagContainerLbl = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.mass_animal_form.animal_start_tag_id`,
      defaultMessage: `${config.labelBasePath}.mass_animal_form.animal_start_tag_id`
    })
    const inputEndTagContainerLbl = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.mass_animal_form.animal_end_tag_id`,
      defaultMessage: `${config.labelBasePath}.mass_animal_form.animal_end_tag_id`
    })
    const inputDropDownDataLbl = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.mass_animal_form.animal_groups`,
      defaultMessage: `${config.labelBasePath}.mass_animal_form.animal_groups`
    })
    if (objectId && inputStartTagContainer && inputEndTagContainer && inputDropDownData) {
      prompt(this, () => {
        this.setState({ loading: true })
        this.props.generateAnimalsAction(this.props.svSession,
          objectId, inputStartTagContainer, inputEndTagContainer, inputDropDownData)
      })
    } else {
      let message = ''
      if (!inputStartTagContainer) message = message + inputStartTagContainerLbl + ' '
      if (!inputEndTagContainer) message = message + inputEndTagContainerLbl + ' '
      if (!inputDropDownData) message = message + inputDropDownDataLbl + ' '
      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.parameters_missing`,
            defaultMessage: `${config.labelBasePath}.alert.parameters_missing`
          }),
          message,
          () => this.setState({ alert: alertUser(false, 'info', '') }))
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    if ((this.props.generateAnimalsMessage !== nextProps.generateAnimalsMessage) &&
      nextProps.generateAnimalsMessage) {
      this.setState({
        alert: alertUser(true, formatAlertType(nextProps.generateAnimalsMessage), this.context.intl.formatMessage({
          id: nextProps.generateAnimalsMessage,
          defaultMessage: nextProps.generateAnimalsMessage
        }) || '', null,
        () => {
          store.dispatch(resetAnimal())
        })
      })
      this.setState({ loading: false })
      this.reloadData(nextProps)
    }
    if ((this.props.generateAnimalsError !== nextProps.generateAnimalsError) &&
      nextProps.generateAnimalsError) {
      this.setState({
        alert: alertUser(true, formatAlertType(nextProps.generateAnimalsError), this.context.intl.formatMessage({
          id: nextProps.generateAnimalsError,
          defaultMessage: nextProps.generateAnimalsError
        }) || '', null,
        () => {
          store.dispatch(resetAnimal())
        })
      })
      this.setState({ loading: false })
      this.reloadData(nextProps)
    }
    this.props.onAlertClose()
  }

  reloadData = (props) => {
    let componentToDisplay = this.props.componentToDisplay
    let key, gridId
    if (componentToDisplay.length > 0) {
      for (let i = 0; i < componentToDisplay.length; i++) {
        key = componentToDisplay[i].key
        if (key) {
          gridId = key
        }
      }
    }
    ComponentManager.setStateForComponent(gridId + '1', 'selectedIndexes', [])
    GridManager.reloadGridData(gridId + '1')
  }
  render () {
    const { loading } = this.state

    return (
      <div id='form_modal' className='modal' style={{ display: 'block' }}>
        <div id='form_modal_content' className='modal-content disable_scroll_bar'>
          {loading && <Loading />}
          <div className='modal-header'>
            <button id='modal_close_btn' type='button' className='close'
              onClick={this.props.closeModal} >&times;</button>
          </div>
          <div id='form_modal_body' className='modal-body'>
            <form id='mass_animal_form' className='form-test custom-modal-content disable_scroll_bar'>
              <p id='title' style={{ marginTop: '0.8%', fontSize: '150%' }}>{this.context.intl.formatMessage({
                id: config.labelBasePath + '.generate_mass_animal',
                defaultMessage: config.labelBasePath + '.generate_mass_animal'
              })} </p>
              <hr style={{ color: 'white' }} />
              <div className={'form-group' + ' ' + consoleStyle.formGroupInline}
                style={{ marginLeft: '1%', marginTop: '1.5%' }}>
                <label htmlFor='animalGroup' style={{ marginLeft: '44%' }}>
                  {this.context.intl.formatMessage({
                    id: config.labelBasePath + '.mass_animal_form.animal_groups',
                    defaultMessage: config.labelBasePath + '.mass_animal_form.animal_groups'
                  })} *
                </label>
                <div className='form-group'>
                  <select id='animalGroups'
                    className={consoleStyle.dropdown} style={{ marginLeft: '46%' }}
                    onChange={this.chooseAnimalGroups}
                  >
                    <option
                      id='blankPlaceholder'
                      key='blankPlaceholder'
                      disabled defaultValue hidden
                    >
                      {this.context.intl.formatMessage(
                        {
                          id: config.labelBasePath + '.mass_animal_form.animal_groups',
                          defaultMessage: config.labelBasePath + '.mass_animal_form.animal_groups'
                        }
                      )}
                    </option>
                    {this.state.dropdownData}
                  </select>
                </div>
              </div>
              <div className={'form-group' + ' ' + consoleStyle.formGroupInline}>
                <label htmlFor='animal_start_tag_id' style={{ marginLeft: '-3%' }}>
                  {this.context.intl.formatMessage({
                    id: config.labelBasePath + '.mass_animal_form.animal_start_tag_id',
                    defaultMessage: config.labelBasePath + '.mass_animal_form.animal_start_tag_id'
                  })} *
                </label>
                <input
                  id='animal_start_tag_id'
                  className='form-control'
                  style={{ marginLeft: '28%', width: '45%' }}
                  placeholder={this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.register.must_be_integer`,
                    defaultMessage: `${config.labelBasePath}.register.must_be_integer`
                  })}
                />
              </div>
              <div className={'form-group' + ' ' + consoleStyle.formGroupInline}>
                <label htmlFor='animal_end_tag_id' style={{ marginLeft: '-59%' }}>
                  {this.context.intl.formatMessage({
                    id: config.labelBasePath + '.mass_animal_form.animal_end_tag_id',
                    defaultMessage: config.labelBasePath + '.mass_animal_form.animal_end_tag_id'
                  })} *
                </label>
                <input
                  id='animal_end_tag_id'
                  className='form-control'
                  style={{ marginLeft: '1%', width: '45%' }}
                  placeholder={this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.register.must_be_integer`,
                    defaultMessage: `${config.labelBasePath}.register.must_be_integer`
                  })}
                />
              </div>
              <div className='form-group' style={{ marginTop: '2%' }}>
                <div
                  id='massAnimalGenerator'
                  className='btn_save_form'
                  onClick={() => this.generateMassAnimals()}>{this.context.intl.formatMessage({
                    id: config.labelBasePath + '.generate_mass_animal',
                    defaultMessage: config.labelBasePath + '.generate_mass_animal'
                  })}</div>
              </div>
            </form>
          </div>
        </div>
      </div>

    )
  }
}

const mapDispatchToProps = dispatch => ({
  generateAnimalsAction: (...params) => {
    dispatch(generateAnimalsAction(...params))
  }
})

MassAnimalForm.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  admConsoleRequests: state.admConsoleRequests,
  selectedObjects: state.gridConfig.gridHierarchy,
  generateAnimalsMessage: state.generateAnimals.message,
  generateAnimalsError: state.generateAnimals.error,
  componentToDisplay: state.componentToDisplay.componentToDisplay
})

export default connect(mapStateToProps, mapDispatchToProps)(MassAnimalForm)
