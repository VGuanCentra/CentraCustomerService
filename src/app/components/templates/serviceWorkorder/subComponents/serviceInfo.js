"use client";
import styles from "../serviceWorkorder.module.css";
import React, { useCallback, useState } from "react";

import Group from "app/components/atoms/workorderComponents/group";
import UserSelectField from "app/components/atoms/formFields/userSelect";

import SelectField from "app/components/atoms/formFields/ts/selectField";
import AmountField from "app/components/atoms/formFields/ts/amountField";
import TextField from "app/components/atoms/formFields/ts/textField";
import DateSelectField from "app/components/atoms/formFields/ts/dateSelectField";
import DateInputField from "app/components/atoms/formFields/ts/dateInputField";

import WOSearchModal from "app/components/organisms/woSearchModal/woSearchModal";

import { getJobType } from "app/utils/utils";
import { SearchIcon } from "app/utils/icons";
import dayjs from "dayjs";

export default function ServiceInfo(props) {
  const {
    WorkOrderSelectOptions,
    inputData,
    setInputData,
    isNew = false,
    isMobile = false,
    setFieldsValue,
    form,
    woSelectCallback,
    isReadOnly = false,
  } = props;

  const [showWOSearch, setShowWOSearch] = useState(false);

  const woSelectionCallback = (woData) => {
    setShowWOSearch(false);
    if (woData) handleWOSelect(woData);
  };

  const handleWOSelect = useCallback(
    (workOrderData) => {
      if (workOrderData && form) {
        // auto populate wo fields
        form.setFieldValue(
          "originalWorkOrderNo",
          workOrderData.workOrderNumber
        );
        form.setFieldValue(
          "originalWorkOrderDateType",
          WorkOrderSelectOptions.originalWODateTypes.find(
            (x) => x.key === "date"
          )?.value
        );
        form.setFieldValue(
          "originalWorkOrderDate",
          dayjs(workOrderData.startDateTime)
        );

        if (setInputData) {
          setInputData((prev) => ({
            ...prev,
            originalWorkOrderNo: workOrderData.workOrderNumber,
            originalWorkOrderDate: dayjs(workOrderData.startDateTime),
            originalWorkOrderDateType:
              WorkOrderSelectOptions.originalWODateTypes.find(
                (x) => x.key === "date"
              )?.value,
          }));
        }

        form.setFieldValue("branch", workOrderData.branch);
        form.setFieldValue("typeOfWork", getJobType(workOrderData.jobType));
        form.setFieldValue("residentialType", workOrderData.residentialType);
        form.setFieldValue("siteName", workOrderData.siteContact);
        form.setFieldValue("siteContact", workOrderData.siteContactPhoneNumber);

        form.setFieldValue("firstName", workOrderData.customerName);
        form.setFieldValue("streetAddress", workOrderData.address);
        form.setFieldValue("city", workOrderData.city);
        form.setFieldValue("email", workOrderData.email);
        form.setFieldValue("homePhone", workOrderData.phoneNumber);

        if (woSelectCallback) woSelectCallback();
      }
    },
    [
      form,
      WorkOrderSelectOptions.originalWODateTypes,
      woSelectCallback,
      setInputData,
    ]
  );

  return (
    <Group
      id={"title-orderInfo"}
      title={"Order Information"}
      style={{ minWidth: "18rem" }}
      contentStyle={{
        padding: "0.5rem",
        display: "flex",
        flexDirection: "column",
      }}
      className={styles.groupInfo}
    >
      <TextField
        id="originalWorkOrderNo"
        label="Original WO #"
        fieldName="originalWorkOrderNo"
        addonAfter={
          <div
            onClick={
              isReadOnly
                ? () => {}
                : () => {
                    setShowWOSearch(true);
                  }
            }
          >
            <SearchIcon className="hover:cursor-pointer" />
          </div>
        }
        disabled={isReadOnly}
      />

      <DateInputField
        id="originalWorkOrderDate"
        label="Original WO Date"
        fieldName="originalWorkOrderDate"
        onChange={setFieldsValue}
        value={inputData?.originalWorkOrderDate}
        typeValue={inputData?.originalWorkOrderDateType}
        isMobile={isMobile}
        disabled={isReadOnly}
      />

      <SelectField
        id="branch"
        label="Branch"
        fieldName="branch"
        required
        options={WorkOrderSelectOptions.serviceBranches}
        disabled={isReadOnly}
      />

      <SelectField
        id="typeOfWork"
        label="Type of Work"
        fieldName="typeOfWork"
        required
        options={WorkOrderSelectOptions.serviceType}
        disabled={isReadOnly}
      />

      <SelectField
        id="serviceReason"
        label="Service Reason"
        fieldName="serviceReason"
        required
        options={WorkOrderSelectOptions.serviceReason}
        disabled={isReadOnly}
      />

      <SelectField
        id="submittedBy"
        label="Requester Type"
        fieldName="submittedBy"
        required
        options={WorkOrderSelectOptions.serviceSubmittedBy}
        disabled={isReadOnly}
      />

      <SelectField
        id="requestedThru"
        label="Requested Thru"
        fieldName="requestedThru"
        required
        options={WorkOrderSelectOptions.serviceRequestedBy}
        disabled={isReadOnly}
      />

      <DateSelectField
        id="serviceRequestDate"
        label="Request Date"
        fieldName="serviceRequestDate"
        disabled={isReadOnly}
      />
      <SelectField
        id="residentialType"
        label="Residential Type"
        fieldName="residentialType"
        options={WorkOrderSelectOptions.residentialTypes}
        disabled={isReadOnly}
      />

      <SelectField
        id="highRisk"
        label="High Risk"
        fieldName="highRisk"
        options={WorkOrderSelectOptions.serviceHighRisk}
        disabled={isReadOnly}
      />

      <TextField
        id="siteName"
        label="Site Name"
        fieldName="siteName"
        //required={true}
        disabled={isReadOnly}
      />
      <TextField
        id="siteContact"
        label="Site Contact"
        fieldName="siteContact"
        //required={true}
        disabled={isReadOnly}
      />

      <SelectField
        id="remainingBalanceOwing"
        label="Is Balance Owing?"
        fieldName="remainingBalanceOwing"
        options={WorkOrderSelectOptions.serviceRemainingBalanceOwing}
        disabled={isReadOnly}
      />

      <AmountField
        id="amountOwing"
        fieldName="amountOwing"
        label="Amount Owing"
        disabled={isReadOnly}
      />

      <AmountField
        id="salesPrice"
        fieldName="salesPrice"
        label="Total Sales Amount"
        disabled={isReadOnly}
      />

      {!isNew ? (
        <>
          <DateSelectField
            id="createdAt"
            label="Created Date"
            fieldName="createdAt"
            disabled
          />

          <UserSelectField
            id="createdBy"
            label="Created By"
            fieldName="createdBy"
            size="small"
            value={inputData?.createdBy}
            disabled
            showAsLabel
          />
        </>
      ) : null}

      <WOSearchModal
        show={showWOSearch}
        setShow={setShowWOSearch}
        onSelectCallback={woSelectionCallback}
      />
    </Group>
  );
}
