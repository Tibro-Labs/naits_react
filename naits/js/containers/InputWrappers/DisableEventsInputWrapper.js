import React from 'react'

class DisableEventsInputWrapper extends React.Component {
  componentDidMount () {
    const inputs = Array.from(document.getElementsByTagName('input'))
    inputs.map(singleInput => {
      if (singleInput && (singleInput.hasAttribute('readonly') || singleInput.hasAttribute('disabled'))) {
        singleInput.addEventListener('keydown', e => {
          e.preventDefault()
        })
      }
    })

    const dropdowns = Array.from(document.getElementsByTagName('select'))
    if (dropdowns) {
      dropdowns.map(singleDropdown => {
        if (singleDropdown && (singleDropdown.hasAttribute('readonly') || singleDropdown.hasAttribute('disabled'))) {
          singleDropdown.addEventListener('mousedown', e => {
            e.preventDefault()
          })
        }
      })
    }
  }

  render () {
    return this.props.children
  }
}

export default DisableEventsInputWrapper
