import React, { FC } from "react";
import { Form, Select } from "antd";
import styles from "../fields.module.css";
import { SelectFieldProps } from "./formFieldProps";

const SelectField: FC<SelectFieldProps> = ({
  id,
  fieldName,
  label,
  onChange,
  disabled,
  required,
  options,
  labelPos = "left",
  labelSpan = 9,
  inputSpan = 15,
  defaultValue,
  extraValidation,
}) => {
  return (
    <Form.Item
      id={id}
      label={label ? <span className={styles.customLabel}>{label}</span> : null}
      name={fieldName}
      labelAlign="left"
      labelCol={labelPos === "left" ? { span: labelSpan } : { span: 24 }}
      wrapperCol={labelPos === "left" ? { span: inputSpan } : { span: 24 }}
      required={required}
      rules={[
        {
          required: required,
          message: `${label} is required`,
        },
      ]}
      style={{ marginBottom: "0px", width: "100%" }}
    >
      <Select
        placeholder={`Select ${label}`}
        options={options}
        size="small"
        defaultValue={defaultValue}
        onChange={onChange}
        disabled={disabled}
      />
    </Form.Item>
  );
};

export default SelectField;
