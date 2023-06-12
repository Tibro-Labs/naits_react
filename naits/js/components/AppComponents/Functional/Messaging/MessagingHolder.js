import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import { orderBy } from 'lodash'
import { Select, alertUser } from 'tibro-components'
import { store } from 'tibro-redux'
import { userInfoAction } from 'backend/userInfoAction'
import { FormManager, Loading, GridInModalLinkObjects } from 'components/ComponentsIndex'
import MessagesGrid from './MessagesGrid'
import * as config from 'config/config'
import { strcmp, formatAlertType, isValidArray } from 'functions/utils'
import { getNumOfUnreadMessages } from './utils'
import style from './Messaging.module.css'

class MessagingHolder extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: undefined,
      loading: false,
      tableName: 'SVAROG_ORG_UNITS',
      mainButtons: ['search', 'compose', 'inbox', 'sent', 'archived'],
      mainButtonsLabels: ['search', 'createNewConv', 'showConvAssignedToMe', 'showConvCreatedByMe', 'archived'],
      selectedItemId: 'initial',
      messages: undefined,
      showMessagesGrid: false,
      showForm: false,
      showAttachmentsSelectors: false,
      showAnimalsModal: false,
      showAnimalForm: undefined,
      selectedAnimal: [],
      showHoldingsModal: false,
      showHoldingForm: undefined,
      selectedHolding: [],
      showHoldingResponsiblesModal: false,
      showHoldingResponsibleForm: undefined,
      selectedHoldingResponsible: [],
      selectedSubjectObjId: undefined,
      messageSubject: '',
      selectedCategory: '',
      selectedModuleName: '',
      messagePriority: '',
      messageBody: '',
      moduleNames: [],
      moduleNamesLabels: [],
      categories: [],
      categoriesLabels: [],
      priorities: [],
      prioritiesLabels: [],
      users: [],
      selectedUsers: [],
      selectedCc: [],
      selectedBcc: [],
      regions: [],
      regionObjId: 0,
      municipalities: [],
      municipalityObjId: 0,
      disableRegionSelector: false,
      disableMunicipalitySelector: false,
      searchCriteria: [
        'message.search_by_title', 'message.search_by_text', 'message.search_by_category',
        'message.search_by_priority', 'message.search_by_multiple_criteria'
      ],
      criteriaValues: ['TITLE', 'TEXT', 'CATEGORY', 'PRIORITY', 'MULTIPLE'],
      selectedCriteria: 'TITLE',
      searchValue: '',
      titleValue: '',
      textValue: '',
      priorityValue: '',
      categoryValue: ''
    }
  }

  componentDidMount () {
    getNumOfUnreadMessages(this.props.svSession)
    this.getDropdownData()
    this.getAllUsers()
    this.getRegions()
    this.getMunicipalities()
    this.props.userInfoAction(this.props.svSession, 'GET_BASIC')
  }

  componentWillUnmount () {
    store.dispatch({ type: 'RESET_THE_UNREAD_MESSAGES_ALERT_STATE' })
    store.dispatch({ type: 'RESET_THE_NUMBER_OF_UNREAD_MESSAGES' })
  }

  getDropdownData = () => {
    let categories = []
    let categoriesLabels = []
    let priorities = []
    let prioritiesLabels = []
    let moduleNames = []
    let moduleNamesLabels = []
    const server = config.svConfig.restSvcBaseUrl
    const verbPath = config.svConfig.triglavRestVerbs.GET_FORM_BUILDER
    let url = `${server}${verbPath}`
    url = url.replace('%session', this.props.svSession)
    url = url.replace('%formWeWant', 'SUBJECT')
    axios.get(url).then(res => {
      if (res.data.properties) {
        const additionalInfo = res.data.properties['subject.additional_info'].properties
        const basicInfo = res.data.properties['subject.basic_info'].properties
        if (additionalInfo.CATEGORY) {
          additionalInfo.CATEGORY.enum.forEach(category => categories.push(category))
          additionalInfo.CATEGORY.enumNames.forEach(categoryLabel => categoriesLabels.push(categoryLabel))
        }

        if (additionalInfo.PRIORITY) {
          const highValue = additionalInfo.PRIORITY.enum.splice(0, 1).toString()
          const highLabel = additionalInfo.PRIORITY.enumNames.splice(0, 1).toString()
          additionalInfo.PRIORITY.enum.forEach(priority => priorities.push(priority))
          additionalInfo.PRIORITY.enumNames.forEach(priorityLabel => prioritiesLabels.push(priorityLabel))
          priorities.push(highValue)
          prioritiesLabels.push(highLabel)
        }

        if (basicInfo.MODULE_NAME) {
          basicInfo.MODULE_NAME.enum.forEach(moduleName => moduleNames.push(moduleName))
          basicInfo.MODULE_NAME.enumNames.forEach(moduleNameLabel => moduleNamesLabels.push(moduleNameLabel))
        }

        this.setState({ categories, categoriesLabels, priorities, prioritiesLabels, moduleNames, moduleNamesLabels })
      }
    }).catch(err => console.error(err))
  }

  getAllUsers = () => {
    this.setState({ loading: true })
    const { svSession } = this.props
    let server = config.svConfig.restSvcBaseUrl
    let verbPath = config.svConfig.triglavRestVerbs.GET_BYPARENTID_SYNC_WITH_ORDER
    let restUrl = `${server}${verbPath}`

    restUrl = restUrl.replace('%s1', svSession)
    restUrl = restUrl.replace('%s2', 0)
    restUrl = restUrl.replace('%s3', 'SVAROG_USERS')
    restUrl = restUrl.replace('%s4', 100000)
    restUrl = restUrl.replace('%order', 'USER_NAME')

    let usernamesArr = []
    axios.get(restUrl).then(res => {
      if (res.data) {
        res.data.map(user => {
          usernamesArr.push({
            value: user['SVAROG_USERS.OBJECT_ID'],
            label: user['SVAROG_USERS.USER_NAME']
          })
        })
        this.setState({ users: usernamesArr, loading: false })
        if (this.props.weComeFromTheUnreadMessagesAlert) {
          this.handleMainBtnClick('inbox')
        }
      }
    }).catch(err => console.error(err))
  }

  getRegions = () => {
    let verbPath = config.svConfig.triglavRestVerbs.GET_TABLE_WITH_LIKE_FILTER
    verbPath = verbPath.replace('%svSession', this.props.svSession)
    verbPath = verbPath.replace('%objectName', 'SVAROG_CODES')
    verbPath = verbPath.replace('%searchBy', 'PARENT_CODE_VALUE')
    verbPath = verbPath.replace('%searchForValue', 'REGIONS')
    verbPath = verbPath.replace('%rowlimit', 10000)
    const url = `${config.svConfig.restSvcBaseUrl}${verbPath}`
    axios.get(url).then(res => {
      if (isValidArray(res.data, 1)) {
        let regions = []
        res.data.forEach(region => {
          regions.push({ name: region['SVAROG_CODES.LABEL_CODE'], value: region['SVAROG_CODES.CODE_VALUE'] })
        })
        this.setState({ regions })
      }
    })
  }

  getMunicipalities = () => {
    let verbPath = config.svConfig.triglavRestVerbs.GET_TABLE_WITH_LIKE_FILTER
    verbPath = verbPath.replace('%svSession', this.props.svSession)
    verbPath = verbPath.replace('%objectName', 'SVAROG_CODES')
    verbPath = verbPath.replace('%searchBy', 'PARENT_CODE_VALUE')
    verbPath = verbPath.replace('%searchForValue', 'MUNICIPALITIES')
    verbPath = verbPath.replace('%rowlimit', 10000)
    const url = `${config.svConfig.restSvcBaseUrl}${verbPath}`
    axios.get(url).then(res => {
      if (isValidArray(res.data, 1)) {
        let municipalities = []
        res.data.forEach(region => {
          municipalities.push({ name: region['SVAROG_CODES.LABEL_CODE'], value: region['SVAROG_CODES.CODE_VALUE'] })
        })
        this.setState({ municipalities })
      }
    })
  }

  generateCriteriaDropdown = () => {
    return this.state.searchCriteria.map((criteria, index) => (
      <option key={criteria} value={this.state.criteriaValues[index]}>
        {this.context.intl.formatMessage({
          id: `${config.labelBasePath}.${criteria}`,
          defaultMessage: `${config.labelBasePath}.${criteria}`
        })}
      </option>
    ))
  }

  handleCriteriaChange = e => {
    this.setState({
      selectedCriteria: e.target.value,
      searchValue: '',
      titleValue: '',
      textValue: '',
      priorityValue: '',
      categoryValue: ''
    })
  }

  handleSearchByTheEnterKey = e => {
    if (e.keyCode === 13) {
      this.searchMessages()
    }
  }

  handleMultipleCriteriaSearchByTheEnterKey = e => {
    if (e.keyCode === 13) {
      this.searchMessagesByMultipleCriteria()
    }
  }

  searchMessages = () => {
    const { selectedCriteria, searchValue } = this.state
    if (!searchValue) {
      const missingSearchTitleLabel = this.context.intl.formatMessage({
        id: `${config.labelBasePath}.message.missing_search_title`,
        defaultMessage: `${config.labelBasePath}.message.missing_search_title`
      })
      const missingSearchTextLabel = this.context.intl.formatMessage({
        id: `${config.labelBasePath}.message.missing_search_text`,
        defaultMessage: `${config.labelBasePath}.message.missing_search_text`
      })
      const missingSearchCategoryLabel = this.context.intl.formatMessage({
        id: `${config.labelBasePath}.message.missing_search_category`,
        defaultMessage: `${config.labelBasePath}.message.missing_search_category`
      })
      const missingSearchPriorityLabel = this.context.intl.formatMessage({
        id: `${config.labelBasePath}.message.missing_search_priority`,
        defaultMessage: `${config.labelBasePath}.message.missing_search_priority`
      })

      if (strcmp(selectedCriteria, 'TITLE')) {
        this.setState({ alert: alertUser(true, 'warning', missingSearchTitleLabel) })
      } else if (strcmp(selectedCriteria, 'TEXT')) {
        this.setState({ alert: alertUser(true, 'warning', missingSearchTextLabel) })
      } else if (strcmp(selectedCriteria, 'CATEGORY')) {
        this.setState({ alert: alertUser(true, 'warning', missingSearchCategoryLabel) })
      } else if (strcmp(selectedCriteria, 'PRIORITY')) {
        this.setState({ alert: alertUser(true, 'warning', missingSearchPriorityLabel) })
      }
    } else {
      this.setState({ loading: true, messages: undefined, showMessagesGrid: false })
      let data = new URLSearchParams()
      data.append('SUBJECT_TITLE', strcmp(selectedCriteria, 'TITLE') ? searchValue : '')
      data.append('MSG_TEXT', strcmp(selectedCriteria, 'TEXT') ? searchValue : '')
      data.append('SUBJECT_CATEGORY', strcmp(selectedCriteria, 'CATEGORY') ? searchValue : '')
      data.append('SUBJECT_PRIORITY', strcmp(selectedCriteria, 'PRIORITY') ? searchValue : '')
      const server = config.svConfig.restSvcBaseUrl
      const verbPath = config.svConfig.triglavRestVerbs.SEARCH_SUBJECTS
      let url = `${server}${verbPath}`
      url = url.replace('%session', this.props.svSession)
      const reqConfig = { method: 'post', url, data }
      axios(reqConfig).then(res => {
        if (res.data) {
          const messages = orderBy(res.data, item => item.DATE_OF_CREATION, ['desc'])
          this.setState({ messages, showMessagesGrid: true, loading: false, selectedItemId: 'search' })
        }
      }).catch(err => {
        console.error(err)
        this.setState({ alert: alertUser(true, 'error', err), loading: false })
      })
    }
  }

  searchMessagesByMultipleCriteria = () => {
    const { titleValue, textValue, priorityValue, categoryValue } = this.state
    const missingSearchValuesLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.message.missing_search_values`,
      defaultMessage: `${config.labelBasePath}.message.missing_search_values`
    })
    if (!titleValue && !textValue && !priorityValue && !categoryValue) {
      this.setState({ alert: alertUser(true, 'warning', missingSearchValuesLabel) })
    } else {
      this.setState({ loading: true, messages: undefined, showMessagesGrid: false })
      let data = new URLSearchParams()
      data.append('SUBJECT_TITLE', titleValue)
      data.append('MSG_TEXT', textValue)
      data.append('SUBJECT_CATEGORY', categoryValue)
      data.append('SUBJECT_PRIORITY', priorityValue)
      const server = config.svConfig.restSvcBaseUrl
      const verbPath = config.svConfig.triglavRestVerbs.SEARCH_SUBJECTS
      let url = `${server}${verbPath}`
      url = url.replace('%session', this.props.svSession)
      const reqConfig = { method: 'post', url, data }
      axios(reqConfig).then(res => {
        if (res.data) {
          const messages = orderBy(res.data, item => item.DATE_OF_CREATION, ['desc'])
          this.setState({ messages, showMessagesGrid: true, loading: false, selectedItemId: 'search' })
        }
      }).catch(err => {
        console.error(err)
        this.setState({ alert: alertUser(true, 'error', err), loading: false })
      })
    }
  }

  handleUserSelection = selectedUser => {
    this.setState({ selectedUsers: selectedUser })
  }

  handleCcSelection = selectedUser => {
    this.setState({ selectedCc: selectedUser })
  }

  handleBccSelection = selectedUser => {
    this.setState({ selectedBcc: selectedUser })
  }

  handleMainBtnClick = action => {
    this.setState({ messages: undefined, showMessagesGrid: false })
    const server = config.svConfig.restSvcBaseUrl

    if (strcmp(action, 'inbox')) {
      this.setState({
        loading: true,
        selectedItemId: 'inbox',
        showForm: false,
        form: undefined,
        selectedCriteria: 'TITLE',
        searchValue: '',
        messageBody: '',
        messageSubject: '',
        messagePriority: '',
        selectedUsers: [],
        selectedCc: [],
        selectedBcc: [],
        regionObjId: 0,
        municipalityObjId: 0,
        selectedCategory: '',
        selectedModuleName: '',
        selectedAnimal: [],
        selectedHolding: [],
        selectedHoldingResponsible: [],
        showAttachmentsSelectors: false,
        disableRegionSelector: false,
        disableMunicipalitySelector: false
      })
      const verbPath = config.svConfig.triglavRestVerbs.GET_INBOX_SUBJECTS
      let url = `${server}${verbPath}`
      url = url.replace('%session', this.props.svSession)
      axios.get(url).then(res => {
        if (res.data) {
          const messages = orderBy(res.data, item => item.DATE_OF_CREATION, ['desc'])
          this.setState({ messages, showMessagesGrid: true, loading: false })
        }
      }).catch(err => {
        console.error(err)
        this.setState({ alert: alertUser(true, 'error', err), messages: undefined, showMessagesGrid: false, loading: false })
      })
    } else if (strcmp(action, 'sent')) {
      this.setState({
        loading: true,
        selectedItemId: 'sent',
        showForm: false,
        form: undefined,
        selectedCriteria: 'TITLE',
        searchValue: '',
        messageBody: '',
        messageSubject: '',
        messagePriority: '',
        selectedUsers: [],
        selectedCc: [],
        selectedBcc: [],
        regionObjId: 0,
        municipalityObjId: 0,
        selectedCategory: '',
        selectedModuleName: '',
        selectedAnimal: [],
        selectedHolding: [],
        selectedHoldingResponsible: [],
        showAttachmentsSelectors: false,
        disableRegionSelector: false,
        disableMunicipalitySelector: false
      })
      const verbPath = config.svConfig.triglavRestVerbs.GET_SENT_SUBJECTS
      let url = `${server}${verbPath}`
      url = url.replace('%session', this.props.svSession)
      axios.get(url).then(res => {
        if (res.data) {
          const messages = orderBy(res.data, item => item.DATE_OF_CREATION, ['desc'])
          this.setState({ messages, showMessagesGrid: true, loading: false })
        }
      }).catch(err => {
        console.error(err)
        this.setState({ alert: alertUser(true, 'error', err), messages: undefined, showMessagesGrid: false, loading: false })
      })
    } else if (strcmp(action, 'archived')) {
      this.setState({
        loading: true,
        selectedItemId: 'archived',
        showForm: false,
        form: undefined,
        selectedCriteria: 'TITLE',
        searchValue: '',
        messageBody: '',
        messageSubject: '',
        messagePriority: '',
        selectedUsers: [],
        selectedCc: [],
        selectedBcc: [],
        regionObjId: 0,
        municipalityObjId: 0,
        selectedCategory: '',
        selectedModuleName: '',
        selectedAnimal: [],
        selectedHolding: [],
        selectedHoldingResponsible: [],
        showAttachmentsSelectors: false,
        disableRegionSelector: false,
        disableMunicipalitySelector: false
      })
      const verbPath = config.svConfig.triglavRestVerbs.GET_ARCHIVED_SUBJECTS
      let url = `${server}${verbPath}`
      url = url.replace('%session', this.props.svSession)
      axios.get(url).then(res => {
        if (res.data) {
          const messages = orderBy(res.data, item => item.DATE_OF_CREATION, ['desc'])
          this.setState({ messages, showMessagesGrid: true, loading: false })
        }
      }).catch(err => {
        console.error(err)
        this.setState({ alert: alertUser(true, 'error', err), messages: undefined, showMessagesGrid: false, loading: false })
      })
    } else {
      this.setState({
        messageBody: '',
        messageSubject: '',
        messagePriority: '',
        selectedUsers: [],
        selectedCc: [],
        selectedBcc: [],
        regionObjId: 0,
        municipalityObjId: 0,
        selectedCategory: '',
        selectedModuleName: '',
        selectedAnimal: [],
        selectedHolding: [],
        selectedHoldingResponsible: [],
        showAttachmentsSelectors: false,
        disableRegionSelector: false,
        disableMunicipalitySelector: false
      })
      if (strcmp(action, 'compose')) {
        this.setState({ selectedItemId: 'compose', showForm: true, loading: false, selectedCriteria: 'TITLE', searchValue: '' })
      } else {
        this.setState({ selectedItemId: 'search', showForm: false, loading: false, selectedCriteria: 'TITLE', searchValue: '' })
      }
    }
  }

  archiveMessagePrompt = (e, selectedMessageObjId) => {
    e.stopPropagation()
    const archiveMessagePromptLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.message.archive_message_prompt`,
      defaultMessage: `${config.labelBasePath}.message.archive_message_prompt`
    })
    this.setState({
      alert: alertUser(true, 'warning', archiveMessagePromptLabel + '?', null,
        () => this.archiveMessage(selectedMessageObjId), () => this.setState({ alert: false }), true,
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.yes`,
          defaultMessage: `${config.labelBasePath}.main.yes`
        }),
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.no`,
          defaultMessage: `${config.labelBasePath}.main.no`
        }))
    })
  }

  archiveMessage = selectedMessageObjId => {
    this.setState({ loading: true })
    const server = config.svConfig.restSvcBaseUrl
    const verbPath = config.svConfig.triglavRestVerbs.ARCHIVE_SUBJECT
    let url = `${server}${verbPath}`
    url = url.replace('%session', this.props.svSession)
    url = url.replace('%subjectObjId', selectedMessageObjId)
    axios.get(url).then(res => {
      if (res.data) {
        const resType = formatAlertType(res.data)
        const resLabel = this.context.intl.formatMessage({ id: res.data, defaultMessage: res.data })
        this.setState({ alert: alertUser(true, resType, resLabel), loading: false })
        this.handleMainBtnClick(this.state.selectedItemId)
        if (strcmp(resType, 'success')) {
          getNumOfUnreadMessages(this.props.svSession)
        }
      }
    }).catch(err => {
      console.error(err)
      this.setState({ alert: alertUser(true, 'error', err), loading: false })
    })
  }

  unarchiveMessagePrompt = (e, selectedMessageObjId) => {
    e.stopPropagation()
    const unarchiveMessagePromptLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.message.unarchive_message_prompt`,
      defaultMessage: `${config.labelBasePath}.message.unarchive_message_prompt`
    })
    this.setState({
      alert: alertUser(true, 'warning', unarchiveMessagePromptLabel + '?', null,
        () => this.unarchiveMessage(selectedMessageObjId), () => this.setState({ alert: false }), true,
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.yes`,
          defaultMessage: `${config.labelBasePath}.main.yes`
        }),
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.no`,
          defaultMessage: `${config.labelBasePath}.main.no`
        }))
    })
  }

  unarchiveMessage = selectedMessageObjId => {
    this.setState({ loading: true })
    const server = config.svConfig.restSvcBaseUrl
    const verbPath = config.svConfig.triglavRestVerbs.UNARCHIVE_SUBJECT
    let url = `${server}${verbPath}`
    url = url.replace('%session', this.props.svSession)
    url = url.replace('%subjectObjId', selectedMessageObjId)
    axios.get(url).then(res => {
      if (res.data) {
        const resType = formatAlertType(res.data)
        const resLabel = this.context.intl.formatMessage({ id: res.data, defaultMessage: res.data })
        this.setState({ alert: alertUser(true, resType, resLabel), loading: false })
        this.handleMainBtnClick(this.state.selectedItemId)
        if (strcmp(resType, 'success')) {
          getNumOfUnreadMessages(this.props.svSession)
        }
      }
    }).catch(err => {
      console.error(err)
      this.setState({ alert: alertUser(true, 'error', err), loading: false })
    })
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value })

  showAttachmentSelectors = () => {
    if (this.state.showAttachmentsSelectors) {
      if (isValidArray(this.state.selectedAnimal, 1) || isValidArray(this.state.selectedHolding, 1) ||
        isValidArray(this.state.selectedHoldingResponsible, 1)) {
        this.setState({
          alert: alertUser(true, 'warning', this.context.intl.formatMessage({
            id: `${config.labelBasePath}.message.remove_attachments_prompt`,
            defaultMessage: `${config.labelBasePath}.message.remove_attachments_prompt`
          }), null, () => this.setState({
            selectedAnimal: [],
            selectedHolding: [],
            selectedHoldingResponsible: [],
            showAttachmentsSelectors: false
          }), () => this.setState({ alert: false }), true,
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.yes`,
            defaultMessage: `${config.labelBasePath}.main.yes`
          }),
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.no`,
            defaultMessage: `${config.labelBasePath}.main.no`
          }))
        })
      } else {
        this.setState({ showAttachmentsSelectors: false })
      }
    } else {
      this.setState({ showAttachmentsSelectors: true })
    }
  }

  handleAnimalsModal = () => {
    this.setState({ showAnimalsModal: !this.state.showAnimalsModal })
  }

  chooseAnimal = () => {
    let selectedAnimal = []
    selectedAnimal.push(...this.state.selectedAnimal, store.getState()['ANIMAL'].rowClicked)
    this.setState({ showAnimalsModal: false, selectedAnimal })
  }

  removeSelectedAnimalPrompt = index => {
    this.setState({
      alert: alertUser(true, 'warning', this.context.intl.formatMessage({
        id: `${config.labelBasePath}.message.remove_animal_prompt`,
        defaultMessage: `${config.labelBasePath}.message.remove_animal_prompt`
      }), null, () => this.removeSelectedAnimal(index),
      () => this.setState({ alert: false }), true,
      this.context.intl.formatMessage({
        id: `${config.labelBasePath}.main.yes`,
        defaultMessage: `${config.labelBasePath}.main.yes`
      }),
      this.context.intl.formatMessage({
        id: `${config.labelBasePath}.main.no`,
        defaultMessage: `${config.labelBasePath}.main.no`
      }))
    })
  }

  removeSelectedAnimal = index => {
    let selectedAnimal = []
    if (index === 0 && this.state.selectedAnimal.length === 1) {
      this.setState({ selectedAnimal: [] })
    } else {
      this.state.selectedAnimal.splice(index, 1)
      selectedAnimal.push(...this.state.selectedAnimal)
      this.setState({ selectedAnimal })
    }
  }

  showAnimalForm = animalObjId => {
    const formId = `ANIMAL_DETAILS_FORM_${animalObjId}`
    const params = []
    params.push({
      PARAM_NAME: 'formWeWant',
      PARAM_VALUE: 'ANIMAL'
    }, {
      PARAM_NAME: 'session',
      PARAM_VALUE: this.props.svSession
    }, {
      PARAM_NAME: 'table_name',
      PARAM_VALUE: 'ANIMAL'
    }, {
      PARAM_NAME: 'object_id',
      PARAM_VALUE: animalObjId
    })

    const animalDetailsForm = FormManager.generateForm(
      formId, formId, params, 'formData',
      'GET_FORM_BUILDER', 'GET_UISCHEMA', 'GET_TABLE_FORMDATA',
      this.closeAnimalsForm, null, null, null, null, null, true,
      () => this.closeAnimalsForm(), undefined, undefined,
      undefined, undefined, undefined
    )
    this.setState({ showAnimalForm: undefined }, () => {
      this.setState({ showAnimalForm: animalDetailsForm })
    })
  }

  closeAnimalsForm = () => {
    this.setState({ showAnimalForm: undefined })
  }

  handleHoldingsModal = () => {
    this.setState({ showHoldingsModal: !this.state.showHoldingsModal })
  }

  chooseHolding = () => {
    let selectedHolding = []
    selectedHolding.push(...this.state.selectedHolding, store.getState()['HOLDING'].rowClicked)
    this.setState({ showHoldingsModal: false, selectedHolding })
  }

  removeSelectedHoldingPrompt = index => {
    this.setState({
      alert: alertUser(true, 'warning', this.context.intl.formatMessage({
        id: `${config.labelBasePath}.message.remove_holding_prompt`,
        defaultMessage: `${config.labelBasePath}.message.remove_holding_prompt`
      }), null, () => this.removeSelectedHolding(index),
      () => this.setState({ alert: false }),
      true, this.context.intl.formatMessage({
        id: `${config.labelBasePath}.main.yes`,
        defaultMessage: `${config.labelBasePath}.main.yes`
      }), this.context.intl.formatMessage({
        id: `${config.labelBasePath}.main.no`,
        defaultMessage: `${config.labelBasePath}.main.no`
      }))
    })
  }

  removeSelectedHolding = index => {
    let selectedHolding = []
    if (index === 0 && this.state.selectedHolding.length === 1) {
      this.setState({ selectedHolding: [] })
    } else {
      this.state.selectedHolding.splice(index, 1)
      selectedHolding.push(...this.state.selectedHolding)
      this.setState({ selectedHolding })
    }
  }

  showHoldingForm = holdingObjId => {
    const formId = `HOLDING_DETAILS_FORM_${holdingObjId}`
    const params = []
    params.push({
      PARAM_NAME: 'formWeWant',
      PARAM_VALUE: 'HOLDING'
    }, {
      PARAM_NAME: 'session',
      PARAM_VALUE: this.props.svSession
    }, {
      PARAM_NAME: 'table_name',
      PARAM_VALUE: 'HOLDING'
    }, {
      PARAM_NAME: 'object_id',
      PARAM_VALUE: holdingObjId
    })

    const holdingDetailsForm = FormManager.generateForm(
      formId, formId, params, 'formData',
      'GET_FORM_BUILDER', 'GET_UISCHEMA', 'GET_TABLE_FORMDATA',
      this.closeHoldingForm, null, null, null, null, null, true,
      () => this.closeHoldingForm(), undefined, undefined,
      undefined, undefined, undefined
    )
    this.setState({ showHoldingForm: holdingDetailsForm })
  }

  closeHoldingForm = () => {
    this.setState({ showHoldingForm: false })
  }

  handleHoldingResponsiblesModal = () => {
    this.setState({ showHoldingResponsiblesModal: !this.state.showHoldingResponsiblesModal })
  }

  chooseHoldingResponsible = () => {
    let selectedHoldingResponsible = []
    selectedHoldingResponsible.push(...this.state.selectedHoldingResponsible, store.getState()['HOLDING_RESPONSIBLE'].rowClicked)
    this.setState({ showHoldingResponsiblesModal: false, selectedHoldingResponsible })
  }

  removeSelectedHoldingResponsiblePrompt = index => {
    this.setState({
      alert: alertUser(true, 'warning', this.context.intl.formatMessage({
        id: `${config.labelBasePath}.message.remove_holding_responsible_prompt`,
        defaultMessage: `${config.labelBasePath}.message.remove_holding_responsible_prompt`
      }), null, () => this.removeSelectedHoldingResponsible(index),
      () => this.setState({ alert: false }),
      true, this.context.intl.formatMessage({
        id: `${config.labelBasePath}.main.yes`,
        defaultMessage: `${config.labelBasePath}.main.yes`
      }), this.context.intl.formatMessage({
        id: `${config.labelBasePath}.main.no`,
        defaultMessage: `${config.labelBasePath}.main.no`
      }))
    })
  }

  removeSelectedHoldingResponsible = index => {
    let selectedHoldingResponsible = []
    if (index === 0 && this.state.selectedHoldingResponsible.length === 1) {
      this.setState({ selectedHoldingResponsible: [] })
    } else {
      this.state.selectedHoldingResponsible.splice(index, 1)
      selectedHoldingResponsible.push(...this.state.selectedHoldingResponsible)
      this.setState({ selectedHoldingResponsible })
    }
  }

  showHoldingResponsibleForm = holdingResponsibleObjId => {
    const formId = `HOLDING_RESPONSIBLE_DETAILS_FORM_${holdingResponsibleObjId}`
    const params = []
    params.push({
      PARAM_NAME: 'formWeWant',
      PARAM_VALUE: 'HOLDING_RESPONSIBLE'
    }, {
      PARAM_NAME: 'session',
      PARAM_VALUE: this.props.svSession
    }, {
      PARAM_NAME: 'table_name',
      PARAM_VALUE: 'HOLDING_RESPONSIBLE'
    }, {
      PARAM_NAME: 'object_id',
      PARAM_VALUE: holdingResponsibleObjId
    })

    const holdingResponsibleDetailsForm = FormManager.generateForm(
      formId, formId, params, 'formData',
      'GET_FORM_BUILDER', 'GET_UISCHEMA', 'GET_TABLE_FORMDATA',
      this.closeHoldingResponsibleForm, null, null, null, null, null, true,
      () => this.closeHoldingResponsibleForm(), undefined, undefined,
      undefined, undefined, undefined
    )
    this.setState({ showHoldingResponsibleForm: holdingResponsibleDetailsForm })
  }

  closeHoldingResponsibleForm = () => {
    this.setState({ showHoldingResponsibleForm: undefined })
  }

  chooseRegion = e => {
    this.setState({ regionObjId: Number(e.target.value) })
    const municipalityDropdown = document.getElementById('municipalityObjId')
    if (municipalityDropdown) {
      municipalityDropdown.setAttribute('disabled', 'disabled')
      municipalityDropdown.style.backgroundColor = '#dddddd'
      if (this.state.municipalityObjId > 0) {
        municipalityDropdown.selectedIndex = 0
      }
    }
  }

  chooseMunicipality = e => {
    this.setState({ municipalityObjId: Number(e.target.value) })
    const regionDropdown = document.getElementById('regionObjId')
    if (regionDropdown) {
      regionDropdown.setAttribute('disabled', 'disabled')
      regionDropdown.style.backgroundColor = '#dddddd'
      if (this.state.regionObjId > 0) {
        regionDropdown.selectedIndex = 0
      }
    }
  }

  sendMessagePrompt = () => {
    const {
      selectedUsers, selectedModuleName, messageSubject, selectedCategory, messagePriority, messageBody
    } = this.state
    const missingRecipientsLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.message.missing_recipients`,
      defaultMessage: `${config.labelBasePath}.message.missing_recipients`
    })
    const missingModuleNameLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.message.missing_module_name`,
      defaultMessage: `${config.labelBasePath}.message.missing_module_name`
    })
    const missingSubjectLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.message.missing_subject`,
      defaultMessage: `${config.labelBasePath}.message.missing_subject`
    })
    const missingCategoryLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.message.missing_category`,
      defaultMessage: `${config.labelBasePath}.message.missing_category`
    })
    const missingPriorityLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.message.missing_priority`,
      defaultMessage: `${config.labelBasePath}.message.missing_priority`
    })
    const missingMessageBodyLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.message.missing_message_text`,
      defaultMessage: `${config.labelBasePath}.message.missing_message_text`
    })
    if (selectedUsers.length === 0) {
      this.setState({ alert: alertUser(true, 'warning', missingRecipientsLabel) })
    } else if (!messageSubject) {
      this.setState({ alert: alertUser(true, 'warning', missingSubjectLabel) })
    } else if (!selectedCategory) {
      this.setState({ alert: alertUser(true, 'warning', missingCategoryLabel) })
    } else if (!selectedModuleName) {
      this.setState({ alert: alertUser(true, 'warning', missingModuleNameLabel) })
    } else if (!messagePriority) {
      this.setState({ alert: alertUser(true, 'warning', missingPriorityLabel) })
    } else if (!messageBody) {
      this.setState({ alert: alertUser(true, 'warning', missingMessageBodyLabel) })
    } else {
      this.setState({
        alert: alertUser(true, 'info', this.context.intl.formatMessage({
          id: `${config.labelBasePath}.message.send_message_prompt`,
          defaultMessage: `${config.labelBasePath}.message.send_message_prompt`
        }), null, () => this.sendMessage(), () => this.setState({ alert: false }),
        true, this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.yes`,
          defaultMessage: `${config.labelBasePath}.main.yes`
        }), this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.no`,
          defaultMessage: `${config.labelBasePath}.main.no`
        }))
      })
    }
  }

  sendMessage = () => {
    this.setState({ loading: true })
    const {
      selectedUsers, selectedCc, selectedBcc, selectedModuleName, messageSubject, selectedCategory, messagePriority, messageBody,
      selectedAnimal, selectedHolding, selectedHoldingResponsible, regionObjId, municipalityObjId
    } = this.state
    let orgUnitObjIdToSend = 0
    if (regionObjId > 0) {
      orgUnitObjIdToSend = regionObjId
    } else if (municipalityObjId > 0) {
      orgUnitObjIdToSend = municipalityObjId
    }
    let recipients = []
    let cc = []
    let bcc = []
    selectedUsers.length > 0 && selectedUsers.forEach(user => recipients.push(user.value))
    selectedCc.length > 0 && selectedCc.forEach(user => cc.push(user.value))
    selectedBcc.length > 0 && selectedBcc.forEach(user => bcc.push(user.value))
    let msgAttachment = []
    if (isValidArray(selectedAnimal, 1)) {
      selectedAnimal.forEach(animal => msgAttachment.push({
        NAME: animal['ANIMAL.ANIMAL_ID'],
        ATCH_OBJ_ID: animal['ANIMAL.OBJECT_ID'],
        ATCH_OBJ_TYPE: animal['ANIMAL.OBJECT_TYPE']
      }))
      msgAttachment = [...msgAttachment]
    }
    if (isValidArray(selectedHolding, 1)) {
      selectedHolding.forEach(holding => msgAttachment.push({
        NAME: holding['HOLDING.PIC'],
        ATCH_OBJ_ID: holding['HOLDING.OBJECT_ID'],
        ATCH_OBJ_TYPE: holding['HOLDING.OBJECT_TYPE']
      }))
      msgAttachment = [...msgAttachment]
    }
    if (isValidArray(selectedHoldingResponsible, 1)) {
      selectedHoldingResponsible.forEach(holdingResponsible => msgAttachment.push({
        NAME: holdingResponsible['HOLDING_RESPONSIBLE.NAT_REG_NUMBER'],
        ATCH_OBJ_ID: holdingResponsible['HOLDING_RESPONSIBLE.OBJECT_ID'],
        ATCH_OBJ_TYPE: holdingResponsible['HOLDING_RESPONSIBLE.OBJECT_TYPE']
      }))
      msgAttachment = [...msgAttachment]
    }
    let data = new URLSearchParams()
    data.append('SUBJECT_OBJ_ID', 0)
    data.append('SUBJECT_TITLE', messageSubject)
    data.append('SUBJECT_PRIORITY', messagePriority)
    data.append('MSG_PRIORITY', messagePriority)
    data.append('SUBJECT_CATEGORY', selectedCategory)
    data.append('SUBJECT_MODULE_NAME', selectedModuleName)
    data.append('MSG_TEXT', messageBody)
    data.append('MSG_TO', JSON.stringify(recipients))
    data.append('MSG_CC', JSON.stringify(cc))
    data.append('MSG_BCC', JSON.stringify(bcc))
    data.append('ORG_UNIT_OBJ_ID', orgUnitObjIdToSend)
    data.append('MSG_ATTACHMENT', JSON.stringify(msgAttachment))

    const server = config.svConfig.restSvcBaseUrl
    const verbPath = config.svConfig.triglavRestVerbs.CUSTOM_CREATE_MESSAGE
    let url = `${server}${verbPath}`
    url = url.replace('%session', this.props.svSession)
    const reqConfig = { method: 'post', url, data }
    axios(reqConfig).then(res => {
      if (res.data) {
        const resType = formatAlertType(res.data)
        const resLabel = this.context.intl.formatMessage({
          id: res.data, defaultMessage: res.data
        })
        this.setState({ alert: alertUser(true, resType, resLabel), loading: false })
        if (strcmp(resType, 'success')) {
          this.setState({
            messageBody: '',
            messageSubject: '',
            messagePriority: '',
            selectedUsers: [],
            selectedCc: [],
            selectedBcc: [],
            regionObjId: 0,
            municipalityObjId: 0,
            selectedCategory: '',
            selectedModuleName: '',
            selectedAnimal: [],
            selectedHolding: [],
            selectedHoldingResponsible: [],
            showAttachmentsSelectors: false,
            disableRegionSelector: false,
            disableMunicipalitySelector: false
          })
          const regionDropdown = document.getElementById('regionObjId')
          const municipalityDropdown = document.getElementById('municipalityObjId')
          if (regionDropdown && municipalityDropdown) {
            regionDropdown.selectedIndex = 0
            regionDropdown.removeAttribute('disabled')
            regionDropdown.style.backgroundColor = '#e3eedd'
            municipalityDropdown.selectedIndex = 0
            municipalityDropdown.removeAttribute('disabled')
            municipalityDropdown.style.backgroundColor = '#e3eedd'
          }
        }
      }
    }).catch(err => {
      console.error(err)
      this.setState({ alert: alertUser(true, 'error', err), loading: false })
    })
  }

  render () {
    const { numOfUnreadInboxMsgs, numOfUnreadArchivedMsgs } = this.props
    const {
      mainButtons, mainButtonsLabels, showMessagesGrid, selectedItemId, selectedCriteria,
      searchValue, titleValue, textValue, priorityValue, categoryValue, regions, municipalities
    } = this.state

    return (
      <div id='messaging_container'>
        <div id='messaging_side_menu' className={style['messaging-side-menu']}>
          <div id='message_side_menu_btns' className={style['messaging-side-menu-btns']}>
            {mainButtons.map((btnAction, index) => {
              return <button
                key={btnAction}
                id={btnAction}
                className={style.btn}
                style={{
                  backgroundColor: selectedItemId && strcmp(selectedItemId, btnAction) && '#bf920d',
                  color: selectedItemId && strcmp(selectedItemId, btnAction) && '#1f1f1f'
                }}
                onClick={() => this.handleMainBtnClick(btnAction)}
              >
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.${mainButtonsLabels[index]}`,
                  defaultMessage: `${config.labelBasePath}.main.${mainButtonsLabels[index]}`
                })}
                {strcmp(btnAction, 'inbox') && <span className={style['unread-number']}>({numOfUnreadInboxMsgs})</span>}
                {strcmp(btnAction, 'archived') && <span className={style['unread-number']}>({numOfUnreadArchivedMsgs})</span>}
              </button>
            })}
          </div>
        </div>
        <div
          id='messaging_data_holder'
          className={style['messaging-data-holder']}
          style={{
            display: strcmp(selectedItemId, 'compose') ? 'flex' : 'block',
            justifyContent: isValidArray(this.state.messages, 1) ? null : 'center'
          }}
        >
          {!strcmp(selectedItemId, 'compose') && !strcmp(selectedItemId, 'initial') &&
            <div className={style['search-container']}>
              <select
                id='selectedCriteria'
                name='selectedCriteria'
                value={selectedCriteria}
                onChange={this.handleCriteriaChange}
                className={style['search-dropdown']}
              >
                {this.generateCriteriaDropdown()}
              </select>
              {strcmp(selectedCriteria, 'TITLE') &&
                <input
                  className={style['search-input']}
                  placeholder={this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.message.search_placeholder`,
                    defaultMessage: `${config.labelBasePath}.message.search_placeholder`
                  })}
                  type='text'
                  id='searchValue'
                  name='searchValue'
                  onChange={this.onChange}
                  value={searchValue}
                  onKeyDown={this.handleSearchByTheEnterKey}
                />
              }
              {strcmp(selectedCriteria, 'TEXT') &&
                <input
                  className={style['search-input']}
                  placeholder={this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.message.search_placeholder`,
                    defaultMessage: `${config.labelBasePath}.message.search_placeholder`
                  })}
                  type='text'
                  id='searchValue'
                  name='searchValue'
                  onChange={this.onChange}
                  value={searchValue}
                  onKeyDown={this.handleSearchByTheEnterKey}
                />
              }
              {strcmp(selectedCriteria, 'PRIORITY') &&
                <select
                  id='searchValue'
                  name='searchValue'
                  value={searchValue}
                  onChange={this.onChange}
                  className={style['secondary-search-dropdown']}
                >
                  <option value='' disabled>
                    {this.context.intl.formatMessage({
                      id: `${config.labelBasePath}.message.select_priority`,
                      defaultMessage: `${config.labelBasePath}.message.select_priority`
                    })}
                  </option>
                  {this.state.priorities && this.state.priorities.map((priority, index) => {
                    return <option key={priority} value={priority}>{this.state.prioritiesLabels[index]}</option>
                  })}
                </select>
              }
              {strcmp(selectedCriteria, 'CATEGORY') &&
                <select
                  id='searchValue'
                  name='searchValue'
                  value={searchValue}
                  onChange={this.onChange}
                  className={style['secondary-search-dropdown']}
                >
                  <option value='' disabled>
                    {this.context.intl.formatMessage({
                      id: `${config.labelBasePath}.message.select_category`,
                      defaultMessage: `${config.labelBasePath}.message.select_category`
                    })}
                  </option>
                  {this.state.categories && this.state.categories.map((priority, index) => {
                    return <option key={priority} value={priority}>{this.state.categoriesLabels[index]}</option>
                  })}
                </select>
              }
              {strcmp(selectedCriteria, 'MULTIPLE') &&
                <React.Fragment>
                  <input
                    className={style['search-input']}
                    style={{ width: '15%' }}
                    placeholder={this.context.intl.formatMessage({
                      id: `${config.labelBasePath}.main.subject.title`,
                      defaultMessage: `${config.labelBasePath}.main.subject.title`
                    })}
                    type='text'
                    id='titleValue'
                    name='titleValue'
                    onChange={this.onChange}
                    value={titleValue}
                    onKeyDown={this.handleMultipleCriteriaSearchByTheEnterKey}
                  />
                  <input
                    className={style['search-input']}
                    style={{ width: '15%' }}
                    placeholder={this.context.intl.formatMessage({
                      id: `${config.labelBasePath}.grid_labels.message.text`,
                      defaultMessage: `${config.labelBasePath}.grid_labels.message.text`
                    })}
                    type='text'
                    id='textValue'
                    name='textValue'
                    onChange={this.onChange}
                    value={textValue}
                    onKeyDown={this.handleMultipleCriteriaSearchByTheEnterKey}
                  />
                  <select
                    id='priorityValue'
                    name='priorityValue'
                    value={priorityValue}
                    onChange={this.onChange}
                    className={style['secondary-search-dropdown']}
                  >
                    <option value='' disabled>
                      {this.context.intl.formatMessage({
                        id: `${config.labelBasePath}.message.select_priority`,
                        defaultMessage: `${config.labelBasePath}.message.select_priority`
                      })}
                    </option>
                    {this.state.priorities && this.state.priorities.map((priority, index) => {
                      return <option key={priority} value={priority}>{this.state.prioritiesLabels[index]}</option>
                    })}
                  </select>
                  <select
                    id='categoryValue'
                    name='categoryValue'
                    value={categoryValue}
                    onChange={this.onChange}
                    className={style['secondary-search-dropdown']}
                  >
                    <option value='' disabled>
                      {this.context.intl.formatMessage({
                        id: `${config.labelBasePath}.message.select_category`,
                        defaultMessage: `${config.labelBasePath}.message.select_category`
                      })}
                    </option>
                    {this.state.categories && this.state.categories.map((priority, index) => {
                      return <option key={priority} value={priority}>{this.state.categoriesLabels[index]}</option>
                    })}
                  </select>
                </React.Fragment>
              }
              {!strcmp(selectedCriteria, 'MULTIPLE')
                ? <button id='search-btn' className={`${style['search-btn']}`} onClick={this.searchMessages}>
                  {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.main.search`,
                    defaultMessage: `${config.labelBasePath}.main.search`
                  })}
                </button>
                : <button id='multiple-search-btn' className={`${style['search-btn']}`} onClick={this.searchMessagesByMultipleCriteria}>
                  {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.main.search`,
                    defaultMessage: `${config.labelBasePath}.main.search`
                  })}
                </button>
              }
            </div>
          }
          {showMessagesGrid && <MessagesGrid
            messages={this.state.messages}
            currentUserObjId={this.props.currentUserObjId}
            handleMainBtnClick={this.handleMainBtnClick}
            archiveMessagePrompt={this.archiveMessagePrompt}
            unarchiveMessagePrompt={this.unarchiveMessagePrompt}
            selectedItemId={this.state.selectedItemId}
          />}
          {this.state.showForm &&
            <React.Fragment>
              <div
                id='create_new_message_form'
                className='form-test custom-modal-content'
                style={{
                  height: '100%',
                  width: '90%',
                  color: '#ffffff',
                  backgroundColor: 'transparent',
                  border: 'none'
                }}
              >
                <div className='form-group field field-object' style={{ textAlign: 'center', display: 'inline-grid', alignItems: 'center' }}>
                  <div className='form-group field field-string' style={{ marginTop: '-0.5rem' }}>
                    <label htmlFor='recipients'>
                      {this.context.intl.formatMessage({
                        id: config.labelBasePath + '.message.recipients',
                        defaultMessage: config.labelBasePath + '.message.recipients'
                      })}
                    </label>
                    <Select
                      className={style.CustomDropdown}
                      id='recipients'
                      name='recipients'
                      multi
                      removeSelected
                      onChange={this.handleUserSelection}
                      options={this.state.users}
                      value={this.state.selectedUsers}
                      noResultsText={this.context.intl.formatMessage({
                        id: config.labelBasePath + '.main.no_username_found',
                        defaultMessage: config.labelBasePath + '.main.no_username_found'
                      })}
                      placeholder={this.context.intl.formatMessage({
                        id: config.labelBasePath + '.message.select_recipients',
                        defaultMessage: config.labelBasePath + '.message.select_recipients'
                      })}
                    />
                  </div>
                  <div id='ccRecipients' className='form-group field field-string' style={{ marginTop: '-1rem' }}>
                    <label htmlFor='cc'>
                      {this.context.intl.formatMessage({
                        id: config.labelBasePath + '.message.cc',
                        defaultMessage: config.labelBasePath + '.message.cc'
                      })}
                    </label>
                    <Select
                      className={style.CustomDropdown}
                      id='cc'
                      name='cc'
                      multi
                      removeSelected
                      onChange={this.handleCcSelection}
                      options={this.state.users}
                      value={this.state.selectedCc}
                      noResultsText={this.context.intl.formatMessage({
                        id: config.labelBasePath + '.main.no_username_found',
                        defaultMessage: config.labelBasePath + '.main.no_username_found'
                      })}
                      placeholder={this.context.intl.formatMessage({
                        id: config.labelBasePath + '.message.select_cc_recipients',
                        defaultMessage: config.labelBasePath + '.message.select_cc_recipients'
                      })}
                    />
                  </div>
                  <div id='bccRecipients' className='form-group field field-string' style={{ marginTop: '-1rem' }}>
                    <label htmlFor='bcc'>
                      {this.context.intl.formatMessage({
                        id: config.labelBasePath + '.message.bcc',
                        defaultMessage: config.labelBasePath + '.message.bcc'
                      })}
                    </label>
                    <Select
                      className={style.CustomDropdown}
                      id='bcc'
                      name='bcc'
                      multi
                      removeSelected
                      menuIsOpen={false}
                      onChange={this.handleBccSelection}
                      options={this.state.users}
                      value={this.state.selectedBcc}
                      noResultsText={this.context.intl.formatMessage({
                        id: config.labelBasePath + '.main.no_username_found',
                        defaultMessage: config.labelBasePath + '.main.no_username_found'
                      })}
                      placeholder={this.context.intl.formatMessage({
                        id: config.labelBasePath + '.message.select_bcc_recipients',
                        defaultMessage: config.labelBasePath + '.message.select_bcc_recipients'
                      })}
                    />
                  </div>
                  <div id='org_unit_responsible' className={`form-group field field-string ${style['org-unit-responsible-container']}`}>
                    <div id='region_responsible' style={{ width: '25%' }}>
                      <label htmlFor='regionObjId'>
                        {this.context.intl.formatMessage({
                          id: config.labelBasePath + '.message.region_name',
                          defaultMessage: config.labelBasePath + '.message.region_name'
                        })}
                      </label>
                      <select
                        name='regionObjId'
                        id='regionObjId'
                        className='form-control'
                        onChange={this.chooseRegion}
                        style={{ backgroundColor: '#e3eedd', color: '#000000', width: 'auto' }}
                      >
                        <option
                          id='blankPlaceholder'
                          key='blankPlaceholder'
                          value=''
                          selected disabled hidden
                        />
                        {isValidArray(regions, 1) && regions.map(region => <option key={region.value} value={region.value}>{region.name}</option>)}
                      </select>
                    </div>
                    <div id='municipality_responsible' style={{ width: '25%' }}>
                      <label htmlFor='municipalityObjId'>
                        {this.context.intl.formatMessage({
                          id: config.labelBasePath + '.message.municipality_name',
                          defaultMessage: config.labelBasePath + '.message.municipality_name'
                        })}
                      </label>
                      <select
                        name='municipalityObjId'
                        id='municipalityObjId'
                        className='form-control'
                        onChange={this.chooseMunicipality}
                        style={{ backgroundColor: '#e3eedd', color: '#000000', width: 'auto' }}
                      >
                        <option
                          id='blankPlaceholder'
                          key='blankPlaceholder'
                          value=''
                          selected disabled hidden
                        />
                        {isValidArray(municipalities, 1) && municipalities.map(munic => <option key={munic.value} value={munic.value}>{munic.name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <div className='form-group field field-object' style={{ textAlign: 'center', marginTop: '-1rem' }}>
                  <fieldset>
                    <div className='form-group field field-string' style={{ width: '40%' }}>
                      <label htmlFor='messageSubject'>
                        {this.context.intl.formatMessage({
                          id: config.labelBasePath + '.message.subject',
                          defaultMessage: config.labelBasePath + '.message.subject'
                        })}
                      </label>
                      <input
                        type='text'
                        id='messageSubject'
                        name='messageSubject'
                        className='form-control'
                        onChange={this.onChange}
                        value={this.state.messageSubject}
                      />
                    </div>
                    <div className='form-group field field-string'>
                      <label htmlFor='selectedCategory'>
                        {this.context.intl.formatMessage({
                          id: config.labelBasePath + '.message.category',
                          defaultMessage: config.labelBasePath + '.message.category'
                        })}
                      </label>
                      <select
                        name='selectedCategory'
                        id='selectedCategory'
                        className='form-control'
                        onChange={this.onChange}
                        value={this.state.selectedCategory}
                        style={{
                          backgroundColor: '#e3eedd',
                          color: '#000000',
                          width: 'auto'
                        }}
                      >
                        <option
                          id='blankPlaceholder'
                          key='blankPlaceholder'
                          value=''
                          selected disabled hidden
                        />
                        {this.state.categories && this.state.categories.map((category, index) => {
                          return <option key={category} value={category}>{this.state.categoriesLabels[index]}</option>
                        })}
                      </select>
                    </div>
                    <div className='form-group field field-string'>
                      <label htmlFor='selectedModuleName'>
                        {this.context.intl.formatMessage({
                          id: config.labelBasePath + '.message.module_name',
                          defaultMessage: config.labelBasePath + '.message.module_name'
                        })}
                      </label>
                      <select
                        name='selectedModuleName'
                        id='selectedModuleName'
                        className='form-control'
                        onChange={this.onChange}
                        value={this.state.selectedModuleName}
                        style={{
                          backgroundColor: '#e3eedd',
                          color: '#000000',
                          width: 'auto'
                        }}
                      >
                        <option
                          id='blankPlaceholder'
                          key='blankPlaceholder'
                          value=''
                          selected disabled hidden
                        />
                        {this.state.moduleNames && this.state.moduleNames.map((moduleName, index) => {
                          return <option key={moduleName} value={moduleName}>{this.state.moduleNamesLabels[index]}</option>
                        })}
                      </select>
                    </div>
                    <div className='form-group field field-string'>
                      <label htmlFor='messagePriority'>
                        {this.context.intl.formatMessage({
                          id: config.labelBasePath + '.message.priority',
                          defaultMessage: config.labelBasePath + '.message.priority'
                        })}
                      </label>
                      <select
                        name='messagePriority'
                        id='messagePriority'
                        className='form-control'
                        onChange={this.onChange}
                        value={this.state.messagePriority}
                        style={{
                          backgroundColor: '#e3eedd',
                          color: '#000000',
                          width: 'auto'
                        }}
                      >
                        <option
                          id='blankPlaceholder'
                          key='blankPlaceholder'
                          value=''
                          selected disabled hidden
                        />
                        {this.state.priorities && this.state.priorities.map((priority, index) => {
                          return <option key={priority} value={priority}>{this.state.prioritiesLabels[index]}</option>
                        })}
                      </select>
                    </div>
                  </fieldset>
                </div>
                <div className='form-group field field-object' style={{ textAlign: 'center' }}>
                  <fieldset>
                    <div className='form-group field field-string'>
                      <textarea
                        name='messageBody'
                        id='messageBody'
                        className='form-control'
                        style={{ minHeight: '170px', minWidth: '1000px', fontSize: 'larger' }}
                        onChange={this.onChange}
                        value={this.state.messageBody}
                        placeholder={this.context.intl.formatMessage({
                          id: config.labelBasePath + '.message.type_your_message_here',
                          defaultMessage: config.labelBasePath + '.message.type_your_message_here'
                        })}
                      />
                    </div>
                  </fieldset>
                </div>
                <div id='attachments_container' style={{ textAlign: 'center', width: '100%' }}>
                  <div
                    id='attachments_icon_container'
                    style={{ cursor: 'pointer', float: 'left' }}
                    title={!this.state.showAttachmentsSelectors ? this.context.intl.formatMessage({
                      id: config.labelBasePath + '.message.click_here_to_add_attachments',
                      defaultMessage: config.labelBasePath + '.message.click_here_to_add_attachments'
                    }) : this.context.intl.formatMessage({
                      id: config.labelBasePath + '.message.click_here_to_remove_attachments',
                      defaultMessage: config.labelBasePath + '.message.click_here_to_remove_attachments'
                    })}
                  >
                    {!this.state.showAttachmentsSelectors
                      ? <i
                        className={`fa fa-paperclip ${style['attachment-icon']}`}
                        aria-hidden='true'
                        style={{ fontSize: 'xxx-large', marginTop: '2.5rem' }}
                        onClick={this.showAttachmentSelectors}
                      />
                      : <i
                        className={`fa fa-trash ${style['attachment-icon']}`}
                        aria-hidden='true'
                        style={{ fontSize: 'xxx-large', marginTop: '2.5rem' }}
                        onClick={this.showAttachmentSelectors}
                      />}
                  </div>
                  {this.state.showAttachmentsSelectors && <div className={style['attachment-selectors']}>
                    {!isValidArray(this.state.selectedAnimal, 1)
                      ? <p className={style['attachment-selector']} onClick={this.handleAnimalsModal}>
                        {this.context.intl.formatMessage({
                          id: config.labelBasePath + '.message.attach_animal',
                          defaultMessage: config.labelBasePath + '.message.attach_animal'
                        })}
                      </p>
                      : <div style={{ display: 'inline-flex', alignItems: 'baseline' }}>
                        {this.context.intl.formatMessage({
                          id: config.labelBasePath + '.main.animal',
                          defaultMessage: config.labelBasePath + '.main.animal'
                        })}:
                        {this.state.selectedAnimal.map((animal, index) => (
                          <React.Fragment>
                            <p
                              key={index} id={index}
                              className={style['attachment-link']} style={{ marginLeft: '5px' }}
                              onClick={() => this.showAnimalForm(animal['ANIMAL.OBJECT_ID'])}
                              title={this.context.intl.formatMessage({
                                id: config.labelBasePath + '.message.click_here_for_animal_details',
                                defaultMessage: config.labelBasePath + '.message.click_here_for_animal_details'
                              })}
                            >
                              {animal['ANIMAL.ANIMAL_ID']}
                            </p>
                            <i
                              className={`fa fa-trash ${style['attachment-icon']}`}
                              aria-hidden='true'
                              style={{ cursor: 'pointer', marginLeft: '0.5rem' }}
                              onClick={() => this.removeSelectedAnimalPrompt(index)}
                              title={this.context.intl.formatMessage({
                                id: config.labelBasePath + '.message.click_here_to_remove_attached_animal',
                                defaultMessage: config.labelBasePath + '.message.click_here_to_remove_attached_animal'
                              })}
                            />
                          </React.Fragment>
                        ))}
                        {!isValidArray(this.state.selectedAnimal, 5) &&
                          <i
                            className={`fa fa-plus ${style['attachment-icon']}`}
                            aria-hidden='true'
                            style={{ cursor: 'pointer', marginLeft: '0.5rem' }}
                            onClick={this.handleAnimalsModal}
                            title={this.context.intl.formatMessage({
                              id: config.labelBasePath + '.message.click_here_to_attach_another_animal',
                              defaultMessage: config.labelBasePath + '.message.click_here_to_attach_another_animal'
                            })}
                          />
                        }
                      </div>
                    }
                    {!isValidArray(this.state.selectedHolding, 1)
                      ? <p className={style['attachment-selector']} onClick={this.handleHoldingsModal}>
                        {this.context.intl.formatMessage({
                          id: config.labelBasePath + '.message.attach_holding',
                          defaultMessage: config.labelBasePath + '.message.attach_holding'
                        })}
                      </p>
                      : <div style={{ display: 'inline-flex', alignItems: 'baseline' }}>
                        {this.context.intl.formatMessage({
                          id: config.labelBasePath + '.main.holding.general',
                          defaultMessage: config.labelBasePath + '.main.holding.general'
                        })}:
                        {this.state.selectedHolding.map((holding, index) => (
                          <React.Fragment>
                            <p
                              key={index} id={index}
                              className={style['attachment-link']} style={{ marginLeft: '5px' }}
                              onClick={() => this.showHoldingForm(holding['HOLDING.OBJECT_ID'])}
                              title={this.context.intl.formatMessage({
                                id: config.labelBasePath + '.message.click_here_for_holding_details',
                                defaultMessage: config.labelBasePath + '.message.click_here_for_holding_details'
                              })}
                            >
                              {holding['HOLDING.PIC']}
                            </p>
                            <i
                              className={`fa fa-trash ${style['attachment-icon']}`}
                              aria-hidden='true'
                              style={{ cursor: 'pointer', marginLeft: '0.5rem' }}
                              onClick={() => this.removeSelectedHoldingPrompt(index)}
                              title={this.context.intl.formatMessage({
                                id: config.labelBasePath + '.message.click_here_to_remove_attached_holding',
                                defaultMessage: config.labelBasePath + '.message.click_here_to_remove_attached_holding'
                              })}
                            />
                          </React.Fragment>
                        ))}
                        {!isValidArray(this.state.selectedHolding, 5) &&
                          <i
                            className={`fa fa-plus ${style['attachment-icon']}`}
                            aria-hidden='true'
                            style={{ cursor: 'pointer', marginLeft: '0.5rem' }}
                            onClick={this.handleHoldingsModal}
                            title={this.context.intl.formatMessage({
                              id: config.labelBasePath + '.message.click_here_to_attach_another_holding',
                              defaultMessage: config.labelBasePath + '.message.click_here_to_attach_another_holding'
                            })}
                          />
                        }
                      </div>
                    }
                    {!isValidArray(this.state.selectedHoldingResponsible, 1)
                      ? <p className={style['attachment-selector']} onClick={this.handleHoldingResponsiblesModal}>
                        {this.context.intl.formatMessage({
                          id: config.labelBasePath + '.message.attach_holding_responsible',
                          defaultMessage: config.labelBasePath + '.message.attach_holding_responsible'
                        })}
                      </p>
                      : <div style={{ display: 'inline-flex', alignItems: 'baseline' }}>
                        {this.context.intl.formatMessage({
                          id: config.labelBasePath + '.main.holding_responsible.general',
                          defaultMessage: config.labelBasePath + '.main.holding_responsible.general'
                        })}:
                        {this.state.selectedHoldingResponsible.map((holdingResponsible, index) => (
                          <React.Fragment>
                            <p
                              key={index} id={index}
                              className={style['attachment-link']} style={{ marginLeft: '5px' }}
                              onClick={() => this.showHoldingResponsibleForm(holdingResponsible['HOLDING_RESPONSIBLE.OBJECT_ID'])}
                              title={this.context.intl.formatMessage({
                                id: config.labelBasePath + '.message.click_here_for_holding_responsible_details',
                                defaultMessage: config.labelBasePath + '.message.click_here_for_holding_responsible_details'
                              })}
                            >
                              {holdingResponsible['HOLDING_RESPONSIBLE.NAT_REG_NUMBER']}
                            </p>
                            <i
                              className={`fa fa-trash ${style['attachment-icon']}`}
                              aria-hidden='true'
                              style={{ cursor: 'pointer', marginLeft: '0.5rem' }}
                              onClick={() => this.removeSelectedHoldingResponsiblePrompt(index)}
                              title={this.context.intl.formatMessage({
                                id: config.labelBasePath + '.message.click_here_to_remove_attached_holding_responsible',
                                defaultMessage: config.labelBasePath + '.message.click_here_to_remove_attached_holding_responsible'
                              })}
                            />
                          </React.Fragment>
                        ))}
                        {!isValidArray(this.state.selectedHoldingResponsible, 5) &&
                          <i
                            className={`fa fa-plus ${style['attachment-icon']}`}
                            aria-hidden='true'
                            style={{ cursor: 'pointer', marginLeft: '0.5rem' }}
                            onClick={this.handleHoldingResponsiblesModal}
                            title={this.context.intl.formatMessage({
                              id: config.labelBasePath + '.message.click_here_to_attach_another_holding_responsible',
                              defaultMessage: config.labelBasePath + '.message.click_here_to_attach_another_holding_responsible'
                            })}
                          />
                        }
                      </div>
                    }
                  </div>}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <button
                    id='sendMessage'
                    className='btn-success btn_save_form'
                    style={{ float: 'right', width: '20%', padding: '6px 6px', marginTop: '4rem' }}
                    onClick={this.sendMessagePrompt}
                  >
                    {this.context.intl.formatMessage({
                      id: config.labelBasePath + '.message.send',
                      defaultMessage: config.labelBasePath + '.message.send'
                    })}
                  </button>
                </div>
              </div>
            </React.Fragment>
          }
        </div>
        {this.state.loading && <Loading />}
        {this.state.showAnimalsModal && <GridInModalLinkObjects
          loadFromParent
          key='ANIMAL_ATTACHMENT_GRID'
          linkedTable='ANIMAL'
          onRowSelect={this.chooseAnimal}
          closeModal={this.handleAnimalsModal}
        />}
        {this.state.showAnimalForm && <div id='form_modal' className='modal' style={{ display: 'block', color: '#ffffff', textAlign: 'center' }}>
          <div id='form_modal_content' className='modal-content'>
            <div className='modal-header'>
              <button id='modal_close_btn' type='button' className='close' onClick={this.closeAnimalsForm} data-dismiss='modal'>&times;</button>
            </div>
            <div id='form_modal_body' className='modal-body'>
              {this.state.showAnimalForm}
            </div>
          </div>
        </div>}
        {this.state.showHoldingsModal && <GridInModalLinkObjects
          loadFromParent
          key='HOLDING_ATTACHMENT_GRID'
          linkedTable='HOLDING'
          onRowSelect={this.chooseHolding}
          closeModal={this.handleHoldingsModal}
          gridTypeCall='GET_TABLE_WITH_LIKE_FILTER_2'
        />}
        {this.state.showHoldingForm && <div id='form_modal' className='modal' style={{ display: 'block', color: '#ffffff', textAlign: 'center' }}>
          <div id='form_modal_content' className='modal-content'>
            <div className='modal-header'>
              <button id='modal_close_btn' type='button' className='close' onClick={this.closeHoldingForm} data-dismiss='modal'>&times;</button>
            </div>
            <div id='form_modal_body' className='modal-body'>
              {this.state.showHoldingForm}
            </div>
          </div>
        </div>}
        {this.state.showHoldingResponsiblesModal && <GridInModalLinkObjects
          loadFromParent
          key='HOLDING_RESPONSIBLE_ATTACHMENT_GRID'
          linkedTable='HOLDING_RESPONSIBLE'
          onRowSelect={this.chooseHoldingResponsible}
          closeModal={this.handleHoldingResponsiblesModal}
        />}
        {this.state.showHoldingResponsibleForm && <div id='form_modal' className='modal' style={{ display: 'block', color: '#ffffff', textAlign: 'center' }}>
          <div id='form_modal_content' className='modal-content'>
            <div className='modal-header'>
              <button id='modal_close_btn' type='button' className='close' onClick={this.closeHoldingResponsibleForm} data-dismiss='modal'>&times;</button>
            </div>
            <div id='form_modal_body' className='modal-body'>
              {this.state.showHoldingResponsibleForm}
            </div>
          </div>
        </div>}
      </div>
    )
  }
}

MessagingHolder.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  svSession: state.security.svSession,
  currentUserObjId: state.userInfoReducer.userObjId,
  currentUserUsername: state.userInfoReducer.userName,
  weComeFromTheUnreadMessagesAlert: state.unreadMessagesAlert.weComeFromTheUnreadMessagesAlert,
  numOfUnreadInboxMsgs: state.unreadMessages.numOfUnreadInboxMsgs,
  numOfUnreadArchivedMsgs: state.unreadMessages.numOfUnreadArchivedMsgs
})

const mapDispatchToProps = dispatch => ({
  userInfoAction: (svSession, actionType, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, json) => {
    dispatch(userInfoAction(svSession, actionType, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, json))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(MessagingHolder)
