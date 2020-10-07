import React from 'react'
import PropTypes from 'prop-types'
import style from './History.module.css'
import NotificationBadge, { Effect } from 'react-notification-badge'
import { connect } from 'react-redux'
import { menuConfig } from 'config/menuConfig'
import * as config from 'config/config'
import createHashHistory from 'history/createHashHistory'
import { historyAction } from 'backend/historyAction'
import { store } from 'tibro-redux'
import { selectObject, gaEventTracker } from 'functions/utils'
import { getAdditionalHoldingData, getObjectSummary } from 'backend/additionalDataActions'
import { withRouter } from 'react-router'

const hashHistory = createHashHistory()

class History extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      history: undefined,
      historyItems: undefined,
      historyCount: undefined,
      heightPercent: 100
    }
  }

  componentDidMount () {
    this.calcHeight(this.props)
    this.createHistoryItems(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.calcHeight(nextProps)
    this.createHistoryItems(nextProps)
  }

  createHistoryItems (props) {
    const historyItems = props.history && props.history.map((element, index) => {
      // Check if the holding name or address fields don't exist, and if so, set their value to N/A
      if (!element['HOLDING.NAME']) {
        element['HOLDING.NAME'] = 'N/A'
      }
      if (!element['HOLDING.PHYSICAL_ADDRESS']) {
        element['HOLDING.PHYSICAL_ADDRESS'] = 'N/A'
      }

      props.gridHierarchy.map(grid => {
        // Check if the holding name has been changed from the form inside a holding record
        if (grid.row['HOLDING.NAME'] && grid.row['HOLDING.NAME'] !== element['HOLDING.NAME']) {
          if (element['HOLDING.PIC'] === grid.row['HOLDING.PIC']) {
            element['HOLDING.NAME'] = grid.row['HOLDING.NAME']
          }
        }

        // Check if the holding address has been changed from the form inside a holding record
        if (grid.row['HOLDING.PHYSICAL_ADDRESS'] &&
          grid.row['HOLDING.PHYSICAL_ADDRESS'] !== element['HOLDING.PHYSICAL_ADDRESS']
        ) {
          if (element['HOLDING.PIC'] === grid.row['HOLDING.PIC']) {
            element['HOLDING.PHYSICAL_ADDRESS'] = grid.row['HOLDING.PHYSICAL_ADDRESS']
          }
        }

        // Check if the holding type has been changed from the form inside a holding record
        if (grid.row['HOLDING.TYPE'] &&
          grid.row['HOLDING.TYPE'] !== element['HOLDING.TYPE']
        ) {
          if (element['HOLDING.PIC'] === grid.row['HOLDING.PIC']) {
            element['HOLDING.TYPE'] = grid.row['HOLDING.TYPE']
          }
        }

        // Check if the holding status has changed
        if (grid.gridType === 'HOLDING' && grid.row['HOLDING.STATUS'] !== element['HOLDING.STATUS']) {
          if (element['HOLDING.PIC'] === grid.row['HOLDING.PIC']) {
            element['HOLDING.STATUS'] = grid.row['HOLDING.STATUS']
          }
        }

        // Check if the quarantine start date has been changed
        if (grid.gridType === 'QUARANTINE' &&
          grid.row['QUARANTINE.OBJECT_ID'] === element['QUARANTINE.OBJECT_ID'] &&
          grid.row['QUARANTINE.DATE_FROM'] !== element['QUARANTINE.DATE_FROM']) {
          element['QUARANTINE.DATE_FROM'] = grid.row['QUARANTINE.DATE_FROM']
        }

        // Check if the quarantine end date has been changed
        if (grid.gridType === 'QUARANTINE' &&
          grid.row['QUARANTINE.OBJECT_ID'] === element['QUARANTINE.OBJECT_ID'] &&
          grid.row['QUARANTINE.DATE_TO'] !== element['QUARANTINE.DATE_TO']) {
          element['QUARANTINE.DATE_TO'] = grid.row['QUARANTINE.DATE_TO']
        }

        // Check if the animal id, class, breed, gender or color has been changed
        if (grid.gridType === 'ANIMAL' &&
          grid.row['ANIMAL.OBJECT_ID'] === element['ANIMAL.OBJECT_ID'] &&
          grid.row['ANIMAL.ANIMAL_ID'] !== element['ANIMAL.ANIMAL_ID']) {
          element['ANIMAL.ANIMAL_ID'] = grid.row['ANIMAL.ANIMAL_ID']
        }

        if (grid.gridType === 'ANIMAL' &&
          grid.row['ANIMAL.OBJECT_ID'] === element['ANIMAL.OBJECT_ID'] &&
          grid.row['ANIMAL.ANIMAL_CLASS'] !== element['ANIMAL.ANIMAL_CLASS']) {
          element['ANIMAL.ANIMAL_CLASS'] = grid.row['ANIMAL.ANIMAL_CLASS']
        }

        if (grid.gridType === 'ANIMAL' &&
          grid.row['ANIMAL.OBJECT_ID'] === element['ANIMAL.OBJECT_ID'] &&
          grid.row['ANIMAL.ANIMAL_RACE'] !== element['ANIMAL.ANIMAL_RACE']) {
          element['ANIMAL.ANIMAL_RACE'] = grid.row['ANIMAL.ANIMAL_RACE']
        }

        if (grid.gridType === 'ANIMAL' &&
          grid.row['ANIMAL.OBJECT_ID'] === element['ANIMAL.OBJECT_ID'] &&
          grid.row['ANIMAL.GENDER'] !== element['ANIMAL.GENDER']) {
          element['ANIMAL.GENDER'] = grid.row['ANIMAL.GENDER']
        }

        if (grid.gridType === 'ANIMAL' &&
          grid.row['ANIMAL.OBJECT_ID'] === element['ANIMAL.OBJECT_ID'] &&
          grid.row['ANIMAL.COLOR'] !== element['ANIMAL.COLOR']) {
          element['ANIMAL.COLOR'] = grid.row['ANIMAL.COLOR']
        }
      })

      let linkBy
      let linkValue
      let showItemsFromConfig = menuConfig('HISTORY_FOR_MAIN_MENU_TOP') && menuConfig('HISTORY_FOR_MAIN_MENU_TOP').map(
        configElement => {
          if (element.TABLE === configElement.TABLE) {
            linkBy = configElement.LINK_BY
            linkValue = element[`${element.TABLE}.${configElement.LINK_BY}`]
            return configElement.SHOW_ITEMS.map(
              itemsElement => {
                return element[`${element.TABLE}.${itemsElement}`] + ' '
              }
            )
          }
        }
      )
      return (<div
        style={{ height: `calc(${this.state.heightPercent}% / ${this.state.historyCount})` }}
        onClick={(e) => {
          e.preventDefault()
          if ((element.TABLE === 'HOLDING') && (this.props.location.pathname === `/main/data/${element.TABLE.toLowerCase()}`)) {
            this.dispatchNewHoldingState(element)
          } else if ((element.TABLE === 'QUARANTINE') && (this.props.location.pathname === `/main/data/${element.TABLE.toLowerCase()}`)) {
            this.dispatchNewQuarantineState(element)
          } else if ((element.TABLE === 'ANIMAL') && (this.props.location.pathname === `/main/data/${element.TABLE.toLowerCase()}`)) {
            this.dispatchNewAnimalState(element)
          } else {
            hashHistory.push(
              `/main/dynamic/${element.TABLE.toLowerCase()}?c=${linkBy}&v=${linkValue}`
            )
          }
        }}
        className={style.scrollLeft}
        key={`history${index}`}
      >
        <p>
          {
            this.context.intl.formatMessage(
              {
                id: [`${config.labelBasePath}.main.${element.TABLE.toLowerCase()}`],
                defaultMessage: [`${config.labelBasePath}.main.${element.TABLE.toLowerCase()}`]
              }
            )
          }: {showItemsFromConfig}
        </p>
      </div>)
    })
    this.setState({ historyItems })
  }

  calcHeight = (props) => {
    // callculate heigh percent
    let heightPercent
    if (props.historyCount < 4) {
      heightPercent = 50
    } else {
      heightPercent = 100
    }
    this.setState({ heightPercent })
  }

  clearHistory = () => {
    this.props.historyAction()
    this.props.hoverCallback()
  }

  dropdown = (state) => (<div>
    {
      this.props.toggleHistory &&
      <div
        onClick={this.props.hoverCallback}
        style={{
          position: 'fixed',
          backgroundColor: 'rgba(36, 19, 8, 0.9)',
          boxShadow: '1px 1px 20px rgba(0,0,0,0.5)',
          borderRadius: '5px',
          height: '49%',
          ...this.props.historyCount > 0 ? {} : { width: '25%' }, // if width is not set on empty div, it will not show
          top: '55px',
          overflow: 'auto'
        }}
      >
        {state.historyItems}

        <div
          onClick={this.clearHistory}
          style={{
            position: 'absolute',
            height: '6%',
            top: 'calc( 55px + 82% )'
          }}
        >
          <button
            type='button'
            id='delete_form_btn'
            className='btn-danger btn_delete_form'
            style={{ position: 'fixed' }}
            onClick={
              gaEventTracker(
                'CLEAR',
                'Clicked the clear button on the recent dropdown',
                `MAIN_MENU | ${config.version} (${config.currentEnv})`
              )
            }
          >
            Clear
          </button>
        </div>
      </div>
    }
  </div>)

  historyBadge = () => (<NotificationBadge
    containerStyle={{ position: 'relative', width: 'auto', height: 'auto' }}
    count={this.props.historyCount}
    effect={Effect.SCALE}
    style={{
      top: '24px', left: '15px', bottom: '', right: '', backgroundColor: 'rgb(204, 136, 12)'
    }}
  />)

  dispatchNewHoldingState = (responseObject) => {
    document.getElementById('link_nav_HOLDING') && document.getElementById('link_nav_HOLDING').click()
    store.dispatch(
      {
        id: 'HOLDING',
        type: 'HOLDING/ROW_CLICKED',
        payload: responseObject
      }
    )
    store.dispatch(
      {
        type: 'REPLACE_ALL_SELECTED_ITEMS',
        payload: [
          {
            gridId: 'HOLDING',
            gridType: 'HOLDING',
            row: responseObject,
            active: true
          }
        ]
      }
    )
    store.dispatch(
      {
        type: 'ADD_LAST_SELECTED_ITEM',
        payload: [
          'HOLDING',
          responseObject
        ]
      }
    )
    selectObject('HOLDING')
    store.dispatch(getAdditionalHoldingData(this.props.svSession, responseObject.OBJECTID))
    store.dispatch(getObjectSummary(this.props.svSession, 'HOLDING', responseObject.OBJECTID))
    document.getElementById('clearReturnedComponentSideMenu') && document.getElementById('clearReturnedComponentSideMenu').click()
  }

  dispatchNewQuarantineState = (responseObject) => {
    document.getElementById('link_nav_QUARANTINE') && document.getElementById('link_nav_QUARANTINE').click()
    store.dispatch(
      {
        id: 'QUARANTINE',
        type: 'QUARANTINE/ROW_CLICKED',
        payload: responseObject
      }
    )
    store.dispatch(
      {
        type: 'REPLACE_ALL_SELECTED_ITEMS',
        payload: [
          {
            gridId: 'QUARANTINE',
            gridType: 'QUARANTINE',
            row: responseObject,
            active: true
          }
        ]
      }
    )
    store.dispatch(
      {
        type: 'ADD_LAST_SELECTED_ITEM',
        payload: [
          'QUARANTINE',
          responseObject
        ]
      }
    )
    selectObject('QUARANTINE')
    store.dispatch(getObjectSummary(this.props.svSession, 'QUARANTINE', responseObject.OBJECTID))
    document.getElementById('clearReturnedComponentSideMenu') && document.getElementById('clearReturnedComponentSideMenu').click()
  }

  dispatchNewAnimalState = (responseObject) => {
    document.getElementById('link_nav_ANIMAL') && document.getElementById('link_nav_ANIMAL').click()
    store.dispatch(
      {
        id: 'ANIMAL',
        type: 'ANIMAL/ROW_CLICKED',
        payload: responseObject
      }
    )
    store.dispatch(
      {
        type: 'REPLACE_ALL_SELECTED_ITEMS',
        payload: [
          {
            gridId: 'ANIMAL',
            gridType: 'ANIMAL',
            row: responseObject,
            active: true
          }
        ]
      }
    )
    store.dispatch(
      {
        type: 'ADD_LAST_SELECTED_ITEM',
        payload: [
          'ANIMAL',
          responseObject
        ]
      }
    )
    selectObject('ANIMAL')
    store.dispatch(getObjectSummary(this.props.svSession, 'ANIMAL', responseObject.OBJECTID))
    document.getElementById('clearReturnedComponentSideMenu') && document.getElementById('clearReturnedComponentSideMenu').click()
  }

  render () {
    return (
      <div>
        {this.historyBadge()}
        {this.dropdown(this.state)}
      </div>
    )
  }
}

History.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  historyCount: state.historyReducer.count,
  history: state.historyReducer.history,
  svSession: state.security.svSession,
  gridHierarchy: state.gridConfig.gridHierarchy
})

const mapDispatchToProps = dispatch => ({
  historyAction: () => {
    dispatch(historyAction())
  }
})

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(History))
