import * as config from 'config/config.js'

export function dropdownConfig (requestedDropdown, context) {
  const dropdownTypes = {
    ANIMAL_CATEGORY_DROPDOWN: {
      '1': { LABEL: `${config.labelBasePath}.main.cattle` },
      '2': { LABEL: `${config.labelBasePath}.main.buffalo` },
      '9': { LABEL: `${config.labelBasePath}.main.sheep` },
      '10': { LABEL: `${config.labelBasePath}.main.goat` },
      '11': { LABEL: `${config.labelBasePath}.main.pig` },
      '12': { LABEL: `${config.labelBasePath}.main.horse` },
      '400': { LABEL: `${config.labelBasePath}.main.donkey` }
    },

    GENDER_DROPDOWN: {
      '1': { LABEL: `${config.labelBasePath}.main.female` },
      '2': { LABEL: `${config.labelBasePath}.main.male` }
    },

    YES_NO_DROPDOWN: {
      '1': { LABEL: `${config.labelBasePath}.main.yes` },
      '2': { LABEL: `${config.labelBasePath}.main.no` }
    },

    TAG_TYPE_DROPDOWN: {
      '1': { LABEL: `${config.labelBasePath}.main.cattle_ear_tag` },
      '2': { LABEL: `${config.labelBasePath}.main.small_ruminants` },
      '3': { LABEL: `${config.labelBasePath}.main.sheep_tag` },
      '4': { LABEL: `${config.labelBasePath}.main.pig_tag` }
    },

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
    ]
  }

  return dropdownTypes[requestedDropdown]
}
