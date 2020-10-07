import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ReduxNavigator } from 'tibro-components'
import {
  PreviewData, UndoAnimalRetirement, EarTagReplacementAction,
  DailySlaughterhouseReport, CampaignReport, InventoryModuleReport,
  UserGroupNote, AssignOwnerToStrayPet, SampleForPopulation,
  UpdatePopulationStatus, GeoPopulationFilter, DownloadPopulationSampleFile,
  ApplyStratificationFilter, StratifyPopulation
} from 'components/ComponentsIndex'
import { selectObject } from 'functions/utils'

class DisplayComponent extends React.Component {
  static propTypes = {
    menuType: PropTypes.string.isRequired,
    configuration: PropTypes.func.isRequired,
    componentStack: PropTypes.array,
    lastSelectedItem: PropTypes.func.isRequired
    // dataSource: PropTypes.string
  }

  render () {
    const { componentStack, configuration, menuType } = this.props
    let getUsers = this.props.getUserGroups

    /* Check if the current holding is of type slaughterhouse
    ** so the slaughterhouse daily report will be displayed correctly
    **/
    let holdingType = ''
    componentStack.forEach(grid => {
      if (menuType === 'HOLDING' && grid.active && grid.row['HOLDING.TYPE'] !== '7') {
        holdingType = ''
      } else if (menuType === 'HOLDING' && grid.active && grid.row['HOLDING.TYPE'] === '7') {
        holdingType = '7'
      }
    })

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
          {(menuType === 'ANIMAL' || menuType === 'FLOCK') && getUsers &&
            <UndoAnimalRetirement gridType={menuType} />
          }
          {menuType === 'ANIMAL' &&
            <EarTagReplacementAction gridType={menuType} />
          }
          {holdingType === '7' &&
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
  getUserGroups: state.userInfoReducer.getUsers
})

export default connect(mapStateToProps)(DisplayComponent)
