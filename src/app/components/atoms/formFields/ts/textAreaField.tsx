import React, { FC } from "react";
import { Form, Input } from "antd";
import styles from "../fields.module.css";
import { TextAreaFieldProps } from "./formFieldProps";

const TextAreaField: FC<TextAreaFieldProps> = ({
  id,
  fieldName,
  label,
  disabled,
  required,
  labelPos = "left",
  labelSpan = 9,
  inputSpan = 15,
  placeholder,
  minRows = 1,
  maxRows = 3,
  borderless = false,
  style,
  hideLabel = false,
}) => {
  const { TextArea } = Input;

  return (
    <Form.Item
      id={id}
      label={
        label && !hideLabel ? (
          <span className={styles.customLabel}>{label}</span>
        ) : null
      }
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
      style={{ margin: "3px 0px", width: "100%" }}
    >
      <TextArea
        placeholder={placeholder}
        required={required}
        autoSize={{ minRows: minRows, maxRows: maxRows }}
        bordered={!borderless}
        style={style}
        disabled={disabled}
      />
    </Form.Item>
  );
};

export default TextAreaField;
