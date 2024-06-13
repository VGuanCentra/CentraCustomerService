"use client";
import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import { updateDrawerOpen } from "app/redux/app";

import { Button } from "antd";
import Tooltip from "app/components/atoms/tooltip/tooltip";
export default function CalendarHeader(props) {
  const { drawerOpen, isMobile } = useSelector((state) => state.app);
  const dispatch = useDispatch();

  const handleToggleDrawer = useCallback(
    (val) => {
      dispatch(updateDrawerOpen(val));
    },
    [dispatch]
  );

  return (
    <span className="w-100 pb-3 flex flex-row justify-start">
      <div className={`flex flex-row ${isMobile ? "justify-center pt-2" : ""}`}>
        <span className="hidden md:inline-block">
          {false &&
            <Tooltip title={`${drawerOpen ? "Close" : "Open"} WebCalendar Menu`}>
              {drawerOpen ? (
                <Button
                  className="mr-4 mt-1 ml-[-17px] text-white w-[10px]"
                  style={{ backgroundColor: "grey", borderRadius: "0 5px 5px 0" }}
                  onClick={() => handleToggleDrawer(false)}
                >
                  <i className="fa-solid fa-chevron-left ml-[-5px]"></i>
                </Button>
              ) : (
                <Button
                  className="mr-4 mt-1 ml-[-17px] text-white w-[10px]"
                  style={{ backgroundColor: "grey", borderRadius: "0 5px 5px 0" }}
                  onClick={() => handleToggleDrawer(true)}
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </Button>
              )}
            </Tooltip>
          }
          <Button
            className="mr-8 mt-1 w-[12px] rounded-full hover:bg-blue-500 hover:text-red-400 bg-white text-gray-600"
            //style={{ backgroundColor: "grey", borderRadius: "50%" }}
            onClick={() => handleToggleDrawer(true)}
          >
            <i className="fa-solid fa-chevron-right ml-[-4px]"></i>
          </Button>
        </span>
      </div>
      <div className="w-100">{props.children}</div>
    </span>
  );
}
