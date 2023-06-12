import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ReduxNavigator } from 'tibro-components'
import {
  PreviewData, UndoAnimalRetirement, EarTagReplacementAction,
  DailySlaughterhouseReport, CampaignReport, InventoryModuleReport,
  UserGroupNote, AssignOwnerToStrayPet, SampleForPopulation,
  UpdatePopulationStatus, GeoPopulationFilter, DownloadPopulationSampleFile,
  ApplyStratificationFilter, StratifyPopulation, RFIDFileInfo, SetPetStatusToValid
} from 'components/ComponentsIndex'
import { selectObject, strcmp } from 'functions/utils'

class DisplayComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      holdingType: ''
    }
  }

  static propTypes = {
    menuType: PropTypes.string.isRequired,
    configuration: PropTypes.func.isRequired,
    componentStack: PropTypes.array,
    lastSelectedItem: PropTypes.func.isRequired
  }

  componentDidMount () {
    if (strcmp(this.props.menuType, 'HOLDING')) {
      this.getCurrentHoldingType(this.props)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.shouldRefreshPrintBadgeAndSummaryInfo) {
      this.getCurrentHoldingType(nextProps)
    }

    if (strcmp(nextProps.menuType, 'HOLDING') && this.props.objectId !== nextProps.objectId) {
      this.getCurrentHoldingType(nextProps)
    }
  }

  /* Get the currently selected holding type */
  getCurrentHoldingType = props => {
    props.componentStack.map(grid => {
      if (strcmp(grid.gridType, props.menuType)) {
        this.setState({ holdingType: grid.row[props.menuType + '.TYPE'] || '' })
      }
    })
  }

  render () {
    const { componentStack, configuration, menuType, gridType, getUserGroups } = this.props
    const { holdingType } = this.state

    return (
      <div
        id='displayContent'
        className='displayContent'
      >
        <div id='fixedActionMenu' className='fixed-horizontal-menu-position'>
          <ReduxNavigator
            key='ReduxNavigator'
            componentStack={componentStack}
            lastSelectedItem={selectObject}
            configuration={configuration}
          />
          {this.props.statusBadges &&
            <this.props.statusBadges {...this.props} holdingObjId={this.props.objectId} />
          }
          {(menuType === 'ANIMAL' || menuType === 'FLOCK') && getUserGroups &&
            <UndoAnimalRetirement gridType={menuType} />
          }
          {menuType === 'ANIMAL' &&
            <EarTagReplacementAction gridType={menuType} />
          }
          {menuType === 'HOLDING' && gridType === 'HOLDING' && holdingType && holdingType === '7' &&
            <DailySlaughterhouseReport {...this.props} />
          }
          {menuType === 'SVAROG_ORG_UNITS' &&
            <InventoryModuleReport {...this.props} />
          }
          {menuType === 'VACCINATION_EVENT' &&
            <CampaignReport {...this.props} />
          }
          {menuType === 'SVAROG_USER_GROUPS' &&
            <UserGroupNote {...this.props} />
          }
          {menuType === 'STRAY_PET' &&
            <AssignOwnerToStrayPet {...this.props} />
          }
          {menuType === 'PET' &&
            <SetPetStatusToValid {...this.props} />
          }
          {menuType === 'POPULATION' &&
            <React.Fragment>
              <GeoPopulationFilter {...this.props} />
              <SampleForPopulation {...this.props} />
              <UpdatePopulationStatus {...this.props} />
              <ApplyStratificationFilter {...this.props} />
              <StratifyPopulation {...this.props} />
              <DownloadPopulationSampleFile {...this.props} />
            </React.Fragment>
          }
          {menuType === 'RFID_INPUT' &&
            <RFIDFileInfo {...this.props} />
          }
        </div>
        <div id='returnedComponent' className='main-display-subcomponent'>
          {this.props.componentToDisplay || <PreviewData objectType={menuType} />}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  componentToDisplay: state.componentToDisplay.componentToDisplay,
  getUserGroups: state.userInfoReducer.getUsers,
  shouldRefreshPrintBadgeAndSummaryInfo: state.changeStatus.shouldRefreshPrintBadgeAndSummaryInfo
})

export default connect(mapStateToProps)(DisplayComponent)
