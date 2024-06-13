import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import {
  Service,
  ServiceStates,
  ProductionStates,
  Production,
  Installation,
  Remeasure
} from "app/utils/constants";

import { mapServiceEventStateToKey } from "app/utils/utils";

import moment from "moment";

// -- Production API
import {
  updateState,
  updateEventDates as updateProductionEventDates,
} from "app/api/productionApis";

// -- Service API
import {
  updateServiceWorkOrderState,
  updateServiceWorkOrderSchedule,
} from "app/api/serviceApis";

// -- Installation API
import {
  updateInstallationInstallData,
  updateEventDates as updateInstallationEventDates,
} from "app/api/installationApis";

import {
  updateSelectedEvent,
  updateMarkedWorkOrderId,
  updateWorkOrderData,
  updateResult,
} from "app/redux/calendar";

const useCalendarActions = ({
  workOrders,
  secondaryWorkOrders,
  setShowChangeStatusConfirmation,
  cookies,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [changeEvent, setChangeEvent] = useState(null);

  const { department, subDepartment, workOrderData } = useSelector(
    (state) => state.calendar
  );

  const handleRescheduleOk = useCallback(() => {
    if (changeEvent && workOrderData) {
      let startTime = "00:00:00";
      let endTime = "00:00:00";

      let eventDates = [];

      let startDate = {
        recordId: workOrderData.actionItemId,
        startDate: changeEvent.event.startStr,
        startTime: startTime,
        endTime: endTime,
      };

      eventDates.push(startDate);

      // Multi-day event, subtract 1 day from endStr
      let _endStr = moment(changeEvent.event.endStr)
        ?.subtract(1, "days")
        .format("YYYY-MM-DD");

      if (
        changeEvent.event.endStr &&
        changeEvent.event
          .startStr /* && _endStr !== changeEvent.event.startStr */
      ) {
        let endDate = {
          recordId: workOrderData.actionItemId,
          startDate: moment(changeEvent.event.endStr)
            .subtract(1, "day")
            .format("YYYY-MM-DD"), // Resize
          startTime: startTime,
          endTime: endTime,
        };

        if (changeEvent.title === "Reschedule") {
          endDate.startDate = moment(changeEvent.event.endStr); // If reschedule menu
        }

        eventDates.push(endDate);
      }

      if (department?.key === Production) {
        updateProductionEventDates(eventDates); // Production
      } else if (department?.key === Installation) {
        updateInstallationEventDates(eventDates); // Installation
      }
    }
  }, [changeEvent, workOrderData, department]);

  const handleRescheduleOkWithParams = useCallback(
    (e, woData) => {
      let startTime = "00:00:00";
      let endTime = "00:00:00";

      let eventDates = [];

      let startDate = {
        recordId: woData.actionItemId,
        startDate: e.event.startStr,
        startTime: startTime,
        endTime: endTime,
      };

      eventDates.push(startDate);

      // Multi-day event, subtract 1 day from endStr
      let _endStr = moment(e.event.endStr)
        ?.subtract(1, "days")
        .format("YYYY-MM-DD");

      if (
        e.event.endStr &&
        e.event.startStr /* && _endStr !== changeEvent.event.startStr */
      ) {
        let endDate = {
          recordId: woData.actionItemId,
          startDate: moment(e.event.endStr)
            .subtract(1, "day")
            .format("YYYY-MM-DD"), // Resize
          startTime: startTime,
          endTime: endTime,
        };

        if (e.title === "Reschedule") {
          endDate.startDate = moment(e.event.endStr); // If reschedule menu
        }

        eventDates.push(endDate);
      }

      updateProductionEventDates(eventDates, department);
    },
    [department]
  );

  const handleRescheduleInstallationOk = useCallback(() => {
    if (changeEvent && workOrderData) {
      let startDate = moment(changeEvent.event.startStr)
        ?.subtract(1, "days")
        .format("MM/DD/YYYY HH:mm:ss");

      // Apparently when rescheduling/drag and drop 2 days must be removed from end date to properly match fullcalendar rendering
      // TODO: When there's more time, might be a good idea to investigate why
      let endDate = moment(changeEvent.event.endStr)
        ?.subtract(2, "days")
        .format("MM/DD/YYYY HH:mm:ss");

      let changeData = {
        actionItemId: workOrderData.actionItemId,
        isAllDayChecked: true,
        scheduledStartDate: new Date(startDate).toISOString(),
        scheduledEndDate: new Date(endDate).toISOString(),
      };

      if (changeData?.actionItemId) {
        updateInstallationInstallData(changeData);
      }
    }
  }, [changeEvent, workOrderData]);

  const handleRescheduleInstallationOkWithParams = useCallback((e, woData) => {
    if (e && woData) {
      let startDate = moment(e.event.startStr)
        ?.subtract(1, "days")
        .format("MM/DD/YYYY HH:mm:ss");

      // Apparently when rescheduling/drag and drop 2 days must be removed from end date to properly match fullcalendar rendering
      // TODO: When there's more time, might be a good idea to investigate why
      let endDate = moment(e.event.endStr)
        ?.subtract(2, "days")
        .format("MM/DD/YYYY HH:mm:ss");

      let changeData = {
        actionItemId: woData.actionItemId,
        isAllDayChecked: true,
        scheduledStartDate: new Date(startDate).toISOString(),
        scheduledEndDate: new Date(endDate).toISOString(),
      };

      if (changeData?.actionItemId) {
        updateInstallationInstallData(changeData);
      }
    }
  }, []);

  const handleGenericRescheduleOkWithParams = useCallback(
    async (e, woData) => {
      if (e && woData && department) {
        let rescheduleRequest = {
          moduleName: department.key,
          id: woData.guidId,
          startDate: moment(e.event.startStr).toISOString(),
          endDate: moment(e.event.endStr).toISOString(),
        };

        await updateServiceWorkOrderSchedule(rescheduleRequest);
      }
    },
    [department]
  );

  const clickEvent = useCallback(
    (e) => {
      if (e && dispatch && router) {        
        let _workOrderNumber = e?.event?._def?.title;

        dispatch(updateSelectedEvent(e?.event?._def));
        dispatch(updateMarkedWorkOrderId(null));

        let _workorders = Array.isArray(workOrders?.data) ? [...workOrders.data] : [];        

        if (subDepartment?.key === Remeasure) { // TODO: All secondary workorders should be added here
          _workorders = Array.isArray(secondaryWorkOrders?.data) ? [...secondaryWorkOrders.data] : [];
        }

        let _workOrderData = _workorders?.find(
          (x) =>
            x.workOrderNumber === _workOrderNumber ||
            x.workOrderNo === _workOrderNumber ||
            x.serviceId === Number(_workOrderNumber)
        );

        if (_workOrderData) {
          dispatch(updateWorkOrderData(_workOrderData));
        } // Else just set the workorder number from backorder event

        if (updateResult) {
          dispatch(updateResult(null));
        }

        if (department?.key !== subDepartment?.key) {
          router.push(
            `?page=workorder&work-order-number=${_workOrderNumber}&department=${department.key}&subdepartment=${subDepartment.key}`,
            undefined,
            { shallow: true }
          );
        } else {
          router.push(
            `?page=workorder&work-order-number=${_workOrderNumber}&department=${department.key}`,
            undefined,
            { shallow: true }
          );
        }
      }
    },
    [dispatch, router, department, subDepartment, workOrders]
  );

  const dropEvent = useCallback(
    (e) => {
      let _workOrderData = {};

      switch (department.key) {
        case Service:
          _workOrderData = workOrders?.data.find(
            (x) => x.serviceId === Number(e.event.id)
          );
          break;
        default:
          _workOrderData = workOrders?.data.find(
            (x) => x.workOrderNumber === e.event.id
          );
          break;
      }

      dispatch(updateWorkOrderData(_workOrderData));
      setChangeEvent(e);

      // Bypass reschedule confirmation
      if (cookies?.options?.hideDragAndDrop) {
        if (department?.key === Production) {
          handleRescheduleOkWithParams(e, _workOrderData);
        } else if (department?.key === Installation) {
          handleRescheduleInstallationOkWithParams(e, _workOrderData);
        } else if (department?.key === Service) {
          handleGenericRescheduleOkWithParams(e, _workOrderData);
        }
      }
    },
    [
      workOrders,
      dispatch,
      department,
      setChangeEvent,
      handleRescheduleOkWithParams,
      handleRescheduleInstallationOkWithParams,
      handleGenericRescheduleOkWithParams,
      cookies,
    ]
  );

  const handleGenericRescheduleOk = useCallback(async () => {
    if (changeEvent && department) {
      let rescheduleRequest = {
        moduleName: department.key,
        id: workOrderData
          ? workOrderData.id
          : changeEvent.event._def.extendedProps.guidId,
        startDate: moment(changeEvent.event.startStr).toISOString(),
        endDate: moment(changeEvent.event.endStr).toISOString(),
      };

      await updateServiceWorkOrderSchedule(rescheduleRequest);
    }
  }, [changeEvent, workOrderData, department]);

  const handleMoveCancel = useCallback(() => {
    if (changeEvent) {
      if (changeEvent.revert) {
        changeEvent.revert();
      }
    }
  }, [changeEvent]);

  const handleChangeStatusCancel = useCallback(() => {
    setShowChangeStatusConfirmation(false);
  }, [setShowChangeStatusConfirmation]);

  const handleStateChangeOk = useCallback(() => {
    if (
      changeEvent &&
      workOrderData.actionItemId &&
      ProductionStates[changeEvent?.newState]?.transitionKey
    ) {
      let data = {
        ffModuleName: "PlantProduction",
        transitionCode: ProductionStates[changeEvent?.newState]?.transitionKey,
        recordID: workOrderData.actionItemId,
        workOrderNumber: workOrderData.workOrderNumber,
        actionItemId: workOrderData.actionItemId,
        manufacturingFacility: workOrderData.manufacturingFacility,
      };
      updateState(data);
      setShowChangeStatusConfirmation(false);
    }
  }, [changeEvent, workOrderData, setShowChangeStatusConfirmation]);

  const installationStateChangeOk = useCallback(() => {}, []);

  const handleServiceStateChangeOk = useCallback(() => {
    if (changeEvent && workOrderData) {
      updateServiceWorkOrderState(
        ServiceStates[mapServiceEventStateToKey(changeEvent?.newState)]?.label,
        Number(workOrderData.serviceId)
      );
    }
  }, [changeEvent, workOrderData]);

  const getChangeEvent = useCallback(() => {
    return changeEvent;
  }, [changeEvent]);

  const updateChangeEvent = useCallback((data) => {
    setChangeEvent(data);
  }, []);

  return {
    dropEvent,
    handleMoveCancel,
    clickEvent,
    handleRescheduleOk,
    handleStateChangeOk,
    handleChangeStatusCancel,
    handleGenericRescheduleOk,
    handleServiceStateChangeOk,
    handleRescheduleInstallationOk,
    getChangeEvent,
    updateChangeEvent,
  };
};

export default useCalendarActions;
