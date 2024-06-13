"use client";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Segmented } from "antd";

import CalendarDropdownIcon from "app/components/atoms/calendarDropdownIcon/calendarDropdownIcon";

import {
  ManufacturingFacilities,
  Production,
  Service
} from "app/utils/constants";

import { updateBranch, updateShowMessage } from "app/redux/calendar";

export default function BranchSelection(props) {
  const dispatch = useDispatch();
  const { department, branch, markedWorkOrderId } = useSelector(
    (state) => state.calendar
  );
  const { userData } = useSelector((state) => state.app);

  const handleBranchChange = useCallback(
    (val) => {
      if (val) {
        dispatch(
          updateShowMessage({ value: true, message: "Applying filters..." })
        );
        switch (val) {
          case ManufacturingFacilities.langley:
            dispatch(updateBranch(ManufacturingFacilities.langley));
            break;
          case ManufacturingFacilities.calgary:
            dispatch(updateBranch(ManufacturingFacilities.calgary));
            break;
          case ManufacturingFacilities.all:
            dispatch(updateBranch(ManufacturingFacilities.all));
            break;
          default:
            break;
        }
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (markedWorkOrderId) {
      dispatch(updateBranch(ManufacturingFacilities.all)); // If Go to calendar is triggered, show all work orders
    }
    /* Disabling because it conflicts with default filters
      else {
        if (userData?.province) {
          if (userData?.province === "BC") {
            dispatch(updateBranch(ManufacturingFacilities.langley));
          } else {
            dispatch(updateBranch(ManufacturingFacilities.calgary));
          }
        }
      }
    */
  }, [dispatch, userData, markedWorkOrderId]);

  return (
    <div
      className="flex flex-row bg-white pl-4 pr-2"
      style={{ borderRadius: "4px" }}
    >      
      <div
        className="pt-2 pr-4 flex flex-row"
        style={{
          borderRight:
            department?.key === Production ? "1px dotted lightgrey" : "",
        }}
      >
        <div className="pt-[2px] flex flex-row"> {/*TODO: Make icons dynamic*/}
          <CalendarDropdownIcon className="pr-2"/>
          <span className="text-sm">{department?.value}</span>
        </div>
      </div>

      {department?.key &&
        (department.key === Production || department.key === Service) && (
          <>
            <Segmented
              options={[
                ManufacturingFacilities.langley,
                ManufacturingFacilities.calgary,
                ManufacturingFacilities.all,
              ]}
              onChange={handleBranchChange}
              style={{ padding: "5px 0 5px 10px" }}
              value={branch}
            />
          </>
        )}
    </div>
  );
}
