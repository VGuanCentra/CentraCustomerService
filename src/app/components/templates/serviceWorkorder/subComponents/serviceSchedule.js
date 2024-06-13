"use client";
import styles from "../serviceWorkorder.module.css";
import React from "react";

import Group from "app/components/atoms/workorderComponents/group";
import UserSelectField from "app/components/atoms/formFields/userSelect";
import ServiceReturnTrips from "./serviceReturnTrips";
import DateTimeRangeField from "app/components/atoms/formFields/ts/dateTimeRangeField";

export default function ServiceSchedule(props) {
  const {
    form,
    moduleId,
    inputData,
    assignedTechnicians,
    disabled = false,
    setFieldsValue = null,
    showReturnTrip = false,
  } = props;

  const onSelectTechnicians = (fieldName, val, append = false) => {
    if (setFieldsValue) {
      setFieldsValue(fieldName, val, append);
    }
  };

  return (
    <Group
      id={"title-schedule"}
      title={"Schedule"}
      style={{ minWidth: "25rem", display: "flex", flexDirection: "column" }}
      contentStyle={{
        padding: "0.5rem",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        //maxHeight: "40vh",
        overflow: "auto",
      }}
      className={styles.groupSchedule}
    >
      <UserSelectField
        id="assignedTechnicians"
        label="Assigned Technician(s)"
        fieldName="assignedTechnicians"
        value={assignedTechnicians}
        size="middle"
        isMultiSelect
        showAssignToMe
        disabled={disabled}
        onChange={onSelectTechnicians}
        required={!disabled}
      />

      <DateTimeRangeField
        {...{ form }}
        startFieldProps={{
          id: "scheduleDate",
          label: "Scheduled Start",
          fieldName: "scheduleDate",
          required: !disabled,
          disabled,
        }}
        endFieldProps={{
          id: "scheduleEndDate",
          label: "Scheduled End",
          fieldName: "scheduleEndDate",
          required: !disabled,
          disabled,
        }}
      />

      {showReturnTrip && (
        <>
          <div className="w-full mt-3"></div>
          <ServiceReturnTrips
            inputData={inputData}
            moduleId={moduleId}
            disabled={disabled}
          />
        </>
      )}
    </Group>
  );
}
