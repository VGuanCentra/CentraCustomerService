"use client";
import React, { useState, Fragment } from "react";
import styles from './weekTable.module.css';

export default function WeekTable(props) {
  const { data } = props;
  const [showBody] = useState(true);

  return (
    <>
      {showBody && data.map((rowData, index) => {
        return (
          <Fragment key={`${rowData.key}-${index}`}>
            {index === 0 &&
              <tr className={`${styles.header} text-center`}>{/* Header */}
                <td style={{ fontSize: "0.75rem", lineHeight: "0.7rem", width: "11rem" }} className="border border-blue-200">
                  {rowData?.label}
                </td>
                {rowData?.values?.map((subItem) => {
                  return (<td key={`${subItem?.key}`} className="font-normal text-center border border-blue-200" style={{ fontSize: "0.75rem", lineHeight: "0.7rem" }}>{subItem?.value}</td>)
                })}
                <td className="text-blue-600 text-center border border-blue-200" style={{ fontSize: "0.75rem", lineHeight: "0.7rem" }}>{rowData.total}</td>
              </tr>
            }

            {index > 0 &&
              <tr key={rowData?.key}>
                <td className="text-center border border-blue-200" style={{ fontSize: "0.75rem", lineHeight: "0.7rem" }}>{rowData?.label}</td>
                {rowData?.values?.map((rowDataItem) => { /* Render columns */
                  return (<td key={`${rowDataItem?.key}`} className="text-center border border-blue-200" style={{ fontSize: "0.75rem", lineHeight: "0.7rem" }}>{rowDataItem?.value}</td>)
                })}
                <td className="text-blue-600 text-center border border-blue-200" style={{ fontSize: "0.75rem", lineHeight: "0.7rem" }}>{rowData?.total}</td>
              </tr>
            }
          </Fragment>
        )
      })}
    </>
  );
}
