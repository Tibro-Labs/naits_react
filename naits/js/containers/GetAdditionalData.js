import React from 'react'
import { store } from 'tibro-redux'
import { getAdditionalHoldingData, getObjectSummary } from 'backend/additionalDataActions'
import { connect } from 'react-redux'

class GetAdditionalData extends React.Component {
  componentDidMount () {
    this.fetchData(this.props)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.gridType !== nextProps.gridType) {
      this.fetchData(nextProps)
    }

    if (this.props.linkedOwnerToPet !== nextProps.linkedOwnerToPet) {
      this.fetchData(nextProps)
    }

    if (this.props.populationHasBeenUpdated !== nextProps.populationHasBeenUpdated) {
      this.fetchData(nextProps)
    }

    if (this.props.populationStatusHasBeenUpdated !== nextProps.populationStatusHasBeenUpdated) {
      this.fetchData(nextProps)
    }
  }

  fetchData (props) {
    const generatedGrids = props.gridHierarchy
    const session = props.svSession
    generatedGrids.map(grid => {
      if (grid.active) {
        const elementId = grid.row[`${props.gridType}.OBJECT_ID`]
        store.dispatch(getObjectSummary(session, props.gridType, elementId))
        switch (props.gridType) {
          case 'HOLDING': {
            store.dispatch(getAdditionalHoldingData(session, elementId))
            break
          }
        }
      }
    })
  }

  render () {
    return this.props.children
  }
}

const mapStateToProps = (state) => ({
  gridHierarchy: state.gridConfig.gridHierarchy,
  linkedOwnerToPet: state.linkedObjects.linkedOwnerToPet,
  populationHasBeenUpdated: state.additionalData.populationHasBeenUpdated,
  populationStatusHasBeenUpdated: state.updatePopulationStatus.populationStatusHasBeenUpdated
})

export default connect(mapStateToProps)(GetAdditionalData)
