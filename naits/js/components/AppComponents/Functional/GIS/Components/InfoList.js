import React from 'react'
import PropTypes from 'prop-types'
import * as config from 'config/config'

class InfoList extends React.Component {
  render () {
    const { content } = this.props
    let component
    if (content) {
      component = <div id='infoList' key={content} className='infoList'>
        <ul className='infoListContent' style={{ listStyleType: 'none' }} >
          {Object.keys(content).map((key) => (
            <li
              key={content[key]}
            >
              {
                key === 'Address'
                  ? this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.main.side_bar_holding_address`,
                    defaultMessage: `${config.labelBasePath}.main.side_bar_holding_address`
                  }) + ': ' + content[key] : key === 'Village_Code' ? this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.main.search.by_village_code`,
                    defaultMessage: `${config.labelBasePath}.main.search.by_village_code`
                  }) + ': ' + content[key] : key === 'External_ID' ? this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.main.side_bar_holding_external_id`,
                    defaultMessage: `${config.labelBasePath}.main.side_bar_holding_external_id`
                  }) + ': ' + content[key] : key === 'PIC' ? this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.grid_labels.animal.holding_id`,
                    defaultMessage: `${config.labelBasePath}.grid_labels.animal.holding_id`
                  }) + ': ' + content[key] : key === 'petId' ? this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.main.pet.pet_id`,
                    defaultMessage: `${config.labelBasePath}.main.pet.pet_id`
                  }) + ': ' + content[key] : key === 'petName' ? this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.grid_labels.pet.pet_name`,
                    defaultMessage: `${config.labelBasePath}.grid_labels.pet.pet_name`
                  }) + ': ' + content[key] : key === 'petBreed' ? this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.main.pet_breed`,
                    defaultMessage: `${config.labelBasePath}.main.pet_breed`
                  }) + ': ' + content[key] : ''
              }
            </li>
          ))}
        </ul>
      </div>
    } else {
      component = null
    }
    return component
  }
}

InfoList.propTypes = {
  content: PropTypes.object.isRequired,
  style: PropTypes.object
}

InfoList.contextTypes = {
  intl: PropTypes.object.isRequired
}

export default InfoList
