"use client";
import React, { useEffect, useState } from "react";

import Group from "app/components/atoms/workorderComponents/group";
import UserSelectField from "app/components/atoms/formFields/userSelect";
import SelectField from "app/components/atoms/formFields/ts/selectField";
import DateSelectField from "app/components/atoms/formFields/ts/dateSelectField";

import TextAreaField from "app/components/atoms/formFields/ts/textAreaField";

import { ProductionRemakeOptions } from "app/utils/constants";

export default function RemakeInfo(props) {
  const { inputData, isNew = false, form, isReadOnly = false } = props;

  const [
    remakeDepartmentResponsibleSectionOptions,
    setRemakeDepartmentResponsibleSectionOptions,
  ] = useState([]);

  const [remakeReasonOptions, setRemakeReasonOptions] = useState([]);

  const [remakeReasonDetailOptions, setRemakeReasonDetailOptions] = useState(
    []
  );

  useEffect(() => {
    if (inputData) {
      // for initial values

      // department responsible section field
      setRemakeDepartmentResponsibleSectionOptions((prev) => {
        return ProductionRemakeOptions.find(
          (x) => x.key === "departmentResponsible"
        )
          ?.options?.find((x) => x.value === inputData.departmentResponsible)
          ?.options?.map(({ key, value }) => ({ key, value }));
      });

      // reason field options
      setRemakeReasonOptions((prev) => {
        return ProductionRemakeOptions.find((x) => x.key === "reasonCategory")
          ?.options?.find((x) => x.value === inputData.reasonCategory)
          ?.options?.map(({ key, value }) => ({ key, value }));
      });

      // reason detail field options
      setRemakeReasonDetailOptions((prev) => {
        return ProductionRemakeOptions.find((x) => x.key === "reasonCategory")
          ?.options?.find((x) => x.value === inputData.reasonCategory)
          ?.options?.find((x) => x.value === inputData.reason)
          ?.options?.map(({ key, value }) => ({ key, value }));
      });
    }
  }, [inputData]);

  const remakeProductOptions = ProductionRemakeOptions.find(
    (x) => x.key === "product"
  )?.options;

  const remakeDepartmentResponsibleOptions = ProductionRemakeOptions.find(
    (x) => x.key === "departmentResponsible"
  )?.options?.map(({ key, value }) => ({ key, value }));

  const remakeReasonCategoryOptions = ProductionRemakeOptions.find(
    (x) => x.key === "reasonCategory"
  )?.options?.map(({ key, value }) => ({ key, value }));

  const onDeptRespChange = (_deptResponsible) => {
    let deptRespSection = ProductionRemakeOptions.find(
      (x) => x.key === "departmentResponsible"
    )
      ?.options?.find((x) => x.value === _deptResponsible)
      ?.options?.map(({ key, value }) => ({ key, value }));

    setRemakeDepartmentResponsibleSectionOptions(deptRespSection);

    if (
      deptRespSection === null ||
      deptRespSection === undefined ||
      deptRespSection?.length === 0
    ) {
      /// reset the departmentResponsibleSection field
      form.setFieldValue("departmentResponsibleSection", "");
    }
  };

  const onReasonCatChange = (_reasonCategory) => {
    let _reasonOptions = ProductionRemakeOptions.find(
      (x) => x.key === "reasonCategory"
    )
      ?.options?.find((x) => x.value === _reasonCategory)
      ?.options?.map(({ key, value }) => ({ key, value }));

    setRemakeReasonOptions(_reasonOptions);
    form.setFieldValue("reason", "");
  };

  const onReasonChange = (_reason) => {
    let _reasonCategory = form.getFieldValue("reasonCategory");

    let _reasonDetailOptions = ProductionRemakeOptions.find(
      (x) => x.key === "reasonCategory"
    )
      ?.options?.find((x) => x.value === _reasonCategory)
      ?.options?.find((x) => x.value === _reason)
      ?.options?.map(({ key, value }) => ({ key, value }));

    setRemakeReasonDetailOptions(_reasonDetailOptions);

    form.setFieldValue("reasonDetail", "");
  };

  return (
    <Group
      title={"Remake Information"}
      style={{ minWidth: "18rem" }}
      contentStyle={{
        padding: "0.5rem",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SelectField
        id="product"
        label="Product"
        fieldName="product"
        options={remakeProductOptions}
        disabled={isReadOnly}
      />
      <DateSelectField
        id="scheduleDate"
        label="Schedule Date"
        fieldName="scheduleDate"
        disabled={isReadOnly}
      />
      <SelectField
        id="departmentResponsible"
        label="Department Responsible"
        fieldName="departmentResponsible"
        options={remakeDepartmentResponsibleOptions}
        onChange={onDeptRespChange}
        disabled={isReadOnly}
      />

      {remakeDepartmentResponsibleSectionOptions?.length > 0 && (
        <SelectField
          id="departmentResponsibleSection"
          label="Section"
          fieldName="departmentResponsibleSection"
          options={remakeDepartmentResponsibleSectionOptions}
          disabled={isReadOnly}
        />
      )}

      <SelectField
        id="reasonCategory"
        label="Reason Category"
        fieldName="reasonCategory"
        options={remakeReasonCategoryOptions}
        onChange={onReasonCatChange}
        disabled={isReadOnly}
      />

      {remakeReasonOptions?.length > 0 && (
        <SelectField
          id="reason"
          label="Reason"
          fieldName="reason"
          options={remakeReasonOptions}
          onChange={onReasonChange}
          disabled={isReadOnly}
        />
      )}

      {remakeReasonDetailOptions?.length > 0 && (
        <SelectField
          id="reasonDetail"
          label="Reason Detail"
          fieldName="reasonDetail"
          options={remakeReasonDetailOptions}
          disabled={isReadOnly}
        />
      )}

      <TextAreaField
        id="notes"
        label="Notes"
        fieldName="notes"
        minRows={4}
        maxRows={6}
        disabled={isReadOnly}
      />

      {!isNew ? (
        <>
          <DateSelectField
            id="createdAt"
            label="Requested Date"
            fieldName="createdAt"
            disabled
          />
          <UserSelectField
            id="createdBy"
            label="Requested By"
            fieldName="createdBy"
            size="small"
            value={inputData?.createdBy}
            disabled
            showAsLabel
          />
        </>
      ) : null}
    </Group>
  );
}
