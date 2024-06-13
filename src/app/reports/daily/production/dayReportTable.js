"use client";
import React from "react";

export default function DayReportTable(props) {
    const { title, data, style } = props;

    if (data?.length > 0) {
        return (
            <div style={{ ...style }}>
                <div className="text-sm font-semibold pl-1 pb-2 text-blue-600">{`${title} Orders`}</div>
                <table className="text-xs">
                    <tr>
                        <th style={{ minWidth: "4rem" }}>Block</th>
                        <th style={{ minWidth: "10rem" }}>Batch</th>
                        <th style={{ minWidth: "7rem" }}>W/O</th>
                        <th style={{ minWidth: "7rem" }}>Branch</th>
                        <th style={{ minWidth: "7rem" }}>Prod.Mix</th>
                        <th style={{ minWidth: "3rem" }}>6800</th>
                        <th style={{ minWidth: "3rem" }}>2900</th>
                        <th style={{ minWidth: "3rem" }}>2600</th>
                        <th style={{ minWidth: "3rem" }}>5200</th>
                        <th style={{ minWidth: "3rem" }}>2700</th>
                        <th style={{ minWidth: "3rem" }}>6100</th>
                        <th style={{ minWidth: "3rem" }}>Shape</th>
                        <th style={{ minWidth: "4rem" }}>Min</th>
                        <th style={{ minWidth: "10rem" }}>Notes</th>
                    </tr>
                    {data?.map((item, index) => {
                        return (
                            <tr key={`cardinal-${index}`}>
                                <td>{item.block}</td>
                                <td>{item.batch}</td>
                                <td>{item.won}</td>
                                <td>{item.branch}</td>
                                <td>{item.prodMix}</td>
                                <td>{item.f6800}</td>
                                <td>{item.f2900}</td>
                                <td>{item.f2600}</td>
                                <td>{item.f5200}</td>
                                <td>{item.f2700}</td>
                                <td>{item.f6100}</td>
                                <td>{item.shape}</td>
                                <td>{item.min}</td>
                                <td>{item.notes}</td>
                            </tr>
                        )
                    })}
                </table>
            </div>
        )
    }        
}
