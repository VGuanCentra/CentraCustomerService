import { FormInstance } from "antd";
import dayjs, { Dayjs } from "dayjs";
import React from "react";

// Base interface with common properties
interface BaseFieldProps {
  id: string;
  fieldName: string;
  label?: string | React.ReactNode;
  disabled?: boolean;
  required?: boolean;
  labelPos?: "left" | "right";
  labelSpan?: number;
  inputSpan?: number;
}

export interface TextFieldProps extends BaseFieldProps {
  size?: "small" | "middle" | "large";
  addonAfter?: React.ReactNode;
}

export interface TextAreaFieldProps extends BaseFieldProps {
  placeholder?: string;
  minRows?: number;
  maxRows?: number;
  borderless?: boolean;
  style: React.CSSProperties;
  hideLabel?: boolean;
}

export interface AmountFieldProps extends BaseFieldProps {}

export interface SelectFieldOption {
  key: number | string;
  value: number | string;
  label?: string | React.ReactNode;
}

export interface SelectFieldProps extends BaseFieldProps {
  onChange?: (value: any) => void;
  options: SelectFieldOption[];
  defaultValue?: string | number;
  extraValidation?: string;
}

export interface DateSelectFieldProps extends BaseFieldProps {}

export interface DateTimeSelectFieldProps extends BaseFieldProps {
  minValue?: Dayjs;
  onChange?: (value: Dayjs | null, dateString: string) => void;
  // minValueField: string | undefined;
}

export interface DateInputFieldProps extends BaseFieldProps {
  typeValue?: string;
  value?: any;
  onChange: (fieldName: string, value?: string, append?: boolean) => void;
  isMobile?: boolean;
}
