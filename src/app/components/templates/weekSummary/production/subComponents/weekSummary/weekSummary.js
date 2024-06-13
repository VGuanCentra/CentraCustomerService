import React, { useEffect, useState, useCallback } from "react";
import styles from "./weekSummary.module.css";

import moment from 'moment';
import WeekTable from "./../weekTable/weekTable";
import { generateDaySummaryData } from "app/utils/utils";

export default function WeekSummary(props) {
  const {
    data,
    setWeekTotals,
    setPropertyLabels,
    weekSummaryData,
    setWeekSummaryData
  } = props;

  const [windowsData, setWindowsData] = useState([]);
  const [casementWindowsData, setCasementWindowsData] = useState([]);
  const [sliderWindowsData, setSliderWindowsData] = useState([]);
  const [hybridWindowsData, setHybridWindowsData] = useState([]);
  const [vinylDoorsData, setVinylDoorsData] = useState([]);
  const [patioDoorsData, setPatioDoorsData] = useState([]);
  const [glassData, setGlassData] = useState([]);
  const [exteriorDoorsData, setExteriorDoorsData] = useState([]);
  const [boxesData, setBoxesData] = useState([]);
  const [rushOrdersData, setRushOrdersData] = useState([]);

  const [totals, setTotals] = useState({
    windows: 0,
    vinylDoors: 0,
    patioDoors: 0,
    glass: 0,
    exteriorDoors: 0
  });

  useEffect(() => {
    if (data?.length > 0) {
      let _weekSummaryData = [];
      let weekDates = [];
      for (let i = 0; i < data.length; i++) {
        let _daySummaryData = generateDaySummaryData(data[i].workOrders);
        _weekSummaryData.push(_daySummaryData);
        weekDates.push(data[i].date);
      }
      setWeekSummaryData(_weekSummaryData);
    }
  }, [data, setWeekSummaryData]);

  const generateTableData = useCallback((sortOrder) => {
    let items = [];
    for (let i = 0; i < sortOrder.length; i++) {
      let _values = [];
      let rowTotal = 0;

      for (let j = 0; j < weekSummaryData.length; j++) {
        let dayValue = weekSummaryData[j] ? weekSummaryData[j][sortOrder[i]?.key] : 0;
        let value = { key: j, value: dayValue }
        rowTotal += parseInt(dayValue, 10);
        _values.push(value);
      }

      let item = {
        key: sortOrder[i].key,
        label: sortOrder[i].value,
        total: rowTotal,
        values: [..._values]
      }

      items.push(item);
    }

    return items;

  }, [weekSummaryData]);

  useEffect(() => {
    if (weekSummaryData?.length > 0) {
      
      let windowsOrder = [
        { key: "casementWindows", value: "Casement Windows" },
        { key: "f26CA", value: "26CA" },
        { key: "f26HY", value: "26HY" },
        { key: "f29CA", value: "29CA" },
        { key: "f29CM", value: "29CM" },
        { key: "f68SL", value: "68SL" },
        { key: "f68VS", value: "68VS" },
        { key: "casements", value: "Casements" },
        { key: "casementsMin", value: "Casements Minutes" },
        { key: "sliders", value: "Sliders" },
        { key: "slidersMin", value: "Slider Minutes" }
      ];      

      let casementWindowsOrder = [
        { key: "casementWindows", value: "Casement Windows" },
        { key: "f26CA", value: "26CA" },        
        { key: "f29CA", value: "29CA" },
        { key: "f29CM", value: "29CM" },
        { key: "casementsMin", value: "Casement Minutes" },
      ];

      let sliderWindowsOrder = [
        { key: "sliderWindows", value: "Slider Windows" },
        { key: "f68SL", value: "68SL" },
        { key: "f68VS", value: "68VS" },
        { key: "slidersMin", value: "Slider Minutes" }
      ];

      let hybridWindowsOrder = [
        { key: "hybridWindows", value: "Hybrid Windows" },
        { key: "f26HY", value: "26HY" },
        { key: "f26HYMin", value: "Hybrid Minutes" },
      ];

      let vinylDoorsOrder = [
        { key: "vinylDoors", value: "Vinyl Doors" },
        { key: "f27DS", value: "27DS" },
        { key: "f61DR", value: "61DR" },        
        { key: "vinylDoorsMin", value: "Vinyl Door Minutes" }
      ];

      let patioDoorsOrder = [
        { key: "f52PD", value: "Patio Doors" },
        { key: "f52PDMin", value: "Patio Door Minutes" }
      ];

      let glassOrder = [
        { key: "glass", value: "Glass" },
        { key: "pfg", value: "PFG" },
        { key: "cardinal", value: "Cardinal" },
        { key: "glassFab", value: "Centra Calgary" }
      ];

      let exteriorDoorsOrder = [
        { key: "exteriorDoors", value: "Exterior Doors" }
      ];

      let boxesOrder = [
        { key: "boxes", value: "Total Boxes" }
      ];

      let rushOrder = [
        { key: "rush", value: "Rush Orders" },
        { key: "availableStaff", value: "Available Staff" },
        { key: "availableTime", value: "Available Time" },
        { key: "min", value: "Min" },
        { key: "max", value: "Max" }
      ];

      let _propertyLabels = [
        ...casementWindowsOrder,
        ...sliderWindowsOrder,
        ...hybridWindowsOrder,
        //...windowsOrder,
        ...vinylDoorsOrder,
        ...patioDoorsOrder,
        ...glassOrder,
        ...exteriorDoorsOrder,
        ...boxesOrder,
        ...rushOrder
      ];

      setWindowsData(generateTableData(windowsOrder));
      setCasementWindowsData(generateTableData(casementWindowsOrder));
      setSliderWindowsData(generateTableData(sliderWindowsOrder));
      setHybridWindowsData(generateTableData(hybridWindowsOrder));
      setVinylDoorsData(generateTableData(vinylDoorsOrder));
      setPatioDoorsData(generateTableData(patioDoorsOrder));
      setGlassData(generateTableData(glassOrder));
      setExteriorDoorsData(generateTableData(exteriorDoorsOrder));
      setBoxesData(generateTableData(boxesOrder));
      setRushOrdersData(generateTableData(rushOrder));
      setPropertyLabels(_propertyLabels);
    }
  }, [weekSummaryData, generateTableData, setPropertyLabels]);

  useEffect(() => {
    if (vinylDoorsData[0] && patioDoorsData[0] && exteriorDoorsData[0]) {
      setTotals({
        windows: windowsData[0]?.total,
        vinylDoors: vinylDoorsData[0]?.total,
        patioDoors: patioDoorsData[0]?.total,
        exteriorDoors: exteriorDoorsData[0]?.total
      })
    }
  }, [windowsData, vinylDoorsData, patioDoorsData, exteriorDoorsData]);

  useEffect(() => {
    setWeekTotals(totals);
  }, [totals, setWeekTotals])

  return (
    <table style={{ width: '100% !important', minWidth: '100%', marginTop: "1rem", paddingBottom: 0, color: "#000" }}>
      <thead>
        <tr className="sticky top-[-12px] bg-[#FAF9F6]">
          <td style={{ fontSize: "0.75rem", lineHeight: "0.7rem" }} className="text-center border border-blue-500"></td>
          {data?.map((d, index) => {
            return (<td key={`week-label-${index}`} className={`${styles.dateHeader} text-center border border-blue-500`} style={{ fontSize: "0.75rem", lineHeight: "1.5rem" }}>{moment(d.date)?.format("ddd MM/DD")}</td>)
          })}
          <td style={{ fontSize: "0.75rem", lineHeight: "0.7rem", width: "1.5rem" }}  className={`${styles.dateHeader} text-center border border-blue-200`}>Total</td>
        </tr>
      </thead>
      <tbody>
        {false && <WeekTable data={windowsData} />}
        <WeekTable data={casementWindowsData} />
        <WeekTable data={sliderWindowsData} />
        <WeekTable data={hybridWindowsData} />
        <WeekTable data={vinylDoorsData} />
        <WeekTable data={patioDoorsData} />
        <WeekTable data={glassData} />
        <WeekTable data={exteriorDoorsData} />
        <WeekTable data={boxesData} />
        <WeekTable data={rushOrdersData} />
      </tbody>
    </table>
  );
}
