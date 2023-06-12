import React from 'react'
import { ComponentManager } from 'components/ComponentsIndex'
import { $ } from 'functions/utils'

class PetFormInputWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      taggedBeforeDropdown: 'root_pet.stray_pet_basic_info_TAGGET_BEFORE',
      chippedBeforeDropdown: 'root_pet.stray_pet_basic_info_CHIPPED_BEFORE',
      dateOfAdoptionDatePicker: 'root_pet.stray_pet_date_details_DT_ADOPTION',
      strayPetBasicInfoFormData: 'pet.stray_pet_basic_info',
      strayPetDateDetailsFormData: 'pet.stray_pet_date_details',
      formSectionsClassName: 'form-group field field-object',
      petTypeDropdownId: 'root_pet.description_detail_PET_TYPE',
      petType: ''
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

    this.dogSectionsStyleChange('initial')
  }

  componentDidUpdate (nextProps, nextState) {
    if ((nextState.petType !== '1' || nextState.petType === '')) {
      this.dogSectionsStyleChange('hide')

      // Remove unneeded form data
      let newTableData = ComponentManager.getStateForComponent(nextProps.formid, 'formTableData')
      if (newTableData[nextState.strayPetDateDetailsFormData]) {
        newTableData[nextState.strayPetDateDetailsFormData]['DT_ADOPTION'] = undefined
      }
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
        {this.props.children}
      </div>
    )
  }
}

export default PetFormInputWrapper
