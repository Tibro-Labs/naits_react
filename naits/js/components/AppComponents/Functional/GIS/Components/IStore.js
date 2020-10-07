import React from 'react'
import { ComponentManager } from 'components/ComponentsIndex'
import {store, setGisData, setGisGeometry, setGisInventory} from 'tibro-redux'

export default class IStore extends React.Component {
  /**
   *
   */
  static getGisStore () {
    return store.getState().gis || null
  }

  /**
   *
   * @param {String} key
   */
  static getData (key) {
    const { data } = IStore.getGisStore()
    return data ? data[key] : null
  }

  /**
   *
   * @param {Object} data
   */
  static setData (data) {
    return store.dispatch(setGisData(Object.assign({}, data)))
  }

  /**
   *
   * @param {String} componentId
   * @param {String} key
   */
  static getComponentData (componentId, key) {
    return (((store.getState() || {})[componentId] || {})[key] || {})
  }

  /**
   *
   * @param {String} componentId
   * @param {Object} props
   */
  static setComponentData (componentId, props) {
    if (ComponentManager.isComponentRegistered(componentId)) { // && props instanceof Object
      Object.keys(props).map((key) =>
        ComponentManager.setStateForComponent(componentId, key, props[key])
      )
    }
  }

  /**
   *
   * @param {String} key
   */
  static getGeometry (key) {
    const { geometry } = IStore.getGisStore()
    return geometry[key] || null
  }

  /**
   *
   * @param {*} action
   * @param {*} key
   * @param {*} geometry
   * @param {*} config
   */
  static setGeometry (action, key, geometry, config) {
    return store.dispatch(setGisGeometry(action, key, geometry, config))
  }

  /**
   *
   */
  static getInventory () {
    return IStore.getGisStore().inventory
  }

  static setInventory (data) {
    return store.dispatch(setGisInventory(data))
  }

  /**
   *
   * @param {String} id
   */
  static getServicePath (id) {
    const {gis: {service}} = store.getState()

    return id ? service[id] : (service.base || null)
  }

  render () { return null }
}
