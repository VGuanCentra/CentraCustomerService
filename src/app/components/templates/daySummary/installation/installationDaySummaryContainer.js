import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CollapsibleGroup from "app/components/atoms/workorderComponents/collapsibleGroup";

import Collapse from "@mui/material/Collapse";
import InstallationDaySummary from "./daySummary/installationDaySummary";

import useCalendarEvents from "app/hooks/useCalendarEvents";

export default function InstallationDaySummaryContainer({ workOrders, secondaryWorkOrders }) {
  const {
    date,
    department
  } = useSelector((state) => state.calendar);

  const {
    getDaySummaryWorkOrders
  } = useCalendarEvents({
    ...{
      date,
      workOrders,
      secondaryWorkOrders,
      departmentParam: department?.key
    },
  });

  const [showDayTable, setShowDayTable] = useState(false);
  const [workOrderData, setWorkOrderData] = useState([]);

  useEffect(() => {
    setWorkOrderData({
      date: date,
      workOrders: getDaySummaryWorkOrders(),
    });
  }, [date, getDaySummaryWorkOrders]);

  return (
    <CollapsibleGroup
      className="text-gray-500 font-medium"
      expandCollapseCallback={(val) => setShowDayTable(val)}
      headerStyle={{
        borderRadius: "3px",
        backgroundColor: "#FAF9F6",
        border: "1px dotted lightgrey",
      }}
      style={{ border: "none", paddingTop: "0.5rem" }}
      title={"Installation Day Summary"}
      value={showDayTable}
    >
      <Collapse in={showDayTable}>
        <InstallationDaySummary data={workOrderData} />
      </Collapse>
    </CollapsibleGroup>
  );
}
