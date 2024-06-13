"use client";
import React, { useCallback, useState } from "react";

import { Form, Button, Tag, Input, DatePicker, Select, Space } from 'antd';
const { TextArea } = Input;
const { Option } = Select;

export default function TimesheetForm({
  onFinish,
  onFinishFailed,
  defaultTimesheetData,
  form,
  forceUpdate,
  isFormEditable,
  Status,
  workTypes,
  isNew,
  periodSelectionOptions,
  WorkStatusOptions,
  setShowCreate,
  setIsFormEditable,
  loggedInUser,
  workorderOptions,
  serviceOptions,
  supplyOnlyOptions,
  shopDrawingOptions,
  estimationOptions,
  setWorkType,
  warning
}) {

  const [isEditMode, setIsEditMode] = useState(false);

  const onWorkTypeChange = (val) => {
    setWorkType(val);
  }

  const HourOptions = [
    { value: 0, label: "0" },
    { value: 5, label: "5" },
    { value: 10, label: "10" },
    { value: 15, label: "15" },
    { value: 20, label: "20" },
    { value: 25, label: "25" },
    { value: 30, label: "30" },
    { value: 35, label: "35" },
    { value: 40, label: "40" },
    { value: 45, label: "45" },
    { value: 50, label: "50" },
    { value: 55, label: "55" },
    { value: 60, label: "60" },
    { value: 90, label: "90" },
    { value: 120, label: "120" },
    { value: 150, label: "150" },
    { value: 180, label: "180" },
    { value: 210, label: "210" },
    { value: 240, label: "240" },
    { value: 300, label: "300" },
    { value: 330, label: "330" },
    { value: 360, label: "360" },
    { value: 390, label: "390" },
    { value: 420, label: "420" },
    { value: 450, label: "450" },
    { value: 480, label: "480" },
    { value: 510, label: "510" },
    { value: 540, label: "540" },
    { value: 570, label: "570" },
    { value: 600, label: "600" },
    { value: 630, label: "630" },
    { value: 660, label: "660" },
    { value: 690, label: "690" },
    { value: 720, label: "720" },
  ]

  const onEditClick = useCallback(() => {    
    const isActive = periodSelectionOptions?.find(x => x.value === defaultTimesheetData?.period)?.isActive;
    setIsEditMode(true);
    if (isActive) {
      setIsFormEditable(true);      
    } else {
      warning("Unable to edit timesheet, pay period is already closed.");
    }
  }, [setIsFormEditable, periodSelectionOptions, defaultTimesheetData, warning]);

  return (
    <Form
      onFinish={(values) => onFinish(values, isEditMode)}
      onFinishFailed={(values) => onFinishFailed(values, isEditMode)}
      className="w-[41rem]"
      initialValues={defaultTimesheetData}
      form={form}
      key={forceUpdate ? 'forceUpdate' : 'normal'}
      disabled={!isFormEditable}
    >
      <div className="flex flex-row justify-between mb-3">
        <div>{isNew ? <Tag color={"#7FCB27"}>New Timesheet</Tag> : <Tag color={Status[defaultTimesheetData?.status]}>{`Timesheet ${defaultTimesheetData?.status}`}</Tag>}</div>
        <div></div>
      </div>
      <div className="flex flex-row justify-between pt-3 border-t border-gray-300 border-dotted">        
        <div className="">
          <div className="pt-1">{`${loggedInUser?.name} (${loggedInUser ? loggedInUser?.departments[0] : ""})`}</div>          
        </div>  
        <div className="flex flex-row justify-between">
          <div className="mr-4 mt-1">
            Pay Period
          </div>
          <Form.Item
            name="period"
            rules={[{ required: true }]}
            style={{ marginBottom: "1rem" }}
          >
            <Select
              style={{ width: "14rem" }}
              options={periodSelectionOptions}
            />
          </Form.Item>
        </div>
      </div>      
      <div className="border-t border-gray-300 border-dotted mb-3" />
      <div className="flex flex-row justify-between mr-2">
        <div className="flex flex-row w-[21rem]">
          <div className="w-[7rem] pt-1 text-right pr-4">Work Type</div>
          <div className="w-[12rem]">
            <Form.Item
              name="workType"
              rules={[{ required: true }]}
              style={{ marginBottom: 0 }}
            >
              <Select
                style={{ width: "12rem" }}
                onChange={onWorkTypeChange}
              >
                {workTypes?.map((wt, index) => {
                  return (
                    <Option
                      key={index}
                      value={wt.label}
                      className={`mb-[2px]`}
                      // style={{
                      //   backgroundColor: wt.hexBackgroundColor,
                      //   color: wt.hexForegroundColor
                      // }}
                    >
                      {wt.label}
                    </Option>)
                })}
              </Select>
            </Form.Item>
          </div>
        </div>

        <div className="flex flex-row justify-between">
          <div className="w-[7rem] pt-1 text-right pr-4">Work Order #</div>
          <div className="w-[12rem]">
            <Form.Item
              name="serviceWO"
              rules={[{ required: true }]}
              style={{ marginBottom: 0 }}
            >
              <Select
                style={{ width: "12.5rem" }}
                options={serviceOptions}
                showSearch
              />
            </Form.Item>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between mt-2">
        <div className="flex flex-row w-[20.5rem]">
          <div className="w-[7rem] pt-1 text-right pr-4">Date Worked</div>
          <div className="w-[12rem]">
            <Form.Item
              name="dateWorked"
              rules={[{ required: true }]}
              style={{ marginBottom: 0 }}
            >
              <DatePicker
                className="w-[12rem]"
              />
            </Form.Item>
          </div>
        </div>
        <div className="flex flex-row justify-between mr-2">
          <div className="w-[9.5rem] pt-1 text-right pr-4">Work Status/Hours</div>
          <div className="w-[12.5rem]">
            <Space.Compact>
              <Form.Item
                name="workStatus"
                rules={[{ required: true }]}
                style={{ marginBottom: 0 }}
              >
                <Select
                  style={{ width: "8rem" }}
                  options={WorkStatusOptions}
                />
              </Form.Item>
              <Form.Item
                name="hours"
                style={{ marginBottom: 0 }}
              >
                <Select
                  style={{ width: "4.5rem" }}
                  options={HourOptions}
                />
              </Form.Item>
            </Space.Compact>
          </div>
        </div>
      </div>

      {false &&
        <div className="flex flex-row justify-between mt-2">
          <div className="flex flex-row w-[20rem]">
            <div className="w-[7rem] pt-1 text-right pr-4">CRLCEL WO#</div>
            <div className="w-[12rem]">
              <Form.Item
                name="crlcelWO"
                style={{ marginBottom: 0 }}
              >
                <Select
                  style={{ width: "12rem" }}
                  options={estimationOptions}
                  showSearch
                />
              </Form.Item>
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="w-[7.8rem] pt-1">Supply Only WO#</div>
            <div className="w-[12rem]">
              <Form.Item
                name="supplyOnlyWO"
                style={{ marginBottom: 0 }}
              >
                <Select
                  style={{ width: "12rem" }}
                  options={supplyOnlyOptions}
                  showSearch
                />
              </Form.Item>
            </div>
          </div>
        </div>
      }
      {false &&
        <div className="flex flex-row justify-between mt-2">
          <div className="flex flex-row w-[20rem]">
            <div className="w-[7rem] pt-1 text-right pr-4">Service WO#</div>
            <div className="w-[12rem]">
              <Form.Item
                name="serviceWO"
                style={{ marginBottom: 0 }}
              >
                <Select
                  style={{ width: "12rem" }}
                  options={serviceOptions}
                  showSearch
                />
              </Form.Item>
            </div>
          </div>          
          <div className="flex flex-row justify-between">
            <div className="w-[8.5rem] pt-1">Shop Drawing WO#</div>
            <div className="w-[12rem]">
              <Form.Item
                name="shopDrawingsWO"
                style={{ marginBottom: 0 }}
              >
                <Select
                  style={{ width: "12rem" }}
                  options={shopDrawingOptions}
                  showSearch
                />
              </Form.Item>
            </div>
          </div>          
        </div>
      }
      <div className="flex flex-row mt-2 w-[41rem]">
        <div className="flex flex-row justify-between">
          <div className="w-[7rem] pt-1 text-right pr-4">Notes</div>
          <div className="w-[34rem]">
            <Form.Item
              name="notes"
              style={{ marginBottom: 0 }}
            >
              <TextArea
                rows={4}
                name="notes"
              />
            </Form.Item>
          </div>
        </div>
        <div className="flex flex-row justify-between hidden">
          <div className="w-[7rem] pt-1 text-right pr-4">Notes</div>
          <div className="w-[34rem]">
            <Form.Item
              name="key"
              style={{ marginBottom: 0 }}
            >
              <TextArea
                rows={4}
                name="key"
              />
            </Form.Item>
          </div>
        </div>
      </div>
      {defaultTimesheetData?.validationFailureReason &&
        <div className="flex flex-row mt-2 w-[41rem]">
          <div className="flex flex-row justify-between">
            <div className="w-[7rem] pt-1 text-right pr-4">Validation Error</div>
            <div className="w-[34rem]">
              <Form.Item
                name="validationFailureReason"
                style={{ marginBottom: 0 }}
              >
                <TextArea
                  rows={2}
                  status="error"
                  className="text-neutral-400"
                />
              </Form.Item>
            </div>
          </div>
        </div>
      }
      <div className="mt-3 flex flex-row justify-end">
        <div className="flex flex-row justify-end">          
          <Button
            className="mr-2"
            onClick={() => { setShowCreate(false); }}
            disabled={false}
          >
            Cancel
          </Button>
          {!isFormEditable &&
            <Button
              className="mr-2"
              type="primary"
              onClick={onEditClick}
              disabled={true} // Will re-enable when api endpoint is fixed
            >
              Edit
            </Button>
          }
          {isFormEditable &&
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
            >
              Submit
            </Button>
          }
        </div>
      </div>
    </Form>
  );
}
