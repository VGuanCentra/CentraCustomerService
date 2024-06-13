import React, { FC } from "react";
import { Form, Input } from "antd";
import styles from "../fields.module.css";
import { TextFieldProps } from "./formFieldProps";

const TextField: FC<TextFieldProps> = ({
  id,
  fieldName,
  label,
  disabled,
  required,
  labelPos = "left",
  labelSpan = 9,
  inputSpan = 15,
  size = "small",
  addonAfter,
}) => {
  return (
    <Form.Item
      id={id}
      label={
        label ? <span className={styles.customLabel}>{label}</span> : undefined
      }
      name={fieldName}
      required={required}
      labelAlign="left"
      labelCol={{ span: labelPos === "left" ? labelSpan : 24 }}
      wrapperCol={{ span: labelPos === "left" ? inputSpan : 24 }}
      rules={[
        {
          required: required,
          message: `${label} is required`,
        },
      ]}
      style={{ marginBottom: "0px", width: "100%" }}
    >
      <Input
        placeholder={`Enter ${label}`}
        addonAfter={addonAfter || undefined}
        size={size}
        required={required}
        disabled={disabled}
      />
    </Form.Item>
  );
};

export default TextField;
