import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ComponentManager, GridManager } from 'components/ComponentsIndex'
import { disableAddRowConfig } from 'config/disableAddRowConfig'

class ResultsGrid extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    onRowSelectProp: PropTypes.func.isRequired
  }
  constructor (props) {
    super(props)
    this.state = {
      renderGrid: undefined
    }
    this.generateGrid = this.generateGrid.bind(this)
    this.onRowSelect = this.onRowSelect.bind(this)
  }

  componentDidMount () {
    if (this.props) {
      this.generateGrid(this.props)
    }
  }

  componentWillReceiveProps (nextProps) {
    if ((this.props.id !== nextProps.id) || (nextProps.toggleCustomButton !== this.props.toggleCustomButton)) {
      this.generateGrid(nextProps)
    }
  }

  generateGrid (props) {
    const id = props.id
    let toggleCustomButton = props.toggleCustomButton
    const filterBy = props.filterBy
    let enableMultiSelect = props.enableMultiSelect
    const onSelectChangeFunct = props.onSelectChangeFunct
    const filterVals = props.filterVals
    const gridType = props.gridType
    const showGrid = props.gridToDisplay
    const gridHeight = props.gridConfig ? (props.gridConfig.SIZE ? props.gridConfig.SIZE.HEIGHT : null) : null
    const gridWidth = props.gridConfig ? (props.gridConfig.SIZE ? props.gridConfig.SIZE.WIDTH : null) : null
    let gridTypeCall = props.gridTypeCall || 'GET_TABLE_WITH_FILTER'
    const gridParams = []

    let renderGrid

    if (!filterBy && !filterVals) {
      disableAddRowConfig('DISABLE_ADD_ROW_FOR_TABLE') && disableAddRowConfig('DISABLE_ADD_ROW_FOR_TABLE').LIST_OF_ITEMS.map((element) => {
        // Disable add button for some grids defined in disableAddRowConfig
        if (id === element.TABLE) {
          this.insertNewRow = null
          this.customButton = null
          toggleCustomButton = false
        }
      })

      if (props.gridTypeCall) {
        if (props.gridTypeCall === 'GET_BYOBJECTID') {
          gridParams.push({
            PARAM_NAME: 'objectName',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'gridConfigWeWant',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'svSession',
            PARAM_VALUE: props.session
          }, {
            PARAM_NAME: 'objectId',
            PARAM_VALUE: props.orgUnitObjId
          })
          renderGrid = GridManager.generateGridWithCustomSize(
            id, id, 'CUSTOM_GRID', props.gridTypeCall,
            gridParams, 'CUSTOM', this.onRowSelect, null, enableMultiSelect,
            onSelectChangeFunct, gridHeight, gridWidth, toggleCustomButton, this.customButton
          )
        } else if (props.gridTypeCall === 'GET_BYPARENTID') {
          gridParams.push({
            PARAM_NAME: 'objectName',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'gridConfigWeWant',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'svSession',
            PARAM_VALUE: props.session
          }, {
            PARAM_NAME: 'parentId',
            PARAM_VALUE: props.parentId
          }, {
            PARAM_NAME: 'objectType',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'rowlimit',
            PARAM_VALUE: 10000
          })
          renderGrid = GridManager.generateGridWithCustomSize(
            id, id, 'CUSTOM_GRID', props.gridTypeCall,
            gridParams, 'CUSTOM', this.onRowSelect, null, enableMultiSelect,
            onSelectChangeFunct, gridHeight, gridWidth, toggleCustomButton, this.customButton
          )
        } else if (props.gridTypeCall === 'BASE_DATA_SECONDARY') {
          gridParams.push({
            PARAM_NAME: 'objectName',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'gridConfigWeWant',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'svSession',
            PARAM_VALUE: props.session
          })
          renderGrid = GridManager.generateGridWithCustomSize(
            id, id, 'CUSTOM_GRID', props.gridTypeCall,
            gridParams, 'CUSTOM', this.onRowSelect, null, enableMultiSelect,
            onSelectChangeFunct, gridHeight, gridWidth, toggleCustomButton, this.customButton
          )
        } else if (props.gridTypeCall === 'GET_TABLE_WITH_LIKE_FILTER_2') {
          gridParams.push({
            PARAM_NAME: 'objectName',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'gridConfigWeWant',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'svSession',
            PARAM_VALUE: props.session
          }, {
            PARAM_NAME: 'searchBy',
            PARAM_VALUE: 'NAME'
          }, {
            PARAM_NAME: 'searchForValue',
            PARAM_VALUE: props.externalId
          }, {
            PARAM_NAME: 'rowlimit',
            PARAM_VALUE: 10000
          })
          renderGrid = GridManager.generateGridWithCustomSize(
            id, id, 'CUSTOM_GRID', props.gridTypeCall,
            gridParams, 'CUSTOM', this.onRowSelect, null, enableMultiSelect,
            onSelectChangeFunct, gridHeight, gridWidth, toggleCustomButton, this.customButton
          )
        } else if (props.gridTypeCall === 'GET_TABLE_WITH_FILTER_2') {
          gridParams.push({
            PARAM_NAME: 'table_name',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'gridConfigWeWant',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'svSession',
            PARAM_VALUE: props.session
          }, {
            PARAM_NAME: 'searchBy',
            PARAM_VALUE: props.filterValue
          }, {
            PARAM_NAME: 'searchForValue',
            PARAM_VALUE: props.externalId
          }, {
            PARAM_NAME: 'no_rec',
            PARAM_VALUE: 10000
          })
          renderGrid = GridManager.generateGridWithCustomSize(
            id, id, 'CUSTOM_GRID', props.gridTypeCall,
            gridParams, 'CUSTOM', this.onRowSelect, null, enableMultiSelect,
            onSelectChangeFunct, gridHeight, gridWidth, toggleCustomButton, this.customButton
          )
        } else {
          gridParams.push({
            PARAM_NAME: 'objectName',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'gridConfigWeWant',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'svSession',
            PARAM_VALUE: props.session
          }, {
            PARAM_NAME: 'rowlimit',
            PARAM_VALUE: 10000
          }, {
            PARAM_NAME: 'externalId',
            PARAM_VALUE: props.externalId || 'null'
          })
          renderGrid = GridManager.generateGridWithCustomSize(
            id, id, 'CUSTOM_GRID', props.gridTypeCall,
            gridParams, 'CUSTOM', this.onRowSelect, null, enableMultiSelect,
            onSelectChangeFunct, gridHeight, gridWidth, toggleCustomButton, this.customButton
          )
        }
      } else {
        if (showGrid === 'LAB_TEST_TYPE') {
          gridTypeCall = 'GET_VALID_TEST_TYPES'
          gridParams.push({
            PARAM_NAME: 'objectName',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'gridConfigWeWant',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'svSession',
            PARAM_VALUE: props.session
          }, {
            PARAM_NAME: 'rowlimit',
            PARAM_VALUE: 10000
          }, {
            PARAM_NAME: 'objectId',
            PARAM_VALUE: props.labTestId
          }, {
            PARAM_NAME: 'testType',
            PARAM_VALUE: props.testType
          })
          renderGrid = GridManager.generateGridWithCustomSize(
            id, id, 'CUSTOM_GRID', gridTypeCall,
            gridParams, 'CUSTOM', this.onRowSelect, null, enableMultiSelect,
            onSelectChangeFunct, gridHeight, gridWidth, toggleCustomButton, this.customButton
          )
        } else {
          renderGrid = GridManager.generateGridWithCustomSize(
            id, id, props.gridToDisplay, props.gridToDisplay,
            null, 'BASE', this.onRowSelect, null, enableMultiSelect,
            onSelectChangeFunct, gridHeight, gridWidth, toggleCustomButton, this.customButton
          )
        }

        if (this.props.customGridDataWS) {
          gridTypeCall = this.props.customGridDataWS
          if (gridTypeCall === 'GET_APPLIED_STRAT_FILTERS' || gridTypeCall === 'GET_HERDS_PER_HOLDING' || gridTypeCall === 'GET_ANIMALS_PER_HERD') {
            gridParams.push({
              PARAM_NAME: 'parentId',
              PARAM_VALUE: this.props.parentId
            })
          }

          if (gridTypeCall === 'GET_AVAILABLE_ANIMALS_PER_TYPE') {
            gridParams.push({
              PARAM_NAME: 'herdObjId',
              PARAM_VALUE: this.props.herdObjId
            }, {
              PARAM_NAME: 'animalType',
              PARAM_VALUE: this.props.herdAnimalType
            })
          }

          if (gridTypeCall === 'GET_APPLICABLE_TEST_TYPES') {
            gridParams.push({
              PARAM_NAME: 'activityType',
              PARAM_VALUE: props.activityType
            }, {
              PARAM_NAME: 'activitySubType',
              PARAM_VALUE: props.activitySubType
            }, {
              PARAM_NAME: 'disease',
              PARAM_VALUE: props.disease
            })
          }

          gridParams.push({
            PARAM_NAME: 'objectName',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'gridConfigWeWant',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'svSession',
            PARAM_VALUE: props.session
          }, {
            PARAM_NAME: 'rowlimit',
            PARAM_VALUE: 10000
          })

          renderGrid = GridManager.generateGridWithCustomSize(
            id, id, 'CUSTOM_GRID', gridTypeCall,
            gridParams, 'CUSTOM', this.onRowSelect, null, enableMultiSelect,
            onSelectChangeFunct, gridHeight, gridWidth, toggleCustomButton, this.customButton
          )
        }
      }
    } else {
      disableAddRowConfig('DISABLE_ADD_ROW_FOR_TABLE') && disableAddRowConfig('DISABLE_ADD_ROW_FOR_TABLE').LIST_OF_ITEMS.map((element) => {
        // Disable add button for some grids defined in disableAddRowConfig
        if (id === element.TABLE) {
          this.insertNewRow = null
          this.customButton = null
          toggleCustomButton = false
        }
      })
      if (gridType && gridType === 'LIKE') {
        gridTypeCall = 'GET_TABLE_WITH_LIKE_FILTER'
      }

      gridParams.push({
        PARAM_NAME: 'objectName',
        PARAM_VALUE: props.gridToDisplay
      }, {
        PARAM_NAME: 'gridConfigWeWant',
        PARAM_VALUE: props.gridToDisplay
      }, {
        PARAM_NAME: 'searchBy',
        PARAM_VALUE: filterBy
      }, {
        PARAM_NAME: 'svSession',
        PARAM_VALUE: props.session
      }, {
        PARAM_NAME: 'searchForValue',
        PARAM_VALUE: filterVals
      }, {
        PARAM_NAME: 'rowlimit',
        PARAM_VALUE: 10000
      }, {
        PARAM_NAME: 'parentColumn',
        PARAM_VALUE: props.parentColumn || 'null'
      }, {
        PARAM_NAME: 'parentId',
        PARAM_VALUE: props.parentId || 'null'
      }, {
        PARAM_NAME: 'criterumConjuction',
        PARAM_VALUE: props.criterumConjuction || 'null'
      })
      renderGrid = GridManager.generateGridWithCustomSize(
        filterBy + filterVals + id, id, 'CUSTOM_GRID',
        gridTypeCall, gridParams, 'CUSTOM', this.onRowSelect, null, enableMultiSelect, onSelectChangeFunct, gridHeight, gridWidth, toggleCustomButton, this.customButton
      )
    }

    ComponentManager.setStateForComponent(
      id, null,
      {
        onRowClickFunct: this.onRowSelect,
        toggleCustomButton,
        customButton: this.customButton
      }
    )
    this.setState({ renderGrid })
  }

  onRowSelect (gridId, rowIdx, row) {
    if (this.props.onRowSelectProp instanceof Function) {
      this.props.onRowSelectProp()
    } else {
      console.warn('onRowSelectProp is defined but its not a function')
    }
  }

  render () {
    return (
      <div>
        {this.props.id && this.state.renderGrid}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  session: state.security.svSession
})

export default connect(mapStateToProps)(ResultsGrid)
