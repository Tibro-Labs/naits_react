let server = null
// if client.min.js is hosted on localhost and triglav rest is on remote server
if (window.location.hostname === 'localhost' && window.location.port === '8080') {
  server = 'http://192.168.100.160:8030/triglav_rest'
  // server = 'http://192.168.99.194:9090/triglav_rest'
  // server = 'https://naits.tibrolabs.com/triglav_rest'
  // server = 'http://localhost:9091/triglav_rest'
} else if (window.location.hostname === '127.0.0.1' && window.location.port === '8080') {
  server = 'http://192.168.100.160:8030/triglav_rest'
} else if (window.location.hostname === 'localhost' && window.location.port === '9090') {
  server = 'http://192.168.9.134:8080/triglav_rest'
} else {
  // if client.min.js and triglav rest are on remote server
  server = '/triglav_rest'
}

// Current NAITS version
export let version = naitsVersion // eslint-disable-line

// Current environment
export const currentEnv = process.env.NODE_ENV

// Google Analytics tracking code
export const gaTrackingCode = 'UA-154699639-1'

// Google reCAPTCHA keys
export const captchaSiteKey = '6LdVGAoaAAAAAPmYkIzFE8vw7axMU8T1DeMzReR5'
export const captchaSecretKey = '6LdVGAoaAAAAABuGgBl-PFB72M-35e2slctG_41C'

// This flag should be enabled if you are using custom plugins.
export const hasCustom = true

// set this to true if you want to see the LPIS menu
export const enableLPIS = false

// load labels from baseUrlPath variable
export const labelBasePath = 'naits'

// translate grid and forms
export const translateComponents = true

// return a class component with mount and unmount logic for RecordInfo
// if false return legacy RecordInfoGuser
export const classRecordInfo = true

export const svConfig = {
  restSvcBaseUrl: [server],
  isDebug: process.env.NODE_ENV !== 'production',
  triglavRestVerbs: {
    MAIN_LABELS: '/svarog/i18n/%s1/%s2',
    MAIN_LABELS2: '/naits_triglav_plugin/ApplicationServices/switchSessionLocale/%s1/%s2',
    MAIN_LOGIN: '/SvSSO/logon/%s1/%s2',
    MAIN_USERTYPE: '/SvSSO/getUserBySession/%s1',
    MAIN_REGISTER: '/SvSSO/createUser/%s1/%s2/%s3/%s4/%s5/%s6',
    ADMIN_REGISTER_USER: '/SvSSO/createUserFromAdmConsole',
    MAIN_REGISTERIPARD: '/SvSSO2/createExternalUser/%s1/%s2/%s3/%s4/%s5/%s6',
    MAIN_ACTIVATE: '/SvSSO/activateUser/%s1',
    MAIN_VALIDATE: '/SvSSO/validateToken/%s1',
    MAIN_LOGOUT: '/SvSSO/logoff/%s1',
    MAIN_RECOVERPASS: '/SvSSO/recover_pass/%s1',
    MAIN_RECOVERMAIL: '/SvSSO/updatePasswordAfterRecovery/%s1/%s2/%s3/%s4',
    MAIN_CHANGEPASS: '/SvSSO/updatePassword/%session/%oldPass/%newPass',
    MAIN_RECOVERPASS_BYID: '/SvSSO2/recover_passbyidbr/%s1',
    MAIN_RECOVERPASS_BYUNAME: '/SvSSO2/recover_passByUserName/%s1',
    MAIN_GET_BASIC_USER_DATA: '/SvSSO/getBasicUserData/%session',
    MAIN_GET_FULL_USER_DATA: '/naits_triglav_plugin/ApplicationServices/getFullUserData/%session/%objectId',
    MAIN_SAVE_USER_CONTACT_DATA: '/naits_triglav_plugin/ApplicationServices/saveContactData/%session/%objectId/%objectIdName/%streetType/%streetName/%houseNumber/%postalCode/%city/%state/%phoneNumber/%mobileNumber/%fax/%email',
    MAIN_SAVE_USER_CONTACT_DATA2: '/naits_triglav_plugin/ApplicationServices/saveContactData2/%session/%objectId/%objectIdName',
    MAIN_EDIT_USER_CONTACT_DATA: '/naits_triglav_plugin/ApplicationServices/editUserData/%session/%firstName/%lastName',
    MAIN_ALLOWED_CUSTOM_OBJECTS_PER_USER: '/naits_triglav_plugin/ApplicationServices/getAllowedCustomObjectsPerUser/%session',
    MAIN_NOTIFICATIONS: '/naits_triglav_plugin/ApplicationServices/getNotificationsPerUser/%session',

    GET_DAILY_SLA_REPORT: 'naits_triglav_plugin/report/generatePdf/%session/%objectId/%reportName/%dateFrom/%dateTo',
    GET_CAMPAIGN_REPORT: 'naits_triglav_plugin/report/generatePdf/%session/%objectId/%reportName/%param1/%param2/%param3',
    GET_REPORT: 'naits_triglav_plugin/report/generatePdf/%session/%objectId/%reportName',
    GET_INVOICE: 'naits_triglav_plugin/report/generatePdf',
    GET_INVOICE_XLS: 'naits_triglav_plugin/report/generatePdfOrExcel',
    GENERATE_PDF_OR_EXCEL: 'naits_triglav_plugin/report/generatePdfOrExcel/%sessionId/%objectId/%printType/%customDate/%customDate2/%campaignId/%reportName',

    YES_NO_JSON: '/naits_triglav_plugin/ApplicationServices/prepareReactJsonUISchema/%session/%component/%parentId/%parentTypeId',
    YES_NO_FORM: '/naits_triglav_plugin/ApplicationServices/prepareReactJsonFormData/%session/%component/%parentId/%parentTypeId',

    /* Datagrid configuration and data */
    BASE: '/ReactElements/getTableFieldList/%session/%gridName',
    BASE_DATA: '/ReactElements/getTableData/%session/%gridName/100000',
    BASE_DATA_SECONDARY: '/ReactElements/getTableData/%session/%objectName/100000',
    GET_BYOBJECTID: '/ReactElements/getRowDataByObjectId/%session/%objectId/%objectName',
    GET_BYPARENTID: '/ReactElements/getObjectsByParentId/%session/%parentId/%objectType/%rowlimit',
    GET_BYPARENTID_2: '/naits_triglav_plugin/ApplicationServices/getObjectsByParentId/%session/%parentId/%tableName/%orderByField/%orderAscDesc',
    GET_BYPARENTID_SYNC: '/ReactElements/getObjectsByParentId/%s1/%s2/%s3/%s4',
    GET_BYPARENTID_SYNC_WITH_ORDER: '/ReactElements/getObjectsByParentId/%s1/%s2/%s3/%s4/%order',
    GET_BY_PARENTID_ASC_OR_DESC: '/naits_triglav_plugin/ApplicationServices/getObjectsByParentId/%session/%parentId/%objectType/%orderByField/%ascOrDesc',
    GET_BYLINK: '/ReactElements/getObjectByLink/%session/%parentId/%objectType/%linkName/%rowlimit',
    GET_BYLINK_PER_STATUSES: '/ReactElements/getObjectsByLinkPerStatuses/%session/%objectId/%statuses/%table_name/%linkName/%rowlimit/%link_status',
    GET_BYLINK_PER_STATUSES_SORTED: '/ReactElements/getObjectsByLinkPerStatuses/%session/%objectId/%statuses/%table_name/%linkName/%link_status/%rowlimit/%sortOrder',
    SHOW_LABORATORY_PER_USER: '/ApplicationServices/customShowLaboratoryGrid/%session',
    GET_TABLE_WITH_MULTIPLE_FILTERS: '/ReactElements/getTableWithMultipleFilters/%session/%table_name/%fieldNames/%criterumConjuction/%fieldValues/%no_rec',
    GET_TABLE_WITH_MULTIPLE_FILTERS_SORTED: '/ReactElements/getTableWithMultipleFilters/%session/%table_name/%fieldNames/%criterumConjuction/%fieldValues/%no_rec/%sortOrder',
    CUSTOM_GRID: '/ReactElements/getTableFieldList/%session/%gridConfigWeWant',
    GET_HISTORY: '/ReactElements/getHistoryObjectsByObjectId/%session/%parentId/%objectType/%rowlimit',

    /* Json schema form configuration and data */
    GET_FORM_BUILDER: '/ReactElements/getTableJSONSchema/%session/%formWeWant',
    GET_UISCHEMA: '/ReactElements/getTableUISchema/%session/%formWeWant',
    GET_TABLE_FORMDATA: '/ReactElements/getTableFormData/%session/%object_id/%table_name',
    CUSTOM_GET_TABLE_FORMDATA: '/naits_triglav_plugin/ApplicationServices/getCustomTableFormDataPerStrayPetLocation/%session/%parent_id/%locationReason',
    EXTENDED_CUSTOM_GET_TABLE_FORMDATA: '/naits_triglav_plugin/ApplicationServices/getCustomTableFormDataPerStrayPetLocation/%session/%parent_id/%locationReason/%currentHoldingObjId',

    /* Json schema form documents */
    GET_DOC_BUILDER: '/ReactElements/getFormJSONSchema/%session/%formWeWant',
    GET_DOC_UISCHEMA: '/ReactElements/getFormUISchema/%session/%formWeWant',
    GET_DOC_FORMDATA: '/ReactElements/getFormFormData/%session/%object_id/%formWeWant',
    SAVE_DOCUMENT_OBJECT: '/ReactElements/createFormWithFields/%session/%parentId/%form_type/%form_validation/%value/%json_string',
    GET_MULTIFILTER_TABLE: '/ReactElements/getTableWithFilter/%s1/%s2/%s3/%s4/%s5/%s6/%s7/%s8',
    GET_DOCUMENTS: '/ReactElements/getTableData/%s1/%s2/%s3',
    GET_DOCUMENT_FORM_FILED_LIST: '/ReactElements/getTransposedFormByParentFieldList/%session/%form_id/%scenario',
    GET_DOCUMENT_FORMS: '/ReactElements/getTransposedFormByParent/%session/%parent_id/%form_id',
    GET_DOCUMENTS_BY_PARENTID: '/ReactElements/getDocumentsByParentId/%session/%parentId/%formName/%recordNumber',

    /* Save records */
    SAVE_TABLE_OBJECT: '/ReactElements/createTableRecord/%session/%table_name/%parent_id/null',
    SAVE_OBJECT_WITH_LINK: '/ReactElements/createTableRecord/%session/%table_name/%parent_id/null/%object_id_to_link/%table_name_to_link/%link_name/%link_note',
    LINK_OBJECTS: '/ReactElements/linkObjects/%session/%objectId1/%tableName1/%objectId2/%tableName2/%linkName',
    SAVE_QUARANTINE: '/naits_triglav_plugin/ApplicationServices/saveQuarantine/%session/%object_id/%geom/%radius',
    /* Delete records */
    DELETE_TABLE_OBJECT: '/svWriter/deleteObject/%session/%objectId/%objectType/%objectPkId',
    DELETE_TABLE_OBJECT_WITH_SAVE_CHECK: '/svarog/deleteObjectWithSaveCheck/%session/%objectId/%objectType/%objectPkId',
    DROP_LINK_OBJECTS: '/ReactElements/dropLink/%session/%objectId1/%tableName1/%objectId2/%tableName2/%linkName',

    /* Search tables with equal and like operators */
    GET_TABLE_WITH_FILTER: '/ReactElements/getTableWithFilter/%session/%objectName/%searchBy/%searchForValue/%parentColumn/%parentId/%criterumConjuction/%rowlimit',
    GET_TABLE_WITH_FILTER_2: '/ReactElements/getTableWithFilter/%session/%table_name/%searchBy/%searchForValue/%no_rec',
    GET_TABLE_WITH_LIKE_FILTER: '/ReactElements/getTableWithILike/%svSession/%objectName/%searchBy/%searchForValue/%rowlimit',
    GET_TABLE_WITH_LIKE_FILTER_2: '/naits_triglav_plugin/ApplicationServices/getTableWithILike/%svSession/%objectName/%searchBy/%searchForValue/%rowlimit',
    GET_TABLE_WITH_LIKE_FILTER_SYNC: '/ReactElements/getTableWithILike/%s1/%s2/%s3/%s4/%s5',
    GET_TABLE_WITH_MULTIFILTER: '/ReactElements/getTableWithMultipleFilters/%session/%objectName/%fieldNames/%criterumConjuction/%fieldValues/%rowlimit',
    GET_FORM_JSON: '/ReactElements/getFormJSONSchema/%s1/%s2',

    GET_CENTROID: '/SDI/getCentroidByPolyId/%s1/%s2/%s3',
    GET_TABLE_DATA: '/ReactElements/getTableData/%session/%tableName/%noRec/%doTranslate',
    GET_HOLDING_PIC: '/naits_triglav_plugin/ApplicationServices/getPicPerHolding/%svSession/%holdingId',
    GET_LINKED_HOLDINGS_PER_USER: '/naits_triglav_plugin/ApplicationServices/getLinkedHoldingsPerUser/%session',
    GET_LINKED_HOLDINGS_PER_USER_2: '/naits_triglav_plugin/ApplicationServices/getLinkedHoldingsPerUser/%svSession',
    TRANSLATE_CODE_ITEM: '/naits_triglav_plugin/ApplicationServices/translateCodeItem/%svSession/%typeId/%fieldName/%fieldValue/%locale',
    GET_HOLDING_PER_EXP_QUARANTINE: '/naits_triglav_plugin/ApplicationServices/getHoldingPerExportQuarantine/%svSession/%quarantineObjId',

    MASS_ANIMAL_OR_FLOCK_ACTION: '/naits_triglav_plugin/ApplicationServices/massAnimalAndFlockAction',
    EXECUTE_ACTION_ON_ROWS: '/naits_triglav_plugin/ApplicationServices/massAnimalAction',
    MASS_PET_ACTION: '/naits_triglav_plugin/ApplicationServices/massPetAction',
    GET_HOLDING_KEEPER_INFO: '/naits_triglav_plugin/ApplicationServices/getHoldingKeeperInfo',
    VALIDATE_ANIMAL_ID: '/naits_triglav_plugin/ApplicationServices/checkIfAnimalIdExist',
    GET_OBJECT_SUMMARY: '/naits_triglav_plugin/ApplicationServices/getObjectSummary',
    TRANSFER_ANIMAL: '/naits_triglav_plugin/ApplicationServices/transferAnimalOrFlockToHolding',
    EXPORT_ANIMAL: '/naits_triglav_plugin/ApplicationServices/moveAndLinkAnimals',
    SELECTED_OBJECT_FOR_POPULATION: '/naits_triglav_plugin/batch/selectObjects',
    EXPORT_CERTIFIED_ANIMALS: '/naits_triglav_plugin/ApplicationServices/exportCertifiedAnimals',
    LAB_SAMPLE_ACTION: '/naits_triglav_plugin/ApplicationServices/labSampleMassAction',
    GENERATE_POPULATION_SAMPLE: 'naits_triglav_plugin/ApplicationServices/generatePopulationSample/%sessionId/%populationId/%fileName/%sheetName/%fileSuffix',
    EXPORT_SAMPLE_TO_EXCEL: 'naits_triglav_plugin/ApplicationServices/exportSampleToExcel/%sessionId/%sampleType/%populationId',
    LINK_POPULATION_TO_AREA: 'naits_triglav_plugin/ApplicationServices/createLinkBetweenAreaAndPopulation/%sessionId/%objectId/%geostatCode',
    DOWNLOAD_POPULATION_SAMPLE_FILE: 'naits_triglav_plugin/ApplicationServices/downloadSampleFile/%sessionId/%populationId/%fileLabelCode/%fileSuffix',
    GET_STRATIFICATION_NUMBERS: 'naits_triglav_plugin/ApplicationServices/getStratificationNumbers/%sessionId/%populationId',
    APPLY_STRATIFICATION_FILTER: 'naits_triglav_plugin/ApplicationServices/applyStratificationFilter/%sessionId/%populationId',
    STRATIFY_POPULATION: 'naits_triglav_plugin/ApplicationServices/stratifyPopulation/%sessionId/%populationId/%fileSuffix/%populationObjId',
    GET_APPLIED_STRAT_FILTERS: '/ReactElements/getObjectsByParentId/%session/%parentId/STRAT_FILTER/10000',
    GENERATE_INVENTORY_ITEM: '/naits_triglav_plugin/ApplicationServices/generateInventoryItem',
    MOVE_INVENTORY_ITEM: '/naits_triglav_plugin/ApplicationServices/moveInventoryItem',
    CHANGE_STATUS: '/naits_triglav_plugin/ApplicationServices/changeStatus',
    UPDATE_STATUS: '/naits_triglav_plugin/ApplicationServices/updateStatus',
    CHANGE_STATUS_OF_HOLDING: '/naits_triglav_plugin/ApplicationServices/changeHoldingStatus',
    GENERATE_ANIMALS: '/naits_triglav_plugin/ApplicationServices/generateAnimals',
    CREATE_REVERSE_TRANSFER: '/naits_triglav_plugin/ApplicationServices/createRevereseTransfer',
    INDIVIDUAL_REVERSE_TRANSFER: '/naits_triglav_plugin/ApplicationServices/createIndividualReverseTransfer',
    EAR_TAG_REPLACEMENT: '/naits_triglav_plugin/ApplicationServices/createEarTagReplacementAndUpdateAnimalId',
    HOLDING_BOOK: '/naits_triglav_plugin/ApplicationServices/getNextOrPreviousHolding/%session/%holdingObjId/%direction',
    IS_USER_ADMIN: '/naits_triglav_plugin/ApplicationServices/checkIfUserHasAdmGroup',
    GET_USER_GROUPS: '/naits_triglav_plugin/ApplicationServices/getUserGroups',
    ATTACH_PERMISSION_ONTO_USER_OR_GROUP: '/naits_triglav_plugin/ApplicationServices/assignOrUnasignPackagePermissionOnUserOrGroup',
    ADD_USERS_TO_GROUP: '/naits_triglav_plugin/ApplicationServices/attachUserToGroup',
    REMOVE_USERS_FROM_GROUP: '/naits_triglav_plugin/ApplicationServices/detachUserFromGroup',
    ADD_NOTIFICATION_TO_GROUP: '/naits_triglav_plugin/ApplicationServices/assignNotificationToUserOrUserGroup',
    ADD_USERS_TO_ORG_UNITS: '/naits_triglav_plugin/ApplicationServices/attachUserToOrgUnit',
    ASSIGN_USER_TO_LABORATORY: '/naits_triglav_plugin/ApplicationServices/assignUserToLaboratory',
    UNASSIGN_USER_FROM_LABORATORY: '/naits_triglav_plugin/ApplicationServices/unassignUserFromLaboratory',
    REMOVE_ORG_UNIT: '/naits_triglav_plugin/ApplicationServices/detachUserToOrgUnit',
    MASS_USER_ACTION: '/naits_triglav_plugin/ApplicationServices/massUserAction',
    CHECK_IF_FIRST_LOGIN: '/naits_triglav_plugin/ApplicationServices/checkIfShouldEnforcePassword',
    GET_VALID_VACCINATION_EVENTS: '/naits_triglav_plugin/ApplicationServices/getValidVaccEvents/',
    GET_VALID_VACCINATION_EVENTS_FOR_HOLDING: '/naits_triglav_plugin/ApplicationServices/getValidVaccEvents/%session/%holdingType',
    GET_VALID_TEST_TYPES: '/naits_triglav_plugin/ApplicationServices/getValidTestTypes/%svSession/%objectId/%testType',
    GET_APPLICABLE_TEST_TYPES: '/naits_triglav_plugin/ApplicationServices/getApplicableLaboratoryTests/%session/%activityType/%activitySubType/%disease',
    GET_VALID_CAMPAIGN_EVENTS: '/naits_triglav_plugin/ApplicationServices/getValidCampaignEvents/%svSession/6',
    GET_VALID_CAMPAIGN_EVENTS_FOR_PETS: '/naits_triglav_plugin/ApplicationServices/getValidCampaignEvents/%svSession/15',
    GET_INACTIVE_ANIMAL_OR_HOLDING_CAMPAIGNS: '/naits_triglav_plugin/ApplicationServices/getExpiredVaccinationEvents/%session',
    GET_DEPENDENT_DDL_OPTIONS_LIST: '/naits_triglav_plugin/ApplicationServices/getDependentDropdown/',
    GET_LOCALE_OBJ_ID: '/naits_triglav_plugin/ApplicationServices/getLocaleId',
    GET_DYNAMIC_DROPDOWN_OPTIONS: '/naits_triglav_plugin/ApplicationServices/getDynamicDropdown',
    ASSIGN_RESULT_TO_LAB_SAMPLE: '/naits_triglav_plugin/ApplicationServices/assignResultToLabSample',
    CHANGE_MOVEMENT_DOC_STATUS: '/naits_triglav_plugin/ApplicationServices/movementDocStatusUpdate',
    CHECK_MOVEMENT_DOCUMENT: '/naits_triglav_plugin/ApplicationServices/checkMovementDoc',
    CANCEL_EXPORT_CERTIFICATE: '/naits_triglav_plugin/ApplicationServices/cancelExportCertificate',
    MOVE_FLOCK_UNITS: '/naits_triglav_plugin/ApplicationServices/moveFlockUnits',
    SET_ACTIVITY_PERIOD: '/naits_triglav_plugin/ApplicationServices/createActivityPeriodPerHerder',
    SEARCH_ANIMAL_BY_BAR_CODE: '/naits_triglav_plugin/ApplicationServices/getAnimalByBarCode/%svSession/%searchForValue',
    SEARCH_ANIMAL_BY_OLD_EAR_TAG: '/naits_triglav_plugin/ApplicationServices/getAnimalByReplacedTagId/%svSession/%searchForValue',
    IS_ANIMAL_IN_SLAUGHTERHOUSE: '/naits_triglav_plugin/ApplicationServices/checkIfAnimalBelongsToSlaughterhouse',
    HOLDING_STATUS: '/naits_triglav_plugin/ApplicationServices/changeAppropriateColor',
    MOVE_INV_ITEM_TO_ORG_UNIT: '/naits_triglav_plugin/ApplicationServices/moveGroupOfIndividualInventoryItems',
    VALIDATE_RANGE: '/naits_triglav_plugin/ApplicationServices/checkIfRangesOverlap',
    GET_VALID_ORG_UNITS: '/naits_triglav_plugin/ApplicationServices/getValidOrgUnitsDependOnParentOrgUnit/%svSession/%externalId',
    GET_OBJECTS_BY_LOCATION: '/naits_triglav_plugin/ApplicationServices/getObjectsByLocation/%session/%objectType/%value',
    IS_HOLDING_INFECTED: '/naits_triglav_plugin/ApplicationServices/checkIfHoldingBelongsToActiveQuarantineOrAffectedArea/%session/%objectId',
    APPLY_INVENTORY_ITEMS: '/naits_triglav_plugin/ApplicationServices/applyAvailableInventoryItemsOnValidAvailableAnimals',
    SEARCH_BY_EAR_TAG_ID: '/naits_triglav_plugin/ApplicationServices/customSearchForInventoryItemByEarTag/%session/%value',
    SEARCH_BY_PET_PASSPORT_ID: '/naits_triglav_plugin/ApplicationServices/getPetByPetPassportId/%session/%value',
    SEARCH_BY_OWNER_OR_PASSPORT_ID: '/naits_triglav_plugin/ApplicationServices/getPetByPetPassportOrOwnerId/%session/%objectType/%value',
    SET_NOTE_DESC: '/naits_triglav_plugin/ApplicationServices/setNoteDescription/%sessionId/%objectId/%noteName',
    GET_NOTE_DESC: '/naits_triglav_plugin/ApplicationServices/getNoteDescription/%sessionId/%objectId/%noteName',
    GET_MUNIC_WITH_CAMPAIGN: '/naits_triglav_plugin/ApplicationServices/getTargetedMunicipalitiesWithCampaign/%sessionId/%objectId',
    GET_ORG_UNIT_BY_OBJECT_ID: '/naits_triglav_plugin/ApplicationServices/getOrgUnitToSimpleJsonByObjectId/%sessionId/%objectId',
    GET_VET_STATIONS: '/naits_triglav_plugin/ApplicationServices/getTableWithILike/%session/HOLDING/TYPE/16/10000',
    GET_SHELTERS: '/naits_triglav_plugin/ApplicationServices/getTableWithILike/%session/HOLDING/TYPE/15/10000',
    ASSIGN_OWNER_TO_STRAY_PET: '/naits_triglav_plugin/ApplicationServices/assignOwnerToStrayPet/%session/%strayPetId/%personObjId/%adoptionDate',
    SEND_PASSPORT_REQUEST: '/naits_triglav_plugin/ApplicationServices/sendPassportRequestToVeterinaryStation/%sessionId/%petObjectId/%vetStationObjectId',
    MASS_OBJECT_HANDLER: '/naits_triglav_plugin/ApplicationServices/massObjectHandler',
    GET_DATA_WITH_FILTER: '/ReactElements/getTableWithFilter/%session/%table_name/%fieldNAme/%fieldValue/%no_rec',
    CHECK_IF_PET_HAS_VALID_PASSPORT: '/naits_triglav_plugin/ApplicationServices/checkIfPetHasValidPassport/%sessionId/%objectId',
    CHECK_IF_PET_HAS_INVENTORY_ITEM: '/naits_triglav_plugin/ApplicationServices/checkIfPetHasInventoryItem/%sessionId/%objectId',
    UPDATE_PET_ID: '/naits_triglav_plugin/ApplicationServices/updatePetId/%sessionId/%objectId/%updatedPetId',
    CHECK_IF_USER_CAN_USE_REPORT_TOOL: '/naits_triglav_plugin/ApplicationServices/hasReportToolPermission/%session/%permissionType',
    CHECK_IF_FILE_EXISTS: '/naits_triglav_plugin/ApplicationServices/checkIfSvFileExists/%sessionId/%fileName',
    DELETE_ANIMAL_ADM_CONSOLE: '/naits_triglav_plugin/ApplicationServices/deleteAnimalObject/%sessionId/%animalId/%animalClass',
    GET_MOVEMENT_DOC_BY_ANIMAL_OR_FLOCK_ID: '/naits_triglav_plugin/ApplicationServices/getMovementDocumentByAnimalOrFlockId/%session/%value/%movementType',
    GET_INVENTORY_ITEMS_BY_RANGE: '/naits_triglav_plugin/ApplicationServices/getInventoryItemByRange/%session/%parentId/%rangeFrom/%rangeTo/%tagType/%order',
    GET_MOVEMENT_DOC_BY_TRANSPORTER_LICENSE: '/naits_triglav_plugin/ApplicationServices/getMovementDocumentByTransporterLicense/%session/%value',
    GET_LINKED_USER_GROUPS_PER_USER: '/naits_triglav_plugin/ApplicationServices/getAllLinkedUserGroupsPerUser/%session/%userObjectId',
    PRECHECK_MOVE_ITEMS_BY_RANGE: '/naits_triglav_plugin/ApplicationServices/preCheckMoveInventoryItemByRange/%session',
    MOVE_ITEMS_BY_RANGE: '/naits_triglav_plugin/ApplicationServices/moveInventoryItemByRange/%session/true',
    GENERATE_RFID_RESULT: '/naits_triglav_plugin/ApplicationServices/generateRFIDResultObjects',
    FILE_UPLOAD: '/naits_triglav_plugin/ApplicationServices/uploadRFIDTags/%session/%objectId',
    DISPLAY_EXPORT_CERT_PRINT_BADGE: '/naits_triglav_plugin/ApplicationServices/displayExportCertificateReportButton/%session/%objectId',
    GET_SV_FILE_PER_DBO: '/naits_triglav_plugin/ApplicationServices/getSvFilePerDbo/%session/%objectId/%objectType',
    DOWNLOAD_FILE: '/naits_triglav_plugin/ApplicationServices/downloadSvFile/%session/%objectId/%objectType/%fileName/%fileNotes',
    CUSTOM_CREATE_RFID_INPUT: '/naits_triglav_plugin/ApplicationServices/createCustomRfidInput',
    GET_ANIMALS_BY_STATUS: '/naits_triglav_plugin/ApplicationServices/getAnimalsByStatus/%session/%value',
    INACTIVATE_PET_OWNER: '/naits_triglav_plugin/ApplicationServices/inactivateLinkBetweenPetAndOwner/%sessionId/%ownerObjId/%petObjId',
    CHECK_IF_PET_ALREADY_EXISTS_IN_ANOTHER_HOLDING: '/naits_triglav_plugin/ApplicationServices/checkIfPetBelongsToAnimalShelter/%sessionId/%petId',
    GET_TRANSFER_BY_RANGE: '/naits_triglav_plugin/ApplicationServices/getTransferByRange/%session/%parentId/%rangeFrom/%rangeTo/%transferType/%skipCheck',
    DOWNLOAD_ATTACHED_FILE: '/naits_triglav_plugin/ApplicationServices/downloadAttachedFilePerDbObject/%session/%objectId/%objectType/%fieldName/%fileName',
    CHECK_RANGE_VALIDITY: '/naits_triglav_plugin/ApplicationServices/checkRangeValidity/%session/%orgUnitId/%startTagId/%endTagId/%tagType',
    GET_LAST_PET_MOVEMENT: '/naits_triglav_plugin/ApplicationServices/getLastPetMovement/%session/%objectId',
    CUSTOM_CREATE_MESSAGE: '/naits_triglav_plugin/MsgServices/createNewMessage/%session',
    SEARCH_MESSAGES: '/naits_triglav_plugin/MsgServices/searchMessage/%session',
    SEARCH_SUBJECTS: '/naits_triglav_plugin/MsgServices/searchSubjects/%session',
    GET_INBOX_MESSAGES: '/naits_triglav_plugin/MsgServices/getInboxMessages/%session',
    GET_INBOX_SUBJECTS: '/naits_triglav_plugin/MsgServices/getInboxSubjects/%session',
    GET_SENT_MESSAGES: '/naits_triglav_plugin/MsgServices/getSentMessages/%session',
    GET_SENT_SUBJECTS: '/naits_triglav_plugin/MsgServices/getSentSubjects/%session',
    GET_ARCHIVED_MESSAGES: '/naits_triglav_plugin/MsgServices/getArchivedMessages/%session',
    GET_ARCHIVED_SUBJECTS: '/naits_triglav_plugin/MsgServices/getArchivedSubjects/%session',
    GET_ADDITIONAL_MESSAGE_INFO: '/naits_triglav_plugin/MsgServices/getAdditionalMessageInfo/%session/%msgObjId',
    CHANGE_MESSAGE_STATUS: '/naits_triglav_plugin/MsgServices/changeMessageStatus/%session/%msgObjId',
    ARCHIVE_SUBJECT: '/naits_triglav_plugin/MsgServices/archiveSubject/%session/%subjectObjId',
    UNARCHIVE_SUBJECT: '/naits_triglav_plugin/MsgServices/unArchiveSubject/%session/%subjectObjId',
    GET_TRANSLATED_OBJECT_TYPE: '/naits_triglav_plugin/ApplicationServices/getTranslatedTableObjectType/%session/%objectTypeId',
    GET_NUMBER_OF_UNREAD_OF_MSGS_PER_USER: '/naits_triglav_plugin/MsgServices/getNumberOfUnreadMessagesPerUser/%session',
    GET_NUM_OF_UNREAD_INBOX_AND_ARCHIVED_MSGS: '/naits_triglav_plugin/MsgServices/getNumberOfUnreadInboxAndArchivedMessagesPerUser',
    UPDATE_MSG_LINK_STATUS: '/naits_triglav_plugin/MsgServices/updateStatusOfLinkBetweenMessageAndUser/%session/%messageObjId',
    GET_REGIONAL_ORG_UNITS: '/naits_triglav_plugin/MsgServices/getOrgUnitPerOrgUnitType/%session/REGIONAL_OFFICE',
    GET_MUNICIPAL_ORG_UNITS: '/naits_triglav_plugin/MsgServices/getOrgUnitPerOrgUnitType/%session/MUNICIPALITY_OFFICE',
    GET_HOLDING_KEEPER_HISTORY: '/naits_triglav_plugin/ApplicationServices/getAllKeepersByHoldingByObjId/%session/%parentId',
    GET_HERDS_PER_HOLDING: '/ReactElements/getObjectsByParentId/%session/%parentId/HERD/10000',
    GET_ANIMALS_PER_HERD: '/ReactElements/getObjectByLink/%session/%parentId/ANIMAL/ANIMAL_HERD/10000',
    ADD_ANIMAL_TO_HERD: '/naits_triglav_plugin/HerdServices/addAnimalToHerd',
    REMOVE_ANIMAL_FROM_HERD: '/naits_triglav_plugin/HerdServices/removeAnimalFromHerd',
    HERD_MASS_ACTION: '/naits_triglav_plugin/HerdServices/herdMassActions',
    INVIDIUAL_HERD_MOVEMENT_MASS_ACTION: '/naits_triglav_plugin/HerdServices/finishIndividualMovement',
    GET_AVAILABLE_ANIMALS_PER_TYPE: '/naits_triglav_plugin/HerdServices/getAllAvailableAnimalsPerSelectedType/%session/%herdObjId/%animalType',
    GET_RESPONSIBLES_PER_HERD: '/naits_triglav_plugin/HerdServices/getAllHoldingResponsiblesPerHerd/%session/%parentId',
    CHANGE_HERD_MOVEMENT_DOC_STATUS: '/naits_triglav_plugin/HerdServices/updateStatusOfMovementDocument',
    ASSIGN_HERD_LAB_SAMPLE_TO_LABORATORY: '/naits_triglav_plugin/HerdServices/assignHerdLabSampleToLaboratory',
    MASS_INV_ITEM_STATUS_CHANGE: '/naits_triglav_plugin/ApplicationServices/massTagChangeStatus',
    GET_TERMINATED_ANIMALS: '/naits_triglav_plugin/ApplicationServices/getTerminatedAnimals/%session/%objectId/%dateFrom/%dateTo/%rowlimit',
    GET_FINISHED_MOVEMENTS: '/naits_triglav_plugin/ApplicationServices/getFinishedAnimalMovements/%session/%objectId/%dateFrom/%dateTo/%rowlimit',
    GET_FINISHED_MOVEMENT_DOCS: '/naits_triglav_plugin/ApplicationServices/getFinishedMovementDocuments/%session/%destinationHoldingPic/%dateFrom/%dateTo/%rowlimit',
    GET_HOLDINGS_BY_CRITERIA: '/naits_triglav_plugin/ApplicationServices/getHoldingsByCriteria/%session/%type/%name/%pic/%keeperId/%geoCode/%address/%rowlimit',
    GET_HOLDING_RESPONSIBLES_BY_CRITERIA: '/naits_triglav_plugin/ApplicationServices/getPersonsByCriteria/%session/%idNo/%firstName/%lastName/%fullName/%geoCode/%phoneNumber/%rowlimit',
    GET_ANIMALS_BY_CRITERIA: '/naits_triglav_plugin/ApplicationServices/getAnimalsByCriteria/%session/%animalId/%status/%animalClass/%breed/%color/%country/%rowlimit',
    GET_FLOCKS_BY_CRITERIA: '/naits_triglav_plugin/ApplicationServices/getFlocksByCriteria/%session/%flockId/%status/%animalClass/%color/%rowlimit',
    GET_OUTGOING_TRANSFERS_PER_ORG_UNIT: '/naits_triglav_plugin/ApplicationServices/getOutgoingTransfersPerOrgUnit/%session/%parentId/%tagType/%startTagId/%endTagId/%dateFrom/%dateTo/%rowlimit',
    GET_INCOMING_TRANSFERS_PER_ORG_UNIT: '/naits_triglav_plugin/ApplicationServices/getIncomingTransfersPerOrgUnit/%session/%parentId/%tagType/%startTagId/%endTagId/%dateFrom/%dateTo/%rowlimit',
    MANAGE_PET_QUARANTINE: '/naits_triglav_plugin/PetServices/managePetQuarantine',
    GET_TERMINATED_PETS: '/naits_triglav_plugin/ApplicationServices/getTerminatedPets/%session/%objectId/%dateFrom/%dateTo/%rowlimit',
    GET_RELEASED_PETS: '/naits_triglav_plugin/ApplicationServices/getReleasedPets/%session/%objectId/%dateFrom/%dateTo/%rowlimit',
    SEND_EMAIL_IF_HOLDING_RESP_EXISTS: '/naits_triglav_plugin/BankInsuranceCompanies/sendEmailIfHoldingResponsibleExists',
    GET_HOLDINGS_BY_HOLDING_RESPONSIBLE_ID: '/naits_triglav_plugin/BankInsuranceCompanies/getHoldingsByHoldingResponsibleId/%session/%holdingResponsibleId',
    GET_ANIMALS_BY_HOLDINGS: '/naits_triglav_plugin/BankInsuranceCompanies/getAnimalsByHoldings/%session/%holdingObjIds',

    /* SVAROG FORMS SERVICES */
    CREATE_NEW_SVAROG_FORM_TYPE: '/naits_triglav_plugin/SvFormsServices/createNewQuestionnaireAndQuiestions',
    GET_QUESTIONNAIRES: '/naits_triglav_plugin/SvFormsServices/getQuestionnairesData',
    GET_QUESTIONNAIRES_HISTORY: '/naits_triglav_plugin/SvFormsServices/getAllQuestionnaireAnswers',
    GET_QUESTIONNAIRES_PER_OBJECT: '/naits_triglav_plugin/SvFormsServices/getQuestionnairesByParentTypeId',
    GET_EDIT_QUESTIONNAIRE_JSON_SCHEMA: '/naits_triglav_plugin/SvFormsServices/getJsonSchemaForEditedQuestionnaires/%session/%labelCode',
    GET_EDIT_QUESTIONNAIRE_UI_SCHEMA: '/naits_triglav_plugin/SvFormsServices/getCustomFormTypeUISchema/%session/%labelCode1',
    EDIT_QUESTIONS_IN_QUESTIONNAIRE: '/naits_triglav_plugin/SvFormsServices/editQuestionsInQuestionnaire',
    GET_QUESTIONNAIRE_JSON_SCHEMA: '/naits_triglav_plugin/SvFormsServices/getSVFormTypeJsonSchema/%session/%labelCode',
    GET_QUESTIONNAIRE_UI_SCHEMA: '/naits_triglav_plugin/SvFormsServices/getCustomFormTypeUISchema/%session/%labelCode',
    GET_QUESTIONNAIRE_FORM_DATA: '/naits_triglav_plugin/SvFormsServices/getQuestionsAndAnswersFormData/%session/%objectId/%parentId',
    SUBMIT_QUESTIONNAIRE: '/naits_triglav_plugin/SvFormsServices/answerQuestionsInQuestionnaire',
    EXPORT_QUESTIONNAIRE: '/naits_triglav_plugin/SvFormsServices/exportQuestionnaire',
    IMPORT_QUESTIONNAIRE: '/naits_triglav_plugin/SvFormsServices/importQuestionnaire',
    DELETE_QUESTIONNAIRE: '/naits_triglav_plugin/SvFormsServices/deleteQuestionnaire',

    /* PUBLIC SERVICES */
    PUBLIC_ANIMAL_SEARCH: '/naits_triglav_plugin/PublicServices/searchAnimalById',
    PUBLIC_ANIMAL_ADDITIONAL_DATA: '/naits_triglav_plugin/PublicServices/getAnimalMovementHistoryAndLastVaccineByAnimalObjId',

    /* TICKET/MESSAGING SUBSYSTEM */
    /* BEGIN */
    CREATE_CONVERSATION: '/ReactElements/createConversation/',
    GET_CONVERSATION_HEADER: '/ReactElements/getConversationHeader/',
    GET_CONVERSATION_DATA: '/ReactElements/getConversationData/',
    CREATE_MSGS: '/ReactElements/createTableRecord/',
    DELETE_CONVERSATION_MSGS: '/naits_triglav_plugin/ApplicationServices/deleteObject/',
    GET_MESSAGES: '/ReactElements/getMessagesForConversation/',
    UPDATE_CONV_STATE: '/ReactElements/updateSvConversationState/%session/%object_id',
    COUNT_UNREAD_MSGS: '/naits_triglav_plugin/ApplicationServices/countUnreadMessages/%session',
    SVAROG_CONVERSATION: '/ReactElements/getTableFieldList/%session/%gridName',
    GET_DATA_TABLE: '/ReactElements/getConversationGridData/%session/%convType/%user_name/%is_unread',
    GET_CONVERSATION_WITH_FILTER: '/ReactElements/getTableWithFilter/%session/%table_name/%fieldNAme/%fieldValue/%no_rec'
    /* END */
  }
}
