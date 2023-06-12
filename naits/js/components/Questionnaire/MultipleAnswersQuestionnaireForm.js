import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { connect } from 'react-redux'
import { alertUser } from 'tibro-components'
import { Loading } from 'components/ComponentsIndex'
import * as config from 'config/config'
import { strcmp, isValidArray, jsonToURI, formatAlertType } from 'functions/utils'
import mainStyle from './Questionnaire.module.css'

const initialState = () => {
  return {
    loading: false,
    languages: ['en_US', 'ka_GE'],
    languageLabels: ['english', 'georgian'],
    objectTypes: ['ANIMAL', 'HOLDING'],
    questions: ['q1'],
    mandatory: ['isMandatoryq1'],
    hasMultiple: ['hasMultipleq1'],
    longAnswers: ['longAnswersq1'],
    shortAnswers: ['shortAnswersq1'],
    defineAnswers: ['defineAnswersq1'],
    questionScore: ['questionScoreq1'],
    q1answers: ['q1a1', 'q1a2'],
    q1answerScore: ['answerScoreq1a1', 'answerScoreq1a2'],
    q1correctAnswer: ['correctAnswerq1a1', 'correctAnswerq1a2'],
    title: '',
    language: '',
    target: '',
    isSingleInstance: false,
    q1: '',
    q1a1: '',
    q1a2: '',
    isMandatoryq1: false,
    hasMultipleq1: false,
    defineAnswersq1: 'DEFINE_ANSWERS',
    longAnswersq1: false,
    shortAnswersq1: false,
    questionScoreq1: '',
    answerScoreq1a1: '',
    answerScoreq1a2: '',
    correctAnswerq1a1: false,
    correctAnswerq1a2: false
  }
}

class MultipleAnswersQuestionnaireForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = initialState()
  }

  componentWillUnmount () {
    this.setState(initialState())
  }

  generateCustomQuestionnaireForm = () => {
    const questionnaireLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.questionnaire.create_new_multiple_answers`,
      defaultMessage: `${config.labelBasePath}.main.questionnaire.create_new_multiple_answers`
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

    const { questions, languages, objectTypes, languageLabels } = this.state
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
            {this.generateQuestionsAndAnswers()}
          </div>
        </div>
      </div>
      {!isValidArray(questions, 30) && <i className={`fa fa-plus ${mainStyle['icon']}`} aria-hidden='true'
        onClick={this.addQuestion} title={addQuestionLabel} />}
      <div id='btnSeparator' className='questionnaire-form-btn-separator'>
        <button type='submit' id='save_form_btn' className={`btn-success btn_save_form ${mainStyle['submit-questionnaire-btn']}`}>
          {createQuestionnaireLabel}
        </button>
      </div>
    </form>

    return form
  }

  generateQuestionsAndAnswers = () => {
    const { questions } = this.state
    const questionLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.questionnaire.question`,
      defaultMessage: `${config.labelBasePath}.main.questionnaire.question`
    })
    const answerLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.questionnaire.answer`,
      defaultMessage: `${config.labelBasePath}.main.questionnaire.answer`
    })
    const addAnswerLabel = this.context.intl.formatMessage({
      id: config.labelBasePath + '.main.questionnaire.add_answer',
      defaultMessage: config.labelBasePath + '.main.questionnaire.add_answer'
    })
    const longAnswerLabel = this.context.intl.formatMessage({
      id: config.labelBasePath + '.main.questionnaire.long_answer',
      defaultMessage: config.labelBasePath + '.main.questionnaire.long_answer'
    })
    const shortAnswerLabel = this.context.intl.formatMessage({
      id: config.labelBasePath + '.main.questionnaire.short_answer',
      defaultMessage: config.labelBasePath + '.main.questionnaire.short_answer'
    })
    const mandatoryLabel = this.context.intl.formatMessage({
      id: config.labelBasePath + '.main.questionnaire.mandatory',
      defaultMessage: config.labelBasePath + '.main.questionnaire.mandatory'
    })
    const multipleAnswersLabel = this.context.intl.formatMessage({
      id: config.labelBasePath + '.main.questionnaire.multiple_answers',
      defaultMessage: config.labelBasePath + '.main.questionnaire.multiple_answers'
    })
    const correctAnswerLabel = this.context.intl.formatMessage({
      id: config.labelBasePath + '.main.questionnaire.correct_answer',
      defaultMessage: config.labelBasePath + '.main.questionnaire.correct_answer'
    })
    const scoreLabel = this.context.intl.formatMessage({
      id: config.labelBasePath + '.main.questionnaire.score',
      defaultMessage: config.labelBasePath + '.main.questionnaire.score'
    })

    return questions.map((question, index) => (
      <div id={`question-${index + 1}`} key={`question-${index + 1}`} className={`form-group field field-string ${mainStyle['width-70']}`}>
        <label htmlFor={question} className={`${mainStyle['color-white']} ${mainStyle['question-label']}`} style={{ marginRight: '10rem' }}>
          {`${questionLabel} ${index + 1}`}*
        </label>
        <div id={`question-${index + 1}`} className={mainStyle['single-question-or-answer-input']}>
          <input type='text' name={question} id={question} value={this.state[question]} className='form-control' required />
          <div className='field field-number' style={{ marginTop: '-2.26rem', marginLeft: '-2.5rem' }}>
            <label htmlFor={`questionScore${question}`} className={mainStyle['color-white']}>{scoreLabel}</label>
            <input type='number' min={1} name={`questionScore${question}`} id={`questionScore${question}`}
              onChange={this.onChange} value={this.state[`questionScore${question}`]} className='form-control' style={{ width: '50%' }}
              disabled={this.state[`hasMultiple${question}`]}
            />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <div className='form-check' style={{ color: '#ffffff', marginRight: '1.5rem', marginTop: '5px', marginLeft: '0.5rem' }}>
            <label className='form-check-label' style={{ marginRight: '0.5rem' }} htmlFor={`longAnswersq${index + 1}`}>
              {longAnswerLabel}
            </label>
            <input className='form-check-input' style={{ opacity: '1', zIndex: '1', marginTop: '6px' }} type='checkbox'
              name={`longAnswersq${index + 1}`} id={`longAnswersq${index + 1}`} value='' checked={this.state[`longAnswersq${index + 1}`]}
              disabled={this.state[`shortAnswersq${index + 1}`] || this.state[`hasMultipleq${index + 1}`]} />
          </div>
          <div className='form-check' style={{ color: '#ffffff', marginRight: '1.5rem', marginTop: '5px', marginLeft: '0.5rem' }}>
            <label className='form-check-label' style={{ marginRight: '0.5rem' }} htmlFor={`shortAnswersq${index + 1}`}>
              {shortAnswerLabel}
            </label>
            <input className='form-check-input' style={{ opacity: '1', zIndex: '1', marginTop: '6px' }} type='checkbox'
              name={`shortAnswersq${index + 1}`} id={`shortAnswersq${index + 1}`} value='' checked={this.state[`shortAnswersq${index + 1}`]}
              disabled={this.state[`longAnswersq${index + 1}`] || this.state[`hasMultipleq${index + 1}`]} />
          </div>
          <div className='form-check' style={{ color: '#ffffff', marginRight: '1.5rem', marginTop: '5px', marginLeft: '0.5rem' }}>
            <label className='form-check-label' style={{ marginRight: '0.5rem' }} htmlFor={`isMandatory${question}`}>
              {mandatoryLabel}
            </label>
            <input className='form-check-input' style={{ opacity: '1', zIndex: '1', marginTop: '6px' }} type='checkbox'
              name={`isMandatory${question}`} id={`isMandatory${question}`} value='' checked={this.state[`isMandatory${question}`]} />
          </div>
          <div className='form-check' style={{ color: '#ffffff', marginRight: '1.5rem', marginTop: '5px', marginLeft: '0.5rem' }}>
            <label className='form-check-label' style={{ marginRight: '0.5rem' }} htmlFor={`hasMultiple${question}`}>
              {multipleAnswersLabel}
            </label>
            <input className='form-check-input' style={{ opacity: '1', zIndex: '1', marginTop: '6px' }} type='checkbox'
              name={`hasMultiple${question}`} id={`hasMultiple${question}`} value='' checked={this.state[`hasMultiple${question}`]}
              disabled={this.state[`shortAnswersq${index + 1}`] || this.state[`longAnswersq${index + 1}`]} />
          </div>
        </div>
        {!strcmp(this.state[`defineAnswersq${index + 1}`], 'short') && !strcmp(this.state[`defineAnswersq${index + 1}`], 'long') &&
          <div id={`answers${index + 1}`} className={mainStyle['answers']}>
            {isValidArray(this.state[`${question}answers`], 1) && this.state[`${question}answers`].map((answer, index) => {
              return <React.Fragment key={index}>
                <label htmlFor={answer} className={`${mainStyle['color-white']} ${mainStyle['answer-label']}`} style={{ marginRight: '20rem' }}>{answerLabel}*</label>
                <div id={`answer-${index + 1}`} className={mainStyle['single-question-or-answer-input']}>
                  <input type='text' name={answer} id={answer} value={this.state[answer]}
                    className={`form-control ${mainStyle['answer-input']}`} style={{ marginRight: '-1rem' }} required
                  />
                  <div className='field field-number' style={{ marginTop: '-2.26rem', marginLeft: '-2.5rem', marginRight: '-1.2rem' }}>
                    <label htmlFor={`answerScore${answer}`} className={mainStyle['color-white']}>{scoreLabel}</label>
                    <input type='number' min={1} name={`answerScore${answer}`} id={`answerScore${answer}`} onChange={this.onChange}
                      value={this.state[`answerScore${answer}`]} className='form-control' style={{ width: '44%' }} disabled={!this.state[`hasMultiple${question}`]}
                    />
                  </div>
                  <div className='form-check' style={{ color: '#ffffff', width: '20%', marginRight: '1.5rem', marginTop: '5px', marginLeft: '-3rem' }}>
                    <label className='form-check-label' style={{ marginRight: '0.5rem' }} htmlFor={`correctAnswer${answer}`}>
                      {correctAnswerLabel}
                    </label>
                    <input className='form-check-input' style={{ opacity: '1', zIndex: '1', marginTop: '6px' }} type='checkbox'
                      name={`correctAnswer${answer}`} id={`correctAnswer${answer}`} value=''
                      checked={this.state[`correctAnswer${answer}`]} disabled={this.state[`answerScore${answer}`]}
                    />
                  </div>
                </div>
                {index === this.state[`${question}answers`].length - 1 && !isValidArray(this.state[`${question}answers`], 5) &&
                  <i className={`fa fa-plus ${mainStyle['add-answer-icon']}`} aria-hidden='true' title={addAnswerLabel} onClick={() => this.addAnswer(question)} />
                }
              </React.Fragment>
            })}
          </div>}
      </div>
    ))
  }

  onChange = e => {
    if (e.target.name.includes('isMandatory') || e.target.name.includes('isSingle')) {
      this.setState({ [e.target.name]: e.target.checked })
    } else if (e.target.name.includes('hasMultiple')) {
      this.setState({ [e.target.name]: e.target.checked })
      const inputName = e.target.name
      const questionIndex = inputName.match(/(\d+|[^\d]+)/g).join(',').split(',')[1]
      if (e.target.checked) {
        if (this.state[`questionScoreq${questionIndex}`]) {
          this.setState({ [`questionScoreq${questionIndex}`]: '' })
        }
      } else {
        const currentQuestionAnswerScoresArr = this.state[`q${questionIndex}answerScore`]
        const clonedQuestionAnswerScoresArr = currentQuestionAnswerScoresArr.slice()
        clonedQuestionAnswerScoresArr.forEach(score => this.setState({ [score]: '' }))
        const currentCorrectAnswersArr = this.state[`q${questionIndex}correctAnswer`]
        const clonedCorrectAnswersArr = currentCorrectAnswersArr.slice()
        clonedCorrectAnswersArr.forEach(correctAnswer => this.setState({ [correctAnswer]: false }))
      }
    } else if (e.target.name.includes('correctAnswer')) {
      this.setState({ [e.target.name]: e.target.checked })
      const inputName = e.target.name
      const questionIndex = inputName.match(/(\d+|[^\d]+)/g).join(',').split(',')[1]
      const currentCorrectAnswersArr = this.state[`q${questionIndex}correctAnswer`]
      const clonedCorrectAnswersArr = currentCorrectAnswersArr.slice()
      const answerToExclude = inputName.match(/(\d+|[^\d]+)/g)[3]
      clonedCorrectAnswersArr.splice(answerToExclude - 1, 1)
      if (!this.state[`hasMultipleq${questionIndex}`]) {
        clonedCorrectAnswersArr.forEach(correctAnswer => this.setState({ [correctAnswer]: false }))
      }
    } else if (e.target.name.includes('answerScore')) {
      this.setState({ [e.target.name]: e.target.value })
      const inputName = e.target.name
      const questionIndex = inputName.match(/(\d+|[^\d]+)/g).join(',').split(',')[1]
      const answerIndex = inputName.match(/(\d+|[^\d]+)/g).join(',').split(',')[3]
      const currentCorrectAnswersArr = this.state[`q${questionIndex}correctAnswer`]
      const clonedCorrectAnswersArr = currentCorrectAnswersArr.slice()
      if (!this.state[`hasMultipleq${questionIndex}`]) {
        if (Number(e.target.value) > 0) {
          clonedCorrectAnswersArr.forEach((correctAnswer, index) => {
            if (Number(answerIndex) === index + 1) {
              this.setState({ [correctAnswer]: true })
            }
          })
        } else {
          clonedCorrectAnswersArr.forEach((correctAnswer, index) => {
            if (Number(answerIndex) === index + 1) {
              this.setState({ [correctAnswer]: false })
            }
          })
        }
      }
    } else if (e.target.name.includes('longAnswers') || e.target.name.includes('shortAnswers')) {
      this.setState({ [e.target.name]: e.target.checked })
      const inputName = e.target.name
      const splitInputNumber = inputName.match(/(\d+|[^\d]+)/g).join(',').split(',')[1]
      if (e.target.checked) {
        if (e.target.name.includes('longAnswers')) {
          this.setState({
            [`shortAnswersq${splitInputNumber}`]: false,
            [`defineAnswersq${splitInputNumber}`]: 'LONG',
            [`noAsnwersq${splitInputNumber}`]: 'LONG'
          })
        } else if (e.target.name.includes('shortAnswers')) {
          this.setState({
            [`longAnswersq${splitInputNumber}`]: false,
            [`defineAnswersq${splitInputNumber}`]: 'SHORT',
            [`noAsnwersq${splitInputNumber}`]: 'SHORT'
          })
        }
        const currentAnswersArr = this.state[`q${splitInputNumber}answers`]
        currentAnswersArr.forEach(answer => this.setState({ [answer]: '', [`answerScore${answer}`]: '', [`correctAnswer${answer}`]: false }))
        this.setState({
          [`q${splitInputNumber}answers`]: [`q${splitInputNumber}a1`, `q${splitInputNumber}a2`],
          [`hasMultipleq${splitInputNumber}`]: false
        })
      } else {
        this.setState({
          [`defineAnswersq${splitInputNumber}`]: 'DEFINE_ANSWERS'
        })
      }
    } else {
      this.setState({ [e.target.name]: e.target.value })
    }
  }

  addQuestion = () => {
    const { questions, mandatory, hasMultiple, longAnswers, shortAnswers, defineAnswers, questionScore } = this.state
    mandatory.push(`isMandatoryq${questions.length + 1}`)
    hasMultiple.push(`hasMultipleq${questions.length + 1}`)
    longAnswers.push(`longAnswersq${questions.length + 1}`)
    shortAnswers.push(`shortAnswersq${questions.length + 1}`)
    defineAnswers.push(`defineAnswersq${questions.length + 1}`)
    questionScore.push(`questionScoreq${questions.length + 1}`)
    questions.push(`q${questions.length + 1}`)
    const newAnswersKey = `q${questions.length}answers`
    const answers = [`q${questions.length}a1`, `q${questions.length}a2`]
    const newAnswerScoreKey = `q${questions.length}answerScore`
    const answerScores = [`answerScoreq${questions.length}a1`, `answerScoreq${questions.length}a2`]
    const newCorrectAnswersKey = `q${questions.length}correctAnswer`
    const correctAnswers = [`correctAnswerq${questions.length}a1`, `correctAnswerq${questions.length}a2`]
    defineAnswers.forEach(answerToBeDefined => {
      if (this.state[answerToBeDefined] === undefined) {
        this.setState({ [answerToBeDefined]: 'DEFINE_ANSWERS' })
      }
    })
    this.setState({
      questions,
      [newAnswersKey]: answers,
      [newAnswerScoreKey]: answerScores,
      [newCorrectAnswersKey]: correctAnswers,
      mandatory,
      longAnswers,
      shortAnswers,
      defineAnswers,
      questionScore
    })
  }

  addAnswer = question => {
    const answersKey = Object.keys(this.state).find(k => strcmp(k, `${question}answers`))
    const answersArray = this.state[`${question}answers`]
    const numOfAnswers = this.state[`${question}answers`].length
    const newAnswer = `${question}a${numOfAnswers + 1}`
    const answerScoreKey = Object.keys(this.state).find(k => strcmp(k, `${question}answerScore`))
    const answerScoreArray = this.state[`${question}answerScore`]
    const numOfAnswerScores = this.state[`${question}answerScore`].length
    const newAnswerScore = `answerScore${question}a${numOfAnswerScores + 1}`
    const correctAnswerKey = Object.keys(this.state).find(k => strcmp(k, `${question}correctAnswer`))
    const correctAnswerArray = this.state[`${question}correctAnswer`]
    const numOfcorrectAnswer = this.state[`${question}correctAnswer`].length
    const newCorrectAnswer = `correctAnswer${question}a${numOfcorrectAnswer + 1}`
    this.setState({
      [answersKey]: [...answersArray, newAnswer],
      [answerScoreKey]: [...answerScoreArray, newAnswerScore],
      [correctAnswerKey]: [...correctAnswerArray, newCorrectAnswer]
    })
  }

  submitQuestionnaire = e => {
    e.preventDefault()
    this.setState({ loading: true })
    const { questions, questionScore, mandatory, defineAnswers, hasMultiple, title, language, target, isSingleInstance } = this.state
    const { session } = this.props
    const verbPath = config.svConfig.triglavRestVerbs.CREATE_NEW_SVAROG_FORM_TYPE
    const url = `${config.svConfig.restSvcBaseUrl}${verbPath}/${session}`
    // Get the questions
    let questionsArr = []
    let questionsAndAnswersArr = []
    let noAnswers = []
    let correctAnswersArr = []
    let answerScoresArr = []
    questions.forEach((question, index) => {
      questionsArr.push(this.state[question])
      const firstAnswer = this.state[`${question}a1`].trim() + '/#/ '
      const secondAnswer = this.state[`${question}a2`].trim()
      const thirdAnswer = this.state[`${question}a3`] && '/#/ ' + this.state[`${question}a3`].trim()
      const fourthAnswer = this.state[`${question}a4`] && '/#/ ' + this.state[`${question}a4`].trim()
      const fifthAnswer = this.state[`${question}a5`] && '/#/ ' + this.state[`${question}a5`].trim()
      const answers = `${firstAnswer}${secondAnswer}${thirdAnswer || ''}${fourthAnswer || ''}${fifthAnswer || ''}`
      const firstAnswerCorrect = this.state[`correctAnswer${question}a1`]
        ? { question: [this.state[question]], answer: firstAnswer.replace('/#/ ', '').trim() } : false
      const secondAnswerCorrect = this.state[`correctAnswer${question}a2`]
        ? { question: [this.state[question]], answer: secondAnswer.replace('/#/ ', '').trim() } : false
      const thirdAnswerCorrect = this.state[`correctAnswer${question}a3`]
        ? { question: [this.state[question]], answer: thirdAnswer.replace('/#/ ', '').trim() } : false
      const fourthAnswerCorrect = this.state[`correctAnswer${question}a4`]
        ? { question: [this.state[question]], answer: fourthAnswer.replace('/#/ ', '').trim() } : false
      const fifthAnswerCorrect = this.state[`correctAnswer${question}a5`]
        ? { question: [this.state[question]], answer: fifthAnswer.replace('/#/ ', '').trim() } : false
      correctAnswersArr.push(firstAnswerCorrect, secondAnswerCorrect, thirdAnswerCorrect, fourthAnswerCorrect, fifthAnswerCorrect)
      const firstAnswerScore = this.state[`answerScore${question}a1`]
        ? { answer: firstAnswer.replace('/#/ ', '').trim(), question: this.state[question], score: this.state[`answerScore${question}a1`] } : false
      const secondAnswerScore = this.state[`answerScore${question}a2`]
        ? { answer: secondAnswer.replace('/#/ ', '').trim(), question: this.state[question], score: this.state[`answerScore${question}a2`] } : false
      const thirdAnswerScore = this.state[`answerScore${question}a3`]
        ? { answer: thirdAnswer.replace('/#/ ', '').trim(), question: this.state[question], score: this.state[`answerScore${question}a3`] } : false
      const fourthAnswerScore = this.state[`answerScore${question}a4`]
        ? { answer: fourthAnswer.replace('/#/ ', '').trim(), question: this.state[question], score: this.state[`answerScore${question}a4`] } : false
      const fifthAnswerScore = this.state[`answerScore${question}a5`]
        ? { answer: fifthAnswer.replace('/#/ ', '').trim(), question: this.state[question], score: this.state[`answerScore${question}a5`] } : false
      answerScoresArr.push(firstAnswerScore, secondAnswerScore, thirdAnswerScore, fourthAnswerScore, fifthAnswerScore)
      if (!strcmp(answers.trim(), '/#/')) {
        questionsAndAnswersArr.push({ [this.state[question]]: answers.trim() })
      } else {
        if (this.state[`noAsnwersq${index + 1}`]) {
          noAnswers.push({ [`NO_ANSWER_OPT ${this.state[question]}`]: this.state[`noAsnwersq${index + 1}`] })
        }
      }
    })
    questionsArr = questionsArr.map(question => question.trim())
    // Get the info about the question scores, if any
    let questionScores = []
    questionScore.forEach((score, index) => {
      questionScores.push({ [`SCORE ${questionsArr[index]}`]: this.state[score] || 0 })
    })
    // Get the info about the answer scores, if any
    let answerScores = []
    answerScoresArr.forEach(answerScore => {
      if (answerScore) {
        answerScores.push({ [`OPT_SCORE ${answerScore.question} ${answerScore.answer}`]: answerScore.score })
      }
    })
    // Get the info about the correct answers, if any are defined
    let correctAnswers = []
    correctAnswersArr.forEach(correctAnswer => {
      if (correctAnswer) {
        correctAnswers.push({ [`CORRECT_ANSWER ${correctAnswer.question}`]: correctAnswer.answer })
      }
    })
    // Get the info about whether a question is mandatory
    let mandatoryQuestions = []
    mandatory.forEach((mandatoryQuestion, index) => {
      mandatoryQuestions.push({ [`IS_MANDATORY ${questionsArr[index]}`]: this.state[mandatoryQuestion] || false })
    })
    // Get the info about whether answers will be defined for a question
    let definedAnswers = []
    defineAnswers.forEach((definedAnswer, index) => {
      if (this.state[definedAnswer] && strcmp(this.state[definedAnswer], 'DEFINE_ANSWERS')) {
        definedAnswers.push({ [`ADDITIONAL_INFO ${questionsArr[index]}`]: this.state[definedAnswer] })
      }
    })
    // Get the info about whether a question has multiple possible answers
    let multiplePossibleAnswersArr = []
    hasMultiple.forEach((multiplePossibleAnswers, index) => {
      if (this.state[multiplePossibleAnswers]) {
        multiplePossibleAnswersArr.push({ [`NUM_ANSWERS ${questionsArr[index]}`]: '2' })
      } else {
        if (!strcmp(this.state[`defineAnswersq${index + 1}`], 'long') && !strcmp(this.state[`defineAnswersq${index + 1}`], 'short')) {
          multiplePossibleAnswersArr.push({ [`NUM_ANSWERS ${questionsArr[index]}`]: '1' })
        }
      }
    })
    const stringifiedQuestions = questionsArr.join('/#/ ')
    const dataObj = {
      FORM_CATEGORY: '1',
      FIELD_TYPE: 'TEXT',
      MULTI_ENTRY: 'true',
      IS_MANDATORY: 'true',
      IS_NULL: 'true',
      IS_UNIQUE: 'true',
      LOCALE_ID: language,
      QUESTIONNAIRE_TITLE: title.trim(),
      QUESTION: stringifiedQuestions,
      OBJECT_TYPE: target,
      AUTOINSTANCE_SINGLE: !isSingleInstance
    }
    questionsAndAnswersArr.forEach(qa => {
      Object.assign(dataObj, { [Object.entries(qa)[0][0]]: Object.entries(qa)[0][1] })
    })
    mandatoryQuestions.forEach(mandatoryInfo => Object.assign(dataObj, mandatoryInfo))
    // Clean-up the zero (0) values from the scores array
    const filteredScores = questionScores.filter((score, index) => strcmp(typeof score[`SCORE ${questionsArr[index]}`], 'string'))
    if (isValidArray(filteredScores, 1)) {
      filteredScores.forEach(score => Object.assign(dataObj, score))
    }
    multiplePossibleAnswersArr.forEach(multipleAnswersInfo => Object.assign(dataObj, multipleAnswersInfo))
    definedAnswers.forEach(definedAnswer => Object.assign(dataObj, definedAnswer))
    if (isValidArray(noAnswers, 1)) {
      noAnswers.forEach(notDefinedAnswer => Object.assign(dataObj, notDefinedAnswer))
    }
    if (isValidArray(answerScores, 1)) {
      answerScores.forEach(answerScore => {
        Object.assign(dataObj, { [Object.entries(answerScore)[0][0]]: Object.entries(answerScore)[0][1] })
      })
    }
    if (isValidArray(correctAnswers, 1)) {
      correctAnswers.forEach(correctAnswer => {
        Object.assign(dataObj, { [Object.entries(correctAnswer)[0][0]]: Object.entries(correctAnswer)[0][1] })
      })
    }
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
          questions.forEach((question, index) => {
            this.setState({ [question]: '' })
            this.setState({ [`noAnswersq${index + 1}`]: undefined })
            if (!strcmp(question, 'q1')) {
              this.setState({
                [`${question}answers`]: [],
                [`defineAnswers${question}`]: '',
                [`hasMultiple${question}`]: false,
                [`isMandatory${question}`]: false,
                [`longAnswers${question}`]: false,
                [`shortAnswers${question}`]: false
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

MultipleAnswersQuestionnaireForm.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession,
  locale: state.intl.locale
})

export default connect(mapStateToProps)(MultipleAnswersQuestionnaireForm)
