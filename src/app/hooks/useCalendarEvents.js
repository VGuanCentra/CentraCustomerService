import { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import {
  Production,
  Service,
  Installation,
  Remeasure,
  Shipping,
  ManufacturingFacilities,
  Pages,
  ServiceStates,
  ProductionStates,
  InstallationStates,
  ShippingStates,
  WorkOrderSelectOptions,
  MissingData,
  Backorder,
  BackorderRowStates,
  ManufacturingFacility
} from "app/utils/constants";

import {
  YMDDateFormat,
  generateDaySummaryData,
  mapServiceEventStateToKey,
  mapProductionStateToKey,
  isValueValid,
  getKeyFromVal,
} from "app/utils/utils";

import moment from "moment";

import {
  updateFilters,
  updateShowMessage,
  updateDayWorkOrders,
  updateFilteredDayWorkOrders,
  updateWeekWorkOrders,
  updateEvents,
  updateFilteredEvents,
  updatePrimaryEvents,
  updateSecondaryEvents,
  clearEvents,
} from "app/redux/calendar";
import { convertToLocaleDateTime } from "app/utils/date";

const useCalendarEvents = ({
  date,
  workOrders,
  secondaryWorkOrders,
  departmentParam,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [dayTotals, setDayTotals] = useState({});
  const [weekTotals, setWeekTotals] = useState({});
  const [daySummaryWorkOrders, setDaySummaryWorkOrders] = useState([]);
  const [weekSummaryWorkOrders, setWeekSummaryWorkOrders] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState(null);

  const {
    department,
    subDepartment,
    filters,
    branch,
    showMessage,
    events,
    primaryEvents,
    secondaryEvents,
    appliedFilteredWorkOrders,
    page,
  } = useSelector((state) => state.calendar);

  const buildProductionEvents = useCallback((workOrders, allowDuplicates) => {
    let result = [];

    if (workOrders?.length > 0 && ProductionStates) {
      workOrders.forEach((wo, index) => {
        if (wo.workOrderNumber === "VKTEST22") {
          //console.log("wo ", wo)
        }

        const showGlassOrderedIcon =
          parseInt(wo.f26CAMin) +
            parseInt(wo.f29CA) +
            parseInt(wo.f29CM) +
            parseInt(wo.f68CA) +
            parseInt(wo.f68SL) +
            parseInt(wo.f68VS) >
          0;
        const showVinylDoorsIcon = parseInt(wo.f61DR) + parseInt(wo.f27DS) > 0;
        let _wo = {
          id: wo.workOrderNumber,
          actionItemId: wo.actionItemId,
          start: wo.startDateTime,
          end: wo.endDateTime,
          title: wo.workOrderNumber,
          allDay: true,
          state: mapProductionStateToKey(wo.currentStateName),
          backgroundColor: (() => {
            let s = mapProductionStateToKey(wo.currentStateName);
            let state = ProductionStates[s];
            let color =
              wo.cardinalOrderedDate?.trim()?.length > 0 &&
              state?.secondaryColor !== null &&
              s === "scheduled"
                ? state?.secondaryColor
                : state?.color;
            return color;
          })(),

          borderColor:
            ProductionStates[mapProductionStateToKey(wo.currentStateName)]
              ?.color,
          textColor: "#000",
          type: Production,
          branch: WorkOrderSelectOptions.branches?.find(
            (x) => x.key === wo.branchId
          )?.label,
          jobType: isValueValid(wo.jobType, "jobType", Production)
            ? wo.jobType
            : MissingData, // If value is not found in CalendarFilters, replace it with "missingData" to allow filtering
          shippingType: isValueValid(
            wo.shippingType,
            "shippingType",
            Production
          )
            ? wo.shippingType
            : MissingData, // Same as above
          glassSupplier: wo.glassSupplier,
          manufacturingFacility:
            wo.manufacturingFacility === ManufacturingFacilities.calgary
              ? ManufacturingFacilities.calgary
              : ManufacturingFacilities.langley, // Empty defaults to Langley
          engineered: wo.m2000Icon === "Yes" ? true : false,
          notEngineered: wo.m2000Icon === "Yes" ? false : true,
          project: wo.project === "Yes" ? true : false,
          notProject: wo.project === "Yes" ? false : true,
          rush: wo.flagOrder,
          notRush: !wo.flagOrder,
          bundle: wo.batchNo,
          lbrMin:
            parseInt(wo.f26CAMin, 10) +
            parseInt(wo.f27DSMin, 10) +
            parseInt(wo.f29CAMin, 10) +
            parseInt(wo.f29CMMin, 10) +
            parseInt(wo.f52PDMin, 10) +
            parseInt(wo.f61DRMin, 10) +
            parseInt(wo.f68SLMin, 10) +
            parseInt(wo.f68VSMin, 10),
          blockNo: wo.blockNo,
          extendedProps: {
            branch: WorkOrderSelectOptions.branches?.find(
              (x) => x.key === wo.branchId
            )?.label,
            doors: wo.doors,
            doubleDoors: wo.doubleDoor,
            index: index,
            windows: wo.windows,
            jobType: wo.jobType,
            f52PD: parseInt(wo.f52PD, 10) || 0,
            f26CA: parseInt(wo.f6CA, 10) || 0,
            f29CA: parseInt(wo.f29CA, 10) || 0,
            f29CM: parseInt(wo.f29CM, 10) || 0,
            f68CA: parseInt(wo.f68CA, 10) || 0,
            f68SL: parseInt(wo.f68SL, 10) || 0,
            f68VS: parseInt(wo.f68VS, 10) || 0,
            f61DR: parseInt(wo.f61DR, 10) || 0,
            f27DS: parseInt(wo.f27DS, 10) || 0,
            f26HY: parseInt(wo.f26HY, 10) || 0,
            icons: {
              capStockIcon: wo.capstockIcon?.toLowerCase() === "yes",
              rbmIcon: wo.rbmIcon?.toLowerCase() === "yes",
              vinylWrapIcon: wo.vinylWrapIcon?.toLowerCase() === "yes",
              cardinalIcon: wo.glassSupplier?.toLowerCase() === "cardinal",
              centraIcon:
                wo.glassSupplier?.toLowerCase() === "glassfab" ||
                wo.glassSupplier?.toLowerCase() === "centra calgary",
              emailIcon: Boolean(wo.emailSent),
              exteriorDoorsIcon: Boolean(wo.doors),
              flagOrder: Boolean(wo.flagOrder),
              gridIcon: wo.gridsRequired?.toLowerCase() === "yes",
              glassOrderedIcon: showGlassOrderedIcon,
              g52pdIcon: Boolean(wo.f52PD),
              m2000Icon: wo.m2000Icon?.toLowerCase() === "yes",
              miniblindIcon: wo.miniblindIcon?.toLowerCase() === "yes",
              paintIcon: wo.paintIcon?.toLowerCase() === "yes",
              pfgIcon: wo.glassSupplier?.toLowerCase() === "pfg",
              shapesIcon: wo.shapesRequires?.toLowerCase() === "yes",
              smsIcon: Boolean(wo.smsSent),
              starIcon: false,
              vinylDoorIcon: showVinylDoorsIcon,
              warningIcon: Boolean(wo.highRiskflag),
              waterTestingRequired:
                wo.waterTestingRequired?.toLowerCase() === "yes",
            },
            manufacturingFacility: wo.manufacturingFacility,
            glassOrderedDate: wo.cardinalOrderedDate,
            completionDate: wo.completeDate,
            totalGlassQty: wo.totalGlassQty,
            project: wo.project,
            projectManager_display: wo.projectManager_display,
          },
        };

        // Multi-day event workaround
        let existingWOIndex = result.findIndex(
          (x) => x.id === wo.workOrderNumber
        );

        if (existingWOIndex > -1) {
          result[existingWOIndex].end = moment(wo.endDateTime)
            .add(1, "days")
            .format("YYYY-MM-DD");
          //_events[existingWOIndex].end = wo.endDateTime;
        }

        if (existingWOIndex < 0 || allowDuplicates) {
          result.push(_wo);
        }
      });
    }
    return result;
  }, []);

  const buildInstallationEvents = useCallback((workOrders) => {
    let result = [];
    // Date range fix, calendar end date will always be +1 but end date displayed on work order will still be original value
    if (workOrders?.length > 0 && InstallationStates) {
      workOrders.forEach((wo, index) => {
        // Based on the old webcalendar, if wo has wo.scheduledDate, use that if w/o use wo.startScheduleDate
        let startDate = moment(wo.startScheduleDate || wo.start).format(
          "YYYY-MM-DD"
        );

        let endDate = moment(wo.endScheduleDate || wo.end)
          .add(1, "days")
          .format("YYYY-MM-DD");

        // Make sure returned job id is unique from original wo# if
        let id = wo.workOrderNumber;
        if (wo.returnedJob) {
          id = `${wo.workOrderNumber}-returnedjob`;
        }

        //if (wo.workOrderNumber === "A70901BB") {
        //  console.log("wo ", wo)
        //}

        let _wo = {
          id: id,
          actionItemId: wo.actionItemId,
          start: startDate,
          end: endDate,
          lastName: wo.lastName,
          title: wo.workOrderNumber,
          allDay: true,
          state: wo.currentStateName, // for installation, state values are saved so no need to map values to keys
          backgroundColor:
            InstallationStates[
              getKeyFromVal(InstallationStates, wo.currentStateName)
            ]?.color,
          borderColor:
            InstallationStates[
              getKeyFromVal(InstallationStates, wo.currentStateName)
            ]?.color,
          textColor: "#000",
          type: Installation,
          branch: wo.branch,
          dueIn14Days:
            moment(startDate).diff(moment(), "days") < 14 &&
            moment(startDate).diff(moment(), "days") > -1,
          notDueIn14Days: !(
            moment(startDate).diff(moment(), "days") < 14 &&
            moment(startDate).diff(moment(), "days") > -1
          ),
          jobDifficulty: wo.jobDifficulty,
          salesRep: wo.salesRep,
          extendedProps: {
            icons: {},
            index: index,
            jobDifficulty: wo.jobDifficulty,
            installerCount: wo.estInstallerCnt,
            days:
              (new Date(wo.end)?.getTime() - new Date(wo.start)?.getTime()) /
              (24 * 60 * 60 * 1000),
            state: wo.currentStateName,
            city: wo.city,
            windows: wo.totalWindows,
            doors: wo.totalDoors,
            extDoors: wo.totalExtDoors,
            ffiCount: wo.ffiCount,
            ffrCount: wo.ffrCount,
            leadPaint: wo.leadPaint,
            powerDisconnect: wo.powerDisconnect,
            asbestos: wo.totalAsbestos,
            financing: wo.financing,
            financingStartDate: wo.financingStartDate,
            woodDropOff: wo.totalWoodDropOff,
            highRisk: wo.totalHighRisk,
            returnedJob: wo.returnedJob,
            returnTripReason: wo.returnTripReason,
            homeDepotJob: wo.homeDepotJob,
            abatement: wo.abatementRequired,
            isTextSent: wo.isTextSent,
            isEmailSent: wo.isEmailSent,
            isInQueue: wo.isInQueue,
            installWindowLbrMin: wo.installationWindowLBRMIN,
            installPatioDoorLbrMin: wo.installationPatioDoorLBRMin,
            installExtDoorLbrMin: wo.installationDoorLBRMin,
            areAllExteriorDoorsShipped: wo.isAllExteriorDoorShipped,
            areAllPatioDoorsShipped: wo.isAllPatioDoorShipped,
            areAllVinylDoorsShipped: wo.isAllVinylDoorShipped,
            areAllWindowsShipped: wo.isAllWindowsShipped,
          },
        };

        //Multi-day event workaround
        //let existingWOIndex = result.findIndex(
        //  (x) => x.id === wo.workOrderNumber
        //);

        //if (existingWOIndex < 0) {
        result.push(_wo);
        //}
      });
    }
    return result;
  }, []);

  const buildRemeasureEvents = useCallback((workOrders) => {
    let result = [];
    // Date range fix, calendar end date will always be +1 but end date displayed on work order will still be original value
    if (workOrders?.length > 0 && InstallationStates) {
      workOrders.forEach((wo, index) => {
        // Based on the old webcalendar, if wo has wo.scheduledDate, use that if w/o use wo.startScheduleDate
        let startDate = moment(wo.remeasureDate).format("YYYY-MM-DD");

        let endDate = moment(wo.remeasureEndTime)
          .add(1, "days")
          .format("YYYY-MM-DD");

        // Make sure returned job id is unique from original wo# if
        let id = wo.workOrderNumber;
        if (wo.returnedJob) {
          id = `${wo.workOrderNumber}.`;
        }

        let _wo = {
          id: id,
          actionItemId: wo.actionItemId,
          start: startDate,
          end: endDate,
          lastName: wo.lastName,
          title: wo.workOrderNumber,
          allDay: true,
          state: wo.currentStateName, // for installation, state values are saved so no need to map values to keys
          backgroundColor:
            InstallationStates[
              getKeyFromVal(InstallationStates, wo.currentStateName)
            ]?.color,
          borderColor:
            InstallationStates[
              getKeyFromVal(InstallationStates, wo.currentStateName)
            ]?.color,
          textColor: "#000",
          type: Remeasure,
          branch: wo.branch,
          dueIn2Days:
            moment(startDate).diff(moment(), "days") < 2 &&
            moment(startDate).diff(moment(), "days") > -1,
          notDueIn2Days: !(
            moment(startDate).diff(moment(), "days") < 2 &&
            moment(startDate).diff(moment(), "days") > -1
          ),
          salesRep: wo.salesRep,
          extendedProps: {
            icons: {},
            index: index,
            jobDifficulty: wo.jobDifficulty,
            installerCount: wo.estInstallerCnt,
            days:
              (new Date(wo.end)?.getTime() - new Date(wo.start)?.getTime()) /
              (24 * 60 * 60 * 1000),
            state: wo.currentStateName,
            city: wo.city,
            windows: wo.totalWindows,
            doors: wo.totalDoors,
            extDoors: wo.totalExtDoors,
            ffiCount: wo.ffiCount,
            ffrCount: wo.ffrCount,
            leadPaint: wo.leadPaint,
            powerDisconnect: wo.powerDisconnect,
            asbestos: wo.totalAsbestos,
            financing: wo.financing,
            financingStartDate: wo.financingStartDate,
            woodDropOff: wo.totalWoodDropOff,
            highRisk: wo.totalHighRisk,
            returnedJob: wo.returnedJob,
            returnTripReason: wo.returnTripReason,
            homeDepotJob: wo.homeDepotJob,
            abatement: wo.abatementRequired,
            isTextSent: wo.isTextSent,
            isEmailSent: wo.isEmailSent,
            isInQueue: wo.isInQueue,
            installWindowLbrMin: wo.installationWindowLBRMIN,
            installPatioDoorLbrMin: wo.installationPatioDoorLBRMin,
            installExtDoorLbrMin: wo.installationDoorLBRMin,
            areAllExteriorDoorsShipped: wo.isAllExteriorDoorShipped,
            areAllPatioDoorsShipped: wo.isAllPatioDoorShipped,
            areAllVinylDoorsShipped: wo.isAllVinylDoorShipped,
            areAllWindowsShipped: wo.isAllWindowsShipped,
          },
        };

        result.push(_wo);
      });
    }
    return result;
  }, []);

  const buildShippingEvents = useCallback((workOrders) => {
    let result = [];

    if (workOrders?.length > 0 && ProductionStates) {
      workOrders.forEach((wo, index) => {
        if (wo.workOrderNumber === "08A018M") {
          console.log("wo ", wo);
        }

        const showGlassOrderedIcon =
          parseInt(wo.f26CAMin) +
            parseInt(wo.f29CA) +
            parseInt(wo.f29CM) +
            parseInt(wo.f68CA) +
            parseInt(wo.f68SL) +
            parseInt(wo.f68VS) >
          0;
        const showVinylDoorsIcon = parseInt(wo.f61DR) + parseInt(wo.f27DS) > 0;
        let _wo = {
          id: wo.workOrderNumber,
          actionItemId: wo.actionItemId,
          start: wo.startDateTime,
          end: wo.endDateTime,
          title: wo.workOrderNumber,
          allDay: true,
          state: mapProductionStateToKey(wo.currentStateName),
          backgroundColor: (() => {
            let stateKey = mapProductionStateToKey(wo.currentStateName);
            let state = ShippingStates[stateKey];
            let result = state?.color || "#FFF";

            if (
              wo.cardinalOrderedDate?.trim()?.length > 0 &&
              stateKey === "scheduled"
            ) {
              result = state?.secondaryColor || "#FFF";
            }

            if (wo.returnedJob) {
              result = state?.secondaryColor || "#FFF";
            }

            return result;
          })(),
          borderColor:
            ProductionStates[mapProductionStateToKey(wo.currentStateName)]
              ?.color,
          textColor: "#000",
          type: Production,
          branch: wo.branch,
          jobType: isValueValid(wo.jobType, "jobType", Production)
            ? wo.jobType
            : MissingData, // If value is not found in CalendarFilters, replace it with "missingData" to allow filtering
          shippingType: isValueValid(
            wo.shippingType,
            "shippingType",
            Production
          )
            ? wo.shippingType
            : MissingData, // Same as above
          glassSupplier: wo.glassSupplier,
          manufacturingFacility:
            wo.manufacturingFacility === ManufacturingFacilities.calgary
              ? ManufacturingFacilities.calgary
              : ManufacturingFacilities.langley, // Empty defaults to Langley
          engineered: wo.m2000Icon === "1" ? true : false,
          notEngineered: wo.m2000Icon === "0" ? false : true,
          rush: wo.flagOrder,
          notRush: !wo.flagOrder,
          bundle: wo.batchNo,
          lbrMin:
            parseInt(wo.f26CAMin, 10) +
            parseInt(wo.f27DSMin, 10) +
            parseInt(wo.f29CAMin, 10) +
            parseInt(wo.f29CMMin, 10) +
            parseInt(wo.f52PDMin, 10) +
            parseInt(wo.f61DRMin, 10) +
            parseInt(wo.f68SLMin, 10) +
            parseInt(wo.f68VSMin, 10),
          blockNo: wo.blockNo,
          extendedProps: {
            branch: wo.branch,
            doors: wo.doors,
            doubleDoors: wo.doubleDoor,
            index: index,
            windows: wo.windows,
            jobType: wo.jobType,
            f52PD: parseInt(wo.f52PD, 10) || 0,
            f26CA: parseInt(wo.f6CA, 10) || 0,
            f29CA: parseInt(wo.f29CA, 10) || 0,
            f29CM: parseInt(wo.f29CM, 10) || 0,
            f68CA: parseInt(wo.f68CA, 10) || 0,
            f68SL: parseInt(wo.f68SL, 10) || 0,
            f68VS: parseInt(wo.f68VS, 10) || 0,
            f61DR: parseInt(wo.f61DR, 10) || 0,
            f27DS: parseInt(wo.f27DS, 10) || 0,
            f26HY: parseInt(wo.f26HY, 10) || 0,
            icons: {
              capStockIcon: wo.capstockIcon?.toLowerCase() === "yes",
              cardinalIcon: wo.glassSupplier?.toLowerCase() === "cardinal",
              centraIcon:
                wo.glassSupplier?.toLowerCase() === "glassfab" ||
                wo.glassSupplier?.toLowerCase() === "centra calgary",
              emailIcon: Boolean(wo.emailSent),
              exteriorDoorsIcon: Boolean(wo.doors),
              flagOrder: Boolean(wo.flagOrder),
              gridIcon: wo.gridsRequired?.toLowerCase() === "yes",
              glassOrderedIcon: showGlassOrderedIcon,
              g52pdIcon: Boolean(wo.f52PD),
              m2000Icon: wo.m2000Icon === "0" ? false : true,
              miniblindIcon: wo.miniblindIcon?.toLowerCase() === "yes",
              paintIcon: wo.paintIcon?.toLowerCase() === "yes",
              pfgIcon: wo.glassSupplier?.toLowerCase() === "pfg",
              shapesIcon: wo.shapesRequires?.toLowerCase() === "yes",
              smsIcon: Boolean(wo.smsSent),
              starIcon: false,
              vinylDoorIcon: showVinylDoorsIcon,
              warningIcon: Boolean(wo.highRiskflag),
              waterTestingRequired:
                wo.waterTestingRequired?.toLowerCase() === "yes",
              returnedJobIcon: wo.returnedJob,
            },
            manufacturingFacility: wo.manufacturingFacility,
            glassOrderedDate: wo.cardinalOrderedDate,
            completionDate: wo.completeDate,
            totalGlassQty: wo.totalGlassQty,
            siteContact: wo.siteContact,
            phoneNumber: wo.phoneNumber,
            customerName: wo.customerName,
          },
        };

        // Multi-day event workaround
        let existingWOIndex = result.findIndex(
          (x) => x.id === wo.workOrderNumber
        );

        if (wo.workOrderNumber === "08A018M") {
          //console.log("_wo ", _wo)
        }

        if (existingWOIndex > -1) {
          _wo.id = `${_wo.id}_${index}`;
        }

        result.push(_wo);
      });
    }
    return result;
  }, []);

  const buildServiceEvents = useCallback((workOrders) => {
    let result = [];
    if (workOrders?.length > 0 && ServiceStates) {
      workOrders.forEach((wo, index) => {
        let _wo = {
          id: wo.isReturnTrip ? wo.returnTripId : wo.serviceId,
          guidId: wo.id,
          start: convertToLocaleDateTime(wo.scheduleDate),
          end: convertToLocaleDateTime(wo.scheduleEndDate),
          scheduleStartDate: wo.scheduleDate,
          scheduleEndDate: wo.scheduleEndDate,
          title: wo.serviceId,
          allDay: false,
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
          customerName: `${wo.firstName} ${wo.lastName}`,
          manufacturingFacility:
            wo.branch === ManufacturingFacilities.calgary
              ? ManufacturingFacilities.calgary
              : ManufacturingFacilities.langley,
          icons: {
            warningIcon: Boolean(wo.highRisk?.toLowerCase() === "yes"),
          },
          branch: wo.branch,
          sosi: isSoOrSI(wo.typeOfWork),
          summary: wo.summary,
          workOrderNo: wo.originalWorkOrderNo,
          isReturnTrip: wo.isReturnTrip,
          technicians: wo.assignedTechnicians,
          admin: wo.assignedAdmin,
        };

        result.push(_wo);
      });
    }

    return result;
  }, []);

  const isSoOrSI = (serviceType) => {
    let soTypeOfWork = [
      "Supply Only",
      "Supply Only Service",
      "Chargeable Service",
      "Window Testing",
      "Supply Only Goodwill",
    ];

    return _.includes(soTypeOfWork, serviceType) ? "so" : "si";
  };

  const findColorFromLabel = useCallback((stateObject, label) => {
    let result = "#000";

    if (stateObject && label) {
      for (const key in stateObject) {
        if (stateObject[key].label === label) {
          result = stateObject[key].color;
        }
      }
    }

    return result;
  }, []);

  const buildBackorderEvents = useCallback(
    (workOrders) => {
      let result = [];

      if (workOrders?.length > 0) {
        workOrders.forEach((wo, index) => {
          let _wo = {
            id: wo.id,
            actionItemId: wo.actionItemId,
            start: moment(wo.scheduleDate, "MM/DD/YYYY HH:mm:ss").format(
              "YYYY-MM-DDTHH:mm:ss"
            ),
            end: moment(wo.scheduleDate, "MM/DD/YYYY HH:mm:ss").format(
              "YYYY-MM-DDTHH:mm:ss"
            ),
            title: wo.backOrderNumber,
            allDay: true,
            state: wo.status,
            backgroundColor: findColorFromLabel(BackorderRowStates, wo.status),
            borderColor: findColorFromLabel(BackorderRowStates, wo.status),
            textColor: "#000",
            type: Backorder,
            extendedProps: {
              description: wo.description,
              systemValue: wo.systemValue,
              id: wo.id,
            },
          };

          result.push(_wo);
        });
      }

      return result;
    },
    [findColorFromLabel]
  );

  // Build Events
  useEffect(() => {
    if (workOrders?.data && departmentParam) {
      if (workOrders?.config?.url?.toLowerCase().includes(departmentParam)) {
        let events = [];
        let secondaryEvents = [];
        switch (departmentParam) {
          case Production:
            events = buildProductionEvents(workOrders?.data);
            dispatch(updateEvents(events));
            break;
          case Installation:
            events = buildInstallationEvents(workOrders?.data);
            secondaryEvents = buildRemeasureEvents(secondaryWorkOrders?.data);
            dispatch(updateEvents(events));
            dispatch(updatePrimaryEvents(events)); // This will serve as temporary storage when switching between primary and secondary calendar
            dispatch(updateSecondaryEvents(secondaryEvents));
            break;
          case Service:
            events = buildServiceEvents(workOrders?.data);
            dispatch(updateEvents(events));
            break;
          case Shipping:
            events = buildShippingEvents(workOrders?.data);
            secondaryEvents = buildBackorderEvents(secondaryWorkOrders?.data);
            dispatch(updateEvents(events));
            dispatch(updatePrimaryEvents(events)); // This will serve as temporary storage when switching between primary and secondary calendar
            dispatch(updateSecondaryEvents(secondaryEvents));
            break;
          default:
            // Clear workorders
            dispatch(clearEvents());
            break;
        }
      } else {
        dispatch(clearEvents());
      }
    }
  }, [
    dispatch,
    workOrders,
    departmentParam,
    buildProductionEvents,
    buildInstallationEvents,
    secondaryWorkOrders,
    buildRemeasureEvents,
    buildShippingEvents,
    buildServiceEvents,
    buildBackorderEvents,
  ]);

  const getFilteredOutValues = (filterObject) => {
    let result = [];
    let flattenedFilters = [];

    if (filterObject) {
      filterObject.forEach((f) => {
        // Flatten
        let _f = JSON.parse(JSON.stringify(f));
        _f.fields.forEach((ff) => {
          ff.groupKey = f.key;
        });
        flattenedFilters.push(..._f.fields);
      });
      result = flattenedFilters.filter((f) => f.value === false);
    }

    return result;
  };

  useEffect(() => {
    let result = [];
    let filteredOutValues = [];

    if (events?.length > 0 && filters) {
      filteredOutValues = getFilteredOutValues(filters);

      if (filteredOutValues?.length > 0) {
        events.forEach((e) => {
          let hidden = false;

          filteredOutValues.forEach((h) => {
            if (h.eventValue !== "boolean") {
              // Event value is text
              if (
                h.key?.toLowerCase() === e[h.groupKey]?.toLowerCase() ||
                h.label?.toLowerCase() === e[h.groupKey]?.toLowerCase()
              ) {
                hidden = true;
              }
            } else {
              // If event property is a boolean value (e.g. Rush and Engineered)
              if (!h.value && e[h.key]) {
                hidden = true;
              }
            }
          });

          if (!hidden) {
            if (appliedFilteredWorkOrders?.length > 0) {
              let found = appliedFilteredWorkOrders.find(
                (x) => x.workOrderNumber === e.title
              );
              if (found) {
                result.push(e);
              }
            } else {
              result.push(e);
            }
          }
        });
      } else {
        result = [...events];
      }
    }

    setFilteredEvents(result);
    dispatch(updateFilteredEvents(result));
  }, [dispatch, events, filters, appliedFilteredWorkOrders, setFilteredEvents]);

  // Update filters based on ManufacturingFacility
  useEffect(() => {
    if (department) {
      if (department.key === Production || department.key === Service) {
        if (branch && filters) {
          const manufacturingFacilityIndex = filters.findIndex(
            (x) => x.key === ManufacturingFacility
          );
          const langleyIndex = 0;
          const calgaryIndex = 1;

          let _filters = JSON.parse(JSON.stringify(filters));

          switch (branch) {
            case ManufacturingFacilities.langley:
              _filters[manufacturingFacilityIndex].fields[
                langleyIndex
              ].value = true;
              _filters[manufacturingFacilityIndex].fields[
                calgaryIndex
              ].value = false;
              break;
            case ManufacturingFacilities.calgary:
              _filters[manufacturingFacilityIndex].fields[
                langleyIndex
              ].value = false;
              _filters[manufacturingFacilityIndex].fields[
                calgaryIndex
              ].value = true;
              break;
            default:
              _filters[manufacturingFacilityIndex].fields[
                langleyIndex
              ].value = true;
              _filters[manufacturingFacilityIndex].fields[
                calgaryIndex
              ].value = true;
              break;
          }

          if (JSON.stringify(filters) !== JSON.stringify(_filters)) {
            // For Branch Selection to update first before the events
            if (showMessage) {
              setTimeout(() => {
                dispatch(updateFilters(_filters));
                dispatch(updateShowMessage({ value: false }));
              }, 1000);
            } else {
              dispatch(updateFilters(_filters));
            }
          }
        }
      }
    }
  }, [dispatch, department, branch, filters, showMessage]);

  // -------- Summary Data --------
  useEffect(() => {
    if (
      (workOrders?.data || secondaryWorkOrders?.data) &&
      (page === Pages.day || page === Pages.week)
    ) {
      const isRemeasureSubDepartment = subDepartment?.key === Remeasure;

      const getDateFilter = (x, date) => {
        const formattedDate = YMDDateFormat(date);
        if (isRemeasureSubDepartment)
          return YMDDateFormat(x["remeasureDate"]) === formattedDate;
        else if (department.key === Installation) {
          const installDates = x["installationDates"];
          return (
            installDates &&
            !x["returnedJob"] &&
            installDates.some(
              (installDate) =>
                YMDDateFormat(installDate.start) === formattedDate
            )
          );
        } else return YMDDateFormat(x["startDateTime"]) === formattedDate;
      };

      const _data =
        subDepartment?.key === Remeasure
          ? secondaryWorkOrders?.data
          : workOrders?.data;
      const dayWorkOrders = _data?.filter((x) => getDateFilter(x, date));

      if (dayWorkOrders) {
        const _filteredDayWorkOrders = dayWorkOrders.filter((dwo) =>
          filteredEvents?.some((fe) => fe.title === dwo.workOrderNumber)
        );

        setDaySummaryWorkOrders([..._filteredDayWorkOrders]);

        // Week Summary Data
        const weekSelectionWorkOrders = [];
        const _filteredWeekWorkOrders = [];
        const _startDate = moment(date).startOf("week");

        for (let i = 0; i < 7; i++) {
          const currentDate = moment(_startDate).add(i, "days");

          const weekWorkOrders = _data?.filter((x) =>
            getDateFilter(x, currentDate)
          );

          weekSelectionWorkOrders.push(...weekWorkOrders);

          const _filteredDayWorkOrders = weekWorkOrders.filter((dwo) =>
            filteredEvents?.some((fe) => fe.title === dwo.workOrderNumber)
          );

          _filteredWeekWorkOrders.push({
            date: currentDate,
            workOrders: [..._filteredDayWorkOrders],
          });
        }

        setWeekSummaryWorkOrders(_filteredWeekWorkOrders);
        dispatch(updateDayWorkOrders([...dayWorkOrders]));
        dispatch(updateFilteredDayWorkOrders(_filteredDayWorkOrders));
        dispatch(updateWeekWorkOrders(weekSelectionWorkOrders));
      }
    }
  }, [
    dispatch,
    workOrders,
    secondaryWorkOrders,
    date,
    filteredEvents,
    setDaySummaryWorkOrders,
    setWeekSummaryWorkOrders,
    page,
    department,
    subDepartment,
  ]);

  useEffect(() => {
    let result = {
      windows: 0,
      vinylDoors: 0,
      patioDoors: 0,
      exteriorDoors: 0,
    };

    if (daySummaryWorkOrders) {
      let _daySummaryData = generateDaySummaryData(daySummaryWorkOrders);

      if (_daySummaryData) {
        result = {
          windows: _daySummaryData.windows,
          vinylDoors: _daySummaryData.vinylDoors,
          patioDoors: _daySummaryData.f52PD,
          exteriorDoors: _daySummaryData.exteriorDoors,
        };
      }
    }

    setDayTotals(result);
  }, [daySummaryWorkOrders, setDayTotals]);

  const getFilteredEvents = useCallback(() => {
    return filteredEvents;
  }, [filteredEvents]);

  const getDayTotals = useCallback(() => {
    return dayTotals;
  }, [dayTotals]);

  const updateDayTotals = useCallback((data) => {
    if (data) {
      setDayTotals(data);
    }
  }, []);

  const getWeekTotals = useCallback(() => {
    return weekTotals;
  }, [weekTotals]);

  const updateWeekTotals = useCallback((data) => {
    if (data) {
      setWeekTotals(data);
    }
  }, []);

  const getDaySummaryWorkOrders = useCallback(() => {
    return daySummaryWorkOrders;
  }, [daySummaryWorkOrders]);

  const getWeekSummaryWorkOrders = useCallback(() => {
    return weekSummaryWorkOrders;
  }, [weekSummaryWorkOrders]);

  useEffect(() => {
    if (department?.key === Installation) {
      if (subDepartment?.key === Installation) {
        dispatch(updateEvents([...primaryEvents]));
      } else if (subDepartment?.key === Remeasure) {
        dispatch(updateEvents([...secondaryEvents]));
      }
    }
    if (department?.key === Shipping) {
      if (subDepartment?.key === Shipping) {
        dispatch(updateEvents([...primaryEvents]));
      } else if (subDepartment?.key === Backorder) {
        dispatch(updateEvents([...secondaryEvents]));
      }
    }
  }, [dispatch, department, subDepartment, primaryEvents, secondaryEvents]);

  return {
    getFilteredEvents,
    getDayTotals,
    updateDayTotals,
    getWeekTotals,
    updateWeekTotals,
    getDaySummaryWorkOrders,
    getWeekSummaryWorkOrders,
    buildProductionEvents,
    buildInstallationEvents,
    buildServiceEvents,
    buildShippingEvents,
  };
};

export default useCalendarEvents;
