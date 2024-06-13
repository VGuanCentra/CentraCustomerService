"use client";
import React, { FC } from "react";
import styles from "../fields.module.css";
import { DatePicker, Form } from "antd";
import { DateTimeSelectFieldProps } from "./formFieldProps";
import dayjs from "dayjs";

const DateTimeSelectField: FC<DateTimeSelectFieldProps> = ({
  id,
  fieldName,
  label,
  disabled,
  required,
  labelPos = "left",
  labelSpan = 9,
  inputSpan = 15,
  minValue,
  onChange,
}) => {
  const handleDisabledDate = (currentDate: dayjs.ConfigType) => {
    if (minValue) {
      return dayjs(currentDate).isBefore(minValue);
    }
    return false;
  };

  const handleDisabledTime = (current: dayjs.Dayjs | null) => {
    if (!current || !minValue) return {};

    const _isSameDay = dayjs(current).isSame(minValue, "day");

    if (_isSameDay) {
      const disabledHour = dayjs(minValue).hour();
      const disabledMinute = dayjs(minValue).minute();

      return {
        disabledHours: () => Array.from({ length: disabledHour }, (_, i) => i),
        disabledMinutes: () => {
          if (current.hour() === disabledHour) {
            return Array.from({ length: disabledMinute + 15 }, (_, i) => i);
          }
          return [];
        },
      };
    }

    return {};
  };

  return (
    <Form.Item
      style={{ marginBottom: "0px", width: "100%" }}
      id={id}
      label={<span className={styles.customLabel}>{label}</span>}
      name={fieldName}
      required={required}
      labelAlign="left"
      labelCol={labelPos === "left" ? { span: labelSpan } : { span: 24 }}
      wrapperCol={labelPos === "left" ? { span: inputSpan } : { span: 24 }}
      rules={[
        {
          required: required,
          message: `${label} is required`,
        },
      ]}
    >
      <DatePicker
        size="small"
        style={{ width: "100%" }}
        disabled={disabled}
        showTime
        placeholder="Select date & time"
        use12Hours
        format="YYYY-MM-DD h:mm A"
        changeOnBlur
        disabledTime={handleDisabledTime}
        disabledDate={handleDisabledDate}
        onChange={onChange}
      />
    </Form.Item>
  );
};

export default DateTimeSelectField;
