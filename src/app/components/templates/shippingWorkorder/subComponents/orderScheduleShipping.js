"use client";
import styles from 'app/components/templates/productionWorkorder/productionWorkorder.module.css';
import React from "react";

import Group from "app/components/atoms/workorderComponents/group";
import LabelItem from "app/components/atoms/workorderComponents/labelItem";
import DateItem from "app/components/atoms/workorderComponents/dateItem";

import { YMDDateFormat } from "app/utils/utils";

export default function OrderSummary(props) {
  const {
    inputData,
    handleInputChange,
    dateChangeItems,
    isSearchView
  } = props;

  return (
    <Group
      title={"Schedule"}
      style={{ minWidth: isSearchView ? "15rem" : "21rem" }}
      contentStyle={{
        padding: "0.5rem",
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gridTemplateColumns: "3fr 3fr"
      }}
      className={styles.groupSchedule}
    >
      <DateItem
        label={"Shipping Date"}
        name={"shippingDate"}
        value={inputData?.shippingDate}
        onChange={handleInputChange}
        changeItems={dateChangeItems}
        style={{ color: "var(--centrablue)" }}
      />

      <DateItem
        label={"Delivery Date"}
        name={"deliveryDate"}
        value={inputData?.deliveryDate}
        onChange={handleInputChange}
        changeItems={dateChangeItems}
        style={{ color: "var(--centrablue)" }}
      />

      <DateItem
        label={"Revised Delivery Date"}
        name={"revisedDeliveryDate"}
        value={inputData?.revisedDeliveryDate}
        onChange={handleInputChange}
        changeItems={dateChangeItems}
        style={{ color: "var(--centrablue)" }}
      />

      <LabelItem label={"Production Start"} value={inputData?.productionStartDate} type={"Date"} className="pt-1" />
      <LabelItem label={"Production End"} value={inputData?.productionEndDate} type={"Date"} />            
      <LabelItem label={"Installation Date"} value={YMDDateFormat(inputData?.scheduledDate)} type={"Date"} />
    </Group>
  )
}