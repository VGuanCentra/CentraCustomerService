"use client";
import styles from "./timesheetHeader.module.css";
import React, { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  updateShowMessage,
} from "app/redux/orders";

import Tooltip from "app/components/atoms/tooltip/tooltip";

import { Select, Space, Button } from "antd";

export default function TimesheetHeader(props) {
  const {
    refetch,
    periodSelectionOptions,
    selectedPeriod,
    setSelectedPeriod,
    defaultPayPeriodActionItemId,
    newTimesheetClick
  } = props;

  const { isMobile } = useSelector((state) => state.app);

  const dispatch = useDispatch();

  const handleForceRefresh = useCallback(() => {
    if (refetch) {
      dispatch(
        updateShowMessage({ value: true, message: "Refreshing data..." })
      );
      refetch();
      setTimeout(() => dispatch(updateShowMessage({ value: false })), 1000);
    }
  }, [dispatch, refetch]);

  useEffect(() => {
    if (!selectedPeriod && defaultPayPeriodActionItemId) {
      setSelectedPeriod(defaultPayPeriodActionItemId);
    }
  }, [selectedPeriod, defaultPayPeriodActionItemId, setSelectedPeriod])

  return (
    <span className="w-100 pb-3 flex flex-row justify-start">
      <div className={`flex flex-row ${isMobile ? "justify-center pt-2" : ""}`}>
      </div>
      <div className="w-100">
        <div className="flex flex-row justify-between">
          <Button
            type="primary"
            onClick={newTimesheetClick}
          >
            New Timesheet
          </Button>
          <div className="flex">
            <div className="mr-4 mt-2">
              <Tooltip title="Refresh Data">
                <i
                  className="fa-solid fa-arrows-rotate text-gray-500 hover:text-blue-500 hover:cursor-pointer"
                  onClick={handleForceRefresh}
                />
              </Tooltip>
            </div>
            <div
              className="flex flex-row bg-white pl-2"
              style={{ borderRadius: "4px" }}
            >
              <Space.Compact>
                <div className="flex gap-2 items-center">
                  <div className="">
                    <i className="fa-solid fa-user-clock text-centraBlue" />
                  </div>
                  <span className="text-sm text-bold pr-2" style={{ borderRight: "1px solid lightgrey" }}>
                    My Timesheets
                  </span>
                </div>
                <Select
                  value={selectedPeriod}
                  bordered={false}
                  style={{ width: 220 }}
                  options={[{value: "all", label: "All Pay Periods"}, ...periodSelectionOptions]}
                  onChange={(val) => { setSelectedPeriod(val) }}
                />
              </Space.Compact>
            </div>
          </div>
          <div>
          </div>
        </div>
      </div>
    </span>
  );
}
