import { createSlice } from "@reduxjs/toolkit";

import {
  CalendarTypes,
  CalendarFilters,
  ProductionStates,
  Pages,
  ManufacturingFacilities,
  ServiceStates,
  Service,
  ManufacturingFacilityFilter,
} from "app/utils/constants";

import {
  mapServiceEventStateToKey,
  mapServiceTypeOfWorkToKey,
} from "app/utils/utils";

export const calendarSlice = createSlice({
  name: "calendar",
  initialState: {
    department: null,
    subDepartment: null,
    events: [], // All events
    filteredEvents: [],
    primaryEvents: [],
    secondaryEvents: [],
    filterEntry: "",
    filters: [
      ...CalendarFilters.find(
        (_filters) => _filters.key === CalendarTypes[0].key
      )?.values,
      ManufacturingFacilityFilter,
    ],
    branch: ManufacturingFacilities.langley,
    page: Pages.month,
    selectedEvent: null,
    selectedWorkOrderNumber: null,
    showQuickSearch: false,
    tempFiles: [],
    testEvents: [],
    workOrderData: {},
    result: null,
    stateChangeResult: null,
    isLoading: true,
    date: null,
    markedWorkOrderId: null,
    woManagerStatusFilter: "",
    monthWorkOrders: [],
    weekWorkOrders: [], // For calendar Filter
    dayWorkOrders: [],
    updateFilteredDayWorkOrders: [],
    isFilterClean: true,
    filteredWorkOrders: [],
    appliedFilteredWorkOrders: [],
    error: null,
    showMessage: false,
  },
  reducers: {
    updateEvents: (state, action) => {
      state.events = action.payload;
    },
    updateFilteredEvents: (state, action) => {
      state.filteredEvents = action.payload;
    },
    createServiceEvents: (state, action) => {
      const { workOrders, filters, filterEntry } = action.payload;
      let events = [];
      if (workOrders?.length > 0 && ServiceStates) {
        let _events = workOrders.map((wo, index) => {
          return {
            id: wo.id,
            start: wo.scheduleDate,
            end: wo.scheduleEndDate,
            title: wo.serviceId,
            city: wo.city,
            state: wo.status,
            backgroundColor:
              ServiceStates[mapServiceEventStateToKey(wo.status)]?.color,
            borderColor:
              ServiceStates[mapServiceEventStateToKey(wo.status)]?.color,
            textColor: "#000",
            typeOfWork: wo.typeofwork,
            serviceReason: wo.serviceReason,
            type: Service,
            extendedProps: {
              customerName: wo.custName,
              manufacturingFacility: wo.branch,
            },
          };
        });

        let flatFilters = [];
        let hiddenProperties = [];
        let shownEvents = [];

        filters?.forEach((f) => {
          // NOTE: Extracted this to FilterEvents in utils
          let _f = JSON.parse(JSON.stringify(f));
          _f.fields.forEach((ff) => {
            ff.groupKey = f.key;
          });
          flatFilters.push(..._f.fields);
        });

        hiddenProperties = flatFilters.filter((f) => f.value === false);

        shownEvents = _events.filter((e) => {
          return !hiddenProperties.some((h) => {
            let _comparer;

            switch (h.groupKey) {
              case "state":
                _comparer = mapServiceEventStateToKey(e[h.groupKey]);
                return h.key === _comparer;

              case "branch":
                _comparer = e.extendedProps.manufacturingFacility;
                return h.label === _comparer;
              case "typeOfWork":
                _comparer = mapServiceTypeOfWorkToKey(e[h.groupKey]);
                return h.key === _comparer;
              default:
                _comparer = e[h.groupKey];
                return h.key === _comparer;
            }
          });
        });

        if (shownEvents?.length > 0 && filterEntry) {
          let _filteredEvents = shownEvents.filter((e) => {
            if (e.title.includes(filterEntry)) {
              return e;
            }
          });

          if (_filteredEvents) {
            events = [..._filteredEvents];
          }
        } else {
          events = [...shownEvents];
        }
      }

      state.events = [...events];
    },
    createTestEvents: (state, action) => {
      const { filters, filterEntry } = action.payload;
      let testEvents = [];

      if (generateEvents && ProductionStates && filters) {
        let _events = generateEvents().map((e) => {
          let _e = { ...e };
          _e.backgroundColor = ProductionStates[e.state]?.color;
          _e.borderColor = ProductionStates[e.state]?.color;
          _e.textColor = "#000";
          return _e;
        });

        // Filter events
        let flatFilters = [];
        let hiddenProperties = [];
        let shownEvents = [];

        filters.forEach((f) => {
          // Flatten
          let _f = JSON.parse(JSON.stringify(f));
          _f.fields.forEach((ff) => {
            ff.groupKey = f.key;
          });
          flatFilters.push(..._f.fields);
        });

        hiddenProperties = flatFilters.filter((f) => f.value === false);

        _events.forEach((e) => {
          let hidden = false;
          hiddenProperties.forEach((h) => {
            if (h.key === e[h.groupKey === "record" ? "state" : h.groupKey]) {
              // Map record filter to state property
              hidden = true;
            }
          });

          if (!hidden) {
            e.extendedProps = {};
            e.extendedProps.icons = {
              flagOrder: false,
              warningIcon: false,
              shapesIcon: false,
              paintIcon: false,
              gridIcon: false,
              cardinalIcon: false,
              centraIcon: false,
              pfgIcon: false,
              vinylDoorIcon: false,
              capStockIcon: false,
              m2000Icon: false,
              glassOrderedIcon: false,
              g52pdIcon: false,
              emailIcon: false,
              smsIcon: false,
              starIcon: false,
              miniblindIcon: false,
              waterTestingRequired: false,
            };

            shownEvents.push(e);
          }
        });

        if (shownEvents?.length > 0 && filterEntry) {
          let _filteredEvents = shownEvents.filter((e) => {
            if (e.title.includes(filterEntry)) {
              return e;
            }
          });

          if (_filteredEvents) {
            testEvents = [...filteredEvents];
          }
        } else {
          testEvents = [...shownEvents];
        }
      }
      state.testEvents = testEvents;
    },
    clearEvents: (state) => {
      state.events = [];
    },
    updateAnEvent: (state, action) => {
      let _events = [...state.events];
      let index = _events.findIndex((x) => x.id === action.payload?.id);

      if (action.payload?.type === "checkbox") {
        _events[index].extendedProps.icons[action.payload?.name] =
          action.payload?.value;
      }

      if (action.payload?.type === "select") {
        _events[index]["state"] = action.payload?.value;
        _events[index]["backgroundColor"] =
          ProductionStates[action.payload?.value].color;
        _events[index]["borderColor"] =
          ProductionStates[action.payload?.value].color;
      }

      state.selectedWorkOrder = _events[index];
      state.events = _events;
    },
    updateFilters: (state, action) => {
      state.filters = action.payload;
    },
    updateFilterEntry: (state, action) => {
      state.filterEntry = action.payload;
    },
    updateDepartment: (state, action) => {
      state.department = action.payload;
    },
    updateSelectedEvent: (state, action) => {
      let _selectedEvent = action.payload;

      if (_selectedEvent?.publicId && !_selectedEvent.id) {
        _selectedEvent.id = _selectedEvent.publicId;
      }
      state.selectedEvent = _selectedEvent;
    },
    updateShowQuickSearch: (state, action) => {
      state.showQuickSearch = action.payload;
    },
    updateTempFiles: (state, action) => {
      state.tempFiles = action.payload;
    },
    updatePage: (state, action) => {
      state.page = action.payload;
    },
    updateWorkOrderData: (state, action) => {
      state.loadingWorkorder = false;
      state.workOrderData = action.payload;
    },
    updateBranch: (state, action) => {
      state.branch = action.payload;
    },
    updateResult: (state, action) => {
      state.result = action.payload;
    },
    updateStateChangeResult: (state, action) => {
      state.stateChangeResult = action.payload;
    },
    updateIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    updateDate: (state, action) => {
      state.date = action.payload;
    },
    updateMarkedWorkOrderId: (state, action) => {
      state.markedWorkOrderId = action.payload;
    },
    updateWoManagerStatusFilter: (state, action) => {
      state.woManagerStatusFilter = action.payload;
    },
    updateMonthWorkOrders: (state, action) => {
      state.monthWorkOrders = action.payload;
    },
    updateWeekWorkOrders: (state, action) => {
      state.weekWorkOrders = action.payload;
    },
    updateDayWorkOrders: (state, action) => {
      state.dayWorkOrders = action.payload;
    },
    updateFilteredDayWorkOrders: (state, action) => {
      state.filteredDayWorkOrders = action.payload;
    },
    updateIsFilterClean: (state, action) => {
      state.isFilterClean = action.payload;
    },
    updateFilteredWorkOrders: (state, action) => {
      state.filteredWorkOrders = action.payload;
    },
    updateAppliedFilteredWorkOrders: (state, action) => {
      state.appliedFilteredWorkOrders = action.payload;
    },
    updateError: (state, action) => {
      state.error = action.payload;
    },
    updateShowMessage: (state, action) => {
      state.showMessage = action.payload;
    },
    updateSubDepartment: (state, action) => {
      state.subDepartment = action.payload;
    },
    updatePrimaryEvents: (state, action) => {
      state.primaryEvents = action.payload;
    },
    updateSecondaryEvents: (state, action) => {
      state.secondaryEvents = action.payload;
    },
    updateFilteredEvents: (state, action) => {
      state.filteredEvents = action.payload;
    },
  },
});

export const {
  clearEvents,
  createInstallationEvents,
  createServiceEvents,
  createTestEvents,
  updateDepartment,
  updateFilters,
  updateFilterEntry,
  updatePage,
  updateSelectedEvent,
  updateWorkOrderData,
  updateShowQuickSearch,
  updateTempFiles,
  updateAnEvent,
  updateBranch,
  updateResult,
  updateStateChangeResult,
  updateIsLoading,
  updateDate,
  updateMarkedWorkOrderId,
  updateWoManagerStatusFilter,
  updateMonthWorkOrders,
  updateWeekWorkOrders,
  updateDayWorkOrders,
  updateFilteredDayWorkOrders,
  updateAppliedFilteredWorkOrders,
  updateIsFilterClean,
  updateFilteredWorkOrders,
  updateError,
  updateShowMessage,
  updateEvents,
  updateFilteredEvents,
  updateSubDepartment,
  updatePrimaryEvents,
  updateSecondaryEvents
} = calendarSlice.actions;

export default calendarSlice.reducer;
