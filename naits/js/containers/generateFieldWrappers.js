import React from 'react'
import InputWrappers from 'containers/InputWrappers'

export default function generateFieldWrappers (Instance, WrappedComponent, attachments) {
  const Wrapper = InputWrappers.InputSearchCriteriaTypeWrapper
  Instance.setState({
    attachments: attachments,
    createConfigConv: <Wrapper
      key='orgUnitsSearch'
      fieldIdCode='SVAROG_ORG_UNITS'
      gridToDisplay='SVAROG_ORG_UNITS'
      searchByCol='OBJECT_ID'
    >
      <Wrapper
        key='userIdSearch'
        fieldIdCode='SVAROG_USERS'
        gridToDisplay='SVAROG_USERS'
        searchByCol='OBJECT_ID'
      >
        <Wrapper
          key='userNameSearch'
          fieldIdCode='ASSIGNED_TO_USERNAME'
          gridToDisplay='SVAROG_USERS'
          searchByCol='USER_NAME'
        >
          <Wrapper
            key='holdingRespSearch'
            fieldIdCode='HOLDING_RESPONSIBLE'
            gridToDisplay='HOLDING_RESPONSIBLE'
            searchByCol='OBJECT_ID'
          >
            <Wrapper
              key='holdingSearch'
              fieldIdCode='HOLDING'
              gridToDisplay='HOLDING'
              searchByCol='OBJECT_ID'
            >
              <Wrapper
                key='animalSearch'
                fieldIdCode='ANIMAL'
                gridToDisplay='ANIMAL'
                searchByCol='OBJECT_ID'
              >
                <Wrapper
                  key='flockSearch'
                  fieldIdCode='FLOCK'
                  gridToDisplay='FLOCK'
                  searchByCol='OBJECT_ID'
                >
                  {WrappedComponent}
                </Wrapper>
              </Wrapper>
            </Wrapper>
          </Wrapper>
        </Wrapper>
      </Wrapper>
    </Wrapper>
  })
}
