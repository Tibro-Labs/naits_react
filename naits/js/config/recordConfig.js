import * as config from 'config/config'
import { getHoldingPicAction, getHoldingPerExportQuarantine } from 'backend/getHoldingPicAction'
import { getOrgUnitByObjectId } from 'backend/getOrgUnitByObjectId'
import { translateCodeAction } from 'backend/translateCodeAction'

export default function recordConfig (selectedItem, context) {
  const recordTypes = {
    /*
      Selected item data goes in Record info
    */
    HOLDING: {
      CHOSEN_ITEM: [
        {
          ID: 'NAME',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.form_labels.holding.name`, defaultMessage: `${config.labelBasePath}.form_labels.holding.name` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.form_labels.holding.name` },
          VALUE: 'HOLDING.NAME'
        }, {
          ID: 'STATUS',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.record_info.holding_status`, defaultMessage: `${config.labelBasePath}.record_info.holding_status` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.record_info.holding_status` },
          VALUE: 'HOLDING.STATUS'
        }, {
          ID: 'TYPE',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.form_labels.holding.type`, defaultMessage: `${config.labelBasePath}.form_labels.holding.type` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.form_labels.holding.type` },
          VALUE: 'HOLDING.TYPE',
          ITEM_FUNC: translateCodeAction
        },
        {
          ID: 'PIC',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.holding.pic`, defaultMessage: `${config.labelBasePath}.main.holding.pic` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.holding.pic` },
          VALUE: 'HOLDING.PIC'
        }, {
          ID: 'PHYSICAL_ADDRESS',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.side_bar_holding_address`, defaultMessage: `${config.labelBasePath}.main.side_bar_holding_address` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.side_bar_holding_address` },
          VALUE: 'HOLDING.PHYSICAL_ADDRESS'
        }
      ],
      ICON: 'icon-th'
    },

    ANIMAL: {
      CHOSEN_ITEM: [
        {
          ID: 'ANIMAL_ID',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.animal.animal_id`, defaultMessage: `${config.labelBasePath}.main.animal.animal_id` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.animal.animal_id` },
          VALUE: 'ANIMAL.ANIMAL_ID'
        }, {
          ID: 'ANIMAL_CLASS',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.animal_animal_class`, defaultMessage: `${config.labelBasePath}.main.animal_animal_class` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.animal_animal_class` },
          VALUE: 'ANIMAL.ANIMAL_CLASS',
          ITEM_FUNC: translateCodeAction
        }, {
          ID: 'ANIMAL_RACE',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.animal_animal_race`, defaultMessage: `${config.labelBasePath}.main.animal_animal_race` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.animal_animal_race` },
          VALUE: 'ANIMAL.ANIMAL_RACE',
          ITEM_FUNC: translateCodeAction
        }, {
          ID: 'GENDER',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.animal_gender`, defaultMessage: `${config.labelBasePath}.main.animal_gender` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.animal_gender` },
          VALUE: 'ANIMAL.GENDER',
          ITEM_FUNC: translateCodeAction
        }, {
          ID: 'STATUS',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.animal_status`, defaultMessage: `${config.labelBasePath}.main.animal_status` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.animal_status` },
          VALUE: 'ANIMAL.STATUS'
        }, {
          ID: 'HOLDING_PIC',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.form_labels.pic`, defaultMessage: `${config.labelBasePath}.form_labels.pic` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.form_labels.pic` },
          VALUE: 'ANIMAL.HOLDING_PIC',
          LINK_TO_PARRENT_BY: 'PIC',
          LINK_TO_TABLE: 'HOLDING',
          ITEM_FUNC: getHoldingPicAction
        }
      ],
      ICON: 'icon-magnet'
    },

    PET: {
      CHOSEN_ITEM: [
        {
          ID: 'PET_TAG_ID',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.pet.pet_tag_id`, defaultMessage: `${config.labelBasePath}.main.pet.pet_tag_id` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.pet.pet_tag_id` },
          VALUE: 'PET.PET_TAG_ID'
        },
        {
          ID: 'PET_ID',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.pet.pet_id`, defaultMessage: `${config.labelBasePath}.main.pet.pet_id` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.pet.pet_id` },
          VALUE: 'PET.PET_ID'
        }, {
          ID: 'GENDER',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.pet_gender`, defaultMessage: `${config.labelBasePath}.main.pet_gender` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.pet_gender` },
          VALUE: 'PET.PET_GENDER',
          ITEM_FUNC: translateCodeAction
        }, {
          ID: 'PET_TYPE',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.pet_type`, defaultMessage: `${config.labelBasePath}.main.pet_type` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.pet_type` },
          VALUE: 'PET.PET_TYPE',
          ITEM_FUNC: translateCodeAction
        }, {
          ID: 'PET_SIZE_CATEGORY',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.pet_size`, defaultMessage: `${config.labelBasePath}.main.pet_size` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.pet_size` },
          VALUE: 'PET.PET_SIZE_CATEGORY',
          ITEM_FUNC: translateCodeAction
        }, {
          ID: 'PET_TAG_TYPE',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.pet_tag_type`, defaultMessage: `${config.labelBasePath}.main.pet_tag_type` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.pet_tag_type` },
          VALUE: 'PET.PET_TAG_TYPE',
          ITEM_FUNC: translateCodeAction
        }, {
          ID: 'STATUS',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.pet_status`, defaultMessage: `${config.labelBasePath}.main.pet_status` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.pet_status` },
          VALUE: 'PET.STATUS'
        }, {
          ID: 'HOLDING_PIC',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.form_labels.pic`, defaultMessage: `${config.labelBasePath}.form_labels.pic` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.form_labels.pic` },
          VALUE: 'PET.HOLDING_PIC',
          LINK_TO_PARRENT_BY: 'PIC',
          LINK_TO_TABLE: 'HOLDING',
          ITEM_FUNC: getHoldingPicAction
        }
      ],
      ICON: 'icon-magnet'
    },

    STRAY_PET: {
      CHOSEN_ITEM: [
        {
          ID: 'PET_ID',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.stray_pet.pet_id`, defaultMessage: `${config.labelBasePath}.grid_labels.stray_pet.pet_id` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.stray_pet.pet_id` },
          VALUE: 'STRAY_PET.PET_ID'
        }, {
          ID: 'PET_TYPE',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.stray_pet.pet_type`, defaultMessage: `${config.labelBasePath}.grid_labels.stray_pet.pet_type` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.stray_pet.pet_type` },
          VALUE: 'STRAY_PET.PET_TYPE',
          ITEM_FUNC: translateCodeAction
        }, {
          ID: 'PET_TAG_TYPE',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.stray_pet.pet_tag_type`, defaultMessage: `${config.labelBasePath}.grid_labels.stray_pet.pet_tag_type` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.stray_pet.pet_tag_type` },
          VALUE: 'STRAY_PET.PET_TAG_TYPE',
          ITEM_FUNC: translateCodeAction
        }, {
          ID: 'CHIPPED_BEFORE',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.stray_pet.chipped_before`, defaultMessage: `${config.labelBasePath}.grid_labels.stray_pet.chipped_before` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.stray_pet.chipped_before` },
          VALUE: 'STRAY_PET.CHIPPED_BEFORE',
          ITEM_FUNC: translateCodeAction
        }, {
          ID: 'TAGGET_BEFORE',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.stray_pet.tagget_before`, defaultMessage: `${config.labelBasePath}.grid_labels.stray_pet.tagget_before` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.stray_pet.tagget_before` },
          VALUE: 'STRAY_PET.TAGGET_BEFORE',
          ITEM_FUNC: translateCodeAction
        }
      ],
      ICON: 'icon-magnet'
    },

    HOLDING_RESPONSIBLE: {
      CHOSEN_ITEM: [
        {
          ID: 'FULL_NAME',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.form_labels.full_name`, defaultMessage: `${config.labelBasePath}.form_labels.full_name` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.form_labels.full_name` },
          VALUE: 'HOLDING_RESPONSIBLE.FULL_NAME'
        }, {
          ID: 'EMAIL',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.form_labels.email`, defaultMessage: `${config.labelBasePath}.form_labels.email` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.form_labels.email` },
          VALUE: 'HOLDING_RESPONSIBLE.EMAIL'
        }, {
          ID: 'STATUS',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.form_labels.status`, defaultMessage: `${config.labelBasePath}.form_labels.status` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.form_labels.status` },
          VALUE: 'HOLDING_RESPONSIBLE.STATUS'
        }, {
          ID: 'ADDRESS',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.form_labels.address`, defaultMessage: `${config.labelBasePath}.form_labels.address` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.form_labels.address` },
          VALUE: 'HOLDING_RESPONSIBLE.ADDRESS'
        }, {
          ID: 'PHONE_NUMBER',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.form_labels.phone_number`, defaultMessage: `${config.labelBasePath}.form_labels.phone_number` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.form_labels.phone_number` },
          VALUE: 'HOLDING_RESPONSIBLE.PHONE_NUMBER'
        }, {
          ID: 'MOBILE_NUMBER',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.form_labels.mobile_number`, defaultMessage: `${config.labelBasePath}.form_labels.mobile_number` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.form_labels.mobile_number` },
          VALUE: 'HOLDING_RESPONSIBLE.MOBILE_NUMBER'
        }
      ],
      ICON: 'icon-building'
    },

    VACCINATION_EVENT: {
      CHOSEN_ITEM: [
        {
          ID: 'CAMPAIGN_NAME',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.vaccination_campaign_name`, defaultMessage: `${config.labelBasePath}.main.vaccination_campaign_name` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.vaccination_campaign_name` },
          VALUE: 'VACCINATION_EVENT.CAMPAIGN_NAME'
        }, {
          ID: 'NOTE',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.vaccination_note`, defaultMessage: `${config.labelBasePath}.main.vaccination_note` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.vaccination_note` },
          VALUE: 'VACCINATION_EVENT.NOTE'
        }, {
          ID: 'EVENT_START',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.vaccination_event_start`, defaultMessage: `${config.labelBasePath}.main.vaccination_event_start` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.vaccination_event_start` },
          VALUE: 'VACCINATION_EVENT.EVENT_START'
        }, {
          ID: 'EVENT_END',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.vaccination_event_end`, defaultMessage: `${config.labelBasePath}.main.vaccination_event_end` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.vaccination_event_end` },
          VALUE: 'VACCINATION_EVENT.EVENT_END'
        }
      ],
      ICON: 'icon-medkit'
    },

    VACCINATION_BOOK: {
      CHOSEN_ITEM: [
        {
          ID: 'VACC_DATE',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.vaccination_event.vacc_date`, defaultMessage: `${config.labelBasePath}.grid_labels.vaccination_event.vacc_date` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.vaccination_event.vacc_date` },
          VALUE: 'VACCINATION_BOOK.VACC_DATE'
        },
        {
          ID: 'CAMPAIGN_NAME',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.vaccination_event.campaign_name`, defaultMessage: `${config.labelBasePath}.grid_labels.vaccination_event.campaign_name` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.vaccination_event.campaign_name` },
          VALUE: 'VACCINATION_BOOK.CAMPAIGN_NAME'
        },
        {
          ID: 'REGISTRATION_DATE',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.vacc_book.registration_date`, defaultMessage: `${config.labelBasePath}.grid_labels.vacc_book.registration_date` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.vacc_book.registration_date` },
          VALUE: 'VACCINATION_BOOK.REGISTRATION_DATE'
        },
        {
          ID: 'VET_OFFICER',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.form_labels.vet_officer`, defaultMessage: `${config.labelBasePath}.form_labels.vet_officer` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.form_labels.vet_officer` },
          VALUE: 'VACCINATION_BOOK.VET_OFFICER'
        }
      ],
      ICON: 'icon-medkit'
    },

    LAB_SAMPLE: {
      CHOSEN_ITEM: [
        {
          ID: 'SAMPLE_ID',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.sample_id`, defaultMessage: `${config.labelBasePath}.main.sample_id` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.sample_id` },
          VALUE: 'LAB_SAMPLE.SAMPLE_ID'
        },
        {
          ID: 'SAMPLE_TYPE',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.sample_type`, defaultMessage: `${config.labelBasePath}.main.sample_type` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.sample_type` },
          VALUE: 'LAB_SAMPLE.SAMPLE_TYPE',
          ITEM_FUNC: translateCodeAction
        },
        {
          ID: 'LABORATORY_NAME',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.lab_name`, defaultMessage: `${config.labelBasePath}.main.lab_name` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.lab_name` },
          VALUE: 'LAB_SAMPLE.LABORATORY_NAME'
        },
        {
          ID: 'ANIMAL_EAR_TAG',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.animal_ear_tag`, defaultMessage: `${config.labelBasePath}.main.animal_ear_tag` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.animal_ear_tag` },
          VALUE: 'LAB_SAMPLE.ANIMAL_EAR_TAG'
        }
      ],
      ICON: 'icon-medkit'
    },

    LABORATORY: {
      CHOSEN_ITEM: [
        {
          ID: 'LABORATORY_ID',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.laboratory_id`, defaultMessage: `${config.labelBasePath}.main.laboratory_id` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.laboratory_id` },
          VALUE: 'LABORATORY.LABORATORY_ID'
        }, {
          ID: 'LAB_NAME',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.laboratory_name`, defaultMessage: `${config.labelBasePath}.main.laboratory_name` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.laboratory_name` },
          VALUE: 'LABORATORY.LAB_NAME'
        },
        {
          ID: 'ADDRESS',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.laboratory_address`, defaultMessage: `${config.labelBasePath}.main.laboratory_address` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.laboratory_address` },
          VALUE: 'LABORATORY.ADDRESS'
        }
      ],
      ICON: 'icon-medkit'
    },

    LAB_TEST_TYPE: {
      CHOSEN_ITEM: [
        {
          ID: 'TEST_TYPE',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.test_type`, defaultMessage: `${config.labelBasePath}.main.test_type` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.test_type` },
          VALUE: 'LAB_TEST_TYPE.TEST_TYPE',
          ITEM_FUNC: translateCodeAction
        }, {
          ID: 'TEST_NAME',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.test_name`, defaultMessage: `${config.labelBasePath}.main.test_name` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.test_name` },
          VALUE: 'LAB_TEST_TYPE.TEST_NAME'
        },
        {
          ID: 'DISEASE',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.disease`, defaultMessage: `${config.labelBasePath}.main.disease` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.disease` },
          VALUE: 'LAB_TEST_TYPE.DISEASE',
          ITEM_FUNC: translateCodeAction
        }
      ],
      ICON: 'icon-medkit'
    },

    INVENTORY_ITEM: {
      CHOSEN_ITEM: [
        {
          ID: 'TAG_STATUS',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.inv_item_tag_status`, defaultMessage: `${config.labelBasePath}.main.inv_item_tag_status` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.inv_item_tag_status` },
          VALUE: 'INVENTORY_ITEM.TAG_STATUS',
          ITEM_FUNC: translateCodeAction
        },
        {
          ID: 'TAG_TYPE',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.inv_item_tag_type`, defaultMessage: `${config.labelBasePath}.main.inv_item_tag_type` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.inv_item_tag_type` },
          VALUE: 'INVENTORY_ITEM.TAG_TYPE',
          ITEM_FUNC: translateCodeAction
        },
        {
          ID: 'PARENT_ID',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.inv_item_org_unit`, defaultMessage: `${config.labelBasePath}.main.inv_item_org_unit` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.inv_item_org_unit` },
          VALUE: 'INVENTORY_ITEM.PARENT_ID',
          LINK_TO_PARRENT_BY: 'INVENTORY_ITEM.PARENT_ID',
          LINK_TO_TABLE: 'SVAROG_ORG_UNITS',
          ITEM_FUNC: getOrgUnitByObjectId,
          LINK_FUNC: translateCodeAction
        }
      ],
      ICON: 'icon-magnet'
    },

    HEALTH_PASSPORT: {
      CHOSEN_ITEM: [
        {
          ID: 'STATUS',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.stray_pet.status`, defaultMessage: `${config.labelBasePath}.grid_labels.stray_pet.status` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.stray_pet.status` },
          VALUE: 'HEALTH_PASSPORT.STATUS'
        },
        {
          ID: 'PASSPORT_ID',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.health_passport.passport_id`, defaultMessage: `${config.labelBasePath}.grid_labels.health_passport.passport_id` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.health_passport.passport_id` },
          VALUE: 'HEALTH_PASSPORT.PASSPORT_ID'
        },
        {
          ID: 'PET_ID',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.health_passport.pet_id`, defaultMessage: `${config.labelBasePath}.grid_labels.health_passport.pet_id` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.health_passport.pet_id` },
          VALUE: 'HEALTH_PASSPORT.PET_ID'
        }
      ],
      ICON: 'icon-magnet'
    },

    // PASSPORT_REQUEST: {
    //   CHOSEN_ITEM: [
    //     {
    //       ID: 'STATUS',
    //       ...context
    //         ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.passport_request.status`, defaultMessage: `${config.labelBasePath}.grid_labels.passport_request.status` }) }
    //         : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.passport_request.status` },
    //       VALUE: 'PASSPORT_REQUEST.STATUS'
    //     },
    //     {
    //       ID: 'PASSPORT_ID',
    //       ...context
    //         ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.passport_request.passport_id`, defaultMessage: `${config.labelBasePath}.grid_labels.passport_request.passport_id` }) }
    //         : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.passport_request.passport_id` },
    //       VALUE: 'PASSPORT_REQUEST.PASSPORT_ID'
    //     },
    //     {
    //       ID: 'REQUEST_DATE',
    //       ...context
    //         ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.passport_request.request_date`, defaultMessage: `${config.labelBasePath}.grid_labels.passport_request.request_date` }) }
    //         : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.passport_request.request_date` },
    //       VALUE: 'PASSPORT_REQUEST.REQUEST_DATE'
    //     },
    //     {
    //       ID: 'PET_ID',
    //       ...context
    //         ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.form_labels.pet_id`, defaultMessage: `${config.labelBasePath}.form_labels.pet_id` }) }
    //         : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.form_labels.pet_id` },
    //       VALUE: 'PASSPORT_REQUEST.PET_ID'
    //     },
    //     {
    //       ID: 'PET_TYPE',
    //       ...context
    //         ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.passport_request.pet_type`, defaultMessage: `${config.labelBasePath}.grid_labels.passport_request.pet_type` }) }
    //         : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.passport_request.pet_type` },
    //       VALUE: 'PASSPORT_REQUEST.PET_TYPE',
    //       ITEM_FUNC: translateCodeAction
    //     },
    //     {
    //       ID: 'PET_BREED',
    //       ...context
    //         ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.passport_request.pet_breed`, defaultMessage: `${config.labelBasePath}.grid_labels.passport_request.pet_breed` }) }
    //         : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.passport_request.pet_breed` },
    //       VALUE: 'PASSPORT_REQUEST.PET_BREED'
    //     }
    //   ],
    //   ICON: 'icon-magnet'
    // },

    FLOCK: {
      CHOSEN_ITEM: [
        {
          ID: 'FLOCK_ID',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.flock.flock_id`, defaultMessage: `${config.labelBasePath}.main.flock.flock_id` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.flock.flock_id` },
          VALUE: 'FLOCK.FLOCK_ID'
        }, {
          ID: 'STATUS',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.other_animals.status`, defaultMessage: `${config.labelBasePath}.grid_labels.other_animals.status` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.other_animals.status` },
          VALUE: 'FLOCK.STATUS'
        }, {
          ID: 'HOLDING_PIC',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.form_labels.pic`, defaultMessage: `${config.labelBasePath}.form_labels.pic` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.form_labels.pic` },
          VALUE: 'FLOCK.HOLDING_PIC',
          LINK_TO_PARRENT_BY: 'PIC',
          LINK_TO_TABLE: 'HOLDING',
          ITEM_FUNC: getHoldingPicAction
        }
      ],
      ICON: 'icon-magnet'
    },

    HERD: {
      CHOSEN_ITEM: [
        {
          ID: 'HERD_ID',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.herd.herd_id`, defaultMessage: `${config.labelBasePath}.main.herd.herd_id` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.herd.herd_id` },
          VALUE: 'HERD.HERD_ID'
        },
        {
          ID: 'NAME',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.herd.name`, defaultMessage: `${config.labelBasePath}.main.herd.name` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.herd.name` },
          VALUE: 'HERD.NAME'
        },
        {
          ID: 'ANIMAL_TYPE',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.herd.animal_type`, defaultMessage: `${config.labelBasePath}.main.herd.animal_type` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.herd.animal_type` },
          VALUE: 'HERD.ANIMAL_TYPE',
          ITEM_FUNC: translateCodeAction
        }
      ],
      ICON: 'icon-magnet'
    },

    QUARANTINE: {
      CHOSEN_ITEM: [
        {
          ID: 'QUARANTINE_ID',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.quarantine.object_id`, defaultMessage: `${config.labelBasePath}.main.quarantine.object_id` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.quarantine.object_id` },
          VALUE: 'QUARANTINE.QUARANTINE_ID'
        },
        {
          ID: 'QUARANTINE_TYPE',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.quarantine.quarantine_type`, defaultMessage: `${config.labelBasePath}.main.quarantine.quarantine_type` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.quarantine.quarantine_type` },
          VALUE: 'QUARANTINE.QUARANTINE_TYPE',
          ITEM_FUNC: translateCodeAction
        },
        {
          ID: 'DATE_FROM',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.quarantine.date_from`, defaultMessage: `${config.labelBasePath}.main.quarantine.date_from` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.quarantine.date_from` },
          VALUE: 'QUARANTINE.DATE_FROM'
        },
        {
          ID: 'DATE_TO',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.quarantine.date_to`, defaultMessage: `${config.labelBasePath}.main.quarantine.date_to` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.quarantine.date_to` },
          VALUE: 'QUARANTINE.DATE_TO'
        },
        {
          ID: 'REASON',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.quarantine.reason`, defaultMessage: `${config.labelBasePath}.main.quarantine.reason` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.quarantine.reason` },
          VALUE: 'QUARANTINE.REASON'
        }, {
          ID: 'HOLDING_PIC',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.form_labels.pic`, defaultMessage: `${config.labelBasePath}.form_labels.pic` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.form_labels.pic` },
          VALUE: 'QUARANTINE.HOLDING_PIC',
          LINK_TO_PARRENT_BY: 'PIC',
          LINK_TO_TABLE: 'HOLDING',
          ITEM_FUNC: getHoldingPerExportQuarantine
        }
      ],
      ICON: 'icon-bookmark'
    },

    AREA: {
      CHOSEN_ITEM: [
        {
          ID: 'AREA_TYPE',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.area.area_type`, defaultMessage: `${config.labelBasePath}.main.area.area_type` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.area.area_type` },
          VALUE: 'AREA.AREA_TYPE',
          ITEM_FUNC: translateCodeAction
        },
        {
          ID: 'AREA_NAME',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.area.area_name`, defaultMessage: `${config.labelBasePath}.main.area.area_name` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.area.area_name` },
          VALUE: 'AREA.AREA_NAME',
          ITEM_FUNC: translateCodeAction
        }
      ],
      ICON: 'icon-flag'
    },

    POPULATION: {
      CHOSEN_ITEM: [
        {
          ID: 'POPULATION_ID',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.population.population_id`, defaultMessage: `${config.labelBasePath}.grid_labels.population.population_id` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.population.population_id` },
          VALUE: 'POPULATION.POPULATION_ID'
        },
        {
          ID: 'POPULATION_TYPE',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.population.population_type`, defaultMessage: `${config.labelBasePath}.main.population.population_type` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.population.population_type` },
          VALUE: 'POPULATION.POPULATION_TYPE',
          ITEM_FUNC: translateCodeAction
        },
        {
          ID: 'EXTRACTION_TYPE',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.population.extracted_type`, defaultMessage: `${config.labelBasePath}.main.population.extracted_type` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.population.extracted_type` },
          VALUE: 'POPULATION.EXTRACTION_TYPE',
          ITEM_FUNC: translateCodeAction
        },
        {
          ID: 'POPULATION_NAME',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.population.population_name`, defaultMessage: `${config.labelBasePath}.main.population.population_name` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.population.population_name` },
          VALUE: 'POPULATION.POPULATION_NAME'
        },
        {
          ID: 'STATUS',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.population.status`, defaultMessage: `${config.labelBasePath}.main.population.status` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.population.status` },
          VALUE: 'POPULATION.STATUS'
        }
      ],
      ICON: 'icon-list'
    },

    EXPORT_CERT: {
      CHOSEN_ITEM: [
        {
          ID: 'EXP_CERTIFICATE_ID',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.export_cert.exp_certificate_id`, defaultMessage: `${config.labelBasePath}.main.export_cert.exp_certificate_id` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.export_cert.exp_certificate_id` },
          VALUE: 'EXPORT_CERT.EXP_CERTIFICATE_ID'
          // ITEM_FUNC: translateCodeAction
        },
        {
          ID: 'STATUS',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.export_cert.status`, defaultMessage: `${config.labelBasePath}.main.export_cert.status` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.export_cert.status` },
          VALUE: 'EXPORT_CERT.STATUS'
          // ITEM_FUNC: translateCodeAction
        },
        {
          ID: 'IMP_COUNTRY',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.export_cert.imp_country`, defaultMessage: `${config.labelBasePath}.main.export_cert.imp_country` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.export_cert.imp_country` },
          VALUE: 'EXPORT_CERT.IMP_COUNTRY',
          ITEM_FUNC: translateCodeAction
        }
      ],
      ICON: 'icon-refresh'
    },

    SAMPLE: {
      CHOSEN_ITEM: [
        {
          ID: 'SAMPLE_TYPE',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.sample.sample_type`, defaultMessage: `${config.labelBasePath}.main.sample.sample_type` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.sample.sample_type` },
          VALUE: 'SAMPLE.SAMPLE_TYPE',
          ITEM_FUNC: translateCodeAction
        },
        {
          ID: 'SAMPLE_NAME',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.main.sample.sample_name`, defaultMessage: `${config.labelBasePath}.main.sample.sample_name` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.main.sample.sample_name` },
          VALUE: 'SAMPLE.SAMPLE_NAME',
          ITEM_FUNC: translateCodeAction
        }
      ],
      ICON: 'icon-book'
    },

    ORDER: {
      CHOSEN_ITEM: [
        {
          ID: 'ORG_UNIT_NAME',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.order.org_unit_name`, defaultMessage: `${config.labelBasePath}.grid_labels.order.org_unit_name` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.order.org_unit_name` },
          VALUE: 'ORDER.ORG_UNIT_NAME'
        },
        {
          ID: 'RESPONSIBLE_PERSON',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.order.responsible_person`, defaultMessage: `${config.labelBasePath}.grid_labels.order.responsible_person` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.order.responsible_person` },
          VALUE: 'ORDER.RESPONSIBLE_PERSON'
        },
        {
          ID: 'STATUS',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.order.status`, defaultMessage: `${config.labelBasePath}.grid_labels.order.status` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.order.status` },
          VALUE: 'ORDER.STATUS'
        }

      ],
      ICON: 'icon-time'
    },

    TRANSFER: {
      CHOSEN_ITEM: [
        {
          ID: 'SUBJECT_FROM',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.transfer.subject_from`, defaultMessage: `${config.labelBasePath}.grid_labels.transfer.subject_from` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.transfer.subject_from` },
          VALUE: 'TRANSFER.SUBJECT_FROM'
        },
        {
          ID: 'SUBJECT_TO',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.transfer.subject_to`, defaultMessage: `${config.labelBasePath}.grid_labels.transfer.subject_to` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.transfer.subject_to` },
          VALUE: 'TRANSFER.SUBJECT_TO'
        }
      ],
      ICON: 'icon-road'
    },

    MOVEMENT_DOC: {
      CHOSEN_ITEM: [
        {
          ID: 'MOVEMENT_DOC_ID',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.movement_doc.movement_doc_id`, defaultMessage: `${config.labelBasePath}.grid_labels.movement_doc.movement_doc_id` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.movement_doc.movement_doc_id` },
          VALUE: 'MOVEMENT_DOC.MOVEMENT_DOC_ID'
        },
        {
          ID: 'STATUS',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.movement_doc.status`, defaultMessage: `${config.labelBasePath}.grid_labels.movement_doc.status` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.movement_doc.status` },
          VALUE: 'MOVEMENT_DOC.STATUS'
        }
      ],
      ICON: 'icon-th'
    },

    RFID_INPUT: {
      CHOSEN_ITEM: [
        {
          ID: 'RFID_NUMBER',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.rfid_input.rfid_number`, defaultMessage: `${config.labelBasePath}.grid_labels.rfid_input.rfid_number` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.rfid_input.rfid_number` },
          VALUE: 'RFID_INPUT.RFID_NUMBER'
        },
        {
          ID: 'IMPORT_TYPE',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.rfid_input.import_type`, defaultMessage: `${config.labelBasePath}.grid_labels.rfid_input.import_type` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.rfid_input.import_type` },
          VALUE: 'RFID_INPUT.IMPORT_TYPE',
          ITEM_FUNC: translateCodeAction
        },
        {
          ID: 'ANIMAL_TYPE',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.rfid_input.animal_type`, defaultMessage: `${config.labelBasePath}.grid_labels.rfid_input.animal_type` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.rfid_input.animal_type` },
          VALUE: 'RFID_INPUT.ANIMAL_TYPE',
          ITEM_FUNC: translateCodeAction
        }
      ],
      ICON: 'icon-magnet'
    },

    SVAROG_LABELS: {
      CHOSEN_ITEM: [
        {
          ID: 'LOCALE_ID',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.svarog_labels.locale_id`, defaultMessage: `${config.labelBasePath}.grid_labels.svarog_labels.locale_id` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.svarog_labels.locale_id` },
          VALUE: 'SVAROG_LABELS.LOCALE_ID'
        }
      ],
      ICON: 'icon-road'
    },

    SVAROG_ORG_UNITS: {
      CHOSEN_ITEM: [
        {
          ID: 'NAME',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.svarog_org_units.name`, defaultMessage: `${config.labelBasePath}.grid_labels.svarog_org_units.name` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.svarog_org_units.name` },
          VALUE: 'SVAROG_ORG_UNITS.NAME'

        },
        {
          ID: 'ADDRESS',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.svarog_org_units.address`, defaultMessage: `${config.labelBasePath}.grid_labels.svarog_org_units.address` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.svarog_org_units.address` },
          VALUE: 'SVAROG_ORG_UNITS.ADDRESS'

        },
        {
          ID: 'E_MAIL',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.svarog_org_units.e_mail`, defaultMessage: `${config.labelBasePath}.grid_labels.svarog_org_units.e_mail` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.svarog_org_units.e_mail` },
          VALUE: 'SVAROG_ORG_UNITS.E_MAIL'

        },
        {
          ID: 'ORG_UNIT_TYPE',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.svarog_org_units.org_unit_type`, defaultMessage: `${config.labelBasePath}.grid_labels.svarog_org_units.org_unit_type` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.svarog_org_units.org_unit_type` },
          VALUE: 'SVAROG_ORG_UNITS.ORG_UNIT_TYPE'

        }
      ],
      ICON: 'icon-user'
    },

    SVAROG_USERS: {
      CHOSEN_ITEM: [
        {
          ID: 'USER_NAME',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.svarog_users.user_name`, defaultMessage: `${config.labelBasePath}.grid_labels.svarog_users.user_name` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.svarog_users.user_name` },
          VALUE: 'SVAROG_USERS.USER_NAME'
        }, {
          ID: 'FIRST_NAME',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.svarog_users.first_name`, defaultMessage: `${config.labelBasePath}.grid_labels.svarog_users.first_name` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.svarog_users.first_name` },
          VALUE: 'SVAROG_USERS.FIRST_NAME'
        }, {
          ID: 'LAST_NAME',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.svarog_users.last_name`, defaultMessage: `${config.labelBasePath}.grid_labels.svarog_users.last_name` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.svarog_users.last_name` },
          VALUE: 'SVAROG_USERS.LAST_NAME'
        }
      ],
      ICON: 'icon-user'
    },

    SVAROG_USER_GROUPS: {
      CHOSEN_ITEM: [
        {
          ID: 'GROUP_NAME',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.svarog_user_groups.group_name`, defaultMessage: `${config.labelBasePath}.grid_labels.svarog_user_groups.group_name` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.svarog_user_groups.group_name` },
          VALUE: 'SVAROG_USER_GROUPS.GROUP_NAME'
        }, {
          ID: 'GROUP_TYPE',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.svarog_user_groups.group_type`, defaultMessage: `${config.labelBasePath}.grid_labels.svarog_user_groups.group_type` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.svarog_user_groups.group_type` },
          VALUE: 'SVAROG_USER_GROUPS.GROUP_TYPE'
        }, {
          ID: 'GROUP_SECURITY_TYPE',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.svarog_user_groups.security_type`, defaultMessage: `${config.labelBasePath}.grid_labels.svarog_user_groups.security_type` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.svarog_user_groups.security_type` },
          VALUE: 'SVAROG_USER_GROUPS.GROUP_SECURITY_TYPE'
        }
      ],
      ICON: 'icon-user'
    },

    SVAROG_CODES: {
      CHOSEN_ITEM: [
        {
          ID: 'CODE_VALUE',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.svarog_codes.code_value`, defaultMessage: `${config.labelBasePath}.grid_labels.svarog_codes.code_value` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.svarog_codes.code_value` },
          VALUE: 'SVAROG_CODES.CODE_VALUE'
        }
      ],
      ICON: 'icon-code'
    },

    SVAROG_NOTIFICATION: {
      CHOSEN_ITEM: [
        {
          ID: 'TITLE',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.svarog_notification.title`, defaultMessage: `${config.labelBasePath}.grid_labels.svarog_notification.title` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.svarog_notification.title` },
          VALUE: 'SVAROG_NOTIFICATION.TITLE'
        },
        {
          ID: 'MESSAGE',
          ...context
            ? { LABEL: context.formatMessage({ id: `${config.labelBasePath}.grid_labels.svarog_notification.message`, defaultMessage: `${config.labelBasePath}.grid_labels.svarog_notification.message` }) }
            : { LABEL: `CONTEXT_MISSING_${config.labelBasePath}.grid_labels.svarog_notification.message` },
          VALUE: 'SVAROG_NOTIFICATION.MESSAGE'
        }
      ],
      ICON: 'icon-bell-alt'
    }
  }
  return recordTypes[selectedItem]
}
