"use client";
import styles from "./home.module.css";
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  Suspense,
} from "react";

import { useSelector, useDispatch } from "react-redux";
import { useSearchParams, useRouter } from "next/navigation";

import useCalendarEvents from "app/hooks/useCalendarEvents";
import useCalendarActions from "app/hooks/useCalendarActions";
import useContextMenu from "app/hooks/useContextMenu";
import useCalendarNavigation from "app/hooks/useCalendarNavigation";
import useApi from "app/hooks/useApi";
import usePermissions from "app/hooks/usePermissions";

import Box from "@mui/material/Box";

import { LoadingOutlined } from "@ant-design/icons";
import { Typography, Progress } from "antd";
const { Text } = Typography;

import moment from "moment";
import { motion } from "framer-motion";

import CalendarHeader from "app/components/templates/calendarHeader/calendarHeader";
import CalendarFallbackPage from "app/components/templates/calendarFallbackPage/calendarFallbackPage";
import ProductionContextMenu from "app/components/templates/contextMenus/productionContextMenu";
import ServiceContextMenu from "app/components/templates/contextMenus/serviceContextMenu";

import ProductionWeekSummaryContainer from "app/components/templates/weekSummary/production/productionWeekSummaryContainer";
import ProductionDaySummaryContainer from "app/components/templates/daySummary/production/productionDaySummaryContainer";

import CalendarRootModals from "app/components/templates/calendarRootModals/calendarRootModals";

import Calendar from "app/components/templates/fullCalendar/fullCalendar";

// -- Constants
import {
  CalendarTypes,
  CalendarViews,
  Pages,
  Production,
  Service,
  AppModes,
  Installation,
  Remeasure,
  Shipping,
  Backorder,
  ResultType
} from "app/utils/constants";

// -- Utils
import { setAppDetails, YMDDateFormat } from "app/utils/utils";

import { useCookies } from "react-cookie";

// -- Calendar Slice
import {
  updateAnEvent,
  updateDepartment,
  updateSubDepartment,
  updateWorkOrderData,
  updateIsLoading,
  updateMonthWorkOrders,
  updateDate,
} from "app/redux/calendar";

// -- App Slice
import {
  updateDrawerOpen,
  updateAppMode
} from "app/redux/app";

import InstallationWeekSummaryContainer from "./components/templates/weekSummary/installation/installationWeekSummaryContainer";
import InstallationDaySummaryContainer from "./components/templates/daySummary/installation/installationDaySummaryContainer";

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [cookies, setCookie] = useCookies(["options"]);

  const renderCount = useRef(0);
  const calendarRef = useRef();
  const modalsRef = useRef({});
  const calendarApi = calendarRef?.current?.getApi();

  const searchParams = useSearchParams();
  const departmentParam =
    searchParams.get("department") ||
    cookies?.options?.defaultCalendar ||
    Production; // Department value heirarchy = query param -> cookie  -> const
  const subDepartmentParam = searchParams.get("subdepartment");
  const workOrderParam = searchParams.get("work-order-number");
  const dateParam = searchParams.get("date");

  const [anchorEl, setAnchorEl] = useState(null);
  const [calendarHeight, setCalendarHeight] = useState(0);
  const [date, setDate] = useState(
    dateParam
      ? dateParam === "today"
        ? moment()
        : moment(dateParam)
      : moment()
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const [showRescheduleConfirmation, setShowRescheduleConfirmation] =
    useState(false);
  const [showChangeStatusConfirmation, setShowChangeStatusConfirmation] =
    useState(false);

  // -- CUSTOM HOOKS

  // -- UseApi
  const { workOrders, secondaryWorkOrders, refetch, refetchSecondary } = useApi(
    { date, type: "workorders" }
  );

  const filterOutString = searchParams.get("filterOut");
  const filterOutParam =
    (filterOutString && JSON.parse(filterOutString)) || null;

  // -- UseCalendarEvents
  const { getFilteredEvents, buildProductionEvents } = useCalendarEvents({
    ...{
      date,
      workOrders,
      secondaryWorkOrders,
      departmentParam,
    },
  });

  const {
    dropEvent,
    clickEvent,
    handleMoveCancel,
    handleRescheduleOk,
    handleStateChangeOk,
    getChangeEvent,
    updateChangeEvent,
    handleChangeStatusCancel,
    handleGenericRescheduleOk,
    handleServiceStateChangeOk,
    handleRescheduleInstallationOk,
  } = useCalendarActions({
    ...{
      workOrders,
      secondaryWorkOrders,
      setShowChangeStatusConfirmation,
      cookies
    },
  });

  // -- UseCalendarNavigation
  const {
    moveDateBack,
    moveDateForward,
    handleTodayButtonClick,
    goToDateCallback,
  } = useCalendarNavigation({
    date,
    setDate,
    refetch,
    refetchSecondary,
    calendarRef,
    calendarApi,
  });

  // -- UseContextMenu
  useContextMenu({ anchorEl, workOrders, calendarApi, setAnchorEl });

  // -- UsePermissions
  const { getUserHasFeatureEditByName } = usePermissions();

  // -- Calendar Reducer
  const {
    page,
    error,
    result,
    isLoading,
    department,
    subDepartment,
    selectedEvent,
    workOrderData, // Needed for the context menus
    filteredEvents,
  } = useSelector((state) => state.calendar);

  // -- App Reducer
  const { drawerOpen, isMobile, appVersion } = useSelector((state) => state.app);

  const MONTH_HEADER_HEIGHT_OFFSET = 150;
  const DAYWEEK_HEADER_HEIGHT_OFFSET = 180;
  const MOBILE_HEADER_HEIGHT_OFFSET = 150;

  useEffect(() => {
    setAppDetails("Centra Web Calendar");
    dispatch(updateAppMode(AppModes.calendar));
  }, [dispatch]);

  useEffect(() => {
    if (CalendarTypes) {
      const _department = CalendarTypes.find((x) => x.key === departmentParam);

      // Default Calendar SubDepartment Fix
      if (!_department) { // Default Calendar is a subDepartment ie. Remeasure and no url parameter has been supplied just plain webcalendar.ca             
        const multiCalendars = CalendarTypes.filter(c => c.type === "multi");
        let _subDepartment = null;

        if (multiCalendars?.length > 0) {
          multiCalendars.forEach((mc) => {
            _subDepartment = mc.options.find(mco => mco.key === departmentParam);
            if (_subDepartment) {                            
              router.push(
                `/?department=${mc?.key}&subdepartment=${_subDepartment?.key}&page=${page}&date=${YMDDateFormat(date)}`,
                undefined,
                { shallow: true }
              );
            }
          });
        }          
      }

      //TODO: Cleanup - use router instead
      if (_department) {
        if (_department && !subDepartmentParam) {
          refetch();
          dispatch(updateDepartment(_department));
          dispatch(updateSubDepartment(_department)); // Necessary when switching from a subDepartment
        }

        if (_department?.key === Installation && subDepartmentParam) {
          if (subDepartmentParam === Remeasure) {
            dispatch(updateDepartment(_department));
            dispatch(updateSubDepartment(_department?.options[1]));
            refetch();
            refetchSecondary();
          }
        }

        if (_department?.key === Shipping && subDepartmentParam) {
          if (subDepartmentParam === Backorder) {
            dispatch(updateDepartment(_department));
            dispatch(updateSubDepartment(_department?.options[1]));
            refetch();
            refetchSecondary();
          }
        }
      }      
    }
  }, [
    dispatch,
    departmentParam,
    subDepartmentParam,
    refetch,
    refetchSecondary,
    page,
    date,
    router
  ]);

  // Set initial height
  useEffect(() => {
    if (window && page) {
      switch (page) {
        case Pages.day:
        case Pages.week:
          setCalendarHeight(window.innerHeight - DAYWEEK_HEADER_HEIGHT_OFFSET);
          break;
        case Pages.mobile:
          setCalendarHeight(window.innerHeight - MOBILE_HEADER_HEIGHT_OFFSET);
          break;
        default:
          setCalendarHeight(window.innerHeight - MONTH_HEADER_HEIGHT_OFFSET);
          break;
      }
    }
  }, [page]);

  /* calendar header navigation */
  useEffect(() => {
    if (calendarRef?.current && page && calendarApi) {
      switch (page) {
        case Pages.month:
          calendarApi.changeView(CalendarViews.month);
          break;
        case Pages.week:
          calendarApi.changeView(CalendarViews.week);
          break;
        case Pages.day:
          calendarApi.changeView(CalendarViews.day);
          break;
        case Pages.mobile:
          calendarApi.changeView(CalendarViews.mobile);
          break;
        default:
          /* Leave blank or will force-refresh the calendar when closing work orders */
          break;
      }
    }
  }, [page, calendarApi]);

  useEffect(() => {
    function updateSize() {
      setCalendarHeight(window.innerHeight - MONTH_HEADER_HEIGHT_OFFSET);
    }
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (department && date) {
      goToDateCallback(date);
    }
  }, [department, date, goToDateCallback]);

  useEffect(() => {
    dispatch(updateDrawerOpen(drawerOpen));
  }, [dispatch, drawerOpen]);

  // Reload after a successful update
  useEffect(() => {
    if (result?.type === ResultType.success) {
      refetch();
      // refetchSecondary(); - Causes Installation drag and drop to flicker
    }
  }, [result, refetch]);

  useEffect(() => {
    setShowCalendar(
      page === Pages.month ||
      page === Pages.week ||
      page === Pages.day ||
      page === Pages.workOrder ||
      page === Pages.mobile ||
      page === "returnUrl"
    );
  }, [page]);

  // Used by month filter list
  useEffect(() => {
    if (workOrders?.data) {
      //TODO: Limit workorders to current month
      dispatch(updateMonthWorkOrders(workOrders.data));
    }
  }, [dispatch, workOrders]);

  useEffect(() => {
    if (workOrderParam && page === Pages.workOrder && department) {
      if (!workOrderData?.workOrderNumber && department.key !== Service) {
        dispatch(updateWorkOrderData({ workOrderNumber: workOrderParam }));
      }
    }
  }, [dispatch, workOrderParam, page, department, workOrderData]);

  useEffect(() => {
    if (
      (workOrderData?.workOrderNumber || workOrderData?.serviceId) &&
      department &&
      modalsRef &&
      workOrderParam
    ) {
      switch (department.key) {
        case Production:
          modalsRef?.current?.setState("productionWorkorder", true);
          break;
        case Service:
          modalsRef?.current?.setState("serviceWorkorder", true);
          break;
        default:
          break;
      }
    }
  }, [workOrderData, modalsRef.current.setState, department, workOrderParam]);

  useEffect(() => {
    if (page === CalendarViews.mobile) {
      dispatch(updateIsLoading(false));
    }
  }, [dispatch, page]);

  const contextMenuChangeCallback = useCallback(
    (id, type, name, value) => {
      if (id && type && name) {
        dispatch(
          updateAnEvent({
            id: id,
            type: type,
            name: name,
            value: value,
          })
        );

        // Close context menu if it's a status change
        if (type === "select") {
          setAnchorEl(null);
        }
      }
    },
    [dispatch]
  );

  const setDates = useCallback(
    (newDates) => {
      if (newDates && selectedEvent && calendarRef?.current && calendarApi) {
        let targetEvent = calendarApi.getEventById(selectedEvent.id);
        newDates.endDate = newDates.endDate + "T23:59:00";
        targetEvent.setDates(newDates?.startDate, newDates?.endDate);

        setAnchorEl(null);
      }
    },
    [selectedEvent, calendarApi]
  );

  const changeStatusCallback = useCallback(() => {
    setShowChangeStatusConfirmation(true);
    setAnchorEl(null);
  }, []);

  useEffect(() => {
    renderCount.current = renderCount.current + 1;
  });

  const SuspenseFallback = useCallback(() => {
    return (
      <>
        {calendarHeight && (
          <div
            className="w-full overflow-auto"
            style={{
              fontSize: `${cookies?.options?.calendarFontSize || 0.8}rem`,
              padding: "1rem 0",
              height: calendarHeight,
            }}
          >
            <div className="flex items-center justify-center w-100 h-100">
              <div className="flex flex-row text-gray-400">
                <div className="mt-1">
                  <LoadingOutlined spin className="mr-2" />
                </div>
                <div className="text-sm">
                  <Text type="secondary">Initial Render...</Text>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }, [calendarHeight, cookies]);

  const handleClickEvent = useCallback(
    (e) => {
      if (e) {
        clickEvent(e); // Load data
        switch (department.key) {
          case Production:
            modalsRef?.current?.setState("productionWorkorder", true);
            break;
          case Installation:
            modalsRef?.current?.setState("installationWorkorder", true);
            break;
          case Service:
            modalsRef?.current?.setState("serviceOrder", true);
            break;
          case Shipping:
            if (subDepartment.key === Backorder) {
              modalsRef?.current?.setState("backorderWorkorder", true);
            } else {
              modalsRef?.current?.setState("shippingWorkorder", true);
            }
            break;
          default:
            break;
        }
      }
    },
    [clickEvent, department, subDepartment, modalsRef]
  );

  useEffect(() => {
    // Date value in redux used by sales reps api
    if (date) {
      dispatch(updateDate(date));
    }
  }, [dispatch, date]);

  // For debugging
  useEffect(() => {
    if (workOrders?.data) {
      console.log("----------------------------------------");
      console.log("WorkOrders: ", workOrders);
      console.log("Secondary WorkOrders: ", secondaryWorkOrders);
      console.log("---------------------------------------");
    }
  }, [workOrders, secondaryWorkOrders]);

  if (department) {
    // Resize week columns to align with week summary table columns
    const weekDays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    if (page === Pages.week && department?.key === Production) {
      for (let i = 0; i <= 7; i++) {
        let colElement = document.getElementsByClassName(`fc-day-${weekDays[i]}`);

        if (colElement?.length > 0) {
          for (let j = 0; j < colElement.length; j++) {
            colElement[j].style.width = "12.5%";
          }
        }
      }
    } else {
      // Clear applied styles
      for (let i = 0; i <= 7; i++) {
        let colElement = document.getElementsByClassName(`fc-day-${weekDays[i]}`);

        if (colElement?.length > 0) {
          for (let j = 0; j < colElement.length; j++) {
            colElement[j].style.width = null;
          }
        }
      }
    }
  }

  // Make sure that a date change triggers the API
  useEffect(() => {
    if (date) {
      refetch();
    }
  }, [date, refetch]);

  // Just to make sure that loading page doesn't show forever
  useEffect(() => {
    setTimeout(() => dispatch(updateIsLoading(false)), 10000);
  }, [dispatch]);

  const InitialRenderFinishCycle = 7;

  // Only show the calendar when events have popped up in the DOM
  useEffect(() => {
    if (filteredEvents?.length > 0) {
      let eventElements = document.getElementsByClassName("fc-event");
      if (eventElements?.length > 0) {
        dispatch(updateIsLoading(false));
      }

      if (eventElements?.length === 0 && page === Pages.day) { // Day view w/o work orders
        dispatch(updateIsLoading(false));
      }
    }

    if ((!filteredEvents || filteredEvents?.length === 0) &&
      renderCount?.current >= InitialRenderFinishCycle) {
      dispatch(updateIsLoading(false));
    }    
  }, [dispatch, filteredEvents, page]);

  return (
    <>
      <Suspense fallback={<SuspenseFallback />}>
        <Box sx={{ display: "flex", padding: 0 }}>
          <div className="w-100">
            {showCalendar && (
              <div
                className={`${styles.calendarOuterContainer} ${isMobile ? "p-0 pt-2" : "pt-3 pl-4 pr-4"
                  } relative`}
              >
                <CalendarHeader
                  todayButtonClick={handleTodayButtonClick}
                  goToDate={goToDateCallback}
                  date={date}
                  setDate={(date) => {
                    setDate(date);
                  }}
                  moveDateForward={moveDateForward}
                  moveDateBack={moveDateBack}
                  refetch={refetch}
                  refetchSecondary={refetchSecondary}
                  paramFilterOut={filterOutParam}
                />

                <div className={styles.calendarInnerContainer}>
                  {page === Pages.day && department?.key === Production && (
                    <ProductionDaySummaryContainer
                      workOrders={workOrders}
                      secondaryWorkOrders={secondaryWorkOrders}
                      canExport={getUserHasFeatureEditByName("Export Reports")}
                    />
                  )}

                  {page === Pages.day && department?.key === Installation && (
                    <InstallationDaySummaryContainer
                      workOrders={workOrders}
                      secondaryWorkOrders={secondaryWorkOrders}
                    />
                  )}

                  {page === Pages.week && department?.key === Production && (
                    <ProductionWeekSummaryContainer
                      workOrders={workOrders}
                      secondaryWorkOrders={secondaryWorkOrders}
                      canExport={getUserHasFeatureEditByName("Export Reports")}
                    />
                  )}

                  {page === Pages.week && department?.key === Installation && (
                    <InstallationWeekSummaryContainer
                      workOrders={workOrders}
                      secondaryWorkOrders={secondaryWorkOrders}
                    />
                  )}

                  {/* Note: Ignore flushSync warnings, shows up due to the custom calendar events we use */}
                  <div
                    className="w-full overflow-auto"
                    style={{
                      fontSize: `${cookies?.options?.calendarFontSize || 0.8
                        }rem`,
                      padding: "1rem 0",
                      height: calendarHeight,
                    }}
                  >
                    {isLoading &&
                      !error &&
                      renderCount?.current > InitialRenderFinishCycle && (
                        <div className="flex items-center justify-center w-100 h-100">
                          <div className="flex flex-row text-gray-400">
                            <div className="mt-1">
                              <LoadingOutlined spin className="mr-2" />
                            </div>
                            <div className="text-sm">
                              <Text type="secondary">Loading...</Text>
                            </div>
                          </div>
                        </div>
                      )}

                    {isLoading &&
                      !error &&
                      renderCount?.current < InitialRenderFinishCycle && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center justify-center w-100 h-100"
                        >
                          <div className="flex flex-col text-gray-400">
                            <div className="flex justify-center align-center">
                              <Progress
                                status="active"
                                percent={renderCount.current * 25}
                              />
                            </div>
                            <div className="text-center">
                              <div className="mt-3">
                                Rendering calendar, please wait...
                              </div>
                              <div className="mt-1">
                                If loading takes longer than 10 seconds, refresh
                                the page.
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                    {error && <CalendarFallbackPage />}

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        display: !isLoading && !error ? "block" : "none",
                      }}
                    >
                      <Calendar
                        {...{
                          calendarRef,
                          calendarHeight,
                          cookies,
                          setCookie,
                          handleClickEvent,
                          dropEvent,
                          setShowRescheduleConfirmation,
                          setDate
                        }}
                      />
                      <div className="absolute bottom-[10px] left-[32px]" style={{ fontSize: "10px" }}>{`ver. ${appVersion}`}</div>
                    </motion.div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Box>

        <CalendarRootModals
          {...{
            modalsRef,
            workOrders,
            changeEvent: getChangeEvent(),

            showRescheduleConfirmation,
            setShowRescheduleConfirmation,
            showChangeStatusConfirmation,
            setShowChangeStatusConfirmation,

            handleRescheduleOk,
            handleRescheduleInstallationOk,
            handleMoveCancel,
            handleChangeStatusCancel,
            handleStateChangeOk,
            handleGenericRescheduleOk,
            contextMenuChangeCallback,
            handleServiceStateChangeOk,
          }}
        />

        {anchorEl && department?.key === Production && (
          <div id={"event-context-menu"} className="absolute z-10 p-1 text-sm">
            <ProductionContextMenu
              onChange={contextMenuChangeCallback}
              setDates={setDates}
              handleChangeStatusReschedule={changeStatusCallback}
              setShowProductionWorkorder={(val) =>
                modalsRef?.current?.setState("productionWorkorder", true)
              }
              setShowRescheduleConfirmation={setShowRescheduleConfirmation}
              setShowChangeStatusConfirmation={setShowChangeStatusConfirmation}
              setChangeEvent={updateChangeEvent}
              isHideWeekends={cookies?.options?.hideWeekends}
              canEdit={getUserHasFeatureEditByName("Order Details")}
            />
          </div>
        )}

        {anchorEl && department?.key === Service && (
          <div id={"event-context-menu"} className="absolute z-10 p-1 text-sm">
            <ServiceContextMenu
              onChange={contextMenuChangeCallback}
              setDates={setDates}
              handleChangeStatusReschedule={changeStatusCallback}
              setShowServiceWorkOrder={(val) =>
                modalsRef?.current?.setState("serviceOrder", true)
              }
              setShowRescheduleConfirmation={setShowRescheduleConfirmation}
              setShowChangeStatusConfirmation={setShowChangeStatusConfirmation}
              setChangeEvent={updateChangeEvent}
              isHideWeekends={cookies?.options?.hideWeekends}
            />
          </div>
        )}
        {false && (
          <div className="absolute bottom-0 right-1 text-blue-500 hover:cursor-pointer">
            <i
              className="fa-regular fa-circle-question"
              onClick={() => modalsRef?.current?.setState("help", true)}
            ></i>
          </div>
        )}
      </Suspense>
    </>
  );
}
