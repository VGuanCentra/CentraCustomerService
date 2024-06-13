"use client";
import React, { useEffect } from "react";

import { getTimeAMPMUtc, getTimeDifferenceInHours } from "app/utils/date";
import { ReturnJobIcon, WarningIcon } from "app/utils/icons";
import { Pages, ServiceStates } from "app/utils/constants";
import { Popover } from "antd";
import Tooltip from "app/components/atoms/tooltip/tooltip";
import { mapServiceEventStateToKey } from "app/utils/utils";
import UserGroup from "app/components/atoms/userGroup/userGroup";

export default function ServiceEvent(props, page, cookies) {
  const { event, style, textStyle, className, showSchedule = true } = props;

  let _event = event?._def;
  let ep = { ..._event?.extendedProps };

  const getOptionsStyle = (cookies) => {
    let optionsStyle = {
      overflow: "hidden",
      textOverflow: "ellipsis",
    };

    if (cookies?.options?.expandEvents) {
      optionsStyle = {
        overflowWrap: "anywhere",
        whiteSpace: "break-spaces",
      };
    }

    return optionsStyle;
  };

  const scheduleTimeDuration = getTimeDifferenceInHours(
    ep.scheduleStartDate,
    ep.scheduleEndDate
  );

  const eventPopoverContent = (
    <div>
      <div className="text-md flex flex-row justify-between min-w-[12rem] text-xs">
        <span className="font-bold pt-1">
          {ep.workOrderNo ? ep.workOrderNo?.toUpperCase() : event.title}
          <div className="inline-block ml-1">
            <Tooltip title="Copy to Clipboard">
              <i
                className="fa-solid fa-copy text-gray-400 hover:text-blue-400 hover:cursor-pointer"
                onClick={() => navigator.clipboard.writeText(event.title)}
              />
            </Tooltip>
          </div>
        </span>
        <div
          style={{ backgroundColor: event.backgroundColor }}
          className="p-1 rounded-sm mb-1 text-white"
        >
          {ep.state}
        </div>
      </div>

      <div
        style={{ borderTop: "1px dotted lightgrey" }}
        className="pt-1 mt-1 flex flex-col space-y-1"
      >
        {ep?.icons.warningIcon && (
          <div className="flex items-center justify-between space-x-2">
            {<WarningIcon className="pl-1" />}{" "}
            <span className="text-xs text-red-600 font-bold">High Risk</span>
          </div>
        )}

        {ep?.isReturnTrip && (
          <div className="flex items-center justify-between space-x-2">
            {<ReturnJobIcon className="pl-1" />}{" "}
            <div className="text-xs  text-orange-400 font-bold">
              Return Trip
            </div>
          </div>
        )}

        <div className="flex justify-between items-start">
          <span className="text-xs">Branch:</span>
          <span className="text-xs text-blue-500 font-bold">{ep?.branch}</span>
        </div>

        {ep?.serviceReason && (
          <div className="flex justify-between items-start">
            <span className="text-xs">Reason:</span>
            <span className="text-xs text-blue-500 font-bold">
              {ep?.serviceReason}
            </span>
          </div>
        )}

        {ep?.sosi && (
          <div className="flex justify-between items-start">
            <span className="text-xs">Job Type:</span>
            <span className="text-xs text-blue-500 font-bold">
              {ep?.sosi?.toUpperCase()}
            </span>
          </div>
        )}
        {ep?.admin && (
          <div className="flex justify-between items-center">
            <span className="text-xs">Admin:</span>
            <div>
              <UserGroup
                value={[ep?.admin]}
                disabled
                size="small"
                showAsLabel
                fontSize="text-xs"
                isMultiSelect
              />
            </div>
          </div>
        )}
        {ep?.technicians && ep?.technicians.length > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-xs">Technicians:</span>
            <div className="flex justify-start">
              <UserGroup
                value={ep?.technicians}
                disabled
                size="small"
                showAsLabel
                fontSize="text-xs"
                isMultiSelect
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div
      data-toggle="tooltip"
      data-placement="right"
      data-html="true"
      style={{ ...style, ...getOptionsStyle(cookies) }}
      won={event.title}
      className={className}
    >
      <div className="flex flex-col">
        <div className="flex items-center truncate">
          {ep?.icons.warningIcon && (
            <Tooltip title="High Risk">
              <WarningIcon className="pl-1" />
            </Tooltip>
          )}
          {ep?.isReturnTrip && (
            <Tooltip title="Return Trip">
              <ReturnJobIcon style={{ width: "15px", height: "15px" }} />
            </Tooltip>
          )}

          <span className="pl-1 font-semibold" style={{ ...textStyle }}>
            <Popover
              content={eventPopoverContent}
              title=""
              className={`${className} hover:cursor-pointer hover:text-blue-900`}
              placement="top"
            >
              {ep.workOrderNo ? ep.workOrderNo?.toUpperCase() : event.title}
            </Popover>
          </span>
          {ep.city && (
            <span className="pl-1 text-blue-800 font-semibold">
              {ep.city.toUpperCase()}
            </span>
          )}
          {ep.customerName && (
            <span className="pl-1 uppercase">
              {ep.customerName.toUpperCase()}
            </span>
          )}
        </div>

        {showSchedule &&
          (page === Pages.day || page === Pages.week
            ? scheduleTimeDuration >= 1
            : true) && (
            <div className="flex flex-row">
              <span className="flex pl-1 truncate" style={{ ...textStyle }}>
                {`${getTimeAMPMUtc(ep.scheduleStartDate)} - ${getTimeAMPMUtc(
                  ep.scheduleEndDate
                )}`}
              </span>
            </div>
          )}
      </div>
    </div>
  );
}
