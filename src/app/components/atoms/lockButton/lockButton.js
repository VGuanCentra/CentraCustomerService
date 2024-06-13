"use client";
import React from "react";
import Tooltip from "app/components/atoms/tooltip/tooltip";

import { Button } from "antd";
export default function LockButton(props) {
  const { danger, label, onClick, tooltip, disabled, showLockIcon, size = "default" } = props;

  return (
    <Tooltip title={showLockIcon ? "You currently don't have permission to perform this action. If you require access, please send a request to IT." : tooltip}>
      <Button
        danger={danger}
        type={"primary"}
        onClick={onClick}
        disabled={disabled}
        size={size}
      >
        {showLockIcon && <i className="fa-solid fa-lock pr-2" />}
        <span>{label}</span>
      </Button>
    </Tooltip>
  )
}