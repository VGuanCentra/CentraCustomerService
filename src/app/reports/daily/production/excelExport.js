"use client"
import React, { useState, useEffect, useMemo } from "react";
// import ReactExport from 'react-data-export';

// const ExcelFile = ReactExport.ExcelFile;
// const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

import { Button } from "antd";

import { YMDDateFormat } from "app/utils/utils";

export default function ExcelExport(props) {
    const { data, date } = props;
    const [cardinalDataSet, setCardinalDataSet] = useState([]);
    const [pfgDataSet, setPfgDataSet] = useState([]);
    const [centraDataSet, setCentraDataSet] = useState([]);

    const setDataSetTitle = (title) => {
        return ([{
            ySteps: 1,
            columns: [
                { title: title, style: { font: { sz: "10", bold: true } } },

            ],
            data: [
                [{ value: " ", style: { font: { sz: "10" } } }],
            ],
        }])   
    }

    const columns = useMemo(() => [
        { title: "BLOCK", width: { wpx: 50 }, style: { font: { sz: "10", bold: true } } },
        { title: "BATCH", width: { wpx: 100 }, style: { font: { sz: "10", bold: true } } },
        { title: "W/O", width: { wpx: 90 }, style: { font: { sz: "10", bold: true } } },
        { title: "BRANCH", width: { wpx: 90 }, style: { font: { sz: "10", bold: true } } },
        { title: "PROD.MIX", width: { wpx: 90 }, style: { font: { sz: "10", bold: true } } },
        { title: "6800", width: { wpx: 40 }, style: { font: { sz: "10", bold: true } } },
        { title: "2900", width: { wpx: 40 }, style: { font: { sz: "10", bold: true } } },
        { title: "2600", width: { wpx: 40 }, style: { font: { sz: "10", bold: true } } },
        { title: "5200", width: { wpx: 40 }, style: { font: { sz: "10", bold: true } } },
        { title: "2700", width: { wpx: 40 }, style: { font: { sz: "10", bold: true } } },
        { title: "6100", width: { wpx: 40 }, style: { font: { sz: "10", bold: true } } },
        { title: "SHAPE", width: { wpx: 40 }, style: { font: { sz: "10", bold: true } } },
        { title: "MIN", width: { wpx: 50 }, style: { font: { sz: "10", bold: true } } },
        { title: "NOTES", width: { wpx: 250 }, style: { font: { sz: "10", bold: true } } },
        { title: "DEL", style: { font: { sz: "10", bold: true } } }
    ], []);

    const generateExcelDataSet = (data) => {
        let result = [];

        if (data?.length > 0) {
            result = data.map((d) => {
                return [
                    { value: d.block, style: { font: { sz: "10" } } },
                    { value: d.batch, style: { font: { sz: "10" } } },
                    { value: d.won, style: { font: { sz: "10" } } },
                    { value: d.branch, style: { font: { sz: "10" } } },
                    { value: d.prodMix, style: { font: { sz: "10" } } },
                    { value: d.f6800, style: { font: { sz: "10" } } },
                    { value: d.f2900, style: { font: { sz: "10" } } },
                    { value: d.f2600, style: { font: { sz: "10" } } },
                    { value: d.f5200, style: { font: { sz: "10" } } },
                    { value: d.f2700, style: { font: { sz: "10" } } },
                    { value: d.f6100, style: { font: { sz: "10" } } },
                    { value: d.shape, style: { font: { sz: "10" } } },
                    { value: d.min, style: { font: { sz: "10" } } },
                    { value: d.notes, style: { font: { sz: "10" }, alignment: { wrapText: true, horizontal: 'left', vertical: 'top' } } },
                    { value: d.del, style: { font: { sz: "10" } } },
                ]
            })
        }

        return result;
    }

    useEffect(() => {        
        let _cardinalDataSet = generateExcelDataSet(data.cardinal);
        let _pfgDataSet = generateExcelDataSet(data.pfg);
        let _centraDataSet = generateExcelDataSet(data.centra);

        setCardinalDataSet([{
            columns: columns,
            data: _cardinalDataSet
        }]);

        setPfgDataSet([{
            columns: columns,
            data: _pfgDataSet
        }]);

        setCentraDataSet([{
            columns: columns,
            data: _centraDataSet
        }]);

    }, [data, columns]);

    return (
      <div>
        <div>Deleted By VGuan 2024-06-13 </div>
        {/* <ExcelFile
                element={
                    <Button
                        type={"primary"}
                        disabled={(!data?.cardinal && !data?.pfg && !data?.centra)}
                    >
                        <i className="fa-solid fa-file-export pr-2"></i>
                        <span>Export</span>
                    </Button>
                }

                filename={`Daily_Production_Sched-${YMDDateFormat(date)}`}
            >
                <ExcelSheet dataSet={[
                        ...setDataSetTitle("Centra Calgary"),
                        ...centraDataSet,
                        ...setDataSetTitle("PFG Orders"),
                        ...pfgDataSet,
                        ...setDataSetTitle("Cardinal Orders"),
                        ...cardinalDataSet,                        
                    ]} name="Centra"
                />                
            </ExcelFile> */}
      </div>
    );
}
