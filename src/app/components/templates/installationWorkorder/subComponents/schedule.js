"use client";
import styles from '../installationWorkorder.module.css';
import React from "react";
import Group from "app/components/atoms/workorderComponents/group";
import CheckboxItem from "app/components/atoms/workorderComponents/checkboxItem";
import { YMDDateFormat } from 'app/utils/utils';

import { DatePicker } from 'antd';
import dayjs from 'dayjs';

import moment from "moment";

const { RangePicker } = DatePicker;

import {
  AllDayIcon
} from "app/utils/icons";

export default function Schedule({
  inputData,
  onChange,
  style,
  handleInputChange
}) {

  const startDate = moment(inputData?.startScheduleDate);
  const endDate = moment(inputData?.endScheduleDate);

  const installationInDays = endDate.hour(23).minute(0).second(0).diff(startDate, "days") + 1; // Make start and end dates inclusive

  return (
    <Group
      title={`Schedule: ${installationInDays} day(s)`}
      contentStyle={{
        padding: "0.5rem",
        rowGap: "0.3rem"
      }}
      className={styles.groupInfo}
      style={{ ...style }}
    >
      <div className="">
        <RangePicker
          value={[
            dayjs(YMDDateFormat(inputData.startScheduleDate), 'YYYY-MM-DD'),
            dayjs(YMDDateFormat(inputData.endScheduleDate), 'YYYY-MM-DD')
          ]}
          onChange={onChange}
          style={{ width: "100%" }}
        />
        <div className="flex justify-end mb-[-10px] pt-[5px]">
          <CheckboxItem
            label={"All Day"}
            value={inputData?.allDay === "Yes"}
            name={"allDay"}
            onChange={(name, value) => handleInputChange(name, value ? "Yes" : "No")}
            changeItems={[]}
          >
            <AllDayIcon
              style={{ marginLeft: "-3px", width: "20px" }}
            />
          </CheckboxItem>
        </div>
      </div>
    </Group>
  )
}