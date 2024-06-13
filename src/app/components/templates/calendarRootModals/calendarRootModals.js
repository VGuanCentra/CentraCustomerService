import React, { lazy, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import { useRouter } from "next/navigation";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import ProductionWorkorder from "app/components/templates/productionWorkorder/productionWorkorder";
import BackorderItem from "app/components/templates/productionWorkorder/subComponents/backorderItem";

const ProductionRescheduleModal = lazy(() =>
  import("app/components/atoms/rootModals/productionRescheduleModal")
);
const ProductionChangeStatusModal = lazy(() =>
  import("app/components/atoms/rootModals/productionChangeStatusModal")
);
const InstallationRescheduleModal = lazy(() =>
  import("app/components/atoms/rootModals/installationRescheduleModal")
);
const InstallationChangeStatusModal = lazy(() =>
  import("app/components/atoms/rootModals/installationChangeStatusModal")
);
const ServiceChangeStatusModal = lazy(() =>
  import("app/components/atoms/rootModals/serviceChangeStatusModal")
);
const ServiceRescheduleModal = lazy(() =>
  import("app/components/atoms/rootModals/serviceRescheduleModal")
);
const InstallationWorkorder = lazy(() =>
  import("app/components/templates/installationWorkorder/installationWorkorder")
);

import Help from "app/components/templates/help/help";

import {
  Installation,
  Production,
  Service,
  Shipping,
} from "app/utils/constants";
import { updateWorkOrderData } from "../../../redux/orders";
import EditServiceOrder from "app/(work-order-management)/service/subComponents/editServiceOrder";

export default function CalendarRootModals({
  changeEvent,
  showRescheduleConfirmation,
  setShowRescheduleConfirmation,
  showChangeStatusConfirmation,
  setShowChangeStatusConfirmation,
  handleRescheduleOk,
  handleRescheduleInstallationOk,
  handleMoveCancel,
  handleChangeStatusCancel,
  handleStateChangeOk,
  handleGenericRescheduleOk,
  contextMenuChangeCallback,
  handleServiceStateChangeOk,
  modalsRef,
}) {
  const { department, subDepartment, workOrderData } = useSelector(
    (state) => state.calendar
  );
  const { isMobile } = useSelector((state) => state.app);

  const router = useRouter();
  const dispatch = useDispatch();

  const [showProductionWorkorder, setShowProductionWorkorder] = useState(false);
  const [showInstallationWorkorder, setShowInstallationWorkorder] =
    useState(false);
  const [showServiceOrder, setShowServiceOrder] = useState(false);
  const [showBackorderWorkorder, setShowBackorderWorkorder] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  if (modalsRef?.current) {
    modalsRef.current.setState = (type, val) => {
      switch (type) {
        case "productionWorkorder":
        case "shippingWorkorder":
          setShowProductionWorkorder(val);
          break;
        case "installationWorkorder":
          setShowInstallationWorkorder(val);
          break;
        case "serviceOrder":
          setShowServiceOrder(val);
          break;
        case "backorderWorkorder":
          setShowBackorderWorkorder(val);
          break;
        case "help":
          setShowHelp(val);
          break;
        default:
          break;
      }
    };
  }

  const handleCloseWorkorder = useCallback(() => {
    if (department?.key === subDepartment?.key) {
      router.push(`?department=${department.key}&page=returnUrl`, undefined, {
        shallow: true,
      });
    }

    if (subDepartment && department?.key !== subDepartment?.key) {
      dispatch(updateWorkOrderData({}));
      router.push(
        `?department=${department.key}&subdepartment=${subDepartment?.key}&page=returnUrl`,
        undefined,
        {
          shallow: true,
        }
      );
    }

    switch (department.key) {
      case Production:
      case Shipping:
        setShowProductionWorkorder(false);
        break;
      case Service:
        setShowServiceOrder(false);
        break;
      case Installation:
        setShowInstallationWorkorder(false);
        break;
      default:
        break;
    }
  }, [router, department, subDepartment, dispatch]);

  return (
    <div>
      <ProductionRescheduleModal
        showRescheduleConfirmation={
          showRescheduleConfirmation && department.key === Production
        }
        handleMoveOk={() => {
          handleRescheduleOk();
          setShowRescheduleConfirmation(false);
        }}
        handleMoveCancel={() => {
          handleMoveCancel();
          setShowRescheduleConfirmation(false);
        }}
        changeEvent={changeEvent}
      />

      <ProductionChangeStatusModal
        showChangeStatusConfirmation={
          showChangeStatusConfirmation && department.key === Production
        }
        handleChangeStatusCancel={handleChangeStatusCancel}
        changeEvent={changeEvent}
        handleStateChangeOk={handleStateChangeOk}
      />

      <InstallationRescheduleModal
        showRescheduleConfirmation={
          showRescheduleConfirmation && department.key === Installation
        }
        handleMoveOk={() => {
          handleRescheduleInstallationOk();
          setShowRescheduleConfirmation(false);
        }}
        handleMoveCancel={handleMoveCancel}
        changeEvent={changeEvent}
      />

      <InstallationChangeStatusModal
        showChangeStatusConfirmation={
          showChangeStatusConfirmation && department.key === Installation
        }
        handleChangeStatusCancel={handleChangeStatusCancel}
        changeEvent={changeEvent}
        handleStateChangeOk={handleStateChangeOk}
      />

      <ServiceRescheduleModal
        showRescheduleConfirmation={
          showRescheduleConfirmation && department.key === Service
        }
        handleMoveOk={() => {
          handleGenericRescheduleOk();
          setShowRescheduleConfirmation(false);
        }}
        handleMoveCancel={() => {
          handleMoveCancel();
          setShowRescheduleConfirmation(false);
        }}
        changeEvent={changeEvent}
      />

      <ServiceChangeStatusModal
        showChangeStatusConfirmation={
          showChangeStatusConfirmation && department.key === Service
        }
        handleChangeStatusCancel={handleChangeStatusCancel}
        changeEvent={changeEvent}
        handleStateChangeOk={() => {
          handleServiceStateChangeOk();
          setShowChangeStatusConfirmation(false);
        }}
      />

      <Modal
        open={showHelp}
        onClose={() => {
          setShowHelp(false);
        }}
      >
        <Box
          sx={{
            position: "absolute", // TODO: Check if can be migrated to tailwind
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
            borderRadius: "3px",
          }}
        >
          <Help className="p-2" />
        </Box>
      </Modal>

      <Modal
        open={
          showProductionWorkorder ||
          showInstallationWorkorder ||
          showServiceOrder ||
          showBackorderWorkorder
        }
      >
        <Box
          sx={{
            position: "absolute", // TODO: Check if can be migrated to tailwind
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
            borderRadius: "3px",
            height: isMobile ? "100%" : "auto",
          }}
        >
          {showProductionWorkorder && (
            <ProductionWorkorder
              style={{
                height: "75vh",
                width: "90vw",
                overflow: "auto",
                marginTop: "-1px",
              }}
              setShowProductionWorkorder={setShowProductionWorkorder}
              onChange={contextMenuChangeCallback}
              onCloseCallback={handleCloseWorkorder}
              viewConfig={{
                stickyHeader: true,
              }}
              type={Production}
            />
          )}
          {showInstallationWorkorder && (
            <InstallationWorkorder
              style={{
                height: "75vh",
                width: "90vw",
                overflow: "auto",
                marginTop: "-1px",
              }}
              setShowInstallationWorkorder={setShowInstallationWorkorder}
              onChange={contextMenuChangeCallback}
              onCloseCallback={handleCloseWorkorder}
              viewConfig={{
                stickyHeader: true,
              }}
              type={Installation}
            />
          )}
          {showServiceOrder && workOrderData && (
            <EditServiceOrder
              style={{
                maxHeight: isMobile ? null : "70vh",
                width: isMobile ? null : "90vw",
                overflow: "auto",
                marginTop: "-1px",
                scrollMarginRight: "5px",
              }}
              orderId={workOrderData.serviceId}
              onClose={handleCloseWorkorder}
              // handleShare={() => {
              //   onShareLinkClick(workOrderData.serviceId, "service");
              // }}
              isReadOnly={false}
            />
          )}

          {showBackorderWorkorder && (
            <div>
              <BackorderItem />
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}
