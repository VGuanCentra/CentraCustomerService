"use client";
import React, { useState, useId, Fragment } from "react";
import styles from "./weekTable.module.css";
import { DataTypes } from "app/utils/constants";

export default function WeekTable(props) {
  const { data } = props;
  const [showBody, setShowBody] = useState(true);

  return (
    <>
      {showBody &&
        data.map((rowData, index) => {
          return (
            <Fragment key={`${rowData.key}-${index}`}>
              {index === 0 && (
                <tr className={`${styles.header}`}>
                  <td>{rowData?.label}</td>
                  {rowData?.values?.map((subItem) => {
                    return (
                      <td key={`${subItem?.key}`} className="font-normal">
                        <>{subItem?.value}</>
                      </td>
                    );
                  })}
                  <td className="text-blue-600">{rowData.total}</td>
                </tr>
              )}

              {index > 0 && (
                <tr key={rowData?.key}>
                  <td>{rowData?.label}</td>
                  {rowData?.values?.map((rowDataItem) => {
                    /* Render columns */
                    return (
                      <td key={`${rowDataItem?.key}`} className="font-normal">
                        {rowData?.type === DataTypes.currency ? (
                          <>{`$ ${Number(rowDataItem?.value)
                            ?.toFixed(2)
                            ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}</>
                        ) : (
                          <>{Number(rowDataItem?.value)?.toLocaleString()}</>
                        )}
                      </td>
                    );
                  })}
                  <td className="text-blue-600">
                    {rowData?.type === DataTypes.currency ? (
                      <>{`$ ${Number(rowData?.total)
                        ?.toFixed(2)
                        ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}</>
                    ) : (
                      <>{Number(rowData?.total)?.toLocaleString()}</>
                    )}
                  </td>
                </tr>
              )}
            </Fragment>
          );
        })}
    </>
  );
}
