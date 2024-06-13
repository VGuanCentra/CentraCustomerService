"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./sidebar.module.css";

import Menu from "./menu/menu";
import Select from "app/components/atoms/select/select";

import { CalendarTypes, AppModes } from "app/utils/constants";

import { updateDepartment } from "app/redux/calendar";

import Image from "next/image";
import OrdersMenu from "app/components/atoms/orderManagementComponents/ordersMenu/ordersMenu";

export default function Sidebar(props) {
  const { style } = props;
  const dispatch = useDispatch();

  const { appMode } = useSelector((state) => state.app);

  return (
    <div style={{ ...style }} className={`${styles.root}`}>
      <div>
        {false && <hr style={{ marginBottom: "22px" }} />}
        <div style={{ paddingTop: "1rem" }}>
          {appMode === AppModes.calendar && <Menu />}
        </div>
      </div>
      {false && (
        <div>
          <div className={`${styles.selectOuterContainer}`}>
            <div className={styles.calendarTypeSelectionContainer}>
              <div style={{ paddingBottom: "1rem" }}>Department</div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <Select
                  initialValue={calendarType?.value}
                  options={CalendarTypes}
                  ariaLabel={"calendar-type-selection"}
                  onChange={(newVal) => {
                    let _calendarType = CalendarTypes.find(
                      (c) => c.value === newVal
                    );
                    setCalendarType(_calendarType);
                    dispatch(updateDepartment(_calendarType));
                  }}
                  style={{
                    borderRadius:
                      calendarType?.type === "multi" ? "5px 0 0 5px" : "5px",
                  }}
                />
                {calendarType?.type === "multi" && (
                  <Select
                    options={calendarType?.options}
                    ariaLabel={"subCalendar-type-selection"}
                    onChange={() => {}}
                    style={{
                      width: "9rem",
                      borderRadius: "0 5px 5px 0",
                      backgroundColor: "#F5F5F5",
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          <div style={{ height: "1.7rem" }}></div>
        </div>
      )}
    </div>
  );
}
