import React from 'react'

export function guideConfig (requestedGuide) {
  const guideTypes = {
    GUIDE: {
      LIST_OF_ITEMS: [
        {
          step: 1,
          selector: '.bm-burger-button',
          title: <h4>Main Menu</h4>,
          body: <p>Main Menu where all allocated links for the user are placed within the system</p>
        },
        {
          step: 2,
          selector: '#searchAndLoadForm',
          title: <h4>Search form</h4>,
          body: <p>Show search form for the selected item</p>
        },

        {
          step: 3,
          selector: '.displayContent',
          position: 'left',
          title: <h4>Grid Placeholder</h4>,
          body: <p>Grid holder where all the data is shown for the chosen menu</p>
        },
        {
          step: 4,
          selector: '.btn',
          title: <h4>Filter</h4>,
          body: <p>Enable search filter for the columns in the grid</p>
        },
        {
          step: 5,
          selector: '#btn_notifications_link_top',
          title: <h4>Notifications</h4>,
          body: <p>Notification for the system and user</p>
        },
        {
          step: 6,
          selector: '#btn_user_profile_link_top',
          title: <h4>User Profile</h4>,
          body: <p>Profile page for editing basic and additional information for the user</p>
        },
        {
          step: 7,
          selector: '#btn_adm_console_link_top',
          title: <h4>Administrator Console</h4>,
          body: <p>Console for adding system labels</p>
        },
        {
          step: 8,
          selector: '#btn_help_link_top',
          title: <h4>Help Button</h4>,
          body: <p>Enables help assistance</p>
        },
        {
          step: 9,
          selector: '.js-components-LogonComponents-LoginForm-LoginFormStyle-module-language',
          title: <h4>Language translation</h4>,
          body: <p>Enables language support for chosen language</p>
        }
      ]
    },
    GUIDE_HOLDING: {
      LIST_OF_ITEMS: [
        {
          step: 1,
          selector: '.bm-burger-button',
          title: <h4>Main Menu</h4>,
          body: <p>Main Menu where all allocated links for the user are placed within the system</p>
        },
        {
          step: 2,
          selector: '#BrowseHolding',
          position: 'right',
          title: <h4>Browse Holding</h4>,
          body: <p>Browsing or switching between holdings per village, for next holding click on the right arrow for previous left</p>
        },
        {
          step: 3,
          selector: '#btn_notifications_nav_top',
          title: <h4>Notifications</h4>,
          body: <p>Notification for the logged in user</p>
        },
        {
          step: 4,
          selector: '#btn_user_profile_link_top',
          title: <h4>User Profile</h4>,
          body: <p>Profile page for editing basic and additional information for the user</p>
        },
        {
          step: 5,
          selector: '#btn_help_link_top',
          title: <h4>Help Button</h4>,
          body: <p>Enables help assistance</p>
        },
        {
          step: 6,
          selector: '#show_current_user',
          title: <h4>User infomration</h4>,
          body: <p>Show current user</p>
        },
        {
          step: 7,
          selector: '.js-components-LogonComponents-LoginForm-LoginFormStyle-module-language',
          title: <h4>Language translation</h4>,
          body: <p>Enables language support for chosen language</p>
        },
        {
          step: 8,
          selector: '#record_info',
          title: <h4>Holding</h4>,
          body: <p>Additional holding information</p>
        },
        {
          step: 9,
          selector: '#activateStatuses',
          title: <h4>Holding status</h4>,
          body: <p>Displays the holding status. Holding health shows the percentage of healthy animals.
          If the percentage is lower than 100%, the slider changes the color and the percentage number decreases.
          The movement sections shows whether the holding can initiate a movement, the slider being green if affirmative,
          red if negative. The quarantine status displays whether the holding belongs to an active quarantine.
          The icon is grayed out and the slider is green if the holding is not in a quarantine, contrary to a red slider and orange
            icon if the holding is in an active quarantine.</p>
        },
        {
          step: 10,
          selector: '#showMap',
          title: <h4>Show map</h4>,
          body: <p>On click it will open geo-location of the holding and display its assets.</p>
        },
        {
          step: 11,
          selector: '#showPrint',
          title: <h4>Prints</h4>,
          body: <p>On hover, this button will show all the available printouts (in .pdf format) for this holding.
          When clicking one of the printouts, the print will be opened in a new tab and the user can download it.
          </p>
        },
        {
          step: 12,
          selector: '#list_item_holding_details',
          title: <h4>Holding Details</h4>,
          body: <p>On click it will be shown form with information about selected holding</p>
        },
        {
          step: 13,
          selector: '#list_item_holding_keeper',
          title: <h4>Keeper</h4>,
          body: <p>Grid with information about holding keepers</p>
        },
        {
          step: 14,
          selector: '#list_item_holding_herder',
          title: <h4>Herder</h4>,
          body: <p>Grid with information about holding herder</p>
        },
        {
          step: 15,
          selector: '#list_item_holding_associated',
          title: <h4>Holding associated</h4>,
          body: <p>Grid with information about holding associated</p>
        },
        {
          step: 16,
          selector: '#movement_document',
          title: <h4>Movement documents</h4>,
          body: <p>On click it will be shown grid with information about movement documents</p>
        },
        {
          step: 17,
          selector: '.btn',
          title: <h4>Filter</h4>,
          body: <p>Enable search filter for the columns in the grid</p>
        },
        {
          step: 18,
          selector: '#activateMenu',
          title: <h4>Actions</h4>,
          body: <p>This action allows changing the status of movement documents. If there is no blocking movement then the status of the movement documents changes to Released, and in turn creates the Movement document blocks.
            You can also change the status of movement documents in Cancelled</p>
        },
        {
          step: 19,
          selector: '#list_item_animal',
          title: <h4>Animals</h4>,
          body: <p>On click it will be shown grids with capability for transitioning</p>
        },
        {
          step: 20,
          selector: '#activateMenu',
          title: <h4>Actions</h4>,
          body: <p>When Animals are shown.You will have enabled action that on mouse over it will be shown list of actions that can be applied on selected animal</p>
        },
        {
          step: 21,
          selector: '#list_item_animal_movement',
          title: <h4>Incoming Animals</h4>,
          body: <p>Opens schedule for incoming animals</p>
        },
        {
          step: 22,
          selector: '#dateTimeNow',
          title: <h4>Date time</h4>,
          body: <p>When schedule is open. You can enter date when animal is set for moving</p>
        },
        {
          step: 23,
          selector: '#list_item_outgoing_animals',
          title: <h4>Outgoing Animals</h4>,
          body: <p>When a holding sent some animal,the movement appears in the Outgoing animals screen</p>
        },
        {
          step: 24,
          selector: '#activateMenu',
          title: <h4>Actions</h4>,
          body: <p>Action for cancel movement,so when a holding sent some animal, and the movement appears in the Outgoing animals screen. This movements can be canceled, so the movement will return with status VALID in the source holding, and the movement will have status CANCELED.</p>
        },
        {
          step: 25,
          selector: '#list_item_flock',
          title: <h4>Flock</h4>,
          body: <p>Information about the flock and additional information for the animals in the flock</p>
        },
        {
          step: 26,
          selector: '#list_item_flock_movement',
          title: <h4>Incoming flock</h4>,
          body: <p>Opens schedule for incoming flock</p>
        },
        {
          step: 27,
          selector: '#list_item_outgoing_flocks',
          title: <h4>Outgoing flock</h4>,
          body: <p>When a holding sent some flock,the movement appears in the Outgoing flock screen</p>
        },
        {
          step: 28,
          selector: '#activateMenu',
          title: <h4>Actions</h4>,
          body: <p>Action for cancel movement,so when a holding sent some flock, and the movement appears in the Outgoing flock screen. This movements can be canceled, so the movement will return with status VALID in the source holding, and the movement will have status CANCELED.</p>
        },
        {
          step: 29,
          selector: '#list_item_lab_sample',
          title: <h4>Laboratory sample</h4>,
          body: <p>On click it will be shown grid with information about laboratory sample. Preview laboratory samples that already exist for laboratory. Once the sample is taken, it has an initial status COLLECTED. </p>
        },
        {
          step: 30,
          selector: '.btn',
          title: <h4>Add and filter</h4>,
          body: <p>Enable add and search filter for the columns in the grid.By pressing the add button it is possible to add a laboratory sample</p>
        },
        {
          step: 31,
          selector: '#activateMenu',
          title: <h4>Actions</h4>,
          body: <p>Assign action for awaiting appointment of a laboratory sample to an appropriate laboratory.The initial status of the lab sample is Collected. By performing the action, the status of the laboratory sample changes from Collected to Received</p>
        },
        {
          step: 32,
          selector: '#list_item_export_quarantine',
          title: <h4>Quarantine</h4>,
          body: <p>Information about quarantine.On click you can choose export certificate</p>
        },
        {
          step: 33,
          selector: '#list_item_other_animals',
          title: <h4>Other animals</h4>,
          body: <p>Information about other animals</p>
        },
        {
          step: 34,
          selector: '#list_item_spot_check',
          title: <h4>Spot check</h4>,
          body: <p>Information about spot check</p>
        }
      ]
    },

    GUIDE_HOLDING_USER: {
      LIST_OF_ITEMS: [
        {
          step: 1,
          selector: '.bm-burger-button',
          title: <h4>Main Menu</h4>,
          body: <p>Main Menu where all allocated links for the user are placed within the system</p>
        },
        {
          step: 2,
          selector: '#BrowseHolding',
          position: 'right',
          title: <h4>Browse_Holding</h4>,
          body: <p>Browsing or switching between holdings per village, for next holding click on the right arrow for previous left</p>
        },
        {
          step: 3,
          selector: '#record_info',
          title: <h4>Holding</h4>,
          body: <p>Additional holding information</p>
        },
        {
          step: 4,
          selector: '#list_item_animal',
          title: <h4>Animals</h4>,
          body: <p>On click it will be shown grids with capability for transitioning</p>
        },
        {
          step: 5,
          selector: '#activateMenu',
          title: <h4>Actions</h4>,
          body: <p>When Animals are shown.You will have enabled action that on mouse over it will be shown list of actions that can be applied on selected animal</p>
        },
        {
          step: 6,
          selector: '#list_item_lab_sample',
          title: <h4>Laboratory sample</h4>,
          body: <p>On click it will be shown grid with information about laboratory sample. Preview laboratory samples that already exist for laboratory. Once the sample is taken, it has an initial status COLLECTED. </p>
        },
        {
          step: 7,
          selector: '.btn',
          title: <h4>Add and filter</h4>,
          body: <p>Enable add and search filter for the columns in the grid.By pressing the add button it is possible to add a laboratory sample</p>
        },
        {
          step: 8,
          selector: '#objectInfoSummary',
          title: <h4>Summary info</h4>,
          body: <p>Show summary info for population </p>
        },
        {
          step: 9,
          selector: '#activateStatuses',
          title: <h4>Holding status</h4>,
          body: <p>Still in development... On hover it will be shown 3 types of statuses</p>
        },
        {
          step: 10,
          selector: '#showMap',
          title: <h4>Show map</h4>,
          body: <p>On click it will open geo-location of the holding</p>
        },
        {
          step: 11,
          selector: '#showPrint',
          title: <h4>Prints</h4>,
          body: <p>Still in development... On hover you can choose between different types of prints</p>
        },
        {
          step: 12,
          selector: '#activateMenu',
          title: <h4>Actions</h4>,
          body: <p>Assign action for awaiting appointment of a laboratory sample to an appropriate laboratory.The initial status of the lab sample is Collected. By performing the action, the status of the laboratory sample changes from Collected to Received</p>
        },
        {
          step: 13,
          selector: '#btn_notifications_nav_top',
          title: <h4>Notifications</h4>,
          body: <p>Notification for the system and user</p>
        },
        {
          step: 14,
          selector: '#btn_user_profile_link_top',
          title: <h4>User Profile</h4>,
          body: <p>Profile page for editing basic and additional information for the user</p>
        },
        {
          step: 15,
          selector: '#btn_help_link_top',
          title: <h4>Help Button</h4>,
          body: <p>Enables help assistance</p>
        },
        {
          step: 16,
          selector: '#show_current_user',
          title: <h4>User infomration</h4>,
          body: <p>Show current user</p>
        },
        {
          step: 17,
          selector: '.js-components-LogonComponents-LoginForm-LoginFormStyle-module-language',
          title: <h4>Language translation</h4>,
          body: <p>Enables language support for chosen language</p>
        }
      ]
    },
    GUIDE_POPULATION: {
      LIST_OF_ITEMS: [
        {
          step: 1,
          selector: '.bm-burger-button',
          title: <h4><ins><b>Step 0:</b></ins><h4>Main Menu</h4></h4>,
          body: <p>Main Menu where all allocated links for the user are placed within the system</p>
        },
        {
          step: 2,
          selector: '#record_info',
          position: 'right',
          title: <h4><ins><b>Step 0:</b></ins><h4>Population</h4></h4>,
          body: <p>Show basic information about the selected population</p>
        },
        {
          step: 3,
          selector: '#list_item_population_details',
          title: <h4><ins><b>Step 1:</b></ins><h4>Edit Population Info</h4></h4>,
          body: <p>Open form for editinig information for the selected population</p>
        },
        {
          step: 4,
          selector: '#save_form_btn',
          title: <h4><ins><b>Step 2:</b></ins><h4>Save button</h4></h4>,
          body: <p>All the changes that you want to make to the already selected population can be saved by pressing the 'Save' button</p>
        },
        {
          step: 5,
          selector: '#list_item_area_population',
          title: <h4><ins><b>Step 3:</b></ins><h4>Area filters</h4></h4>,
          body: <p>By selecting the <b>Configure Area Filter </b> button, opens a grid in which information about status, area name and type information is displayed.Performs filtration of which holdings and animals will be selected</p>
        },
        {
          step: 6,
          selector: '.btn',
          title: <h4><ins><b>Step 4:</b></ins><h4>FindExsisting and Filter button</h4></h4>,
          body: <p>By selecting the <b>FindExsisting</b> button,a grid opens from which the user can select an existing Area. By selecting the <b>Filter</b> button,the filter for the columns in the grid  is enabled</p>
        },
        {
          step: 7,
          selector: '#list_item_criteria',
          title: <h4><ins><b>Step 5:</b></ins><h4>Configure other filter(s)</h4></h4>,
          body: <p>Additional filtering of the already selected animals and holdings is carried out.All animals and holdings that fulfill all conditions will be part of the “Generate population” action</p>
        },
        {
          step: 8,
          selector: '.btn',
          title: <h4><ins><b>Step 6:</b></ins><h4>Add and Filter button</h4></h4>,
          body: <p> By selecting the <b>Add</b> button, a form is opened by which the user can add a new filter. By selecting the <b>Filter</b> button,the filter for the columns in the grid is enabled</p>
        },
        {
          step: 9,
          selector: '#list_item_vacination_event',
          title: <h4><ins><b>Step 7:</b></ins><h4>Campaign</h4></h4>,
          body: <p>On click it will be shown grid with information about campaign</p>
        },
        {
          step: 10,
          selector: '.btn',
          title: <h4><ins><b>Step 8:</b></ins><h4>FindExsisting and Filter button</h4></h4>,
          body: <p>By selecting the <b>FindExsisting</b> button,a grid opens from which the user can select an existing Campaign.Overview of campaigns that already exist for the population.By selecting the <b>Filter</b> button,the filter for the columns in the grid  is enabled</p>
        },
        {
          step: 11,
          selector: '#list_item_selection_result',
          title: <h4><ins><b>Step 9:</b></ins><h4>Selection result</h4></h4>,
          body: <p>Grid with information about selection result</p>
        },
        {
          step: 12,
          selector: '#selected_object',
          title: <h4><ins><b>Step 10:</b></ins><h4>Generate population</h4></h4>,
          body: <p>In order to successfully start population processing, the user must have completed all necessary information in Configure Area filter and Configure other filter(s)</p>
        },
        {
          step: 13,
          selector: '#info',
          title: <h4><ins><b>Step 11:</b></ins><h4>Info</h4></h4>,
          body: <p>Allow the user to view what is recorded with the appropriate population</p>
        },
        {
          step: 14,
          selector: '#change_status',
          title: <h4><ins><b>Step 12:</b></ins><h4>Change status</h4></h4>,
          body: <p>Once the user has reviewed the population, he can change its status from Valid to Draft or Final</p>
        },
        {
          step: 15,
          selector: '#select-all-checkbox',
          title: <h4><ins><b>Step 13:</b></ins><h4>Selection result grid</h4></h4>,
          body: <p>In this grid, the user can view all the data recorded after the processing population is completed</p>
        },
        {
          step: 16,
          selector: '.btn',
          title: <h4><ins><b>Step 14:</b></ins><h4>Filter</h4></h4>,
          body: <p>Enable search filter for the columns in the grid</p>
        },
        {
          step: 17,
          selector: '#list_item_semple',
          title: <h4><ins><b>Step 15:</b></ins><h4>Sample selection</h4></h4>,
          body: <p>This module uses the population of objects created by the population module, in order to select a number of holding(s) / animals for inspection or sampling</p>
        },
        {
          step: 18,
          selector: '.btn',
          title: <h4><ins><b>Step 16:</b></ins><h4>Filter button</h4></h4>,
          body: <p> By selecting the <b>Add</b> button, a form is opened by which the user can add a new sample selection. By selecting the <b>Filter</b> button,the filter for the columns in the grid is enabled</p>
        },
        {
          step: 19,
          selector: '#objectInfoSummary',
          title: <h4><ins><b>Step 17:</b></ins><h4>Summary info</h4></h4>,
          body: <p>Show summary info for population </p>
        },
        {
          step: 20,
          selector: '#showPrint',
          title: <h4><ins><b>Step 18:</b></ins><h4>Print</h4></h4>,
          body: <p>Allow the user to view what is recorded with the appropriate population</p>
        },
        {
          step: 21,
          selector: '#btn_notifications_nav_top',
          title: <h4><ins><b>Step 19:</b></ins><h4>Notifications</h4></h4>,
          body: <p>Notification for the system and user</p>
        },
        {
          step: 22,
          selector: '#btn_user_profile_link_top',
          title: <h4><ins><b>Step 20:</b></ins><h4>User profile</h4></h4>,
          body: <p>Profile page for editing basic and additional information for the user</p>
        },
        {
          step: 23,
          selector: '#btn_help_link_top',
          title: <h4><ins><b>Step 21:</b></ins><h4>Help button</h4></h4>,
          body: <p>Enables help assistance</p>
        },
        {
          step: 24,
          selector: '#show_current_user',
          title: <h4><ins><b>Step 22:</b></ins><h4>User information</h4></h4>,
          body: <p>Show current user</p>
        },
        {
          step: 25,
          selector: '.js-components-LogonComponents-LoginForm-LoginFormStyle-module-language',
          title: <h4><ins><b>Step 23:</b></ins><h4>Language translation</h4></h4>,
          body: <p>Enables language support for chosen language</p>
        }
      ]
    },
    GUIDE_AREA: {
      LIST_OF_ITEMS: [
        {
          step: 1,
          selector: '.bm-burger-button',
          title: <h4>Main Menu</h4>,
          body: <p>Main Menu where all allocated links for the user are placed within the system</p>
        },
        {
          step: 2,
          selector: '#record_info',
          position: 'right',
          title: <h4>Area</h4>,
          body: <p>Show basic information about the selected area</p>
        },
        {
          step: 3,
          selector: '#list_item_area_health',
          title: <h4>Area health</h4>,
          body: <p>Create area health status about specific area</p>
        },
        {
          step: 4,
          selector: '#objectInfoSummary',
          title: <h4>Summary info</h4>,
          body: <p>Show summary info for area</p>
        },
        {
          step: 5,
          selector: '#showPrint',
          title: <h4>Print</h4>,
          body: <p>Show affected area information </p>
        },
        {
          step: 6,
          selector: '#btn_notifications_nav_top',
          title: <h4>Notifications</h4>,
          body: <p>Notification for the system and user</p>
        },
        {
          step: 7,
          selector: '#btn_user_profile_link_top',
          title: <h4>User Profile</h4>,
          body: <p>Profile page for editing basic and additional information for the user</p>
        },
        {
          step: 8,
          selector: '#btn_help_link_top',
          title: <h4>Help Button</h4>,
          body: <p>Enables help assistance</p>
        },
        {
          step: 9,
          selector: '#show_current_user',
          title: <h4>User infomration</h4>,
          body: <p>Show current user</p>
        },
        {
          step: 10,
          selector: '.js-components-LogonComponents-LoginForm-LoginFormStyle-module-language',
          title: <h4>Language translation</h4>,
          body: <p>Enables language support for chosen language</p>
        }
      ]
    },

    GUIDE_EXPORT_CERT: {
      LIST_OF_ITEMS: [
        {
          step: 1,
          selector: '.bm-burger-button',
          title: <h4>Main Menu</h4>,
          body: <p>Main Menu where all allocated links for the user are placed within the system</p>
        },
        {
          step: 2,
          selector: '#list_item_certified_animals',
          position: 'right',
          title: <h4>Certified animals</h4>,
          body: <p>On click it will open a grid with all the animals that are certified</p>
        },
        {
          step: 3,
          selector: '.btn',
          title: <h4>Filter</h4>,
          body: <p>Enable search filter for the columns in the grid</p>
        },
        {
          step: 4,
          selector: '#export_certified_animals',
          title: <h4>Export certified animals</h4>,
          body: <p>With this action animal certification is carried out. Thе status is changed from 'PENDINGEXPORT' to 'EXPORTED'</p>
        },
        {
          step: 5,
          selector: '#showPrint',
          title: <h4>Print</h4>,
          body: <p>Preview information about certified animals.
            The report is generated after the animals are certified. When they are not certified, a blank list is generated </p>
        },
        {
          step: 6,
          selector: '#btn_notifications_nav_top',
          title: <h4>Notifications</h4>,
          body: <p>Notification for the system and user</p>
        },
        {
          step: 7,
          selector: '#btn_user_profile_link_top',
          title: <h4>User Profile</h4>,
          body: <p>Profile page for editing basic and additional information for the user</p>
        },
        {
          step: 8,
          selector: '#btn_help_link_top',
          title: <h4>Help Button</h4>,
          body: <p>Enables help assistance</p>
        },
        {
          step: 9,
          selector: '#show_current_user',
          title: <h4>User infomration</h4>,
          body: <p>Show current user</p>
        },
        {
          step: 10,
          selector: '.js-components-LogonComponents-LoginForm-LoginFormStyle-module-language',
          title: <h4>Language translation</h4>,
          body: <p>Enables language support for chosen language</p>
        }
      ]
    },
    GUIDE_QUARANTINE: {
      LIST_OF_ITEMS: [
        {
          step: 1,
          selector: '.bm-burger-button',
          title: <h4>Main Menu</h4>,
          body: <p>Main Menu where all allocated links for the user are placed within the system</p>
        },
        {
          step: 2,
          selector: '#record_info',
          position: 'right',
          title: <h4>Quarantine</h4>,
          body: <p>Show basic information about the selected quarantine</p>
        },
        {
          step: 3,
          selector: '#list_item_quarantine_details',
          title: <h4>Quarantine</h4>,
          body: <p>Open form for editinig information for the selected quarantine</p>
        },
        {
          step: 4,
          selector: '#list_item_export_certificate',
          title: <h4>Export certification</h4>,
          body: <p> Generate and preview export certificates for the selected quarantine </p>
        },
        {
          step: 5,
          selector: '#list_item_disease',
          title: <h4>Disease</h4>,
          body: <p>Preview and adding diseases that already exist for quarantine</p>
        },
        {
          step: 6,
          selector: '#list_item_holding_details',
          title: <h4>Holding details</h4>,
          body: <p>Preview and adding holdings that already exist for quarantine</p>
        },
        {
          step: 7,
          selector: '#objectInfoSummary',
          title: <h4>Summary info</h4>,
          body: <p>Show summary info for quarantine</p>
        },
        {
          step: 8,
          selector: '#showMap',
          title: <h4>Show map</h4>,
          body: <p>Still in development... On click it will open geo-location of the quarantine</p>
        },
        {
          step: 9,
          selector: '#showPrint',
          title: <h4>Print</h4>,
          body: <p>Report information about diseases, animals and export certificates</p>
        },
        {
          step: 10,
          selector: '#btn_notifications_nav_top',
          title: <h4>Notifications</h4>,
          body: <p>Notification for the system and user</p>
        },
        {
          step: 11,
          selector: '#btn_user_profile_link_top',
          title: <h4>User Profile</h4>,
          body: <p>Profile page for editing basic and additional information for the user</p>
        },
        {
          step: 12,
          selector: '#btn_help_link_top',
          title: <h4>Help Button</h4>,
          body: <p>Enables help assistance</p>
        },
        {
          step: 13,
          selector: '#show_current_user',
          title: <h4>User infomration</h4>,
          body: <p>Show current user</p>
        },
        {
          step: 14,
          selector: '.js-components-LogonComponents-LoginForm-LoginFormStyle-module-language',
          title: <h4>Language translation</h4>,
          body: <p>Enables language support for chosen language</p>
        }
      ]
    },
    GUIDE_LABORATORY: {
      LIST_OF_ITEMS: [
        {
          step: 1,
          selector: '.bm-burger-button',
          title: <h4>Main Menu</h4>,
          body: <p>Main Menu where all allocated links for the user are placed within the system</p>
        },
        {
          step: 2,
          selector: '#record_info',
          position: 'right',
          title: <h4>Laboratory</h4>,
          body: <p>Show basic information about the selected laboratory</p>
        },
        {
          step: 3,
          selector: '#list_item_laboratory',
          title: <h4>Laboratory</h4>,
          body: <p>Open form for editinig information of the already existing laboratory</p>
        },
        {
          step: 4,
          selector: '#btnSeparator',
          title: <h4>Save Button</h4>,
          body: <p>By clicking on the Save button, all the changes that have been made are saved</p>
        },
        {
          step: 5,
          selector: '#list_item_lab_sample',
          title: <h4>Laboratory sample</h4>,
          body: <p>On click it will be shown grid with information about laboratory sample. Preview laboratory samples that already exist for laboratory. When the sample is in the laboratory, it has the status Queued. </p>
        },
        {
          step: 6,
          selector: '.btn',
          title: <h4>Filter</h4>,
          body: <p>Enable search filter for the columns in the grid</p>
        },
        {
          step: 7,
          selector: '#activateMenu',
          title: <h4>Actions</h4>,
          body: <p>Action to change the status of a laboratory sample. The user logged on in the system can change the status of a laboratory sample from Queued to Received or Rejected</p>
        },
        {
          step: 8,
          selector: '#btn_notifications_nav_top',
          title: <h4>Notifications</h4>,
          body: <p>Notification for the system and user</p>
        },
        {
          step: 9,
          selector: '#btn_user_profile_link_top',
          title: <h4>User Profile</h4>,
          body: <p>Profile page for editing basic and additional information for the user</p>
        },
        {
          step: 10,
          selector: '#btn_help_link_top',
          title: <h4>Help Button</h4>,
          body: <p>Enables help assistance</p>
        },
        {
          step: 11,
          selector: '#show_current_user',
          title: <h4>User infomration</h4>,
          body: <p>Show current user</p>
        },
        {
          step: 12,
          selector: '.js-components-LogonComponents-LoginForm-LoginFormStyle-module-language',
          title: <h4>Language translation</h4>,
          body: <p>Enables language support for chosen language</p>
        }
      ]
    },
    GUIDE_LAB_SAMPLE_USER: {
      LIST_OF_ITEMS: [
        {
          step: 1,
          selector: '.bm-burger-button',
          title: <h4>Main Menu</h4>,
          body: <p>Main Menu where all allocated links for the user are placed within the system</p>
        },
        {
          step: 2,
          selector: '#selected_item',
          position: 'right',
          title: <h4>Laboratory sample</h4>,
          body: <p>Additional laboratory sample information</p>
        },
        {
          step: 3,
          selector: '#list_item_lab_sample',
          title: <h4>Edit Laboratory sample </h4>,
          body: <p>Open form for editinig information for the selected laboratory sample</p>
        },
        {
          step: 4,
          selector: '#btnSeparator',
          title: <h4>Save Button</h4>,
          body: <p>By clicking on the Save button, all the changes that have been made are saved</p>
        },
        {
          step: 5,
          selector: '#list_item_lab_sample_result',
          title: <h4>Laboratory test result</h4>,
          body: <p>On click it will be shown grid with information about laboratory test result.Test result is generated when the sample gets status RECEIVED from the laboratory that the sample was sent to</p>
        },
        {
          step: 6,
          selector: '.btn',
          title: <h4>Filter</h4>,
          body: <p>Enable search filter for the columns in the grid</p>
        },
        {
          step: 11,
          selector: '#btn_notifications_nav_top',
          title: <h4>Notifications</h4>,
          body: <p>Notification for the system and user</p>
        },
        {
          step: 12,
          selector: '#btn_user_profile_link_top',
          title: <h4>User Profile</h4>,
          body: <p>Profile page for editing basic and additional information for the user</p>
        },
        {
          step: 13,
          selector: '#btn_help_link_top',
          title: <h4>Help Button</h4>,
          body: <p>Enables help assistance</p>
        },
        {
          step: 14,
          selector: '#show_current_user',
          title: <h4>User infomration</h4>,
          body: <p>Show current user</p>
        },
        {
          step: 15,
          selector: '.js-components-LogonComponents-LoginForm-LoginFormStyle-module-language',
          title: <h4>Language translation</h4>,
          body: <p>Enables language support for chosen language</p>
        }

      ]
    },
    GUIDE_LAB_SAMPLE: {
      LIST_OF_ITEMS: [
        {
          step: 1,
          selector: '.bm-burger-button',
          title: <h4>Main Menu</h4>,
          body: <p>Main Menu where all allocated links for the user are placed within the system</p>
        },
        {
          step: 2,
          selector: '#selected_item',
          position: 'right',
          title: <h4>Laboratory sample</h4>,
          body: <p>Additional laboratory sample information</p>
        },
        {
          step: 3,
          selector: '#list_item_lab_sample',
          title: <h4>Edit Laboratory sample </h4>,
          body: <p>Open form for editinig information for the selected laboratory sample</p>
        },
        {
          step: 4,
          selector: '#btnSeparator',
          title: <h4>Save Button</h4>,
          body: <p>By clicking on the Save button, all the changes that have been made are saved</p>
        },
        {
          step: 5,
          selector: '#list_item_lab_sample_result',
          title: <h4>Laboratory test result</h4>,
          body: <p>On click it will be shown grid with information about laboratory test result.Test result is generated when the sample gets status RECEIVED from the laboratory that the sample was sent to</p>
        },
        {
          step: 6,
          selector: '.btn',
          title: <h4>Filter</h4>,
          body: <p>Enable search filter for the columns in the grid</p>
        },
        {
          step: 11,
          selector: '#btn_notifications_nav_top',
          title: <h4>Notifications</h4>,
          body: <p>Notification for the system and user</p>
        },
        {
          step: 12,
          selector: '#btn_user_profile_link_top',
          title: <h4>User Profile</h4>,
          body: <p>Profile page for editing basic and additional information for the user</p>
        },
        {
          step: 13,
          selector: '#btn_help_link_top',
          title: <h4>Help Button</h4>,
          body: <p>Enables help assistance</p>
        },
        {
          step: 14,
          selector: '#show_current_user',
          title: <h4>User infomration</h4>,
          body: <p>Show current user</p>
        },
        {
          step: 15,
          selector: '.js-components-LogonComponents-LoginForm-LoginFormStyle-module-language',
          title: <h4>Language translation</h4>,
          body: <p>Enables language support for chosen language</p>
        }

      ]
    },
    GUIDE_LAB_TEST_TYPE: {
      LIST_OF_ITEMS: [
        {
          step: 1,
          selector: '.bm-burger-button',
          title: <h4>Main Menu</h4>,
          body: <p>Main Menu where all allocated links for the user are placed within the system</p>
        },
        {
          step: 2,
          selector: '#record_info',
          position: 'right',
          title: <h4>Test type</h4>,
          body: <p>Show basic information about the selected test type</p>
        },
        {
          step: 3,
          selector: '#list_item_lab_test_type',
          title: <h4>Test Type</h4>,
          body: <p>Open form for editinig information of the already existing laboratory</p>
        },
        {
          step: 4,
          selector: '#btnSeparator',
          title: <h4>Save Button</h4>,
          body: <p>By clicking on the Save button, all the changes that have been made are saved</p>
        },
        {
          step: 5,
          selector: '#btn_notifications_nav_top',
          title: <h4>Notifications</h4>,
          body: <p>Notification for the system and user</p>
        },
        {
          step: 6,
          selector: '#btn_user_profile_link_top',
          title: <h4>User Profile</h4>,
          body: <p>Profile page for editing basic and additional information for the user</p>
        },
        {
          step: 7,
          selector: '#btn_help_link_top',
          title: <h4>Help Button</h4>,
          body: <p>Enables help assistance</p>
        },
        {
          step: 8,
          selector: '#show_current_user',
          title: <h4>User infomration</h4>,
          body: <p>Show current user</p>
        },
        {
          step: 9,
          selector: '.js-components-LogonComponents-LoginForm-LoginFormStyle-module-language',
          title: <h4>Language translation</h4>,
          body: <p>Enables language support for chosen language</p>
        }
      ]
    },

    GUIDE_ANIMAL: {
      LIST_OF_ITEMS: [
        {
          step: 1,
          selector: '.bm-burger-button',
          title: <h4>Main Menu</h4>,
          body: <p>Main Menu where all allocated links for the user are placed within the system</p>
        },
        {
          step: 2,
          selector: '#selected_item',
          position: 'right',
          title: <h4>Animal</h4>,
          body: <p>Additional animal information</p>
        },
        {
          step: 3,
          selector: '#list_item_animal',
          title: <h4>Edit Animal Info</h4>,
          body: <p>Open form for editinig information for the selected animal</p>
        },
        {
          step: 4,
          selector: '#list_item_animal_movement',
          title: <h4>Movement history</h4>,
          body: <p>Table with records with movement history</p>
        },
        {
          step: 5,
          selector: '#list_item_vaccination_book',
          title: <h4>Vaccination treatment book</h4>,
          body: <p>Info/book for all the vaccinated animals</p>
        },
        {
          step: 6,
          selector: '#list_item_lab_sample',
          title: <h4>Laboratory sample</h4>,
          body: <p>On click it will be shown grid with information about laboratory sample. Preview laboratory samples that already exist for laboratory. Once the sample is taken, it has an initial status COLLECTED. </p>
        },
        {
          step: 7,
          selector: '.btn',
          title: <h4>Add and filter</h4>,
          body: <p>Enable add and search filter for the columns in the grid.By pressing the add button it is possible to add a laboratory sample</p>
        },
        {
          step: 8,
          selector: '#activateMenu',
          title: <h4>Actions</h4>,
          body: <p>Assign action for awaiting appointment of a laboratory sample to an appropriate laboratory.The initial status of the lab sample is Collected. By performing the action, the status of the laboratory sample changes from Collected to Received</p>
        },
        {
          step: 9,
          selector: '#objectInfoSummary',
          title: <h4>Summary info</h4>,
          body: <p>Show summary info for population </p>
        },
        {
          step: 10,
          selector: '#showPrint',
          title: <h4>Print</h4>,
          body: <p>Empty list for animal for manual input</p>
        },
        {
          step: 11,
          selector: '#btn_notifications_nav_top',
          title: <h4>Notifications</h4>,
          body: <p>Notification for the system and user</p>
        },
        {
          step: 12,
          selector: '#btn_user_profile_link_top',
          title: <h4>User Profile</h4>,
          body: <p>Profile page for editing basic and additional information for the user</p>
        },
        {
          step: 13,
          selector: '#btn_help_link_top',
          title: <h4>Help Button</h4>,
          body: <p>Enables help assistance</p>
        },
        {
          step: 14,
          selector: '#show_current_user',
          title: <h4>User infomration</h4>,
          body: <p>Show current user</p>
        },
        {
          step: 15,
          selector: '.js-components-LogonComponents-LoginForm-LoginFormStyle-module-language',
          title: <h4>Language translation</h4>,
          body: <p>Enables language support for chosen language</p>
        }

      ]
    },
    GUIDE_ANIMAL_USER: {
      LIST_OF_ITEMS: [
        {
          step: 1,
          selector: '.bm-burger-button',
          title: <h4>Main Menu</h4>,
          body: <p>Main Menu where all allocated links for the user are placed within the system</p>
        },
        {
          step: 2,
          selector: '#selected_item',
          position: 'right',
          title: <h4>Animal</h4>,
          body: <p>Additional animal information</p>
        },
        {
          step: 3,
          selector: '#list_item_vaccination_book',
          title: <h4>Vaccination treatment book</h4>,
          body: <p>Info/book for all the vaccinated animals</p>
        },
        {
          step: 4,
          selector: '#list_item_lab_sample',
          title: <h4>Laboratory sample</h4>,
          body: <p>On click it will be shown grid with information about laboratory sample. Preview laboratory samples that already exist for laboratory. Once the sample is taken, it has an initial status COLLECTED. </p>
        },
        {
          step: 5,
          selector: '.btn',
          title: <h4>Add and filter</h4>,
          body: <p>Enable add and search filter for the columns in the grid.By pressing the add button it is possible to add a laboratory sample</p>
        },
        {
          step: 6,
          selector: '#objectInfoSummary',
          title: <h4>Summary info</h4>,
          body: <p>Show summary info for population </p>
        },
        {
          step: 7,
          selector: '#showPrint',
          title: <h4>Print</h4>,
          body: <p>Empty list for animal for manual input</p>
        },
        {
          step: 8,
          selector: '#btn_notifications_nav_top',
          title: <h4>Notifications</h4>,
          body: <p>Notification for the system and user</p>
        },
        {
          step: 9,
          selector: '#btn_user_profile_link_top',
          title: <h4>User Profile</h4>,
          body: <p>Profile page for editing basic and additional information for the user</p>
        },
        {
          step: 10,
          selector: '#btn_help_link_top',
          title: <h4>Help Button</h4>,
          body: <p>Enables help assistance</p>
        },
        {
          step: 11,
          selector: '#show_current_user',
          title: <h4>User infomration</h4>,
          body: <p>Show current user</p>
        },
        {
          step: 12,
          selector: '.js-components-LogonComponents-LoginForm-LoginFormStyle-module-language',
          title: <h4>Language translation</h4>,
          body: <p>Enables language support for chosen language</p>
        }
      ]
    }
  }

  return guideTypes[requestedGuide]
}
