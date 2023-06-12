import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import Loading from 'components/Loading'
import { GridManager, ComponentManager, alertUser } from 'tibro-components'
import { store } from 'tibro-redux'
import { GridInModalLinkObjects } from 'components/ComponentsIndex'
import * as config from 'config/config.js'
import style from 'components/AppComponents/ExecuteActions/ExecuteActionOnSelectedRows.module.css'
import { convertToShortDate, formatAlertType, insertSpaceAfterAChar, disableEvents } from 'functions/utils'

class RFIDActions extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: null,
      loading: false,
      gridToDisplay: 'HOLDING',
      altGridToDisplay: 'EXPORT_CERT',
      displayTransferActionForm: false,
      displayRegisterActionForm: false,
      displayExportActionForm: false,
      displayHoldingSearchPopup: false,
      displayExportCertSearchPopup: false,
      validVaccEvents: [],
      retireSublistActions: ['died', 'lost', 'sold', 'absent', 'slaughter', 'destroy', 'generate_pre_mortem', 'generate_post_mortem'],
      retireDate: undefined,
      physicalCheckDate: undefined,
      campaignDate: undefined,
      exportDate: undefined,
      exportCertAnimalsDate: undefined,
      transferDate: undefined,
      registerDate: undefined,
      animalRaces: [],
      animalClass: '',
      holdingPic: '',
      holdingObjId: '',
      holdingObjType: '',
      selectedAnimalRace: '',
      selectedGender: '',
      exportCertId: '',
      exportCertObjId: '',
      exportCertObjType: ''
    }
  }

  componentDidMount () {
    this.getValidVaccEvents()

    if (this.props.gridHierarchy) {
      this.props.gridHierarchy.forEach(grid => {
        if (grid.active && grid.gridType === 'RFID_INPUT') {
          this.setState({ animalClass: grid.row['RFID_INPUT.ANIMAL_TYPE'] })
        }
      })
    }
  }

  componentDidUpdate (nextProps, nextState) {
    const destinationHoldingInputOne = document.getElementById('destinationHoldingRegister')
    if (destinationHoldingInputOne) {
      disableEvents(destinationHoldingInputOne)
    }

    const destinationHoldingInputTwo = document.getElementById('destinationHoldingTransfer')
    if (destinationHoldingInputTwo) {
      disableEvents(destinationHoldingInputTwo)
    }

    const exportCertificateInput = document.getElementById('exportCertificate')
    if (exportCertificateInput) {
      disableEvents(exportCertificateInput)
    }

    if (this.state.animalClass !== nextState.animalClass) {
      this.getAvailableAnimalRaces()
    }
  }

  getValidVaccEvents = () => {
    const server = config.svConfig.restSvcBaseUrl
    const verbPath = config.svConfig.triglavRestVerbs.GET_VALID_VACCINATION_EVENTS
    const url = `${server}${verbPath}${this.props.session}`
    axios.get(url).then(res => {
      if (res.data.items) {
        let campaignsArr = []
        res.data.items.forEach(campaign => {
          campaignsArr.push({
            campaignNote: campaign['NOTE'],
            campaignObjId: campaign['object_id']
          })
          this.setState({ validVaccEvents: campaignsArr })
        })
      }
    }).catch(err => {
      this.setState({
        alert: alertUser(true, 'error',
          this.context.intl.formatMessage({
            id: err,
            defaultMessage: err
          }), null, () => this.setState({ alert: false })
        )
      })
    })
  }

  getAvailableAnimalRaces = () => {
    const server = config.svConfig.restSvcBaseUrl
    const verbPath = config.svConfig.triglavRestVerbs.GET_DEPENDENT_DDL_OPTIONS_LIST
    let url = `${server}${verbPath}${this.props.session}/ANIMAL/${this.state.animalClass}`
    axios.get(url).then(res => {
      if (res.data.items) {
        let racesObjArr = []
        res.data.items.forEach(race => racesObjArr.push({
          raceCodeValue: race['CODE_VALUE'],
          raceTranslation: race['LBL_TRANSL']
        }))
        this.setState({ animalRaces: racesObjArr })
      }
    }).catch(err => console.error(err))
  }

  setDate = e => this.setState({ [e.target.name]: e.target.value })

  executeRetireActionPrompt = actionType => {
    if (this.props.selectedGridRows.length === 0) {
      this.emptySelectionAlert()
    } else {
      let wrapper = document.createElement('div')
      ReactDOM.render(
        <React.Fragment>
          <label htmlFor='activityDate' style={{ marginRight: '8px' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.set_activity_date`,
              defaultMessage: `${config.labelBasePath}.main.set_activity_date`
            })}
          </label>
          <input
            style={{ border: 'none', height: '40px', color: '#000', backgroundColor: '#eff0f1' }}
            type='date'
            name='retireDate'
            onChange={this.setDate}
            value={this.state.retireDate}
          />
        </React.Fragment>,
        wrapper
      )

      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.prompt_text`,
            defaultMessage: `${config.labelBasePath}.actions.prompt_text`
          }) + ' ' + '"' + this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.${actionType}`,
            defaultMessage: `${config.labelBasePath}.actions.${actionType}`
          }) + '"' + '?',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.default_date_msg`,
            defaultMessage: `${config.labelBasePath}.actions.default_date_msg`
          }), () => this.executeRetireAction(actionType),
          () => {
            this.setState({ alert: false, retireDate: undefined })
          }, true,
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.execute`,
            defaultMessage: `${config.labelBasePath}.actions.execute`
          }),
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.forms.cancel`,
            defaultMessage: `${config.labelBasePath}.main.forms.cancel`
          }), true, null, true, wrapper
        )
      })
    }
  }

  executeRetireAction = actionType => {
    this.setState({ loading: true })
    const objectArray = this.props.selectedGridRows
    const paramsArray = [{
      MASS_PARAM_ACTION: 'ACTION',
      MASS_PARAM_SUBACTION: actionType.toUpperCase(),
      MASS_PARAM_ACTION_DATE: this.state.retireDate || convertToShortDate(new Date(), 'y-m-d'),
      MASS_PARAM_ANIMAL_CLASS: this.state.animalClass,
      MASS_PARAM_RFID_OBJECT_ID: this.props.parentId
    }]

    const verbPath = config.svConfig.triglavRestVerbs.GENERATE_RFID_RESULT
    const url = `${config.svConfig.restSvcBaseUrl}${verbPath}/${this.props.session}`
    axios({
      method: 'post',
      url,
      data: JSON.stringify({ objectArray, paramsArray })
    }).then(res => {
      this.setState({ loading: false, retireDate: undefined })
      const responseType = formatAlertType(res.data)
      this.setState({
        alert: alertUser(
          true, responseType,
          this.context.intl.formatMessage({
            id: res.data,
            defaultMessage: res.data
          }), null
        )
      })
      this.reloadGrid()
    }).catch(err => {
      this.setState({ loading: false, retireDate: undefined })
      this.setState({
        alert: alertUser(
          true, 'error',
          this.context.intl.formatMessage({
            id: err,
            defaultMessage: err
          }), null
        )
      })
    })
  }

  executePhysicalCheckActionPrompt = () => {
    if (this.props.selectedGridRows.length === 0) {
      this.emptySelectionAlert()
    } else {
      let wrapper = document.createElement('div')
      ReactDOM.render(
        <React.Fragment>
          <label htmlFor='activityDate' style={{ marginRight: '8px' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.set_activity_date`,
              defaultMessage: `${config.labelBasePath}.main.set_activity_date`
            })}
          </label>
          <input
            style={{ border: 'none', height: '40px', color: '#000', backgroundColor: '#eff0f1' }}
            type='date'
            name='physicalCheckDate'
            onChange={this.setDate}
            value={this.state.physicalCheckDate}
          />
        </React.Fragment>,
        wrapper
      )

      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.prompt_text`,
            defaultMessage: `${config.labelBasePath}.actions.prompt_text`
          }) + ' ' + '"' + this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.physicalCheck`,
            defaultMessage: `${config.labelBasePath}.actions.physicalCheck`
          }) + '"' + '?',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.default_date_msg`,
            defaultMessage: `${config.labelBasePath}.actions.default_date_msg`
          }), () => this.executePhysicalCheckAction(),
          () => {
            this.setState({ alert: false, physicalCheckDate: undefined })
          }, true,
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.execute`,
            defaultMessage: `${config.labelBasePath}.actions.execute`
          }),
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.forms.cancel`,
            defaultMessage: `${config.labelBasePath}.main.forms.cancel`
          }), true, null, true, wrapper
        )
      })
    }
  }

  executePhysicalCheckAction = () => {
    this.setState({ loading: true })
    const objectArray = this.props.selectedGridRows
    const paramsArray = [{
      MASS_PARAM_ACTION: 'ACTION',
      MASS_PARAM_SUBACTION: 'PHYSICAL_CHECK',
      MASS_PARAM_ACTION_DATE: this.state.physicalCheckDate || convertToShortDate(new Date(), 'y-m-d'),
      MASS_PARAM_ANIMAL_CLASS: this.state.animalClass,
      MASS_PARAM_RFID_OBJECT_ID: this.props.parentId
    }]

    const verbPath = config.svConfig.triglavRestVerbs.GENERATE_RFID_RESULT
    const url = `${config.svConfig.restSvcBaseUrl}${verbPath}/${this.props.session}`
    axios({
      method: 'post',
      url,
      data: JSON.stringify({ objectArray, paramsArray })
    }).then(res => {
      this.setState({ loading: false, physicalCheckDate: undefined })
      const responseType = formatAlertType(res.data)
      this.setState({
        alert: alertUser(
          true, responseType,
          this.context.intl.formatMessage({
            id: res.data,
            defaultMessage: res.data
          }), null
        )
      })
      this.reloadGrid()
    }).catch(err => {
      this.setState({ loading: false, physicalCheckDate: undefined })
      this.setState({
        alert: alertUser(
          true, 'error',
          this.context.intl.formatMessage({
            id: err,
            defaultMessage: err
          }), null
        )
      })
    })
  }

  executeCampaignActionPrompt = (campaignName, campaignObjId) => {
    if (this.props.selectedGridRows.length === 0) {
      this.emptySelectionAlert()
    } else {
      let wrapper = document.createElement('div')
      ReactDOM.render(
        <React.Fragment>
          <label htmlFor='activityDate' style={{ marginRight: '8px' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.set_activity_date`,
              defaultMessage: `${config.labelBasePath}.main.set_activity_date`
            })}
          </label>
          <input
            style={{ border: 'none', height: '40px', color: '#000', backgroundColor: '#eff0f1' }}
            type='date'
            name='campaignDate'
            onChange={this.setDate}
            value={this.state.campaignDate}
          />
        </React.Fragment>,
        wrapper
      )

      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.prompt_text`,
            defaultMessage: `${config.labelBasePath}.actions.prompt_text`
          }) + ' ' + '"' + insertSpaceAfterAChar(campaignName, '/') + '"' + '?',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.default_date_msg`,
            defaultMessage: `${config.labelBasePath}.actions.default_date_msg`
          }), () => this.executeCampaignAction(campaignObjId),
          () => {
            this.setState({ alert: false, campaignDate: undefined })
          }, true,
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.execute`,
            defaultMessage: `${config.labelBasePath}.actions.execute`
          }),
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.forms.cancel`,
            defaultMessage: `${config.labelBasePath}.main.forms.cancel`
          }), true, null, true, wrapper
        )
      })
    }
  }

  executeCampaignAction = (campaignObjId) => {
    this.setState({ loading: true })
    const objectArray = this.props.selectedGridRows
    const paramsArray = [{
      MASS_PARAM_ACTION: 'ACTION',
      MASS_PARAM_SUBACTION: 'VACCINATE',
      MASS_PARAM_ACTION_DATE: this.state.campaignDate || convertToShortDate(new Date(), 'y-m-d'),
      MASS_PARAM_ANIMAL_CLASS: this.state.animalClass,
      MASS_PARAM_CAMPAIGN_OBJECT_ID: String(campaignObjId),
      MASS_PARAM_RFID_OBJECT_ID: this.props.parentId
    }]

    const verbPath = config.svConfig.triglavRestVerbs.GENERATE_RFID_RESULT
    const url = `${config.svConfig.restSvcBaseUrl}${verbPath}/${this.props.session}`
    axios({
      method: 'post',
      url,
      data: JSON.stringify({ objectArray, paramsArray })
    }).then(res => {
      this.setState({ loading: false, campaignDate: undefined })
      const responseType = formatAlertType(res.data)
      this.setState({
        alert: alertUser(
          true, responseType,
          this.context.intl.formatMessage({
            id: res.data,
            defaultMessage: res.data
          }), null
        )
      })
      this.reloadGrid()
    }).catch(err => {
      this.setState({ loading: false, campaignDate: undefined })
      this.setState({
        alert: alertUser(
          true, 'error',
          this.context.intl.formatMessage({
            id: err,
            defaultMessage: err
          }), null
        )
      })
    })
  }

  executeExportActionPrompt = () => {
    if (!this.state.exportCertId) {
      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.select_export_cert`,
            defaultMessage: `${config.labelBasePath}.alert.select_export_cert`
          }), null, () => this.setState({ alert: false })
        )
      })
    } else {
      let wrapper = document.createElement('div')
      ReactDOM.render(
        <React.Fragment>
          <label htmlFor='activityDate' style={{ marginRight: '8px' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.set_activity_date`,
              defaultMessage: `${config.labelBasePath}.main.set_activity_date`
            })}
          </label>
          <input
            style={{ border: 'none', height: '40px', color: '#000', backgroundColor: '#eff0f1' }}
            type='date'
            name='exportDate'
            onChange={this.setDate}
            value={this.state.exportDate}
          />
        </React.Fragment>,
        wrapper
      )

      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.prompt_text`,
            defaultMessage: `${config.labelBasePath}.actions.prompt_text`
          }) + ' ' + '"' + this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.pending_export`,
            defaultMessage: `${config.labelBasePath}.actions.pending_export`
          }) + '"' + '?',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.default_date_msg`,
            defaultMessage: `${config.labelBasePath}.actions.default_date_msg`
          }), () => this.executeExportAction(),
          () => {
            this.setState({ alert: false, exportDate: undefined })
          }, true,
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.execute`,
            defaultMessage: `${config.labelBasePath}.actions.execute`
          }),
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.forms.cancel`,
            defaultMessage: `${config.labelBasePath}.main.forms.cancel`
          }), true, null, true, wrapper
        )
      })
    }
  }

  executeExportAction = () => {
    this.setState({ loading: true })
    const objectArray = this.props.selectedGridRows
    const paramsArray = [{
      MASS_PARAM_ACTION: 'MOVE_TO_CERT',
      MASS_PARAM_SUBACTION: 'MOVE_TO_CERT',
      MASS_PARAM_ACTION_DATE: this.state.exportDate || convertToShortDate(new Date(), 'y-m-d'),
      MASS_PARAM_ANIMAL_CLASS: this.state.animalClass,
      MASS_PARAM_DESTINATION_OBJ_ID: this.state.exportCertObjId,
      MASS_PARAM_DESTINATION_OBJECT_TYPE: this.state.exportCertObjType,
      MASS_PARAM_RFID_OBJECT_ID: this.props.parentId
    }]

    const verbPath = config.svConfig.triglavRestVerbs.GENERATE_RFID_RESULT
    const url = `${config.svConfig.restSvcBaseUrl}${verbPath}/${this.props.session}`
    axios({
      method: 'post',
      url,
      data: JSON.stringify({ objectArray, paramsArray })
    }).then(res => {
      this.setState({ loading: false, exportDate: undefined })
      const responseType = formatAlertType(res.data)
      this.setState({
        alert: alertUser(
          true, responseType,
          this.context.intl.formatMessage({
            id: res.data,
            defaultMessage: res.data
          }), null
        )
      })
      this.closeExportActionPrompt()
      this.reloadGrid()
    }).catch(err => {
      this.setState({ loading: false, exportDate: undefined })
      this.setState({
        alert: alertUser(
          true, 'error',
          this.context.intl.formatMessage({
            id: err,
            defaultMessage: err
          }), null
        )
      })
    })
  }

  executeExportCertAnimalsPrompt = () => {
    if (this.props.selectedGridRows.length === 0) {
      this.emptySelectionAlert()
    } else {
      let wrapper = document.createElement('div')
      ReactDOM.render(
        <React.Fragment>
          <label htmlFor='activityDate' style={{ marginRight: '8px' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.set_activity_date`,
              defaultMessage: `${config.labelBasePath}.main.set_activity_date`
            })}
          </label>
          <input
            style={{ border: 'none', height: '40px', color: '#000', backgroundColor: '#eff0f1' }}
            type='date'
            name='exportCertAnimalsDate'
            onChange={this.setDate}
            value={this.state.exportCertAnimalsDate}
          />
        </React.Fragment>,
        wrapper
      )

      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.prompt_text`,
            defaultMessage: `${config.labelBasePath}.actions.prompt_text`
          }) + ' ' + '"' + this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.export_certified_animals`,
            defaultMessage: `${config.labelBasePath}.actions.export_certified_animals`
          }) + '"' + '?',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.default_date_msg`,
            defaultMessage: `${config.labelBasePath}.actions.default_date_msg`
          }), () => this.executeExportCertAnimalsAction(),
          () => {
            this.setState({ alert: false, exportCertAnimalsDate: undefined })
          }, true,
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.execute`,
            defaultMessage: `${config.labelBasePath}.actions.execute`
          }),
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.forms.cancel`,
            defaultMessage: `${config.labelBasePath}.main.forms.cancel`
          }), true, null, true, wrapper
        )
      })
    }
  }

  executeExportCertAnimalsAction = () => {
    this.setState({ loading: true })
    const objectArray = this.props.selectedGridRows
    const paramsArray = [{
      MASS_PARAM_ACTION: 'EXPORT',
      MASS_PARAM_SUBACTION: 'EXPORT',
      MASS_PARAM_ACTION_DATE: this.state.exportCertAnimalsDate || convertToShortDate(new Date(), 'y-m-d'),
      MASS_PARAM_ANIMAL_CLASS: this.state.animalClass,
      MASS_PARAM_RFID_OBJECT_ID: this.props.parentId
    }]

    const verbPath = config.svConfig.triglavRestVerbs.GENERATE_RFID_RESULT
    const url = `${config.svConfig.restSvcBaseUrl}${verbPath}/${this.props.session}`
    axios({
      method: 'post',
      url,
      data: JSON.stringify({ objectArray, paramsArray })
    }).then(res => {
      this.setState({ loading: false, exportCertAnimalsDate: undefined })
      const responseType = formatAlertType(res.data)
      this.setState({
        alert: alertUser(
          true, responseType,
          this.context.intl.formatMessage({
            id: res.data,
            defaultMessage: res.data
          }), null
        )
      })
      this.reloadGrid()
    }).catch(err => {
      this.setState({ loading: false, exportCertAnimalsDate: undefined })
      this.setState({
        alert: alertUser(
          true, 'error',
          this.context.intl.formatMessage({
            id: err,
            defaultMessage: err
          }), null
        )
      })
    })
  }

  displayTransferActionPrompt = () => {
    if (this.props.selectedGridRows.length === 0) {
      this.emptySelectionAlert()
    } else {
      this.setState({ displayTransferActionForm: true })
    }
  }

  displayHoldingSearchPopup = () => {
    this.setState({ displayHoldingSearchPopup: true })
  }

  closeHoldingSearchPopup = () => this.setState({ displayHoldingSearchPopup: false })

  displayExportActionPrompt = () => {
    if (this.props.selectedGridRows.length === 0) {
      this.emptySelectionAlert()
    } else {
      this.setState({ displayExportActionForm: true })
    }
  }

  displayExportCertSearchPopup = () => {
    this.setState({ displayExportCertSearchPopup: true })
  }

  closeExportCertSearchPopup = () => this.setState({ displayExportCertSearchPopup: false })

  closeExportActionPrompt = () => {
    this.setState({
      displayExportActionForm: false,
      exportCertObjId: '',
      exportCertObjType: '',
      exportCertId: ''
    })
  }

  closeTransferActionPrompt = () => {
    this.setState({
      displayTransferActionForm: false,
      holdingObjId: '',
      holdingObjType: '',
      holdingPic: ''
    })
  }

  executeTransferActionPrompt = () => {
    if (!this.state.holdingObjId) {
      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.select_destination_holding`,
            defaultMessage: `${config.labelBasePath}.main.select_destination_holding`
          }), null, () => this.setState({ alert: false })
        )
      })
    } else {
      let wrapper = document.createElement('div')
      ReactDOM.render(
        <React.Fragment>
          <label htmlFor='activityDate' style={{ marginRight: '8px' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.set_activity_date`,
              defaultMessage: `${config.labelBasePath}.main.set_activity_date`
            })}
          </label>
          <input
            style={{ border: 'none', height: '40px', color: '#000', backgroundColor: '#eff0f1' }}
            type='date'
            name='transferDate'
            onChange={this.setDate}
            value={this.state.transferDate}
          />
        </React.Fragment>,
        wrapper
      )

      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.prompt_text`,
            defaultMessage: `${config.labelBasePath}.actions.prompt_text`
          }) + ' ' + '"' + this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.direct_transfer_animal`,
            defaultMessage: `${config.labelBasePath}.actions.direct_transfer_animal`
          }) + '"' + '?',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.default_date_msg`,
            defaultMessage: `${config.labelBasePath}.actions.default_date_msg`
          }), () => this.executeTransferAction(),
          () => {
            this.setState({ alert: false, transferDate: undefined })
          }, true,
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.execute`,
            defaultMessage: `${config.labelBasePath}.actions.execute`
          }),
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.forms.cancel`,
            defaultMessage: `${config.labelBasePath}.main.forms.cancel`
          }), true, null, true, wrapper
        )
      })
    }
  }

  executeTransferAction = () => {
    this.setState({ loading: true })
    const objectArray = this.props.selectedGridRows
    const paramsArray = [{
      MASS_PARAM_ACTION: 'TRANSFER',
      MASS_PARAM_SUBACTION: 'TRANSFER',
      MASS_PARAM_ACTION_DATE: this.state.transferDate || convertToShortDate(new Date(), 'y-m-d'),
      MASS_PARAM_ANIMAL_CLASS: this.state.animalClass,
      MASS_PARAM_DESTINATION_OBJ_ID: this.state.holdingObjId,
      MASS_PARAM_DESTINATION_OBJECT_TYPE: this.state.holdingObjType,
      MASS_PARAM_RFID_OBJECT_ID: this.props.parentId
    }]

    const verbPath = config.svConfig.triglavRestVerbs.GENERATE_RFID_RESULT
    const url = `${config.svConfig.restSvcBaseUrl}${verbPath}/${this.props.session}`
    axios({
      method: 'post',
      url,
      data: JSON.stringify({ objectArray, paramsArray })
    }).then(res => {
      this.setState({ loading: false, transferDate: undefined })
      const responseType = formatAlertType(res.data)
      this.setState({
        alert: alertUser(
          true, responseType,
          this.context.intl.formatMessage({
            id: res.data,
            defaultMessage: res.data
          }), null
        )
      })
      this.closeTransferActionPrompt()
      this.reloadGrid()
    }).catch(err => {
      this.setState({ loading: false, transferDate: undefined })
      this.setState({
        alert: alertUser(
          true, 'error',
          this.context.intl.formatMessage({
            id: err,
            defaultMessage: err
          }), null
        )
      })
    })
  }

  chooseDestinationHolding = () => {
    const holdingPic = store.getState()[`${this.state.gridToDisplay}`].rowClicked[`${this.state.gridToDisplay}.PIC`]
    const holdingObjId = store.getState()[`${this.state.gridToDisplay}`].rowClicked[`${this.state.gridToDisplay}.OBJECT_ID`]
    const holdingObjType = store.getState()[`${this.state.gridToDisplay}`].rowClicked[`${this.state.gridToDisplay}.OBJECT_TYPE`]
    const holdingType = store.getState()[`${this.state.gridToDisplay}`].rowClicked[`${this.state.gridToDisplay}.TYPE`]
    const destinationHoldingRegister = document.getElementById('destinationHoldingRegister')
    const destinationHoldingInputTransfer = document.getElementById('destinationHoldingTransfer')

    if (destinationHoldingRegister) {
      if (holdingType && (holdingType === '15' || holdingType === '16' || holdingType === '17')) {
        this.setState({
          alert: alertUser(true, 'warning',
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.alert.error_register_animal_in_shelter_vet_station_or_vet_clinic`,
              defaultMessage: `${config.labelBasePath}.alert.error_register_animal_in_shelter_vet_station_or_vet_clinic`
            }), null, () => this.setState({ alert: alertUser(false, 'info', '') })
          )
        })
      } else {
        destinationHoldingRegister.value = holdingPic
        this.setState({ holdingPic, holdingObjId, holdingObjType })
        this.closeHoldingSearchPopup()
      }
    }
    if (destinationHoldingInputTransfer) {
      if (holdingType && (holdingType === '15' || holdingType === '16' || holdingType === '17')) {
        this.setState({
          alert: alertUser(true, 'warning',
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.alert.error_transfer_animal_to_shelter_vet_station_or_vet_clinic`,
              defaultMessage: `${config.labelBasePath}.alert.error_transfer_animal_to_shelter_vet_station_or_vet_clinic`
            }), null, () => this.setState({ alert: alertUser(false, 'info', '') })
          )
        })
      } else {
        destinationHoldingInputTransfer.value = holdingPic
        this.setState({ holdingPic, holdingObjId, holdingObjType })
        this.closeHoldingSearchPopup()
      }
    }
  }

  chooseExportCert = () => {
    const exportCertId = store.getState()[`${this.state.altGridToDisplay}`].rowClicked[`${this.state.altGridToDisplay}.EXP_CERTIFICATE_ID`]
    const exportCertObjId = store.getState()[`${this.state.altGridToDisplay}`].rowClicked[`${this.state.altGridToDisplay}.OBJECT_ID`]
    const exportCertObjType = store.getState()[`${this.state.altGridToDisplay}`].rowClicked[`${this.state.altGridToDisplay}.OBJECT_TYPE`]
    this.setState({ exportCertId, exportCertObjId, exportCertObjType })
    const exportCertificateInput = document.getElementById('exportCertificate')
    exportCertificateInput.value = exportCertId
    this.closeExportCertSearchPopup()
  }

  displayRegisterActionPrompt = () => {
    if (this.props.selectedGridRows.length === 0) {
      this.emptySelectionAlert()
    } else {
      this.setState({ displayRegisterActionForm: true })
    }
  }

  closeRegisterActionPrompt = () => {
    this.setState({
      displayRegisterActionForm: false,
      holdingObjId: '',
      holdingObjType: '',
      holdingPic: '',
      selectedAnimalRace: '',
      selectedGender: ''
    })
  }

  handleAnimalClassSelection = e => this.setState({ selectedAnimalRace: e.target.value })

  handleGenderSelection = e => this.setState({ selectedGender: e.target.value })

  executeRegisterActionPrompt = () => {
    if (!this.state.holdingObjId && !this.state.selectedAnimalRace) {
      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.select_animal_breed_and_destination_holding`,
            defaultMessage: `${config.labelBasePath}.alert.select_animal_breed_and_destination_holding`
          }), null, () => this.setState({ alert: false })
        )
      })
    } else if (!this.state.holdingObjId) {
      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.select_destination_holding`,
            defaultMessage: `${config.labelBasePath}.alert.select_destination_holding`
          }), null, () => this.setState({ alert: false })
        )
      })
    } else if (!this.state.selectedAnimalRace) {
      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.select_animal_breed`,
            defaultMessage: `${config.labelBasePath}.alert.select_animal_breed`
          }), null, () => this.setState({ alert: false })
        )
      })
    } else {
      let wrapper = document.createElement('div')
      ReactDOM.render(
        <React.Fragment>
          <label htmlFor='activityDate' style={{ marginRight: '8px' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.set_activity_date`,
              defaultMessage: `${config.labelBasePath}.main.set_activity_date`
            })}
          </label>
          <input
            style={{ border: 'none', height: '40px', color: '#000', backgroundColor: '#eff0f1' }}
            type='date'
            name='registerDate'
            onChange={this.setDate}
            value={this.state.registerDate}
          />
        </React.Fragment>,
        wrapper
      )

      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.prompt_text`,
            defaultMessage: `${config.labelBasePath}.actions.prompt_text`
          }) + ' ' + '"' + this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.register_animal`,
            defaultMessage: `${config.labelBasePath}.actions.register_animal`
          }) + '"' + '?',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.default_date_msg`,
            defaultMessage: `${config.labelBasePath}.actions.default_date_msg`
          }), () => this.executeRegisterAction(),
          () => {
            this.setState({ alert: false, registerDate: undefined })
          }, true,
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.execute`,
            defaultMessage: `${config.labelBasePath}.actions.execute`
          }),
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.forms.cancel`,
            defaultMessage: `${config.labelBasePath}.main.forms.cancel`
          }), true, null, true, wrapper
        )
      })
    }
  }

  executeRegisterAction = () => {
    this.setState({ loading: true })
    const objectArray = this.props.selectedGridRows
    const paramsArray = [{
      MASS_PARAM_ACTION: 'REGISTRATION',
      MASS_PARAM_SUBACTION: 'REGISTER',
      MASS_PARAM_ACTION_DATE: this.state.registerDate || convertToShortDate(new Date(), 'y-m-d'),
      MASS_PARAM_ANIMAL_CLASS: this.state.animalClass,
      MASS_PARAM_ANIMAL_RACE: this.state.selectedAnimalRace,
      ...this.state.selectedGender && { MASS_PARAM_GENDER: this.state.selectedGender },
      MASS_PARAM_DESTINATION_OBJ_ID: this.state.holdingObjId,
      MASS_PARAM_DESTINATION_OBJECT_TYPE: this.state.holdingObjType,
      MASS_PARAM_RFID_OBJECT_ID: this.props.parentId
    }]

    const verbPath = config.svConfig.triglavRestVerbs.GENERATE_RFID_RESULT
    const url = `${config.svConfig.restSvcBaseUrl}${verbPath}/${this.props.session}`
    axios({
      method: 'post',
      url,
      data: JSON.stringify({ objectArray, paramsArray })
    }).then(res => {
      this.setState({ loading: false, registerDate: undefined })
      const responseType = formatAlertType(res.data)
      this.setState({
        alert: alertUser(
          true, responseType,
          this.context.intl.formatMessage({
            id: res.data,
            defaultMessage: res.data
          }), '', () => this.closeRegisterActionPrompt()
        )
      })
      this.reloadGrid()
    }).catch(err => {
      this.setState({ loading: false, registerDate: undefined })
      this.setState({
        alert: alertUser(
          true, 'error',
          this.context.intl.formatMessage({
            id: err,
            defaultMessage: err
          }), null
        )
      })
    })
  }

  reloadGrid = () => {
    const gridId = `${this.props.selectedObject}_${this.props.parentId}`
    GridManager.reloadGridData(gridId)
    ComponentManager.setStateForComponent(gridId, 'selectedIndexes', [])
    store.dispatch({ type: 'UPDATE_SELECTED_GRID_ROWS', payload: [[], gridId] })
  }

  emptySelectionAlert = () => {
    this.setState({
      alert: alertUser(true, 'warning',
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.alert.empty_selection`,
          defaultMessage: `${config.labelBasePath}.alert.empty_selection`
        }), null, () => this.setState({ alert: false })
      )
    })
  }

  render () {
    const { retireSublistActions, validVaccEvents } = this.state

    const holdingSearchPopup = <div id='search_modal_1' className='modal' style={{ display: 'flex' }}>
      <div id='search_modal_content_1' className='modal-content'>
        <div className='modal-header' />
        <div id='search_modal_body_1' className='modal-body'>
          <GridInModalLinkObjects
            loadFromParent
            linkedTable={this.state.gridToDisplay}
            onRowSelect={this.chooseDestinationHolding}
            key={this.state.gridToDisplay}
            closeModal={this.closeHoldingSearchPopup}
            isFromRfidModule
          />
        </div>
      </div>
    </div>

    const exportCertSearchPopup = <div id='search_modal_2' className='modal' style={{ display: 'flex' }}>
      <div id='search_modal_content_2' className='modal-content'>
        <div className='modal-header' />
        <div id='search_modal_body_2' className='modal-body'>
          <GridInModalLinkObjects
            loadFromParent
            linkedTable={this.state.altGridToDisplay}
            onRowSelect={this.chooseExportCert}
            key={this.state.altGridToDisplay}
            closeModal={this.closeExportCertSearchPopup}
            isFromRfidModule
          />
        </div>
      </div>
    </div>

    const transferForm = <div id='search_modal' className='modal' style={{ display: 'flex' }}>
      <div
        id='search_modal_content'
        className='modal-content'
        style={{ width: '35%', height: '40%', marginLeft: '35%', marginTop: '10rem' }}
      >
        <div className='modal-header' />
        <div
          id='search_modal_body'
          className='modal-body'
          style={{ color: 'white', paddingLeft: '5rem', paddingRight: '5rem', paddingTop: '5rem' }}
        >
          <div id='transferActionForm'>
            <h3
              id='areaHeading'
              style={{ textAlign: 'center', color: '#EAF4F4', marginBottom: '1rem' }}
            >
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.select_destination_transfer`,
                defaultMessage: `${config.labelBasePath}.main.select_destination_transfer`
              })}
            </h3>
            <div style={{ display: 'inline-flex', marginLeft: '15rem', marginTop: '2rem' }}>
              <div className='form-group' style={{ display: 'inline-grid' }}>
                <label htmlFor='destinationHoldingTransfer' style={{ textAlign: 'center' }}>
                  {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.grid_labels.flock_movement.destination_holding_id`,
                    defaultMessage: `${config.labelBasePath}.grid_labels.flock_movement.destination_holding_id`
                  })}
                </label>
                <input
                  id='destinationHoldingTransfer'
                  type='text'
                  name='destinationHoldingTransfer'
                  onClick={this.displayHoldingSearchPopup}
                  className='form-control'
                  style={{ width: '15rem' }}
                />
              </div>
            </div>
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button
                id='transferAnimal'
                className='btn btn-success'
                style={{ marginRight: '1.3rem' }}
                onClick={this.executeTransferActionPrompt}
              >
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.transfer_animals`,
                  defaultMessage: `${config.labelBasePath}.main.transfer_animals`
                })}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div id='modal_close_btn' type='button' className='js-components-AppComponents-Functional-GridInModalLinkObjects-module-close'
        style={{
          position: 'absolute',
          right: 'calc(29.5% - 9px)',
          top: '165px',
          width: '32px',
          height: '32px',
          opacity: '1'
        }}
        onClick={() => this.closeTransferActionPrompt()} data-dismiss='search_modal' />
    </div>

    const registerForm = <div id='search_modal_3' className='modal' style={{ display: 'flex' }}>
      <div
        id='search_modal_content_3'
        className='modal-content'
        style={{ width: '47%', height: '40%', marginLeft: '28%', marginTop: '10rem' }}
      >
        <div className='modal-header' />
        <div
          id='search_modal_body_3'
          className='modal-body'
          style={{ color: 'white', paddingLeft: '5rem', paddingRight: '5rem', paddingTop: '5rem' }}
        >
          <div id='registerActionForm'>
            <h3
              id='areaHeading'
              style={{ textAlign: 'center', color: '#EAF4F4', marginBottom: '1rem' }}
            >
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.select_class_and_destination_register`,
                defaultMessage: `${config.labelBasePath}.main.select_class_and_destination_register`
              })}
            </h3>
            <div
              style={{
                display: 'flex',
                marginTop: '2rem',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div className='form-group' style={{ textAlign: 'center', margin: '10px' }}>
                <label htmlFor='animalClass'>
                  {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.main.animal.animal_race`,
                    defaultMessage: `${config.labelBasePath}.main.animal.animal_race`
                  })}
                </label>
                <select
                  id='animalClass'
                  type='text'
                  name='animalClass'
                  onChange={this.handleAnimalClassSelection}
                  className='form-control'
                  style={{ width: '100%' }}
                >
                  <option
                    id='blankPlaceholder'
                    key='blankPlaceholder'
                    value={''}
                    disabled selected hidden
                  >
                    {this.context.intl.formatMessage({
                      id: `${config.labelBasePath}.main.select_animal_breed`,
                      defaultMessage: `${config.labelBasePath}.main.select_animal_breed`
                    })}
                  </option>
                  {this.state.animalRaces && this.state.animalRaces.map(race => {
                    return <option key={race.raceCodeValue} value={race.raceCodeValue}>
                      {race.raceTranslation}
                    </option>
                  })}
                </select>
              </div>
              <div className='form-group' style={{ textAlign: 'center', margin: '10px', width: '25%' }}>
                <label htmlFor='animalGender'>
                  {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.main.animal.gender`,
                    defaultMessage: `${config.labelBasePath}.main.animal.gender`
                  })}
                </label>
                <select
                  id='animalGender'
                  type='text'
                  name='animalGender'
                  onChange={this.handleGenderSelection}
                  className='form-control'
                >
                  <option
                    id='blankPlaceholder'
                    key='blankPlaceholder'
                    value={''}
                    disabled selected hidden
                  >
                    {this.context.intl.formatMessage({
                      id: `${config.labelBasePath}.main.select_animal_gender`,
                      defaultMessage: `${config.labelBasePath}.main.select_animal_gender`
                    })}
                  </option>
                  <option key='1' value='1'>
                    {this.context.intl.formatMessage({
                      id: `${config.labelBasePath}.main.female`,
                      defaultMessage: `${config.labelBasePath}.main.female`
                    })}
                  </option>
                  <option key='2' value='2'>
                    {this.context.intl.formatMessage({
                      id: `${config.labelBasePath}.main.male`,
                      defaultMessage: `${config.labelBasePath}.main.male`
                    })}
                  </option>
                </select>
              </div>
              <div className='form-group' style={{ textAlign: 'center', margin: '10px' }}>
                <label htmlFor='destinationHoldingRegister'>
                  {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.grid_labels.flock_movement.destination_holding_id`,
                    defaultMessage: `${config.labelBasePath}.grid_labels.flock_movement.destination_holding_id`
                  })}
                </label>
                <input
                  id='destinationHoldingRegister'
                  type='text'
                  name='destinationHoldingRegister'
                  onClick={this.displayHoldingSearchPopup}
                  className='form-control'
                  style={{ width: '100%' }}
                />
              </div>
            </div>
            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
              <button
                id='registerAnimal'
                className='btn btn-success'
                style={{ marginRight: '1.3rem' }}
                onClick={this.executeRegisterActionPrompt}
              >
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.register_animals`,
                  defaultMessage: `${config.labelBasePath}.main.register_animals`
                })}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div id='modal_close_btn' type='button' className='js-components-AppComponents-Functional-GridInModalLinkObjects-module-close'
        style={{
          position: 'absolute',
          right: 'calc(24.5% - 9px)',
          top: '165px',
          width: '32px',
          height: '32px',
          opacity: '1'
        }}
        onClick={() => this.closeRegisterActionPrompt()} data-dismiss='search_modal' />
    </div>

    const exportForm = <div id='search_modal' className='modal' style={{ display: 'flex' }}>
      <div
        id='search_modal_content'
        className='modal-content'
        style={{ width: '35%', height: '40%', marginLeft: '35%', marginTop: '10rem' }}
      >
        <div className='modal-header' />
        <div
          id='search_modal_body'
          className='modal-body'
          style={{ color: 'white', paddingLeft: '5rem', paddingRight: '5rem', paddingTop: '5rem' }}
        >
          <div id='transferActionForm'>
            <h3
              id='areaHeading'
              style={{ textAlign: 'center', color: '#EAF4F4', marginBottom: '1rem' }}
            >
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.select_destination_export_cert`,
                defaultMessage: `${config.labelBasePath}.main.select_destination_export_cert`
              })}
            </h3>
            <div style={{ display: 'inline-flex', marginLeft: '15rem', marginTop: '2rem' }}>
              <div className='form-group' style={{ display: 'inline-grid' }}>
                <label htmlFor='exportCertificate' style={{ textAlign: 'center' }}>
                  {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.main.export_cert.exp_certificate_id`,
                    defaultMessage: `${config.labelBasePath}.main.export_cert.exp_certificate_id`
                  })}
                </label>
                <input
                  id='exportCertificate'
                  type='text'
                  name='exportCertificate'
                  onClick={this.displayExportCertSearchPopup}
                  className='form-control'
                  style={{ width: '15rem' }}
                />
              </div>
            </div>
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button
                id='exportAnimal'
                className='btn btn-success'
                style={{ marginRight: '1.3rem' }}
                onClick={this.executeExportActionPrompt}
              >
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.move_animals_to_export_cert`,
                  defaultMessage: `${config.labelBasePath}.main.move_animals_to_export_cert`
                })}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div id='modal_close_btn' type='button' className='js-components-AppComponents-Functional-GridInModalLinkObjects-module-close'
        style={{
          position: 'absolute',
          right: 'calc(29.5% - 9px)',
          top: '165px',
          width: '32px',
          height: '32px',
          opacity: '1'
        }}
        onClick={() => this.closeExportActionPrompt()} data-dismiss='search_modal' />
    </div>

    return (
      <React.Fragment>
        {this.state.loading && <Loading />}
        {this.state.displayTransferActionForm &&
          ReactDOM.createPortal(transferForm, document.getElementById('app'))
        }
        {this.state.displayRegisterActionForm &&
          ReactDOM.createPortal(registerForm, document.getElementById('app'))
        }
        {this.state.displayExportActionForm &&
          ReactDOM.createPortal(exportForm, document.getElementById('app'))
        }
        {this.state.displayHoldingSearchPopup &&
          ReactDOM.createPortal(holdingSearchPopup, document.getElementById('app'))
        }
        {this.state.displayExportCertSearchPopup &&
          ReactDOM.createPortal(exportCertSearchPopup, document.getElementById('app'))
        }
        <div id='activateMenu' className={style.menuActivator}>
          <div id='activateImgHolder' className={style.imgTxtHolder}>
            <span id='move_text' style={{ marginTop: '8px' }} className={style.actionText}>
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.rfid.rfid_actions`,
                defaultMessage: `${config.labelBasePath}.rfid.rfid_actions`
              })}
            </span>
            <img id='move_img' className={style.actionImg}
              src='/naits/img/massActionsIcons/actions_general.png' />
          </div>
          <ul id='actionMenu' className={'list-group ' + style.ul_item}>
            <li id='retire_actions' key='retire_actions' className={style.li_item}>
              <div className={style.imgTxtHolder}>
                <span id='retire_text' className={style.actionText}>
                  {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.actions.retire`,
                    defaultMessage: `${config.labelBasePath}.actions.retire`
                  })}
                </span>
                <img
                  id='retire_img' className={style.actionImg}
                  src='/naits/img/massActionsIcons/kill_animal.png'
                />
              </div>
              <ul id='retire_sublist' key='retire_sublist'>
                {retireSublistActions.map((action, index) => {
                  return <li id={`retire_sublist_item_${index}`} key={`retire_sublist_item_${index}`}
                    {... { onClick: () => this.executeRetireActionPrompt(action) }}
                  >
                    {this.context.intl.formatMessage({
                      id: `${config.labelBasePath}.actions.${action}`,
                      defaultMessage: `${config.labelBasePath}.actions.${action}`
                    })}
                  </li>
                })}
              </ul>
            </li>
            <li id='activity_actions' key='activity_actions' className={style.li_item}>
              <div className={style.imgTxtHolder}>
                <span id='activity_text' className={style.actionText}>
                  {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.actions.activity`,
                    defaultMessage: `${config.labelBasePath}.actions.activity`
                  })}
                </span>
                <img
                  id='activity_img' className={style.actionImg}
                  src='/naits/img/massActionsIcons/vaccinate_animal.png'
                />
              </div>
              <ul id='activity_sublist' key='activity_sublist'>
                <li
                  id='activity_sublist_item_physical_check'
                  key='activity_sublist_item_physical_check'
                  onClick={() => this.executePhysicalCheckActionPrompt()}
                >
                  {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.actions.physicalCheck`,
                    defaultMessage: `${config.labelBasePath}.actions.physicalCheck`
                  })}
                </li>
                {validVaccEvents && validVaccEvents.map((event, index) => {
                  return <li id={`campaign_item_${index}`} key={`campaign_item_${index}`}
                    {... { onClick: () => this.executeCampaignActionPrompt(event.campaignNote, event.campaignObjId) }}
                  >
                    {event.campaignNote}
                  </li>
                })}
              </ul>
            </li>
            <li id='transfer_actions' key='transfer_actions' className={style.li_item}>
              <div className={style.imgTxtHolder}>
                <span id='transfer_text' className={style.actionText}>
                  {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.actions.transfer`,
                    defaultMessage: `${config.labelBasePath}.actions.transfer`
                  })}
                </span>
                <img
                  id='transfer_img' className={style.actionImg}
                  src='/naits/img/massActionsIcons/transfer_animal.png'
                />
              </div>
              <ul id='transfer_sublist' key='transfer_sublist'>
                <li
                  id='transfer_sublist_item'
                  key='transfer_sublist_item'
                  onClick={() => this.displayTransferActionPrompt()}
                >
                  {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.actions.direct_transfer_animal`,
                    defaultMessage: `${config.labelBasePath}.actions.direct_transfer_animal`
                  })}
                </li>
              </ul>
            </li>
            <li id='export_actions' key='export_actions' className={style.li_item}>
              <div className={style.imgTxtHolder}>
                <span id='export_text' className={style.actionText}>
                  {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.actions.export`,
                    defaultMessage: `${config.labelBasePath}.actions.export`
                  })}
                </span>
                <img
                  id='export_img' className={style.actionImg}
                  src='/naits/img/massActionsIcons/process.png'
                />
              </div>
              <ul id='export_sublist' key='export_sublist'>
                <li
                  id='export_sublist_item_1'
                  key='export_sublist_item_1'
                  onClick={() => this.displayExportActionPrompt()}
                >
                  {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.actions.pending_export`,
                    defaultMessage: `${config.labelBasePath}.actions.pending_export`
                  })}
                </li>
                <li
                  id='export_sublist_item_2'
                  key='export_sublist_item_2'
                  onClick={() => this.executeExportCertAnimalsPrompt()}
                >
                  {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.actions.export_certified_animals`,
                    defaultMessage: `${config.labelBasePath}.actions.export_certified_animals`
                  })}
                </li>
              </ul>
            </li>
            <li id='register_actions' key='register_actions' className={style.li_item}>
              <div className={style.imgTxtHolder}>
                <span id='register_text' className={style.actionText}>
                  {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.actions.register`,
                    defaultMessage: `${config.labelBasePath}.actions.register`
                  })}
                </span>
                <img
                  id='export_img' className={style.actionImg}
                  src='/naits/img/massActionsIcons/checklist.png'
                />
              </div>
              <ul id='register_sublist' key='register_sublist'>
                <li
                  id='register_sublist_item'
                  key='register_sublist_item'
                  onClick={() => this.displayRegisterActionPrompt()}
                >
                  {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.actions.register_animal`,
                    defaultMessage: `${config.labelBasePath}.actions.register_animal`
                  })}
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </React.Fragment>
    )
  }
}

RFIDActions.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession,
  gridHierarchy: state.gridConfig.gridHierarchy,
  selectedGridRows: state.selectedGridRows.selectedGridRows
})

export default connect(mapStateToProps)(RFIDActions)
