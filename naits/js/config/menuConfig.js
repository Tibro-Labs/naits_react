import { store } from 'tibro-redux'
import * as config from 'config/config.js'
const gridHeight = window.innerHeight - 300
/**
* Menu configurator. Translates the labels if label context is provided and returns an object of menu items depending on the requested menu type.
* If context is not present for items requiring it, a 'CONTEXT_MISSING' warning is appended in front of the label placeholder.
* @author KNI
* @version 1.1
* @function
*
* MANDATORY PARAMETERS
* @param {string} requestedMenu - Type of menu requested by the component. Mandatory for all types of menus.
*
* OPTIONAL PARAMETERS
* @param {object} context -  The labels object of the application, needed to translate the labels. Only mandatory where translation is actually needed.
*
* RETURNS
* @return {object} - The menu configurator, formats the labels nad returns an object, containing the requested menu items
*/

export function menuConfig (requestedMenu, context) {
  const menuTypes = {
    SHOW_PRINT_BADGE: {
      LIST_OF_ITEMS: [
        {
          TABLE: 'ANIMAL',
          REPORTS: [
            {
              LABEL: `${config.labelBasePath}.print.animal_record`,
              REPORT_NAME: 'AR_main'
            },
            {
              LABEL: `${config.labelBasePath}.print.slaugh_1in1_final_geo`,
              REPORT_NAME: 'slaugh_1in1_final_geo'
            },
            {
              LABEL: `${config.labelBasePath}.print.slaugh_6in1_final_geo`,
              REPORT_NAME: 'slaugh_6in1_final_geo'
            },
            {
              LABEL: `${config.labelBasePath}.print.slaugh_final`,
              REPORT_NAME: 'slaugh_8in1_final_geo'
            }
          ]
        },

        {
          TABLE: 'PET',
          REPORTS: [
            {
              LABEL: `${config.labelBasePath}.print.pet_main`,
              REPORT_NAME: 'pet_main'
            },
            {
              LABEL: `${config.labelBasePath}.print.pet_passport_main`,
              REPORT_NAME: 'health_passport'
            },
            {
              LABEL: `${config.labelBasePath}.print.pet_owner_history`,
              REPORT_NAME: 'PetOwnershipHistory'
            },
            {
              LABEL: `${config.labelBasePath}.print.stray_pet_report`,
              REPORT_NAME: 'stray_pet_main'
            }
          ]
        },

        {
          TABLE: 'STRAY_PET',
          REPORTS: [
            {
              LABEL: `${config.labelBasePath}.print.stray_pet_report`,
              REPORT_NAME: 'stray_pet_caretaker_main'
            }
          ]
        },

        {
          TABLE: 'FLOCK',
          REPORTS: [
            {
              LABEL: `${config.labelBasePath}.print.flock_record`,
              REPORT_NAME: 'FR_main'
            },
            {
              LABEL: `${config.labelBasePath}.print.slaugh_final_flock_main`,
              REPORT_NAME: 'slaugh_final_flock_main'
            }
          ]
        },
        {
          TABLE: 'HOLDING',
          REPORTS: [
            {
              LABEL: `${config.labelBasePath}.print.status_update`,
              REPORT_NAME: 'statusUpdateFormPerHolding'
            }, {
              LABEL: `${config.labelBasePath}.print.animal_farm_register`,
              REPORT_NAME: 'AFR_main'
            }, {
              LABEL: `${config.labelBasePath}.print.HC_main`,
              REPORT_NAME: 'HC_main'
            }, {
              LABEL: `${config.labelBasePath}.print.vet_station_basic_info`,
              REPORT_NAME: 'vet_station_general_main'
            }, {
              LABEL: `${config.labelBasePath}.print.shelter_basic_info`,
              REPORT_NAME: 'animal_shelter_general_main'
            }
          ]
        },
        {
          TABLE: 'HOLDING_RESPONSIBLE',
          REPORTS: [
            {
              LABEL: `${config.labelBasePath}.print.keeper_certificate`,
              REPORT_NAME: 'KC_main'
            }
          ]
        },
        {
          TABLE: 'QUARANTINE',
          REPORTS: [
            {
              LABEL: `${config.labelBasePath}.print.quarantine_main`,
              REPORT_NAME: 'quarantine_main'
            }
          ]
        },
        {
          TABLE: 'EXPORT_CERT',
          REPORTS: [
            {
              LABEL: `${config.labelBasePath}.print.ec_main`,
              REPORT_NAME: 'EC_wrapper'
            }
          ]
        },
        {
          TABLE: 'MOVEMENT_DOC',
          REPORTS: [
            {
              LABEL: `${config.labelBasePath}.print.mhc_wrapper`,
              REPORT_NAME: 'MHC_Wrapper'
            }
          ]
        },
        {
          TABLE: 'ORDER',
          REPORTS: [
            {
              LABEL: `${config.labelBasePath}.print.registred_ranges`,
              REPORT_NAME: 'registred_ranges'
            }
          ]
        },
        {
          TABLE: 'RFID_INPUT',
          REPORTS: [
            {
              LABEL: `${config.labelBasePath}.print.rfid_input_details`,
              REPORT_NAME: 'rfid_input_module'
            }
          ]
        }
      ]
    },

    LOAD_FULL_INITIAL_GRID_FOR_TABLE: {
      LIST_OF_ITEMS: [
        { TABLE: 'VACCINATION_EVENT' },
        { TABLE: 'FLOCK' },
        { TABLE: 'LABORATORY' }
      ]
    },

    LOAD_EMPTY_INITIAL_GRID_FOR_TABLE: {
      LIST_OF_ITEMS: [
        {
          TABLE: 'HOLDING',
          DUMMY_CRITERIA: 'PIC'
        },
        {
          TABLE: 'HOLDING_RESPONSIBLE',
          DUMMY_CRITERIA: 'FULL_NAME'
        }, {
          TABLE: 'VILLAGE',
          DUMMY_CRITERIA: 'VILLAGE_CODE'
        },
        {
          TABLE: 'POPULATION',
          DUMMY_CRITERIA: 'POPULATION_TYPE'
        },
        {
          TABLE: 'QUARANTINE',
          DUMMY_CRITERIA: 'QUARANTINE_TYPE'
        },
        {
          TABLE: 'LAB_SAMPLE',
          DUMMY_CRITERIA: 'SAMPLE_ID'
        },
        {
          TABLE: 'LAB_TEST_TYPE',
          DUMMY_CRITERIA: 'TEST_TYPE'
        },
        {
          TABLE: 'PET',
          DUMMY_CRITERIA: 'PET_TAG_ID'
        },
        {
          TABLE: 'STRAY_PET',
          DUMMY_CRITERIA: 'PET_ID'
        },
        {
          TABLE: 'RFID_INPUT',
          DUMMY_CRITERIA: 'RFID_NUMBER'
        }
      ]
    },

    SHOW_GRIDMODAL_TO_LINK_TO_TABLE: [
      {
        TABLE: 'HOLDING',
        LINKEDTABLE: 'HOLDING_RESPONSIBLE',
        LINKS: ['HOLDING_KEEPER', 'HOLDING_HERDER', 'HOLDING_ASSOCIATED', 'HOLDING_MEMBER_OF']
      },
      {
        TABLE: 'HOLDING_RESPONSIBLE',
        LINKEDTABLE: 'HOLDING',
        LINKS: ['HOLDING_KEEPER', 'HOLDING_HERDER', 'HOLDING_ASSOCIATED', 'HOLDING_MEMBER_OF']
      },
      {
        TABLE: 'QUARANTINE',
        LINKEDTABLE: 'HOLDING',
        LINKS: ['HOLDING_QUARANTINE']
      },
      {
        TABLE: 'QUARANTINE',
        LINKEDTABLE: 'DISEASE',
        LINKS: ['DISEASE_QUARANTINE']
      },
      {
        TABLE: 'SVAROG_USERS',
        LINKEDTABLE: 'SVAROG_USER_GROUPS',
        LINKS: ['USER_DEFAULT_GROUP', 'USER_GROUP']
      },
      {
        TABLE: 'PET',
        LINKEDTABLE: 'HOLDING_RESPONSIBLE',
        LINKS: ['PET_OWNER', 'PET_CONTACT']
      },
      {
        TABLE: 'HOLDING_RESPONSIBLE',
        LINKEDTABLE: 'PET',
        LINKS: ['PET_OWNER', 'PET_CONTACT']
      },
      {
        TABLE: 'STRAY_PET',
        LINKEDTABLE: 'HOLDING_RESPONSIBLE',
        LINKS: ['STRAY_CARETAKER']
      },
      {
        TABLE: 'HOLDING_RESPONSIBLE',
        LINKEDTABLE: 'STRAY_PET',
        LINKS: ['STRAY_CARETAKER']
      }
    ],

    SHOW_STATUS_BADGES: [
      'HOLDING'
    ],

    SHOW_OBJECT_SUMMARY_INFO: [
      'AREA',
      'POPULATION',
      'QUARANTINE',
      'SVAROG_USER_GROUPS',
      'SVAROG_USERS',
      'ANIMAL',
      'PET',
      'STRAY_PET',
      'INVENTORY_ITEM',
      'HOLDING'
    ],

    SHOW_MAP: [
      'ANIMAL',
      'PET',
      'HOLDING',
      'QUARANTINE'
    ],

    SHOW_QUESTIONNAIRES: [
      'ANIMAL',
      'HOLDING'
    ],

    SIMPLE_FORM_EXCLUDE: {
      LIST_OF_ITEMS: [
        /* {
          TABLE: 'ANIMAL',
          EXCLUDED_FIELDS: [
            'REGISTRATION_DATE',
            'MOTHER_TAG_ID',
            'FATHER_TAG_ID',
            'COUNTRY_OLD_ID',
            'EXTERNAL_ID',
            'REGION_ID',
            'MUNICIPALITY_ID',
            'HOLDING_ID',
            'IMPORTED_COUNTRY_OLD_ID'
          ]
        } */
      ]
    },
    HISTORY_FOR_MAIN_MENU_TOP: [
      {
        TABLE: 'HOLDING',
        SHOW_ITEMS: ['NAME', 'PIC'],
        LINK_BY: 'PIC'
      },
      {
        TABLE: 'ANIMAL',
        SHOW_ITEMS: ['ANIMAL_ID'],
        LINK_BY: 'ANIMAL_ID'
      },
      {
        TABLE: 'QUARANTINE',
        SHOW_ITEMS: ['QUARANTINE_ID'],
        LINK_BY: 'QUARANTINE_ID'
      },
      {
        TABLE: 'PET',
        SHOW_ITEMS: ['PET_ID'],
        LINK_BY: 'PET_ID'
      }
    ],
    MAIN_MENU: {
      LIST_OF_ITEMS: [
        {
          ID: 'btn_history',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.recent`, defaultMessage: `${config.labelBasePath}.main.recent` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.recent`, defaultMessage: `${config.labelBasePath}.main.recent` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.recent`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.recent`
            },
          FLOATHELPER: 'Click to view recent holdings',
          FUNCTION: null,
          TYPE: undefined,
          LINK_ACTIVE: false,
          IMAGESRC: 'img/menu_icons/history-white.svg',
          IMAGESRC2: 'img/menu_icons/history-yellow.svg'
        },
        {
          ID: 'btn_home',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.main_screen`, defaultMessage: `${config.labelBasePath}.main.main_screen` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.main_screen`, defaultMessage: `${config.labelBasePath}.main.main_screen` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.main_screen`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.main_screen`
            },
          FLOATHELPER: 'Go to main screen',
          FUNCTION: 'link',
          TYPE: undefined,
          LINK_ACTIVE: false,
          LINK_TO: '/',
          IMAGESRC: 'img/menu_icons/home-white.svg',
          IMAGESRC2: 'img/menu_icons/home-yellow.svg'
        },
        {
          ID: 'btn_notifications',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.notifications`, defaultMessage: `${config.labelBasePath}.main.notifications` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.notifications`, defaultMessage: `${config.labelBasePath}.main.notifications` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.notifications`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.notifications`
            },
          FLOATHELPER: 'Click to view notifications',
          FUNCTION: null,
          TYPE: undefined,
          LINK_ACTIVE: false,
          IMAGESRC: 'img/menu_icons/notifications.svg',
          IMAGESRC2: 'img/menu_icons/notifications-yellow.svg'
        },
        {
          ID: 'btn_user_profile',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.user_profile`, defaultMessage: `${config.labelBasePath}.main.user_profile` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.user_profile`, defaultMessage: `${config.labelBasePath}.main.user_profile` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.user_profile`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.user_profile`
            },
          FLOATHELPER: 'Click to view edit user settings',
          FUNCTION: 'userProfile',
          TYPE: undefined,
          LINK_ACTIVE: false,
          IMAGESRC: 'img/menu_icons/user_profile.svg',
          IMAGESRC2: 'img/menu_icons/user_profile-yellow.svg'
        }, {
          ID: 'btn_help',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.nav_bar_help`, defaultMessage: `${config.labelBasePath}.main.nav_bar_help` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.help.nav_bar_helper`, defaultMessage: `${config.labelBasePath}.main.help.nav_bar_helper` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.nav_bar_help`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.nav_bar_helper`
            },
          FUNCTION: 'help',
          TYPE: undefined,
          LINK_ACTIVE: false,
          IMAGESRC: 'img/menu_icons/help-white.svg',
          IMAGESRC2: 'img/menu_icons/help-yellow.svg'
        }, {
          ID: 'btn_logout',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.nav_bar_logout`, defaultMessage: `${config.labelBasePath}.main.nav_bar_logout` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.help.nav_bar_logout`, defaultMessage: `${config.labelBasePath}.main.help.nav_bar_logout` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.nav_bar_logout`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.nav_bar_logout`
            },
          FUNCTION: 'logout',
          TYPE: undefined,
          LINK_ACTIVE: false,
          IMAGESRC: 'img/menu_icons/logout-white.svg',
          IMAGESRC2: 'img/menu_icons/logout-yellow.svg'
        }
      ]
    },

    GRID_CONFIG: {
      SIZE: {
        HEIGHT: gridHeight,
        WIDTH: '100%'
      }
    }
  }

  if (requestedMenu === 'MAIN_PALETTE' && store.getState().userInfoReducer.allowedObjects) {
    return store.getState().userInfoReducer.allowedObjects
  } else if (requestedMenu === 'MAIN_PALETTE' && !store.getState().userInfoReducer.allowedObjects) {
    const empty = {}
    empty.LIST_OF_ITEMS = []
    return empty
  } else if (requestedMenu === 'SIDE_MENU_PALETTE' && store.getState().userInfoReducer.allowedObjectsForSideMenu) {
    return store.getState().userInfoReducer.allowedObjectsForSideMenu
  } else if (requestedMenu === 'SIDE_MENU_PALETTE' && !store.getState().userInfoReducer.allowedObjectsForSideMenu) {
    const empty = {}
    empty.LIST_OF_ITEMS = []
    return empty
  }
  return menuTypes[requestedMenu]
}
