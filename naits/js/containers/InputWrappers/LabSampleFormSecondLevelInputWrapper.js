import React from 'react'
import { connect } from 'react-redux'
import { ComponentManager } from 'components/ComponentsIndex'

class LabSampleFormSecondLevelInputWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      holdingPicInputField: 'root_lab_sample.origin_sample_HOLDING_PIC',
      animalEarTagInputField: 'root_lab_sample.origin_sample_ANIMAL_EAR_TAG',
      sampleOriginDropdown: 'root_lab_sample.basic_info_SAMPLE_ORIGIN',
      currentGrid: ''
    }
  }

  componentDidMount () {
    const sampleOriginDropdown = document.getElementById(this.state.sampleOriginDropdown)
    if (sampleOriginDropdown) {
      sampleOriginDropdown.setAttribute('disabled', '')
      this.props.gridHierarchy.forEach(grid => {
        if (grid.active && grid.gridType === 'HOLDING') {
          this.setState({ currentGrid: grid.gridType })
          sampleOriginDropdown.selectedIndex = 2
        }
        if (grid.active && grid.gridType === 'ANIMAL') {
          this.setState({ currentGrid: grid.gridType })
          sampleOriginDropdown.selectedIndex = 1
        }
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    let newTableData = ComponentManager.getStateForComponent(nextProps.formid, 'formTableData')
    if (newTableData && newTableData['lab_sample.basic_info']) {
      if (this.state.currentGrid === 'HOLDING') {
        newTableData['lab_sample.basic_info']['SAMPLE_ORIGIN'] = '2'
      } else if (this.state.currentGrid === 'ANIMAL') {
        newTableData['lab_sample.basic_info']['SAMPLE_ORIGIN'] = '1'
      }
    }
  }

  componentDidUpdate () {
    const holdingPicInput = document.getElementById(this.state.holdingPicInputField)
    if (holdingPicInput && this.state.currentGrid === 'HOLDING') {
      holdingPicInput.setAttribute('readonly', '')
    }
    const animalEarTagInput = document.getElementById(this.state.animalEarTagInputField)
    if (animalEarTagInput && this.state.currentGrid === 'ANIMAL') {
      animalEarTagInput.setAttribute('readonly', '')
    }
  }

  render () {
    return this.props.children
  }
}

const mapStateToProps = state => ({
  gridHierarchy: state.gridConfig.gridHierarchy
})

export default connect(mapStateToProps)(LabSampleFormSecondLevelInputWrapper)
