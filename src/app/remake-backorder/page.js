"use client";
import styles from "./remake-backorder.module.css";
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "next/navigation";
import { useQuery } from "react-query";

import RemakeBackorderHeader from "../remake-backorder/subComponents/remakeBackorderHeader";
import ProductionWorkOrder from "app/components/templates/productionWorkorder/productionWorkorder";
import WOSelection from "app/components/organisms/woSelection/woSelection";
import AntDatePicker from "app/components/atoms/datePicker/datePicker";

import { Space, Typography } from "antd";
const { Text } = Typography;

import moment from "moment";

import { Production } from "app/utils/constants";
import { fetchProductionWorkOrders } from "../api/productionApis";

import { updateWorkOrderData } from "../redux/calendar";
import { menuSlice } from "../redux/calendarAux";

export default function RemakeBackorder(props) {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const departmentParam = searchParams.get("department");
  const actionParam = searchParams.get("action");
  const workOrderNumberParam = searchParams.get("workOrderNumber");

  const [workOrderNumber, setWorkOrderNumber] = useState("");
  const [date, setDate] = useState(moment());

  const { branch } = useSelector((state) => state.calendar);

  const HEADER_HEIGHT_OFFSET = 140;

  const {
    isFetching,
    data: workOrders,
    refetch,
  } = useQuery(
    "workorders",
    () => {
      const daysInMonth = moment(date).daysInMonth();
      const year = moment(date).format("YYYY");
      const month = moment(date).format("M");

      if (daysInMonth && month && year) {
        if (departmentParam === Production) {
          return fetchProductionWorkOrders(
            `${year}-${month}-01T00:00:00`,
            `${year}-${month}-${daysInMonth}T23:59:59`
          );
        } else if (departmentParam === Service) {
          return fetchServiceWorkOrders(
            `${year}-${month}-01T00:00:00`,
            `${year}-${month}-${daysInMonth}T23:59:59`
          );
        }
      }
    },
    { enabled: false }
  );

  useEffect(() => {
    if (date) {
      refetch();
      setWorkOrderNumber(null);
    }
  }, [date, refetch]);

  useEffect(() => {
    if (actionParam) {
      dispatch(menuSlice.actions.updateIsLoading(false));
      setWorkOrderNumber(null);
    }
  }, [dispatch, actionParam]);

  useEffect(() => {
    if (workOrderNumberParam) {
      setWorkOrderNumber(workOrderNumberParam);
    }
  }, [workOrderNumberParam]);

  const handleSelect = useCallback(
    (value) => {
      setWorkOrderNumber(value.id);
      dispatch(updateWorkOrderData({ workOrderNumber: value.id }));
    },
    [dispatch]
  );

  const handleDateChange = (e) => {
    if (e) {
      setDate(moment(e));
    }
  };

  return (
    <div className={`pl-4 pr-4 w-100 pt-3`}>
      <RemakeBackorderHeader />
      <div
        className={`border w-full rounded bg-white pr-2 pl-2 pb-2`}
        style={{
          height: `${window.innerHeight - HEADER_HEIGHT_OFFSET}px`,
          overflow: "hidden",
          overflowY: "scroll",
        }}
      >
        <div
          className="flex flex-row justify-center pb-3 sticky z-10 bg-white pt-3"
          style={{ borderBottom: "1px dotted lightgrey", top: 0 }}
        >
          <Space.Compact>
            <AntDatePicker
              value={date}
              picker={"month"}
              onChange={handleDateChange}
              format={"MMMM YYYY"}
              style={{
                borderRadius: "5px 0 0 5px !important",
                width: "9rem",
                height: "2rem",
              }}
            />
            <WOSelection
              branch={branch}
              onChange={() => {}}
              workOrders={workOrders?.data || []}
              handleSelect={handleSelect}
              workOrderNumber={workOrderNumber}
              setWorkOrderNumber={setWorkOrderNumber}
            />
          </Space.Compact>
        </div>
        <div className="w-full pl-2 pr-2 pb-2">
          {!workOrderNumber && (
            <div
              className="flex w-100 justify-center items-center"
              style={{ height: "70vh" }}
            >
              <div className="text-sm">
                <Text type="secondary">
                  Find a work order from the selection menu above.
                </Text>
              </div>
            </div>
          )}
          {workOrderNumber && (
            <div className="pt-3">
              <ProductionWorkOrder
                viewConfig={{
                  hideCustomerInfo: true,
                  hideOrder: true,
                  hideNotes: true,
                  hideRemake: true,
                  hideBackorder: true,
                  hideGlass: true,
                  stickyHeader: false,
                  width: "75vw",
                  hideNavigation: true,
                  hideLoading: true,
                  expanded: true,
                  isSearchView: true,
                }}
                action={actionParam}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
