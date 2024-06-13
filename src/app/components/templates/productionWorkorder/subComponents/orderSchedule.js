"use client";
import styles from '../productionWorkorder.module.css';
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
      style={{ minWidth: isSearchView ? "15rem" : "21rem", height: "100%" }}
      contentStyle={{
        padding: "0.5rem",
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gridTemplateColumns: "3fr 3fr"
      }}
      className={styles.groupSchedule}
    >
      <DateItem
        label={"Production Start"}
        name={"productionStartDate"}
        value={inputData?.productionStartDate}
        onChange={handleInputChange}
        changeItems={dateChangeItems}
        style={{ color: "var(--centrablue)" }}
      />
      <DateItem
        label={"Production End"}
        name={"productionEndDate"}
        value={inputData?.productionEndDate}
        onChange={handleInputChange}
        changeItems={dateChangeItems}
        style={{ color: "var(--centrablue)" }}
      />
      <LabelItem label={"Shipping Date"} value={inputData?.shippingDate} type={"Date"} />
      <LabelItem label={"Customer Date"} value={inputData?.deliveryDate} type={"Date"} /> {/* Logistics requested this to be Customer Date but still represents delivery date */}
      <LabelItem label={"Revised Delivery Date"} name={"Revised Delivery Date"} value={YMDDateFormat(inputData?.revisedDeliveryDate)} type={"Date"} />
      <LabelItem label={"Installation Date"} value={YMDDateFormat(inputData?.scheduledDate)} type={"Date"} />
    </Group>
  )
}