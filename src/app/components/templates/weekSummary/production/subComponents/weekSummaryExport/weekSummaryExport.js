"use client"
import React, { useState, useEffect, useMemo, useCallback } from "react";
// import ReactExport from 'react-data-export';

// const ExcelFile = ReactExport.ExcelFile;
// const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

import { generateRow } from "app/utils/utils";

import { Button } from "antd";

import moment from "moment";

export default function WeekSummaryExport(props) {
  const { data, propertyLabels, canExport } = props;
  const { summary, dates } = data;

  const [header, setHeader] = useState([]);
  const [rows, setRows] = useState([]);

  let propertyOrder = useMemo(() => [
    "windows",
    "f29CA",
    "f29CM",
    "f68SL",
    "f68VS",
    "casements",
    "casementsMin",
    "sliders",
    "slidersMin",
    "vinylDoors",
    "f27DS",
    "f61DR",
    "vinylDoorsMin",
    "f52PD",
    "f52PDMin",
    "glass",
    "pfg",
    "cardinal",
    "glassFab",
    "exteriorDoors",
    "boxes",
    "rush",
    "availableStaff",
    "availableTime",
    "min",
    "max"
  ], []);

  const generateTitle = useCallback(() => {
    let result = "";

    if (dates?.length === 7) {
      result = `Week #${moment(dates[0]).week()} Summary (${moment(dates[0]).format("YYYY-MM-DD")} to ${moment(dates[6]).format("YYYY-MM-DD")})`;
    }

    return result;
  }, [dates]);

  useEffect(() => {
    let grouping = [
      "windows",
      "vinylDoors",
      "f52PD",
      "glass",
      "exteriorDoors",
      "boxes",
      "rush"
    ];

    if (dates?.length > 0) {
      let _header = dates?.map(d => {
        return (
          {
            title: moment(d).format("ddd MM/DD"),
            style: { font: { sz: "10", bold: true } }
          }
        )
      });

      // left spacer
      _header.unshift({
        title: "",
        style: { font: { sz: "10", bold: true } }
      });

      _header.push({
        title: "Total",
        style: { font: { sz: "10", bold: true } }
      });

      setHeader(_header);

      // Build body
      let _rows = [];

      propertyOrder.forEach(po => {
        let colData = [];
        let groupHeader = grouping.find(x => x === po)

        // Row Label
        colData.push({
          value: propertyLabels.find(x => x.key === po)?.value || "",
          style: {
            font: {
              sz: "10",
              bold: true
            }, fill: groupHeader ? {
              patternType: "solid",
              fgColor: { rgb: "F5F5F5" }
            } : {
              patternType: "none"
            }
          }
        });

        // Data
        let total = 0;

        summary.forEach(s => {
          let val = s ? s[po] : 0;
          total += val;
          colData.push({
            value: val,
            style: {
              font: { sz: "10" }, fill: groupHeader ? {
                patternType: "solid",
                fgColor: { rgb: "F5F5F5" }
              } : {
                patternType: "none"
              }
            }
          });
        });

        // Total
        colData.push({
          value: total,
          style: {
            font: { sz: "10" }, fill: groupHeader ? {
              patternType: "solid",
              fgColor: { rgb: "F5F5F5" }
            } : {
              patternType: "none"
            }
          }
        });

        _rows.push(colData);
        setRows(_rows);
      })
    }
  }, [dates, propertyOrder, propertyLabels, summary]);

  return (
    <span
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div>Deleted By VGuan 2024-06-13 </div>
      {/* <ExcelFile
        element={
          <Button
            type={"primary"}
            size={"small"}
            disabled={!canExport}
          >
            <i className="fa-solid fa-download pr-2"></i>
            <span>Export</span>
          </Button>
        }
        filename={generateTitle()}
      >
        <ExcelSheet
          dataSet={[...generateRow(generateTitle()), ...generateRow(""), ...[{ columns: header, data: rows }]]}
          name="Centra">
        </ExcelSheet>
      </ExcelFile> */}
    </span>
  );
}
