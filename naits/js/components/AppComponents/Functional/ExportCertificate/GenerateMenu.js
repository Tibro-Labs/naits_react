import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { store, updateSelectedRows } from 'tibro-redux'
import { HandleItemSelection, ReduxNavigator } from 'tibro-components'
import {
  GridContent, CancelAnimalExport,
  ExportCertifiedAnimals, RecordInfo
} from 'components/ComponentsIndex'
import recordConfig from 'config/recordConfig'
import * as config from 'config/config'
import sideMenuStyle from 'modulesCSS/SideMenu.module.css'
import consoleStyle from 'components/AppComponents/Functional/AdminConsole/AdminConsole.module.css'
import StatusBadges from 'components/AppComponents/Presentational/StatusBadges'
import style from 'containers/MainNavigation.module.css'

const items = [
  {
    id: 'list_item_certified_animals',
    objectType: 'ANIMAL',
    linkName: 'ANIMAL_EXPORT_CERT',
    labelCode: config.labelBasePath + '.main.certified_animals',
    enableNextMenu: true,
    enableEditForm: true,
    showStatusBadges: true,
    certifiedAction: true
  }
]

class GenerateMenu extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      activeItem: null,
      displayGrid: null,
      alert: null,
      renderGrid: false,
      parentId: null,
      showStatusBadges: false,
      certifiedAction: false,
      menuType: 'EXPORT_CERT'
    }
    this.gridConfig = {
      SIZE: {
        HEIGHT: window.innerHeight - 300,
        WIDTH: '100%'
      }
    }
  }

  generateGrid (activeItem, objectType, enableNextMenu, linkName, enableEditForm, parentId, showStatusBadges, certifiedAction) {
    if (this.state.displayGrid !== objectType) {
      store.dispatch(updateSelectedRows([], null))
    }
    this.setState({
      activeItem: activeItem,
      displayGrid: objectType,
      enableNextMenu: enableNextMenu,
      linkName: linkName,
      enableEditForm: enableEditForm,
      renderGrid: true,
      parentId: parentId,
      showStatusBadges: showStatusBadges,
      certifiedAction: certifiedAction
    })
  }
  render () {
    let menu = []
    items.forEach(item => {
      let parentId, gridType
      const id = item.id
      const objectType = item.objectType
      const labelCode = item.labelCode
      const enableNextMenu = item.enableNextMenu
      const enableEditForm = item.enableEditForm
      const linkName = item.linkName
      const showStatusBadges = item.showStatusBadges
      const certifiedAction = item.certifiedAction
      if (this.props.gridHierarchy.length > 0) {
        this.props.gridHierarchy.forEach(grid => {
          if (grid.active) {
            gridType = grid.gridId
            parentId = grid.row[`${gridType}.OBJECT_ID`]
          }
        })
      }
      menu.push(
        <li
          id={id}
          key={id}
          {...this.state.activeItem === id
            ? { className: `list-group-item ${sideMenuStyle.li_item} ${sideMenuStyle.li_item_clicked}` }
            : { className: `list-group-item ${sideMenuStyle.li_item}` }
          }
          onClick={() => this.generateGrid(id, objectType,
            enableNextMenu, linkName, enableEditForm, parentId, showStatusBadges, certifiedAction)}
        >
          {this.context.intl.formatMessage({
            id: labelCode, defaultMessage: labelCode
          })}
        </li>
      )
    })

    const Wrap = (props) => {
      return <ReduxNavigator {...props} configuration={recordConfig} />
    }
    const Navigation = HandleItemSelection(Wrap)

    return (
      <div>
        <div id='exportCertMenuContainer' className={sideMenuStyle.sideDiv}>
          <RecordInfo {...this.props} configuration={recordConfig} menuType={this.state.menuType} />
          <ul id='exportCertMenu' className={sideMenuStyle.ul_item}>
            {menu}
          </ul>
        </div>
        <div id='displayAllRecords' className='displayContent'>
          <Navigation />
          <span className={style.imgGeorgia}> <img src='img/georgia_coat_of_arms.png' /></span>
          {this.state.displayGrid &&
            <div id='container' className={consoleStyle.itemsContainer}>
              <CancelAnimalExport
                objectId={this.state.parentId}
                showGrid={this.state.displayGrid}
                linkName={this.state.linkName}
              />
              {this.state.certifiedAction &&
                <ExportCertifiedAnimals gridType={this.state.displayGrid} />
              }
              {this.state.showStatusBadges &&
                <StatusBadges
                  gridHierarchy={this.props.gridHierarchy}
                  menuType={this.state.displayGrid}
                  svSession={this.props.svSession}
                  objectId={this.state.parentId}
                />
              }
              {this.state.renderGrid && <GridContent
                showGrid={this.state.displayGrid}
                gridConfig={this.gridConfig}
                allowEdit={this.state.enableEditForm}
                parentId={this.state.parentId}
                linkName={this.state.linkName}
                hideBtns={'delete'}
                disableEditForSubmodules
                enableMultiSelect
              />
              }
            </div>
          }
        </div>
      </div>
    )
  }
}

GenerateMenu.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
  gridHierarchy: state.gridConfig.gridHierarchy
})

export default connect(mapStateToProps)(GenerateMenu)
