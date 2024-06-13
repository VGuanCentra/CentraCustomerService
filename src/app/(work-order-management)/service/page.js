"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "react-query";
import { initializeTableColumns } from "./subComponents/tableColumns";

import OrdersHeader from "app/components/atoms/orderManagementComponents/ordersHeader/ordersHeader";
import { Button } from "react-bootstrap";
import {
  ServiceStates,
  AppModes,
  ResultType,
  FEATURE_CODES,
} from "../../utils/constants";
import { getStatusOptions, setAppDetails } from "app/utils/utils";

import {
  fetchServiceCountByStatus,
  fetchServiceCountByAssignee,
  fetchServiceWorkOrdersWithPagination,
  scheduleService,
  updateServiceWorkOrderState,
  updateServiceAssignedAdmin,
  deleteService,
} from "app/api/serviceApis";

import {
  fetchAllServiceWorkOrders_AAD,
  fetchServiceWorkOrdersWithPagination_AAD,
  fetchServiceCountByStatus_AAD,
} from "../../api/customerServiceApis";

import styles from "../work-order-management.module.css";

// Redux
import {
  updateDepartment,
  updateStatusView,
  openCreateModal,
  openOrderModal,
  closeModal,
  updateOrders,
  updateStatusCount,
  updateTotal,
  updateAssignedToMe,
  updateAssignedToMeCount,
  updateShowMessage,
  updateSortOrder,
  updatePageNumber,
  updateOrdersSideBarOpen,
} from "../../redux/orders";

import { updateAppMode } from "../../redux/app";

import OrdersTable from "app/components/atoms/orderManagementComponents/ordersTable/ordersTable";
import { LoadingOutlined } from "@ant-design/icons";
import { useAuthData } from "context/authContext";

import OrderModal from "../shared/orderModal";
import EditServiceOrder from "./subComponents/editServiceOrder";
import CreateServiceOrder from "./subComponents/createServiceOrder";
import OrderRootContainer from "../shared/orderRootContainer";
import { updateResult } from "app/redux/calendar";
import OrdersHeaderMobile from "app/components/atoms/orderManagementComponents/ordersHeader/ordersHeaderMobile";
import OrdersTableMobile from "app/components/atoms/orderManagementComponents/ordersTable/ordersTableMobile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import ConfirmationModal from "app/components/atoms/confirmationModal/confirmationModal";
import useOMPermissions from "app/hooks/useOMPermissions";

export default function Home() {
  const moduleName = "Service";
  const router = useRouter();
  const dispatch = useDispatch();
  // const { loggedInUser } = useAuthData();
  const loggedInUser = null;

  const { isMobile } = useSelector((state) => state.app);
  const [columns, setColumns] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  // query params
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status") ?? "";
  const modeParam = searchParams.get("mode") ?? "";
  const orderIdParam = searchParams.get("orderId") ?? "";
  const assignedToMeParam = searchParams.get("assignedToMe") ?? "";

  const { permissions: servicePermissions } = useOMPermissions(
    FEATURE_CODES.Service
  );

  const {
    department,
    statusView,
    selectedOrderId,
    showOrderModal,
    showCreateModal,
    editMode,
    orders,
    pageNumber,
    pageSize,
    total,
    assignedToMe,
    location,
    filters,
    showMessage,
    sort,
    searchEntry,
  } = useSelector((state) => state.orders);

  const statusOptions = getStatusOptions(moduleName);

  const modalStyle = {
    maxHeight: isMobile ? null : "70vh",
    width: isMobile ? null : "90vw",
    overflow: "auto",
    marginTop: "-1px",
    scrollMarginRight: "5px",
  };

  const apiHelper = {
    // VGuan Debug:
    fetchAllServiceCount_VGuan: async (status) => {
      const result = await fetchAllServiceWorkOrders_AAD();
      return result.data;
    },
    //VGuan Debug 202406
    fetchStatusCount: async (status) => {
      const result = await fetchServiceCountByStatus_AAD(status);
      return result.data;
    },

    fetchAssigneeServiceCount: async (email) => {
      // const result = await fetchServiceCountByAssignee(email);
      const result = await fetchAllServiceWorkOrders_AAD();
      return result.data;
    },

    fetchOrders: async () => {
      // if (!loggedInUser) return;
      let sosiFilterVal = "";
      let _sosiFilter = filters.find((f) => f.key === "sosi");

      if (_sosiFilter) {
        let sosiFilter = _sosiFilter.fields.filter((x) => x.value === true);

        if (sosiFilter.length === 1) {
          sosiFilterVal = sosiFilter[0].key;
        }
      }
      //VGuan Debug 202406
      const result = await fetchServiceWorkOrdersWithPagination_AAD(
        pageNumber,
        pageSize,
        statusView ? statusOptions.find((x) => x.key === statusView).value : "",
        sort.sortBy ?? "serviceId",
        sort.isDescending ?? true,
        assignedToMe ? loggedInUser?.email : null,
        location,
        sosiFilterVal,
        searchEntry
      );
      // const result = await fetchServiceWorkOrdersWithPagination(
      //   pageNumber,
      //   pageSize,
      //   statusView ? statusOptions.find((x) => x.key === statusView).value : "",
      //   sort.sortBy ?? "serviceId",
      //   sort.isDescending ?? true,
      //   assignedToMe ? loggedInUser?.email : null,
      //   location,
      //   sosiFilterVal,
      //   searchEntry
      // );

      let _statusCountPromises = statusOptions.map(async (_status) => {
        let _count = await apiHelper.fetchStatusCount(_status.value);

        return {
          status: _status.value,
          count: _count,
        };
      });

      let _assigneeServCount = await apiHelper.fetchAssigneeServiceCount(
        loggedInUser?.email
      );

      // Wait for all promises to resolve
      let _statusCount = await Promise.all(_statusCountPromises);

      dispatch(updateStatusCount(_statusCount));
      dispatch(updateTotal(result.data.totalCount));
      dispatch(updateAssignedToMeCount(_assigneeServCount));

      if (showMessage) dispatch(updateShowMessage({ value: false }));
      //VGuan Debug 202406
      // return result.data.data;
      return result.data;
    },
  };

  const {
    isLoading: isLoadingOrders,
    data: ordersData,
    isFetching: isFetchingOrders,
    refetch: refetchOrders,
  } = useQuery(
    [
      "service_workorders",
      department,
      statusView,
      assignedToMe,
      loggedInUser,
      filters,
      location,
    ],
    apiHelper.fetchOrders,
    {
      refetchOnWindowFocus: false,
    }
  );

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

  const [idToDelete, setIdToDelete] = useState(null);

  const eventHandlers = {
    onEditClick: useCallback(
      (orderId) => {
        const currentUrl = new URL(window.location.href);

        currentUrl.searchParams.append("orderId", orderId);
        currentUrl.searchParams.append("mode", "edit");

        router.push(currentUrl.toString(), undefined, { shallow: true });
      },
      [router]
    ),

    onViewInWebCalClick: useCallback(
      (orderId) => {
        const currentUrl = new URL(window.location.href);

        currentUrl.searchParams.append("orderId", orderId);
        currentUrl.searchParams.append("mode", "edit");

        router.push(currentUrl.toString(), undefined, { shallow: true });
      },
      [router]
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

    onDeleteClick: (id) => {
      setIdToDelete(id);
    },

    onDeleteConfirm: async (id) => {
      let result = await deleteService(id);

      if (result) {
        setIdToDelete(null);
        refetchOrders();
      }
    },

    onDeleteCancel: () => {
      setIdToDelete(null);
    },

    onAddClick: () => {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.append("mode", "create");

      router.push(currentUrl.toString(), undefined, { shallow: true });
    },

    onCloseClick: useCallback(() => {
      dispatch(closeModal());

      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.delete("mode");
      currentUrl.searchParams.delete("orderId");
      router.push(currentUrl.toString(), undefined, { shallow: true });

      refetchOrders();
    }, [dispatch, refetchOrders, router]),
  };

  const updateStatus = useCallback(
    async (statusKey, orderId, val) => {
      if (statusKey && orderId && statusOptions) {
        let _statusVal = statusOptions.find((x) => x.key === statusKey).value;

        if (_statusVal == ServiceStates.scheduled.label) {
          let data = {
            id: orderId,
            status: _statusVal,
            scheduleDate: val.scheduleDateSS,
            scheduleEndDate: val.scheduleEndDateSS,
            serviceAssignees: val.assignedTechniciansSS,
          };
          await scheduleService(_statusVal, orderId, data);
        } else {
          await updateServiceWorkOrderState(_statusVal, orderId);
        }
        refetchOrders();
      }
    },
    [refetchOrders, statusOptions]
  );

  const updateAssignedAdmin = useCallback(
    async (orderId, val) => {
      if (orderId && val) {
        let data = {
          id: orderId,
          assignedAdmin: val,
        };

        await updateServiceAssignedAdmin(data);

        refetchOrders();
      }
    },
    [refetchOrders]
  );

  const initPage = useCallback(() => {
    dispatch(updateAppMode(AppModes.orders));
    dispatch(updateDepartment("Service"));
    setAppDetails("Centra Orders - Services");
  }, [dispatch]);

  const handleStatusParamChange = useCallback(
    (statusParam) => {
      if (statusParam !== undefined) {
        dispatch(updateStatusView(statusParam));
        dispatch(updateSortOrder({}));
        dispatch(updatePageNumber(1));
      }
    },
    [dispatch]
  );

  const handleAssignedToMeParamChange = useCallback(
    (assignedToMeParam) => {
      dispatch(
        updateAssignedToMe(assignedToMeParam && assignedToMeParam === "1")
      );
      dispatch(updateSortOrder({}));
      dispatch(updatePageNumber(1));
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

  const initTableColumns = useCallback(() => {
    //TODO: move table column change here
  }, []);

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

  // region: useEffect hooks
  useEffect(() => {
    initPage();
  }, [initPage]);

  useEffect(() => {
    refetchOrders();
  }, [
    pageSize,
    pageNumber,
    location,
    filters,
    searchEntry,
    sort,
    refetchOrders,
    dispatch,
  ]);

  useEffect(() => {
    handleStatusParamChange(statusParam);
  }, [statusParam, handleStatusParamChange]);

  useEffect(() => {
    handleAssignedToMeParamChange(assignedToMeParam);
  }, [assignedToMeParam, handleAssignedToMeParamChange]);

  useEffect(() => {
    handleSetOrdersToStore(ordersData);
  }, [ordersData, handleSetOrdersToStore]);

  // TODO: Need to refactor. But so far attempts to refactor breaking page operation
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
        updateAssignedAdmin,
        servicePermissions
      )
    );

    if (isMobile) {
      dispatch(updateOrdersSideBarOpen(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusView, department, dispatch, isMobile, total]);

  useEffect(() => {
    handleModeChange(modeParam, orderIdParam);
  }, [modeParam, orderIdParam, handleModeChange]);

  const onGetAllClick = () => {
    fetchAllServiceWorkOrders_AAD();
  };

  const onCreateServiceClick = () => {};
  // endregion: useEffect hooks

  return (
    <div className={styles.root}>
      {/* <Button size="sm" className="text-sm" onClick={onGetAllClick}>
        <span>Get All Customer Service</span>
      </Button>
      <Button size="sm" className="text-sm" onClick={onCreateServiceClick}>
        <span>Create Customer Service</span>
      </Button> */}
      <OrderRootContainer>
        {isMobile ? (
          <OrdersHeaderMobile
            selectedStatus={statusView}
            states={ServiceStates}
            refetch={refetchOrders}
          />
        ) : (
          <OrdersHeader
            selectedStatus={statusView}
            states={ServiceStates}
            refetch={refetchOrders}
          />
        )}

        {isMobile ? (
          <OrdersTableMobile
            columns={columns}
            data={orders}
            isLoading={tableLoading}
            selectedStatus={statusView}
            states={ServiceStates}
          />
        ) : (
          <OrdersTable
            columns={columns}
            data={orders}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            isLoading={tableLoading}
            onCreateClick={eventHandlers.onAddClick}
            // isReadOnly={!servicePermissions.canAdd}
            isReadOnly= {false}
          />
        )}

        {isMobile && servicePermissions.canAdd ? (
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
          isMobile={isMobile}
          open={showOrderModal}
          onClose={eventHandlers.onCloseClick}
          moduleName={department}
        >
          <EditServiceOrder
            orderId={selectedOrderId}
            style={modalStyle}
            onClose={eventHandlers.onCloseClick}
            handleShare={() => {
              eventHandlers.onShareLinkClick(
                selectedOrderId,
                moduleName?.toLowerCase()
              );
            }}
            isReadOnly={!servicePermissions.canEdit}
          />
        </OrderModal>

        <OrderModal
          isMobile={isMobile}
          open={showCreateModal}
          onClose={eventHandlers.onCloseClick}
          moduleName={department}
        >
          <CreateServiceOrder
            style={modalStyle}
            orderId={selectedOrderId}
            onClose={eventHandlers.onCloseClick}
            isEditMode={editMode}
          />
        </OrderModal>

        <ConfirmationModal
          title={`Delete Confirmation`}
          open={idToDelete !== null}
          onOk={() => eventHandlers.onDeleteConfirm(idToDelete)}
          onCancel={eventHandlers.onDeleteCancel}
          cancelLabel={"No"}
          okLabel={"Yes"}
        >
          <div className="pt-2">
            <div>Are you sure you want to delete this service?</div>
          </div>
        </ConfirmationModal>
      </OrderRootContainer>
    </div>
  );
}
