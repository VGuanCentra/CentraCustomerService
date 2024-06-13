"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";

import moment from "moment";
import dayjs from 'dayjs';

import AntDatePicker from "app/components/atoms/datePicker/datePicker";
import CollapsibleGroup from "app/components/atoms/workorderComponents/collapsibleGroup";

import Collapse from "@mui/material/Collapse";
import {
  Tag,
  Input,
  Button,
  DatePicker
} from "antd";
const { TextArea } = Input;
const { RangePicker } = DatePicker;

import { Remeasure } from "app/utils/constants";

import { updateReturnJobDate, updateInstallation, updateRemeasureReturnJobDate } from 'app/api/installationApis';
import { YMDDateFormat } from "app/utils/utils";

export default function Logistics({
  inputData,
  viewConfig,
  showLogistics,
  handleExpandCollapseCallback,
  workOrderDataFromParent
}) {

  const { subDepartment } = useSelector((state) => state.calendar);
  const { isReadOnly } = useSelector((state) => state.app);

  const LogisticsItem = ({
    inputKey,
    title,
    color,
    hasRightBorder,
    placeholder,
    isTextInputDisabled,
    isTextInputHidden,
    defaultStartDate,
    defaultEndDate,
    defaultText,
    saveCallback,
    requiresEndDate,
    disabled,
    className,
    topRowClassName
  }) => {

    const [text, setText] = useState(defaultText);
    const [startDate, setStartDate] = useState(defaultStartDate);
    const [endDate, setEndDate] = useState(defaultEndDate);
    const [isSaveDisabled, setIsSaveDisabled] = useState(false);
    //const [isCancelDisabled, setIsCancelDisabled] = useState(false);
    
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

    //useEffect(() => {
    //  if (inputKey === "remeasureDate") {
    //    setIsCancelDisabled(!startDate);
    //  } else if (inputKey === "remeasureReturnTripDate") {
    //    setIsCancelDisabled(!startDate);
    //  } else if (inputKey === "returnStartScheduleDate") {
    //    setIsCancelDisabled(!startDate || !endDate);
    //  }
    //}, [inputKey, setIsSaveDisabled, defaultText, startDate, endDate, text])

    return (
      <div className={`${className} pl-3 pr-3 ${hasRightBorder ? "border-r" : ""} flex flex-col justify-between`}>
        <div className={`${topRowClassName} flex flex-row justify-between`}>
          <div>
            <Tag color={color} style={{width: "8.5rem"}}>
              {title}
            </Tag>
          </div>
          <div className="flex flex-row justify-between">
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
            {requiresEndDate &&
              <RangePicker
                className="w-[15rem]"
                size="small"
              onChange={handleDateRangeChange}
              disabled={disabled}
                value={[
                  startDate ? dayjs(startDate) : null,
                  endDate ? dayjs(endDate) : null
                ]}
              />
            }
            <div className="ml-2">
              <Button
                size="small"
                type="primary"
                onClick={handleSave}
                disabled={isSaveDisabled || isReadOnly}
              >
                Save
              </Button>
            </div>
          </div>
        </div>        
        {!isTextInputHidden &&
          <div className="flex flex-row">
            <div className="text-xs w-[10rem] pt-[1.3rem]">Return Trip Reason</div>
            <TextArea
              style={{ margin: "0.2rem 0 0.6rem 0" }}
              placeholder={placeholder}
              disabled={isTextInputDisabled || disabled}
              onChange={handleTextChange}
              value={text}
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          </div>
        }        
      </div>
    )
  }

  const LogisticsItemRemeasure = ({
    inputKey,
    hasRightBorder,
    placeholder,
    isTextInputDisabled,
    isTextInputHidden,
    defaultStartDate,
    defaultReturnStartDate,
    defaultEndDate,
    defaultText,
    saveCallback,
    disabled,
    className,
    topRowClassName
  }) => {

    const [text, setText] = useState(defaultText);
    const [startDate, setStartDate] = useState(defaultStartDate);
    const [returnStartDate, setReturnStartDate] = useState(defaultReturnStartDate);
    const [endDate, setEndDate] = useState(defaultEndDate);
    const [isSaveDisabled, setIsSaveDisabled] = useState(false);
    const [isReturnSaveDisabled, setIsReturnSaveDisabled] = useState(false);

    const handleTextChange = (e) => {
      if (e) {
        setText(e.target.value);
      }
    }

    const handleSave = useCallback((e) => {
      if (e && saveCallback) {
        saveCallback({
          key: "remeasureDate",
          text: text,
          startDate: startDate,
          endDate: endDate,
        });
      }
    }, [saveCallback, startDate, endDate, text]);

    const handleSaveReturn = useCallback((e) => {
      if (e && saveCallback) {
        saveCallback({
          key: "remeasureReturnTripDate",
          text: text,
          startDate: startDate,
          endDate: endDate,
        });
      }
    }, [saveCallback, startDate, endDate, text]);

    useEffect(() => {
        setIsSaveDisabled(!startDate);
        setIsReturnSaveDisabled(!returnStartDate);      
    }, [inputKey, setIsSaveDisabled, defaultText, startDate, returnStartDate, endDate, text]);

    return (
      <div className={`${className} pl-3 pr-3 ${hasRightBorder ? "border-r" : ""}`}>
      <div className={"flex flex-row justify-between"}>
        <div className={`${topRowClassName} flex flex-row justify-between`}>
          <div>
            <Tag color={"#eab308"} style={{ width: "8.5rem" }}>
              Remeasure
            </Tag>
          </div>
          <div className="flex flex-row justify-between">            
            <AntDatePicker
              format="YYYY-MM-DD hh:mm a"
              size="small"
              value={startDate ? startDate : null}
              onChange={(newDate) => { setStartDate(newDate) }}
              showTime
              className="w-[11.5rem]"
              disabled={disabled || isReadOnly}
            />                        
            <div className="ml-2">
              <Button
                size="small"
                type="primary"
                onClick={handleSave}
                disabled={isSaveDisabled || isReadOnly}
              >
                Save
              </Button>
            </div>
          </div>
        </div>     
        <div className={`${topRowClassName} flex flex-row justify-between`}>
          <div>
            <Tag color={"#f97316"} style={{ width: "8.5rem" }}>
              Remeasure Return Trip
            </Tag>
          </div>
          <div className="flex flex-row justify-between">            
            <AntDatePicker
              format="YYYY-MM-DD hh:mm a"
              size="small"
              value={returnStartDate ? returnStartDate : null}
              onChange={(newDate) => { setReturnStartDate(newDate) }}
              showTime
              className="w-[11.5rem]"
              disabled={disabled}
            />            
            <div className="ml-2">
              <Button
                size="small"
                type="primary"
                onClick={handleSaveReturn}
                disabled={isReturnSaveDisabled || isReadOnly}
              >
                Save
              </Button>
            </div>
          </div>
        </div>        
        </div>        
        <div>          
          <div className="flex flex-row justify-between">
            <div></div>
            <div className="flex flex-row w-[34rem]">
              <div className="text-xs w-[15rem] pt-[0.8rem]">Remeasure Return Trip Reason</div>
              <TextArea
                style={{ margin: "0.2rem 0 0.6rem 0" }}
                placeholder={placeholder}
                disabled={isTextInputDisabled || disabled}
                onChange={handleTextChange}
                value={text}
                autoSize={{ minRows: 2, maxRows: 6 }}
              />
            </div>
          </div>
        </div>        
        </div>
    )
  }
  
  const handleSaveData = useCallback((payload) => {
    if (payload) {
      let data = {};
      switch (payload.key) {
        case "remeasureDate":
          data = {
            actionItemId: workOrderDataFromParent?.actionItemId,
            jsonFields: JSON.stringify({ remeasureDate: payload.startDate ? moment(payload.startDate).format('YYYY-MM-DDTHH:mm:ss.SSS') : null })
          }          
          updateInstallation(data);
          break;
        case "remeasureReturnTripDate":
          data = {
            "actionItemId": workOrderDataFromParent?.actionItemId,
            "returnTripStartDate": payload.startDate ? YMDDateFormat(payload.startDate) : null,
            "returnTripEndDate": payload.endDate ? YMDDateFormat(payload.endDate) : null,
            "returnTripReason": payload.text
          }
          updateRemeasureReturnJobDate(data);
          break;
        case "returnStartScheduleDate":          
          data = {
            "actionItemId": workOrderDataFromParent?.actionItemId,
            "returnTripStartDate": payload.startDate ? YMDDateFormat(payload.startDate): null,
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

  /*
  const generateSubTitle = useCallback(() => {
    let result = "";

    if (inputData?.remeasureDate || inputData?.remeasureReturnTripDate || inputData?.returnedStartScheduleDate) {
      result += "(";

      if (inputData?.remeasureDate) {
        result += `Remeasure: ${ YMDDateFormat(inputData?.remeasureDate) }`;
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
  */

  return (
    <CollapsibleGroup
      id={"title-logistics"}
      title={"Logistics"}
      //subTitle={generateSubTitle()}
      expandCollapseCallback={() => handleExpandCollapseCallback("logistics")}
      value={showLogistics}
      style={{ marginTop: "0.5rem", backgroundColor: "#FFF" }}
    >
      <Collapse in={viewConfig?.expanded ? true : showLogistics}>
        <div className="pt-2 flex flex-row justify-between">
          <div className="w-[60%]">
            <LogisticsItemRemeasure
              date={YMDDateFormat(moment())}
              hasRightBorder={true}
              placeholder={``}
              defaultStartDate={inputData?.remeasureDate ? moment(inputData.remeasureDate) : null}
              defaultReturnStartDate={inputData?.remeasureReturnTripDate ? moment(inputData.remeasureReturnTripDate) : null}
              saveCallback={handleSaveData}
              topRowClassName="pb-[0.5rem]"
            />           
          </div>
          <div className="w-[40%]">
            <LogisticsItem
              inputKey={"returnStartScheduleDate"}
              title={"Return Trip"}
              date={YMDDateFormat(moment())}
              color={"#f43f5e"}
              defaultText={inputData?.returnTripReason}
              placeholder={"Reason"}
              defaultStartDate={inputData?.returnedStartScheduleDate ? moment(inputData.returnedStartScheduleDate) : null}
              defaultEndDate={inputData?.returnedEndScheduleDate ? moment(inputData.returnedEndScheduleDate) : null}
              saveCallback={handleSaveData}
              requiresEndDate={true}
              disabled={(!workOrderDataFromParent?.returnedJob && (inputData?.returnedStartScheduleDate || inputData?.returnTripReason)) || subDepartment?.key === Remeasure}
              className="h-100"
            />
          </div>
        </div>
      </Collapse>          
    </CollapsibleGroup>
  );
}
