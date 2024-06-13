import React from "react";
import styles from "./dayTable.module.css";
import { DataTypes } from "app/utils/constants";

export default function DayTable(props) {
  const { data, valueStyle, headerValueStyle, propertyStyle } = props;

  return (
    <div className={`${styles.root} text-sm`} style={{ ...props.style }}>
      <table className={`table ${styles.table}`} style={{ marginBottom: 0 }}>
        <tbody>
          {data?.items?.map((item, index) => {
            return (
              <tr key={index} className={styles.tableRow}>
                <td
                  className={styles.tableProperty}
                  style={{ ...propertyStyle }}
                >
                  {item?.label}
                </td>
                <td className={styles.tableValue} style={{ ...valueStyle }}>
                  {item?.type === DataTypes.currency ? (
                    <>{`$ ${Number(item?.value)
                      ?.toFixed(2)
                      ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}</>
                  ) : (
                    <>
                      {item?.type == DataTypes.number
                        ? Number(item?.value)?.toLocaleString()
                        : ""}
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
