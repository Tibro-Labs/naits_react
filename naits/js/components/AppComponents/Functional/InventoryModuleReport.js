import React from 'react'
import PropTypes from 'prop-types'
import * as config from 'config/config.js'
import style from 'components/AppComponents/ExecuteActions/ExecuteActionOnSelectedRows.module.css'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'

class InventoryModuleReport extends React.Component {
  generateInvModuleReport = () => {
    let url = config.svConfig.triglavRestVerbs.GET_REPORT
    url = url.replace('%session', this.props.svSession)
    url = url.replace('%objectId', this.props.objectId)
    url = url.replace('%reportName', 'inventory_mod_main')
    window.open(`${config.svConfig.restSvcBaseUrl}/${url}`, '_blank')
  }

  render () {
    return (
      <div
        id='inv_module_report'
        className={styles.container}
        style={{ cursor: 'pointer', marginRight: '7px', color: 'white' }}
        onClick={this.generateInvModuleReport}
      >
        <p style={{ marginTop: '2px' }}>
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.inv_module_report`,
            defaultMessage: `${config.labelBasePath}.main.inv_module_report`
          })}
        </p>
        <div id='inv_module_report' className={styles['gauge-container']}>
          <img
            id='change_status_img' className={style.actionImg}
            style={{ height: '45px', marginTop: '7%', marginLeft: '14px' }}
            src='/naits/img/massActionsIcons/actions_general.png'
          />
        </div>
      </div>
    )
  }
}

InventoryModuleReport.contextTypes = {
  intl: PropTypes.object.isRequired
}

export default InventoryModuleReport
