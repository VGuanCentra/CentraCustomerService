"use client";
import React, { useState, useCallback, useId } from "react";
import AntDatePicker from "app/components/atoms/datePicker/datePicker";

import { Modal, Space, Select, Button, InputNumber } from "antd";
import moment from "moment";

import { fetchPlantProductionReport } from "app/api/productionApis";

import { tablesToExcel, tablesToExcelXLSX, openGeneratedPage } from "./reportUtils";
import parseExport_BC from "./parseExport_BC";
import parseExport_AB from "./parseExport_AB";

const PARSE_BRANCH = {
  BC: parseExport_BC,
  AB: parseExport_AB,
};

import styles from "./styles.module.css";

const getStartAndEndDate = (newdate, weeks) => {
  const startDate = newdate.format("YYYY-MM-DD");

  // to satisfy include search
  const endDate = newdate
    .clone()
    .add(weeks, "weeks")
    .subtract(1, "days")
    .format("YYYY-MM-DD");

  return { startDate, endDate };
};

export default function Reports({}) {
  const [date, setDate] = useState(moment(new Date()).startOf("week"));
  const [weekNumber, setWeekNumber] = useState(26);
  const [branch, setBranch] = useState("BC");

  const [renderTable, setRenderTable] = useState("");

  const render = (html) => {
    openGeneratedPage(html, "Report preview")
  };
  const handleDateChange = useCallback(
    (newDate) => {
      if (newDate) {
        const _date = moment(newDate).startOf("week");
        setDate(moment(_date));
      } else {
        const _date = moment(new Date()).startOf("week");
        setDate(moment(_date));
      }
    },
    [setDate]
  );

  const handleChangeWeeks = useCallback((v) => {
    //
    if (v > 26 || v < 0) {
      return;
    }
    setWeekNumber(Math.floor(v));
  }, []);

  const handleDownload = useCallback(async () => {
    const { startDate, endDate } = getStartAndEndDate(date, weekNumber);
    const res = await fetchPlantProductionReport(startDate, endDate);
    if (res?.data) {
      const tb = PARSE_BRANCH[branch](res?.data, branch, startDate, endDate);
      const file_name = `Plant Planning - ${branch} (${moment(date).format(
        "YYYY-MM-DD"
      )})`;
      tablesToExcel([tb], ["table1"], file_name + ".xls");
    }
  }, [branch, date, weekNumber]);

  const handleRender = useCallback(async () => {
    const { startDate, endDate } = getStartAndEndDate(date, weekNumber);
    const res = await fetchPlantProductionReport(startDate, endDate);
    if (res?.data) {
      const tb = PARSE_BRANCH[branch](res?.data, branch, startDate, endDate);
      render(tb);
    }
  }, [branch, date, weekNumber]);

  let datePickerKey = useId();

  return (
    <div className="flex flex-column p-2 w-100 border-b border gap-2">
      <div className="flex flex-row align-items-center gap-1">
        <AntDatePicker
          key={datePickerKey}
          // disabledDate={}
          value={date}
          picker={"week"}
          onChange={handleDateChange}
          format={`MMMM YYYY - [Week] WW`}
          className="border-none"
          style={{ flexGrow: 1, height: 32 }}
        />
      </div>
      <div className="flex flex-row align-items-center gap-1">
        <Space.Compact>
          <InputNumber
            placeholder="weeks (Max. 26)"
            onChange={handleChangeWeeks}
            addonAfter="Weeks (Max. 26)"
            value={weekNumber || 0}
          />
        </Space.Compact>
      </div>
      <div className="flex flex-row align-items-center gap-1">
        <Select
          options={[
            { value: "BC", label: "BC" },
            { value: "AB", label: "AB" },
          ]}
          onChange={setBranch}
          value={branch}
          style={{
            borderRadius: "0 5px 5px 0",
            backgroundColor: "#F5F5F5",
            flexGrow: 1,
          }}
        />
      </div>
      <div className="flex flex-row align-items-center gap-1">
        <Button
          className="border-blue-500"
          type="outline"
          onClick={handleRender}
        >
          Show result
        </Button>
        <Button
          className="border-blue-500"
          type="outline"
          onClick={handleDownload}
        >
          Export excel
        </Button>
      </div>

      <Modal
        open={!!renderTable}
        onCancel={() => setRenderTable("")}
        footer={null}
        style={{ top: 0, height: "100vh" }}
        width="100%"
      >
        <div dangerouslySetInnerHTML={{ __html: renderTable || "" }} />
        <hr />
        <div className="flex flex-row align-items-center w-100 mt-2">
          <Button
            className="border-blue-500"
            type="outline"
            onClick={() => setRenderTable("")}
          >
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
}
