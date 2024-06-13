import React, { useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";

import CollapsibleGroup from "app/components/atoms/workorderComponents/collapsibleGroup";
import Collapse from "@mui/material/Collapse";
import InstallationWeekSummary from "./installationWeekSummary";

import useCalendarEvents from "app/hooks/useCalendarEvents";

export default function InstallationWeekSummaryContainer({ workOrders, secondaryWorkOrders }) {
  const { date, department } = useSelector((state) => state.calendar);

  const {
    getWeekSummaryWorkOrders,
    updateWeekTotals
  } = useCalendarEvents({
    ...{
      date,
      workOrders,
      secondaryWorkOrders,
      departmentParam: department?.key
    },
  });

  const [showWeekTable, setShowWeekTable] = useState(false);
  const [propertyLabels, setPropertyLabels] = useState([]);
  const [weekSummaryData, setWeekSummaryData] = useState([]);

  return (
    <CollapsibleGroup
      className="text-gray-500 font-medium"
      expandCollapseCallback={(val) => setShowWeekTable(val)}
      headerStyle={{
        borderRadius: "3px",
        backgroundColor: "#FAF9F6",
        border: "1px dotted lightgrey",
      }}
      style={{ border: "none", paddingTop: "0.5rem" }}
      title={"Installation Week Summary "}
      value={showWeekTable}
      ActionButton={() => {}}
    >
      <Collapse orientation="vertical" in={showWeekTable}>
        <InstallationWeekSummary
          weekStartDate={moment(date).startOf("week")}
          weekEndDate={moment(date).endOf("week")}
          data={getWeekSummaryWorkOrders()}
          setWeekTotals={updateWeekTotals}
          propertyLabels={propertyLabels}
          setPropertyLabels={setPropertyLabels}
          weekSummaryData={weekSummaryData}
          setWeekSummaryData={setWeekSummaryData}
        />
      </Collapse>
    </CollapsibleGroup>
  );
}
