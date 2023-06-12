import React from 'react'
import { connect } from 'react-redux'
import { $ } from 'functions/utils'

class PetFormSecondLevelInputWrapper extends React.Component {
  constructor (props) {
    super(props)
    let petType = ''
    this.props.gridHierarchy.map(grid => {
      if (grid.gridType === 'PET') {
        if (grid.row['PET.PET_TYPE']) {
          petType = grid.row['PET.PET_TYPE']
        } else {
          petType = ''
        }
      }
    })
    this.state = {
      updated: '',
      formSectionsClassName: 'form-group field field-object',
      petTypeDropdownId: 'root_pet.description_detail_PET_TYPE',
      petType
    }
  }

  componentDidMount () {
    const { formSectionsClassName, petTypeDropdownId } = this.state
    const formSections = document.getElementsByClassName(formSectionsClassName)
    const formSectionsArr = Array.from(formSections)
    formSectionsArr[6].id = 'strayPetBasicInfo'
    formSectionsArr[7].id = 'strayPetDateDetails'
    formSectionsArr[8].id = 'strayPetOtherReasons'

    const petTypeDropdown = $(petTypeDropdownId)
    if (petTypeDropdown) {
      petTypeDropdown.onchange = this.handlePetTypeChange
    }

    const updater = $('updater')
    if (updater) {
      updater.click()
    }
  }

  componentDidUpdate (nextProps, nextState) {
    if ((nextState.petType !== '1' || nextState.petType === '')) {
      this.dogSectionsStyleChange('hide')
    } else if (nextState.petType === '1') {
      this.dogSectionsStyleChange('show')
    }
  }

  handlePetTypeChange = (e) => {
    this.setState({ petType: e.target.value })
  }

  dogSectionsStyleChange = (hideOrShow) => {
    let sectionsArr = []
    const strayPetDateDetailsSection = $('strayPetDateDetails')
    const strayPetOtherReasonsSection = $('strayPetOtherReasons')

    if (strayPetDateDetailsSection && strayPetOtherReasonsSection) {
      sectionsArr.push(strayPetDateDetailsSection, strayPetOtherReasonsSection)
      if (hideOrShow === 'hide') {
        sectionsArr.map(section => {
          section.style.display = 'none'
        })
      } else if (hideOrShow === 'show') {
        sectionsArr.map(section => {
          section.style.display = 'table'
          section.style.animationName = 'slide-in-up'
          section.style.animationIterationCount = '1'
          section.style.animationTimingFunction = 'ease-in'
          section.style.animationDuration = '0.5s'
        })
      } else if (hideOrShow === 'initial') {
        sectionsArr.map(section => {
          section.style.display = 'none'
        })
      }
    }
  }

  render () {
    return (
      <div>
        <button
          style={{ display: 'none' }}
          id='updater'
          onClick={() => {
            this.setState({ updated: 'updated' })
            setTimeout(document.getElementById('updater2') && document.getElementById('updater2').click(), 500)
          }}
        />
        <button
          style={{ display: 'none' }}
          id='updater2'
          onClick={() => {
            this.setState({ updated: 'updated2' })
          }}
        />
        {this.props.children}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  gridHierarchy: state.gridConfig.gridHierarchy
})

export default connect(mapStateToProps)(PetFormSecondLevelInputWrapper)
