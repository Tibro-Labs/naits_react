import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as config from 'config/config.js'
import { Loading, ComponentManager, GridManager } from 'components/ComponentsIndex'
import { DependencyDropdowns, alertUser } from 'tibro-components'
import { dropdownConfig } from 'config/dropdownConfig.js'
import { store } from 'tibro-redux'
import { generateAnimalsAction, resetAnimal } from 'backend/generateAnimalsAction'
import { strcmp, formatAlertType } from 'functions/utils'
import style from 'components/AppComponents/Functional/EarTagReplacement/EarTagReplacement.module.css'

class MassAnimalForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      startTagId: '',
      endTagId: '',
      animalGender: '',
      animalGenders: [],
      birthDate: '',
      loading: false
    }
  }

  componentDidMount () {
    // Get all the animal genders from config
    this.setState({ animalGenders: dropdownConfig('GENDER_DROPDOWN'), animalGender: '1' })
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  setDate = date => {
    this.setState({ birthDate: date })
  }

  generateMassAnimals = () => {
    const { startTagId, endTagId, animalGender, birthDate } = this.state
    let gridType = this.props.gridType
    let objectId
    if (this.props.selectedObjects.length > 0) {
      for (let i = 0; i < this.props.selectedObjects.length; i++) {
        if (this.props.selectedObjects[i].active || strcmp(this.props.selectedObjects[i].gridType, 'HOLDING')) {
          gridType = this.props.selectedObjects[i].gridType
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
    const startTagIdLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.mass_animal_form.animal_start_tag_id`,
      defaultMessage: `${config.labelBasePath}.mass_animal_form.animal_start_tag_id`
    })
    const endTagIdLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.mass_animal_form.animal_end_tag_id`,
      defaultMessage: `${config.labelBasePath}.mass_animal_form.animal_end_tag_id`
    })
    const animalClassLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.animal.animal_class`,
      defaultMessage: `${config.labelBasePath}.main.animal.animal_class`
    })
    const animalBreedLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.animal.animal_race`,
      defaultMessage: `${config.labelBasePath}.main.animal.animal_race`
    })
    const genderLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.animal.gender`,
      defaultMessage: `${config.labelBasePath}.main.animal.gender`
    })
    const birthDateLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.animal.birth_date`,
      defaultMessage: `${config.labelBasePath}.main.animal.birth_date`
    })

    const animalClassElement = document.getElementById('root_animal.description_ANIMAL_CLASS')
    const animalBreedElement = document.getElementById('root_animal.description_ANIMAL_RACE')
    let selectedAnimalClass = ''
    let selectedAnimalBreed = ''
    if (animalClassElement) {
      selectedAnimalClass = animalClassElement.options[animalClassElement.selectedIndex].value
    }
    if (animalBreedElement) {
      selectedAnimalBreed = animalBreedElement.options[animalBreedElement.selectedIndex].value
    }

    if (objectId && startTagId && endTagId && selectedAnimalClass && selectedAnimalBreed && birthDate) {
      prompt(this, () => {
        this.setState({ loading: true })
        this.props.generateAnimalsAction(this.props.svSession,
          objectId, startTagId, endTagId, selectedAnimalClass, selectedAnimalBreed, animalGender, birthDate)
      })
    } else {
      let message = ''
      if (!startTagId) message = message + startTagIdLabel + ' '
      if (!endTagId) message = message + endTagIdLabel + ' '
      if (!selectedAnimalClass) message = message + animalClassLabel + ' '
      if (!selectedAnimalBreed) message = message + animalBreedLabel + ' '
      if (!animalGender) message = message + genderLabel + ' '
      if (!birthDate) message = message + birthDateLabel + ' '
      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.parameters_missing`,
            defaultMessage: `${config.labelBasePath}.alert.parameters_missing`
          }), message, () => this.setState({ alert: alertUser(false, 'info', '') }))
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
      this.props.onAlertClose()
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
    }
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
    const { loading, birthDate } = this.state
    const nowBtnText = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.now`,
      defaultMessage: `${config.labelBasePath}.main.now`
    })

    return (
      <React.Fragment>
        <div id='form_modal' className='modal' style={{ display: 'block' }}>
          <div id='form_modal_content' className='modal-content disable_scroll_bar'>
            <div className='modal-header'>
              <button id='modal_close_btn' type='button' className='close'
                onClick={this.props.closeModal} >&times;</button>
            </div>
            <div id='form_modal_body' className='modal-body'>
              <div id='mass_animal_form' className='form-test custom-modal-content disable_scroll_bar'>
                <legend style={{ textAlign: 'center', marginTop: '1rem' }}>
                  {this.context.intl.formatMessage({
                    id: config.labelBasePath + '.generate_mass_animal',
                    defaultMessage: config.labelBasePath + '.generate_mass_animal'
                  })}
                </legend>
                <div className='form-group field field-object' style={{ textAlign: 'center' }}>
                  <fieldset>
                    <div className='form-group field field-string'>
                      <label htmlFor='startTagId'>
                        {this.context.intl.formatMessage({
                          id: config.labelBasePath + '.mass_animal_form.animal_start_tag_id',
                          defaultMessage: config.labelBasePath + '.mass_animal_form.animal_start_tag_id'
                        })}*
                      </label>
                      <input
                        id='startTagId'
                        name='startTagId'
                        className='form-control'
                        onChange={this.onChange}
                        placeholder={this.context.intl.formatMessage({
                          id: `${config.labelBasePath}.register.must_be_integer`,
                          defaultMessage: `${config.labelBasePath}.register.must_be_integer`
                        })}
                      />
                    </div>
                    <div className='form-group field field-string'>
                      <label htmlFor='endTagId'>
                        {this.context.intl.formatMessage({
                          id: config.labelBasePath + '.mass_animal_form.animal_end_tag_id',
                          defaultMessage: config.labelBasePath + '.mass_animal_form.animal_end_tag_id'
                        })}*
                      </label>
                      <input
                        id='endTagId'
                        name='endTagId'
                        className='form-control'
                        onChange={this.onChange}
                        placeholder={this.context.intl.formatMessage({
                          id: `${config.labelBasePath}.register.must_be_integer`,
                          defaultMessage: `${config.labelBasePath}.register.must_be_integer`
                        })}
                      />
                    </div>
                    <div className='form-group field field-string'>
                      <DependencyDropdowns tableName='ANIMAL' />
                    </div>
                    <div className='form-group field field-string'>
                      <label htmlFor='animalGender'>
                        {this.context.intl.formatMessage({
                          id: config.labelBasePath + '.main.animal.gender',
                          defaultMessage: config.labelBasePath + '.main.animal.gender'
                        })}*
                      </label>
                      <select id='animalGender' name='animalGender' className='form-control' onChange={this.onChange}>
                        {this.state.animalGenders.map(animalGender => {
                          return <option key={animalGender.VALUE} value={animalGender.VALUE}>
                            {this.context.intl.formatMessage({
                              id: animalGender.LABEL,
                              defaultMessage: animalGender.LABEL
                            })}
                          </option>
                        })}
                      </select>
                    </div>
                    <div className='form-group field field-string'>
                      <label htmlFor='birthDate'>
                        {this.context.intl.formatMessage({
                          id: config.labelBasePath + '.main.animal.birth_date',
                          defaultMessage: config.labelBasePath + '.main.animal.birth_date'
                        })}*
                      </label>
                      <div id='CustomDateWithNowButton' className={style.CustomDate}>
                        <input type='date' className='form-control' name='birthDate' id='birthDate'
                          onChange={(e) => this.setDate(e.target.value)} value={birthDate}
                        />
                        <button type='button' className='btn-success btn_save_form' id='setDateNowBtn'
                          onClick={() => this.setDate(new Date().toISOString().substr(0, 19).split('T')[0])}
                        >{nowBtnText}</button>
                      </div>
                    </div>
                  </fieldset>
                </div>
                <div style={{ float: 'right', marginRight: '2rem' }}>
                  <button id='massAnimalGenerator' className='btn-success btn_save_form' onClick={this.generateMassAnimals}>
                    {this.context.intl.formatMessage({
                      id: config.labelBasePath + '.generate_mass_animal',
                      defaultMessage: config.labelBasePath + '.generate_mass_animal'
                    })}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {loading && <Loading />}
      </React.Fragment>
    )
  }
}

MassAnimalForm.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapDispatchToProps = dispatch => ({
  generateAnimalsAction: (...params) => {
    dispatch(generateAnimalsAction(...params))
  }
})

const mapStateToProps = state => ({
  admConsoleRequests: state.admConsoleRequests,
  selectedObjects: state.gridConfig.gridHierarchy,
  generateAnimalsMessage: state.generateAnimals.message,
  generateAnimalsError: state.generateAnimals.error,
  componentToDisplay: state.componentToDisplay.componentToDisplay
})

export default connect(mapStateToProps, mapDispatchToProps)(MassAnimalForm)
