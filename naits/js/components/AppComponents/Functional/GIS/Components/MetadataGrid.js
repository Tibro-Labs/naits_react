import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { GridManager } from '../../../../ComponentsIndex'

class MetadataGrid extends React.Component {
    static propTypes = {
      token: PropTypes.string.isRequired, // eslint-disable-line
      geomId: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
      geomTable: PropTypes.string,
      geomParentId: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]) // eslint-disable-line
    }
    constructor (props) {
      super(props)
      this.state = {
        gridId: String(this.props.geomTable + '_METADATA_GRID_' + (this.props.geomId || '')),
        content: null
      }
      // grid arguments builder
      this.gridProps = (function (ref) {
        // ref super class
        const { token, geomId, geomTable } = ref.props
        const { gridId } = ref.state
        // hardcode, why not
        const keys = ['session', 'gridConfigWeWant', 'parentId', 'objectType', 'linkName', 'rowlimit']

        function _init () {
          // set user specified properties, then template
          [...arguments].length > 1 && this.push([...arguments])
          _setProperties.call(this)

          return this
        }

        // Takes an arguments list of string and sets them as keys in a parameter Object {PARAM_NAME: key, PARAM_VALUE: null}
        // Structure specified and required by grid module, unfortunately
        function _buildParams () {
          return [...arguments].map(key => Object.assign({}, {PARAM_NAME: key, PARAM_VALUE: null}))
        }

        // Do not bind in constructor, invoke with .call to give context or bind your own params instance
        // values assigned by args index, pay attention of order in call i.e match value order to your params instance keys
        function _setParams () {
          this.map((el, i) => { el.PARAM_VALUE = [...arguments][i] })
          return this
        }

        function _setProperties () {
          // Show incoming/arrived animals || quarantined holding
          // build parameters array[...Objects], set keys in builder, values as arguments
          let params = (geomTable === 'HOLDING')
            ? _setParams.call(_buildParams(...keys), token, 'ANIMAL_MOVEMENT', geomId, 'ANIMAL_MOVEMENT', 'ANIMAL_MOVEMENT_HOLDING', 10000)
            : _setParams.call(_buildParams(...keys), token, 'HOLDING', geomId, 'HOLDING', 'HOLDING_QUARANTINE', 10000)

          return this.push(gridId, gridId, 'CUSTOM_GRID', 'GET_BYLINK', params, 'CUSTOM', null, null)
        }

        return {
          // added optional properties param to builder,
          // allow possibility to specify own props in componentDidMount || on runtime changes
          build: (options = []) => {
            return _init.call([], options)
          }
        }
      })(this)

      this.generateGrid = this.generateGrid.bind(this)
    }

    generateGrid () {
      // Manager checks if component exists and is registered with redux, just call, keep data fresh!
      GridManager.reloadGridData(this.state.gridId)

      let content = GridManager.generateGrid.apply(null, this.gridProps.build())
      this.setState({content: content})
    }

    componentDidMount () {
      this.generateGrid()
    }

    render () {
      return <div id='gisGrid' className='mapContainer' style={{fontSize: '30px', textAlign: 'center', color: 'rgb(249, 235, 210)', overflow: 'auto'}}>
        {this.state.content}
      </div>
    }
}

const mapStateToProps = (state, ownProps) => {
  const { data } = state.gis
  return {
    token: state.security.svSession,
    geomId: data.geomId,
    geomTable: data.geomTable,
    geomParentId: data.geomParentId
  }
}

export default connect(mapStateToProps)(MetadataGrid)
