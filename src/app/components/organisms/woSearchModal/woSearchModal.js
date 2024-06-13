"use client";
import React, { useCallback, useEffect, useState } from "react";

import { Button, Form, Modal, Popconfirm, Select, Space, Table } from "antd";
import { ProductionStates, SearchCategories } from "app/utils/constants";

import SelectField from "app/components/atoms/formFields/ts/selectField";
import TextField from "app/components/atoms/formFields/ts/textField";
import { searchProductionDetailed } from "app/api/productionApis";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { mapProductionStateToKey, openWOLink } from "app/utils/utils";
import OrderStatus from "app/(work-order-management)/shared/orderStatus";

import moment from "moment";
import Tooltip from "app/components/atoms/tooltip/tooltip";
import { searchSlice } from "app/redux/calendarAux";

export default function WOSearchModal({ show, setShow, onSelectCallback }) {
  const category = "Production";
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { isMobile } = useSelector((state) => state.app);

  const options = SearchCategories.find((x) => x.value === category).fields;

  const initialSearchFields = isMobile ? [] : _.map(options, "value");

  const { searchResults } = useSelector((state) => state.search);

  const [selectedSearchFields, setSelectedSearchFields] =
    useState(initialSearchFields);

  const filteredOptions = options.filter(
    (option) => !selectedSearchFields.includes(option.value)
  );

  const [isLoading, setIsLoading] = useState(false);
  const [columns, setColumns] = useState([]);

  const onSearchClick = useCallback(async () => {
    let searchPayload = _.cloneDeep(form.getFieldsValue(true));
    setIsLoading(true);
    await searchProductionDetailed(searchPayload);
    setIsLoading(false);
  }, [form]);

  const onResetClick = useCallback(async () => {
    dispatch(searchSlice.actions.updateSearchResults([]));
    form.resetFields();
  }, [form, dispatch]);

  const initializeColumns = useCallback(
    (states) => {
      let _columns = [];

      if (isMobile) {
        _columns = [
          {
            title: `WO #`,
            dataIndex: "workOrderNumber",
            key: "workOrderNumber",
            width: 20,
            render: (workOrderNumber) => <span>{workOrderNumber}</span>,
            responsive: ["sm", "xs"],
            sorter: (a, b) =>
              a.workOrderNumber.localeCompare(b.workOrderNumber),
          },
          {
            title: `City`,
            dataIndex: "city",
            key: "city",
            width: 20,
            render: (city) => <span>{city}</span>,
            responsive: ["sm", "xs"],
            sorter: (a, b) => a.city.localeCompare(b.city),
          },

          {
            title: "Actions",
            width: 20,
            render: (action, woData) => (
              <Space>
                <span className="text-centraBlue hover:underline hover:cursor-pointer">
                  <Tooltip title={"Open work order in web calendar"}>
                    <div
                      className="w-full flex-wrap truncate text-centraBlue cursor-pointer hover:underline"
                      onClick={
                        woData.workOrderNumber
                          ? () => openWOLink(woData.workOrderNumber)
                          : null
                      }
                    >
                      View
                    </div>
                  </Tooltip>
                </span>

                <Popconfirm
                  placement="left"
                  title={`Select Work Order ${woData.workOrderNumber}?`}
                  description={
                    <div className="pb-2 w-[200]">
                      <div>
                        This will also auto-populate & overwrite some of your
                        current inputs.
                      </div>
                      Proceed anyway?
                    </div>
                  }
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => onSelectCallback(woData)}
                >
                  <span className="text-centraBlue hover:underline hover:cursor-pointer">
                    Select
                  </span>
                </Popconfirm>
              </Space>
            ),
          },
        ];
      } else {
        _columns = [
          {
            title: `WO #`,
            dataIndex: "workOrderNumber",
            key: "workOrderNumber",
            width: 20,
            render: (workOrderNumber) => <span>{workOrderNumber}</span>,
            responsive: ["sm", "xs"],
            sorter: (a, b) =>
              a.workOrderNumber.localeCompare(b.workOrderNumber),
          },
          {
            title: `Branch`,
            dataIndex: "branch",
            key: "branch",
            width: 20,
            render: (branch) => <span>{branch}</span>,
            responsive: ["sm", "xs"],
            sorter: (a, b) => a.branch.localeCompare(b.branch),
          },
          {
            title: `Customer Name`,
            dataIndex: "customerName",
            key: "customerName",
            width: 60,
            render: (customerName) => <span>{customerName}</span>,
            responsive: ["sm", "xs"],
            sorter: (a, b) => a.customerName.localeCompare(b.customerName),
          },
          {
            title: `Job Type`,
            dataIndex: "jobType",
            key: "jobType",
            width: 20,
            render: (jobType) => <span>{jobType}</span>,
            responsive: ["md"],
            sorter: (a, b) => a.jobType.localeCompare(b.jobType),
          },
          {
            title: `Residential Type`,
            dataIndex: "residentialType",
            key: "residentialType",
            width: 30,
            render: (residentialType) => <span>{residentialType}</span>,
            responsive: ["md"],
            sorter: (a, b) =>
              a.residentialType.localeCompare(b.residentialType),
          },
          {
            title: `City`,
            dataIndex: "city",
            key: "city",
            width: 20,
            render: (city) => <span>{city}</span>,
            responsive: ["sm", "xs"],
            sorter: (a, b) => a.city.localeCompare(b.city),
          },
          {
            title: `Address`,
            dataIndex: "address",
            key: "address",
            width: 30,
            render: (address) => <span>{address}</span>,
            responsive: ["sm", "Xs"],
            sorter: (a, b) => a.address.localeCompare(b.address),
          },
          {
            title: `Email`,
            dataIndex: "email",
            key: "email",
            width: 40,
            render: (email) => <span>{email}</span>,
            responsive: ["sm"],
            sorter: (a, b) => a.email.localeCompare(b.email),
          },
          {
            title: `Schedule Date`,
            dataIndex: "startDateTime",
            key: "startDateTime",
            width: 30,
            render: (startDateTime) => (
              <span>{moment(startDateTime).format("ll")}</span>
            ),
            responsive: ["sm"],
            sorter: (a, b) => moment(a.startDateTime) - moment(b.startDateTime),
          },
          {
            title: `Status`,
            dataIndex: "currentStateName",
            key: "currentStateName",
            width: 40,
            render: (currentStateName) => (
              <>
                {currentStateName && (
                  <OrderStatus
                    statusKey={mapProductionStateToKey(currentStateName)}
                    style={isMobile ? null : { margin: "0 0.5rem 0 0.5rem" }}
                    statusList={states}
                    isReadOnly
                  />
                )}
              </>
            ),
            responsive: ["sm"],
            sorter: (a, b) =>
              a.currentStateName.localeCompare(b.currentStateName),
          },
          {
            title: "Actions",
            width: 30,
            render: (action, woData) => (
              <Space>
                <span className="text-centraBlue hover:underline hover:cursor-pointer">
                  <Tooltip title={"Open work order in web calendar"}>
                    <div
                      className="w-full flex-wrap truncate text-centraBlue cursor-pointer hover:underline"
                      onClick={
                        woData.workOrderNumber
                          ? () => openWOLink(woData.workOrderNumber)
                          : null
                      }
                    >
                      View
                    </div>
                  </Tooltip>
                </span>

                <Popconfirm
                  placement="left"
                  title={`Select Work Order ${woData.workOrderNumber}?`}
                  description={
                    <div className="pb-2 w-[200]">
                      <div>
                        This will also auto-populate & overwrite some of your
                        current inputs.
                      </div>
                      Proceed anyway?
                    </div>
                  }
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => onSelectCallback(woData)}
                >
                  <span className="text-centraBlue hover:underline hover:cursor-pointer">
                    Select
                  </span>
                </Popconfirm>
              </Space>
            ),
            responsive: ["sm"],
          },
        ];
      }

      setColumns(_columns);
    },
    [isMobile, onSelectCallback]
  );
  const hasResults = searchResults?.data?.length > 0;

  useEffect(() => {
    initializeColumns(ProductionStates);
  }, [initializeColumns]);

  return (
    <Modal
      title={"Search Work Orders"}
      width={isMobile ? "100vw" : "92vw"}
      open={show}
      okButtonProps={{ style: { display: "none" } }}
      cancelButtonProps={{ style: { display: "none" } }}
      destroyOnClose
      onCancel={() => {
        setSelectedSearchFields(initialSearchFields);
        setShow(false);
        onResetClick();
      }}
      centered
      okText="Select Work Order"
      footer={null}
      bodyStyle={isMobile ? { maxHeight: "90vh" } : null}
    >
      <div
        className={`mt-4 flex w-full h-full ${
          isMobile ? "flex-col overflow-auto" : "space-x-12 "
        }`}
        style={isMobile ? { maxHeight: "80vh" } : null}
      >
        <div
          className={`flex flex-col space-y-2 pb-2 h-full ${
            isMobile ? "w-full" : "w-1/4"
          }`}
        >
          <Form
            form={form}
            name="SearchWOForm"
            colon={false}
            labelWrap
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div className="flex flex-col w-full h-full justify-stretch">
              <Select
                placeholder="Select fields to search..."
                options={filteredOptions}
                onChange={setSelectedSearchFields}
                value={selectedSearchFields}
                mode="multiple"
                className="w-full"
                allowClear
              />

              <div className="mt-4 flex flex-col">
                {selectedSearchFields.map((val) => {
                  let sf = options.find((o) => o.value === val); // corrected comparison operator from '=' to '==='

                  if (sf) {
                    return (
                      <div
                        key={sf.key}
                        className="flex flex-row justify-between"
                      >
                        {!sf.selectionOptions && (
                          // <Input id={sf.key} name={sf.key} size="small" />
                          <TextField
                            id={sf.key}
                            label={sf.label}
                            fieldName={sf.key}
                          />
                        )}

                        {sf.selectionOptions?.length > 0 && (
                          <SelectField
                            id={sf.key}
                            label={sf.label}
                            fieldName={sf.key}
                            onChange={(val) => handleOptionsChange(sf.key, val)}
                            options={sf.selectionOptions
                              .concat({
                                key: "missingData",
                                value: "Missing Data",
                              })
                              .map((x) => {
                                return {
                                  value: x.value,
                                  label: x.value,
                                };
                              })} // Allow searching for empty values
                          />
                        )}
                      </div>
                    );
                  }
                })}
              </div>

              {selectedSearchFields.length > 0 && (
                <div className="flex justify-between">
                  <Button
                    className="mt-4"
                    onClick={onResetClick}
                    disabled={selectedSearchFields.length === 0}
                    loading={isLoading}
                  >
                    Reset
                  </Button>
                  <Button
                    className="mt-4"
                    type={"primary"}
                    onClick={onSearchClick}
                    disabled={isLoading || selectedSearchFields.length === 0}
                    loading={isLoading}
                  >
                    Search
                  </Button>
                </div>
              )}
            </div>
          </Form>
        </div>

        <div className="flex flex-col w-full h-full">
          <div className="h-full w-full border-gray-400">
            <Table
              dataSource={searchResults?.data}
              columns={columns}
              size="small"
              pagination={{
                pageSize: 20,
              }}
              loading={isLoading}
              scroll={{ y: "calc(100vh - 280px)" }}
              style={{
                height: "100%",
                width: "100%",
                overflow: "auto",
                fontSize: "12px",
              }}
              height="100%"
            ></Table>
          </div>
          {/* <div className="h-1/2 overflow-auto">
            {selectedWorkOrder && <ProductionWorkOrder></ProductionWorkOrder>}
          </div> */}
        </div>
      </div>
    </Modal>
  );
}
