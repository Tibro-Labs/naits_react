let server
if (window.location.hostname === 'localhost') {
  // server = window.location.protocol + '//localhost:9091/triglav_rest'
  server = `${window.location.protocol}//192.168.100.155:8025/triglav_rest`
} else {
  server = `${window.location.protocol}/triglav_rest`
}

export const gisConfig = {
  MAP_SERVICE: {
    restUrl: [server],
    SDI_UNITS: '/SDI/pbf/bbox/generic/{svSession}/svarog_sdi_units/{bbox}',
    SDI_PROSPECTING: '/SDI/pbf/bbox/{svSession}/minerals_sdi_prospecting/{bbox}',
    SDI_LAYERS: '/SDI/pbf/bbox/{svSession}/minerals_sdi_all_layers/{bbox}',
    LAYER_LIST: '/SDI/layerList/{sessionId}/{parentId}/{childTypeName}',
    POLY_RELATIONS_JSON: '/SDI/json/checkRelations/{svSession}/{objIdPrim}/minerals_sdi_all_layers/{relationType}',
    POLY_RELATIONS_PBF: '/SDI/pbf/checkRelations/{svSession}/{objIdPrim}/minerals_sdi_all_layers/{relationType}',
    UPDATE_POLY: '/SDI/updatePoly/{svSession}/{objectId}/{pkid}/{objectType}',
    SPLIT_POLY: '/SDI/splitPoly/{svSession}/{objectId}/{pkid}/{objectType}',
    GET_BBOX_BY_POLY_ID: '/SDI/getBBoxByPolyId/{svSession}/{objectId}/{objectType}'
  },

  MAP_DATA: {
    EPSG: 'EPSG:6316',
    EPSG_LBN: 'EPSG:22700',
    PROJ_LBN: '+proj=lcc +lat_1=34.65 +lat_0=34.65 +lon_0=37.35 +k_0=0.9996256 +x_0=300000 +y_0=300000 +a=6378249.2 +b=6356515 +towgs84=-190.421,8.532,238.69,0,0,0,0 +units=m +no_defs',
    PROJ: '+proj=tmerc +lat_0=0 +lon_0=21 +k=0.9999 +x_0=7500000 +y_0=0 +ellps=bessel +towg' + 's84=682,-203,480,0,0,0,0 +units=m +no_defs',
    SYSBOUNDS: { southWest: { x: 86367.0, y: 125793.0 }, northEast: { x: 237450.0, y: 307854.0 } }, // Lebanon approximation bbox, northeast is actually in Hors, Syria
    USER_SCALES: [
      10000000, // 100 km
      7500000,
      5000000,
      2500000,
      1000000, // 10 km
      750000,
      500000,
      250000,
      100000, // 1000m or 1 km
      75000,
      50000,
      25000,
      10000, // 100m
      7500,
      5000,
      2500,
      1000, // 1000 cm = 10 m
      750,
      500,
      250,
      100 // 1m
    ],
    CRS_OPTS: {
      resolutions: [
        2800,
        1400,
        700,
        350,
        175,
        84,
        42,
        21,
        11.2,
        5.6,
        2.8,
        1.4,
        0.7,
        0.35,
        0.14,
        0.07
      ]
    }
  },

  LAYER_LABELS: {
    1: 'Wheat',
    2: 'Corn',
    201: 'Greenhouses',
    301: 'Pastures',
    302: 'Meadows',
    303: 'Natural grassland',
    401: 'Vineyard',
    402: 'Other shrub crops',
    420: 'Fruit tree orchard',
    440: 'Nut tree orchard',
    460: 'Citrus tree orchard',
    501: 'Mixed land use',
    502: 'Nut tree orchard',
    800: 'Animal holding',
    900: 'Non-eligible land use',
    400: 'Permanent crops',
    200: 'Arable land'
  },

  LAYER_STYLES: {
    1: {
      weight: 1.00,
      color: '#e2e200',
      fillColor: '#ffff8f',
      dashArray: '',
      lineCap: 'square',
      lineJoin: 'bevel',
      opacity: 1.0,
      fillOpacity: 0.5
    },
    2: {
      weight: 1.00,
      color: '#89d800',
      fillColor: '#baff43',
      dashArray: '',
      lineCap: 'square',
      lineJoin: 'bevel',
      opacity: 1.0,
      fillOpacity: 0.5
    },
    201: {
      weight: 1.00,
      color: '#00d64e',
      fillColor: '#65ff9e',
      dashArray: '',
      lineCap: 'square',
      lineJoin: 'bevel',
      opacity: 1.0,
      fillOpacity: 0.5
    },
    301: {
      weight: 1.00,
      color: '#001006',
      fillColor: '#00441c',
      dashArray: '',
      lineCap: 'square',
      lineJoin: 'bevel',
      opacity: 1.0,
      fillOpacity: 0.5
    },
    302: {
      weight: 1.00,
      color: '#00620e',
      fillColor: '#aaff79',
      dashArray: '',
      lineCap: 'square',
      lineJoin: 'bevel',
      opacity: 1.0,
      fillOpacity: 0.5
    },
    303: {
      weight: 1.00,
      color: '#008a7c',
      fillColor: '#a3fff6',
      dashArray: '',
      lineCap: 'square',
      lineJoin: 'bevel',
      opacity: 1.0,
      fillOpacity: 0.5
    },
    401: {
      weight: 1.00,
      color: '#60005d',
      fillColor: '#ffa9fb',
      dashArray: '',
      lineCap: 'square',
      lineJoin: 'bevel',
      opacity: 1.0,
      fillOpacity: 0.5
    },
    402: {
      weight: 1.00,
      color: '#000f64',
      fillColor: '#99a7ff',
      dashArray: '',
      lineCap: 'square',
      lineJoin: 'bevel',
      opacity: 1.0,
      fillOpacity: 0.5
    },
    420: {
      weight: 1.00,
      color: '#c43100',
      fillColor: '#ffa283',
      dashArray: '',
      lineCap: 'square',
      lineJoin: 'bevel',
      opacity: 1.0,
      fillOpacity: 0.5
    },
    440: {
      weight: 1.00,
      color: '#c46c00',
      fillColor: '#ffb963',
      dashArray: '',
      lineCap: 'square',
      lineJoin: 'bevel',
      opacity: 0.8,
      fillOpacity: 0.2
    },
    460: {
      weight: 1.00,
      color: '#f0e400',
      fillColor: '#fff75d',
      dashArray: '',
      lineCap: 'square',
      lineJoin: 'bevel',
      opacity: 0.8,
      fillOpacity: 0.2
    },
    501: {
      weight: 1.00,
      color: '#e6b100',
      fillColor: '#ffdb63',
      dashArray: '',
      lineCap: 'square',
      lineJoin: 'bevel',
      opacity: 0.8,
      fillOpacity: 0.2
    },
    502: {
      weight: 1.00,
      color: '#724e00',
      fillColor: '#b47b00',
      dashArray: '',
      lineCap: 'square',
      lineJoin: 'bevel',
      opacity: 0.8,
      fillOpacity: 0.2
    },
    900: {
      weight: 1.00,
      color: '#a01800',
      fillColor: '#ff8069',
      dashArray: '',
      lineCap: 'square',
      lineJoin: 'bevel',
      opacity: 0.8,
      fillOpacity: 0.2
    },
    400: {
      weight: 1.00,
      color: '#00620e',
      fillColor: '#baffa1',
      dashArray: '',
      lineCap: 'square',
      lineJoin: 'bevel',
      opacity: 1.0,
      fillOpacity: 0.5
    },
    200: {
      weight: 1.00,
      color: '#ffb301',
      fillColor: '#fcff99',
      dashArray: '',
      lineCap: 'square',
      lineJoin: 'bevel',
      opacity: 1.0,
      fillOpacity: 0.5
    },
    parcel: {
      weight: 1.00,
      color: '#000000',
      fillColor: '#eeeeee',
      dashArray: '',
      lineCap: 'square',
      lineJoin: 'bevel',
      opacity: 1.0,
      fillOpacity: 0.5
    },
    selected_poly: {
      weight: 1.04,
      color: '#016bff',
      fillColor: '#79caff',
      dashArray: '',
      lineCap: 'square',
      lineJoin: 'bevel',
      opacity: 0.5,
      fillOpacity: 0.5
    }
  },

  MEASURE_BUTTONS: [
    /* {ID: 'ZOOM_TO_LAYER', CLASS: 'btn btn-default', VALUE: '', DATA_TIP: 'Zoom to layer', DATA_EFFECT: 'float', FUNCTION: 'navigation', LABEL: '', ICON_TYPE: 'zoomMe'}, */
    {
      ID: 'CALCULATE_DISTANCE', CLASS: 'btn btn-default', VALUE: 'modeToggle', DATA_TIP: 'Measure length', DATA_EFFECT: 'float', FUNCTION: 'measure', LABEL: '', ICON_TYPE: 'measureDistance'
    },
    {
      ID: 'CALCULATE_AREA', CLASS: 'btn btn-default', VALUE: 'modeToggle', DATA_TIP: 'Measure area', DATA_EFFECT: 'float', FUNCTION: 'measure', LABEL: '', ICON_TYPE: 'measureArea'
    },
    {
      ID: 'DELETE_MEASURE_LAYER', CLASS: 'btn btn-default', VALUE: '', DATA_TIP: 'Remove measurements', DATA_EFFECT: 'float', FUNCTION: 'measure', LABEL: '', ICON_TYPE: 'deleteMeasure'
    }
  ],
  /*
  RELATION_BUTTONS: [
        {ID: 'CHECK_INTERSECTION', CLASS: 'btn btn-default', VALUE: '', DATA_TIP: 'Check Intersects', DATA_EFFECT: 'float', FUNCTION: 'relations', LABEL: '', ICON_TYPE: 'intersectionIcon', RELATION_TYPE: 'INTERSECTS', SWITCH_CALL: 'CHECK_RELATIONS'},
        {ID: 'CHECK_CONTAINS', CLASS: 'btn btn-default', VALUE: 'modeToggle', DATA_TIP: 'Check Contains', DATA_EFFECT: 'float', FUNCTION: 'relations', LABEL: '', ICON_TYPE: 'containsIcon', RELATION_TYPE: 'CONTAINS', SWITCH_CALL: 'CHECK_RELATIONS'},
        {ID: 'CHECK_OVERLAPS', CLASS: 'btn btn-default', VALUE: 'modeToggle', DATA_TIP: 'Check Overlap', DATA_EFFECT: 'float', FUNCTION: 'relations', LABEL: '', ICON_TYPE: 'overlapsIcon', RELATION_TYPE: 'OVERLAPS', SWITCH_CALL: 'CHECK_RELATIONS'},
        {ID: 'CHECK_TOUCHES', CLASS: 'btn btn-default', VALUE: '', DATA_TIP: 'Check Touch', DATA_EFFECT: 'float', FUNCTION: 'relations', LABEL: '', ICON_TYPE: 'touchIcon', RELATION_TYPE: 'TOUCHES', SWITCH_CALL: 'CHECK_RELATIONS'},
        {ID: 'CANCEL_EDIT_RELATION', CLASS: 'btn btn-default', VALUE: '', DATA_TIP: 'Cancel check relations', DATA_EFFECT: 'float', FUNCTION: 'relations', LABEL: '', ICON_TYPE: 'cancelEditIcon', RELATION_TYPE: '', SWITCH_CALL: 'CANCEL_EDIT_RELATION'},
        {ID: 'UPDATE_POLY', CLASS: 'btn btn-default', VALUE: '', DATA_TIP: 'Save relations result', DATA_EFFECT: 'float', FUNCTION: 'relations', LABEL: '', ICON_TYPE: 'updatePolyIcon', RELATION_TYPE: '', SWITCH_CALL: 'UPDATE_POLY'}
  ],
*/
  /*
  OPERATIONS_BUTTONS: [
        {ID: 'SPLIT_POLY', CLASS: 'btn btn-default', VALUE: '', DATA_TIP: 'Split Polygon', DATA_EFFECT: 'float', FUNCTION: 'operations', LABEL: '', ICON_TYPE: 'splitPolyIcon', OPERATION_TYPE: 'SPLIT_POLY'},
        {ID: 'MERGE_POLY', CLASS: 'btn btn-default', VALUE: '', DATA_TIP: 'Merge polygon', DATA_EFFECT: 'float', FUNCTION: 'operations', LABEL: '', ICON_TYPE: 'mergePolyIcon', OPERATION_TYPE: 'MERGE_POLY'}
  ],
*/
  PARCEL_BUTTONS: [
    {
      ID: 'ADD_PARCEL', CLASS: 'btn btn-default', VALUE: '', DATA_TIP: 'Add Parcel', DATA_EFFECT: 'float', FUNCTION: 'parcelFunc', LABEL: '', ICON_TYPE: 'addParcelIcon', OPERATION_TYPE: 'ADD_PARCEL'
    },
    /* {ID: 'REMOVE_PARCEL', CLASS: 'btn btn-default', VALUE: '', DATA_TIP: 'Remove Parcel', DATA_EFFECT: 'float', FUNCTION: 'parcelFunc', LABEL: '', ICON_TYPE: 'removeParcelIcon', OPERATION_TYPE: 'REMOVE_PARCEL'}, */
    {
      ID: 'ZOOM_PARCEL', CLASS: 'btn btn-default', VALUE: '', DATA_TIP: 'Zoom to Parcel', DATA_EFFECT: 'float', FUNCTION: 'parcelFunc', LABEL: '', ICON_TYPE: 'zoomParcelIcon', OPERATION_TYPE: 'ZOOM_PARCEL'
    },
    {
      ID: 'REFRESH_PARCEL', CLASS: 'btn btn-default', VALUE: '', DATA_TIP: 'Refresh Parcel List', DATA_EFFECT: 'float', FUNCTION: 'refreshParcel', LABEL: '', ICON_TYPE: 'refreshParcelIcon', OPERATION_TYPE: 'REFRESH_PARCEL'
    }
  ],

  COVER_BUTTONS: [
    {
      ID: 'ADD_COVER', CLASS: 'btn btn-default', VALUE: '', DATA_TIP: 'Add Cover', DATA_EFFECT: 'float', FUNCTION: 'coverFunc', LABEL: '', ICON_TYPE: 'addParcelIcon', OPERATION_TYPE: 'ADD_COVER'
    },
    /* {ID: 'REMOVE_COVER', CLASS: 'btn btn-default', VALUE: '', DATA_TIP: 'Remove Cover', DATA_EFFECT: 'float', FUNCTION: 'coverFunc', LABEL: '', ICON_TYPE: 'removeParcelIcon', OPERATION_TYPE: 'REMOVE_COVER'}, */
    {
      ID: 'ZOOM_COVER', CLASS: 'btn btn-default', VALUE: '', DATA_TIP: 'Zoom to Cover', DATA_EFFECT: 'float', FUNCTION: 'coverFunc', LABEL: '', ICON_TYPE: 'zoomParcelIcon', OPERATION_TYPE: 'ZOOM_COVER'
    },
    {
      ID: 'REFRESH_COVER', CLASS: 'btn btn-default', VALUE: '', DATA_TIP: 'Refresh Cover List', DATA_EFFECT: 'float', FUNCTION: 'refreshCover', LABEL: '', ICON_TYPE: 'refreshCoverIcon', OPERATION_TYPE: 'REFRESH_COVER'
    }
  ],

  POLY_TABLE: {
    NAME: 'MINERALS_SDI_ALL_LAYERS'
  }

}
