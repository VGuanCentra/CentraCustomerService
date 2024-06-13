"use client"
import React, { useMemo, useState } from "react";
import { Select, Tag, Button } from "antd";
const { Option } = Select;

import Tooltip from "app/components/atoms/tooltip/tooltip";

export default function CrewSelection(props) {
  const {
    changeItems,
    disabled,
    label,
    name,
    onChange,
    options,
    selected,
    className,
    placeholder,
    mode,
    value,
    crew,
    handleCrewInputChange,
    onShowAllClick,
    labelClassName
  } = props;

  const [showShowAllButton, setShowShowAllButton] = useState(true);

  let edited = useMemo(() => changeItems?.find(x => x.key === name), [name, changeItems]);

  const getInstallerColor = (installerLevel) => {
    let result = "#3b82f6"

    switch (installerLevel) {
      case "1":
        result = "processing";
        break;
      case ".9":
        result = "cyan";
        break;
      case ".8":
        result = "geekblue";
        break;
      case ".7":
        result = "purple";
        break;
      case ".6":
        result = "magenta";
        break;
      case ".5":
        result = "red";
        break;
    }
    return result;
  }

  return (
    <>
      <div className="truncate">
        <div className={labelClassName}>{label}</div>
        {edited && <span className="pl-1 text-amber-500">*</span>}
      </div>
      <Select
        className={className}
        mode={mode}
        style={{
          width: '100%',
        }}
        placeholder={placeholder}
        onChange={(val) => handleCrewInputChange(name, val)}
        optionLabelProp="label"
        value={value}
        disabled={disabled}
      >
        {showShowAllButton &&
          <div>
            <Button type="primary" size="small" onClick={(e) => { onShowAllClick(e); setShowShowAllButton(false); }}>
              Show All
            </Button>
          </div>
        }
        {(name === "seniorInstaller" || name === "remeasurer") &&
          <Option key={-1} value={null} label={"-"} style={{ borderBottom: "1px dotted lightgrey" }}>
            <div className="demo-option-label-item">
              <div>
                {"(None)"}
              </div>
            </div>
          </Option>
        }
        {options.map((o, index) => {
          return (
            <Option key={index} value={o.name} label={o.name} style={{borderBottom: "1px dotted lightgrey"}}>
              <div className="demo-option-label-item">
                <div>
                  <Tooltip title="Installer Level">
                    <Tag color={getInstallerColor(o.installerLevel)} bordered={false}>{o.installerLevel}</Tag>
                  </Tooltip>
                  {o.name}
                </div>
                <div className="pl-[1.9rem] text-gray-500">{o.email}</div>
              </div>
            </Option>
          )
        })}        
      </Select>
    </>
  )
}