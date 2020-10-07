/**
 *
 * @param {String} path
 * @param {Object} props
 */
export const replacePathParams = (path, props) => {
  let strArr = path.split('/')
  for (let i = 0; i < strArr.length; i++) {
    if (isUrlParam(strArr[i])) {
      let paramName = strArr[i].slice(1, -1)
      let paramVal = access(props, paramName)

      paramVal && (strArr[i] = paramVal)
    }
  }
  path = strArr.join('/')

  return path
}

/**
 *
 * @param {String} str
 */
export const isUrlParam = (str) => {
  if (str.charAt(0) === '{' && str.charAt(str.length - 1) === '}') {
    return true
  }
  return false
}

/**
 *
 */
export const getBaseHeight = () => {
  let winHeight = window.innerHeight
  let mmHeight
  if (window.document.getElementById('main_menu_div') && window.document.getElementById('main_menu_div').clientHeight) {
    mmHeight = (window.document.getElementById('main_menu_div').clientHeight / winHeight) * 100
  }
  let footHeight
  if (window.document.getElementById('footer') && window.document.getElementById('footer').clientHeight) {
    footHeight = (window.document.getElementById('footer').clientHeight / winHeight) * 100
  }

  let hCalc = 100 - (mmHeight + footHeight)
  let hRound = hCalc.toFixed(3)
  let H = String(hRound) + 'vh'
  // add dispatcher , set height to redux state
  return H
}

/**
 *
 * @param {String} type
 * @param {Object} data
 */
export const prepareRootObject = (type, data) => {
  let rootObj = {}
  rootObj['type'] = type

  Object.keys(data).map(key => {
    let rootKey = key.replace(type + '.', '')
    rootObj[rootKey.toLowerCase()] = data[key]
  })

  return rootObj
}

/**
 * Access `obj` by string `path`.
 *
 * Supports nested structures.
 * Supports dot and bracket notation.
 * Removes string blank spaces.
 *
 * &nbsp;
 *
 * @function access (path: string, obj: Object): obj.path || undefined
 *
 * @param {Object} obj - Object to access.
 * @param {string} path - Accessor path, represented as string.
 *
 * @returns obj.path || undefined;
 */
export function access (obj, path) {
  return path
    .replace(/\[([^\]]+)]/g, '.$1') // support dot(.) and bracket([]) accessors
    .split('.') // init array on accessing elements
    .filter(s => s) // remove blanks
    .reduce((k, v) => k && k[v], obj) // support nested, null check on accessing keys
}
