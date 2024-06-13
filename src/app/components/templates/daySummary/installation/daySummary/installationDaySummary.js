import React from "react";
import styles from "./installationDaySummary.module.css";

import {
  generateInstallationDaySummaryData,
  generateRemeasureDaySummaryData,
} from "app/utils/utils";
import DayTable from "../../shared/dayTable/dayTable";
import { DataTypes, Remeasure } from "app/utils/constants";
import { useSelector } from "react-redux";

export default function InstallationDaySummary(props) {
  const { data } = props;

  const { subDepartment } = useSelector((state) => state.calendar);

  const isRemeasureSubDepartment = subDepartment?.key === Remeasure;

  const daySummaryData = isRemeasureSubDepartment
    ? generateRemeasureDaySummaryData(data)
    : generateInstallationDaySummaryData(data);

  /*-----------------*/

  let installData1 = {
    items: [
      {
        key: "workOrders",
        value: daySummaryData?.workOrders,
        label: "Work Orders",
        type: DataTypes.number,
      },
      {
        key: "windows",
        value: daySummaryData?.windows,
        label: "Windows",
        type: DataTypes.number,
      },
      {
        key: "codelDoors",
        value: daySummaryData?.codelDoors,
        label: "Codel Doors",
        type: DataTypes.number,
      },
      {
        key: "patioDoors",
        value: daySummaryData?.patioDoors,
        label: "Patio Doors",
        type: DataTypes.number,
      },
      {
        key: "leadPaint",
        value: daySummaryData?.leadPaint,
        label: "Lead Paint",
        type: DataTypes.number,
      },
      {
        key: "hazardousLBRMin",
        value: daySummaryData?.hazardousLBRMin,
        label: "Hazardous LBR Min",
        type: DataTypes.number,
      },
    ],
  };

  let installData2 = {
    items: [
      {
        key: "windowInstallLBR",
        value: daySummaryData?.windowInstallLBR,
        label: "Window Install LBR",
        type: DataTypes.number,
      },
      {
        key: "patioDoorInstallLBR",
        value: daySummaryData?.patioDoorInstallLBR,
        label: "Patio Door Install LBR",
        type: DataTypes.number,
      },
      {
        key: "codelDoorInstallLBR",
        value: daySummaryData?.codelDoorInstallLBR,
        label: "Codel Door Install LBR",
        type: DataTypes.number,
      },
      {
        key: "totalInstallLBR",
        value: daySummaryData?.totalInstallLBR,
        label: "Total Install LBR",
        type: DataTypes.number,
      },
      {
        key: "actualInstallMins",
        value: daySummaryData?.actualInstallMins,
        label: "Actual Install Minutes",
        type: DataTypes.number,
      },
      {
        key: "installLBRDiff",
        value: daySummaryData?.installLBRDiff,
        label: "Install LBR Diff",
        type: DataTypes.number,
      },
    ],
  };

  let installData3 = {
    items: [
      {
        key: "asbestosJobs",
        value: daySummaryData?.asbestosJobs,
        label: "Asbestos Jobs",
        type: DataTypes.number,
      },
      {
        key: "woodDropOffJobs",
        value: daySummaryData?.woodDropOffJobs,
        label: "Wood Drop Off Jobs",
        type: DataTypes.number,
      },
      {
        key: "highRiskJobs",
        value: daySummaryData?.highRiskJobs,
        label: "High Risk Jobs",
        type: DataTypes.number,
      },

      {
        key: "sidingLBRBudget",
        value: daySummaryData?.sidingLBRBudget,
        label: "Siding LBR Budget",
        type: DataTypes.currency,
      },
      {
        key: "sidingLBRMin",
        value: daySummaryData?.sidingLBRMin,
        label: "Siding LBR Min",
        type: DataTypes.number,
      },
      {
        key: "sidingSQF",
        value: daySummaryData?.sidingSQF,
        label: "Siding SQF",
        type: DataTypes.number,
      },
    ],
  };

  let installData4 = {
    items: [
      {
        key: "ffiMin",
        value: daySummaryData?.ffiMin,
        label: "FFI Min",
        type: DataTypes.number,
      },
      {
        key: "ffrMin",
        value: daySummaryData?.ffrMin,
        label: "FFR Min",
        type: DataTypes.number,
      },
      {
        key: "salesAmount",
        value: daySummaryData?.salesAmount,
        label: "Sales Amount",
        type: DataTypes.currency,
      },
      {
        key: "salesTarget",
        value: daySummaryData?.salesTarget,
        label: "Sales Target",
        type: DataTypes.currency,
      },
      {
        key: "salesDiff",
        value: daySummaryData?.salesDiff,
        label: "Sales Diff",
        type: DataTypes.currency,
      },
      {
        key: "empty",
        value: "",
        label: "",
        type: DataTypes.text,
      },
    ],
  };

  /*-----------------*/

  let remeasureData1 = {
    items: [
      {
        key: "workOrders",
        value: daySummaryData?.workOrders,
        label: "Work Orders",
        type: DataTypes.number,
      },
      {
        key: "remeasureLBR",
        value: daySummaryData?.remeasureLBR,
        label: "Remeasure LBR",
        type: DataTypes.number,
      },
      {
        key: "leadPaint",
        value: daySummaryData?.leadPaint,
        label: "Lead Paint",
        type: DataTypes.number,
      },
    ],
  };

  let remeasureData2 = {
    items: [
      {
        key: "windows",
        value: daySummaryData?.windows,
        label: "Windows",
        type: DataTypes.number,
      },
      {
        key: "codelDoors",
        value: daySummaryData?.codelDoors,
        label: "Codel Doors",
        type: DataTypes.number,
      },
      {
        key: "patioDoors",
        value: daySummaryData?.patioDoors,
        label: "Patio Doors",
        type: DataTypes.number,
      },
    ],
  };

  let remeasureData3 = {
    items: [
      {
        key: "asbestosJobs",
        value: daySummaryData?.asbestosJobs,
        label: "Asbestos Jobs",
        type: DataTypes.number,
      },
      {
        key: "woodDropOffJobs",
        value: daySummaryData?.woodDropOffJobs,
        label: "Wood Drop Off Jobs",
        type: DataTypes.number,
      },
      {
        key: "highRiskJobs",
        value: daySummaryData?.highRiskJobs,
        label: "High Risk Jobs",
        type: DataTypes.number,
      },
    ],
  };

  let remeasureData4 = {
    items: [
      {
        key: "salesAmount",
        value: daySummaryData?.salesAmount,
        label: "Sales Amount",
        type: DataTypes.currency,
      },
      {
        key: "salesTarget",
        value: daySummaryData?.salesTarget,
        label: "Sales Target",
        type: DataTypes.currency,
      },
      {
        key: "salesDiff",
        value: daySummaryData?.salesDiff,
        label: "Sales Diff",
        type: DataTypes.currency,
      },
    ],
  };

  return (
    <div style={{ ...props.style }}>
      <div className={`${styles.gridContainer}`}>
        {isRemeasureSubDepartment ? (
          <>
            <div className={`${styles.gridItem}`}>
              <DayTable data={remeasureData1} />
            </div>
            <div className={`${styles.gridItem}`}>
              <DayTable data={remeasureData2} />
            </div>
            <div className={`${styles.gridItem}`}>
              <DayTable data={remeasureData3} />
            </div>
            <div className={`${styles.gridItem}`}>
              <DayTable data={remeasureData4} />
            </div>
          </>
        ) : (
          <>
            <div className={`${styles.gridItem}`}>
              <DayTable data={installData1} />
            </div>
            <div className={`${styles.gridItem}`}>
              <DayTable data={installData2} />
            </div>
            <div className={`${styles.gridItem}`}>
              <DayTable data={installData3} />
            </div>
            <div className={`${styles.gridItem}`}>
              <DayTable data={installData4} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
