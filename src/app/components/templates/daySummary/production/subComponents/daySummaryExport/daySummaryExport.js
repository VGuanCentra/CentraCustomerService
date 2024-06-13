"use client"
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
// import ReactExport from 'react-data-export';

// const ExcelFile = ReactExport.ExcelFile;
// const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

import { Button } from "antd";

import moment from "moment";

import { dynamicSort, YMDDateFormat, generateRow } from "app/utils/utils";
import { ManufacturingFacilities } from "app/utils/constants";

export default function DaySummaryExport(props) {
  const { date, style, canExport } = props;

  const [tableHeader, setTableHeader] = useState([]);
  const [pfgOrders, setPfgOrders] = useState([]);
  const [calgaryOrders, setCalgaryOrders] = useState([]);
  const [cardinalOrders, setCardinalOrders] = useState([]);
  const [dataSet, setDataSet] = useState([]);

  const { filteredDayWorkOrders, branch } = useSelector((state) => state.calendar);

  const Index6800 = 5;
  const Index2900 = 6;
  const Index2600 = 7;
  const Index5200 = 8;
  const Index6100 = 9;
  const IndexHybridWindows = 10;
  const IndexExteriorDoors = 11;
  const IndexShape = 12;

  const GlassCompanies = useMemo(() => {
    return ({
      centraCalgary: "Centra Calgary",
      pfg: "PFG",
      cardinal: "Cardinal"
    })
  }, []);

  // Build Columns
  useEffect(() => {
    const columns = [
      { key: "blockNo", label: "Block", width: 60 },
      { key: "batchNo", label: "Batch", width: 120 },
      { key: "workOrderNumber", label: "WO#", width: 80 },
      { key: "branch", label: "Branch", width: 80 },
      { key: "prodMix", label: "Prod.Mix", width: 100 },
      { key: "f6800", label: "6800", width: 35 },
      { key: "f2900", label: "2900", width: 35 },
      { key: "f2600", label: "2600", width: 35 },
      { key: "f5200", label: "5200", width: 35 },
      { key: "f6100", label: "6100", width: 35 },
      { key: "hybridWindows", label: "HybridWin", width: 60 },
      { key: "exteriorDoors", label: "ExtDoor", width: 50 },
      { key: "shape", label: "Shape", width: 35 },
      { key: "min", label: "Min", width: 40 },
      { key: "notes", label: "Notes", width: 200 },      
      { key: "shippingDate", label: "Shipping Date", width: 90 },
      { key: "deliveryDate", label: "Customer Date", width: 90 },
    ];

    let _tableHeader = columns?.map(d => {
      return (
        {
          title: d.label,
          style: {
            font: { sz: "10", bold: true },
            alignment: { horizontal: "center" }
          },
          width: { wpx: d.width }

        }
      )
    });

    setTableHeader(_tableHeader);
  }, []);

  const buildValue = (val) => {
    return { value: val, style: { font: { sz: "10", bold: false }, alignment: { wrapText: true, horizontal: "center" } } }
  }

  // Build Rows
  const buildOrderRows = useCallback((data, company) => {
    let _data = [];

    const generateProdMixLabel = (d) => {
      let result = "";
      let nonHybridWindowsTotal = parseInt(d.f68CA, 10) + parseInt(d.f68SL, 10) + parseInt(d.f68VS, 10) + parseInt(d.f29CA, 10) + parseInt(d.f29CM, 10) + parseInt(d.f6CA, 10) + parseInt(d.f61DR, 10)
      if (d) {
        if (parseInt(nonHybridWindowsTotal, 10) > 0) {
          result += `W:${nonHybridWindowsTotal} `;
        }

        if (parseInt(d.f26HY, 10) > 0) {
          result += `HW:${d.f26HY} `;
        }

        if (parseInt(d.doors, 10) > 0) {
          result += `ED:${d.doors} `;
        }

        if (parseInt(d.numberOfPatioDoors, 10) > 0) {
          result += `PD:${d.numberOfPatioDoors} `;
        }
      }
      return result;
    }

    if (data?.length > 0) {
      data.forEach((d) => {
        let order = [];

        order.push(buildValue(d.blockNo));
        order.push(buildValue(d.batchNo));
        order.push(buildValue(d.workOrderNumber));
        order.push(buildValue(`${d.branch}-${d.jobType}`));
        order.push(buildValue(generateProdMixLabel(d))); // Prod mix
        order.push(buildValue(parseInt(d.f68CA, 10) + parseInt(d.f68SL, 10) + parseInt(d.f68VS, 10))); // f6800
        order.push(buildValue(parseInt(d.f29CA, 10) + parseInt(d.f29CM, 10))); //f2900
        order.push(buildValue(parseInt(d.f6CA, 10))); // f2600
        order.push(buildValue(parseInt(d.f52PD, 10))); // f5200
        order.push(buildValue(parseInt(d.f61DR, 10))); // f6100 
        order.push(buildValue(parseInt(d.f26HY, 10))); // Hybrid
        order.push(buildValue(parseInt(d.doors, 10))); // Ext Doors
        order.push(buildValue(0)); // TODO: Follow-up what this value is
        order.push(buildValue(parseInt(d.f26CAMin, 10) + parseInt(d.f27DSMin, 10) + parseInt(d.f29CAMin, 10) + parseInt(d.f29CMMin, 10) + parseInt(d.f52PDMin, 10) + parseInt(d.f61DRMin, 10) + parseInt(d.f68SLMin, 10) + parseInt(d.f68VSMin, 10) + parseInt(d.f26HYMin, 10))); // min
        order.push(buildValue(d.officeNotes)); // notes 
        order.push(buildValue(YMDDateFormat(d.shippingDate)));
        order.push(buildValue(YMDDateFormat(d.deliveryDate))); // Customer Date         

        if (
          (order[Index6800].value +
            order[Index2900].value +
            order[Index2600].value +
            order[Index5200].value +
            order[IndexHybridWindows].value +
            order[IndexExteriorDoors].value +
            order[Index6100].value +
            order[IndexShape].value)
          > 0 || company === GlassCompanies.centraCalgary) { // Show Calgary orders regardless if total product count is zero
          _data.push(order);
        }
      });
    }

    return _data;
  }, [GlassCompanies.centraCalgary]);

  useEffect(() => {
    if (filteredDayWorkOrders?.length > 0) {
      // Group work orders by glass supplier
      const groupedByGlassSupplier = Object.groupBy(filteredDayWorkOrders, ({ glassSupplier }) => glassSupplier);

      // Destructure 
      const calgaryOrdersRaw = groupedByGlassSupplier[GlassCompanies.centraCalgary]?.sort(dynamicSort("workOrderNumber"));
      const pfgOrdersRaw = groupedByGlassSupplier[GlassCompanies.pfg]?.sort(dynamicSort("workOrderNumber"));
      const cardinalOrdersRaw = groupedByGlassSupplier[GlassCompanies.cardinal]?.sort(dynamicSort("workOrderNumber"))

      if (calgaryOrdersRaw?.length > 0) {
        setCalgaryOrders(buildOrderRows(calgaryOrdersRaw, GlassCompanies.centraCalgary))
      }

      if (pfgOrdersRaw?.length > 0) {
        setPfgOrders(buildOrderRows(pfgOrdersRaw, GlassCompanies.pfg))
      }

      if (cardinalOrdersRaw?.length > 0) {
        setCardinalOrders(buildOrderRows(cardinalOrdersRaw, GlassCompanies.cardinal))
      }
    }
  }, [filteredDayWorkOrders, buildOrderRows, GlassCompanies]);

  // Compare filtered branch with branch the glass company is associated to 
  const willAddListToReport = useCallback((_branch) => {
    let result = false;

    if (branch) {
      if (branch === ManufacturingFacilities.all || branch === _branch) {
        result = true;
      }
    }

    return result;
  }, [branch]);

  // Build complete excel sheet data
  useEffect(() => {
    let _dataSet = [];

    _dataSet.push(...generateRow(`Daily Production Schedule - ${branch} (${moment(date).format("YYYY-MM-DD")})`));

    if (calgaryOrders?.length > 0) {
      _dataSet.push(...generateRow(""));
      _dataSet.push(...generateRow(`*** CENTRA CALGARY ORDERS ***`, "CC0000")); // Each row is an array of column values
      _dataSet.push(...[{ columns: tableHeader, data: calgaryOrders }]);
    }

    if (pfgOrders?.length > 0) {
      _dataSet.push(...generateRow(""));
      _dataSet.push(...generateRow(`*** PFG ORDERS ***`, "CC0000"));
      _dataSet.push(...[{ columns: tableHeader, data: pfgOrders }]);
    }

    if (cardinalOrders?.length > 0) {
      _dataSet.push(...generateRow(""));
      _dataSet.push(...generateRow(`*** CARDINAL ORDERS ***`, "CC0000"));
      _dataSet.push(...[{ columns: tableHeader, data: cardinalOrders }]);
    }

    setDataSet(_dataSet);

  }, [date, tableHeader, calgaryOrders, pfgOrders, cardinalOrders, willAddListToReport, branch]);

  return (
    <span style={{ ...style }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
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
        filename={`Daily Production Schedule - ${branch} (${moment(date).format("YYYY-MM-DD")})`}
      >
        <ExcelSheet
          dataSet={dataSet}
          name={`Daily Production Schedule - ${branch} (${moment(date).format("YYYY-MM-DD")})`}>
        </ExcelSheet>
      </ExcelFile> */}

    </span>
  );
}
