import * as config from 'config/config.js'

export function searchCriteriaConfig (requestedCriteria) {
  const criteriaTypes = {
    // Global search refers only to the serach field in the main screen - radial menu
    GLOBAL_SEARCH: [
      {
        TABLE: 'ANIMAL',
        CRITERIA: ['ANIMAL_ID']
      },
      {
        TABLE: 'HOLDING',
        CRITERIA: ['NAME', 'PIC', 'PHYSICAL_ADDRESS']
      },
      {
        TABLE: 'HOLDING_RESPONSIBLE',
        CRITERIA: ['NAT_REG_NUMBER', 'FIRST_NAME', 'LAST_NAME', 'FULL_NAME', 'PHONE_NUMBER']
      },
      {
        TABLE: 'QUARANTINE',
        CRITERIA: ['REASON', 'QUARANTINE_ID', 'QUARANTINE_TYPE']
      },
      {
        TABLE: 'PET',
        CRITERIA: ['PET_ID']
      }
    ],

    SEARCH_CRITERIA_FOR_TABLE: {
      LIST_OF_ITEMS: [
        {
          TABLE: 'ANIMAL',
          CRITERIA: [
            { CODE: 'ANIMAL_ID', LABEL: `${config.labelBasePath}.main.search.by_animal_id` },
            { CODE: 'BAR_CODE_ID', LABEL: `${config.labelBasePath}.main.search.by_bar_code` },
            { CODE: 'OLD_EAR_TAG', LABEL: `${config.labelBasePath}.main.search.by_old_ear_tag` },
            { CODE: 'ANIMAL_STATUS', LABEL: `${config.labelBasePath}.main.animal_status` },
            { CODE: 'ANIMAL_CLASS', LABEL: `${config.labelBasePath}.main.search.by_animal_class` },
            { CODE: 'ANIMAL_RACE', LABEL: `${config.labelBasePath}.main.search.by_animal_breed` },
            { CODE: 'COLOR', LABEL: `${config.labelBasePath}.main.search.by_color` },
            { CODE: 'COUNTRY_OLD_ID', LABEL: `${config.labelBasePath}.main.search.country_old_id` },
            { CODE: 'COUNTRY', LABEL: `${config.labelBasePath}.main.search.country` }
          ],
          SELECTED: 'ANIMAL_ID'
        },
        {
          TABLE: 'PET',
          CRITERIA: [
            { CODE: 'PET_TAG_ID', LABEL: `${config.labelBasePath}.main.search.by_pet_tag_id` },
            { CODE: 'PET_ID', LABEL: `${config.labelBasePath}.main.search.by_pet_id` },
            { CODE: 'BADGE_NUMBER', LABEL: `${config.labelBasePath}.main.search.pet_badge_number` },
            { CODE: 'PEDIGREE_NUMBER', LABEL: `${config.labelBasePath}.main.search.pet_pedigree_number` },
            { CODE: 'TATTOO_NUMBER', LABEL: `${config.labelBasePath}.main.search.pet_tattoo_number` },
            { CODE: 'PET_TYPE', LABEL: `${config.labelBasePath}.main.search.pet_type` }
          ],
          SELECTED: 'PET_TAG_ID'
        },
        {
          TABLE: 'STRAY_PET',
          CRITERIA: [
            { CODE: 'PET_ID', LABEL: `${config.labelBasePath}.main.search.by_stray_pet_id` },
            { CODE: 'PET_TYPE', LABEL: `${config.labelBasePath}.main.search.stray_pet_type` }
          ],
          SELECTED: 'PET_ID'
        },
        {
          TABLE: 'HOLDING',
          CRITERIA: [
            { CODE: 'NAME', LABEL: `${config.labelBasePath}.main.search.by_holding_name` },
            { CODE: 'PIC', LABEL: `${config.labelBasePath}.main.search.by_holding_pic` },
            { CODE: 'APPROVAL_NUM', LABEL: `${config.labelBasePath}.grid_labels.holding.approval_num` },
            { CODE: 'VILLAGE_CODE', LABEL: `${config.labelBasePath}.main.search.by_geoastat_code` },
            { CODE: 'PHYSICAL_ADDRESS', LABEL: `${config.labelBasePath}.main.search.by_physical_address` }
          ],
          SELECTED: 'PIC'
        },
        {
          TABLE: 'HOLDING_RESPONSIBLE',
          CRITERIA: [
            { CODE: 'NAT_REG_NUMBER', LABEL: `${config.labelBasePath}.main.search.by_nat_reg_no` },
            { CODE: 'FIRST_NAME', LABEL: `${config.labelBasePath}.main.search.by_holding_resp_first_name` },
            { CODE: 'LAST_NAME', LABEL: `${config.labelBasePath}.main.search.by_holding_resp_last_name` },
            { CODE: 'FULL_NAME', LABEL: `${config.labelBasePath}.main.search.by_holding_resp_full_name` },
            { CODE: 'PHONE_NUMBER', LABEL: `${config.labelBasePath}.main.search.by_holding_resp_phone_no` },
            { CODE: 'VILLAGE_CODE', LABEL: `${config.labelBasePath}.main.search.by_geoastat_code` }
          ],
          SELECTED: 'NAT_REG_NUMBER'
        },
        {
          TABLE: 'VILLAGE',
          CRITERIA: [
            { CODE: 'REGION_CODE', LABEL: `${config.labelBasePath}.main.search.by_region_code` },
            { CODE: 'MUNIC_CODE', LABEL: `${config.labelBasePath}.main.search.by_munic_code` },
            { CODE: 'COMMUN_CODE', LABEL: `${config.labelBasePath}.main.search.by_commun_code` },
            { CODE: 'VILLAGE_CODE', LABEL: `${config.labelBasePath}.main.search.by_village_code` }
          ],
          SELECTED: 'VILLAGE_CODE'
        },
        {
          TABLE: 'CRITERIA_TYPE',
          CRITERIA: [
            { CODE: 'LABEL_CODE', LABEL: `${config.labelBasePath}.grid_labels.svarog_codes.label_code` }
          ],
          SELECTED: 'LABEL_CODE'
        },
        {
          TABLE: 'SVAROG_ORG_UNITS',
          CRITERIA: [
            { CODE: 'ORG_UNIT_TYPE', LABEL: `${config.labelBasePath}.main.search.by_org_unit_type` },
            { CODE: 'NAME', LABEL: `${config.labelBasePath}.main.search.by_name` },
            { CODE: 'VILLAGE_CODE', LABEL: `${config.labelBasePath}.main.search.by_geoastat_code` }
          ],
          SELECTED: 'ORG_UNIT_TYPE'
        },
        {
          TABLE: 'QUARANTINE',
          CRITERIA: [
            { CODE: 'QUARANTINE_TYPE', LABEL: `${config.labelBasePath}.main.search.by_type` },
            { CODE: 'QUARANTINE_ID', LABEL: `${config.labelBasePath}.main.search.by_quarantine_id` },
            { CODE: 'DATE_FROM', LABEL: `${config.labelBasePath}.main.search.by_date_from` },
            { CODE: 'DATE_TO', LABEL: `${config.labelBasePath}.main.search.by_date_to` },
            { CODE: 'REASON', LABEL: `${config.labelBasePath}.main.search.by_reason` }
          ],
          SELECTED: 'QUARANTINE_TYPE'
        },
        {
          TABLE: 'DISEASE',
          CRITERIA: [
            { CODE: 'DISEASE_NAME', LABEL: `${config.labelBasePath}.main.search.by_disease_name` },
            { CODE: 'DURATION', LABEL: `${config.labelBasePath}.main.search.duration` },
            { CODE: 'REASON', LABEL: `${config.labelBasePath}.main.search.by_reason` }
          ],
          SELECTED: 'DISEASE_NAME'
        },
        {
          TABLE: 'EXPORT_CERT',
          CRITERIA: [
            { CODE: 'EXP_CERTIFICATE_ID', LABEL: `${config.labelBasePath}.main.search.exp_certificate_id` },
            { CODE: 'TRANSPORT_TYPE', LABEL: `${config.labelBasePath}.main.search.transport_type` },
            { CODE: 'NAME_CONSIGNEE', LABEL: `${config.labelBasePath}.main.search.name_consignee` }
          ],
          SELECTED: 'EXP_CERTIFICATE_ID'
        },
        {
          TABLE: 'AREA',
          CRITERIA: [
            { CODE: 'AREA_TYPE', LABEL: `${config.labelBasePath}.main.search.by_area_type` },
            { CODE: 'AREA_NAME', LABEL: `${config.labelBasePath}.main.search.by_area_name` }
          ],
          SELECTED: 'AREA_TYPE'
        },
        {
          TABLE: 'POPULATION',
          CRITERIA: [
            { CODE: 'POPULATION_ID', LABEL: `${config.labelBasePath}.grid_labels.population.population_id` },
            { CODE: 'POPULATION_NAME', LABEL: `${config.labelBasePath}.main.population.population_name` },
            { CODE: 'POPULATION_TYPE', LABEL: `${config.labelBasePath}.main.population.population_type` },
            { CODE: 'EXTRACTION_TYPE', LABEL: `${config.labelBasePath}.main.population.extracted_type` }
          ],
          SELECTED: 'POPULATION_ID'
        },
        {
          TABLE: 'FLOCK',
          CRITERIA: [
            { CODE: 'FLOCK_ID', LABEL: `${config.labelBasePath}.main.search.by_flock_id` },
            { CODE: 'ANIMAL_TYPE', LABEL: `${config.labelBasePath}.main.search.by_animal_type` }
          ],
          SELECTED: 'FLOCK_ID'
        },
        {
          TABLE: 'SVAROG_USER_GROUPS',
          CRITERIA: [
            { CODE: 'GROUP_NAME', LABEL: `${config.labelBasePath}.main.search.by_group_name` },
            { CODE: 'GROUP_TYPE', LABEL: `${config.labelBasePath}.main.search.by_group_type` }
          ],
          SELECTED: 'GROUP_NAME'
        },
        {
          TABLE: 'SVAROG_USERS',
          CRITERIA: [
            { CODE: 'USER_NAME', LABEL: `${config.labelBasePath}.main.search.by_user_name` }
          ],
          SELECTED: 'USER_NAME'
        },
        {
          TABLE: 'VACCINATION_EVENT',
          CRITERIA: [
            { CODE: 'CAMPAIGN_NAME', LABEL: `${config.labelBasePath}.main.search.by_vacc_event_name` },
            { CODE: 'CAMPAIGN_SCOPE', LABEL: `${config.labelBasePath}.main.search.vacc_event_campaign_scope` },
            { CODE: 'ACTIVITY_TYPE', LABEL: `${config.labelBasePath}.main.search.vacc_event_activity_type` },
            { CODE: 'ANIMAL_TYPE', LABEL: `${config.labelBasePath}.main.search.vacc_event.animal_type` },
            { CODE: 'NOTE', LABEL: `${config.labelBasePath}.main.search.vacc_event_note` }
          ],
          SELECTED: 'CAMPAIGN_NAME'
        },
        {
          TABLE: 'LABORATORY',
          CRITERIA: [
            { CODE: 'LABORATORY_ID', LABEL: `${config.labelBasePath}.main.search.by_laboratory_id` },
            { CODE: 'LAB_NAME', LABEL: `${config.labelBasePath}.main.search.by_laboratory_name` },
            { CODE: 'ADDRESS', LABEL: `${config.labelBasePath}.main.search.by_address` }
          ],
          SELECTED: 'LABORATORY_ID'
        },
        {
          TABLE: 'LAB_SAMPLE',
          CRITERIA: [
            { CODE: 'SAMPLE_ID', LABEL: `${config.labelBasePath}.main.search.by_sample_id` },
            { CODE: 'ANIMAL_EAR_TAG', LABEL: `${config.labelBasePath}.main.search.by_animal_ear_tag` },
            { CODE: 'HOLDING_PIC', LABEL: `${config.labelBasePath}.main.search.by_holding_pic` }
          ],
          SELECTED: 'SAMPLE_ID'
        },
        {
          TABLE: 'LAB_TEST_TYPE',
          CRITERIA: [
            { CODE: 'DISEASE', LABEL: `${config.labelBasePath}.main.search.disease` },
            { CODE: 'TEST_TYPE', LABEL: `${config.labelBasePath}.main.search.test_type` },
            { CODE: 'TEST_NAME', LABEL: `${config.labelBasePath}.main.search.test_name` }
          ],
          SELECTED: 'TEST_TYPE'
        },
        {
          TABLE: 'CRITERIA',
          CRITERIA: [
            { CODE: 'VALUE', LABEL: `${config.labelBasePath}.main.search.by_value` },
            { CODE: 'CRITERIA_NAME', LABEL: `${config.labelBasePath}.main.search.criteria_name` },
            { CODE: 'CRITERIA_NOTE', LABEL: `${config.labelBasePath}.main.search.criteria_note` }
          ],
          SELECTED: 'CRITERIA_NAME'
        },
        {
          TABLE: 'INVENTORY_ITEM',
          CRITERIA: [
            { CODE: 'EAR_TAG_NUMBER', LABEL: `${config.labelBasePath}.grid_labels.ear_tag_number` },
            { CODE: 'TAG_TYPE', LABEL: `${config.labelBasePath}.grid_labels.tag_type` },
            { CODE: 'ORDER_NUMBER', LABEL: `${config.labelBasePath}.grid_labels.order.order_number` }
          ],
          SELECTED: 'EAR_TAG_NUMBER'
        },
        {
          TABLE: 'MOVEMENT_DOC',
          CRITERIA: [
            { CODE: 'MOVEMENT_DOC_ID', LABEL: `${config.labelBasePath}.grid_labels.animal_movement.movement_doc_id` },
            { CODE: 'TRANSPORTER_LICENSE', LABEL: `${config.labelBasePath}.main.transporter_license` }
          ],
          SELECTED: 'MOVEMENT_DOC_ID'
        },
        {
          TABLE: 'RFID_INPUT',
          CRITERIA: [
            { CODE: 'RFID_NUMBER', LABEL: `${config.labelBasePath}.grid_labels.rfid_input.rfid_number` },
            { CODE: 'IMPORT_TYPE', LABEL: `${config.labelBasePath}.grid_labels.rfid_input.import_type` }
          ],
          SELECTED: 'RFID_NUMBER'
        }
      ]
    },

    SEARCHABLE_DROPDOWN_FOR_SEARCH_CRITERIA: {
      LIST_OF_ITEMS: [
        {
          TABLE: 'ANIMAL',
          NESTED_VALUES: ['animal.description', 'animal.basic_info'],
          CRITERIA: ['ANIMAL_RACE', 'ANIMAL_CLASS', 'COLOR', 'COUNTRY', 'COUNTRY_OLD_ID']
        },
        {
          TABLE: 'PET',
          NESTED_VALUES: ['pet.description_detail'],
          CRITERIA: ['PET_TYPE']
        },
        {
          TABLE: 'STRAY_PET',
          NESTED_VALUES: ['stray_pet.description'],
          CRITERIA: ['PET_TYPE']
        },
        {
          TABLE: 'QUARANTINE',
          NESTED_VALUES: ['quarantine.basic.info'],
          CRITERIA: ['QUARANTINE_TYPE']
        },
        {
          TABLE: 'POPULATION',
          NESTED_VALUES: ['population.basic_info'],
          CRITERIA: ['POPULATION_TYPE', 'EXTRACTION_TYPE']
        },
        {
          TABLE: 'EXPORT_CERT',
          NESTED_VALUES: ['importer_cert_info'],
          CRITERIA: ['TRANSPORT_TYPE']
        },
        {
          TABLE: 'AREA',
          CRITERIA: ['AREA_TYPE', 'AREA_NAME']
        },
        {
          TABLE: 'DISEASE',
          CRITERIA: ['DISEASE_NAME']
        },
        {
          TABLE: 'SVAROG_ORG_UNITS',
          CRITERIA: ['ORG_UNIT_TYPE']
        },
        {
          TABLE: 'FLOCK',
          NESTED_VALUES: ['flock.info'],
          CRITERIA: ['ANIMAL_TYPE']
        },
        {
          TABLE: 'HOLDING',
          NESTED_VALUES: ['holding.info'],
          CRITERIA: ['TYPE']
        },
        {
          TABLE: 'VACCINATION_EVENT',
          NESTED_VALUES: ['campaign.info'],
          CRITERIA: ['ACTIVITY_TYPE', 'ANIMAL_TYPE', 'CAMPAIGN_SCOPE']
        },
        {
          TABLE: 'LAB_TEST_TYPE',
          CRITERIA: ['TEST_TYPE', 'DISEASE']
        },
        {
          TABLE: 'INVENTORY_ITEM',
          CRITERIA: ['TAG_TYPE']
        },
        {
          TABLE: 'RFID_INPUT',
          NESTED_VALUES: ['rfid.animal_type_info'],
          CRITERIA: ['IMPORT_TYPE']
        }
      ]
    },

    SEARCH_BY_DATE: {
      LIST_OF_ITEMS: [
        {
          TABLE: 'QUARANTINE',
          NESTED_VALUES: ['quarantine.time_interval.info'],
          CRITERIA: ['DATE_FROM', 'DATE_TO']
        }
      ]
    }
  }

  return criteriaTypes[requestedCriteria]
}
