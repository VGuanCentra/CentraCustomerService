"use client";
import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import multiMonthPlugin from "@fullcalendar/multimonth";
import timeGridPlugin from "@fullcalendar/timegrid";

import ProductionEvent from "app/components/organisms/events/productionEvent";
import ServiceEvent from "app/components/organisms/events/serviceEvent";
import InstallationEvent from "app/components/organisms/events/installationEvent";
import RemeasureEvent from "app/components/organisms/events/remeasureEvent";
import ShippingEvent from "app/components/organisms/events/shippingEvent";
import BackorderEvent from "app/components/organisms/events/backorderEvent";

import moment from "moment";

import {
  CalendarViews,
  Production,
  Service,
  Installation,
  Remeasure,
  Shipping,
  Pages,
  Backorder,
} from "app/utils/constants";

import { updatePage } from "app/redux/calendar";

export default function Calendar({
  calendarRef,
  calendarHeight,
  cookies,
  setCookie,
  handleClickEvent,
  dropEvent,
  setShowRescheduleConfirmation,
  setDate
}) {
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    page,
    events,
    filteredEvents,
    department,
    subDepartment,
    markedWorkOrderId
  } = useSelector((state) => state.calendar);

  const getEventComponent = useCallback(
    (e) => {
      if (e && cookies && department && events?.length > 0) {
        if (department.key === Production && events[0].type === Production) {
          return ProductionEvent(e, cookies, markedWorkOrderId, page);
        } else if (department.key === Installation) {
          let _eventComponent = InstallationEvent(
            e,
            cookies,
            markedWorkOrderId,
            page
          );
          if (subDepartment?.key === Remeasure) {
            _eventComponent = RemeasureEvent(
              e,
              cookies,
              markedWorkOrderId,
              page
            );
          }
          return _eventComponent;
        } else if (department.key === Service && events[0].type === Service) {
          return ServiceEvent(e, page);
        } else if (department.key === Shipping) {
          let _eventComponent = null;

          if (subDepartment?.key === Backorder) {
            _eventComponent = BackorderEvent(
              e,
              cookies,
              markedWorkOrderId,
              page
            );
          } else {
            _eventComponent = ShippingEvent(
              e,
              cookies,
              markedWorkOrderId,
              page
            );
          }

          return _eventComponent;
        } else {
          return null;
        }
      }
    },
    [cookies, department, subDepartment, events, markedWorkOrderId, page]
  );

  const handleMoreLinkClick = () => {
    let _options = {
      dayMaxEvents: 1000,
      hideWeekends: cookies?.options.hideWeekends,
      calendarFontSize: cookies?.options.calendarFontSize,
      expandEvents: cookies?.options.expandEvents,
    };
    setCookie("options", _options, { path: "/" });
  };

  const handleNavClick = useCallback(
    (newDate, newPage) => {
      if (newDate && router && newPage) {
        dispatch(updatePage(newPage))

        let year = moment(newDate).format("YYYY");
        let month = moment(newDate).format("MM");
        let day = moment(newDate).format("DD");

        let _newDate = `${year}-${month}-${day}`;

        setDate(moment(_newDate));

        window.history.pushState(
          `${newPage}`,
          `${newPage}`,
          `/?department=${department?.key}&page=${newPage}&date=${_newDate}`
        ); // workaround to force update the url
        router.push(
          `/?department=${department?.key}&page=${newPage}&date=${_newDate}`,
          undefined,
          { shallow: true }
        );
      }
    },
    [dispatch, router, setDate, department]
  );

  return (
    <>
      <FullCalendar
        allDaySlot={true}
        ref={calendarRef}
        initialView={CalendarViews.month}
        height={calendarHeight - 35}
        editable={true}
        eventDisplay={"block"}
        dayMaxEvents={cookies?.options?.dayMaxEvents || 1000}
        headerToolbar={false}
        selectable={true}
        weekends={!cookies?.options?.hideWeekends || false}
        weekNumbers={true}
        events={filteredEvents}
        eventClick={handleClickEvent}
        eventDrop={(e) => {
          dropEvent(e);
          if (!cookies?.options?.hideDragAndDrop) {
            setShowRescheduleConfirmation(true);
          }
          
        }}
        eventResize={(e) => {
          dropEvent(e);
          if (!cookies?.options?.hideDragAndDrop) {
            setShowRescheduleConfirmation(true);
          }          
        }}
        //eventsSet={() => { console.log("SET") }}
        //eventDidMount={(x) => {
        //  if (isLoading) {
        //    dispatch(updateIsLoading(false));
        //  }
        //}}
        plugins={[
          dayGridPlugin,
          interactionPlugin,
          timeGridPlugin,
          multiMonthPlugin,
          listPlugin,
        ]}
        navLinks={true}
        navLinkWeekClick={newDate => handleNavClick(newDate, Pages.week)}
        navLinkDayClick={newDate => handleNavClick(newDate, Pages.day)}
        showNonCurrentDates={true}
        //eventContent={renderCount.current > 4 ? (e) => getEventComponent(e) : null}
        eventContent={(e) => getEventComponent(e)}
        moreLinkClick={handleMoreLinkClick}
        // eventOrder={"jobDifficulty"} - For Installation Events
        // eventOrderStrict={false}
        progressiveEventRendering={true}
      />
    </>
  );
}
