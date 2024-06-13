import React from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";
import moment from "moment";

import {
  getPaginationPrefix,
  mapRemakeRowStateToKey,
  openWOLink,
} from "app/utils/utils";
import OrderStatus from "app/(work-order-management)/shared/orderStatus";
import Tooltip from "app/components/atoms/tooltip/tooltip";
import { RemakeRowStates } from "app/utils/constants";

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
          )}${total.toLocaleString()} record(s)`}</div>
        ),
        dataIndex: `remakeId`,
        key: `remakeId`,
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
                  onClick={() => eventHandlers.onEditClick(order.remakeId)}
                >
                  <div className="text-sm w-full text-centraBlue mt-2  flex gap-1 items-center">
                    <i className="fa-solid fa-pen-to-square"></i>
                    <span className="pl-2 hover:underline">Open</span>
                  </div>
                </Dropdown.Item>

                <Dropdown.Item
                  onClick={() =>
                    eventHandlers.onShareLinkClick(
                      order.remakeId,
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

                {/* TODO: Create delete remake function?
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
                  </Dropdown.Item> */}
              </DropdownButton>
            </div>
            <div className="col-span-2">
              <OrderStatus
                statusKey={mapRemakeRowStateToKey(order.status)}
                statusList={RemakeRowStates}
                style={{ width: "100%" }}
                updateStatusCallback={updateStatus}
                orderId={order.id}
                handleStatusCancelCallback={() => {}}
                isReadOnly={!permissions.canEdit}
              />
            </div>

            <div className="col-span-1 font-semibold">Original WO#</div>
            <div className="col-span-2">{order.workOrderNo}</div>
            <div className="col-span-1 font-semibold">Item #</div>
            <div className="col-span-2">{order.itemNo}</div>
            <div className="col-span-1 font-semibold">SubQty</div>
            <div className="col-span-2">{order.subQty}</div>
            <div className="col-span-1 font-semibold">System</div>
            <div className="col-span-2">{order.systemValue}</div>
            <div className="col-span-1 font-semibold">Size</div>
            <div className="col-span-2">{order.size}</div>
            <div className="col-span-1 font-semibold">Description</div>
            <div className="col-span-2">{order.description}</div>
            <div className="col-span-1 font-semibold">Product</div>
            <div className="col-span-2">{order.product}</div>
            <div className="col-span-1 font-semibold">Scheduled Date</div>
            <div className="col-span-2">
              {moment(order.scheduleDate).format("ll")}
            </div>
          </div>
        ),
        sorter: (a, b) => a.id - b.id,
      },
    ];
  } else {
    _columns = [
      {
        title: `Remake #`,
        dataIndex: `remakeId`,
        key: `remakeId`,
        width: 90,
        render: (remakeId, order) => (
          <DropdownButton
            id="dropdown-basic-button-lite"
            size="sm"
            title={<span className="w-full">{remakeId}</span>}
            style={{ width: "100%" }}
            className="flex justify-between w-full gap-4"
          >
            <Dropdown.Item
              onClick={() => eventHandlers.onEditClick(order.remakeId)}
            >
              <div className="text-sm w-full text-centraBlue mt-2  flex gap-1 items-center">
                <i className="fa-solid fa-pen-to-square"></i>
                <span className="pl-2 hover:underline">{`Open ${moduleName}`}</span>
              </div>
            </Dropdown.Item>

            <Dropdown.Item
              onClick={() => eventHandlers.onShareLinkClick(order.remakeId)}
            >
              <div className="text-sm w-full text-centraBlue mt-2  flex gap-1 items-center">
                <i className="fas fa-link"></i>
                <span className="pl-2  hover:underline">Copy Link</span>
              </div>
            </Dropdown.Item>
          </DropdownButton>
        ),

        sorter: (a, b) => parseInt(a.remakeId) - parseInt(b.remakeId),
      },
      {
        title: `WO #`,
        dataIndex: "workOrderNo",
        key: "workOrderNo",
        width: 80,
        render: (originalWorkOrderNo) => (
          <Tooltip title="Open Work Order in New Tab">
            <div
              className="w-full flex-wrap truncate text-centraBlue cursor-pointer hover:underline"
              onClick={() => openWOLink(originalWorkOrderNo)}
            >
              {originalWorkOrderNo ? originalWorkOrderNo : ""}
            </div>
          </Tooltip>
        ),
      },
      {
        title: `Item`,
        dataIndex: "itemNo",
        key: "itemNo",
        width: 70,
        render: (itemNo, order) => (
          <div
            className="w-full flex-wrap truncate text-centraBlue cursor-pointer hover:underline"
            onClick={() => eventHandlers.onEditClick(order.remakeId)}
          >
            {itemNo}
          </div>
        ),
      },
      {
        title: `SubQty`,
        dataIndex: "subQty",
        key: "subQty",
        width: 70,
      },
      {
        title: `System`,
        dataIndex: "systemValue",
        key: "systemValue",
        width: 70,
      },
      {
        title: `Size`,
        dataIndex: "size",
        key: "size",
        width: 100,
      },
      {
        title: `Description`,
        dataIndex: "description",
        key: "description",
        width: 100,
        ellipsis: true,
      },
      {
        title: `Product`,
        dataIndex: "product",
        key: "product",
        width: 80,
      },
    ];

    if (
      statusView.length > 0 &&
      RemakeRowStates[statusView].columns.includes("City")
    ) {
      _columns.push({
        title: "City",
        dataIndex: "city",
        key: "city",
        width: 150,
        render: (text) => <>{text.toUpperCase()}</>,
      });
    }

    if (
      statusView === "" ||
      RemakeRowStates[statusView].columns.includes("Scheduled Date")
    ) {
      _columns.push({
        title: `Scheduled Date`,
        dataIndex: "scheduleDate",
        key: "scheduleDate",
        width: 100,
        render: (date) =>
          date && (
            <div className=" text-gray-400">{moment(date).format("ll")}</div>
          ),
        defaultSortOrder: "descend",
        sorter: (a, b) => moment(a.scheduleDate) - moment(b.scheduleDate),
      });
    }

    _columns.push({
      title: "Status",
      key: "status",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status, order) => (
        <div className="text-center">
          <OrderStatus
            statusKey={mapRemakeRowStateToKey(status)}
            statusList={RemakeRowStates}
            style={{ width: "90%" }}
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
