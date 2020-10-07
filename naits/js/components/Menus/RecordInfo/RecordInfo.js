import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import recordInfoStyles from './RecordInfo.module.css'
import { store } from 'tibro-redux'
import createHashHistory from 'history/createHashHistory'
import * as config from 'config/config'
const hashHistory = createHashHistory()

function decodeValueFromCodelist (valueToDecode, item) {
  let decodedValue
  if (item.formatterOptions && item.formatterOptions.length > 0) {
    for (let i = 0; i < item.formatterOptions.length; i++) {
      if (valueToDecode === item.formatterOptions[i].id) {
        decodedValue = item.formatterOptions[i].text
      }
    }
  }
  return decodedValue || valueToDecode
}

function getConfigFromFile (configuration, renderedGrids, context) {
  const bulkData = []
  for (let k = 0; k < renderedGrids.length; k++) {
    if (renderedGrids[k].row && Object.keys(renderedGrids[k]).length > 0) {
      let generatedData = ''
      let dataType = renderedGrids[k].gridType
      const itemsObject = configuration(dataType, context.intl)
      const itemsArray = itemsObject.CHOSEN_ITEM
      const spacing = ': '
      for (let i = 0; i < itemsArray.length; i++) {
        let label = itemsArray[i].LABEL
        const emptyLine = <br key={`${itemsArray[i].ID}_LINEBREAK`} />
        let value = ''
        if (itemsArray[i].VALUE instanceof Array &&
          renderedGrids[k].row[itemsArray[i].VALUE[0]] &&
          renderedGrids[k].row[itemsArray[i].VALUE[1]]) {
          value = `${spacing + renderedGrids[k].row[itemsArray[i].VALUE[0]]} ${renderedGrids[k].row[itemsArray[i].VALUE[1]]}`
        } else if ((typeof itemsArray[i].VALUE === 'string' || itemsArray[i].VALUE instanceof String) &&
          renderedGrids[k].row[itemsArray[i].VALUE]) {
          value = spacing + renderedGrids[k].row[itemsArray[i].VALUE]
          if (itemsArray[i].LINK_TO_PARRENT_BY) {
            let criteria
            store.dispatch(itemsArray[i].LINK_FUNC(
              renderedGrids[k].row[itemsArray[i].VALUE].toString(),
              (response) => {
                criteria = response
              }
            ))
            const click = () => hashHistory.push(`/main/dynamic/${itemsArray[i].LINK_TO_TABLE.toLowerCase()}?c=${itemsArray[i].LINK_TO_PARRENT_BY}&v=${criteria}`)
            label =
              (<span
                style={{
                  color: '#c8990e',
                  cursor: 'pointer'
                }}
                onClick={click}
                key={`${itemsArray[i].ID}URL`}
              >
                {`${itemsArray[i].LABEL}${value}`}
              </span>)
            value = true
          }
        } else {
          value = ''
        }
        if (value) {
          generatedData = [generatedData, emptyLine, label, value]
        }
      }
      bulkData.push(generatedData)
    }
  }
  return bulkData
}

function getConfigFromDb (menuType, configuration, renderedGrids) {
  const value = []
  const newLine = <br />
  for (let i = 0; i < renderedGrids.length; i++) {
    for (let o = 0; o < configuration.objects.length; o++) {
      if (renderedGrids[i].id === configuration.objects[o] || (renderedGrids[i].id.indexOf(configuration.objects[o]) > -1)) {
        const selectedItem = renderedGrids[i].rowClicked
        for (let j = 0; j < configuration.info.length; j++) {
          let generatedData = ''
          if (selectedItem[configuration.info[j].value]) {
            let labelName
            for (let lbl = 0; lbl < renderedGrids[i].gridConfig.length; lbl++) {
              if (renderedGrids[i].gridConfig[lbl].key === configuration.info[j].value) {
                labelName = renderedGrids[i].gridConfig[lbl].name
                const label = `${labelName}: ${decodeValueFromCodelist(selectedItem[configuration.info[j].value], renderedGrids[i].gridConfig[lbl])}`
                generatedData = [label, newLine]
                value.push(generatedData)
              }
            }
          }
        }
      }
    }
  }
  return value
}
// displays logged in user's username and selected record's
// type, id/properties...
class RecordInfo extends React.Component {
  render () {
    let bulkData = []
    const { configuration, menuType, componentStack, selectedObjects } = this.props
    let components = componentStack || selectedObjects
    if (configuration && components && components.length) {
      if (configuration instanceof Function) {
        bulkData = getConfigFromFile(configuration, components, this.context)
      } else {
        bulkData = getConfigFromDb(menuType, configuration, components)
      }
    }
    return (
      <div id='record_info' className={recordInfoStyles.divMainContent}>
        <p id='selected_item' className={recordInfoStyles.selected_item}>
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.${menuType.toLowerCase()}`,
            defaultMessage: `${config.labelBasePath}.main.${menuType.toLowerCase()}`
          })}
          {bulkData}
        </p>
      </div>
    )
  }
}

RecordInfo.propTypes = {
  menuType: PropTypes.string,
  configuration: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired
}

RecordInfo.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  selectedObjects: state.gridConfig.gridHierarchy
})

export default connect(mapStateToProps)(RecordInfo)
