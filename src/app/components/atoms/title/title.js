"use client";
import React from "react";
export default function Title(props){
    const { style, labelStyle, label, Icon, className, labelClassName, color, backgroundColor } = props;

    return (
      <div style={{ ...style, color: color || "var(--centrablue)", backgroundColor: backgroundColor || "#E2E8F0" }} className={`${className} rounded pl-2`}>
        {Icon && <Icon />}
        <span style={{ ...labelStyle }} className={labelClassName}>
          {label}{props.children}
        </span>
      </div>
    )
}
