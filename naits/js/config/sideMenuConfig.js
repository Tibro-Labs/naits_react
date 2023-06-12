import * as config from 'config/config.js'

export function sideMenuConfig (requestedSideMenu, context) {
  const sideMenuTypes = {
    SIDE_MENU_HOLDING: {
      LIST_OF_ITEMS: [
        {
          ID: 'list_item_holding_details',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.holding.general`, defaultMessage: `${config.labelBasePath}.main.holding.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.holding.general`, defaultMessage: `${config.labelBasePath}.main.holding.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.side_bar_farm_details`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.side_bar_farm_details`
            },
          FUNCTION: 'form',
          INPUT_WRAPPER: 'HoldingFormSecondLevelInputWrapper',
          TYPE: 'HOLDING'
        },
        {
          ID: 'list_item_holding_keeper',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.holding.holding_keeper`, defaultMessage: `${config.labelBasePath}.main.holding.holding_keeper` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.holding.holding_keeper`, defaultMessage: `${config.labelBasePath}.main.holding.holding_keeper` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.side_holding_keeper`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.side_holding_keeper`
            },
          FUNCTION: 'grid',
          LINKNAME: 'HOLDING_KEEPER',
          LINKNOTE: null,
          LINKEDTABLE: 'HOLDING',
          TYPE: 'HOLDING_RESPONSIBLE',
          INPUT_WRAPPER: 'HoldingKeeperInputWrapper',
          GENERATE_CORE: 'HOLDING_RESPONSIBLE'
        }, {
          ID: 'list_item_holding_herder',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.holding.holding_herder`, defaultMessage: `${config.labelBasePath}.main.holding.holding_herder` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.holding.holding_herder`, defaultMessage: `${config.labelBasePath}.main.holding.holding_herder` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.side_holding_herder`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.side_holding_herder`
            },
          FUNCTION: 'grid',
          LINKNAME: 'HOLDING_HERDER',
          LINKNOTE: null,
          LINKEDTABLE: 'HOLDING',
          TYPE: 'HOLDING_RESPONSIBLE',
          GENERATE_CORE: 'HOLDING_RESPONSIBLE',
          DISABLE_FOR: ['7', '15', '16', '17']
        }, {
          ID: 'list_item_holding_associated',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.holding.holding_associated`, defaultMessage: `${config.labelBasePath}.main.holding.holding_associated` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.holding.holding_associated`, defaultMessage: `${config.labelBasePath}.main.holding.holding_associated` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.holding_associated`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.holding_associated`
            },
          FUNCTION: 'grid',
          LINKNAME: 'HOLDING_ASSOCIATED',
          LINKNOTE: null,
          LINKEDTABLE: 'HOLDING',
          TYPE: 'HOLDING_RESPONSIBLE',
          GENERATE_CORE: 'HOLDING_RESPONSIBLE'
        }, {
          ID: 'list_item_holding_membership',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.holding.holding_membership`, defaultMessage: `${config.labelBasePath}.main.holding.holding_membership` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.holding.holding_membership`, defaultMessage: `${config.labelBasePath}.main.holding.holding_membership` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.holding_membership`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.holding_membership`
            },
          FUNCTION: 'grid',
          LINKNAME: 'HOLDING_MEMBER_OF',
          LINKNOTE: null,
          LINKEDTABLE: 'HOLDING',
          TYPE: 'HOLDING_RESPONSIBLE',
          GENERATE_CORE: 'HOLDING_RESPONSIBLE'
        }, {
          ID: 'list_item_holding_keeper_history',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.holding.keeper_history`, defaultMessage: `${config.labelBasePath}.main.holding.keeper_history` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.holding.keeper_history`, defaultMessage: `${config.labelBasePath}.main.holding.keeper_history` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.keeper_history`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.keeper_history`
            },
          FUNCTION: 'grid',
          TYPE: 'HOLDING_RESPONSIBLE',
          LINKNAME: 'HOLDING_RESPONSIBLE_HISTORY',
          DISABLE_ADD_ROW: true,
          DISABLE_EDIT: true,
          DISABLE_FORM_EDIT: true,
          CUSTOM_WS: 'GET_HOLDING_KEEPER_HISTORY'
        },
        {
          ID: 'movement_document',
          CUSTOM_GRID_ID: 'outgoing_movement_doc',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.movement_doc_outgoing`, defaultMessage: `${config.labelBasePath}.main.movement_doc_outgoing` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.movement_doc_outgoing`, defaultMessage: `${config.labelBasePath}.main.movement_doc_outgoing` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.movement_doc`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.movement_doc`
            },
          FUNCTION: 'grid',
          TYPE: 'MOVEMENT_DOC',
          DISABLE_EDIT: true,
          DISABLE_FORM_EDIT: 'submit',
          ISCONTAINER: true,
          ACTIONS_ENABLED: ['change_movement_doc_status', 'omit_release', 'change_herd_movement_doc_status'],
          CUSTOM_WS: 'GET_TABLE_WITH_MULTIPLE_FILTERS_SORTED',
          DISABLE_FOR: ['7', '15', '16', '17']
        },
        {
          ID: 'finished_movement_document',
          CUSTOM_GRID_ID: 'finished_outgoing_movement_doc',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.movement_doc_outgoing_finished`, defaultMessage: `${config.labelBasePath}.main.movement_doc_outgoing_finished` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.movement_doc_outgoing_finished`, defaultMessage: `${config.labelBasePath}.main.movement_doc_outgoing_finished` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.movement_doc`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.movement_doc`
            },
          FUNCTION: 'grid',
          TYPE: 'MOVEMENT_DOC',
          DISABLE_EDIT: true,
          DISABLE_FORM_EDIT: 'submit',
          ISCONTAINER: true,
          CUSTOM_WS: 'GET_TABLE_WITH_MULTIPLE_FILTERS_SORTED',
          DISABLE_FOR: ['7', '15', '16', '17']
        },
        {
          ID: 'movement_document_incoming',
          CUSTOM_GRID_ID: 'incoming_movement_doc',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.movement_doc_incoming`, defaultMessage: `${config.labelBasePath}.main.movement_doc_incoming` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.movement_doc_incoming`, defaultMessage: `${config.labelBasePath}.main.movement_doc_incoming` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.movement_doc_incoming`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.movement_doc_incoming`
            },
          FUNCTION: 'grid',
          TYPE: 'MOVEMENT_DOC',
          DISABLE_EDIT: true,
          DISABLE_FORM_EDIT: 'submit',
          ISCONTAINER: true,
          ACTIONS_ENABLED: ['change_movement_doc_status', 'change_incoming_herd_movement_doc_status'],
          CUSTOM_WS: 'GET_TABLE_WITH_MULTIPLE_FILTERS_SORTED',
          DISABLE_FOR: ['15', '16', '17']
        },
        {
          ID: 'finished_movement_document_incoming',
          CUSTOM_GRID_ID: 'finished_incoming_movement_doc',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.movement_doc_incoming_finished`, defaultMessage: `${config.labelBasePath}.main.movement_doc_incoming_finished` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.movement_doc_incoming_finished`, defaultMessage: `${config.labelBasePath}.main.movement_doc_incoming_finished` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.movement_doc_incoming_finished`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.movement_doc_incoming_finished`
            },
          FUNCTION: 'grid',
          TYPE: 'MOVEMENT_DOC',
          DISABLE_EDIT: true,
          DISABLE_FORM_EDIT: 'submit',
          ISCONTAINER: true,
          CUSTOM_WS: 'GET_TABLE_WITH_MULTIPLE_FILTERS_SORTED',
          DISABLE_FOR: ['15', '16', '17']
        },
        {
          ID: 'list_item_animal',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.animal.general`, defaultMessage: `${config.labelBasePath}.main.animal.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.animal.general`, defaultMessage: `${config.labelBasePath}.main.animal.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.animal.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.animal.general`
            },
          FUNCTION: 'grid',
          TYPE: 'ANIMAL',
          ISCONTAINER: true,
          ACTIONS_ENABLED: ['retire', 'activity', 'movement', 'generateDeathCertificates', 'add_to_herd'],
          MULTIGRID: { ITEMS: 2, CRITERIA: 'PARENT_ID,STATUS', FIRST_VALUE: 'IN-VALID-PREMORTEM', SECOUND_VALUE: 'NOTIN-VALID-PREMORTEM-DIED-SLAUGHTRD-DESTROYED-EXPORTED', MAIN_CRIT: 'OBJECT_ID' },
          INPUT_WRAPPER: 'InputWSValidationWrapper',
          FORM_EXTENSION: 'AnimalAge',
          CUSTOM_WS: 'GET_TABLE_WITH_MULTIPLE_FILTERS_SORTED',
          DISABLE_FOR: ['15', '16', '17']
        },
        {
          ID: 'list_item_terminated_animals',
          CUSTOM_ID: 'TERMINATED_ANIMALS',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.terminated_animals`, defaultMessage: `${config.labelBasePath}.main.terminated_animals` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.terminated_animals`, defaultMessage: `${config.labelBasePath}.main.terminated_animals` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.animals`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.animals`
            },
          FUNCTION: 'grid',
          TYPE: 'ANIMAL',
          ISCONTAINER: true,
          DISABLE_ADD_ROW: true,
          CUSTOM_WS: 'GET_TABLE_WITH_MULTIPLE_FILTERS_SORTED',
          DISABLE_FOR: ['15', '16', '17']
        },
        {
          ID: 'list_item_animal_movement',
          CUSTOM_ID: 'VALID_ANIMAL_MOVEMENTS',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.animal_movement.general`, defaultMessage: `${config.labelBasePath}.main.animal_movement.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.animal_movement.general`, defaultMessage: `${config.labelBasePath}.main.animal_movement.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.animal_movement.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.animal_movement.general`
            },
          FUNCTION: 'grid',
          LINKNAME: 'ANIMAL_MOVEMENT_HOLDING',
          LINKNOTE: null,
          LINKEDTABLE: 'HOLDING',
          TYPE: 'ANIMAL_MOVEMENT',
          ACTIONS_ENABLED: ['finish_movement'],
          DISABLE_EDIT: true,
          DISABLE_FORM_EDIT: true,
          CUSTOM_WS: 'GET_BYLINK_PER_STATUSES_SORTED',
          DISABLE_FOR: ['15', '16', '17']
        },
        {
          ID: 'list_item_finished_animal_movement',
          CUSTOM_ID: 'FINISHED_ANIMAL_MOVEMENTS',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.finished_animal_movement.general`, defaultMessage: `${config.labelBasePath}.main.finished_animal_movement.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.finished_animal_movement.general`, defaultMessage: `${config.labelBasePath}.main.finished_animal_movement.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.finished_animal_movement.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.finished_animal_movement.general`
            },
          FUNCTION: 'grid',
          LINKNAME: 'ANIMAL_MOVEMENT_HOLDING',
          LINKNOTE: null,
          LINKEDTABLE: 'HOLDING',
          TYPE: 'ANIMAL_MOVEMENT',
          DISABLE_EDIT: true,
          DISABLE_FORM_EDIT: true,
          CUSTOM_WS: 'GET_BYLINK_PER_STATUSES_SORTED',
          DISABLE_FOR: ['15', '16', '17']
        },
        {
          ID: 'list_item_outgoing_animals',
          CUSTOM_ID: 'VALID_OUTGOING_ANIMAL_MOVEMENTS',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.outgoing_animals.general`, defaultMessage: `${config.labelBasePath}.main.outgoing_animals.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.outgoing_animals.general`, defaultMessage: `${config.labelBasePath}.main.outgoing_animals.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.outgoing_animals.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.outgoing_animals.general`
            },
          FUNCTION: 'grid',
          TYPE: 'ANIMAL_MOVEMENT',
          ACTIONS_ENABLED: ['cancel_movement'],
          DISABLE_EDIT: true,
          DISABLE_FORM_EDIT: true,
          CUSTOM_WS: 'GET_TABLE_WITH_MULTIPLE_FILTERS_SORTED',
          DISABLE_FOR: ['7', '15', '16', '17']
        },
        {
          ID: 'list_item_finished_outgoing_animals',
          CUSTOM_ID: 'FINISHED_OUTGOING_ANIMAL_MOVEMENTS',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.finished_outgoing_animals.general`, defaultMessage: `${config.labelBasePath}.main.finished_outgoing_animals.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.finished_outgoing_animals.general`, defaultMessage: `${config.labelBasePath}.main.finished_outgoing_animals.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.finished_outgoing_animals.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.finished_outgoing_animals.general`
            },
          FUNCTION: 'grid',
          TYPE: 'ANIMAL_MOVEMENT',
          DISABLE_EDIT: true,
          DISABLE_FORM_EDIT: true,
          CUSTOM_WS: 'GET_TABLE_WITH_MULTIPLE_FILTERS_SORTED',
          DISABLE_FOR: ['7', '15', '16', '17']
        },
        {
          ID: 'list_item_flock',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.flock`, defaultMessage: `${config.labelBasePath}.main.flock` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.flock`, defaultMessage: `${config.labelBasePath}.main.flock` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.flock`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.flock`
            },
          FUNCTION: 'grid',
          TYPE: 'FLOCK',
          ISCONTAINER: true,
          MULTIGRID: { ITEMS: 2, CRITERIA: 'PARENT_ID,STATUS', FIRST_VALUE: 'IN-VALID-PREMORTEM', SECOUND_VALUE: 'NOTIN-VALID-PREMORTEM', MAIN_CRIT: 'OBJECT_ID' },
          INPUT_WRAPPER: 'InputWSValidationWrapper',
          CUSTOM_WS: 'GET_TABLE_WITH_MULTIPLE_FILTERS_SORTED',
          ACTIONS_ENABLED: ['retire', 'activity', 'movement'],
          DISABLE_FOR: ['15', '16', '17']
        },
        {
          ID: 'list_item_flock_movement',
          CUSTOM_ID: 'VALID_FLOCK_MOVEMENTS',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.flock_movement.general`, defaultMessage: `${config.labelBasePath}.main.flock_movement.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.flock_movement.general`, defaultMessage: `${config.labelBasePath}.main.flock_movement.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.flock_movement.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.flock_movement.general`
            },
          FUNCTION: 'grid',
          LINKNAME: 'FLOCK_MOVEMENT_HOLDING',
          LINKEDTABLE: 'HOLDING',
          TYPE: 'FLOCK_MOVEMENT',
          ISCONTAINER: false,
          ACTIONS_ENABLED: ['finish_movement'],
          DISABLE_EDIT: true,
          DISABLE_FORM_EDIT: true,
          CUSTOM_WS: 'GET_BYLINK_PER_STATUSES_SORTED',
          DISABLE_FOR: ['15', '16', '17']
        },
        {
          ID: 'list_item_finished_flock_movement',
          CUSTOM_ID: 'FINISHED_FLOCK_MOVEMENTS',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.finished_flock_movement.general`, defaultMessage: `${config.labelBasePath}.main.finished_flock_movement.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.finished_flock_movement.general`, defaultMessage: `${config.labelBasePath}.main.finished_flock_movement.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.finished_flock_movement.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.finished_flock_movement.general`
            },
          FUNCTION: 'grid',
          LINKNAME: 'FLOCK_MOVEMENT_HOLDING',
          LINKEDTABLE: 'HOLDING',
          TYPE: 'FLOCK_MOVEMENT',
          ISCONTAINER: false,
          DISABLE_EDIT: true,
          DISABLE_FORM_EDIT: true,
          CUSTOM_WS: 'GET_BYLINK_PER_STATUSES_SORTED',
          DISABLE_FOR: ['15', '16', '17']
        },
        {
          ID: 'list_item_outgoing_flocks',
          CUSTOM_ID: 'VALID_OUTGOING_FLOCK_MOVEMENTS',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.outgoing_flocks.general`, defaultMessage: `${config.labelBasePath}.main.outgoing_flocks.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.outgoing_flocks.general`, defaultMessage: `${config.labelBasePath}.main.outgoing_flocks.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.outgoing_flocks.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.outgoing_flocks.general`
            },
          FUNCTION: 'grid',
          TYPE: 'FLOCK_MOVEMENT',
          ACTIONS_ENABLED: ['cancel_movement'],
          DISABLE_EDIT: true,
          DISABLE_FORM_EDIT: true,
          CUSTOM_WS: 'GET_TABLE_WITH_MULTIPLE_FILTERS_SORTED',
          DISABLE_FOR: ['7', '15', '16', '17']
        },
        {
          ID: 'list_item_finished_outgoing_flocks',
          CUSTOM_ID: 'FINISHED_OUTGOING_FLOCK_MOVEMENTS',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.finished_outgoing_flocks.general`, defaultMessage: `${config.labelBasePath}.main.finished_outgoing_flocks.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.finished_outgoing_flocks.general`, defaultMessage: `${config.labelBasePath}.main.finished_outgoing_flocks.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.finished_outgoing_flocks.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.finished_outgoing_flocks.general`
            },
          FUNCTION: 'grid',
          TYPE: 'FLOCK_MOVEMENT',
          DISABLE_EDIT: true,
          DISABLE_FORM_EDIT: true,
          CUSTOM_WS: 'GET_TABLE_WITH_MULTIPLE_FILTERS_SORTED',
          DISABLE_FOR: ['7', '15', '16', '17']
        },
        {
          ID: 'list_item_herd',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.herd`, defaultMessage: `${config.labelBasePath}.main.herd` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.herd`, defaultMessage: `${config.labelBasePath}.main.herd` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.herd`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.herd`
            },
          FUNCTION: 'grid',
          TYPE: 'HERD',
          ISCONTAINER: true,
          MULTIGRID: { ITEMS: 2, CRITERIA: 'PARENT_ID,STATUS', FIRST_VALUE: 'IN-VALID', SECOUND_VALUE: 'NOTIN-VALID', MAIN_CRIT: 'OBJECT_ID' },
          INPUT_WRAPPER: 'InputHerdWrapper',
          CUSTOM_WS: 'GET_TABLE_WITH_MULTIPLE_FILTERS_SORTED',
          ACTIONS_ENABLED: ['retire_herd', 'herd_activity', 'herd_movement'],
          DISABLE_FOR: ['7', '15', '16', '17']
        },
        {
          ID: 'list_item_herd_movement',
          CUSTOM_ID: 'VALID_HERD_MOVEMENTS',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.herd_movement.general`, defaultMessage: `${config.labelBasePath}.main.herd_movement.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.herd_movement.general`, defaultMessage: `${config.labelBasePath}.main.herd_movement.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.herd_movement.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.herd_movement.general`
            },
          FUNCTION: 'grid',
          LINKNAME: 'HERD_MOVEMENT_HOLDING',
          LINKNOTE: null,
          LINKEDTABLE: 'HOLDING',
          TYPE: 'HERD_MOVEMENT',
          ACTIONS_ENABLED: ['handle_herd_movement'],
          DISABLE_EDIT: true,
          DISABLE_FORM_EDIT: true,
          CUSTOM_WS: 'GET_BYLINK_PER_STATUSES_SORTED',
          DISABLE_FOR: ['7', '15', '16', '17']
        },
        {
          ID: 'list_item_finished_herd_movement',
          CUSTOM_ID: 'FINISHED_HERD_MOVEMENTS',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.finished_herd_movement.general`, defaultMessage: `${config.labelBasePath}.main.finished_herd_movement.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.finished_herd_movement.general`, defaultMessage: `${config.labelBasePath}.main.finished_herd_movement.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.finished_herd_movement.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.finished_herd_movement.general`
            },
          FUNCTION: 'grid',
          LINKNAME: 'HERD_MOVEMENT_HOLDING',
          LINKNOTE: null,
          LINKEDTABLE: 'HOLDING',
          TYPE: 'HERD_MOVEMENT',
          DISABLE_EDIT: true,
          DISABLE_FORM_EDIT: true,
          CUSTOM_WS: 'GET_BYLINK_PER_STATUSES_SORTED',
          DISABLE_FOR: ['7', '15', '16', '17']
        },
        {
          ID: 'list_item_outgoing_herds',
          CUSTOM_ID: 'VALID_OUTGOING_HERD_MOVEMENTS',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.outgoing_herds.general`, defaultMessage: `${config.labelBasePath}.main.outgoing_herds.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.outgoing_herds.general`, defaultMessage: `${config.labelBasePath}.main.outgoing_herds.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.outgoing_herds.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.outgoing_herds.general`
            },
          FUNCTION: 'grid',
          TYPE: 'HERD_MOVEMENT',
          ACTIONS_ENABLED: ['cancel_herd_movement'],
          DISABLE_EDIT: true,
          DISABLE_FORM_EDIT: true,
          CUSTOM_WS: 'GET_TABLE_WITH_MULTIPLE_FILTERS_SORTED',
          DISABLE_FOR: ['7', '15', '16', '17']
        },
        {
          ID: 'list_item_finished_outgoing_herds',
          CUSTOM_ID: 'FINISHED_OUTGOING_HERD_MOVEMENTS',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.finished_outgoing_herds.general`, defaultMessage: `${config.labelBasePath}.main.finished_outgoing_herds.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.finished_outgoing_herds.general`, defaultMessage: `${config.labelBasePath}.main.finished_outgoing_herds.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.finished_outgoing_herds.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.finished_outgoing_herds.general`
            },
          FUNCTION: 'grid',
          TYPE: 'HERD_MOVEMENT',
          DISABLE_EDIT: true,
          DISABLE_FORM_EDIT: true,
          CUSTOM_WS: 'GET_TABLE_WITH_MULTIPLE_FILTERS_SORTED',
          DISABLE_FOR: ['7', '15', '16', '17']
        },
        {
          ID: 'list_item_ivinventory_item',
          CUSTOM_ID: 'INVENTORY_ITEM_HOLDING',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.inventory_item.general`, defaultMessage: `${config.labelBasePath}.main.inventory_item.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.inventory_item.general`, defaultMessage: `${config.labelBasePath}.main.inventory_item.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.inventory_item.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.inventory_item.general`
            },
          FUNCTION: 'search',
          COLUMN: 'PARENT_ID',
          VALUE_FOR_COL: 'OBJECT_ID',
          TYPE: 'INVENTORY_ITEM',
          DISABLE_EDIT: true,
          DISABLE_FORM_EDIT: true,
          DISABLE_EDIT_FOR_SUBMODULES: true,
          DISABLE_FOR: ['15', '16', '17']
        },
        {
          ID: 'list_item_income_transfer',
          CUSTOM_ID: 'TRANSFER_INCOME',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.org_units.income_transfer`, defaultMessage: `${config.labelBasePath}.main.org_units.income_transfer` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.org_units.income_transfer`, defaultMessage: `${config.labelBasePath}.main.org_units.income_transfer` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.org_units.income_transfer`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.org_units.income_transfer`
            },
          FUNCTION: 'grid',
          TYPE: 'TRANSFER',
          CUSTOM_WS: 'GET_TABLE_WITH_MULTIPLE_FILTERS_SORTED',
          // DISABLE_EDIT: true,
          DISABLE_FORM_EDIT: true,
          DISABLE_ADD_ROW: true,
          DISABLE_FOR: ['15', '16', '17']
          // CUSTOM_ROW_SELECT: true
        },
        {
          ID: 'list_item_outcome_transfer',
          CUSTOM_ID: 'TRANSFER_OUTCOME',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.org_units.outcome_transfer`, defaultMessage: `${config.labelBasePath}.main.org_units.outcome_transfer` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.org_units.outcome_transfer`, defaultMessage: `${config.labelBasePath}.main.org_units.outcome_transfer` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.org_units.outcome_transfer`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.org_units.outcome_transfer`
            },
          FUNCTION: 'grid',
          TYPE: 'TRANSFER',
          CUSTOM_WS: 'GET_TABLE_WITH_MULTIPLE_FILTERS_SORTED',
          DISABLE_FORM_EDIT: true,
          DISABLE_ADD_ROW: true,
          DISABLE_FOR: ['15', '16', '17'],
          INPUT_WRAPPER: 'CombineTransferWrappers'
        },
        {
          ID: 'list_item_lab_sample',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.lab_sample`, defaultMessage: `${config.labelBasePath}.main.lab_sample` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.lab_sample`, defaultMessage: `${config.labelBasePath}.main.lab_sample` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.lab_sample`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.lab_sample`
            },
          FUNCTION: 'grid',
          TYPE: 'LAB_SAMPLE',
          ISCONTAINER: true,
          INPUT_WRAPPER: 'LabSampleFormSecondLevelInputWrapper',
          ACTIONS_ENABLED: ['sample_action'],
          MULTIGRID: { ITEMS: 2, CRITERIA: 'HOLDING_PIC,STATUS', FIRST_VALUE: 'COLLECTED', 'SECOUND_VALUE': 'NOTCOLLECTED', MAIN_CRIT: 'PIC' },
          CUSTOM_WS: 'GET_TABLE_WITH_MULTIPLE_FILTERS',
          DISABLE_FOR: ['15', '16', '17']
        },
        {
          ID: 'list_item_export_quarantine',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.quarantine`, defaultMessage: `${config.labelBasePath}.main.quarantine` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.quarantine`, defaultMessage: `${config.labelBasePath}.main.quarantine` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.quarantine`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.quarantine`
            },
          FUNCTION: 'grid',
          LINKNAME: 'HOLDING_QUARANTINE',
          LINKNOTE: null,
          LINKEDTABLE: 'HOLDING',
          TYPE: 'QUARANTINE',
          ISCONTAINER: true,
          DISABLE_FOR: ['7', '15', '16', '17']
        },
        {
          ID: 'list_item_spot_check',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.spot_check.general`, defaultMessage: `${config.labelBasePath}.main.spot_check.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.spot_check.general`, defaultMessage: `${config.labelBasePath}.main.spot_check.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.spot_check`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.spot_check`
            },
          FUNCTION: 'grid',
          TYPE: 'SPOT_CHECK',
          DISABLE_FOR: ['7', '15', '16', '17']
        },
        {
          ID: 'list_item_svarog_org_units',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.svarog_org_units_admconsole`, defaultMessage: `${config.labelBasePath}.main.svarog_org_units_admconsole` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.svarog_org_units_admconsole`, defaultMessage: `${config.labelBasePath}.main.svarog_org_units_admconsole` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.svarog_org_units_admconsole`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.svarog_org_units_admconsole`
            },
          FUNCTION: 'grid',
          LINKNAME: 'POA',
          LINKNOTE: null,
          LINKEDTABLE: 'HOLDING',
          TYPE: 'SVAROG_ORG_UNITS',
          DISABLE_FOR: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '17', '18', '19'],
          DISABLE_FORM_EDIT: 'submit'
        },
        {
          ID: 'list_item_pet',
          CUSTOM_ID: 'ALL_PETS',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.pet.general`, defaultMessage: `${config.labelBasePath}.main.pet.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.pet.general`, defaultMessage: `${config.labelBasePath}.main.pet.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.pet`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.pet`
            },
          FUNCTION: 'grid',
          TYPE: 'PET',
          ISCONTAINER: true,
          INPUT_WRAPPER: 'PetFormInputWrapper',
          FORM_EXTENSION: 'PetAge',
          CUSTOM_WS: 'GET_TABLE_WITH_MULTIPLE_FILTERS',
          DISABLE_FOR: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '16', '18', '19']
        },
        {
          ID: 'list_item_terminated_pet',
          CUSTOM_ID: 'TERMINATED_PETS',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.terminated_pets`, defaultMessage: `${config.labelBasePath}.main.terminated_pets` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.terminated_pets`, defaultMessage: `${config.labelBasePath}.main.terminated_pets` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.terminated_pets`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.terminated_pets`
            },
          FUNCTION: 'grid',
          TYPE: 'PET',
          ISCONTAINER: true,
          INPUT_WRAPPER: 'PetFormInputWrapper',
          CUSTOM_WS: 'GET_TABLE_WITH_MULTIPLE_FILTERS',
          DISABLE_FOR: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '16', '18', '19']
        },
        // {
        //   ID: 'list_item_stray_pet',
        //   ...context
        //     ? {
        //       LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.stray_pet.general`, defaultMessage: `${config.labelBasePath}.main.stray_pet.general` }),
        //       FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.stray_pet.general`, defaultMessage: `${config.labelBasePath}.main.stray_pet.general` })
        //     }
        //     : {
        //       LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.stray_pet`,
        //       FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.stray_pet`
        //     },
        //   FUNCTION: 'grid',
        //   TYPE: 'STRAY_PET',
        //   ISCONTAINER: true,
        //   INPUT_WRAPPER: 'InputWSValidationWrapper',
        //   MULTIGRID: { ITEMS: 2, CRITERIA: 'PARENT_ID,STATUS', FIRST_VALUE: 'IN-VALID', SECOUND_VALUE: 'NOTIN-VALID', MAIN_CRIT: 'OBJECT_ID' },
        //   DISABLE_EDIT: true,
        //   DISABLE_FOR: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '16'],
        //   CUSTOM_WS: 'GET_TABLE_WITH_MULTIPLE_FILTERS'
        // },
        {
          ID: 'list_item_pet_passport',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.pet.passport`, defaultMessage: `${config.labelBasePath}.main.pet.passport` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.pet.passport`, defaultMessage: `${config.labelBasePath}.main.pet.passport` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.pet.passport`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.pet.passport`
            },
          FUNCTION: 'grid',
          TYPE: 'HEALTH_PASSPORT',
          ISCONTAINER: true,
          INPUT_WRAPPER: 'InputPetSelectionWrapper',
          MULTIGRID: { ITEMS: 2, CRITERIA: 'HOLDING_OBJ_ID,STATUS', FIRST_VALUE: 'IN-VALID', SECOUND_VALUE: 'NOTIN-VALID', MAIN_CRIT: 'OBJECT_ID' },
          DISABLE_EDIT: true,
          DISABLE_FOR: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '17', '18', '19'],
          CUSTOM_WS: 'GET_TABLE_WITH_MULTIPLE_FILTERS'
        },
        {
          ID: 'list_item_outgoing_pets',
          CUSTOM_ID: 'OUTGOING_MOVEMENT',
          CUSTOM_GRID_ID: 'RELEASED_PETS',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.outgoing_pets`, defaultMessage: `${config.labelBasePath}.main.outgoing_pets` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.outgoing_pets`, defaultMessage: `${config.labelBasePath}.main.outgoing_pets` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.outgoing_pets`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.outgoing_pets`
            },
          FUNCTION: 'grid',
          TYPE: 'PET',
          CUSTOM_WS: 'GET_TABLE_WITH_MULTIPLE_FILTERS',
          DISABLE_ADD_ROW: true,
          DISABLE_EDIT: true,
          DISABLE_FORM_EDIT: 'delete',
          DISABLE_EDIT_FOR_SUBMODULES: 'delete',
          DISABLE_FOR: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '16', '18', '19']
        },
        {
          ID: 'list_item_incoming_pets',
          CUSTOM_ID: 'INCOMING_MOVEMENT',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.incoming_pets`, defaultMessage: `${config.labelBasePath}.main.incoming_pets` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.incoming_pets`, defaultMessage: `${config.labelBasePath}.main.incoming_pets` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.incoming_pets`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.incoming_pets`
            },
          FUNCTION: 'grid',
          TYPE: 'PET_MOVEMENT',
          SEARCH_PARAMS: { SEARCH_CRITERIA: 'HOLDING_OBJ_ID' },
          CUSTOM_WS: 'GET_DATA_WITH_FILTER',
          DISABLE_ADD_ROW: true,
          DISABLE_EDIT: true,
          DISABLE_FORM_EDIT: 'delete',
          DISABLE_EDIT_FOR_SUBMODULES: 'delete',
          DISABLE_FOR: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '16', '18', '19']
        },
        {
          ID: 'list_item_pet_quarantine_shelter',
          CUSTOM_ID: 'PET_QUARANTINE',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.pet_quarantine`, defaultMessage: `${config.labelBasePath}.main.pet_quarantine` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.pet_quarantine`, defaultMessage: `${config.labelBasePath}.main.pet_quarantine` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.pet_quarantine`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.pet_quarantine`
            },
          FUNCTION: 'grid',
          TYPE: 'PET_QUARANTINE',
          CUSTOM_WS: 'GET_BYPARENTID',
          IS_CONTAINER: true,
          INPUT_WRAPPER: 'PetQuarantineInputWrapper',
          DISABLE_FOR: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '16', '17', '18', '19']
        }
        // {
        //   ID: 'list_item_pet_passport_request',
        //   ...context
        //     ? {
        //       LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.passport_request`, defaultMessage: `${config.labelBasePath}.main.passport_request` }),
        //       FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.passport_request`, defaultMessage: `${config.labelBasePath}.main.passport_request` })
        //     }
        //     : {
        //       LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.passport_request`,
        //       FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.pet.passport_request`
        //     },
        //   FUNCTION: 'grid',
        //   TYPE: 'PASSPORT_REQUEST',
        //   ISCONTAINER: true,
        //   INPUT_WRAPPER: 'InputWSValidationWrapper',
        //   MULTIGRID: { ITEMS: 2, CRITERIA: 'HOLDING_OBJ_ID,STATUS', FIRST_VALUE: 'IN-DRAFT', SECOUND_VALUE: 'NOTIN-DRAFT', MAIN_CRIT: 'OBJECT_ID' },
        //   DISABLE_EDIT: true,
        //   DISABLE_FOR: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'],
        //   CUSTOM_WS: 'GET_TABLE_WITH_MULTIPLE_FILTERS'
        // }
      ],
      SUB_MODULES: {
        '7': {
          ID: 'slaughterhouse',
          TYPE: '7',
          FOR_OBJECTS: ['ANIMAL', 'FLOCK'],
          ACTIONS_ENABLED: ['retire', 'generateDeathCertificates', 'accept'],
          ADDITIONAL_MENU_ITEMS: ['PreMortem', 'PostMortem']
        },
        '15': {
          ID: 'animal_shelter',
          TYPE: '15',
          FOR_OBJECTS: ['PET'],
          ACTIONS_ENABLED: ['pet_activity', 'pet_status', 'pet_movement', 'pet_quarantine'],
          ADDITIONAL_MENU_ITEMS: ['CollectionLocation', 'ReleaseLocation']
        },
        '17': {
          ID: 'veterinary_clinic',
          TYPE: '15',
          FOR_OBJECTS: ['PET'],
          ACTIONS_ENABLED: ['pet_activity', 'pet_status', 'pet_movement'],
          ADDITIONAL_MENU_ITEMS: ['CollectionLocation', 'ReleaseLocation']
        }
      }
    },

    SIDE_MENU_HOLDING_FVIRO: {
      LIST_OF_ITEMS: [{
        ID: 'list_item_animal',
        ...context
          ? {
            LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.animal.general`, defaultMessage: `${config.labelBasePath}.main.animal.general` }),
            FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.animal.general`, defaultMessage: `${config.labelBasePath}.main.animal.general` })
          }
          : {
            LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.animal.general`,
            FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.animal.general`
          },
        FUNCTION: 'grid',
        TYPE: 'ANIMAL',
        ISCONTAINER: true,
        ACTIONS_ENABLED: ['retire', 'activity', 'movement', 'generateDeathCertificates'],
        MULTIGRID: { ITEMS: 2, CRITERIA: 'PARENT_ID,STATUS', FIRST_VALUE: 'IN-VALID-PREMORTEM', SECOUND_VALUE: 'NOTIN-VALID-PREMORTEM', MAIN_CRIT: 'OBJECT_ID' },
        INPUT_WRAPPER: 'InputWSValidationWrapper',
        FORM_EXTENSION: 'AnimalAge',
        CUSTOM_WS: 'GET_TABLE_WITH_MULTIPLE_FILTERS'
      },
      {
        ID: 'list_item_lab_sample',
        ...context
          ? {
            LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.lab_sample`, defaultMessage: `${config.labelBasePath}.main.lab_sample` }),
            FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.lab_sample`, defaultMessage: `${config.labelBasePath}.main.lab_sample` })
          }
          : {
            LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.lab_sample`,
            FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.lab_sample`
          },
        FUNCTION: 'grid',
        TYPE: 'LAB_SAMPLE'
      }
      ]
    },

    SIDE_MENU_HOLDING_CVIRO: {
      LIST_OF_ITEMS: [{
        ID: 'list_item_animal',
        ...context
          ? {
            LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.animal.general`, defaultMessage: `${config.labelBasePath}.main.animal.general` }),
            FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.animal.general`, defaultMessage: `${config.labelBasePath}.main.animal.general` })
          }
          : {
            LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.animal.general`,
            FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.animal.general`
          },
        FUNCTION: 'grid',
        TYPE: 'ANIMAL',
        ISCONTAINER: true,
        ACTIONS_ENABLED: ['retire', 'activity', 'movement', 'generateDeathCertificates'],
        MULTIGRID: { ITEMS: 2, CRITERIA: 'PARENT_ID,STATUS', FIRST_VALUE: 'IN-VALID-PREMORTEM', SECOUND_VALUE: 'NOTIN-VALID-PREMORTEM', MAIN_CRIT: 'OBJECT_ID' },
        INPUT_WRAPPER: 'InputWSValidationWrapper',
        FORM_EXTENSION: 'AnimalAge',
        CUSTOM_WS: 'GET_TABLE_WITH_MULTIPLE_FILTERS'
      },
      {
        ID: 'list_item_lab_sample',
        ...context
          ? {
            LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.lab_sample`, defaultMessage: `${config.labelBasePath}.main.lab_sample` }),
            FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.lab_sample`, defaultMessage: `${config.labelBasePath}.main.lab_sample` })
          }
          : {
            LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.lab_sample`,
            FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.lab_sample`
          },
        FUNCTION: 'grid',
        TYPE: 'LAB_SAMPLE',
        ACTIONS_ENABLED: ['sample_action'],
        MULTIGRID: { ITEMS: 2, CRITERIA: 'HOLDING_PIC,STATUS', FIRST_VALUE: 'COLLECTED', 'SECOUND_VALUE': 'QUEUED', MAIN_CRIT: 'PIC' },
        CUSTOM_WS: 'GET_TABLE_WITH_MULTIPLE_FILTERS',
        ISCONTAINER: true
      }
      ]
    },

    SIDE_MENU_HOLDING_LABORANT: {
      LIST_OF_ITEMS: [{
        ID: 'list_item_animal',
        ...context
          ? {
            LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.animal.general`, defaultMessage: `${config.labelBasePath}.main.animal.general` }),
            FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.animal.general`, defaultMessage: `${config.labelBasePath}.main.animal.general` })
          }
          : {
            LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.animal.general`,
            FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.animal.general`
          },
        FUNCTION: 'grid',
        TYPE: 'ANIMAL',
        ISCONTAINER: true,
        ACTIONS_ENABLED: ['retire', 'activity', 'movement'],
        MULTIGRID: { ITEMS: 2, CRITERIA: 'PARENT_ID,STATUS', FIRST_VALUE: 'IN-VALID-PREMORTEM', SECOUND_VALUE: 'NOTIN-VALID-PREMORTEM', MAIN_CRIT: 'OBJECT_ID' },
        INPUT_WRAPPER: 'InputWSValidationWrapper',
        FORM_EXTENSION: 'AnimalAge',
        CUSTOM_WS: 'GET_TABLE_WITH_MULTIPLE_FILTERS'
      },
      {
        ID: 'list_item_lab_sample',
        ...context
          ? {
            LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.lab_sample`, defaultMessage: `${config.labelBasePath}.main.lab_sample` }),
            FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.lab_sample`, defaultMessage: `${config.labelBasePath}.main.lab_sample` })
          }
          : {
            LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.lab_sample`,
            FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.lab_sample`
          },
        FUNCTION: 'grid',
        TYPE: 'LAB_SAMPLE',
        ACTIONS_ENABLED: ['change_the_status_of_lab_sample'],
        MULTIGRID: { ITEMS: 2, CRITERIA: 'SOURCE_HOLDING_ID,STATUS', FIRST_VALUE: 'QUEUED', 'SECOUND_VALUE': 'NOTQUEUED', MAIN_CRIT: 'PIC' },
        CUSTOM_WS: 'GET_TABLE_WITH_MULTIPLE_FILTERS'
      }
      ]
    },
    SIDE_MENU_HOLDING_RESPONSIBLE: {
      LIST_OF_ITEMS: [
        {
          ID: 'list_item_holding_responsible_details',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.holding_responsible.general`, defaultMessage: `${config.labelBasePath}.main.holding_responsible.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.holding_responsible.general`, defaultMessage: `${config.labelBasePath}.main.holding_responsible.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.holding_responsible.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.holding_responsible.general`
            },
          FUNCTION: 'form',
          TYPE: 'HOLDING_RESPONSIBLE'
          // INPUT_WRAPPER: 'DisableHolderTypeDropdownInputWrapper'
        }, {
          ID: 'list_item_holding',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.holding.general`, defaultMessage: `${config.labelBasePath}.main.holding.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.holding.general`, defaultMessage: `${config.labelBasePath}.main.holding.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.holding.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.holding.general`
            },
          FUNCTION: 'grid',
          LINKNAME: 'HOLDING_KEEPER',
          LINKNOTE: null,
          LINKEDTABLE: 'HOLDING_RESPONSIBLE',
          TYPE: 'HOLDING',
          INPUT_WRAPPER: 'HoldingResponsibleLinkInputWrapper',
          ISCONTAINER: true
          // GENERATE_CORE: 'HOLDING'
        }, {
          ID: 'list_item_holding_herder',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.holding.holding_herder`, defaultMessage: `${config.labelBasePath}.main.holding.holding_herder` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.holding.holding_herder`, defaultMessage: `${config.labelBasePath}.main.holding.holding_herder` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.side_holding_herder`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.side_holding_herder`
            },
          FUNCTION: 'grid',
          LINKNAME: 'HOLDING_HERDER',
          LINKNOTE: null,
          LINKEDTABLE: 'HOLDING_RESPONSIBLE',
          TYPE: 'HOLDING',
          ISCONTAINER: true,
          DISABLE_EDIT: true
        }, {
          ID: 'list_item_holding_associated',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.holding.holding_associated`, defaultMessage: `${config.labelBasePath}.main.holding.holding_associated` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.holding.holding_associated`, defaultMessage: `${config.labelBasePath}.main.holding.holding_associated` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.holding_associated`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.holding_associated`
            },
          FUNCTION: 'grid',
          LINKNAME: 'HOLDING_ASSOCIATED',
          LINKNOTE: null,
          LINKEDTABLE: 'HOLDING_RESPONSIBLE',
          TYPE: 'HOLDING',
          ISCONTAINER: true,
          DISABLE_EDIT: true
        }, {
          ID: 'list_item_holding_members',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.holding.holding_members`, defaultMessage: `${config.labelBasePath}.main.holding.holding_members` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.holding.holding_members`, defaultMessage: `${config.labelBasePath}.main.holding.holding_members` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.holding_members`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.holding_members`
            },
          FUNCTION: 'grid',
          LINKNAME: 'HOLDING_MEMBER_OF',
          LINKNOTE: null,
          LINKEDTABLE: 'HOLDING_RESPONSIBLE',
          TYPE: 'HOLDING',
          ISCONTAINER: true,
          DISABLE_EDIT: true,
          DISABLE_FOR: ['1']
        }, {
          ID: 'list_item_pet_owner',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.pet_owner_holding_resp`, defaultMessage: `${config.labelBasePath}.main.pet_owner_holding_resp` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.pet_owner_holding_resp`, defaultMessage: `${config.labelBasePath}.main.pet_owner_holding_resp` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.side_pet_owner_holding_resp`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.side_pet_owner_holding_resp`
            },
          FUNCTION: 'grid',
          LINKNAME: 'PET_OWNER',
          LINKNOTE: null,
          LINKEDTABLE: 'HOLDING_RESPONSIBLE',
          TYPE: 'PET',
          ISCONTAINER: true,
          DISABLE_EDIT: true
        }, {
          ID: 'list_item_pet_contact',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.pet_contact_holding_resp`, defaultMessage: `${config.labelBasePath}.main.pet_contact_holding_resp` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.pet_contact_holding_resp`, defaultMessage: `${config.labelBasePath}.main.pet_contact_holding_resp` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.side_pet_contact_holding_resp`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.side_pet_contact_holding_resp`
            },
          FUNCTION: 'grid',
          LINKNAME: 'PET_CONTACT',
          LINKNOTE: null,
          LINKEDTABLE: 'HOLDING_RESPONSIBLE',
          TYPE: 'PET',
          ISCONTAINER: true,
          DISABLE_EDIT: true
        }
        // {
        //   ID: 'list_item_stray_pet_caretaker',
        //   ...context
        //     ? {
        //       LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.stray_pet_caretaker_holding_resp`, defaultMessage: `${config.labelBasePath}.main.stray_pet_caretaker_holding_resp` }),
        //       FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.stray_pet_caretaker_holding_resp`, defaultMessage: `${config.labelBasePath}.main.stray_pet_caretaker_holding_resp` })
        //     }
        //     : {
        //       LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.side_stray_pet_caretaker_holding_resp`,
        //       FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.side_stray_pet_caretaker_holding_resp`
        //     },
        //   FUNCTION: 'grid',
        //   LINKNAME: 'STRAY_CARETAKER',
        //   LINKNOTE: null,
        //   LINKEDTABLE: 'HOLDING_RESPONSIBLE',
        //   TYPE: 'STRAY_PET',
        //   DISABLE_EDIT: true
        // }
        // {
        //   ID: 'list_item_passport_request',
        //   ...context
        //     ? {
        //       LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.pet.sent_passport_request`, defaultMessage: `${config.labelBasePath}.main.pet.sent_passport_request` }),
        //       FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.pet.sent_passport_request`, defaultMessage: `${config.labelBasePath}.main.pet.sent_passport_request` })
        //     }
        //     : {
        //       LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.side_pet_sent_passport_request`,
        //       FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.side_pet_sent_passport_request`
        //     },
        //   FUNCTION: 'grid',
        //   TYPE: 'PASSPORT_REQUEST',
        //   ISCONTAINER: true,
        //   INPUT_WRAPPER: 'InputWSValidationWrapper',
        //   MULTIGRID: { ITEMS: 2, CRITERIA: 'PERSON_OBJ_ID,STATUS', FIRST_VALUE: 'IN-DRAFT', SECOUND_VALUE: 'NOTIN-DRAFT', MAIN_CRIT: 'OBJECT_ID' },
        //   DISABLE_EDIT: true,
        //   CUSTOM_WS: 'GET_TABLE_WITH_MULTIPLE_FILTERS'
        // }
      ],
      SUB_MODULES: {
        'HOLDER': {
          ID: 'holder',
          TYPE: 'HOLDER'
        }
      }
    },

    SIDE_MENU_ANIMAL: {
      LIST_OF_ITEMS: [
        {
          ID: 'list_item_animal_info',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.animal.edit_animal_info`, defaultMessage: `${config.labelBasePath}.animal.edit_animal_info` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.animal.edit_animal_info`, defaultMessage: `${config.labelBasePath}.animal.edit_animal_info` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.animal.edit_animal_info`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.animal.edit_animal_info`
            },
          FUNCTION: 'form',
          TYPE: 'ANIMAL',
          INPUT_WRAPPER: 'InputWSValidationWrapper',
          FORM_EXTENSION: 'AnimalAge',
          HIDE_FOR_SUBMODULES: false
        }, {
          ID: 'list_item_animal_movement',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.animal_movement.general2`, defaultMessage: `${config.labelBasePath}.main.animal_movement.general2` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.animal_movement.general2`, defaultMessage: `${config.labelBasePath}.main.animal_movement.general2` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.animal_movement.general2`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.animal_movement.general2`
            },
          FUNCTION: 'grid',
          TYPE: 'ANIMAL_MOVEMENT',
          ISCONTAINER: false,
          DISABLE_EDIT: true,
          DISABLE_FORM_EDIT: true
        }, {
          ID: 'list_item_vaccination_book',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.animal.vaccination_book`, defaultMessage: `${config.labelBasePath}.main.animal.vaccination_book` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.animal.vaccination_book`, defaultMessage: `${config.labelBasePath}.main.animal.vaccination_book` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.animal.vaccination_book`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.animal.vaccination_book`
            },
          FUNCTION: 'grid',
          TYPE: 'VACCINATION_BOOK',
          LINKNOTE: null,
          LINKEDTABLE: 'ANIMAL',
          LINKNAME: 'ANIMAL_VACC_BOOK',
          INPUT_WRAPPER: 'CombineHealthBookWrappers'
        },
        {
          ID: 'list_item_lab_sample',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.lab_sample`, defaultMessage: `${config.labelBasePath}.main.lab_sample` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.lab_sample`, defaultMessage: `${config.labelBasePath}.main.lab_sample` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.lab_sample`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.lab_sample`
            },
          FUNCTION: 'grid',
          TYPE: 'LAB_SAMPLE',
          ISCONTAINER: true,
          ACTIONS_ENABLED: ['sample_action'],
          MULTIGRID: { ITEMS: 2, CRITERIA: 'ANIMAL_EAR_TAG,STATUS', FIRST_VALUE: 'COLLECTED', SECOUND_VALUE: 'NOTCOLLECTED', MAIN_CRIT: 'ANIMAL_ID' },
          CUSTOM_WS: 'GET_TABLE_WITH_MULTIPLE_FILTERS',
          INPUT_WRAPPER: 'LabSampleFormSecondLevelInputWrapper'
        },
        {
          ID: 'list_item_eartag_replacement',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.eartag_replacement`, defaultMessage: `${config.labelBasePath}.main.eartag_replacement` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.eartag_replacement`, defaultMessage: `${config.labelBasePath}.main.eartag_replacement` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.eartag_replacement`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.eartag_replacement`
            },
          FUNCTION: 'grid',
          TYPE: 'EAR_TAG_REPLC',
          ISCONTAINER: false,
          DISABLE_FORM_EDIT: 'delete',
          DISABLE_EDIT_FOR_SUBMODULES: 'delete'
        },
        {
          ID: 'list_item_ivinventory_item',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.inventory_item.general`, defaultMessage: `${config.labelBasePath}.main.inventory_item.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.inventory_item.general`, defaultMessage: `${config.labelBasePath}.main.inventory_item.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.inventory_item.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.inventory_item.general`
            },
          FUNCTION: 'grid',
          TYPE: 'INVENTORY_ITEM',
          CUSTOM_WS: 'GET_BYPARENTID',
          DISABLE_FORM_EDIT: 'delete',
          DISABLE_EDIT_FOR_SUBMODULES: 'delete',
          INPUT_WRAPPER: 'CombineDisableAndInvItemInputsWrapper'
        }
      ]
    },

    SIDE_MENU_PET: {
      LIST_OF_ITEMS: [
        {
          ID: 'list_item_pet',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.pet.edit_pet_info`, defaultMessage: `${config.labelBasePath}.pet.edit_pet_info` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.pet.edit_pet_info`, defaultMessage: `${config.labelBasePath}.pet.edit_pet_info` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.pet.edit_pet_info`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.pet.edit_pet_info`
            },
          FUNCTION: 'form',
          TYPE: 'PET',
          INPUT_WRAPPER: 'PetFormSecondLevelInputWrapper',
          FORM_EXTENSION: 'PetAge',
          HIDE_FOR_SUBMODULES: false
        },
        {
          ID: 'list_item_pet_owner',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.pet_owner`, defaultMessage: `${config.labelBasePath}.main.pet_owner` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.pet_owner`, defaultMessage: `${config.labelBasePath}.main.pet_owner` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.side_pet_owner`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.side_pet_owner`
            },
          FUNCTION: 'grid',
          LINKNAME: 'PET_OWNER',
          LINKNOTE: null,
          LINKEDTABLE: 'PET',
          TYPE: 'HOLDING_RESPONSIBLE',
          GENERATE_CORE: 'HOLDING_RESPONSIBLE'
        },
        {
          ID: 'list_item_pet_contact',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.pet_contact`, defaultMessage: `${config.labelBasePath}.main.pet_contact` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.pet_contact`, defaultMessage: `${config.labelBasePath}.main.pet_contact` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.side_pet_contact`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.side_pet_contact`
            },
          FUNCTION: 'grid',
          LINKNAME: 'PET_CONTACT',
          LINKNOTE: null,
          LINKEDTABLE: 'PET',
          TYPE: 'HOLDING_RESPONSIBLE',
          GENERATE_CORE: 'HOLDING_RESPONSIBLE'
        },
        {
          ID: 'list_item_health_book',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.pet.health_book`, defaultMessage: `${config.labelBasePath}.main.pet.health_book` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.pet.health_book`, defaultMessage: `${config.labelBasePath}.main.pet.health_book` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.pet.health_book`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.pet.health_book`
            },
          FUNCTION: 'grid',
          TYPE: 'PET_HEALTH_BOOK',
          CUSTOM_WS: 'GET_BYPARENTID',
          INPUT_WRAPPER: 'InputSearchPetCampaignWrapper'
        },
        {
          ID: 'list_item_pet_passport',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.pet.passport`, defaultMessage: `${config.labelBasePath}.main.pet.passport` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.pet.passport`, defaultMessage: `${config.labelBasePath}.main.pet.passport` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.pet.passport`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.pet.passport`
            },
          FUNCTION: 'grid',
          TYPE: 'HEALTH_PASSPORT',
          ISCONTAINER: true,
          INPUT_WRAPPER: 'InputVetStationSelectionWrapper',
          MULTIGRID: { ITEMS: 2, CRITERIA: 'PARENT_ID,STATUS', FIRST_VALUE: 'IN-VALID', SECOUND_VALUE: 'NOTIN-VALID', MAIN_CRIT: 'OBJECT_ID' },
          CUSTOM_WS: 'GET_TABLE_WITH_MULTIPLE_FILTERS'
        },
        // {
        //   ID: 'list_item_pet_passport',
        //   ...context
        //     ? {
        //       LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.pet.passport`, defaultMessage: `${config.labelBasePath}.main.pet.passport` }),
        //       FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.pet.passport`, defaultMessage: `${config.labelBasePath}.main.pet.passport` })
        //     }
        //     : {
        //       LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.pet.passport`,
        //       FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.pet.passport`
        //     },
        //   FUNCTION: 'grid',
        //   TYPE: 'PET_PASSPORT',
        //   INPUT_WRAPPER: 'InputWSValidationWrapper',
        //   MULTIGRID: { ITEMS: 2, CRITERIA: 'PET_OBJ_ID,STATUS', FIRST_VALUE: 'IN-VALID', SECOUND_VALUE: 'NOTIN-VALID', MAIN_CRIT: 'OBJECT_ID' },
        //   CUSTOM_WS: 'GET_TABLE_WITH_MULTIPLE_FILTERS'
        //   // DISABLE_EDIT_FOR_SUBMODULES: 'delete'
        // },
        // {
        //   ID: 'list_item_pet_passport_request',
        //   ...context
        //     ? {
        //       LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.pet.passport_request`, defaultMessage: `${config.labelBasePath}.main.pet.passport_request` }),
        //       FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.pet.passport_request`, defaultMessage: `${config.labelBasePath}.main.pet.passport_request` })
        //     }
        //     : {
        //       LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.pet.passport_request`,
        //       FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.pet.passport_request`
        //     },
        //   FUNCTION: 'grid',
        //   TYPE: 'PASSPORT_REQUEST',
        //   ISCONTAINER: true,
        //   INPUT_WRAPPER: 'InputWSValidationWrapper',
        //   MULTIGRID: { ITEMS: 2, CRITERIA: 'PARENT_ID,STATUS', FIRST_VALUE: 'IN-DRAFT', SECOUND_VALUE: 'NOTIN-DRAFT', MAIN_CRIT: 'OBJECT_ID' },
        //   CUSTOM_WS: 'GET_TABLE_WITH_MULTIPLE_FILTERS'
        // },
        {
          ID: 'list_item_inventory_item',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.inv_item`, defaultMessage: `${config.labelBasePath}.main.inv_item` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.inv_item`, defaultMessage: `${config.labelBasePath}.main.inv_item` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.inv_item`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.inv_item`
            },
          FUNCTION: 'grid',
          TYPE: 'INVENTORY_ITEM',
          CUSTOM_WS: 'GET_BYPARENTID',
          DISABLE_ADD_ROW: true,
          DISABLE_FORM_EDIT: 'delete',
          DISABLE_EDIT_FOR_SUBMODULES: 'delete',
          INPUT_WRAPPER: 'CombineDisableAndInvItemInputsWrapper'
        },
        {
          ID: 'list_item_pet_transfer',
          CUSTOM_ID: 'PET_TRANSFER',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.pet_movement.general`, defaultMessage: `${config.labelBasePath}.main.pet_movement.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.pet_movement.general`, defaultMessage: `${config.labelBasePath}.main.pet_movement.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.pet_movement.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.pet_movement.general`
            },
          FUNCTION: 'grid',
          TYPE: 'PET_MOVEMENT',
          CUSTOM_WS: 'GET_BYPARENTID',
          DISABLE_ADD_ROW: true,
          DISABLE_EDIT: true,
          DISABLE_FORM_EDIT: 'delete',
          DISABLE_EDIT_FOR_SUBMODULES: 'delete'
        },
        {
          ID: 'list_item_pet_quarantine',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.pet_quarantine`, defaultMessage: `${config.labelBasePath}.main.pet_quarantine` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.pet_quarantine`, defaultMessage: `${config.labelBasePath}.main.pet_quarantine` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.side_pet_quarantine`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.side_pet_quarantine`
            },
          FUNCTION: 'grid',
          LINKNAME: 'PET_QUARANTINE',
          LINKNOTE: null,
          LINKEDTABLE: 'PET',
          TYPE: 'PET_QUARANTINE',
          DISABLE_ADD_ROW: true,
          DISABLE_FORM_EDIT: true,
          DISABLE_EDIT_FOR_SUBMODULES: true
        }
      ]
    },

    SIDE_MENU_STRAY_PET: {
      LIST_OF_ITEMS: [
        {
          ID: 'list_item_stray_pet',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.pet.edit_pet_info`, defaultMessage: `${config.labelBasePath}.pet.edit_pet_info` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.pet.edit_pet_info`, defaultMessage: `${config.labelBasePath}.pet.edit_pet_info` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.pet.edit_pet_info`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.pet.edit_pet_info`
            },
          FUNCTION: 'form',
          TYPE: 'STRAY_PET',
          INPUT_WRAPPER: 'CombineStrayPetWrappers',
          HIDE_FOR_SUBMODULES: false
        },
        {
          ID: 'list_item_stray_pet_caretaker',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.stray_pet_caretaker`, defaultMessage: `${config.labelBasePath}.main.stray_pet_caretaker` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.stray_pet_caretaker`, defaultMessage: `${config.labelBasePath}.main.stray_pet_caretaker` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.side_stray_pet_caretaker`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.side_stray_pet_caretaker`
            },
          FUNCTION: 'grid',
          LINKNAME: 'STRAY_CARETAKER',
          LINKNOTE: null,
          LINKEDTABLE: 'STRAY_PET',
          TYPE: 'HOLDING_RESPONSIBLE',
          GENERATE_CORE: 'HOLDING_RESPONSIBLE'
        },
        {
          ID: 'list_item_stray_pet_location',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.stray_pet_location`, defaultMessage: `${config.labelBasePath}.main.stray_pet_location` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.stray_pet_location`, defaultMessage: `${config.labelBasePath}.main.stray_pet_location` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.side_stray_pet_location`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.side_stray_pet_location`
            },
          FUNCTION: 'grid',
          TYPE: 'STRAY_PET_LOCATION',
          DISABLE_FORM_EDIT: 'delete',
          CUSTOM_WS: 'GET_BYPARENTID'
        }
      ]
    },

    SIDE_MENU_HEALTH_PASSPORT: {
      LIST_OF_ITEMS: [
        {
          ID: 'list_item_health_passport',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.health_passport.general`, defaultMessage: `${config.labelBasePath}.main.health_passport.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.health_passport.general`, defaultMessage: `${config.labelBasePath}.main.health_passport.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.help.health_passport.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.health_passport.general`
            },
          FUNCTION: 'form',
          TYPE: 'HEALTH_PASSPORT',
          INPUT_WRAPPER: 'PetPassportReadonlyInputWrapper'
        },
        {
          ID: 'list_item_health_passport_pet',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.single_pet`, defaultMessage: `${config.labelBasePath}.main.single_pet` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.single_pet`, defaultMessage: `${config.labelBasePath}.main.single_pet` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.help.single_pet`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.single_pet`
            },
          FUNCTION: 'grid',
          TYPE: 'PET',
          SEARCH_PARAMS: { SEARCH_CRITERIA: 'PET_ID' },
          CUSTOM_WS: 'GET_DATA_WITH_FILTER',
          DISABLE_FORM_EDIT: true,
          DISABLE_EDIT: true,
          DISABLE_EDIT_FOR_SUBMODULES: true
        }
      ]
    },

    SIDE_MENU_ANIMAL_FVIRO: {
      LIST_OF_ITEMS: [
        {
          ...'SIDE_MENU_ANIMAL.LIST_OF_ITEMS',
          ID: 'list_item_vaccination_book',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.animal.vaccination_book`, defaultMessage: `${config.labelBasePath}.main.animal.vaccination_book` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.animal.vaccination_book`, defaultMessage: `${config.labelBasePath}.main.animal.vaccination_book` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.animal.vaccination_book`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.animal.vaccination_book`
            },
          FUNCTION: 'grid',
          TYPE: 'VACCINATION_BOOK',
          LINKNOTE: null,
          LINKEDTABLE: 'ANIMAL',
          LINKNAME: 'ANIMAL_VACC_BOOK',
          INPUT_WRAPPER: 'CombineHealthBookWrappers',
          HIDE_FOR_SUBMODULES: false
        },
        {
          ID: 'list_item_lab_sample',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.lab_sample`, defaultMessage: `${config.labelBasePath}.main.lab_sample` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.lab_sample`, defaultMessage: `${config.labelBasePath}.main.lab_sample` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.lab_sample`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.lab_sample`
            },
          FUNCTION: 'grid',
          TYPE: 'LAB_SAMPLE',
          INPUT_WRAPPER: 'LabSampleFormSecondLevelInputWrapper'
        }
      ]
    },

    SIDE_MENU_ANIMAL_CVIRO: {
      LIST_OF_ITEMS: [
        {
          ID: 'list_item_vaccination_book',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.animal.vaccination_book`, defaultMessage: `${config.labelBasePath}.main.animal.vaccination_book` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.animal.vaccination_book`, defaultMessage: `${config.labelBasePath}.main.animal.vaccination_book` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.animal.vaccination_book`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.animal.vaccination_book`
            },
          FUNCTION: 'grid',
          TYPE: 'VACCINATION_BOOK',
          LINKNOTE: null,
          LINKEDTABLE: 'ANIMAL',
          LINKNAME: 'ANIMAL_VACC_BOOK',
          INPUT_WRAPPER: 'CombineHealthBookWrappers'
        },
        {
          ID: 'list_item_lab_sample',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.lab_sample`, defaultMessage: `${config.labelBasePath}.main.lab_sample` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.lab_sample`, defaultMessage: `${config.labelBasePath}.main.lab_sample` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.lab_sample`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.lab_sample`
            },
          FUNCTION: 'grid',
          TYPE: 'LAB_SAMPLE',
          ISCONTAINER: true,
          ACTIONS_ENABLED: ['sample_action'],
          MULTIGRID: { ITEMS: 2, CRITERIA: 'ANIMAL_EAR_TAG,STATUS', FIRST_VALUE: 'COLLECTED', SECOUND_VALUE: 'QUEUED', MAIN_CRIT: 'ANIMAL_ID' },
          CUSTOM_WS: 'GET_TABLE_WITH_MULTIPLE_FILTERS',
          INPUT_WRAPPER: 'LabSampleFormSecondLevelInputWrapper'
        }
      ]
    },

    SIDE_MENU_ANIMAL_LABORANT: {
      LIST_OF_ITEMS: [
        {
          ...'SIDE_MENU_ANIMAL.LIST_OF_ITEMS',
          ID: 'list_item_vaccination_book',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.animal.vaccination_book`, defaultMessage: `${config.labelBasePath}.main.animal.vaccination_book` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.animal.vaccination_book`, defaultMessage: `${config.labelBasePath}.main.animal.vaccination_book` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.animal.vaccination_book`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.animal.vaccination_book`
            },
          FUNCTION: 'grid',
          TYPE: 'VACCINATION_BOOK',
          LINKNOTE: null,
          LINKEDTABLE: 'ANIMAL',
          LINKNAME: 'ANIMAL_VACC_BOOK',
          INPUT_WRAPPER: 'InputSearchCampaignWrapper'
        },
        {
          ID: 'list_item_lab_sample',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.lab_sample`, defaultMessage: `${config.labelBasePath}.main.lab_sample` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.lab_sample`, defaultMessage: `${config.labelBasePath}.main.lab_sample` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.lab_sample`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.lab_sample`
            },
          FUNCTION: 'grid',
          TYPE: 'LAB_SAMPLE',
          ISCONTAINER: true,
          ACTIONS_ENABLED: ['change_the_status_of_lab_sample'],
          MULTIGRID: { ITEMS: 2, CRITERIA: 'ANIMAL_EAR_TAG,STATUS', FIRST_VALUE: 'QUEUED', SECOUND_VALUE: 'NOTQUEUED', MAIN_CRIT: 'ANIMAL_ID' },
          CUSTOM_WS: 'GET_TABLE_WITH_MULTIPLE_FILTERS'
        }
      ]
    },
    SIDE_MENU_LAB_SAMPLE: {
      LIST_OF_ITEMS: [
        {
          ID: 'list_item_lab_sample',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.edit_lab_sample`, defaultMessage: `${config.labelBasePath}.main.edit_lab_sample` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.edit_lab_sample`, defaultMessage: `${config.labelBasePath}.main.edit_lab_sample` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.edit_lab_sample`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.edit_lab_sample`
            },
          FUNCTION: 'form',
          INPUT_WRAPPER: 'LabSampleFormSecondLevelInputWrapper',
          TYPE: 'LAB_SAMPLE'
        },
        {
          ID: 'list_item_lab_sample_result',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.lab_test_result`, defaultMessage: `${config.labelBasePath}.main.lab_test_result` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.lab_test_result`, defaultMessage: `${config.labelBasePath}.main.lab_test_result` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.lab_test_result`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.lab_test_result`
            },
          FUNCTION: 'grid',
          TYPE: 'LAB_TEST_RESULT',
          INPUT_WRAPPER: ['InputTestTypeWrapper'],
          DISABLE_FORM_EDIT: 'delete',
          DISABLE_SELECT_ROW: true
        }
      ]
    },
    SIDE_MENU_LAB_SAMPLE_LABORANT: {
      LIST_OF_ITEMS: [
        {
          ID: 'list_item_lab_sample',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.edit_lab_sample`, defaultMessage: `${config.labelBasePath}.main.edit_lab_sample` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.edit_lab_sample`, defaultMessage: `${config.labelBasePath}.main.edit_lab_sample` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.edit_lab_sample`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.edit_lab_sample`
            },
          FUNCTION: 'form',
          INPUT_WRAPPER: 'LabSampleFormSecondLevelInputWrapper',
          TYPE: 'LAB_SAMPLE'
        },
        {
          ID: 'list_item_lab_sample_result',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.lab_test_result`, defaultMessage: `${config.labelBasePath}.main.lab_test_result` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.lab_test_result`, defaultMessage: `${config.labelBasePath}.main.lab_test_result` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.lab_test_result`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.lab_test_result`
            },
          FUNCTION: 'grid',
          TYPE: 'LAB_TEST_RESULT',
          INPUT_WRAPPER: ['InputTestTypeWrapper'],
          DISABLE_FORM_EDIT: 'delete',
          DISABLE_SELECT_ROW: true
        }
      ]
    },

    SIDE_MENU_LAB_SAMPLE_CVIRO: {
      LIST_OF_ITEMS: [
        {
          ID: 'list_item_lab_sample',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.edit_lab_sample`, defaultMessage: `${config.labelBasePath}.main.edit_lab_sample` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.edit_lab_sample`, defaultMessage: `${config.labelBasePath}.main.edit_lab_sample` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.edit_lab_sample`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.edit_lab_sample`
            },
          FUNCTION: 'form',
          TYPE: 'LAB_SAMPLE'
        },
        {
          ID: 'list_item_lab_sample_result',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.lab_test_result`, defaultMessage: `${config.labelBasePath}.main.lab_test_result` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.lab_test_result`, defaultMessage: `${config.labelBasePath}.main.lab_test_result` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.lab_test_result`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.lab_test_result`
            },
          FUNCTION: 'grid',
          TYPE: 'LAB_TEST_RESULT',
          DISABLE_FORM_EDIT: 'delete',
          DISABLE_SELECT_ROW: true
        }
      ]
    },
    SIDE_MENU_LAB_SAMPLE_FVIRO: {
      LIST_OF_ITEMS: [
        {
          ID: 'list_item_lab_sample',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.edit_lab_sample`, defaultMessage: `${config.labelBasePath}.main.edit_lab_sample` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.edit_lab_sample`, defaultMessage: `${config.labelBasePath}.main.edit_lab_sample` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.edit_lab_sample`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.edit_lab_sample`
            },
          FUNCTION: 'form',
          TYPE: 'LAB_SAMPLE'
        },
        {
          ID: 'list_item_lab_sample_result',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.lab_test_result`, defaultMessage: `${config.labelBasePath}.main.lab_test_result` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.lab_test_result`, defaultMessage: `${config.labelBasePath}.main.lab_test_result` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.lab_test_result`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.lab_test_result`
            },
          FUNCTION: 'grid',
          TYPE: 'LAB_TEST_RESULT',
          DISABLE_FORM_EDIT: 'delete',
          DISABLE_SELECT_ROW: true
        }
      ]
    },

    SIDE_MENU_RFID_INPUT: {
      LIST_OF_ITEMS: [
        {
          ID: 'list_item_rfid',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.rfid`, defaultMessage: `${config.labelBasePath}.main.rfid` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.rfid`, defaultMessage: `${config.labelBasePath}.main.rfid` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.rfid`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.rfid`
            },
          FUNCTION: 'form',
          TYPE: 'RFID_INPUT',
          INPUT_WRAPPER: 'RfidFormInputWrapper'
        },
        {
          ID: 'list_item_rfid_input_state',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.rfid_input_state.general`, defaultMessage: `${config.labelBasePath}.main.rfid_input_state.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.rfid_input_state.general`, defaultMessage: `${config.labelBasePath}.main.rfid_input_state.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.rfid_input_state.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.rfid_input_state.general`
            },
          FUNCTION: 'grid',
          TYPE: 'RFID_INPUT_STATE',
          CUSTOM_WS: 'GET_BY_PARENTID_ASC_OR_DESC',
          DISABLE_FORM_EDIT: 'delete'
        },
        {
          ID: 'list_item_rfid_input_results',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.rfid_input_result.general`, defaultMessage: `${config.labelBasePath}.main.rfid_input_result.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.rfid_input_result.general`, defaultMessage: `${config.labelBasePath}.main.rfid_input_result.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.rfid_input_result.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.rfid_input_result.general`
            },
          FUNCTION: 'grid',
          TYPE: 'RFID_INPUT_RESULT',
          CUSTOM_WS: 'GET_BYPARENTID',
          DISABLE_EDIT: true,
          DISABLE_FORM_EDIT: true
        }
      ]
    },

    SIDE_MENU_RFID_INPUT_CVIRO: {
      LIST_OF_ITEMS: [
        {
          ID: 'list_item_rfid',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.rfid`, defaultMessage: `${config.labelBasePath}.main.rfid` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.rfid`, defaultMessage: `${config.labelBasePath}.main.rfid` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.rfid`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.rfid`
            },
          FUNCTION: 'form',
          TYPE: 'RFID_INPUT',
          INPUT_WRAPPER: 'RfidFormInputWrapper'
        },
        {
          ID: 'list_item_rfid_input_state',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.rfid_input_state.general`, defaultMessage: `${config.labelBasePath}.main.rfid_input_state.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.rfid_input_state.general`, defaultMessage: `${config.labelBasePath}.main.rfid_input_state.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.rfid_input_state.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.rfid_input_state.general`
            },
          FUNCTION: 'grid',
          TYPE: 'RFID_INPUT_STATE',
          CUSTOM_WS: 'GET_BY_PARENTID_ASC_OR_DESC',
          DISABLE_FORM_EDIT: 'delete'
        },
        {
          ID: 'list_item_rfid_input_results',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.rfid_input_result.general`, defaultMessage: `${config.labelBasePath}.main.rfid_input_result.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.rfid_input_result.general`, defaultMessage: `${config.labelBasePath}.main.rfid_input_result.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.rfid_input_result.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.rfid_input_result.general`
            },
          FUNCTION: 'grid',
          TYPE: 'RFID_INPUT_RESULT',
          CUSTOM_WS: 'GET_BYPARENTID',
          DISABLE_EDIT: true,
          DISABLE_FORM_EDIT: true
        }
      ]
    },

    SIDE_MENU_RFID_INPUT_FVIRO: {
      LIST_OF_ITEMS: [
        {
          ID: 'list_item_rfid',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.rfid`, defaultMessage: `${config.labelBasePath}.main.rfid` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.rfid`, defaultMessage: `${config.labelBasePath}.main.rfid` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.rfid`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.rfid`
            },
          FUNCTION: 'form',
          TYPE: 'RFID_INPUT',
          INPUT_WRAPPER: 'RfidFormInputWrapper'
        },
        {
          ID: 'list_item_rfid_input_state',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.rfid_input_state.general`, defaultMessage: `${config.labelBasePath}.main.rfid_input_state.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.rfid_input_state.general`, defaultMessage: `${config.labelBasePath}.main.rfid_input_state.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.rfid_input_state.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.rfid_input_state.general`
            },
          FUNCTION: 'grid',
          TYPE: 'RFID_INPUT_STATE',
          CUSTOM_WS: 'GET_BY_PARENTID_ASC_OR_DESC',
          DISABLE_FORM_EDIT: 'delete'
        },
        {
          ID: 'list_item_rfid_input_results',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.rfid_input_result.general`, defaultMessage: `${config.labelBasePath}.main.rfid_input_result.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.rfid_input_result.general`, defaultMessage: `${config.labelBasePath}.main.rfid_input_result.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.rfid_input_result.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.rfid_input_result.general`
            },
          FUNCTION: 'grid',
          TYPE: 'RFID_INPUT_RESULT',
          CUSTOM_WS: 'GET_BYPARENTID',
          DISABLE_EDIT: true,
          DISABLE_FORM_EDIT: true
        }
      ]
    },

    SIDE_MENU_INVENTORY_ITEM: {
      LIST_OF_ITEMS: [
        {
          ID: 'list_item_inv_item',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.inv_item`, defaultMessage: `${config.labelBasePath}.main.inv_item` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.inv_item`, defaultMessage: `${config.labelBasePath}.main.inv_item` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.inv_item`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.inv_item`
            },
          FUNCTION: 'form',
          TYPE: 'INVENTORY_ITEM',
          DISABLE_EDIT: true,
          DISABLE_FORM_EDIT: true
        }
      ]
    },
    SIDE_MENU_FLOCK: {
      LIST_OF_ITEMS: [
        {
          ID: 'list_item_flock_detail',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.flock.edit_flock_info`, defaultMessage: `${config.labelBasePath}.flock.edit_flock_info` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.flock.edit_flock_info`, defaultMessage: `${config.labelBasePath}.flock.edit_flock_info` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.flock.edit_flock_info`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.flock.edit_flock_info`
            },
          FUNCTION: 'form',
          TYPE: 'FLOCK',
          INPUT_WRAPPER: 'InputWSValidationWrapper'
          // SELECTED_BY_DEFAULT: true
        },
        {
          ID: 'list_item_flock_movement_detail',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.flock_movement.general2`, defaultMessage: `${config.labelBasePath}.main.flock_movement.general2` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.flock_movement.general2`, defaultMessage: `${config.labelBasePath}.main.flock_movement.general2` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.flock_movement.general2`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.flock_movement.general2`
            },
          FUNCTION: 'grid',
          TYPE: 'FLOCK_MOVEMENT',
          DISABLE_EDIT: true,
          DISABLE_FORM_EDIT: true,
          ISCONTAINER: false
          // HIDE_FOR_SUBMODULES: false,
          // DISABLE_EDIT_FOR_SUBMODULES: true
        }, {
          ID: 'list_item_vaccination_book',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.animal.vaccination_book`, defaultMessage: `${config.labelBasePath}.main.animal.vaccination_book` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.animal.vaccination_book`, defaultMessage: `${config.labelBasePath}.main.animal.vaccination_book` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.animal.vaccination_book`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.animal.vaccination_book`
            },
          FUNCTION: 'grid',
          TYPE: 'VACCINATION_BOOK',
          LINKNOTE: null,
          LINKEDTABLE: 'FLOCK',
          LINKNAME: 'FLOCK_VACC_BOOK',
          INPUT_WRAPPER: 'CombineHealthBookWrappers'
        },
        {
          ID: 'list_item_flock_history',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.animal.flock_history`, defaultMessage: `${config.labelBasePath}.main.animal.flock_history` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.animal.flock_history`, defaultMessage: `${config.labelBasePath}.main.animal.flock_history` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.animal.flock_history`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.animal.flock_history`
            },
          FUNCTION: 'grid',
          TYPE: 'FLOCK',
          CUSTOM_WS: 'GET_HISTORY',
          DISABLE_EDIT: true,
          DISABLE_FORM_EDIT: true,
          HIDE_FOR_SUBMODULES: false,
          DISABLE_EDIT_FOR_SUBMODULES: true
        }
      ]
    },

    SIDE_MENU_HERD: {
      LIST_OF_ITEMS: [
        {
          ID: 'list_item_herd_detail',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.herd.edit_herd_info`, defaultMessage: `${config.labelBasePath}.herd.edit_herd_info` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.herd.edit_herd_info`, defaultMessage: `${config.labelBasePath}.herd.edit_herd_info` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.herd.edit_herd_info`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.herd.edit_herd_info`
            },
          FUNCTION: 'form',
          TYPE: 'HERD',
          INPUT_WRAPPER: 'InputHerdWrapper'
        },
        {
          ID: 'list_item_herd_responsibles',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.herd.responsibles`, defaultMessage: `${config.labelBasePath}.main.herd.responsibles` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.herd.responsibles`, defaultMessage: `${config.labelBasePath}.main.herd.responsibles` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.herd.responsibles`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.herd.responsibles`
            },
          FUNCTION: 'grid',
          TYPE: 'HOLDING_RESPONSIBLE',
          CUSTOM_WS: 'GET_RESPONSIBLES_PER_HERD',
          DISABLE_ADD_ROW: true,
          DISABLE_FORM_EDIT: true
        },
        {
          ID: 'list_item_animals',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.animal.general`, defaultMessage: `${config.labelBasePath}.main.animal.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.animal.general`, defaultMessage: `${config.labelBasePath}.main.animal.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.animal.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.animal.general`
            },
          FUNCTION: 'grid',
          LINKNAME: 'ANIMAL_HERD',
          LINKNOTE: null,
          LINKEDTABLE: 'HERD',
          TYPE: 'ANIMAL',
          DISABLE_FORM_EDIT: true
        },
        {
          ID: 'list_item_herd_health_book',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.herd.health_book`, defaultMessage: `${config.labelBasePath}.main.herd.health_book` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.herd.health_book`, defaultMessage: `${config.labelBasePath}.main.herd.health_book` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.herd.health_book`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.herd.health_book`
            },
          FUNCTION: 'grid',
          TYPE: 'HERD_HEALTH_BOOK',
          CUSTOM_WS: 'GET_BYPARENTID',
          DISABLE_ADD_ROW: true
        },
        {
          ID: 'list_item_herd_lab_sample',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.lab_sample`, defaultMessage: `${config.labelBasePath}.main.lab_sample` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.lab_sample`, defaultMessage: `${config.labelBasePath}.main.lab_sample` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.lab_sample`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.lab_sample`
            },
          FUNCTION: 'grid',
          TYPE: 'LAB_SAMPLE',
          ISCONTAINER: true,
          MULTIGRID: { ITEMS: 2, CRITERIA: 'HERD_OBJ_ID,STATUS', FIRST_VALUE: 'COLLECTED', SECOUND_VALUE: 'NOTCOLLECTED', MAIN_CRIT: 'OBJECT_ID' },
          CUSTOM_WS: 'GET_TABLE_WITH_MULTIPLE_FILTERS'
        }
      ]
    },

    SIDE_MENU_VACCINATION_EVENT: {
      LIST_OF_ITEMS: [
        {
          ID: 'list_item_vaccination_event',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.vaccination_event.general`, defaultMessage: `${config.labelBasePath}.main.vaccination_event.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.vaccination_event.general`, defaultMessage: `${config.labelBasePath}.main.vaccination_event.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.vaccination_event.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.vaccination_event.general`
            },
          FUNCTION: 'form',
          TYPE: 'VACCINATION_EVENT',
          INPUT_WRAPPER: 'InputCampaignSecondLevelWrapper'
        }, {
          ID: 'list_item_vaccination_results',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.vaccination_event.vaccination_results`, defaultMessage: `${config.labelBasePath}.main.vaccination_event.vaccination_results` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.vaccination_event.vaccination_results`, defaultMessage: `${config.labelBasePath}.main.vaccination_event.vaccination_results` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.vaccination_event.vaccination_results`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.vaccination_event.vaccination_results`
            },
          FUNCTION: 'grid',
          TYPE: 'VACCINATION_RESULTS'
        }
      ]
    },

    SIDE_MENU_VACCINATION_EVENT_FVIRO: {
      LIST_OF_ITEMS: [
        {
          ID: 'list_item_vaccination_event',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.vaccination_event.general`, defaultMessage: `${config.labelBasePath}.main.vaccination_event.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.vaccination_event.general`, defaultMessage: `${config.labelBasePath}.main.vaccination_event.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.vaccination_event.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.vaccination_event.general`
            },
          FUNCTION: 'form',
          TYPE: 'VACCINATION_EVENT'
          // SELECTED_BY_DEFAULT: true
        }, {
          ID: 'list_item_vaccination_results',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.vaccination_event.vaccination_results`, defaultMessage: `${config.labelBasePath}.main.vaccination_event.vaccination_results` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.vaccination_event.vaccination_results`, defaultMessage: `${config.labelBasePath}.main.vaccination_event.vaccination_results` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.vaccination_event.vaccination_results`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.vaccination_event.vaccination_results`
            },
          FUNCTION: 'grid',
          TYPE: 'VACCINATION_RESULTS'
        }
      ]
    },
    SIDE_MENU_VACCINATION_EVENT_CVIRO: {
      LIST_OF_ITEMS: [
        {
          ID: 'list_item_vaccination_event',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.vaccination_event.general`, defaultMessage: `${config.labelBasePath}.main.vaccination_event.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.vaccination_event.general`, defaultMessage: `${config.labelBasePath}.main.vaccination_event.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.vaccination_event.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.vaccination_event.general`
            },
          FUNCTION: 'form',
          TYPE: 'VACCINATION_EVENT'
          // SELECTED_BY_DEFAULT: true
        }, {
          ID: 'list_item_vaccination_results',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.vaccination_event.vaccination_results`, defaultMessage: `${config.labelBasePath}.main.vaccination_event.vaccination_results` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.vaccination_event.vaccination_results`, defaultMessage: `${config.labelBasePath}.main.vaccination_event.vaccination_results` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.vaccination_event.vaccination_results`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.vaccination_event.vaccination_results`
            },
          FUNCTION: 'grid',
          TYPE: 'VACCINATION_RESULTS'
        }
      ]
    },
    SIDE_MENU_QUARANTINE: {
      LIST_OF_ITEMS: [
        {
          ID: 'list_item_quarantine_details',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.quarantine`, defaultMessage: `${config.labelBasePath}.main.quarantine` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.quarantine`, defaultMessage: `${config.labelBasePath}.main.quarantine` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.quarantine.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.quarantine.general`
            },
          FUNCTION: 'form',
          TYPE: 'QUARANTINE'
        },
        {
          ID: 'list_item_export_certificate',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.export_cert`, defaultMessage: `${config.labelBasePath}.main.export_cert` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.export_cert`, defaultMessage: `${config.labelBasePath}.main.export_cert` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.export_cert`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.export_cert`
            },
          FUNCTION: 'grid',
          TYPE: 'EXPORT_CERT',
          ISCONTAINER: true,
          INPUT_WRAPPER: 'InputSearchBIPWrapper',
          DISABLE_FOR: ['1']
        },
        {
          ID: 'list_item_disease',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.disease`, defaultMessage: `${config.labelBasePath}.main.disease` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.disease`, defaultMessage: `${config.labelBasePath}.main.disease` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.disease`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.disease`
            },
          FUNCTION: 'grid',
          LINKNAME: 'DISEASE_QUARANTINE',
          LINKNOTE: null,
          LINKEDTABLE: 'QUARANTINE',
          TYPE: 'DISEASE',
          DISABLE_FORM_EDIT: 'submit',
          DISABLE_FOR: ['0']
        },
        {
          ID: 'list_item_holding_details_quarantine',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.holding.general`, defaultMessage: `${config.labelBasePath}.main.holding.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.holding.general`, defaultMessage: `${config.labelBasePath}.main.holding.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.side_bar_farm_details`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.side_bar_farm_details`
            },
          FUNCTION: 'grid',
          LINKNAME: 'HOLDING_QUARANTINE',
          LINKNOTE: null,
          LINKEDTABLE: 'QUARANTINE',
          TYPE: 'HOLDING',
          DISABLE_FORM_EDIT: 'submit'
        }
      ],
      SUB_MODULES: {
        '0': {
          ID: 'export_quarantine',
          TYPE: '0'
        },
        '1': {
          ID: 'blacklist',
          TYPE: '1'
        }
      }
    },
    SIDE_MENU_AREA: {
      LIST_OF_ITEMS: [
        {
          ID: 'list_item_area_health',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.area_health.general`, defaultMessage: `${config.labelBasePath}.main.area_health.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.area_health.general`, defaultMessage: `${config.labelBasePath}.main.area_health.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.area_health.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.area_health.general`
            },
          FUNCTION: 'grid',
          TYPE: 'AREA_HEALTH',
          CUSTOM_DELETE: 'DELETE_TABLE_OBJECT_WITH_SAVE_CHECK'
        }
      ]
    },
    SIDE_MENU_POPULATION: {
      LIST_OF_ITEMS: [
        {
          ID: 'list_item_population_details',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.population.general`, defaultMessage: `${config.labelBasePath}.main.population.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.population.general`, defaultMessage: `${config.labelBasePath}.main.population.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.population.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.population.general`
            },
          FUNCTION: 'form',
          TYPE: 'POPULATION',
          INPUT_WRAPPER: 'PopulationFormSecondLevelInputWrapper'
        },
        {
          ID: 'list_item_area_population',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.area_filters`, defaultMessage: `${config.labelBasePath}.main.area_filters` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.area_filters`, defaultMessage: `${config.labelBasePath}.main.area_filters` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.area_filters`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.area_filters`
            },
          FUNCTION: 'grid',
          LINKNAME: 'AREA_POPULATION',
          LINKNOTE: null,
          LINKEDTABLE: 'POPULATION',
          TYPE: 'AREA',
          DISABLE_FORM_EDIT: 'delete',
          CUSTOM_DELETE: 'DROP_LINK_OBJECTS',
          INPUT_WRAPPER: 'PopulationAreaInputWrapper'
        }
      ]
    },
    SIDE_MENU_SAMPLE: {
      LIST_OF_ITEMS: [
        {
          ID: 'list_item_sample_details',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.sample.general`, defaultMessage: `${config.labelBasePath}.main.sample.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.sample.general`, defaultMessage: `${config.labelBasePath}.main.sample.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.sample.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.sample.general`
            },
          FUNCTION: 'form',
          TYPE: 'SAMPLE'
        },
        {
          ID: 'list_item_strat_filter',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.strat_filter.general`, defaultMessage: `${config.labelBasePath}.main.strat_filter.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.strat_filter.general`, defaultMessage: `${config.labelBasePath}.main.strat_filter.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.strat_filter.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.strat_filter.general`
            },
          FUNCTION: 'grid',
          TYPE: 'STRAT_FILTER'
        },
        {
          ID: 'list_item_selection_result1',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.selection_result.general`, defaultMessage: `${config.labelBasePath}.main.selection_result.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.selection_result.general`, defaultMessage: `${config.labelBasePath}.main.selection_result.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.selection_result.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.selection_result.general`
            },
          FUNCTION: 'grid',
          TYPE: 'SELECTION_RESULT',
          ISCONTAINER: true
        }
      ]
    },
    SIDE_MENU_EXPORT_CERT: {
      LIST_OF_ITEMS: [
        {
          ID: 'list_item_export_cert_details',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.export_cert.general`, defaultMessage: `${config.labelBasePath}.main.export_cert.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.export_cert.general`, defaultMessage: `${config.labelBasePath}.main.export_cert.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.export_cert.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.export_cert.general`
            },
          FUNCTION: 'form',
          TYPE: 'EXPORT_CERT',
          INPUT_WRAPPER: 'InputSearchBIPWrapper'
        },
        {
          ID: 'list_item_potential_animal',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.potential_animal`, defaultMessage: `${config.labelBasePath}.main.potential_animal` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.potential_animal`, defaultMessage: `${config.labelBasePath}.main.potential_animal` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.potential_animal`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.potential_animal`
            },
          FUNCTION: 'grid',
          TYPE: 'ANIMAL_QUARANTINE',
          ISCONTAINER: true,
          ACTIONS_ENABLED: ['pendingExport'],
          MULTIGRID: { ITEMS: 2, CRITERIA: 'STATUS', FIRST_VALUE: 'VALID', SECOUND_VALUE: 'RETIRED' },
          DISABLE_EDIT_FOR_SUBMODULES: true
        },
        {
          ID: 'list_item_certificate_animal',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.certified_animal`, defaultMessage: `${config.labelBasePath}.main.certified_animal` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.certified_animal`, defaultMessage: `${config.labelBasePath}.main.certified_animal` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.certified_animal`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.certified_animal`
            },
          FUNCTION: 'grid',
          TYPE: 'ANIMAL',
          LINKNAME: 'ANIMAL_EXPORT_CERT',
          LINKEDTABLE: 'EXPORT_CERT',
          DISABLE_EDIT_FOR_SUBMODULES: true
        },
        {
          ID: 'list_item_activity_animal',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.activity_animal`, defaultMessage: `${config.labelBasePath}.main.activity_animal` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.activity_animal`, defaultMessage: `${config.labelBasePath}.main.activity_animal` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.activity_animal`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.activity_animal`
            },
          FUNCTION: 'grid',
          DISABLE_EDIT: true,
          TYPE: 'ANIMAL_ACTIVITY'
        },
        {
          ID: 'list_item_origin_animal',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.origin_animal`, defaultMessage: `${config.labelBasePath}.main.origin_animal` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.origin_animal`, defaultMessage: `${config.labelBasePath}.main.origin_animal` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.origin_animal`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.origin_animal`
            },
          FUNCTION: 'grid',
          DISABLE_EDIT: true,
          TYPE: 'ANIMAL_ORIGIN'
        }
      ]
    },

    SIDE_MENU_SVAROG_ORG_UNITS: {
      LIST_OF_ITEMS: [
        {
          ID: 'list_ivinventory_item',
          CUSTOM_ID: 'INVENTORY_ITEM',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.inventory_item.general`, defaultMessage: `${config.labelBasePath}.main.inventory_item.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.inventory_item.general`, defaultMessage: `${config.labelBasePath}.main.inventory_item.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.inventory_item.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.inventory_item.general`
            },
          FUNCTION: 'search',
          COLUMN: 'PARENT_ID',
          VALUE_FOR_COL: 'OBJECT_ID',
          TYPE: 'INVENTORY_ITEM',
          DISABLE_FORM_EDIT: 'closeAndDelete',
          DISABLE_EDIT_FOR_SUBMODULES: 'closeAndDelete',
          INPUT_WRAPPER: 'CombineDisableAndInvItemInputsWrapper'
        },
        {
          ID: 'list_item_income_transfer',
          CUSTOM_ID: 'TRANSFER_INCOME',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.org_units.income_transfer`, defaultMessage: `${config.labelBasePath}.main.org_units.income_transfer` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.org_units.income_transfer`, defaultMessage: `${config.labelBasePath}.main.org_units.income_transfer` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.org_units.income_transfer`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.org_units.income_transfer`
            },
          FUNCTION: 'grid',
          TYPE: 'TRANSFER',
          CUSTOM_WS: 'GET_TABLE_WITH_MULTIPLE_FILTERS_SORTED',
          // DISABLE_EDIT: true,
          DISABLE_FORM_EDIT: true,
          DISABLE_ADD_ROW: true
          // CUSTOM_ROW_SELECT: true
        },
        {
          ID: 'list_item_outcome_transfer',
          CUSTOM_ID: 'TRANSFER_OUTCOME',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.org_units.outcome_transfer`, defaultMessage: `${config.labelBasePath}.main.org_units.outcome_transfer` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.org_units.outcome_transfer`, defaultMessage: `${config.labelBasePath}.main.org_units.outcome_transfer` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.org_units.outcome_transfer`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.org_units.outcome_transfer`
            },
          FUNCTION: 'grid',
          TYPE: 'TRANSFER',
          CUSTOM_WS: 'GET_TABLE_WITH_MULTIPLE_FILTERS_SORTED',
          DISABLE_FORM_EDIT: true,
          DISABLE_ADD_ROW: true
        },
        {
          ID: 'list_item_order',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.svarg_org_units.order`, defaultMessage: `${config.labelBasePath}.main.svarg_org_units.order` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.svarg_org_units.order`, defaultMessage: `${config.labelBasePath}.main.svarg_org_units.order` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.svarg_org_units.order`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.svarg_org_units.order`
            },
          FUNCTION: 'grid',
          TYPE: 'ORDER',
          ISCONTAINER: true,
          ACTIONS_ENABLED: ['change_status'],
          DISABLE_FOR: ['MUNICIPALITY_OFFICE', 'REGIONAL_OFFICE', 'COMMUNITY_OFFICE', 'VILLAGE_OFFICE'],
          INPUT_WRAPPER: 'InputArrivalWrapper'
        }
      ],
      SUB_MODULES: {
        'HEADQUARTER': {
          ID: 'headquarter',
          TYPE: 'HEADQUARTER'
        },
        'MUNICIPALITY_OFFICE': {
          ID: 'municipality_office',
          TYPE: 'MUNICIPALITY_OFFICE'
        },
        'REGIONAL_OFFICE': {
          ID: 'regional_office',
          TYPE: 'REGIONAL_OFFICE'
        }
      }
    },
    SIDE_MENU_ORDER: {
      LIST_OF_ITEMS: [
        {
          ID: 'list_item_order',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.order.general`, defaultMessage: `${config.labelBasePath}.main.order.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.order.general`, defaultMessage: `${config.labelBasePath}.main.order.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.order.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.order.general`
            },
          FUNCTION: 'form',
          TYPE: 'ORDER',
          INPUT_WRAPPER: 'InputArrivalWrapper'
        }, {
          ID: 'list_item_supplier',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.order.supplier`, defaultMessage: `${config.labelBasePath}.main.order.supplier` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.order.supplier`, defaultMessage: `${config.labelBasePath}.main.order.supplier` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.order.supplier`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.order.supplier`
            },
          FUNCTION: 'grid',
          LINKNOTE: null,
          LINKEDTABLE: 'ORDER',
          LINKNAME: 'SUPPLY',
          TYPE: 'SUPPLIER'
        },
        {
          ID: 'list_item_range',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.order.range`, defaultMessage: `${config.labelBasePath}.main.order.range` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.order.range`, defaultMessage: `${config.labelBasePath}.main.order.range` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.order.range`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.order.range`
            },
          FUNCTION: 'grid',
          TYPE: 'RANGE',
          ACTIONS_ENABLED: ['generate_inventory_item'],
          // DISABLE_FORM_EDIT: 'delete',
          CUSTOM_DELETE: 'DELETE_TABLE_OBJECT_WITH_SAVE_CHECK',
          INPUT_WRAPPER: 'RangeValidationWrapper'
        }
      ]
    },
    SIDE_MENU_LABORATORY: {
      LIST_OF_ITEMS: [
        {
          ID: 'list_item_laboratory',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.laboratory`, defaultMessage: `${config.labelBasePath}.main.laboratory` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.laboratory`, defaultMessage: `${config.labelBasePath}.main.laboratory` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.laboratory`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.laboratory`
            },
          FUNCTION: 'form',
          TYPE: 'LABORATORY'
        },
        {
          ID: 'list_item_lab_sample',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.lab_sample`, defaultMessage: `${config.labelBasePath}.main.lab_sample` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.lab_sample`, defaultMessage: `${config.labelBasePath}.main.lab_sample` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.lab_sample`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.lab_sample`
            },
          FUNCTION: 'grid',
          TYPE: 'LAB_SAMPLE',
          LINKNAME: 'LABORATORY_SAMPLE',
          LINKEDTABLE: 'LABORATORY',
          ISCONTAINER: true,
          ACTIONS_ENABLED: ['change_the_status_of_lab_sample'],
          MULTIGRID: { ITEMS: 2, CRITERIA: 'STATUS', FIRST_VALUE: 'QUEUED', SECOUND_VALUE: 'RECEIVED,REJECTED' },
          CUSTOM_WS: 'GET_BYLINK_PER_STATUSES'
        }
      ]
    },

    SIDE_MENU_LABORATORY_LABORANT: {
      LIST_OF_ITEMS: [
        {
          ID: 'list_item_laboratory',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.laboratory`, defaultMessage: `${config.labelBasePath}.main.laboratory` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.laboratory`, defaultMessage: `${config.labelBasePath}.main.laboratory` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.laboratory`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.laboratory`
            },
          FUNCTION: 'form',
          TYPE: 'LABORATORY',
          ACTIONS_ENABLED: ['change_the_status_of_lab_sample'],
          // MULTIGRID: { ITEMS: 2, CRITERIA: 'STATUS', FIRST_VALUE: 'QUEUED', SECOUND_VALUE: 'REJECTED' },
          CUSTOM_WS: 'SHOW_LABORATORY_PER_USER'
        },
        {
          ID: 'list_item_lab_sample',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.lab_sample`, defaultMessage: `${config.labelBasePath}.main.lab_sample` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.lab_sample`, defaultMessage: `${config.labelBasePath}.main.lab_sample` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.lab_sample`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.lab_sample`
            },
          FUNCTION: 'grid',
          TYPE: 'LAB_SAMPLE',
          LINKNAME: 'LABORATORY_SAMPLE',
          LINKEDTABLE: 'LABORATORY',
          ISCONTAINER: true,
          ACTIONS_ENABLED: ['change_the_status_of_lab_sample', 'set_health_status_to_results'],
          MULTIGRID: { ITEMS: 2, CRITERIA: 'STATUS', FIRST_VALUE: 'QUEUED, RECEIVED', SECOUND_VALUE: 'REJECTED, PROCESSED' },
          CUSTOM_WS: 'GET_BYLINK_PER_STATUSES'
        }
      ]
    },

    SIDE_MENU_LAB_TEST_TYPE_LABORANT: {
      LIST_OF_ITEMS: [
        {
          ID: 'list_item_lab_test_type',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.lab_test_type`, defaultMessage: `${config.labelBasePath}.main.lab_test_type` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.lab_test_type`, defaultMessage: `${config.labelBasePath}.main.lab_test_type` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.lab_test_type`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.lab_test_type`
            },
          FUNCTION: 'form',
          TYPE: 'LAB_TEST_TYPE',
          DISABLE_FORM_EDIT: true
        }
      ]
    },

    SIDE_MENU_LAB_TEST_TYPE: {
      LIST_OF_ITEMS: [
        {
          ID: 'list_item_lab_test_type',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.lab_test_type`, defaultMessage: `${config.labelBasePath}.main.lab_test_type` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.lab_test_type`, defaultMessage: `${config.labelBasePath}.main.lab_test_type` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.lab_test_type`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.lab_test_type`
            },
          FUNCTION: 'form',
          TYPE: 'LAB_TEST_TYPE',
          DISABLE_FORM_EDIT: true
        }
      ]
    },

    SIDE_MENU_MOVEMENT_DOC: {
      LIST_OF_ITEMS: [
        {
          ID: 'animal_movements',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.form_labels.animal_movement.general`, defaultMessage: `${config.labelBasePath}.form_labels.animal_movement.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.form_labels.animal_movement.general`, defaultMessage: `${config.labelBasePath}.form_labels.animal_movement.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.form_labels.animal_movement.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.form_labels.help.animal_movement.general`
            },
          FUNCTION: 'grid',
          TYPE: 'ANIMAL_MOVEMENT',
          CUSTOM_WS: 'GET_TABLE_WITH_LIKE_FILTER',
          SEARCH_PARAMS: { SEARCH_CRITERIA: 'MOVEMENT_DOC_ID', SEARCH_VALUE: 'CUSTOM' },
          DISABLE_SELECT_ROW: true,
          DISABLE_EDIT: true,
          DISABLE_FORM_EDIT: true
        },
        {
          ID: 'flock_movements',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.form_labels.flock_movement.general`, defaultMessage: `${config.labelBasePath}.form_labels.flock_movement.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.form_labels.flock_movement.general`, defaultMessage: `${config.labelBasePath}.form_labels.flock_movement.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.form_labels.flock_movement.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.form_labels.help.flock_movement.general`
            },
          FUNCTION: 'grid',
          TYPE: 'FLOCK_MOVEMENT',
          CUSTOM_WS: 'GET_TABLE_WITH_LIKE_FILTER',
          SEARCH_PARAMS: { SEARCH_CRITERIA: 'MOVEMENT_DOC_ID', SEARCH_VALUE: 'CUSTOM' },
          DISABLE_SELECT_ROW: true,
          DISABLE_EDIT: true,
          DISABLE_FORM_EDIT: true
        },
        {
          ID: 'herd_movements',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.form_labels.herd_movement.general`, defaultMessage: `${config.labelBasePath}.form_labels.herd_movement.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.form_labels.herd_movement.general`, defaultMessage: `${config.labelBasePath}.form_labels.herd_movement.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.form_labels.herd_movement.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.form_labels.help.herd_movement.general`
            },
          FUNCTION: 'grid',
          TYPE: 'HERD_MOVEMENT',
          CUSTOM_WS: 'GET_TABLE_WITH_LIKE_FILTER',
          SEARCH_PARAMS: { SEARCH_CRITERIA: 'MOVEMENT_DOC_ID', SEARCH_VALUE: 'CUSTOM' },
          DISABLE_SELECT_ROW: true,
          DISABLE_EDIT: true,
          DISABLE_FORM_EDIT: true
        },
        {
          ID: 'list_item_movement_block',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.movement_doc_block.general`, defaultMessage: `${config.labelBasePath}.main.movement_doc_block.general` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.movement_doc_block.general`, defaultMessage: `${config.labelBasePath}.main.movement_doc_block.general` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.movement_doc_block.general`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.movement_doc_block.general`
            },
          FUNCTION: 'grid',
          TYPE: 'MOVEMENT_DOC_BLOCK',
          DISABLE_SELECT_ROW: true,
          DISABLE_EDIT: true,
          DISABLE_FORM_EDIT: true
        }
      ]
    },

    // admin console object submenus

    SIDE_MENU_SVAROG_USERS: {
      LIST_OF_ITEMS: [
        {
          ID: 'list_item_user',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.svarog_user`, defaultMessage: `${config.labelBasePath}.main.svarog_user` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.svarog_user`, defaultMessage: `${config.labelBasePath}.main.svarog_user` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.svarog_user`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.svarog_user`
            },
          FUNCTION: 'form',
          TYPE: 'SVAROG_USERS',
          INPUT_WRAPPER: 'UserFormCharLimitationInputWrapper'
        },
        {
          ID: 'list_item_user_groups',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.additional_user_group`, defaultMessage: `${config.labelBasePath}.main.additional_user_group` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.additional_user_group`, defaultMessage: `${config.labelBasePath}.main.additional_user_group` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.additional_user_group`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.additional_user_group`
            },
          FUNCTION: 'grid',
          TYPE: 'SVAROG_USER_GROUPS',
          CUSTOM_WS: 'GET_LINKED_USER_GROUPS_PER_USER',
          DISABLE_FORM_EDIT: true
        },
        {
          ID: 'list_item_svarog_org_units',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.svarog_org_units_admconsole`, defaultMessage: `${config.labelBasePath}.main.svarog_org_units_admconsole` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.svarog_org_units_admconsole`, defaultMessage: `${config.labelBasePath}.main.svarog_org_units_admconsole` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.svarog_org_units_admconsole`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.svarog_org_units_admconsole`
            },
          FUNCTION: 'grid',
          LINKNAME: 'POA',
          LINKNOTE: null,
          LINKEDTABLE: 'SVAROG_USERS',
          TYPE: 'SVAROG_ORG_UNITS',
          DISABLE_FORM_EDIT: 'delete',
          CUSTOM_DELETE: 'DROP_LINK_OBJECTS',
          INPUT_WRAPPER: 'DisableDeleteAdmConsoleWrapper'
        },
        {
          ID: 'list_item_laboratory',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.laboratory`, defaultMessage: `${config.labelBasePath}.main.laboratory` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.laboratory`, defaultMessage: `${config.labelBasePath}.main.laboratory` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.laboratory`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.laboratory`
            },
          FUNCTION: 'grid',
          LINKNAME: 'POA',
          LINKNOTE: null,
          LINKEDTABLE: 'SVAROG_USERS',
          TYPE: 'LABORATORY',
          DISABLE_FORM_EDIT: 'delete',
          CUSTOM_DELETE: 'DROP_LINK_OBJECTS',
          INPUT_WRAPPER: 'DisableDeleteAdmConsoleWrapper'
        },
        {
          ID: 'list_item_holding',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.holding`, defaultMessage: `${config.labelBasePath}.main.holding` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.holding`, defaultMessage: `${config.labelBasePath}.main.holding` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.holding`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.holding`
            },
          FUNCTION: 'grid',
          LINKNAME: 'CUSTOM_POA',
          LINKNOTE: null,
          LINKEDTABLE: 'SVAROG_USERS',
          TYPE: 'HOLDING',
          DISABLE_FORM_EDIT: 'delete',
          CUSTOM_DELETE: 'DROP_LINK_OBJECTS',
          INPUT_WRAPPER: 'DisableDeleteAdmConsoleWrapper'
        }
      ]
    },
    SIDE_MENU_SVAROG_USER_GROUPS: {
      LIST_OF_ITEMS: [
        {
          ID: 'list_item_user_group',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.svarog_user_group`, defaultMessage: `${config.labelBasePath}.main.svarog_user_group` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.svarog_user_group`, defaultMessage: `${config.labelBasePath}.main.svarog_user_group` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.svarog_user_group`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.svarog_user_group`
            },
          FUNCTION: 'form',
          TYPE: 'SVAROG_USER_GROUPS'
          // SELECTED_BY_DEFAULT: true
        },
        {
          ID: 'list_item_additional_user',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.additional_users`, defaultMessage: `${config.labelBasePath}.main.additional_users` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.additional_users`, defaultMessage: `${config.labelBasePath}.main.additional_users` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.additional_users`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.additional_users`
            },
          FUNCTION: 'grid',
          TYPE: 'SVAROG_USERS',
          LINKNOTE: null,
          LINKEDTABLE: 'SVAROG_USER_GROUPS',
          LINKNAME: 'USER_GROUP',
          DISABLE_FORM_EDIT: 'delete',
          ACTIONS_ENABLED: ['unassign_user']
        }
      ]
    },
    SIDE_MENU_SVAROG_CODES: {
      LIST_OF_ITEMS: [
        {
          ID: 'list_item_svarog_codes',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.svarog_codes`, defaultMessage: `${config.labelBasePath}.main.svarog_codes` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.svarog_codes`, defaultMessage: `${config.labelBasePath}.main.svarog_codes` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.svarog_codes`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.svarog_codes`
            },
          FUNCTION: 'form',
          TYPE: 'SVAROG_CODES'
        },
        {
          ID: 'list_item_svarog_codes_children',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.svarog_codes_children`, defaultMessage: `${config.labelBasePath}.main.svarog_codes_children` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.svarog_codes_children`, defaultMessage: `${config.labelBasePath}.main.svarog_codes_children` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.svarog_codes_children`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.svarog_codes_children`
            },
          FUNCTION: 'grid',
          TYPE: 'SVAROG_CODES'
        }
      ]
    },
    SIDE_MENU_SVAROG_NOTIFICATION: {
      LIST_OF_ITEMS: [
        {
          ID: 'list_item_notification',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.notification`, defaultMessage: `${config.labelBasePath}.main.notification` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.notification`, defaultMessage: `${config.labelBasePath}.main.notification` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.notification`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.notification`
            },
          FUNCTION: 'form',
          TYPE: 'SVAROG_NOTIFICATION'
        },
        {
          ID: 'list_item_svarog_users_notification',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.svarog_users_notification`, defaultMessage: `${config.labelBasePath}.main.svarog_users_notification` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.svarog_users_notification`, defaultMessage: `${config.labelBasePath}.main.svarog_users_notification` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.svarog_users_notification`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.svarog_users_notification`
            },
          FUNCTION: 'grid',
          TYPE: 'SVAROG_USERS',
          LINKNAME: 'LINK_NOTIFICATION_USER',
          LINKNOTE: null,
          LINKEDTABLE: 'SVAROG_NOTIFICATION',
          DISABLE_EDIT: true,
          DISABLE_FORM_EDIT: true
        },
        {
          ID: 'list_item_svarog_user_groups_notification',
          ...context
            ? {
              LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.svarog_user_groups_notification`, defaultMessage: `${config.labelBasePath}.main.svarog_user_groups_notification` }),
              FLOATHELPER: context.formatMessage({ id: `${config.labelBasePath}.main.svarog_user_groups_notification`, defaultMessage: `${config.labelBasePath}.main.svarog_user_groups_notification` })
            }
            : {
              LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.svarog_user_groups_notification`,
              FLOATHELPER: `CONTEXT_MISSING_${config.labelBasePath}.main.help.svarog_user_groups_notification`
            },
          FUNCTION: 'grid',
          TYPE: 'SVAROG_USER_GROUPS',
          LINKNAME: 'LINK_NOTIFICATION_GROUP',
          LINKNOTE: null,
          LINKEDTABLE: 'SVAROG_NOTIFICATION',
          DISABLE_EDIT: true,
          DISABLE_FORM_EDIT: true
        }
      ]
    }
  }

  return sideMenuTypes[requestedSideMenu]
}
