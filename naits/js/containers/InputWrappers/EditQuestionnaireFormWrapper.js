import React from 'react'

export default class EditQuestionnaireFormWrapper extends React.Component {
  componentDidMount () {
    const booleanFields = document.getElementsByClassName('form-group field field-boolean')
    if (booleanFields) {
      Array.from(booleanFields).forEach(field => {
        if (field) {
          field.style.display = 'none'
        }
      })
    }
  }

  render () {
    return this.props.children
  }
}
