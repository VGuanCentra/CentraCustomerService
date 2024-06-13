"use client";
import React from "react";
import { useSelector } from "react-redux";
import styles from "./orderSidebar.module.css";

import OrdersMenu from "app/components/atoms/orderManagementComponents/ordersMenu/ordersMenu";

export default function OrderSidebar(props) {
  const { style } = props;

  const { ordersSideBarOpen } = useSelector((state) => state.orders);

  return (
    <div
      style={{ ...style }}
      className={`${
        ordersSideBarOpen ? styles.root : ""
      } flex-col justify-between overflow-auto`}
    >
      <div>
        <div style={{ paddingTop: "1rem" }}>
          <OrdersMenu />
        </div>
      </div>
    </div>
  );
}
