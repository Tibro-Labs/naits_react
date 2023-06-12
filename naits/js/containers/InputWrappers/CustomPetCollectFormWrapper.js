import React from 'react'
import { connect } from 'react-redux'
import { ComponentManager } from 'components/ComponentsIndex'

class CustomPetCollectFormWrapper extends React.Component {
  componentDidMount () {
    const locationTypeDropdown = document.getElementById('root_LOCATION_REASON')
    if (locationTypeDropdown.getElementsByTagName('option')) {
      locationTypeDropdown.getElementsByTagName('option')[1].selected = true
    }

    let formData = ComponentManager.getStateForComponent('STRAY_PET_LOCATION_ADDITIONAL_FORM', 'formTableData')
    formData.LOCATION_REASON = '1'
    formData.STATUS = 'VALID'
    if (this.props.petMovementId) {
      formData.PET_MOVEMENT_ID = String(this.props.petMovementId)
    }
    ComponentManager.setStateForComponent('STRAY_PET_LOCATION_ADDITIONAL_FORM', 'formTableData', formData)
  }

  render () {
    return this.props.children
  }
}

const mapStateToProps = state => ({
  petMovementId: state.lastPetMovement.petMovementId
})

export default connect(mapStateToProps)(CustomPetCollectFormWrapper)
