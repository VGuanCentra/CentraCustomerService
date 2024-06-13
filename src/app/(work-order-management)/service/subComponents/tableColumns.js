import React from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";
import moment from "moment";

import {
  getPaginationPrefix,
  isSOSI,
  mapServiceEventStateToKey,
  openWOLink,
} from "app/utils/utils";
import OrderStatus from "app/(work-order-management)/shared/orderStatus";
import UserSelectWithConfirm from "app/components/atoms/formFields/userSelectWithConfirm";
import UserGroup from "app/components/atoms/userGroup/userGroup";
import {
  convertToLocaleDateTimell,
  convertToLocaleDateTimelll,
} from "app/utils/date";
import UserSelectField from "app/components/atoms/formFields/userSelect";
import { ServiceStates } from "app/utils/constants";
import Tooltip from "app/components/atoms/tooltip/tooltip";

export const initializeTableColumns = (
  isMobile,
  total,
  pageNumber,
  pageSize,
  eventHandlers,
  moduleName,
  dispatch,
  statusView,
  updateStatus,
  updateAssignedAdmin,
  permissions
) => {
  let _columns = [];

  if (isMobile) {
    _columns = [
      {
        title: (
          <div className="text-xs font-semibold mt-1">{`${getPaginationPrefix(
            total,
            pageNumber,
            pageSize
          )}${total?.toLocaleString()} record(s)`}</div>
        ),
        dataIndex: `serviceId`,
        key: `serviceId`,
        width: 100,
        render: (orderNumber, order) => (
          <div className="grid grid-cols-3 w-full gap-2 text-xs p-1 mt-2">
            <div className="col-span-1 text-sm font-bold">
              <DropdownButton
                id="dropdown-basic-button-lite"
                size="sm"
                title={
                  <span className="w-full text-sm font-bold p-0">
                    {orderNumber}
                  </span>
                }
                style={{
                  width: "100%",
                  marginTop: "-4px",
                  marginLeft: "-8px",
                  padding: "0px !important",
                }}
                className="flex justify-between w-full"
              >
                <Dropdown.Item
                  onClick={() => eventHandlers.onEditClick(order.serviceId)}
                >
                  <div className="text-sm w-full text-centraBlue mt-2  flex gap-1 items-center">
                    <i className="fa-solid fa-pen-to-square"></i>
                    <span className="pl-2 hover:underline">Open</span>
                  </div>
                </Dropdown.Item>

                <Dropdown.Item
                  onClick={() =>
                    eventHandlers.onShareLinkClick(
                      order.serviceId,
                      moduleName?.toLowerCase(),
                      dispatch
                    )
                  }
                >
                  <div className="text-sm w-full text-centraBlue mt-2  flex gap-1 items-center">
                    <i className="fas fa-link"></i>
                    <span className="pl-2  hover:underline">Copy Link</span>
                  </div>
                </Dropdown.Item>

                {permissions.canDelete && (
                  <Dropdown.Item
                    onClick={() =>
                      eventHandlers.onDeleteClick(
                        order.id,
                        moduleName?.toLowerCase(),
                        dispatch
                      )
                    }
                  >
                    <div className="text-sm w-full text-centraBlue mt-2  flex gap-1 items-center">
                      <i className="fas fa-trash"></i>
                      <span className="pl-2  hover:underline">Delete</span>
                    </div>
                  </Dropdown.Item>
                )}
              </DropdownButton>
            </div>
            <div className="col-span-2">
              <OrderStatus
                statusKey={mapServiceEventStateToKey(order.status)}
                statusList={ServiceStates}
                style={{ width: "100%" }}
                updateStatusCallback={updateStatus}
                orderId={order.id}
                handleStatusCancelCallback={() => {}}
                isReadOnly={!permissions.canEdit}
              />
            </div>
            <div className="col-span-1 font-semibold pt-2">Assigned Admin</div>
            <div className="col-span-2">
              <UserSelectWithConfirm
                orderId={order.id}
                value={order.assignedAdmin ?? "Unassigned"}
                size="small"
                fontSize="text-xs"
                onChange={updateAssignedAdmin}
                showAsLabel
              />
            </div>
            {order.originalWorkOrderNo ? (
              <>
                <div className="col-span-1 font-semibold">Original WO#</div>
                <div className="col-span-2">{order.originalWorkOrderNo}</div>
              </>
            ) : null}
            <div className="col-span-1 font-semibold">Created On</div>
            <div className="col-span-2">
              {convertToLocaleDateTimell(order.createdAt)}
            </div>
            <div className="col-span-1 font-semibold">Customer</div>
            <div className="col-span-2">{order.customerName}</div>
            <div className="col-span-1 font-semibold">Address</div>
            <div className="col-span-2">
              {`${order.streetAddress ? `${order.streetAddress}, ` : ""} ${
                order.city
              }`}
            </div>

            {order.assignedTechnicians?.length > 0 ? (
              <>
                <div className="col-span-1 font-semibold">Technician(s)</div>
                <div className="col-span-2">
                  <UserGroup
                    value={order.assignedTechnicians}
                    disabled
                    size="small"
                    showAsLabel
                    fontSize="text-xs"
                    isMultiSelect
                  />
                </div>
              </>
            ) : (
              ""
            )}
            <div className="col-span-1 font-semibold">Summary</div>
            <div className="col-span-2">{order.summary}</div>
          </div>
        ),
        sorter: (a, b) => a.id - b.id,
      },
    ];
  } else {
    _columns = [
      {
        title: `Service #`,
        dataIndex: `serviceId`,
        key: `serviceId`,
        width: 90,

        render: (orderNumber, order) => (
          <DropdownButton
            id="dropdown-basic-button-lite"
            size="sm"
            title={
              <span className="w-full" style={{ fontSize: "12px" }}>
                {orderNumber}
              </span>
            }
            style={{ width: "100%" }}
            className="flex justify-between w-full gap-4"
          >
            <Dropdown.Item
              onClick={() => eventHandlers.onEditClick(order.serviceId)}
            >
              <div className="text-sm w-full text-centraBlue mt-2  flex gap-1 items-center">
                <i className="fa-solid fa-pen-to-square"></i>
                <span className="pl-2 hover:underline">Open</span>
              </div>
            </Dropdown.Item>
            {/* {order.status === "Scheduled Service" ?? ( */}
            {/* <Dropdown.Item onClick={() => onViewInWebCalClick(order.serviceId)}>
                <div className="text-sm w-full text-centraBlue mt-2 flex gap-1 items-center">
                  <i className="fa-solid fa-calendar "></i>
                  <span className="pl-2 hover:underline">{`View in Web Calendar`}</span>
                </div>
              </Dropdown.Item> */}
            {/* )} */}

            <Dropdown.Item
              onClick={() =>
                eventHandlers.onShareLinkClick(
                  order.serviceId,
                  moduleName?.toLowerCase(),
                  dispatch
                )
              }
            >
              <div className="text-sm w-full text-centraBlue mt-2  flex gap-1 items-center">
                <i className="fas fa-link"></i>
                <span className="pl-2  hover:underline">Copy Link</span>
              </div>
            </Dropdown.Item>

            {permissions.canDelete && (
              <Dropdown.Item
                onClick={() =>
                  eventHandlers.onDeleteClick(
                    order.id,
                    moduleName?.toLowerCase(),
                    dispatch
                  )
                }
              >
                <div className="text-sm w-full text-centraBlue mt-2  flex gap-1 items-center">
                  <i className="fas fa-trash"></i>
                  <span className="pl-2  hover:underline">Delete</span>
                </div>
              </Dropdown.Item>
            )}
          </DropdownButton>
        ),
        sorter: (a, b) => moment(a.id) - moment(b.id),
      },
      {
        title: `WO #`,
        dataIndex: "originalWorkOrderNo",
        key: "originalWorkOrderNo",
        width: 70,
        render: (originalWorkOrderNo, order) => (
          <Tooltip title={"Open work order in web calendar"}>
            <div
              className="w-full flex-wrap truncate text-centraBlue cursor-pointer hover:underline"
              onClick={() => openWOLink(originalWorkOrderNo)}
            >
              {originalWorkOrderNo ? originalWorkOrderNo : ""}
            </div>
          </Tooltip>
        ),
        responsive: ["sm"],
      },
      {
        title: `Summary`,
        dataIndex: "summary",
        key: "summary",
        ellipsis: true,
        render: (summary, order) => (
          <div
            className="w-full flex-wrap truncate text-centraBlue cursor-pointer hover:underline"
            onClick={() => eventHandlers.onEditClick(order.serviceId)}
          >
            {summary ? summary : ""}
          </div>
        ),
        responsive: ["sm"],
      },
    ];

    if (
      statusView.length > 0 &&
      ServiceStates[statusView].columns.includes("City")
    ) {
      _columns.push({
        title: "City",
        dataIndex: "city",
        key: "city",
        width: 140,
        render: (text) => <>{text.toUpperCase()}</>,
        responsive: ["sm"],
      });
    }

    if (
      statusView === "" ||
      ServiceStates[statusView].columns.includes("Customer")
    ) {
      _columns.push({
        title: "Customer",
        key: "custName",
        width: 120,
        render: (text, order) => <>{`${order.firstName} ${order.lastName}`}</>,
        responsive: ["sm"],
      });
    }

    _columns.push({
      title: "Type Of Work",
      key: "typeOfWork",
      dataIndex: "typeOfWork",
      width: 100,
      responsive: ["sm"],
    });

    _columns.push({
      title: "SO/SI",
      key: "typeOfWork",
      dataIndex: "typeOfWork",
      width: 60,
      render: (text, order) => <>{isSOSI(text)}</>,
      responsive: ["sm"],
    });

    if (
      statusView === "" ||
      ServiceStates[statusView].columns.includes("Request Date")
    ) {
      _columns.push({
        title: `Request Date`,
        dataIndex: "serviceRequestDate",
        key: "serviceRequestDate",
        width: 110,
        render: (date) =>
          date ? (
            <div className=" text-gray-400">
              {convertToLocaleDateTimell(date)}
            </div>
          ) : (
            <></>
          ),
        sorter: (a, b) => moment(a.createdAt) - moment(b.createdAt),
        responsive: ["sm"],
      });
    }

    if (
      statusView === "" ||
      ServiceStates[statusView].columns.includes("Created By")
    ) {
      _columns.push({
        title: "Created By",
        key: "createdBy",
        dataIndex: "createdBy",
        width: 160,
        render: (createdBy, order) => (
          <UserSelectField
            value={createdBy}
            disabled
            size="small"
            showAsLabel
            fontSize="text-xs"
          />
        ),
        responsive: ["sm"],
      });
    }

    if (
      statusView.length > 0 &&
      ServiceStates[statusView].columns.includes("Scheduled Start")
    ) {
      _columns.push({
        title: `Scheduled Start`,
        dataIndex: "scheduleDate",
        key: "scheduleDate",
        width: 140,
        render: (date) => (
          <div className=" text-gray-400">
            {convertToLocaleDateTimelll(date)}
          </div>
        ),
        sorter: (a, b) => moment(a.scheduleDate) - moment(b.scheduleDate),
        responsive: ["sm"],
      });
    }

    if (
      statusView.length > 0 &&
      ServiceStates[statusView].columns.includes("Scheduled End")
    ) {
      _columns.push({
        title: `Scheduled End`,
        dataIndex: "scheduleEndDate",
        key: "scheduleEndDate",
        width: 140,
        render: (date) => (
          <div className=" text-gray-400">
            {convertToLocaleDateTimelll(date)}
          </div>
        ),
        sorter: (a, b) => moment(a.scheduleEndDate) - moment(b.scheduleEndDate),
        responsive: ["sm"],
      });
    }

    if (
      statusView.length > 0 &&
      ServiceStates[statusView].columns.includes("Assigned Technicians")
    ) {
      _columns.push({
        title: `Assigned Technician(s)`,
        dataIndex: "assignedTechnicians",
        key: "assignedTechnicians",
        width: 140,
        render: (assignedTechnicians, order) => (
          <UserGroup
            value={assignedTechnicians}
            disabled
            size="small"
            showAsLabel
            fontSize="text-xs"
            isMultiSelect
          />
        ),
        responsive: ["sm"],
      });
    }

    if (
      statusView === "" ||
      ServiceStates[statusView].columns.includes("Created On")
    ) {
      _columns.push({
        title: `Created On`,
        dataIndex: "createdAt",
        key: "createdAt",
        width: 95,
        render: (date) => (
          <div className=" text-gray-400">
            {" "}
            {convertToLocaleDateTimell(date)}
          </div>
        ),
        defaultSortOrder: "descend",
        sorter: (a, b) => moment(a.createdAt) - moment(b.createdAt),
        responsive: ["sm"],
      });
    }
    if (
      statusView === "" ||
      ServiceStates[statusView].columns.includes("Assigned Admin")
    ) {
      _columns.push({
        title: "Assigned Admin",
        key: "assignedAdmin",
        dataIndex: "assignedAdmin",
        key: "assignedAdmin",
        width: 180,
        render: (assignedAdmin, order) => (
          <UserSelectWithConfirm
            orderId={order.id}
            value={assignedAdmin}
            size="small"
            fontSize="text-xs"
            onChange={updateAssignedAdmin}
            showAsLabel={!permissions.canEdit}
          />
        ),
        responsive: ["sm"],
      });
    }

    _columns.push({
      title: "Status",
      key: "status",
      dataIndex: "status",
      key: "status",
      width: 170,
      render: (status, order) => (
        <div className="text-center">
          <OrderStatus
            statusKey={mapServiceEventStateToKey(status)}
            statusList={ServiceStates}
            style={{ width: "100%" }}
            updateStatusCallback={updateStatus}
            orderId={order.id}
            handleStatusCancelCallback={() => {}}
            isReadOnly={!permissions.canEdit}
          />
        </div>
      ),
    });
  }

  return _columns;
};
