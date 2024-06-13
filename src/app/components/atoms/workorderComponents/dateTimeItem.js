"use client";
import React, { useMemo } from "react";

import {
  convertToLocaleDateTimeYYYYMMDD,
  convertUtcDateTimeToLocal,
} from "app/utils/date";

export default function DateTimeItem(props) {
  const {
    value,
    id,
    name,
    onChange,
    label,
    changeItems,
    style,
    disabled,
    minDate = null,
    showLabel = true,
    justifyEnd = false,
  } = props;

  let edited = useMemo(
    () => changeItems?.find((x) => x.key === name),
    [name, changeItems]
  );

  return (
    <>
      {showLabel && (
        <div style={{ minWidth: "10rem" }}>
          <span>{label}</span>
          {edited && <span className="pl-1 text-amber-500">*</span>}
        </div>
      )}

      <div
        className={`flex space-x-4 ${justifyEnd ? "justify-end" : ""}`}
        style={{ ...style }}
      >
        <input
          type="date"
          id={id}
          name={name}
          value={convertUtcDateTimeToLocal(value).format("YYYY-MM-DD")}
          onChange={(e) => onChange(e, "date", id)}
          required={true}
          disabled={disabled}
          min={minDate ? convertToLocaleDateTimeYYYYMMDD(minDate) : ""}
        />
        <input
          type="time"
          id={id}
          name={name}
          value={convertUtcDateTimeToLocal(value).format("HH:mm")}
          onChange={(e) => onChange(e, "time", id)}
          required={true}
          disabled={disabled}
        />
      </div>
    </>
  );
}
