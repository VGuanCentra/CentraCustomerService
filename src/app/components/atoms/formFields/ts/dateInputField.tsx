"use client";
import React, { useState, useRef, useEffect, FC } from "react";
import { DatePicker, Form, Space } from "antd";

import { WorkOrderSelectOptions } from "app/utils/constants";
import dayjs, { Dayjs } from "dayjs";
import SelectField from "./selectField";
import { DateInputFieldProps } from "./formFieldProps";

const DateInputField: FC<DateInputFieldProps> = ({
  id,
  value,
  fieldName,
  label,
  onChange,
  disabled,
  labelPos = "left",
  labelSpan = 9,
  inputSpan = 15,
  typeValue = "",
  isMobile = false,
}) => {
  const datePickerRef = useRef(null);
  const [dateValue, setDateValue] = useState<any>(null);
  const [type, setType] = useState<string | undefined>(typeValue);

  const getPickerType = (
    type: string | undefined
  ): "date" | "year" | "month" => {
    const lowercasedType = type?.toLowerCase();
    switch (lowercasedType) {
      case "year":
      case "month":
        return lowercasedType;
      case undefined:
      default:
        return "date"; // Default to 'date' if the type is undefined or does not match 'year' or 'month'
    }
  };

  const handleTypeChange = (selectedOption?: string) => {
    setType(selectedOption);
    setDateValue(null);

    onChange(fieldName, undefined);
  };

  const handleValueChange = (date: any | null, dateString: string) => {
    onChange(fieldName, dateString);
    setDateValue(date);
  };

  useEffect(() => {
    setType(typeValue);
  }, [typeValue]);

  useEffect(() => {
    if (value) {
      setDateValue(dayjs(value));
    }
  }, [value]);

  const isRequired = type !== undefined && type !== "";

  return (
    <div
      className="flex w-full"
      style={isMobile ? { alignItems: "flex-end" } : {}}
    >
      <div className={`${isMobile ? "w-1/2" : "w-3/5"}`}>
        <SelectField
          id={`${id}Type`}
          label={`${label}`}
          fieldName={`${fieldName}Type`}
          options={WorkOrderSelectOptions.originalWODateTypes}
          onChange={handleTypeChange}
          disabled={disabled}
          labelSpan={15}
          inputSpan={9}
          required={isRequired}
          extraValidation={isRequired ? "Please select from picker" : undefined}
        />
      </div>
      <div className={`${isMobile ? "w-1/2" : "w-2/5"}`}>
        <Form.Item
          style={{ marginBottom: "0px", width: "100%" }}
          id={id}
          name={fieldName}
          labelCol={{ span: 0 }}
          wrapperCol={{ span: 24 }}
          rules={[
            {
              required: isRequired,
              message: `Value is required`,
            },
          ]}
        >
          <DatePicker
            ref={datePickerRef}
            size="small"
            style={{ width: "100%" }}
            picker={getPickerType(type)}
            placeholder="Select"
            onChange={handleValueChange}
            value={dateValue}
            disabled={!isRequired || disabled}
          />
        </Form.Item>
      </div>
    </div>
  );
};

export default DateInputField;
