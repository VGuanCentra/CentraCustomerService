"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Empty } from "antd";

import ProductionEvent from "app/components/organisms/events/productionEvent";
import InstallationEvent from "app/components/organisms/events/installationEvent";
import WOSelection from "app/components/organisms/woSelection/woSelection";

import useCalendarEvents from "app/hooks/useCalendarEvents";
import { Pages, Production, Installation } from "app/utils/constants";

import { updateFilteredWorkOrders } from "app/redux/calendar";

export default function WOFilter(props) {
  const { className } = props;

  const [workOrderNumber, setWorkOrderNumber] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectionWorkOrders, setSelectionWorkOrders] = useState([]);

  const dispatch = useDispatch();

  const {
    date,
    branch,
    department,
    monthWorkOrders, //TODO: monthWorkorders giving 3 month list
    weekWorkOrders,
    dayWorkOrders,
    page,
    filteredWorkOrders,
  } = useSelector((state) => state.calendar);

  const { buildProductionEvents, buildInstallationEvents } = useCalendarEvents({
    ...{
      date,
      filteredWorkOrders,
      departmentParam: department?.key,
    },
  });

  const handleSelect = useCallback(
    (val) => {      
      let _filteredWorkOrders = [...filteredWorkOrders];
      if (monthWorkOrders?.length > 0) {
        let _workOrder = monthWorkOrders.find((x) => x.workOrderNumber === val.id);
        if (_workOrder) {
          let isExisting = _filteredWorkOrders.find(
            (w) => w.workOrderNumber === val.id
          );

          if (!isExisting) {
            _filteredWorkOrders.push(_workOrder);
          }

          dispatch(updateFilteredWorkOrders(_filteredWorkOrders));
        }
      }
    },
    [dispatch, monthWorkOrders, filteredWorkOrders]
  );

  useEffect(() => {
    let _events = [];

    if (department?.key === Production) {
      _events = buildProductionEvents(filteredWorkOrders);
    }

    if (department?.key === Installation) {
      _events = buildInstallationEvents(filteredWorkOrders);
    }

    if (_events) {
      setEvents(_events);
    }
  }, [dispatch, filteredWorkOrders, buildProductionEvents, buildInstallationEvents, department]);

  useEffect(() => {
    if (page) {
      switch (page) {
        case Pages.month:
          setSelectionWorkOrders([...monthWorkOrders]);
          break;
        case Pages.week:
          setSelectionWorkOrders([...weekWorkOrders]);
          break;
        case Pages.day:
          setSelectionWorkOrders([...dayWorkOrders]);
          break;
        default:
          break;
      }
    }
  }, [page, monthWorkOrders, weekWorkOrders, dayWorkOrders]);

  return (
    <div className={className}>
      <div className="mt-2">
        <WOSelection
          branch={branch}
          workOrders={selectionWorkOrders}
          handleSelect={handleSelect}
          workOrderNumber={workOrderNumber}
          setWorkOrderNumber={setWorkOrderNumber}
        />
      </div>
      <div
        style={{ border: "1px dotted lightgrey" }}
        className="w-100 rounded mt-3 p-1 h-[14.2rem]"
      >
        {events?.length === 0 && (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Data" />
        )}
        {events.length > 0 && (
          <div className="overflow-y-auto">
            {events?.map((e, index) => {
              return (
                <>
                { department?.key === Production &&
                <ProductionEvent
                  key={index}
                  event={e}
                  style={{
                    backgroundColor: e.backgroundColor,
                    borderRadius: "5px",
                    paddingRight: "0.5rem",
                    minWidth: "90%",
                    marginBottom: "3px",
                  }}
                  textStyle={{
                    fontSize: "0.8rem",
                  }}
                  isWONFirst={true}
                />
                  }
                  {department?.key === Installation &&
                    <InstallationEvent
                      key={index}
                      event={e}
                      style={{
                        backgroundColor: e.backgroundColor,
                        borderRadius: "5px",
                        paddingRight: "0.5rem",
                        minWidth: "90%",
                        marginBottom: "3px",
                      }}
                      textStyle={{
                        fontSize: "0.8rem",
                      }}
                      isWONFirst={true}
                    />
                  }
                </>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
