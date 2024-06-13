"use client";
import React, { useState, useCallback, useMemo } from "react";
import _ from "lodash";
// import ReactExport from "react-data-export";

// const ExcelFile = ReactExport.ExcelFile;
// const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

import { Upload, Select, Button } from "antd";
import moment from "moment";

import { fetchPlantProductionReport } from "app/api/productionApis";

import { openBlob, getBase64, DataURIToBlob } from "app/utils/utils";

// local
import Report_plantProduction_plantPlanning from "./reportSections/report_plantProduction_plantPlanning";

const REPORTS = {
  plantProduction: {
    label: "Plant Production",
    items: {
      plantPlanning: {
        label: "Plant Planning",
        value: "plantPlanning",
        renderer: () => <Report_plantProduction_plantPlanning />,
      },
    },
  },
};

export default function Reports() {
  const [reportSection, setReportSection] = useState("plantProduction");
  const [reportType, setReportType] = useState(null);

  const list1 = useMemo(
    () =>
      Object.keys(REPORTS)?.map((k) => ({
        value: k,
        label: REPORTS[k]?.label,
      })),
    []
  );

  const list2 = useMemo(
    () =>
      Object.keys(REPORTS[reportSection]?.items || [])?.map((k) => ({
        value: k,
        label: REPORTS[reportSection]?.items[k]?.label,
      })),
    [reportSection]
  );

  return (
    <div className="pt-4">
      <Select
        defaultValue="plantProduction"
        style={{ width: "100%" }}
        onChange={(e) => setReportSection(e)}
        options={list1}
        value={reportSection}
        className="mb-3"
      />
      {reportSection ? (
        <>
          <Select
            defaultValue="plantPlanning"
            style={{ width: "100%" }}
            onChange={(e) => setReportType(e)}
            options={list2}
            value={reportType}
            className="mb-3"
            placeholder = "Select report type..."
          />

          <div className="flex flex-row justify-end pt-3 w-100 border-b pb-3 border-dotted">
            {REPORTS?.[reportSection]?.items?.[reportType]?.renderer?.() || null}
          </div>
        </>
      ) : null}
    </div>
  );
}
