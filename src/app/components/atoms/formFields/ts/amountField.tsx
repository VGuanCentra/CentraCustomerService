import React, { FC } from "react";
import { Form, InputNumber } from "antd";
import styles from "../fields.module.css";
import { AmountFieldProps } from "./formFieldProps";

const AmountField: FC<AmountFieldProps> = ({
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
      style={{ marginBottom: "0px" }}
    >
      <InputNumber
        size="small"
        formatter={(value) =>
          `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        }
        parser={(value) =>
          value?.replace(/\$\s?|(,*)/g, "") as unknown as number
        }
        style={{ width: "100%" }}
        disabled={disabled}
      />
    </Form.Item>
  );
};

export default AmountField;
