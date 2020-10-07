import React from 'react'
import InputStrayPetCollectionWrapper from './InputStrayPetCollectionWrapper.js'
import InputStrayPetReleaseWrapper from './InputStrayPetReleaseWrapper.js'

const CombineStrayPetWrappers = (props) => {
  return (
    <InputStrayPetCollectionWrapper {...props}>
      <InputStrayPetReleaseWrapper {...props}>
        {props.children}
      </InputStrayPetReleaseWrapper>
    </InputStrayPetCollectionWrapper>
  )
}

export default CombineStrayPetWrappers
