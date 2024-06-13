"use client";
import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import { ManufacturingFacilities, MenuActions } from "app/utils/constants";
import { updateBranch } from "app/redux/calendar";
import RootHeader from "app/components/organisms/rootHeader/rootHeader";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";

import { Button, Segmented, Popconfirm } from "antd";

export default function BatchUpdateHeader(props) {
  const { targetListEvents } = props;

  const { department, location } = useSelector(
    (state) => state.calendar
  );

  const { action } = useSelector(
    (state) => state.menu
  );

  const dispatch = useDispatch();
  const router = useRouter();

  const handleBranchChange = useCallback(
    (val) => {
      if (val) {
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

  const isActionReschedule = (action === MenuActions.batchReschedule || (window.location.href.includes("batch-reschedule")));
  const isActionStatusUpdate = (action === "batchStatusUpdate" || (window.location.href.includes("batch-status-update")));

  return (
    <RootHeader>
      <div className="flex flex-row justify-between">
        {isActionReschedule &&
          <div
            className="bg-slate-200 p-2 rounded"
            style={{ color: "var(--centrablue)" }}
          >
            <i className="fa-solid fa-calendar-days pr-2 pl-3" />
            <span className="text-sm pr-3 font-medium">Bulk Reschedule</span>
          </div>
        }
        {isActionStatusUpdate &&
          <div
            className="bg-slate-200 p-2 rounded"
            style={{ color: "var(--centrablue)" }}
          >
            <i className="fa-solid fa-circle-check pr-2 pl-3" />
            <span className="text-sm pr-3 font-medium">Bulk Status Update</span>
          </div>
        }
        <div
          className="flex flex-row bg-white pl-4 pr-2"
          style={{ borderRadius: "4px" }}
        >
          <div className="pt-2 pr-4">
            <FontAwesomeIcon
              icon={faCalendar}
              className="pr-2 text-gray-500 text-centraBlue"
            />
            <span className="text-sm text-bold text-centraBlue">
              {department?.value}
            </span>
          </div>

          {department?.key && (
            <>
              <Segmented
                options={[
                  ManufacturingFacilities.langley,
                  ManufacturingFacilities.calgary,
                  ManufacturingFacilities.all,
                ]}
                onChange={handleBranchChange}
                style={{ padding: "5px 0 5px 10px" }}
                value={location}
              />
            </>
          )}
        </div>

        <div
          className={`flex flex-row justify-end`}
        >
          {targetListEvents?.length > 0 && (
            <div className="pt-1">
              <Popconfirm
                placement="right"
                title={"Navigate to Calendar View"}
                description={
                  <div className="pt-2">
                    <div>
                      Once you close this window all your pending changes will be
                      lost.
                    </div>
                    <div>Proceed anyway?</div>
                  </div>
                }
                onConfirm={(e) => {
                  router.push(`?department=${department?.key}`);
                }}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary">
                  <span>Close</span>
                </Button>
              </Popconfirm>
            </div>
          )}

          {targetListEvents?.length === 0 && (
            <div className="pt-1">
              <Button
                type="primary"
                onClick={() => {
                  router.push(`?department=${department?.key}`);
                }}
              >
                <span>Close</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </RootHeader>
  );
}
