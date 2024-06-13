import React, { useState } from "react";
import { useSelector } from "react-redux";
import CollapsibleGroup from "app/components/atoms/workorderComponents/collapsibleGroup";
import DaySummary from "./subComponents/daySummary/daySummary";
import DaySummaryExport from "./subComponents/daySummaryExport/daySummaryExport";

import useCalendarEvents from "app/hooks/useCalendarEvents";

import Collapse from "@mui/material/Collapse";

export default function ProductionDaySummaryContainer({ workOrders, secondaryWorkOrders, canExport }) {
  const {
    date,
    department
  } = useSelector((state) => state.calendar);

  const {
    getDayTotals,
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
      title={"Day Summary"}
      subTitle={`W: ${getDayTotals()?.windows || 0 } | VD: ${getDayTotals()?.vinylDoors || 0 } | PD: ${getDayTotals()?.patioDoors || 0 } | ED: ${getDayTotals()?.exteriorDoors || 0 }`}
      value={showDayTable}
      ActionButton={() => {
        return (
          <span className="pr-3">
            <DaySummaryExport
              date={date}
              style={{ paddingBottom: "1rem" }}
              canExport={canExport}
            />
          </span>
        )
      }}
    >
      <Collapse in={showDayTable}>
        <DaySummary
          style={{ padding: "1rem" }}
          date={date}
          data={getDaySummaryWorkOrders()}
        />
      </Collapse>
    </CollapsibleGroup>
  );
}
