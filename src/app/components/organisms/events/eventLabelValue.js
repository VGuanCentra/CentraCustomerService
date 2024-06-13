"use client";
import React from "react";

export default function LabelValue(props) {
  const { label, value, className } = props;
  return (<> <span className={`text-xs ${className}`}>{label}</span>: <span className="text-blue-500 font-bold text-xs">{value}</span></>)
}