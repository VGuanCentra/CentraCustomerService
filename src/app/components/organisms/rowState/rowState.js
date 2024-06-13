"use client";
import React, { useCallback } from "react";
import { Dropdown, Space, Menu } from "antd";
import Tooltip from "app/components/atoms/tooltip/tooltip";

export default function RowStatus(props) {
  const {
    id,
    table,
    statusKey,
    onChange,
    rowStates,
    isEditable
  } = props;

  let statusOptions = Object.entries(rowStates).map((e) => {
    return { key: e[0], value: e[1].label, color: e[1].color }
  });

  const handleDropdownItemClick = useCallback((e) => {
    if (e) {
      let _newStatus = statusOptions.find(x => x.key === e.key);
      onChange({
        detailRecordId: id,
        status: _newStatus,
        table: table
      });
    }
  }, [id, table, statusOptions, onChange]);

  const menu = (
    <Menu onClick={handleDropdownItemClick}>
      {statusOptions.map(s => {
        return (<Menu.Item
          style={{ marginBottom: "2px", fontSize: "11px", paddingTop: "2px", paddingBottom: "2px" }}
          key={s.key}>
          <i className="fa-solid fa-square pr-2" style={{ color: s.color }}></i>
          {s.value}
        </Menu.Item>)
      })}
    </Menu>
  );

  return (
    <Tooltip title={onChange ? "Click to update status" : "Status cannot be updated from here"} style={{ width: "12rem"}}>
      {!onChange &&
        <div
          className={`text-center mr-0 bg-[${rowStates[statusKey]?.color}] pt-[2px] pb-[2px] rounded-sm`}
          style={{
            color: rowStates[statusKey]?.textColor || "#FFF",
            backgroundColor: rowStates[statusKey]?.color
          }}
        >
          {rowStates[statusKey]?.label}
        </div>
      }
      {onChange &&
        <Dropdown
          overlay={menu}
          trigger={[(isEditable) ? "click" : ""]}
          style={{ borderRadius: "2px !important" }}
        >
          <div
            className={`text-center mr-0 bg-[${rowStates[statusKey]?.color}] hover:cursor-pointer pt-[2px] pb-[2px] rounded-sm`}
            style={{
              color: rowStates[statusKey]?.textColor || "#FFF",
              backgroundColor: rowStates[statusKey]?.color,              
            }}>
            <Space>
              {rowStates[statusKey]?.label}
              {isEditable && <i class="fa-solid fa-caret-down"></i>}
            </Space>
          </div>
        </Dropdown>
      }
    </Tooltip>
  )
}