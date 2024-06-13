"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";

import moment from "moment";

import AntDatePicker from "app/components/atoms/datePicker/datePicker";
import CollapsibleGroup from "app/components/atoms/workorderComponents/collapsibleGroup";

import Collapse from "@mui/material/Collapse";
import {
  Tag,
  Input,
  Button
} from "antd";
const { TextArea } = Input;

import { updateReturnJobDate } from 'app/api/installationApis';
import { YMDDateFormat } from "app/utils/utils";

export default function Logistics({
  inputData,
  viewConfig,
  showLogistics,
  setShowLogistics,
  workOrderDataFromParent,
  className
}) {

  const { result } = useSelector((state) => state.calendar);

  const LogisticsItem = ({
    inputKey,
    title,
    color,
    hasRightBorder,
    placeholder,
    isTextInputDisabled,
    defaultStartDate,
    defaultEndDate,
    defaultText,
    saveCallback,
    requiresEndDate,
    disabled
  }) => {

    const [text, setText] = useState(defaultText);
    const [startDate, setStartDate] = useState(defaultStartDate);
    const [endDate, setEndDate] = useState(defaultEndDate);
    const [isSaveDisabled, setIsSaveDisabled] = useState(false);

    const handleTextChange = (e) => {
      if (e) {
        setText(e.target.value);
      }
    }

    const handleSave = useCallback((e) => {
      if (e && saveCallback) {
        saveCallback({
          key: inputKey,
          text: text,
          startDate: startDate,
          endDate: endDate,
        });
      } else if (!e && saveCallback) {
        saveCallback({
          key: inputKey,
          text: null,
          startDate: null,
          endDate: null,
        });
      }
    }, [saveCallback, inputKey, startDate, endDate, text]);

    const handleDateRangeChange = useCallback((dates, dateStrings) => {
      if (dateStrings?.length > 1) {
        setStartDate(dateStrings[0]);
        setEndDate(dateStrings[1]);
      }
    }, []);

    useEffect(() => {
      if (inputKey === "remeasureDate") {
        setIsSaveDisabled(!startDate);
      } else if (inputKey === "remeasureReturnTripDate") {
        setIsSaveDisabled(!startDate);
      } else if (inputKey === "returnStartScheduleDate") {
        setIsSaveDisabled(!startDate || !endDate);
      }
    }, [inputKey, setIsSaveDisabled, defaultText, startDate, endDate, text]);

    return (
      <div className={`pl-3 pr-3 ${hasRightBorder ? "border-r" : ""} h-100`}>
        <div className="flex flex-row justify-between">
          <div>
            <Tag color={color}>
              {title}
            </Tag>
          </div>
          {!requiresEndDate &&
            <AntDatePicker
              format="YYYY-MM-DD hh:mm a"
              size="small"
              value={startDate ? startDate : null}
              onChange={(newDate) => { setStartDate(newDate) }}
              showTime
              className="w-[11.5rem]"
              disabled={disabled}
            />
          }          
        </div>
        <TextArea
          style={{ minHeight: "4rem", margin: "0.7rem 0" }}
          placeholder={placeholder}
          disabled={isTextInputDisabled || disabled}
          onChange={handleTextChange}
          value={text}
          autosize={true}
        />
        <div className="flex flex-row justify-end">          
          <Button
            size="small"
            type="primary"
            onClick={handleSave}
            //disabled={isSaveDisabled}
            disabled={true}
          >
            Save
          </Button>
        </div>
      </div>
    )
  }

  const handleSaveData = useCallback((payload) => {
    if (payload) {
      let data = {};
      switch (payload.key) {
        case "returnStartScheduleDate":
          data = {
            "actionItemId": workOrderDataFromParent?.actionItemId,
            "returnTripStartDate": payload.startDate ? YMDDateFormat(payload.startDate) : null,
            "returnTripEndDate": payload.endDate ? YMDDateFormat(payload.endDate) : null,
            "returnTripReason": payload.text
          }
          updateReturnJobDate(data);
          break;
        default:
          break;
      }
    }
  }, [workOrderDataFromParent]);

  const generateSubTitle = useCallback(() => {
    let result = "";

    if (inputData?.remeasureDate || inputData?.remeasureReturnTripDate || inputData?.returnedStartScheduleDate) {
      result += "(";

      if (inputData?.remeasureDate) {
        result += `Remeasure: ${YMDDateFormat(inputData?.remeasureDate)}`;
      }

      if (inputData?.remeasureReturnTripDate) {
        if (inputData?.remeasureDate) {
          result += " | ";
        }

        result += `Remeasure Return Trip: ${YMDDateFormat(inputData?.remeasureReturnTripDate)}`;
      }

      if (inputData?.returnedStartScheduleDate) {
        if (inputData?.remeasureDate || inputData?.remeasureReturnTripDate) {
          result += " | ";
        }
        result += `Return Trip: ${YMDDateFormat(inputData?.returnedStartScheduleDate)}`;
      }

      result += ")";
    }

    return result;
  }, [inputData]);

  return (
    <CollapsibleGroup
      id={"title-logistics"}
      title={"Logistics"}
      subTitle={generateSubTitle()}
      expandCollapseCallback={() => setShowLogistics(prev => !prev)}
      value={viewConfig?.expanded ? true : showLogistics}
      //style={{ backgroundColor: "#FFF" }}
      className={className}
    >
      <Collapse in={viewConfig?.expanded ? true : showLogistics}>
        <div className="pt-2 pb-2">
          <div className="w-[100]">
            <LogisticsItem
              inputKey={"returnTripStartDate"}
              title={"Return Trip"}
              date={YMDDateFormat(moment())}
              color={"#f43f5e"}
              defaultText={inputData?.returnTripNotes}
              placeholder={"Reason"}
              defaultStartDate={inputData?.returnTripStartDate ? moment(inputData.returnTripStartDate) : null} // TODO              
              saveCallback={handleSaveData}
              requiresEndDate={false}              
            />
          </div>
        </div>
      </Collapse>
    </CollapsibleGroup>
  );
}
