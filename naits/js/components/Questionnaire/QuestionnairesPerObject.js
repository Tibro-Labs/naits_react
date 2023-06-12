import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import { format } from 'date-fns'
import { enUS, ka } from 'date-fns/locale'
import { alertUser } from 'tibro-components'
import { ComponentManager, FormManager, Loading } from 'components/ComponentsIndex'
import * as config from 'config/config'
import { strcmp, isValidArray, isValidObject, jsonToURI, formatAlertType } from 'functions/utils'
import mainStyle from './Questionnaire.module.css'

class QuestionnairesPerObject extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      questionnaires: undefined,
      questionnaire: undefined,
      questionnaireId: '',
      dateLocale: undefined,
      showPreviousAnswers: false,
      previousAnswers: undefined,
      shouldTranslatePreviousAnswers: false
    }
  }

  componentDidMount () {
    const { locale } = this.props
    this.setDateLocale(locale)
    this.getQuestionnaires()
  }

  setDateLocale = locale => strcmp(locale, 'en-US') ? this.setState({ dateLocale: enUS }) : this.setState({ dateLocale: ka })

  getQuestionnaires = () => {
    this.setState({ loading: true })
    const { session, parentTypeId, objectId } = this.props
    const verbPath = config.svConfig.triglavRestVerbs.GET_QUESTIONNAIRES_PER_OBJECT
    const url = `${config.svConfig.restSvcBaseUrl}${verbPath}/${session}/${parentTypeId}/${objectId}`
    axios.get(url).then(res => {
      if (res.data && isValidArray(res.data, 1)) {
        this.setState({ questionnaires: res.data, loading: false })
      } else {
        this.setState({ loading: false })
      }
    }).catch(err => {
      console.error(err)
      this.setState({ loading: false })
    })
  }

  onClick = (labelCode, objectId, formStatus, type) => {
    const { session } = this.props
    const params = [{
      PARAM_NAME: 'objectId',
      PARAM_VALUE: objectId
    }, {
      PARAM_NAME: 'parentId',
      PARAM_VALUE: this.props.objectId
    }, {
      PARAM_NAME: 'session',
      PARAM_VALUE: session
    }, {
      PARAM_NAME: 'labelCode',
      PARAM_VALUE: labelCode
    }]
    let formId = `${encodeURIComponent(labelCode).toUpperCase()}_QUESTIONNAIRE_FORM`
    formId = formId.replace(/['()*]/g, c => '%' + c.charCodeAt(0).toString(16))
    const form = FormManager.generateForm(
      formId, formId, params, 'formData',
      'GET_QUESTIONNAIRE_JSON_SCHEMA', 'GET_QUESTIONNAIRE_UI_SCHEMA', 'GET_QUESTIONNAIRE_FORM_DATA',
      this.closeQuestionnaire, (e) => this.submitQuestionnaire(e, objectId), null, null, 'questionnaire-form', null, 'delete',
      () => this.closeQuestionnaire(), undefined, undefined, undefined
    )

    ComponentManager.cleanComponentReducerState(formId)
    this.setState({
      questionnaire: undefined, questionnaireId: formId, showPreviousAnswers: false, previousAnswers: undefined, shouldTranslatePreviousAnswers: false
    }, () => {
      this.setState({ questionnaire: form })
      if (formStatus && strcmp(formStatus, 'COMPLETED')) {
        if (type && strcmp(type, '2')) {
          this.setState({ shouldTranslatePreviousAnswers: true })
        }
        this.getPreviousAnswers(objectId)
      }
    })
  }

  closeQuestionnaire = () => {
    this.setState({ questionnaire: undefined, questionnaireId: '', previousAnswers: undefined, showPreviousAnswers: false, shouldTranslatePreviousAnswers: false })
  }

  submitQuestionnaire = (e, questionnaireObjectId) => {
    const { session, objectId, gridType } = this.props
    const verbPath = config.svConfig.triglavRestVerbs.SUBMIT_QUESTIONNAIRE
    const url = `${config.svConfig.restSvcBaseUrl}${verbPath}/${session}/${objectId}/${questionnaireObjectId}`
    const formData = Object.assign(e.formData, { parentTypeId: gridType })
    const data = jsonToURI(formData)
    const reqConfig = { method: 'post', url, data }
    axios(reqConfig).then(res => {
      if (res.data) {
        const responseType = formatAlertType(res.data)
        const responseLabel = this.context.intl.formatMessage({ id: res.data, defaultMessage: res.data })
        alertUser(true, responseType, responseLabel, null, () => this.resetSaveState())
        if (strcmp(responseType, 'success')) {
          this.getQuestionnaires()
          this.getPreviousAnswers(questionnaireObjectId)
        }
      }
    }).catch(err => {
      console.error(err)
      alertUser(true, 'error', err, null, () => this.resetSaveState())
    })
  }

  resetSaveState = () => {
    ComponentManager.setStateForComponent(this.state.questionnaireId, null, { saveExecuted: false })
  }

  getPreviousAnswers = questionnaireObjectId => {
    this.setState({ loading: true })
    const { session, objectId } = this.props
    const verbPath = config.svConfig.triglavRestVerbs.GET_QUESTIONNAIRES_HISTORY
    const url = `${config.svConfig.restSvcBaseUrl}${verbPath}/${session}/${questionnaireObjectId}/${objectId}`
    axios.get(url).then(res => {
      this.setState({ loading: false })
      if (res.data && isValidArray(res.data, 1)) {
        this.setState({ previousAnswers: res.data, showPreviousAnswers: true })
      }
    }).catch(err => {
      console.error(err)
      this.setState({ loading: false })
    })
  }

  generatePreviousAnswersContainer = previousAnswers => {
    const { dateLocale, shouldTranslatePreviousAnswers } = this.state
    const onTheLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.questionnaire.on_the`,
      defaultMessage: `${config.labelBasePath}.main.questionnaire.on_the`
    })
    const atLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.questionnaire.at`,
      defaultMessage: `${config.labelBasePath}.main.questionnaire.at`
    })
    const theAnswerWasLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.questionnaire.the_answer_was`,
      defaultMessage: `${config.labelBasePath}.main.questionnaire.the_answer_was`
    })
    return previousAnswers.map((prevAnswer, i) => {
      if (isValidObject(prevAnswer, 1)) {
        for (const [questionLabel, answers] of Object.entries(prevAnswer)) {
          const translatedQuestion = this.context.intl.formatMessage({ id: questionLabel, defaultMessage: questionLabel })
          const questionKey = `${questionLabel}_${i}`
          return <div
            key={questionKey} id={questionKey}
            style={{ backgroundColor: '#00000075', border: '1px solid #8d8d8d', marginBottom: '1rem' }}
          >
            <h3 className={mainStyle['color-white']} style={{ marginBottom: '-1rem', fontWeight: '700' }}>{translatedQuestion}</h3>
            <div style={{ display: 'grid', marginTop: '1rem' }}>
              {isValidArray(answers, 1) && answers.map((answer, j) => {
                const finalAnswer = this.translateAnswer(answer.ANSWER, shouldTranslatePreviousAnswers)
                return <div
                  key={`${answer.ANSWER}_${i}_${j}`}
                  style={{
                    display: 'inline-block',
                    width: 'auto',
                    marginTop: '-0.5rem',
                    borderBottom: j !== answers.length - 1 && '1px solid'
                  }}
                >
                  <span key={`${answer.ANSWER}_${j}`} style={{ fontSize: '1.5rem' }}>
                    <span style={{ fontWeight: '300' }}>
                      {onTheLabel} {format(new Date(answer.DT_INSERT), 'do MMMM yyyy', { locale: dateLocale })}{' '}
                      {atLabel} {format(new Date(answer.DT_INSERT), 'k:mm', { locale: dateLocale })}{' '}
                      {theAnswerWasLabel}{' '}
                    </span>
                    {answer.ANSWER.length > 35 && <br />}
                    <span key={`${answer.ANSWER}_${j}`} style={{ fontSize: '2rem', fontWeight: '700' }}>
                      {finalAnswer}
                    </span>
                  </span>
                </div>
              })}
            </div>
          </div>
        }
      }
    })
  }

  translateAnswer = (answer, shouldTranslatePreviousAnswers) => {
    if (shouldTranslatePreviousAnswers) {
      const yesLabel = this.context.intl.formatMessage({ id: `${config.labelBasePath}.main.yes`, defaultMessage: `${config.labelBasePath}.main.yes` })
      const noLabel = this.context.intl.formatMessage({ id: `${config.labelBasePath}.main.no`, defaultMessage: `${config.labelBasePath}.main.no` })
      const naLabel = this.context.intl.formatMessage({ id: `${config.labelBasePath}.main.n_a`, defaultMessage: `${config.labelBasePath}.main.n_a` })
      let finalAnswer = answer
      switch (answer) {
        case '0':
          finalAnswer = yesLabel
          break
        case '1':
          finalAnswer = noLabel
          break
        case '2':
          finalAnswer = naLabel
          break
        default: return finalAnswer
      }
    } else {
      return answer
    }
  }

  generateQuestionnairesList = questionnaires => {
    const { gridType } = this.props
    const numOfQuestionsLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.questionnaire.num_of_questions`, defaultMessage: `${config.labelBasePath}.main.questionnaire.num_of_questions`
    })
    const totalScoreLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.questionnaire.total_score`, defaultMessage: `${config.labelBasePath}.main.questionnaire.total_score`
    })
    const completedLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.questionnaire.completed`, defaultMessage: `${config.labelBasePath}.main.questionnaire.completed`
    })
    return questionnaires.map((questionnaire, index) => (
      <div key={questionnaire.OBJECT_ID} id={`${gridType.toLowerCase()}-questionnaire-${index + 1}`}
        className={mainStyle['single-questionnaire-container']} style={{ marginTop: index !== 0 && '1rem' }}
      >
        <div style={{ width: '100%', fontSize: 'medium', textAlign: 'center' }}>
          <img style={{ height: '25px', width: '25px', marginRight: '1rem' }} src='/naits/img/massActionsIcons/stratify.png' />
          <span className={mainStyle['single-questionnaire-button']} style={{ marginRight: '1rem' }}
            onClick={() => this.onClick(questionnaire.LABEL_CODE, questionnaire.OBJECT_ID, questionnaire.FORM_STATUS, questionnaire.QUESTIONNAIRE_TYPE)}>
            <strong>{questionnaire.QUESTIONNAIRE_TITLE}</strong>
          </span>
        </div>
        <span style={{ fontSize: 'medium', marginTop: '0.5rem' }}>{numOfQuestionsLabel}: {questionnaire.NUMBER_OF_QUESTIONS}</span>
        {questionnaire.TOTAL_SCORE &&
          <span style={{ fontSize: 'medium', marginTop: '0.5rem' }}>{totalScoreLabel}: {questionnaire.TOTAL_SCORE}</span>
        }
        {questionnaire.FORM_STATUS && strcmp(questionnaire.FORM_STATUS, 'COMPLETED') &&
          <span style={{ fontSize: 'medium', marginTop: '0.5rem' }}>{completedLabel}: &#10003;</span>
        }
      </div>
    ))
  }

  render () {
    const { loading, questionnaires, questionnaire, showPreviousAnswers, previousAnswers } = this.state
    const noQuestionnairesLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.questionnaire.no_questionnaires`, defaultMessage: `${config.labelBasePath}.main.questionnaire.no_questionnaires`
    })
    const previousAnswersLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.questionnaire.previous_answers`, defaultMessage: `${config.labelBasePath}.main.questionnaire.previous_answers`
    })

    return <React.Fragment>
      <div id='questionnaires' className={mainStyle['questionnaires-container']}>
        <div className={mainStyle['questionnaires-container-secondary']}>
          {isValidArray(questionnaires, 1)
            ? this.generateQuestionnairesList(questionnaires) : <h1 className={mainStyle['no-questionnaires']}>{noQuestionnairesLabel}</h1>
          }
        </div>
        <div className={mainStyle['questionnaire-container']}>
          {questionnaire}
          {showPreviousAnswers && isValidArray(previousAnswers, 1) && <div id='previous-answers-container' {...questionnaire && { style: { marginTop: '2rem' } }}>
            <h3 className={mainStyle['color-white']}>{previousAnswersLabel}</h3>
            {this.generatePreviousAnswersContainer(previousAnswers)}
          </div>}
        </div>
      </div>
      {loading && <Loading />}
    </React.Fragment>
  }
}

QuestionnairesPerObject.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession,
  locale: state.intl.locale
})

export default connect(mapStateToProps)(QuestionnairesPerObject)
