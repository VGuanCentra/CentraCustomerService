"use client";
import React, { useState } from "react";

import UserSelectField from "app/components/atoms/formFields/userSelect";
import DateTimeSelectField from "app/components/atoms/formFields/ts/dateTimeSelectField";
import { Form } from "antd";
import ConfirmationModal from "app/components/atoms/confirmationModal/confirmationModal";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { customRequiredMark } from "app/components/atoms/formFields/customRequiredMark";
import DateTimeRangeField from "app/components/atoms/formFields/ts/dateTimeRangeField";

export default function ScheduleOrderModal(props) {
  const { showAssignModal, onConfirm, onCancel, id = "" } = props;
  const [form] = Form.useForm();
  const { isMobile } = useSelector((state) => state.app);
  const [startDate, setStartDate] = useState(null);

  const handleUserSelect = (fieldName, val) => {
    console.log(val);
  };

  const handleOkClick = (e) => {
    if (e) {
      form
        .validateFields()
        .then((values) => {
          //setShowSaveConfirmation(true);
          onConfirm(values);
        })
        .catch((error) => {
          console.log("Validation failed:", error);
        });
    }
    // onConfirm();
  };

  const handleCancelClick = (e) => {
    if (e) {
      form.resetFields();

      onCancel();
    }
  };

  return (
    <ConfirmationModal
      title={`Schedule Service Order # ${id}`}
      open={showAssignModal}
      onOk={handleOkClick}
      onCancel={handleCancelClick}
      cancelLabel="Cancel"
      okLabel="Ok"
      showIcon={true}
      popConfirmMessage="Are you sure you want to schedule this service?"
    >
      <div
        style={{
          width: isMobile ? "100%" : "550px",
          maxHeight: isMobile ? "100%" : "500px",
          overflow: "auto",
          paddingTop: "20px",
        }}
      >
        <Form
          form={form}
          name="ScheduleServiceForm"
          colon={false}
          labelWrap
          requiredMark={customRequiredMark}
          scrollToFirstError
        >
          <UserSelectField
            id="assignedTechnicians"
            label="Assigned Technician(s)"
            fieldName="assignedTechniciansSS"
            size="medium"
            isMultiSelect
            onChange={handleUserSelect}
            required
          />

          <DateTimeRangeField
            form={form}
            startFieldProps={{
              id: "scheduleDate",
              label: "Scheduled Start",
              fieldName: "scheduleDateSS",
              required: true,
            }}
            endFieldProps={{
              id: "scheduleEndDate",
              label: "Scheduled End",
              fieldName: "scheduleEndDateSS",
              required: true,
            }}
          />
        </Form>
      </div>
    </ConfirmationModal>
  );
}
