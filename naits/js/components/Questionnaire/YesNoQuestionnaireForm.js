import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { connect } from 'react-redux'
import { alertUser } from 'tibro-components'
import { Loading } from 'components/ComponentsIndex'
import * as config from 'config/config'
import { jsonToURI, formatAlertType, strcmp, isValidArray } from 'functions/utils'
import mainStyle from './Questionnaire.module.css'

const initialState = () => {
  return {
    loading: false,
    languages: ['en_US', 'ka_GE'],
    languageLabels: ['english', 'georgian'],
    correctAnswerValues: ['0', '1', '2'],
    correctAnswerLabels: ['yes', 'no', 'n_a'],
    objectTypes: ['ANIMAL', 'HOLDING'],
    questions: ['question1'],
    mandatory: ['isMandatoryquestion1'],
    questionScore: ['questionScorequestion1'],
    correctAnswers: ['correctAnswerquestion1'],
    title: '',
    language: '',
    target: '',
    isSingleInstance: false,
    question1: '',
    isMandatoryquestion1: false,
    questionScorequestion1: '',
    correctAnswerquestion1: ''
  }
}

class YesNoQuestionnaireForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = initialState()
  }

  componentWillUnmount () {
    this.setState(initialState())
  }

  generateCustomQuestionnaireForm = () => {
    const questionnaireLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.questionnaire.create_new_yes_no`,
      defaultMessage: `${config.labelBasePath}.main.questionnaire.create_new_yes_no`
    })
    const questionnaireTitlelabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.questionnaire.title`,
      defaultMessage: `${config.labelBasePath}.main.questionnaire.title`
    })
    const questionnaireLanguageLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.questionnaire.language`,
      defaultMessage: `${config.labelBasePath}.main.questionnaire.language`
    })
    const questionnaireTargetLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.questionnaire.target`,
      defaultMessage: `${config.labelBasePath}.main.questionnaire.target`
    })
    const questionnaireIsSingleInstanceLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.questionnaire.will_be_answered_multiple_times`,
      defaultMessage: `${config.labelBasePath}.main.questionnaire.will_be_answered_multiple_times`
    })
    const questionsSectionLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.questionnaire.define_questions`,
      defaultMessage: `${config.labelBasePath}.main.questionnaire.define_questions`
    })
    const addQuestionLabel = this.context.intl.formatMessage({
      id: config.labelBasePath + '.main.questionnaire.add_question',
      defaultMessage: config.labelBasePath + '.main.questionnaire.add_question'
    })
    const createQuestionnaireLabel = this.context.intl.formatMessage({
      id: config.labelBasePath + '.main.questionnaire.create',
      defaultMessage: config.labelBasePath + '.main.questionnaire.create'
    })
    const { questions, languages, objectTypes, languageLabels, correctAnswerValues, correctAnswerLabels } = this.state
    const form = <form id='questionnaire-form' className={mainStyle['questionnaire-form']} onSubmit={this.submitQuestionnaire} onChange={this.onChange}>
      <div id='first-section'>
        <h1 className={mainStyle['color-white']}>{questionnaireLabel}</h1>
        <div className='form-group field field-object questionnaire-form-section'>
          <div id='questionnaire-title-section' className={mainStyle['single-question-or-answer-input']}>
            <div className={`form-group field field-string ${mainStyle['width-30']}`}>
              <label htmlFor='title' className={mainStyle['color-white']}>{questionnaireTitlelabel}*</label>
              <input type='text' name='title' id='title' value={this.state.title} className='form-control' required />
            </div>
            <div className='form-group field field-string'>
              <label htmlFor='language' className={mainStyle['color-white']}>{questionnaireLanguageLabel}</label>
              <select name='language' id='language' className='form-control' value={this.state.language} required>
                <option id='blankPlaceholder' key='blankPlaceholder' value={''} disabled selected hidden />
                {languages.map((language, index) => <option key={index} value={language} id={language}>
                  {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.main.questionnaire.${languageLabels[index]}`,
                    defaultMessage: `${config.labelBasePath}.main.questionnaire.${languageLabels[index]}`
                  })}
                </option>)}
              </select>
            </div>
            <div className='form-group field field-string'>
              <label htmlFor='target' className={mainStyle['color-white']}>{questionnaireTargetLabel}</label>
              <select name='target' id='target' className='form-control' value={this.state.target} required>
                <option id='blankPlaceholder' key='blankPlaceholder' value={''} disabled selected hidden />
                {objectTypes.map((type, index) => <option key={index} value={type} id={type}>
                  {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.main.${type.toLowerCase()}`,
                    defaultMessage: `${config.labelBasePath}.main.${type.toLowerCase()}`
                  })}
                </option>)}
              </select>
            </div>
            <div className='form-check' style={{ color: '#ffffff', marginRight: '1.5rem', marginTop: '24px', marginLeft: '0.5rem' }}>
              <label htmlFor='isSingleInstance' className={mainStyle['color-white']} style={{ marginRight: '5px' }}>{questionnaireIsSingleInstanceLabel}</label>
              <input type='checkbox' className='form-check-input' style={{ opacity: '1', zIndex: '1', marginTop: '6px' }}
                name='isSingleInstance' id='isSingleInstance' onChange={this.onChange} value='' checked={this.state.isSingleInstance}
              />
            </div>
          </div>
        </div>
      </div>
      <div id='questions-section'>
        <h3 className={mainStyle['color-white']}>{questionsSectionLabel}</h3>
        <div className='form-group field field-object questionnaire-form-section'>
          <div id='questions-input-section'>
            {questions.map((question, index) => {
              const required = index === 0 || index === 1
              return <div id={`question-${index + 1}`} key={`question-${index + 1}`} className={`form-group field field-string ${mainStyle['width-70']}`}>
                <label htmlFor={question} className={mainStyle['color-white']} style={{ marginRight: '25rem' }}>
                  {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.main.questionnaire.question`,
                    defaultMessage: `${config.labelBasePath}.main.questionnaire.question`
                  }) + ` ${index + 1}`} {required && '*'}
                </label>
                <div className={mainStyle['single-question-or-answer-input']}>
                  <input type='text' name={question} id={question} value={this.state[question]} className='form-control' required={required} />
                  <div className='field field-number' style={{ marginTop: '-2.3rem', marginLeft: '-1.5rem' }}>
                    <label htmlFor={`questionScore${question}`} className={mainStyle['color-white']}>Score</label>
                    <input type='number' min={0} name={`questionScore${question}`} id={`questionScore${question}`}
                      onChange={this.onChange} value={this.state[`questionScore${question}`]} className='form-control' style={{ width: '60%' }}
                    />
                  </div>
                  <div className='field field-string' style={{ width: '20%', marginTop: '-2.2rem', marginLeft: '-1.9rem' }}>
                    <label htmlFor={`correctAnswer${question}`} className={mainStyle['color-white']}>Correct answer</label>
                    <select name={`correctAnswer${question}`} id={`correctAnswer${question}`} className='form-control'
                      value={this.state[`correctAnswer${question}`]} onChange={this.onChange}
                    >
                      <option id='blankPlaceholder' key='blankPlaceholder' value={''} disabled selected hidden />
                      {correctAnswerValues.map((value, index) => <option key={index} value={value}>
                        {this.context.intl.formatMessage({
                          id: `${config.labelBasePath}.main.${correctAnswerLabels[index]}`,
                          defaultMessage: `${config.labelBasePath}.main.${correctAnswerLabels[index]}`
                        })}
                      </option>)}
                    </select>
                  </div>
                  <div className='form-check' style={{ color: '#ffffff', marginRight: '1.5rem', marginTop: '5px', marginLeft: '0.5rem' }}>
                    <label className='form-check-label' style={{ marginRight: '0.5rem' }} htmlFor={`isMandatory${question}`}>
                      Mandatory
                    </label>
                    <input className='form-check-input' style={{ opacity: '1', zIndex: '1', marginTop: '6px' }} type='checkbox'
                      name={`isMandatory${question}`} id={`isMandatory${question}`} value='' checked={this.state[`isMandatory${question}`]} />
                  </div>
                </div>
              </div>
            })}
          </div>
          {!isValidArray(questions, 30) && <i className={`fa fa-plus ${mainStyle['icon']}`} aria-hidden='true'
            onClick={this.addQuestion} title={addQuestionLabel} />}
        </div>
      </div>
      <div id='btnSeparator' className='questionnaire-form-btn-separator'>
        <button type='submit' id='save_form_btn' className={`btn-success btn_save_form ${mainStyle['submit-questionnaire-btn']}`}>
          {createQuestionnaireLabel}
        </button>
      </div>
    </form>

    return form
  }

  addQuestion = () => {
    const { questions, mandatory, questionScore, correctAnswers } = this.state
    mandatory.push(`isMandatoryquestion${questions.length + 1}`)
    questionScore.push(`questionScorequestion${questions.length + 1}`)
    correctAnswers.push(`correctAnswerquestion${questions.length + 1}`)
    questions.push(`question${questions.length + 1}`)
    this.setState({ questions, mandatory, questionScore })
  }

  onChange = e => {
    if (e.target.name.includes('isMandatory') || e.target.name.includes('isSingle')) {
      this.setState({ [e.target.name]: e.target.checked })
    } else {
      this.setState({ [e.target.name]: e.target.value })
    }
  }

  submitQuestionnaire = e => {
    e.preventDefault()
    this.setState({ loading: true })
    const { questions, mandatory, questionScore, correctAnswers, title, language, target, isSingleInstance } = this.state
    const { session } = this.props
    const verbPath = config.svConfig.triglavRestVerbs.CREATE_NEW_SVAROG_FORM_TYPE
    const url = `${config.svConfig.restSvcBaseUrl}${verbPath}/${session}`
    // Get the questions
    let questionsArr = []
    questions.forEach(question => {
      questionsArr.push(this.state[question])
    })
    questionsArr = questionsArr.map(question => question.trim())
    // Get the info about whether a question is mandatory
    let mandatoryQuestions = []
    mandatory.forEach((mandatoryQuestion, index) => {
      mandatoryQuestions.push({ [`IS_MANDATORY ${questionsArr[index]}`]: this.state[mandatoryQuestion] || false })
    })
    let questionScores = []
    questionScore.forEach((score, index) => {
      questionScores.push({ [`SCORE ${questionsArr[index]}`]: this.state[score] || 0 })
    })
    let correctAnswersArr = []
    correctAnswers.forEach((correctAnswer, index) => {
      correctAnswersArr.push({ [`CORRECT_ANSWER ${questionsArr[index]}`]: this.state[correctAnswer] || '' })
    })
    const stringifiedQuestions = questionsArr.join('/#/ ')
    const dataObj = {
      FORM_CATEGORY: '2',
      FIELD_TYPE: 'TEXT',
      MULTI_ENTRY: 'false',
      IS_MANDATORY: 'true',
      IS_NULL: 'true',
      IS_UNIQUE: 'true',
      LOCALE_ID: language,
      QUESTIONNAIRE_TITLE: title.trim(),
      QUESTION: stringifiedQuestions,
      OBJECT_TYPE: target,
      AUTOINSTANCE_SINGLE: !isSingleInstance
    }
    mandatoryQuestions.forEach(mandatoryInfo => Object.assign(dataObj, mandatoryInfo))
    questionScores.forEach(score => Object.assign(dataObj, score))
    correctAnswersArr.forEach(correctAnswer => Object.assign(dataObj, correctAnswer))
    const data = jsonToURI(dataObj)
    const reqConfig = { method: 'post', url, data }
    axios(reqConfig).then(res => {
      if (res.data) {
        this.setState({ loading: false })
        const responseType = formatAlertType(res.data)
        const responseLabel = this.context.intl.formatMessage({ id: res.data, defaultMessage: res.data })
        alertUser(true, responseType, responseLabel)
        if (strcmp(responseType, 'success')) {
          this.setState(initialState())
          questions.forEach(question => {
            this.setState({ [question]: '' })
            if (!strcmp(question, 'q1')) {
              this.setState({
                [`isMandatory${question}`]: false,
                [`questionScore${question}`]: '',
                [`correctAnswer${question}`]: ''
              })
            }
          })
        }
      }
    }).catch(err => {
      console.error(err)
      this.setState({ loading: false })
      alertUser(true, 'error', err)
    })
  }

  render () {
    return <React.Fragment>
      {this.state.loading && <Loading />}
      {this.generateCustomQuestionnaireForm()}
    </React.Fragment>
  }
}

YesNoQuestionnaireForm.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession,
  locale: state.intl.locale
})

export default connect(mapStateToProps)(YesNoQuestionnaireForm)
