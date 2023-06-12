import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import axios from 'axios'
import * as config from 'config/config'
import { Loading } from 'components/ComponentsIndex'
import { userAttachmentPostMethod } from './admConsoleActions'
import { alertUser, DependencyDropdowns } from 'tibro-components'
import { strcmp, gaEventTracker } from 'functions/utils'
import consoleStyle from './AdminConsole.module.css'

class UserOrgUnits extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: null,
      loading: false
    }
  }

  applyUserOrgUnit = (webService, actionName) => {
    if (this.props.selectedRows.length > 1) {
      this.setState({
        alert: alertUser(true, 'error',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.only_one_user_can_be_selected`,
            defaultMessage: `${config.labelBasePath}.alert.only_one_user_can_be_selected`
          }),
          null,
          () => this.setState({ alert: alertUser(false, 'info', '') }))
      })
    } else {
      let orgUnitAction = actionName.toLowerCase()
      const prompt = (component, onConfirmCallback) => {
        component.setState({
          alert: alertUser(
            true,
            'warning',
            component.context.intl.formatMessage({
              id: `${config.labelBasePath}.actions.execute_action_${orgUnitAction}`,
              defaultMessage: `${config.labelBasePath}.actions.execute_action_${orgUnitAction}`
            }),
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
      let location = null
      let regionElement = null
      let municipalityElement = null
      let communityElement = null
      let villageElement = null
      let region = null
      let municipality = null
      let community = null
      let village = null

      try {
        regionElement = document.getElementById('root_holding.location.info_REGION_CODE')
        region = regionElement.options[regionElement.selectedIndex].value
        municipalityElement = document.getElementById('root_holding.location.info_MUNIC_CODE')
        municipality = municipalityElement.options[municipalityElement.selectedIndex].value
        communityElement = document.getElementById('root_holding.location.info_COMMUN_CODE')
        community = communityElement.options[communityElement.selectedIndex].value
        villageElement = document.getElementById('root_holding.location.info_VILLAGE_CODE')
        village = villageElement.options[villageElement.selectedIndex].value
      } catch (error) {
        console.warn('Field still not generated.')
      } finally {
        location = village || community || municipality || region
      }

      const { svSession, selectedRows } = this.props
      if (location && selectedRows.length > 0) {
        const server = config.svConfig.restSvcBaseUrl +
          config.svConfig.triglavRestVerbs[webService]
        const params = `/${svSession}/${location}`
        const objectArray = selectedRows
        const restUrl = server + params
        prompt(this, () => this.props.userAttachmentPostMethod(restUrl, actionName, objectArray))
      }

      if (!location) {
        this.setState({
          alert: alertUser(true, 'warning',
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.alert.parameters_missing`,
              defaultMessage: `${config.labelBasePath}.alert.parameters_missing`
            }),
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.alert.no_region_selected_admconsole`,
              defaultMessage: `${config.labelBasePath}.alert.no_region_selected_admconsole`
            }),
            () => this.setState({ alert: alertUser(false, 'info', '') }))
        })
      }
    }
  }

  headquarterPrompt = (verbPath, actionName) => {
    if (this.props.selectedRows.length > 1) {
      this.setState({
        alert: alertUser(true, 'error',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.only_one_user_can_be_selected`,
            defaultMessage: `${config.labelBasePath}.alert.only_one_user_can_be_selected`
          }),
          null,
          () => this.setState({ alert: alertUser(false, 'info', '') }))
      })
    } else {
      const currentGrid = this.props.gridToDisplay
      this.setState({
        alert: alertUser(
          true,
          'warning',
          currentGrid === 'SVAROG_USERS'
            ? this.context.intl.formatMessage({
              id: `${config.labelBasePath}.actions.execute_action_user_${actionName}`,
              defaultMessage: `${config.labelBasePath}.actions.execute_action_user_${actionName}`
            }) : currentGrid === 'SVAROG_USER_GROUPS'
              ? this.context.intl.formatMessage({
                id: `${config.labelBasePath}.actions.execute_action_usergroup_${actionName}`,
                defaultMessage: `${config.labelBasePath}.actions.execute_action_usergroup_${actionName}`
              }) : '',
          actionName === 'add_headquarter' ? this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.attachHeadquarterToUser`,
            defaultMessage: `${config.labelBasePath}.alert.attachHeadquarterToUser`
          }) : this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.detachHeadquarterToUser`,
            defaultMessage: `${config.labelBasePath}.alert.detachHeadquarterToUser`
          }),
          () => this.attachOrDetachHeadquarter(verbPath),
          () => this.setState({ alert: alertUser(false, 'info', '') }),
          true,
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.execute`,
            defaultMessage: `${config.labelBasePath}.actions.execute`
          }),
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.forms.cancel`,
            defaultMessage: `${config.labelBasePath}.main.forms.cancel`
          }),
          true,
          null,
          true
        )
      })
    }
  }

  attachOrDetachHeadquarter = (verbPath) => {
    const server = config.svConfig.restSvcBaseUrl + config.svConfig.triglavRestVerbs[verbPath]
    const params = `/${this.props.svSession}/0`
    let url = `${server}${params}`
    const objectArray = this.props.selectedRows

    this.props.userAttachmentPostMethod(url, verbPath, objectArray)
  }

  printResponsibleUserReport = (e, orgUnit) => {
    e.stopPropagation()
    const server = config.svConfig.restSvcBaseUrl
    const verbPath = config.svConfig.triglavRestVerbs.GET_REPORT
    let url = `${server}/${verbPath}`
    url = url.replace('%session', this.props.svSession)
    url = url.replace('%reportName', 'responsible_users_per_org_unit')
    let regionElement = null
    let municipalityElement = null
    let communityElement = null
    let villageElement = null
    let region = null
    let municipality = null
    let community = null
    let village = null
    regionElement = document.getElementById('root_holding.location.info_REGION_CODE')
    region = regionElement.options[regionElement.selectedIndex].value
    municipalityElement = document.getElementById('root_holding.location.info_MUNIC_CODE')
    if (!municipalityElement) {
      municipality = null
    } else {
      municipality = municipalityElement.options[municipalityElement.selectedIndex].value
    }
    communityElement = document.getElementById('root_holding.location.info_COMMUN_CODE')
    if (!communityElement) {
      community = null
    } else {
      community = communityElement.options[communityElement.selectedIndex].value
    }
    villageElement = document.getElementById('root_holding.location.info_VILLAGE_CODE')
    if (!villageElement) {
      village = null
    } else {
      village = villageElement.options[villageElement.selectedIndex].value
    }

    if (strcmp(orgUnit, 'region')) {
      if (!region) {
        this.setState({
          alert: alertUser(true, 'warning', this.context.intl.formatMessage({
            id: `${config.labelBasePath}.report.no_region_selected`,
            defaultMessage: `${config.labelBasePath}.report.no_region_selected`
          }))
        })
      } else {
        this.setState({ loading: true })
        const verbPath = config.svConfig.triglavRestVerbs.GET_TABLE_WITH_FILTER_2
        let secondaryUrl = `${server}${verbPath}`
        secondaryUrl = secondaryUrl.replace('%session', this.props.svSession)
        secondaryUrl = secondaryUrl.replace('%table_name', 'SVAROG_ORG_UNITS')
        secondaryUrl = secondaryUrl.replace('%searchBy', 'EXTERNAL_ID')
        secondaryUrl = secondaryUrl.replace('%searchForValue', region)
        secondaryUrl = secondaryUrl.replace('%no_rec', 1000)
        axios.get(secondaryUrl).then(res => {
          if (res.data && res.data[0]) {
            this.setState({ loading: false }, () => {
              url = url.replace('%objectId', res.data[0]['SVAROG_ORG_UNITS.OBJECT_ID'])
              window.open(url, '_blank')
            })
          }
        })
      }
    } else if (strcmp(orgUnit, 'munic')) {
      if (!municipality) {
        this.setState({
          alert: alertUser(true, 'warning', this.context.intl.formatMessage({
            id: `${config.labelBasePath}.report.no_municipality_selected`,
            defaultMessage: `${config.labelBasePath}.report.no_municipality_selected`
          }))
        })
      } else {
        this.setState({ loading: true })
        const verbPath = config.svConfig.triglavRestVerbs.GET_TABLE_WITH_FILTER_2
        let secondaryUrl = `${server}${verbPath}`
        secondaryUrl = secondaryUrl.replace('%session', this.props.svSession)
        secondaryUrl = secondaryUrl.replace('%table_name', 'SVAROG_ORG_UNITS')
        secondaryUrl = secondaryUrl.replace('%searchBy', 'EXTERNAL_ID')
        secondaryUrl = secondaryUrl.replace('%searchForValue', municipality)
        secondaryUrl = secondaryUrl.replace('%no_rec', 1000)
        axios.get(secondaryUrl).then(res => {
          if (res.data && res.data[0]) {
            this.setState({ loading: false }, () => {
              url = url.replace('%objectId', res.data[0]['SVAROG_ORG_UNITS.OBJECT_ID'])
              window.open(url, '_blank')
            })
          }
        })
      }
    } else if (strcmp(orgUnit, 'commun')) {
      if (!community) {
        this.setState({
          alert: alertUser(true, 'warning', this.context.intl.formatMessage({
            id: `${config.labelBasePath}.report.no_community_selected`,
            defaultMessage: `${config.labelBasePath}.report.no_community_selected`
          }))
        })
      } else {
        this.setState({ loading: true })
        const verbPath = config.svConfig.triglavRestVerbs.GET_TABLE_WITH_FILTER_2
        let secondaryUrl = `${server}${verbPath}`
        secondaryUrl = secondaryUrl.replace('%session', this.props.svSession)
        secondaryUrl = secondaryUrl.replace('%table_name', 'SVAROG_ORG_UNITS')
        secondaryUrl = secondaryUrl.replace('%searchBy', 'EXTERNAL_ID')
        secondaryUrl = secondaryUrl.replace('%searchForValue', community)
        secondaryUrl = secondaryUrl.replace('%no_rec', 1000)
        axios.get(secondaryUrl).then(res => {
          if (res.data && res.data[0]) {
            this.setState({ loading: false }, () => {
              url = url.replace('%objectId', res.data[0]['SVAROG_ORG_UNITS.OBJECT_ID'])
              window.open(url, '_blank')
            })
          }
        })
      }
    } else if (strcmp(orgUnit, 'village')) {
      if (!village) {
        this.setState({
          alert: alertUser(true, 'warning', this.context.intl.formatMessage({
            id: `${config.labelBasePath}.report.no_village_selected`,
            defaultMessage: `${config.labelBasePath}.report.no_village_selected`
          }))
        })
      } else {
        this.setState({ loading: true })
        const verbPath = config.svConfig.triglavRestVerbs.GET_TABLE_WITH_FILTER_2
        let secondaryUrl = `${server}${verbPath}`
        secondaryUrl = secondaryUrl.replace('%session', this.props.svSession)
        secondaryUrl = secondaryUrl.replace('%table_name', 'SVAROG_ORG_UNITS')
        secondaryUrl = secondaryUrl.replace('%searchBy', 'EXTERNAL_ID')
        secondaryUrl = secondaryUrl.replace('%searchForValue', village)
        secondaryUrl = secondaryUrl.replace('%no_rec', 1000)
        axios.get(secondaryUrl).then(res => {
          if (res.data && res.data[0]) {
            this.setState({ loading: false }, () => {
              url = url.replace('%objectId', res.data[0]['SVAROG_ORG_UNITS.OBJECT_ID'])
              window.open(url, '_blank')
            })
          }
        })
      }
    }
  }

  render () {
    let disabled = false
    if (this.props.selectedRows.length === 0) {
      disabled = true
    }
    let component = <div
      id='add_or_remove_users'
      style={{ marginTop: '2vh', marginLeft: '10px' }}
      {...disabled
        ? { className: consoleStyle.disabledButton }
        : { className: consoleStyle.conButton }
      }>
      <div id='add_or_remove_users' className={consoleStyle['gauge-conButton']}>
        {this.context.intl.formatMessage({
          id: `${config.labelBasePath}.add_or_remove_users`,
          defaultMessage: `${config.labelBasePath}.add_or_remove_users`
        })}
        <div
          id='create_sublist'
          className={consoleStyle['dropdown-content']}>
          <div
            onClick={() => {
              this.applyUserOrgUnit('ADD_USERS_TO_ORG_UNITS', 'ADD_ORG_UNIT')
              gaEventTracker(
                'ACTION',
                `Clicked the Add 
                ${this.props.gridToDisplay === 'SVAROG_USERS' ? `users` : 'user group'} to org unit button in the admin console
                (${this.props.gridToDisplay})`,
                `ADMIN_CONSOLE | ${config.version}`
              )
            }}
          >
            {
              this.props.gridToDisplay === 'SVAROG_USERS'
                ? this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.add_users_to_org_unit`,
                  defaultMessage: `${config.labelBasePath}.main.add_users_to_org_unit`
                }) : this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.add_usergroup_to_org_unit`,
                  defaultMessage: `${config.labelBasePath}.main.add_usergroup_to_org_unit`
                })
            }
          </div>
          <div
            onClick={() => {
              this.applyUserOrgUnit('REMOVE_ORG_UNIT', 'REMOVE_ORG_UNIT')
              gaEventTracker(
                'ACTION',
                `Clicked the Remove 
                ${this.props.gridToDisplay === 'SVAROG_USERS' ? `users` : 'user group'} from org unit button in the admin console
                (${this.props.gridToDisplay})`,
                `ADMIN_CONSOLE | ${config.version}`
              )
            }}
          >
            {
              this.props.gridToDisplay === 'SVAROG_USERS'
                ? this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.remove_users_from_org_unit`,
                  defaultMessage: `${config.labelBasePath}.main.remove_users_from_org_unit`
                }) : this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.remove_usergroup_from_org_unit`,
                  defaultMessage: `${config.labelBasePath}.main.remove_usergroup_from_org_unit`
                })
            }
          </div>
        </div>
      </div>
    </div>

    let headquarterComponent = <div
      id='add_or_remove_users_headquarter'
      style={{ marginTop: '2vh' }}
      {...disabled
        ? { className: consoleStyle.disabledButton }
        : { className: consoleStyle.conButton }
      }>
      <div id='add_or_remove_users_headquarter' className={consoleStyle['gauge-conButton']}>
        {this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.add_or_remove_headquarter`,
          defaultMessage: `${config.labelBasePath}.main.add_or_remove_headquarter`
        })}
        <div
          id='create_sublist'
          className={consoleStyle['dropdown-content']}>
          <div
            onClick={() => {
              this.headquarterPrompt('ADD_USERS_TO_ORG_UNITS', 'add_headquarter')
              gaEventTracker(
                'ACTION',
                `Clicked the Add 
              ${this.props.gridToDisplay === 'SVAROG_USERS' ? `users` : 'user group'} to headquarter button in the admin console
              (${this.props.gridToDisplay})`,
                `ADMIN_CONSOLE | ${config.version}`
              )
            }}
          >
            {
              this.props.gridToDisplay === 'SVAROG_USERS'
                ? this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.add_users_to_headquarter`,
                  defaultMessage: `${config.labelBasePath}.main.add_users_to_headquarter`
                }) : this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.add_usergroup_to_headquarter`,
                  defaultMessage: `${config.labelBasePath}.main.add_usergroup_to_headquarter`
                })
            }
          </div>
          <div
            onClick={() => {
              this.headquarterPrompt('REMOVE_ORG_UNIT', 'remove_headquarter')
              gaEventTracker(
                'ACTION',
                `Clicked the Remove 
              ${this.props.gridToDisplay === 'SVAROG_USERS' ? `users` : 'user group'} from headquarter button in the admin console
              (${this.props.gridToDisplay})`,
                `ADMIN_CONSOLE | ${config.version}`
              )
            }}
          >
            {
              this.props.gridToDisplay === 'SVAROG_USERS'
                ? this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.remove_users_from_headquarter`,
                  defaultMessage: `${config.labelBasePath}.main.remove_users_from_headquarter`
                }) : this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.remove_usergroup_from_headquarter`,
                  defaultMessage: `${config.labelBasePath}.main.remove_usergroup_from_headquarter`
                })
            }
          </div>
        </div>
      </div>
    </div>

    let reportComponent = <div id='responsible_user_report_container'
      className={consoleStyle.conButton} style={{ marginTop: '1.5rem' }}
    >
      <div id='responsible_user_report' className={consoleStyle['gauge-conButton']} style={{ marginTop: '23px' }}>
        <div id='create_sublist' className={consoleStyle['dropdown-content']} style={{ marginTop: '0.9rem' }}>
          <div id='region' onClick={(e) => this.printResponsibleUserReport(e, 'region')}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.grid_labels.village.region_code`,
              defaultMessage: `${config.labelBasePath}.grid_labels.village.region_code`
            })}
          </div>
          <div id='munic' onClick={(e) => this.printResponsibleUserReport(e, 'munic')}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.grid_labels.village.munic_code`,
              defaultMessage: `${config.labelBasePath}.grid_labels.village.munic_code`
            })}
          </div>
          <div id='commun' onClick={(e) => this.printResponsibleUserReport(e, 'commun')}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.grid_labels.village.commun_code`,
              defaultMessage: `${config.labelBasePath}.grid_labels.village.commun_code`
            })}
          </div>
          <div id='village' onClick={(e) => this.printResponsibleUserReport(e, 'village')}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.grid_labels.village.village_code`,
              defaultMessage: `${config.labelBasePath}.grid_labels.village.village_code`
            })}
          </div>
        </div>
      </div>
      {this.context.intl.formatMessage({
        id: `${config.labelBasePath}.report.responsible_user_info`,
        defaultMessage: `${config.labelBasePath}.report.responsible_user_info`
      })}
    </div>

    return (
      <div id='orgUnitContainer' className={consoleStyle.componentContainer}>
        {this.state.loading && <Loading />}
        <DependencyDropdowns tableName='HOLDING' />
        {component}
        {strcmp(this.props.gridToDisplay, 'SVAROG_USERS') && reportComponent}
        <div
          style={{ display: this.props.gridToDisplay === 'SVAROG_USERS' ? 'block' : 'none' }}
          className={consoleStyle.verticalLine}
        />
        {this.props.gridToDisplay === 'SVAROG_USERS' && headquarterComponent}
      </div>
    )
  }
}

UserOrgUnits.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapDispatchToProps = dispatch => ({
  userAttachmentPostMethod: (...params) => {
    dispatch(userAttachmentPostMethod(...params))
  }
})

const mapStateToProps = (state) => ({
  admConsoleRequests: state.admConsoleRequests
})

export default connect(mapStateToProps, mapDispatchToProps)(UserOrgUnits)
