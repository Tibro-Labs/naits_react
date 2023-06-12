import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import { store } from 'tibro-redux'
import createHashHistory from 'history/createHashHistory'
import { isValidArray } from 'functions/utils'
import sideMenuStyle from 'modulesCSS/SideMenu.module.css'
import consoleStyle from 'components/AppComponents/Functional/AdminConsole/AdminConsole.module.css'
import * as config from 'config/config.js'

class GroupedSearch extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      allowedObjects: undefined
    }
    this.hashHistory = createHashHistory()
  }

  componentDidMount () {
    const { userInfo } = this.props
    store.dispatch({ type: 'RESET_GROUPED_SEARCH' })

    if (userInfo.allowedObjectsForSideMenu && userInfo.allowedObjectsForSideMenu.LIST_OF_ITEMS && isValidArray(userInfo.allowedObjectsForSideMenu.LIST_OF_ITEMS, 1)) {
      let allowedObjects = []
      userInfo.allowedObjectsForSideMenu.LIST_OF_ITEMS.forEach(item => {
        allowedObjects.push(item.ID)
      })
      this.setState({ allowedObjects })
    } else {
      this.getCustomObjectsPerUser()
    }
  }

  getCustomObjectsPerUser = () => {
    const server = config.svConfig.restSvcBaseUrl
    const verbPath = config.svConfig.triglavRestVerbs.MAIN_ALLOWED_CUSTOM_OBJECTS_PER_USER
    let url = `${server}${verbPath}`
    url = url.replace('%session', this.props.session)
    axios.get(url).then(res => {
      let allowedObjects = []
      JSON.parse(
        JSON.stringify(res.data),
        (key, value) => {
          if (typeof (value) !== 'object') {
            if (key === 'TABLE_NAME') {
              allowedObjects.push(value)
            }
          }
        }
      )
      this.setState({ allowedObjects })
    }).catch(err => console.error(err))
  }

  render () {
    const { allowedObjects } = this.state

    return (
      <div>
        <div className={sideMenuStyle.sideDiv}>
          {allowedObjects && allowedObjects.includes('INVENTORY_ITEM') && <React.Fragment>
            <div id='inventory_item'>
              <label>
                {this.context.intl.formatMessage(
                  {
                    id: `${config.labelBasePath}.main.inventory_item`,
                    defaultMessage: `${config.labelBasePath}.main.inventory_item`
                  }
                )}
              </label>
              <br />
              <button
                className={consoleStyle.conButton}
                onClick={() => {
                  this.hashHistory.push(`/main/dynamic/inventory_item`)
                  store.dispatch({ type: 'INVENTORY_ITEM_GROUPED_SEARCH' })
                }}
              >
                {this.context.intl.formatMessage(
                  {
                    id: `${config.labelBasePath}.main.search_by_ear_tag_id`,
                    defaultMessage: `${config.labelBasePath}.main.search_by_ear_tag_id`
                  }
                )}
              </button>
            </div>
            <br />
          </React.Fragment>}
          {allowedObjects && allowedObjects.includes('MOVEMENT_DOC') && <React.Fragment>
            <div id='movement_document'>
              <label>
                {this.context.intl.formatMessage(
                  {
                    id: `${config.labelBasePath}.main.movement_doc`,
                    defaultMessage: `${config.labelBasePath}.main.movement_doc`
                  }
                )}
              </label>
              <br />
              <button
                className={consoleStyle.conButton}
                onClick={() => {
                  this.hashHistory.push(`/main/dynamic/movement_doc`)
                  store.dispatch({ type: 'MOVEMENT_DOC_GROUPED_SEARCH' })
                }}
              >
                {this.context.intl.formatMessage(
                  {
                    id: `${config.labelBasePath}.main.search_movement_docs`,
                    defaultMessage: `${config.labelBasePath}.main.search_movement_docs`
                  }
                )}
              </button>
            </div>
            <br />
          </React.Fragment>}
          {allowedObjects && allowedObjects.includes('EXPORT_CERT') && <div id='export_cert'>
            <label>
              {this.context.intl.formatMessage(
                {
                  id: `${config.labelBasePath}.main.export_cert`,
                  defaultMessage: `${config.labelBasePath}.main.export_cert`
                }
              )}
            </label>
            <br />
            <button className={consoleStyle.conButton} onClick={() => this.hashHistory.push(`/main/export_certificate`)}>
              {this.context.intl.formatMessage(
                {
                  id: `${config.labelBasePath}.main.search_export_certificates`,
                  defaultMessage: `${config.labelBasePath}.main.search_export_certificates`
                }
              )}
            </button>
          </div>}
          <br />
          <div id='flock'>
            <label>
              {this.context.intl.formatMessage(
                {
                  id: `${config.labelBasePath}.main.flock`,
                  defaultMessage: `${config.labelBasePath}.main.flock`
                }
              )}
            </label>
            <br />
            <button className={consoleStyle.conButton} onClick={() => this.hashHistory.push(`/main/dynamic/flock`)}>
              {this.context.intl.formatMessage(
                {
                  id: `${config.labelBasePath}.main.search_flocks`,
                  defaultMessage: `${config.labelBasePath}.main.search_flocks`
                }
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }
}

GroupedSearch.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession,
  userInfo: state.userInfoReducer
})

export default connect(mapStateToProps)(GroupedSearch)
