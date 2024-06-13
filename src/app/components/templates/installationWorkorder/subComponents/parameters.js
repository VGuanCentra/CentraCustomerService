"use client";
import React from "react";

import Group from "app/components/atoms/workorderComponents/group";
import CheckboxItem from "app/components/atoms/workorderComponents/checkboxItem";
import Tooltip from "app/components/atoms/tooltip/tooltip";

import { DatePicker } from "antd";
import dayjs from 'dayjs';

import {
  HomeDepotIcon,
  FinancingIcon,
  WoodDropOffIcon,
  AsbestosIcon,
  LeadPaintIcon,
  HighRiskIcon,
  AbatementIcon
} from "app/utils/icons";

export default function Parameters(props) {
  const {
    inputData,
    style,
    handleInputChange,
    handleDateInputChange,
    className
  } = props;

  return (
    <Group
      title={"Parameters"}
      contentStyle={{
        padding: "0.5rem",
      }}
      className={`${className} bg-[#FFF]`}
      style={{ ...style }}
    >
      <CheckboxItem
        label={"Asbestos"}
        value={inputData?.asbestos === "Yes"}
        name={"asbestos"}
        onChange={(name, value) => handleInputChange(name, value ? "Yes" : "No")}
        changeItems={[]}
      >
        <AsbestosIcon
          style={{ marginLeft: "-3px", width: "20px" }}
        />
      </CheckboxItem>
      {inputData?.asbestos === "Yes" &&
        <CheckboxItem
          label={"Abatement"}
          value={inputData?.abatementRequired === "Yes"}
          name={"abatementRequired"}
          onChange={(name, value) => handleInputChange(name, value ? "Yes" : "No")}
          changeItems={[]}
        >
          <AbatementIcon
            style={{ marginLeft: "-3px", width: "20px" }}
          />
        </CheckboxItem>
      }
      <CheckboxItem
        label={"Lead Paint"}
        value={inputData?.leadPaint === "Yes"}
        name={"leadPaint"}
        onChange={(name, value) => handleInputChange(name, value ? "Yes" : "No")}
        changeItems={[]}
      >
        <LeadPaintIcon
          style={{ marginLeft: "-3px", width: "20px" }}
        />
      </CheckboxItem>      
      <CheckboxItem
        label={"Wood Dropoff"}
        value={inputData?.woodDropOff === "Yes"}
        name={"woodDropOff"}
        onChange={(name, value) => handleInputChange(name, value ? "Yes" : "No")}
        changeItems={[]}
      >
        <WoodDropOffIcon
          style={{ marginLeft: "-3px", width: "20px" }}
        />
      </CheckboxItem>
      {inputData?.woodDropOff === "Yes" &&
        <div className="pl-16">
          <Tooltip title="Wood Drop Off Date">
            <DatePicker
              showTime
              value={inputData?.woodDropOffDate ? dayjs(inputData.woodDropOffDate) : null}
              placeholder={"Wood Drop Off Date"}
              onChange={(val) => handleDateInputChange("woodDropOffDate", val) }
            />
          </Tooltip>
        </div>
      }

      <CheckboxItem
        label={"High Risk"}
        value={inputData?.highRisk === "Yes"}
        name={"highRisk"}
        onChange={(name, value) => handleInputChange(name, value ? "Yes" : "No")}
        changeItems={[]}
      >
        <HighRiskIcon
          style={{ marginLeft: "-2px", width: "18px" }}
        />
      </CheckboxItem>

      <CheckboxItem
        label={"Home Depot Job"}
        value={inputData?.homeDepotJob === "Yes"}
        name={"homeDepotJob"}
        onChange={(name, value) => handleInputChange(name, value ? "Yes" : "No")}
        changeItems={[]}
      >
        <HomeDepotIcon
          style={{ marginLeft: "-2px", width: "18px" }}
        />
      </CheckboxItem>

      <div>
        <CheckboxItem
          label={"Financing"}
          value={inputData?.financing === "Yes"}
          name={"financing"}
          onChange={(name, value) => handleInputChange(name, value ? "Yes" : "No")}
          changeItems={[]}
        >
          <FinancingIcon
            style={{ marginLeft: "-3px", width: "20px" }}
          />
        </CheckboxItem>
        {inputData?.financing === "Yes" &&
          <div className="pl-16">
            <Tooltip title="Financing Start Date">
              <DatePicker
                value={inputData?.financeStartDate ? dayjs(inputData.financeStartDate) : null}
                placeholder={"Financing Start"}
                onChange={(val) => handleDateInputChange("financeStartDate", val)}
              />
            </Tooltip>
          </div>
        }
      </div>
    </Group>
  )
}