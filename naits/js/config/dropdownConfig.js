import * as config from 'config/config.js'

export function dropdownConfig (requestedDropdown) {
  const dropdownTypes = {
    ANIMAL_CLASSES_DROPDOWN: [
      { LABEL: `${config.labelBasePath}.main.cattle`, VALUE: '1' },
      { LABEL: `${config.labelBasePath}.main.buffalo`, VALUE: '2' },
      { LABEL: `${config.labelBasePath}.main.sheep`, VALUE: '9' },
      { LABEL: `${config.labelBasePath}.main.goat`, VALUE: '10' },
      { LABEL: `${config.labelBasePath}.main.pig`, VALUE: '11' },
      { LABEL: `${config.labelBasePath}.main.horse`, VALUE: '12' },
      { LABEL: `${config.labelBasePath}.main.donkey`, VALUE: '400' }
    ],

    MONTHS_DROPDOWN: [
      { LABEL: `${config.labelBasePath}.main.month_01`, VALUE: '01' },
      { LABEL: `${config.labelBasePath}.main.month_02`, VALUE: '02' },
      { LABEL: `${config.labelBasePath}.main.month_03`, VALUE: '03' },
      { LABEL: `${config.labelBasePath}.main.month_04`, VALUE: '04' },
      { LABEL: `${config.labelBasePath}.main.month_05`, VALUE: '05' },
      { LABEL: `${config.labelBasePath}.main.month_06`, VALUE: '06' },
      { LABEL: `${config.labelBasePath}.main.month_07`, VALUE: '07' },
      { LABEL: `${config.labelBasePath}.main.month_08`, VALUE: '08' },
      { LABEL: `${config.labelBasePath}.main.month_09`, VALUE: '09' },
      { LABEL: `${config.labelBasePath}.main.month_10`, VALUE: '10' },
      { LABEL: `${config.labelBasePath}.main.month_11`, VALUE: '11' },
      { LABEL: `${config.labelBasePath}.main.month_12`, VALUE: '12' }
    ],

    GENDER_DROPDOWN: [
      { LABEL: `${config.labelBasePath}.main.male`, VALUE: '1' },
      { LABEL: `${config.labelBasePath}.main.female`, VALUE: '2' }
    ]
  }

  return dropdownTypes[requestedDropdown]
}
