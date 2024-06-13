import React, { useEffect, useState, useCallback } from "react";
import styles from "./installationWeekSummary.module.css";

import moment from "moment";

import {
  generateInstallationDaySummaryData,
  generateRemeasureDaySummaryData,
} from "app/utils/utils";
import WeekTable from "../shared/weekTable/weekTable";
import {
  InstallationWeekDayTableColumns,
  Remeasure,
  RemeasureWeekDayTableColumns,
} from "app/utils/constants";
import { useSelector } from "react-redux";

export default function InstallationWeekSummary(props) {
  const { data, setPropertyLabels, weekSummaryData, setWeekSummaryData } =
    props;

  const [installData, setInstallData] = useState([]);

  const { subDepartment } = useSelector((state) => state.calendar);

  const isRemeasureSubDepartment = subDepartment?.key === Remeasure;

  useEffect(() => {
    if (data?.length > 0) {
      let _weekSummaryData = [];
      let weekDates = [];
      for (let i = 0; i < data.length; i++) {
        let _daySummaryData = isRemeasureSubDepartment
          ? generateRemeasureDaySummaryData(data[i])
          : generateInstallationDaySummaryData(data[i]);
        _weekSummaryData.push(_daySummaryData);
        weekDates.push(data[i].date);
      }
      setWeekSummaryData(_weekSummaryData);
    }
  }, [data, setWeekSummaryData, isRemeasureSubDepartment]);

  const generateTableData = useCallback(
    (sortOrder) => {
      let items = [];

      for (let i = 0; i < sortOrder.length; i++) {
        let _values = [];
        let rowTotal = 0;

        for (let j = 0; j < weekSummaryData.length; j++) {
          let dayValue = weekSummaryData[j]
            ? weekSummaryData[j][sortOrder[i]?.key]
            : 0;
          let value = { key: j, value: dayValue };
          rowTotal += parseInt(dayValue, 10);
          _values.push(value);
        }

        let item = {
          key: sortOrder[i].key,
          label: sortOrder[i].value,
          total: rowTotal,
          values: [..._values],
          type: sortOrder[i].type,
        };

        items.push(item);
      }

      return items;
    },
    [weekSummaryData]
  );

  useEffect(() => {
    if (weekSummaryData?.length > 0) {
      let weekData = isRemeasureSubDepartment
        ? RemeasureWeekDayTableColumns
        : InstallationWeekDayTableColumns;
      let _propertyLabels = [...weekData];

      setInstallData(generateTableData(weekData));

      setPropertyLabels(_propertyLabels);
    }
  }, [
    weekSummaryData,
    generateTableData,
    setPropertyLabels,
    isRemeasureSubDepartment,
  ]);

  return (
    <table
      style={{ width: "100% !important", minWidth: "100%" }}
      className="table"
    >
      <thead>
        <tr>
          <td></td>
          {data?.map((d, index) => {
            return (
              <td
                key={`week-label-${index}`}
                className={`${styles.dateHeader}`}
              >
                {moment(d.date)?.format("ddd MM/DD")}
              </td>
            );
          })}
          <td className={`${styles.dateHeader}`}>Total</td>
        </tr>
      </thead>
      <tbody>
        <WeekTable data={installData} />
      </tbody>
    </table>
  );
}
