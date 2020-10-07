import React from 'react'
import { connect } from 'react-redux'
import { $ } from 'functions/utils'

class PopulationAreaInputWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      fieldIdName: 'save_form_btn',
      customDeleteBtnId: 'customDeleteAdmConsole',
      areaNameDropdown: 'root_AREA_NAME',
      areaTypeDropdown: 'root_AREA_TYPE'
    }
  }

  componentDidMount () {
    const { fieldIdName, customDeleteBtnId, areaNameDropdown, areaTypeDropdown } = this.state

    const saveBtn = $(fieldIdName)
    if (saveBtn) {
      saveBtn.style.display = 'none'
    }

    const customDeleteBtn = $(customDeleteBtnId)
    if (customDeleteBtn) {
      customDeleteBtn.style.display = 'block'
    }

    let currentPopulationStatus = ''
    this.props.gridHierarchy.map(grid => {
      currentPopulationStatus = grid.row['POPULATION.STATUS']
    })

    if (currentPopulationStatus === 'FINAL') {
      if (customDeleteBtn) {
        customDeleteBtn.style.display = 'none'
      }
    }

    const areaNDropdown = $(areaNameDropdown)
    const areaTDropdown = $(areaTypeDropdown)
    if (areaNDropdown && areaTDropdown) {
      areaNDropdown.setAttribute('disabled', '')
      areaTDropdown.setAttribute('disabled', '')
    }
  }

  render () {
    return this.props.children
  }
}

const mapStateToProps = state => ({
  gridHierarchy: state.gridConfig.gridHierarchy
})

export default connect(mapStateToProps)(PopulationAreaInputWrapper)
