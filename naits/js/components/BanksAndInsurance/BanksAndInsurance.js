import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Loading } from 'components/ComponentsIndex'
import AnimalCount from './AnimalCount'
import SlaughteredAnimalsByDisease from './SlaughteredAnimalsByDisease'
import AhsmAreas from './AhsmAreas'
import NewSearch from './NewSearch'
import * as config from 'config/config'
import { strcmp } from 'functions/utils'
import style from 'components/AppComponents/Functional/Messaging/Messaging.module.css'
import mainStyle from './BanksAndInsurance.module.css'
import sideMenuStyle from 'modulesCSS/SideMenu.module.css'

class BanksAndInsurance extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      reports: ['animal_count', 'slaughtered_animals_count', 'ahsm_areas'],
      reportsLabels: [],
      selectedItemId: '',
      isActive: false,
      activeElementId: '',
      componentToRender: undefined
    }
  }

  componentDidMount () {
    const reportsLabels = []
    const animalCountLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.stat_reports.animal_count`,
      defaultMessage: `${config.labelBasePath}.stat_reports.animal_count`
    })
    const slaughteredAnimalsCountLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.stat_reports.sabd`,
      defaultMessage: `${config.labelBasePath}.stat_reports.sabd`
    })
    const ahsmAreasLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.print.ahsm_areas`,
      defaultMessage: `${config.labelBasePath}.print.ahsm_areas`
    })
    reportsLabels.push(animalCountLabel, slaughteredAnimalsCountLabel, ahsmAreasLabel)
    this.setState({ reportsLabels })
  }

  handleSideMenuBtnClick = (selectedItemId) => {
    this.setState({ selectedItemId, isActive: false, activeElementId: '' })
  }

  setActiveElementId = (elementId) => {
    this.setState({ isActive: true, activeElementId: elementId, selectedItemId: '' })
  }

  render () {
    const { loading, reports, reportsLabels, isActive, activeElementId, selectedItemId } = this.state

    return (
      <div id='banks_and_insurance_container'>
        <div id='banks_and_insurance_side_menu' className={style['messaging-side-menu']}>
          <div id='banks_and_insurance_side_menu_btns' className={style['messaging-side-menu-btns']}>
            <div>
              <p style={{ color: 'white' }}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.general_statistic`,
                  defaultMessage: `${config.labelBasePath}.main.general_statistic`
                })}
              </p>
              <ul id='reportsList' className={sideMenuStyle.ul_item}>
                {reports.map((report, index) => {
                  return <li
                    {...isActive && activeElementId === report
                      ? { className: `list-group-item ${sideMenuStyle.li_item} ${sideMenuStyle.li_item_clicked}` }
                      : { className: `list-group-item ${sideMenuStyle.li_item}` }
                    }
                    key={report}
                    id={report}
                    onClick={() => {
                      this.setState({ isActive: true })
                      this.setActiveElementId(report)
                    }}
                  >{reportsLabels[index]}
                  </li>
                })}
              </ul>
            </div>
            <button id='new_search' className={style.btn}
              style={{
                backgroundColor: selectedItemId && strcmp(selectedItemId, 'new_search') && '#bf920d',
                color: selectedItemId && strcmp(selectedItemId, 'new_search') && '#1f1f1f'
              }}
              onClick={() => this.handleSideMenuBtnClick('new_search')}
            >
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.banks_and_insuranace.new_search`,
                defaultMessage: `${config.labelBasePath}.main.banks_and_insuranace.new_search`
              })}
            </button>
          </div>
        </div>
        <div id='banks_and_insurance_data_holder' className={`${style['messaging-data-holder']} ${mainStyle['banks-and-insurance-data-holder']}`}>
          {strcmp(activeElementId, 'animal_count') && <AnimalCount />}
          {strcmp(activeElementId, 'slaughtered_animals_count') && <SlaughteredAnimalsByDisease />}
          {strcmp(activeElementId, 'ahsm_areas') && <AhsmAreas />}
          {strcmp(selectedItemId, 'new_search') && <NewSearch parentComponent={this} />}
        </div>
        {loading && <Loading />}
      </div>
    )
  }
}

BanksAndInsurance.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession
})

export default connect(mapStateToProps)(BanksAndInsurance)
