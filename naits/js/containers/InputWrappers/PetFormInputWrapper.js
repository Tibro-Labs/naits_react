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
      isStrayPetDropdownId: 'root_pet.basic_info_IS_STRAY_PET',
      petTypeDropdownId: 'root_pet.description_detail_PET_TYPE',
      isStrayPet: '',
      petType: ''
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

    this.strayPetSectionStyleChange('initial')
    this.dogSectionsStyleChange('initial')
  }

  componentDidUpdate (nextProps, nextState) {
    if (nextState.isStrayPet === '2' || nextState.isStrayPet === '') {
      this.strayPetSectionStyleChange('hide')

      // Remove unneeded form data
      let newTableData = ComponentManager.getStateForComponent(nextProps.formid, 'formTableData')
      if (newTableData[nextState.strayPetBasicInfoFormData]) {
        const chippedBeforeDropdown = document.getElementById(nextState.chippedBeforeDropdown)
        if (chippedBeforeDropdown) {
          chippedBeforeDropdown.selectedIndex = 0
        }
        const taggedBeforeDropdown = document.getElementById(nextState.taggedBeforeDropdown)
        if (taggedBeforeDropdown) {
          taggedBeforeDropdown.selectedIndex = 0
        }
        newTableData[nextState.strayPetBasicInfoFormData]['CHIPPED_BEFORE'] = undefined
        newTableData[nextState.strayPetBasicInfoFormData]['PET_CHARACTERISTICS'] = undefined
        newTableData[nextState.strayPetBasicInfoFormData]['TAGGET_BEFORE'] = undefined
      }
    } else {
      this.strayPetSectionStyleChange('show')
    }

    if ((nextState.petType !== '1' || nextState.petType === '') ||
      (nextState.petType === '1' && nextState.isStrayPet === '2')) {
      this.dogSectionsStyleChange('hide')

      // Remove unneeded form data
      let newTableData = ComponentManager.getStateForComponent(nextProps.formid, 'formTableData')
      if (newTableData[nextState.strayPetDateDetailsFormData]) {
        newTableData[nextState.strayPetDateDetailsFormData]['DT_ADOPTION'] = undefined
      }
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
        {this.props.children}
      </div>
    )
  }
}

export default PetFormInputWrapper
