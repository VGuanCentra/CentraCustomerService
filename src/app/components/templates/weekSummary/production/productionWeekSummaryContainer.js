import React, { useState } from "react";
import { useSelector } from "react-redux";
import CollapsibleGroup from "app/components/atoms/workorderComponents/collapsibleGroup";
import WeekSummary from "./subComponents/weekSummary/weekSummary";
import WeekSummaryExport from "./subComponents/weekSummaryExport/weekSummaryExport";

import Collapse from "@mui/material/Collapse";
import moment from "moment";

import useCalendarEvents from "app/hooks/useCalendarEvents";

export default function ProductionWeekSummaryContainer({ workOrders, secondaryWorkOrders, canExport }) {
  const { date, department } = useSelector((state) => state.calendar);

  const {
    getWeekTotals,
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
      title={"Week Summary "}
      subTitle={`W: ${getWeekTotals()?.windows || 0 } | VD: ${getWeekTotals()?.vinylDoors || 0 } | PD: ${getWeekTotals()?.patioDoors || 0 } | ED: ${getWeekTotals()?.exteriorDoors || 0 }`}
      value={showWeekTable}
      ActionButton={() => {
        return (
          <span className="pr-3">
            <WeekSummaryExport
              data={{ summary: weekSummaryData, dates: getWeekSummaryWorkOrders().map(d => d.date) }}
              propertyLabels={propertyLabels}
              style={{ paddingTop: "1rem" }}
              canExport={canExport}
            />
          </span>
        )
      }}
    >
      <Collapse orientation="vertical" in={showWeekTable}>
        <WeekSummary
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
