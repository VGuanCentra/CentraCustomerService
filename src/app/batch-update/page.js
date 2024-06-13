"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "react-query";

import useCalendarEvents from "app/hooks/useCalendarEvents";

import {
  Production,
  CalendarTypes,
  ProductionStates,
  ManufacturingFacilities,
  MenuActions,
} from "app/utils/constants";

import { YMDDateFormat } from "app/utils/utils";

import BatchUpdateHeader from "../batch-update/subComponents/batchUpdateHeader";
import LockButton from "app/components/atoms/lockButton/lockButton";
import Tooltip from "app/components/atoms/tooltip/tooltip";
import AntDatePicker from "app/components/atoms/datePicker/datePicker";
import TransferList from "app/components/organisms/transferList/transferList";
import ConfirmationModal from "app/components/atoms/confirmationModal/confirmationModal";

import { Button, Badge, Select, Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
const { Text } = Typography;

import styled from "styled-components";

import moment from "moment";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { clearEvents, updateDepartment, updateEvents } from "../redux/calendar";

import { menuSlice } from "../redux/calendarAux";

import usePermissions from "app/hooks/usePermissions";

import {
  updateBatchState,
  updateBatchEventDates,
  fetchProductionWorkOrders,
} from "../api/productionApis";

export default function BatchUpdate(props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const departmentParam = searchParams.get("department");

  const All = "all";

  const [fromDate, setFromDate] = useState(moment());
  const [toStartDate, setToStartDate] = useState(moment());
  const [toEndDate, setToEndDate] = useState(moment());
  const [sourceListEvents, setSourceListEvents] = useState([]);
  const [filteredSourceListEvents, setFilteredSourceListEvents] =
    useState(null);
  const [targetListEvents, setTargetListEvents] = useState([]);
  const [filterSourceListBy, setFilterSourceListBy] = useState(All);
  const [transitionTargetTo, setTransitionTargetTo] = useState(null);
  const [targetStatusOptions, setTargetStatusOptions] = useState([]);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { getUserHasFeatureEditByName } = usePermissions();

  const {
    date,
    events,
    filters,
    stateChangeResult,
    result,
    branch,
    department,
  } = useSelector((state) => state.calendar);

  const { isReadOnly } = useSelector((state) => state.app);

  const HEADER_HEIGHT_OFFSET = 140;

  const { action } = useSelector((state) => state.menu);

  const {
    isFetching,
    data: workOrders,
    refetch,
  } = useQuery(
    "workorders",
    () => {
      const year = moment(fromDate).format("YYYY");
      const month = moment(fromDate).format("M");
      const day = moment(fromDate).format("DD");

      if (day && month && year) {
        if (departmentParam === Production) {
          return fetchProductionWorkOrders(
            `${year}-${month}-${day}T00:00:00`,
            `${year}-${month}-${day}T23:59:59`
          );
        } else if (departmentParam === Service) {
          return fetchServiceWorkOrders(
            `${year}-${month}-${day}T00:00:00`,
            `${year}-${month}-${day}T23:59:59`
          );
        }
      }
    },
    { enabled: false }
  );

  const { buildProductionEvents, buildServiceEvents } = useCalendarEvents({
    ...{
      date,
      workOrders,
      departmentParam: department?.key,
    },
  });

  const disableDates = (current) => {
    return current.year() < 2016 || current.year() > moment().year() + 2; // Only enable dates wherein records exist and 2 years in the future
  };

  useEffect(() => {
    let _listEvents = [];
    events.forEach((e) => {
      let _e = JSON.parse(JSON.stringify(e));
      if (
        moment(_e.start).format("MM-DD-YYYY") ===
        moment(fromDate).format("MM-DD-YYYY")
      ) {
        _e.checked = false;
        _listEvents.push(_e);
      }
    });
    setSourceListEvents(_listEvents);
  }, [fromDate, events]);

  useEffect(() => {
    if (workOrders?.data && filters && departmentParam) {
      if (workOrders?.config?.url?.toLowerCase().includes(departmentParam)) {
        switch (departmentParam) {
          case Production:
            let events = buildProductionEvents(workOrders.data);
            dispatch(updateEvents(events));
            break;
          case Service:
            let serviceEvents = buildServiceEvents(workOrders.data);
            dispatch(updateEvents(serviceEvents));
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
    filters,
    departmentParam,
    buildProductionEvents,
    buildServiceEvents,
  ]);

  useEffect(() => {
    refetch();
    setTargetListEvents([]);
  }, [fromDate, refetch]);

  useEffect(() => {
    if (departmentParam) {
      let department = CalendarTypes.find((x) => x.key === departmentParam);
      dispatch(updateDepartment(department));
    }
  }, [dispatch, departmentParam]);

  useEffect(() => {
    if (targetListEvents?.length > 0) {
      let _status = [];
      let options = [];

      targetListEvents.forEach((t) => {
        if (!_status.find((s) => s === t.state)) {
          _status.push(t.state);
        }
      });

      let isStatusMixed = _status?.length > 1;

      if (isStatusMixed) {
        //options = [{ value: "onHold", label: "On Hold" }];
        options = [];
      } else {
        let transitionList = ProductionStates[_status[0]]?.transitionTo;

        if (transitionList) {
          transitionList.map((t) => {
            options.push({ value: t, label: ProductionStates[t].label });
          });
        }
      }

      setTargetStatusOptions(options);

      if (options?.length > 0) {
        setTransitionTargetTo(options[0].value);
      }
    }
  }, [targetListEvents]);

  useEffect(() => {
    if (filterSourceListBy && branch && sourceListEvents) {
      let filteredEvents = [...sourceListEvents];
      const calgaryEvents = sourceListEvents.filter(
        (x) =>
          x.extendedProps.manufacturingFacility ===
          ManufacturingFacilities.calgary
      );
      const langleyEvents = sourceListEvents.filter(
        (x) =>
          x.extendedProps.manufacturingFacility ===
          ManufacturingFacilities.langley ||
          x.extendedProps.manufacturingFacility === ""
      );

      // Filter by branch
      if (branch === ManufacturingFacilities.calgary) {
        filteredEvents = [...calgaryEvents];
      } else if (branch === ManufacturingFacilities.langley) {
        filteredEvents = [...langleyEvents];
      }

      // Filter by Status
      if (filterSourceListBy !== All) {
        filteredEvents = filteredEvents.filter(
          (x) => x.state === filterSourceListBy
        );
      }

      // Bug fix for source list re-populating entire list even after items are moved to target list
      if (targetListEvents?.length > 0) {
        let _filteredEvents = [];
        filteredEvents.forEach((fe) => {
          let found = targetListEvents.find((x) => x.title === fe.title);
          if (!found) {
            _filteredEvents.push(fe);
          }
          filteredEvents = [..._filteredEvents];
        });
      }

      setFilteredSourceListEvents(filteredEvents);
    }
  }, [sourceListEvents, filterSourceListBy, branch, targetListEvents]);

  const CustomSelect = styled(Select)`
    .ant-select-selector {
      height: 37px !important;
      padding: 3px 11px !important;
    }
  `;

  const handleMoveToRight = useCallback(() => {
    let _sourceList = []; // Needed by setTargetListEvents to prevent endless re-render

    setFilteredSourceListEvents((s) => {
      let _s = [...s];
      _sourceList = [...s];
      let unCheckedItems = _s.filter((x) => !x.checked);
      return unCheckedItems;
    });

    setTargetListEvents((t) => {
      let _t = [...t];
      let checkedItems = _sourceList.filter((x) => x.checked);
      _t = [..._t, ...checkedItems];
      let _tUnchecked = _t.map((x) => {
        x.checked = false;
        return { ...x };
      });
      return _tUnchecked;
    });
  }, []);

  const handleMoveToLeft = useCallback(() => {
    let _targetList = [];

    setTargetListEvents((t) => {
      let _t = [...t];
      _targetList = [...t];
      let unCheckedItems = _t.filter((x) => !x.checked);
      return unCheckedItems;
    });

    setFilteredSourceListEvents((s) => {
      let _s = [...s];
      let checkedItems = _targetList.filter((x) => x.checked);
      _s = [..._s, ...checkedItems];
      return _s;
    });
  }, []);

  const handleReset = useCallback(() => {
    setFromDate(moment());
    setToStartDate(moment());
    setToEndDate(moment());
    setTargetListEvents([]);
    setFilterSourceListBy("all");
  }, [setTargetListEvents]);

  const refresh = useCallback(() => {
    setTargetListEvents([]);
    setFilterSourceListBy("all");
    refetch();
  }, [setTargetListEvents, refetch]);

  const handleFromDateChange = (date) => {
    if (date) {
      setFromDate(date);
    }
  };

  const handleToStartDateChange = (date) => {
    if (date) {
      setToStartDate(date);
      setToEndDate(date);
    }
  };

  const handleToEndDateChange = (date) => {
    if (date) {
      setToEndDate(date);
    }
  };

  const getSourceStatusOptions = () => {
    let result = [];
    result = Object.entries(ProductionStates).map((p) => {
      return { value: p[0], label: p[1].label };
    });
    result.unshift({ value: "all", label: "All" });
    return result;
  };

  const handleSourceStatusChange = (val) => {
    setFilterSourceListBy(val);
  };

  const handleTargetStatusChange = (val) => {
    setTransitionTargetTo(val);
  };

  const handleSaveClick = useCallback(() => {
    setShowSaveConfirmation(true);
  }, []);

  const handleSaveYes = useCallback(() => {
    if (targetListEvents?.length > 0 && action) {
      let changeItems = [];
      if (action === MenuActions.batchReschedule) {
        const startDate = YMDDateFormat(toStartDate);
        const endDate = YMDDateFormat(toEndDate);
        const startTime = "00:00:00";
        const endTime = "00:00:00";
        const multiDay = startDate !== endDate;

        targetListEvents.forEach((t) => {
          changeItems.push({
            moduleName: "PlantProduction",
            recordId: t.actionItemId,
            startDate: startDate,
            startTime: startTime,
            endTime: endTime,
          });
        });

        if (multiDay) {
          targetListEvents.forEach((t) => {
            changeItems.push({
              moduleName: "PlantProduction",
              recordId: t.actionItemId,
              startDate: endDate,
              startTime: startTime,
              endTime: endTime,
            });
          });
        }

        if (changeItems?.length > 0) {
          updateBatchEventDates(changeItems);
        }
      } else if (action === MenuActions.batchStatusUpdate) {
        changeItems = targetListEvents.map((t) => {
          return {
            moduleName: "PlantProduction",
            recordId: t.actionItemId,
            transitId: ProductionStates[transitionTargetTo]?.transitionKey,
            workOrderNumber: t.title,
            manufacturingFacility:
              t.extendedProps?.manufacturingFacility ===
                ManufacturingFacilities.calgary
                ? ManufacturingFacilities.calgary
                : ManufacturingFacilities.langley,
            actionItemId: t.actionItemId,
          };
        });
        if (changeItems?.length > 0) {
          updateBatchState(changeItems);
        }
      }
    }
    setShowSaveConfirmation(false);
    setIsLoading(true);
  }, [action, targetListEvents, transitionTargetTo, toStartDate, toEndDate]);

  useEffect(() => {
    if (stateChangeResult || result) {
      refresh();
      setIsLoading(false);
    }
  }, [stateChangeResult, refresh, result]);

  useEffect(() => {
    if (filteredSourceListEvents) {
      //dispatch(updateIsLoading(false));
      dispatch(menuSlice.actions.updateIsLoading(false));
    }
  }, [dispatch, filteredSourceListEvents, action]);

  useEffect(() => {
    if (targetStatusOptions?.length === 0) {
      setTransitionTargetTo(null);
    }
  }, [targetStatusOptions]);

  useEffect(() => {
    if (targetListEvents?.length === 0) {
      setTargetStatusOptions([]);
    }
  }, [targetListEvents]);

  const isActionReschedule = (action === MenuActions.batchReschedule || (window.location.href.includes("batch-reschedule")));
  const isActionStatusUpdate = (action === MenuActions.batchStatusUpdate || (window.location.href.includes("batch-status-update")));

  return (
    <div className={`pl-4 pr-4 w-100 pt-3`}>
      <BatchUpdateHeader targetListEvents={targetListEvents} />
      <div className={`bg-white rounded`}>
        {filteredSourceListEvents?.length < 1 && false && (
          <div className="flex items-center justify-center w-100 h-100">
            <div className="flex flex-row text-gray-400">
              <div style={{ marginTop: "-3px" }}>
                <LoadingOutlined spin className="mr-2" />
              </div>
              <div className="text-sm">
                <Text type="secondary">Loading...</Text>
              </div>
            </div>
          </div>
        )}
        <Backdrop
          open={isLoading}
          style={{ zIndex: "2", position: "absolute", color: "#FFF" }}
        >
          <div>
            <div style={{ textAlign: "center" }}>
              <CircularProgress color="inherit" />
            </div>
          </div>
        </Backdrop>
        <div
          className={`border w-full p-2 rounded`}
          style={{ height: `${window.innerHeight - HEADER_HEIGHT_OFFSET}px` }}
        >
          <div
            className="flex flex-row justify-between pb-3 pt-1"
            style={{ borderBottom: "1px dotted lightgrey" }}
          >
            <div className="pl-2">
              <Tooltip title="Remove current modifications and start over.">
                <Button onClick={handleReset}>Reset</Button>
              </Tooltip>
            </div>
            <div className="pr-2">
              <div>
                {((targetListEvents?.length > 0 && targetStatusOptions?.length === 0) && isActionStatusUpdate) &&
                  <span className="text-sm pl-1 pr-2 m-auto text-red-500">
                    <i class="fa-solid fa-circle-exclamation"></i> Source work orders should all have the same status
                  </span>
                }
                <Badge count={targetListEvents?.length} color={"orange"}>
                  <LockButton
                    tooltip={"Save Updates"}
                    onClick={handleSaveClick}
                    disabled={(targetStatusOptions?.length === 0 && isActionStatusUpdate) ||
                      (targetListEvents?.length === 0 && isActionReschedule) ||
                      (isActionReschedule && !getUserHasFeatureEditByName("Bulk Reschedule")) ||
                      (isActionStatusUpdate && !getUserHasFeatureEditByName("Bulk Status Update"))
                      }
                    showLockIcon={
                      (isActionReschedule && !getUserHasFeatureEditByName("Bulk Reschedule")) ||
                      (isActionStatusUpdate && !getUserHasFeatureEditByName("Bulk Status Update"))
                    }
                    label={"Save"}
                  />
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-around pt-3">
            <div>
              <div className="flex flex-row justify-between">
                <AntDatePicker
                  disabledDate={disableDates}
                  value={fromDate}
                  picker={"day"}
                  onChange={handleFromDateChange}
                  format={"MMMM DD, YYYY"}
                  style={{
                    height: "2.4rem",
                    width: "12rem",
                  }}
                />
                <div>
                  <span className="text-sm pr-2">Status</span>
                  <CustomSelect
                    defaultValue="All Status"
                    style={{ width: 150 }}
                    onChange={handleSourceStatusChange}
                    size={"middle"}
                    options={getSourceStatusOptions()}
                    value={filterSourceListBy}
                  />
                </div>
              </div>
              <TransferList
                date={fromDate}
                disableDates={disableDates}
                listItems={filteredSourceListEvents || []}
                setDate={setFromDate}
                setListItems={setSourceListEvents}
              />
            </div>
            <div className="flex items-center pl-4 pr-4">
              <div
                className="flex flex-col justify-between"
                style={{ height: "7rem" }}
              >
                <Button
                  disabled={!sourceListEvents.some((x) => x.checked)}
                  onClick={handleMoveToRight}
                  size={"large"}
                >
                  <i className="fa-solid fa-arrow-right"></i>
                </Button>
                <Button
                  disabled={!targetListEvents.some((x) => x.checked)}
                  onClick={handleMoveToLeft}
                  size={"large"}
                >
                  <i className="fa-solid fa-arrow-left"></i>
                </Button>
              </div>
            </div>
            <div>
              <div className="flex flex-row justify-between">
                {isActionReschedule && (
                  <div className="flex flex-row justify-between w-100">
                    <div className="flex flex-row justify-between">
                      <span
                        className="text-sm pl-1 pr-2 m-auto text-blue-500"
                        style={{ paddingTop: "2px" }}
                      >
                        Start
                      </span>
                      <AntDatePicker
                        disabledDate={disableDates}
                        value={toStartDate}
                        picker={"day"}
                        onChange={handleToStartDateChange}
                        format={"MMMM DD, YYYY"}
                        style={{
                          height: "2.4rem",
                          width: "11rem",
                        }}
                      />
                    </div>
                    <div className="flex flex-row justify-between">
                      <span className="text-sm pl-3 pr-2 m-auto text-blue-500">
                        End
                      </span>
                      <AntDatePicker
                        disabledDate={disableDates}
                        value={toEndDate}
                        picker={"day"}
                        onChange={handleToEndDateChange}
                        format={"MMMM DD, YYYY"}
                        style={{
                          height: "2.4rem",
                          width: "11rem",
                        }}
                      />
                    </div>
                  </div>
                )}
                {isActionStatusUpdate && (
                  <div className="w-100 flex flex-row justify-end pb-[6px]">
                    <div>
                      <span className="text-sm pl-1 pr-2 m-auto text-blue-500">
                        New Status
                      </span>
                      <CustomSelect
                        style={{ width: 190 }}
                        onChange={handleTargetStatusChange}
                        size={"middle"}
                        options={targetStatusOptions}
                        value={transitionTargetTo}
                        disabled={targetStatusOptions?.length === 0}
                      />
                    </div>
                  </div>
                )}
              </div>
              <TransferList
                date={toStartDate}
                disableDates={disableDates}
                listItems={targetListEvents}
                setDate={setToStartDate}
                setListItems={setTargetListEvents}
              />
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal
        title={`Save Confirmation`}
        open={showSaveConfirmation}
        onOk={handleSaveYes}
        onCancel={() => setShowSaveConfirmation(false)}
        cancelLabel={"No"}
        okLabel={"Yes"}
      >
        <div className="pt-2">
          {isActionReschedule && (
            <div>
              <div>
                You are rescheduling
                <span className="text-blue-500 font-semibold pl-1">
                  {targetListEvents.length}
                </span>{" "}
                event{targetListEvents.length > 1 ? `s` : ""}
              </div>
              <div className="pt-2">{`Do you want to proceed with the update?`}</div>
            </div>
          )}
          {action === MenuActions.batchStatusUpdate && (
            <div>
              <div>
                You are changing the status of
                <span className="text-blue-500 font-semibold pl-1">
                  {targetListEvents.length}
                </span>{" "}
                event{targetListEvents.length > 1 ? `s` : ""}
              </div>
              <div className="pt-2">{`Do you want to proceed with the update?`}</div>
            </div>
          )}
        </div>
      </ConfirmationModal>
    </div>
  );
}
