import React from 'react'
import PropTypes from 'prop-types'
import * as config from 'config/config'
import primaryStyle from './SearchStyles.module.css'
import secondaryStyle from './sideItems.module.css'

export default class FilterByObjectType extends React.Component {
  filterGrid = () => {
    const filterCriteria = 'TYPE'
    const filterValue = this.props.subObjectType
    this.props.showFilteredData(filterCriteria, filterValue)
  }

  render () {
    const subObjectId = this.props.subObjectId
    return (
      <div id='typesContainer' className={primaryStyle.search + ' ' + secondaryStyle.search}>
        <button type='submit'
          className={secondaryStyle.button}
          onClick={this.filterGrid}
        >
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.search_subobject_${subObjectId}`,
            defaultMessage: `${config.labelBasePath}.main.search_subobject_${subObjectId}`
          })}
        </button>
      </div>
    )
  }
}

FilterByObjectType.propTypes = {
  // mainObjectType: PropTypes.string.isRequired,
  subObjectId: PropTypes.string.isRequired,
  subObjectType: PropTypes.string.isRequired,
  showFilteredData: PropTypes.func.isRequired
}

FilterByObjectType.contextTypes = {
  intl: PropTypes.object.isRequired
}
