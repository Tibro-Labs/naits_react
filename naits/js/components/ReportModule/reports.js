import * as config from 'config/config'

export const villageSpecificReports = {
  'printItemStatusUpdate': {
    id: 'printItemStatusUpdate',
    reportName: 'StatusUpdatePrintoutWrapper',
    labelCode: config.labelBasePath + '.main.status_update_print_village',
    datesEnabled: false,
    additionalParams: ['VACCINATION_EVENT']
  },
  'animal_born': {
    id: 'animal_born',
    reportName: 'animal_born',
    labelCode: config.labelBasePath + '.main.animal_born',
    datesEnabled: true
  },
  'animal_death': {
    id: 'animal_death',
    reportName: 'animal_death',
    labelCode: config.labelBasePath + '.main.animal_death',
    datesEnabled: true
  },
  'animal_moveon': {
    id: 'animal_moveon',
    reportName: 'animal_moveon',
    labelCode: config.labelBasePath + '.main.animal_moveon',
    datesEnabled: true
  },
  'animal_moveoff': {
    id: 'animal_moveoff',
    reportName: 'animal_moveoff',
    labelCode: config.labelBasePath + '.main.animal_moveoff',
    datesEnabled: true
  },
  'animal_lost': {
    id: 'animal_lost',
    reportName: 'animal_lost',
    labelCode: config.labelBasePath + '.main.animal_lost',
    datesEnabled: true
  }
}

export const generalReports = {
  'holding_basic': {
    id: 'holding_basic',
    reportName: 'holding_basic',
    labelCode: config.labelBasePath + '.main.holding_basic',
    datesEnabled: false
  },
  /* 'selection_report': {
    id: 'selection_report',
    reportName: 'selection_report',
    labelCode: config.labelBasePath + '.main.selection_report',
    datesEnabled: false
  }, */
  'ahsm_areas': {
    id: 'ahsm_areas',
    reportName: 'ahsm_areas',
    labelCode: config.labelBasePath + '.print.ahsm_areas',
    datesEnabled: false
  },
  'registred_ranges': {
    id: 'registred_ranges',
    reportName: 'registred_ranges',
    labelCode: config.labelBasePath + '.print.registred_ranges',
    datesEnabled: false
  }
}

export const generalBlankReports = {
  'AS_empty_form_V2_-_30.08.2019.pdf': {
    id: 'AS_empty_form_V2_-_30.08.2019.pdf',
    reportName: 'AS_empty_form_V2_-_30.08.2019.pdf',
    labelCode: config.labelBasePath + '.main.AS_empty_form_V2_-_30.08.2019.pdf',
    datesEnabled: false
  },
  'Farm_register_v0.2.pdf': {
    id: 'Farm_register_v0.2.pdf',
    reportName: 'Farm_register_v0.2.pdf',
    labelCode: config.labelBasePath + '.main.Farm_register_v0.2.pdf',
    datesEnabled: false
  }
}
