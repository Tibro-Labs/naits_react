import React from 'react'
import { connect } from 'react-redux'
import { $ } from 'functions/utils'

class PetFormSecondLevelInputWrapper extends React.Component {
  constructor (props) {
    super(props)
    let petType = ''
    let isStrayPet = ''
    this.props.gridHierarchy.map(grid => {
      if (grid.gridType === 'PET') {
        if (grid.row['PET.PET_TYPE']) {
          petType = grid.row['PET.PET_TYPE']
        } else {
          petType = ''
        }

        if (grid.row['PET.IS_STRAY_PET']) {
          isStrayPet = grid.row['PET.IS_STRAY_PET']
        } else {
          isStrayPet = ''
        }
      }
    })
    this.state = {
      updated: '',
      formSectionsClassName: 'form-group field field-object',
      isStrayPetDropdownId: 'root_pet.basic_info_IS_STRAY_PET',
      petTypeDropdownId: 'root_pet.description_detail_PET_TYPE',
      isStrayPet,
      petType
    }
  }

  componentDidMount () {
    const { formSectionsClassName, isStrayPetDropdownId, petTypeDropdownId } = this.state
    const formSections = document.getElementsByClassName(formSectionsClassName)
    const formSectionsArr = Array.from(formSections)
    formSectionsArr[6].id = 'strayPetBasicInfo'
    formSectionsArr[7].id = 'strayPetDateDetails'
    formSectionsArr[8].id = 'strayPetOtherReasons'

    const isStrayPetDropdown = $(isStrayPetDropdownId)
    if (isStrayPetDropdown) {
      isStrayPetDropdown.onchange = this.handleChange
    }

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
    if (nextState.isStrayPet === '2' || nextState.isStrayPet === '') {
      this.strayPetSectionStyleChange('hide')
    } else {
      this.strayPetSectionStyleChange('show')
    }

    if ((nextState.petType !== '1' || nextState.petType === '') ||
      (nextState.petType === '1' && nextState.isStrayPet === '2') || nextState.isStrayPet === '') {
      this.dogSectionsStyleChange('hide')
    } else if (nextState.petType === '1' && nextState.isStrayPet === '1') {
      this.dogSectionsStyleChange('show')
    }
  }

  handleChange = (e) => {
    this.setState({ isStrayPet: e.target.value })
  }

  handlePetTypeChange = (e) => {
    this.setState({ petType: e.target.value })
  }

  strayPetSectionStyleChange = (hideOrShow) => {
    const strayPetBasicInfoSection = $('strayPetBasicInfo')
    if (strayPetBasicInfoSection) {
      if (hideOrShow === 'hide') {
        strayPetBasicInfoSection.style.display = 'none'
      } else if (hideOrShow === 'show') {
        strayPetBasicInfoSection.style.display = 'table'
        strayPetBasicInfoSection.style.animationName = 'slide-in-up'
        strayPetBasicInfoSection.style.animationIterationCount = '1'
        strayPetBasicInfoSection.style.animationTimingFunction = 'ease-in'
        strayPetBasicInfoSection.style.animationDuration = '0.5s'
      } else if (hideOrShow === 'initial') {
        strayPetBasicInfoSection.style.display = 'none'
      }
    }
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
