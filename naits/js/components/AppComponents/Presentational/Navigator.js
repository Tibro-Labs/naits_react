import React from 'react'
import style from './Navigator.module.css'
import { store } from 'tibro-redux'
import createHashHistory from 'history/createHashHistory'
import { selectObject } from 'functions/utils'

function navigateToPreviousObejct (hashHistory) {
  const objectHierarchy = store.getState().gridConfig.gridHierarchy
  let currentActiveObjectPosition
  for (let i = 0; i < objectHierarchy.length; i++) {
    if (objectHierarchy[i].active) {
      currentActiveObjectPosition = i
      break
    }
  }
  let objectToNavigateTo
  if (objectHierarchy.length > 1) {
    if (currentActiveObjectPosition === 0) {
      objectToNavigateTo = undefined
    } else {
      objectToNavigateTo = objectHierarchy[currentActiveObjectPosition - 1].gridId
    }
  }
  if (!objectToNavigateTo) {
    hashHistory.goBack()
  } else {
    selectObject(objectToNavigateTo)
  }
}

function navigateToNextObejct (hashHistory) {
  const objectHierarchy = store.getState().gridConfig.gridHierarchy
  let currentActiveObjectPosition
  for (let i = 0; i < objectHierarchy.length; i++) {
    if (objectHierarchy[i].active) {
      currentActiveObjectPosition = i
      break
    }
  }
  let objectToNavigateTo
  if (objectHierarchy.length > 1) {
    if (currentActiveObjectPosition === objectHierarchy.length - 1) {
      objectToNavigateTo = undefined
    } else {
      objectToNavigateTo = objectHierarchy[currentActiveObjectPosition + 1].gridId
    }
  }
  if (objectToNavigateTo) {
    selectObject(objectToNavigateTo)
  }
}

export default class Navigator extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      prevOrNextArrowClassname: ''
    }
    this.hashHistory = createHashHistory()
  }

  animateArrow = prevOrNext => () => {
    this.setState(
      { prevOrNextArrowClassname: prevOrNext },
      () => setTimeout(
        () => {
          this.setState({ prevOrNextArrowClassname: '' })
          if (prevOrNext === style['transition-prev']) {
            navigateToPreviousObejct(this.hashHistory)
          } else if (prevOrNext === style['transition-next']) {
            navigateToNextObejct(this.hashHistory)
          }
        },
        400
      )
    )
  }

  render () {
    return (
      <div className={`${style.navigator} ${this.state.prevOrNextArrowClassname}`}>
        <svg
          className={`${style.svgShadow} ${style.btn} ${style['btn--prev']}`}
          onClick={this.animateArrow(style['transition-prev'])}
          height='96'
          viewBox='0 0 24 24'
          width='96'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path d='M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z' />
          <path d='M0-.5h24v24H0z' fill='none' />
        </svg>

        <div className={style['pagination-container']}>
          <div className={`${style['little-dot']} ${style['little-dot--first']}`} />
          <div className={style['little-dot']}>
            <div className={style['big-dot-container']}>
              <div className={style['big-dot']} />
            </div>
          </div>
          <div className={`${style['little-dot']} ${style['little-dot--last']}`} />
        </div>

        <svg
          className={`${style.svgShadow} ${style.btn} ${style['btn--next']}`}
          onClick={this.animateArrow(style['transition-next'])}
          height='96'
          viewBox='0 0 24 24'
          width='96'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path d='M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z' />
          <path d='M0-.25h24v24H0z' fill='none' />
        </svg>
      </div>
    )
  }
}
