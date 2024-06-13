"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";

import styles from "../work-order-management.module.css";

import { updateAppMode } from "../../redux/app";
import { useQuery } from "react-query";

import {
  updateDepartment,
  updateStatusView,
  openCreateModal,
  openOrderModal,
  closeModal,
  updateOrders,
  updateStatusCount,
  updateTotal,
  updateShowAssignedToMeTab,
  updateOrdersSideBarOpen,
} from "../../redux/orders";

import { updateResult } from "../../redux/calendar";

import { useRouter, useSearchParams } from "next/navigation";
import {
  AppModes,
  FEATURE_CODES,
  RemakeRowStates,
  ResultType,
} from "../../utils/constants";
import OrdersHeader from "app/components/atoms/orderManagementComponents/ordersHeader/ordersHeader";
import OrdersTable from "app/components/atoms/orderManagementComponents/ordersTable/ordersTable";
import OrderModal from "../shared/orderModal";
import CreateRemakeOrder from "./subComponents/createRemakeOrder";
import EditRemakeOrder from "./subComponents/editRemakeOrder";
import {
  fetchRemakeCountByStatus,
  fetchRemakeWorkOrders,
  updateRemakeWorkOrderState,
} from "app/api/remakeApis";

import { getStatusOptions, setAppDetails } from "app/utils/utils";
import OrderRootContainer from "../shared/orderRootContainer";
import OrdersHeaderMobile from "app/components/atoms/orderManagementComponents/ordersHeader/ordersHeaderMobile";
import OrdersTableMobile from "app/components/atoms/orderManagementComponents/ordersTable/ordersTableMobile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { initializeTableColumns } from "./subComponents/tableColumns";
import useOMPermissions from "app/hooks/useOMPermissions";

export default function Remakes() {
  const moduleName = "Remake";
  const router = useRouter();
  const dispatch = useDispatch();

  // for sorting & filtering & pagination

  const [sort, setSort] = useState({ sortBy: "RemakeId", isDescending: true });
  const [columns, setColumns] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  // query params
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status") ?? "";
  const modeParam = searchParams.get("mode") ?? "";
  const orderIdParam = searchParams.get("orderId") ?? "";

  const { permissions: remakePermissions } = useOMPermissions(
    FEATURE_CODES.Remake
  );

  const statusOptions = getStatusOptions("Remake");

  const {
    department,
    statusView,
    showOrderModal,
    showCreateModal,
    editMode,
    selectedOrderId,
    orders,
    pageNumber,
    pageSize,
    total,
    searchEntry,
  } = useSelector((state) => state.orders);

  const { isMobile } = useSelector((state) => state.app);

  const apiHelper = {
    fetchOrders: async () => {
      const result = await fetchRemakeWorkOrders(
        pageNumber,
        pageSize,
        statusView ? statusOptions.find((x) => x.key === statusView).value : "",
        sort.sortBy,
        searchEntry,
        sort.isDescending
      );

      let _statusCountPromises = statusOptions.map(async (_status) => {
        let _count = await apiHelper.fetchStatusCount(_status.value);

        return {
          status: _status.value,
          count: _count,
        };
      });

      // Wait for all promises to resolve
      let _statusCount = await Promise.all(_statusCountPromises);

      dispatch(updateStatusCount(_statusCount));
      dispatch(updateTotal(result.data.totalCount));
      return result.data.data;
    },

    fetchStatusCount: async (status) => {
      const result = await fetchRemakeCountByStatus(status);
      return result.data;
    },
  };

  const {
    isLoading: isLoadingOrders,
    data: ordersData,
    isFetching: isFetchingOrders,
    refetch: refetchOrders,
  } = useQuery(
    ["remake_workorders", department, statusView],
    apiHelper.fetchOrders,
    {
      refetchOnWindowFocus: false,
    }
  );

  const eventHandlers = {
    onAddClick: () => {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.append("mode", "create");

      router.push(currentUrl.toString(), undefined, { shallow: true });
    },

    onEditClick: useCallback(
      (orderId) => {
        router.push(
          `/remake${
            statusView.length > 0 ? `?status=${statusView}&` : "?"
          }orderId=${orderId}&mode=edit`,
          undefined,
          { shallow: true }
        );
      },
      [statusView, router]
    ),

    onShareLinkClick: (id, module) => {
      const baseUrl = window.location.origin; // Get the current base URL
      const link = `${baseUrl}/${module}?orderId=${id}&mode=edit`;

      // Copy the link to the clipboard
      navigator.clipboard
        .writeText(link)
        .then(() => {
          dispatch(
            updateResult({
              type: ResultType.success,
              message: "Link copied to clipboard.",
            })
          );
        })
        .catch((err) => {
          dispatch(
            updateResult({
              type: ResultType.error,
              message: "Failed to copy link to clipboard.",
            })
          );
        });
    },

    onCloseClick: useCallback(() => {
      dispatch(closeModal());
      router.push(
        `/remake${statusView.length > 0 ? `?status=${statusView}` : ""}`,
        undefined,
        { shallow: true }
      );
      refetchOrders();
    }, [dispatch, statusView, router, refetchOrders]),
  };

  const updateStatus = useCallback(
    async (statusKey, orderId) => {
      if (statusKey && orderId && statusOptions) {
        await updateRemakeWorkOrderState(
          statusOptions.find((x) => x.key === statusKey).value,
          orderId
        );
        refetchOrders();
      }
    },
    [refetchOrders, statusOptions]
  );

  const initPage = useCallback(() => {
    dispatch(updateAppMode(AppModes.orders));
    dispatch(updateDepartment("Remake"));
    dispatch(updateShowAssignedToMeTab(false));
    setAppDetails("Centra Orders - Remakes");
  }, [dispatch]);

  const handleStatusParamChange = useCallback(
    (statusParam) => {
      if (statusParam !== undefined) {
        dispatch(updateStatusView(statusParam));
      }
    },
    [dispatch]
  );

  const handleSetOrdersToStore = useCallback(
    (data) => {
      if (data) {
        dispatch(updateOrders(data));
      }
    },
    [dispatch]
  );

  const handleModeChange = useCallback(
    (modeParam, orderIdParam) => {
      switch (modeParam) {
        case "edit":
          if (orderIdParam.length > 0)
            dispatch(openOrderModal({ orderId: orderIdParam, isEdit: true }));

          break;

        case "create":
          dispatch(openCreateModal());
          break;

        default:
          if (orderIdParam.length > 0)
            dispatch(openOrderModal({ orderId: orderIdParam, isEdit: false }));

          break;
      }
    },
    [dispatch]
  );

  useEffect(() => {
    initPage();
  }, [initPage]);

  useEffect(() => {
    handleStatusParamChange(statusParam);
  }, [statusParam, handleStatusParamChange]);

  // build table columns
  useEffect(() => {
    setColumns(
      initializeTableColumns(
        isMobile,
        total,
        pageNumber,
        pageSize,
        eventHandlers,
        moduleName,
        dispatch,
        statusView,
        updateStatus,
        remakePermissions
      )
    );
    if (isMobile) {
      dispatch(updateOrdersSideBarOpen(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusView, department, dispatch, isMobile, total]);

  // handle query param changes
  useEffect(() => {
    handleModeChange(modeParam, orderIdParam);
  }, [modeParam, orderIdParam, handleModeChange]);

  useEffect(() => {
    handleSetOrdersToStore(ordersData);
  }, [ordersData, handleSetOrdersToStore]);

  // if page and page size are changed
  useEffect(() => {
    refetchOrders();
  }, [pageSize, pageNumber, refetchOrders, searchEntry]);

  const isLoading = isLoadingOrders || isFetchingOrders;

  const tableLoading = {
    spinning: isLoading,
    indicator: (
      <LoadingOutlined
        style={{
          fontSize: 24,
        }}
        spin
      />
    ),
  };

  return (
    <div className={styles.root}>
      <OrderRootContainer>
        {isMobile ? (
          <OrdersHeaderMobile
            selectedStatus={statusView}
            states={RemakeRowStates}
            refetch={refetchOrders}
          />
        ) : (
          <OrdersHeader
            selectedStatus={statusView}
            states={RemakeRowStates}
            refetch={refetchOrders}
          />
        )}

        {isMobile ? (
          <OrdersTableMobile
            columns={columns}
            data={orders}
            isLoading={tableLoading}
            selectedStatus={statusView}
            states={RemakeRowStates}
          />
        ) : (
          <OrdersTable
            columns={columns}
            data={orders}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            isLoading={tableLoading}
            onCreateClick={eventHandlers.onAddClick}
            isReadOnly={!remakePermissions.canAdd}
          />
        )}

        {isMobile && remakePermissions.canAdd ? (
          <div
            className="bg-centraBlue text-white flex justify-center sticky bottom-0"
            onClick={eventHandlers.onAddClick}
          >
            <div className="flex space-x-2 justify-center items-center font-semibold py-3 text-white text-sm">
              <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
              <span>Create</span>
            </div>
          </div>
        ) : null}

        <OrderModal
          open={showOrderModal}
          isMobile={isMobile}
          onClose={eventHandlers.onCloseClick}
          moduleName={department}
        >
          <EditRemakeOrder
            orderId={selectedOrderId}
            onClose={eventHandlers.onCloseClick}
            handleShare={() =>
              eventHandlers.onShareLinkClick(
                selectedOrderId,
                moduleName?.toLowerCase()
              )
            }
            isReadOnly={!remakePermissions.canEdit}
          />
        </OrderModal>

        <OrderModal
          open={showCreateModal}
          isMobile={isMobile}
          onClose={eventHandlers.onCloseClick}
          moduleName={department}
        >
          <CreateRemakeOrder
            style={{
              height: "80vh",
              width: isMobile ? "100%" : "90vw",
              overflow: "auto",
              marginTop: "-1px",
              paddingRight: "1rem",
            }}
            orderId={selectedOrderId}
            onClose={eventHandlers.onCloseClick}
            isEditMode={editMode}
          />
        </OrderModal>
      </OrderRootContainer>
    </div>
  );
}
