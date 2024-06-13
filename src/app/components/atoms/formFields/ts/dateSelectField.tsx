import React, { FC } from "react";
import styles from "../fields.module.css";
import { DatePicker, Form } from "antd";
import { DateSelectFieldProps } from "./formFieldProps";

const DateSelectField: FC<DateSelectFieldProps> = ({
  id,
  fieldName,
  label,
  disabled,
  required,
  labelPos = "left",
  labelSpan = 9,
  inputSpan = 15,
}) => {
  return (
    <Form.Item
      style={{ marginBottom: "0.5px" }}
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
      <DatePicker size="small" style={{ width: "100%" }} disabled={disabled} />
    </Form.Item>
  );
};

export default DateSelectField;
