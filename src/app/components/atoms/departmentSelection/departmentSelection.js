"use client"
import React from "react";
import { SearchCategories, Production, Installation } from "app/utils/constants";
import { Select } from 'antd';

export default function DepartmentSelection(props) {
  const { onChange, value, style } = props;

  let options = SearchCategories.map(d => {
    const enableOption = (d.key === Production || d.key === Installation);

    return {
      value: d.key,
      label: d.value,
      disabled: !enableOption
    }
  });

  return (
    <Select
      value={value}
      options={options}
      onChange={onChange}
      style={{ ...style }}
    />
  )
}
