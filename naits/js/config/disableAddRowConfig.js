export function disableAddRowConfig (table, context) {
  const tableTypes = {
    DISABLE_ADD_ROW_FOR_TABLE_FIRST_LEVEL: {
      LIST_OF_ITEMS: [
        { TABLE: 'ANIMAL' },
        { TABLE: 'SVAROG_CODES' },
        { TABLE: 'SVAROG_USERS' },
        { TABLE: 'EXPORT_CERT' },
        { TABLE: 'SVAROG_ORG_UNITS' },
        { TABLE: 'INVENTORY_ITEM' },
        { TABLE: 'AREA' },
        { TABLE: 'LAB_TEST_RESULT' },
        { TABLE: 'ANIMAL_MOVEMENT' },
        { TABLE: 'FLOCK_MOVEMENT' },
        { TABLE: 'MOVEMENT_DOC' },
        { TABLE: 'MOVEMENT_DOC_BLOCK' }
      ]
    },

    DISABLE_ADD_ROW_FOR_TABLE_SECOND_LEVEL: {
      LIST_OF_ITEMS: [
        { TABLE: 'SVAROG_USER_GROUPS' },
        { TABLE: 'ANIMAL_MOVEMENT' },
        { TABLE: 'FLOCK_MOVEMENT' },
        {
          TABLE: 'SVAROG_ORG_UNITS',
          PARENT_TYPE: 'SVAROG_USERS'
        },
        {
          TABLE: 'LABORATORY',
          PARENT_TYPE: 'SVAROG_USERS'
        },
        // {
        //   TABLE: 'VACCINATION_EVENT',
        //   PARENT_TYPE: 'POPULATION'
        // },
        { TABLE: 'INVENTORY_ITEM' },
        { TABLE: 'SELECTION_RESULT' },
        { TABLE: 'SVAROG_USERS' },
        { TABLE: 'EAR_TAG_REPLC' },
        { TABLE: 'CRITERIA' },
        { TABLE: 'STRAY_PET_LOCATION' },
        {
          TABLE: 'PET',
          PARENT_TYPE: 'HEALTH_PASSPORT',
          PARENT_SUBTYPE: ' '
        },
        // {
        //   TABLE: 'PET',
        //   PARENT_TYPE: 'HOLDING_RESPONSIBLE',
        //   PARENT_SUBTYPE: ' '
        // },
        // { TABLE: 'PET_PASSPORT' },
        // { TABLE: 'PASSPORT_REQUEST' },
        {
          TABLE: 'STRAY_PET',
          PARENT_TYPE: 'HOLDING_RESPONSIBLE',
          PARENT_SUBTYPE: ' '
        },
        {
          TABLE: 'HOLDING',
          PARENT_TYPE: 'QUARANTINE',
          PARENT_SUBTYPE: ' '
        },
        {
          TABLE: 'DISEASE',
          PARENT_TYPE: 'QUARANTINE',
          PARENT_SUBTYPE: ' '
        }, {
          TABLE: 'FLOCK',
          PARENT_TYPE: 'HOLDING',
          PARENT_SUBTYPE: '7'
        },
        {
          TABLE: 'AREA',
          PARENT_TYPE: 'POPULATION',
          PARENT_SUBTYPE: ' '
        },
        { TABLE: 'LAB_TEST_RESULT' },
        { TABLE: 'MOVEMENT_DOC' },
        { TABLE: 'MOVEMENT_DOC_BLOCK' }
      ]
    },

    DISABLE_ADD_ROW_FOR_TABLE_THIRD_LEVEL: {
      LIST_OF_ITEMS: [
        {
          TABLE: 'ANIMAL',
          PARENT_TYPE: 'EXPORT_CERT'
        },
        {
          TABLE: 'LAB_SAMPLE',
          PARENT_TYPE: 'LABORATORY'
        }
      ]
    },

    DISABLE_ADD_ROW_FOR_SUBMODULES: {
      LIST_OF_ITEMS: [
        { TABLE: 'VACCINATION_BOOK' }
      ]
    }
  }

  return tableTypes[table]
}
