"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useInView, InView } from "react-intersection-observer";
import _ from "lodash";
import dayjs from "dayjs";

import { Button, Form } from "antd";
import { Collapse } from "@mui/material";

import {
  ServiceStates,
  WorkOrderSelectOptions,
  FileTypes,
} from "app/utils/constants";

import {
  updateServiceWorkOrder,
  scheduleService,
  updateServiceWorkOrderState,
  fetchServiceWorkOrderByServiceId,
  updateServiceAssignedAdmin,
} from "app/api/serviceApis";
import { fetchNotes } from "app/api/genericApis/noteApi";
import { fetchCallLogs } from "app/api/genericApis/callLogApi";

import {
  fetchAttachments,
  saveAttachment,
  deleteAttachments,
} from "app/api/genericApis/attachmentsApi";
import { saveImages } from "app/api/genericApis/imagesApi";

import { mapServiceEventStateToKey } from "app/utils/utils";
import { convertToLocaleDateTime } from "app/utils/date";

import Tooltip from "app/components/atoms/tooltip/tooltip";
import OrderHeaderCard from "app/components/atoms/orderHeaderCard";
import OrderStatus from "app/(work-order-management)/shared/orderStatus";
import TextAreaField from "app/components/atoms/formFields/ts/textAreaField";
import ServiceCustomerInfo from "app/components/templates/serviceWorkorder/subComponents/serviceCustomerInfo";
import ServiceDocuments from "app/components/templates/serviceWorkorder/subComponents/serviceDocuments";
import ServiceInfo from "app/components/templates/serviceWorkorder/subComponents/serviceInfo";
import ServiceSchedule from "app/components/templates/serviceWorkorder/subComponents/serviceSchedule";
import ServiceNotes from "app/components/templates/serviceWorkorder/subComponents/serviceNotes";
import ServiceCallLogs from "app/components/templates/serviceWorkorder/subComponents/serviceCallLogs";
import ServicePhotos from "app/components/templates/serviceWorkorder/subComponents/servicePhotos";
import DocumentUploadNew from "app/components/organisms/documentUpload/documentUploadNew";
import ActionModal from "app/components/atoms/actionModal/actionModal";
import ConfirmationModal from "app/components/atoms/confirmationModal/confirmationModal";
import CloseButton from "app/components/atoms/closeButton";
import UserSelectWithConfirm from "app/components/atoms/formFields/userSelectWithConfirm";
import ProductionItems from "app/components/templates/productionWorkorder/subComponents/productionItems";
import CollapsibleGroup from "app/components/atoms/workorderComponents/collapsibleGroup";
import RemakeItems from "app/components/templates/productionWorkorder/subComponents/remakeItems";
import MobileNavDropdown from "app/components/atoms/navDropdown/navDropdown";
import CustomerInfoSection from "./customerInfoSection";

import { customRequiredMark } from "app/components/atoms/formFields/customRequiredMark";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faSave } from "@fortawesome/free-solid-svg-icons";

import styles from "./serviceOrder.module.css";

export default function EditServiceOrder(props) {
  const { orderId, onClose, handleShare, isReadOnly = false } = props;
  const dispatch = useDispatch();

  let statusOptions = Object.entries(ServiceStates).map((e) => {
    return { key: e[0], value: e[1].label, color: e[1].color };
  });

  const { isMobile } = useSelector((state) => state.app);

  const moduleName = "service";
  const [form] = Form.useForm();
  const [showGoToTop, setShowGoToTop] = useState(false);
  const [inputData, setInputData] = useState({});
  const [documents, setDocuments] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [tempPhotos, setTempPhotos] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [showDeletePhotos, setShowDeletePhotos] = useState(false);
  const [showDeleteFiles, setShowDeleteFiles] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [containsNewUnsavedFiles, setContainsNewUnsavedFiles] = useState(false);
  const [containsNewUnsavedImages, setContainsNewUnsavedImages] =
    useState(false);

  const [showAttachments, setShowAttachments] = useState(false);
  const [fileData, setFileData] = useState([]);
  const [showNotes, setShowNotes] = useState(false);
  const [showCallLogs, setShowCallLogs] = useState(false);
  const [assignedTechnicians, setAssignedTechnicians] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialValues, setInitialValues] = useState([]);

  // For Production Items
  const [windows, setWindows] = useState([]);
  const [doors, setDoors] = useState([]);
  const [vinylDoors, setVinylDoors] = useState([]);
  const [patioDoors, setPatioDoors] = useState([]);
  const [exteriorDoors, setExteriorDoors] = useState([]);

  const windowItemCount = windows?.filter((x) => x.system !== "GL01"); // Used for the heading, separating window items and glass items
  const windowGlassCount = windows?.filter((x) => x.system === "GL01");

  // For Related Remakes
  const [remakeWindows, setRemakeWindows] = useState([]);
  const [remakePatioDoors, setRemakePatioDoors] = useState([]);
  const [remakeVinylDoors, setRemakeVinylDoors] = useState([]);

  const [showRemakeItems, setShowRemakeItems] = useState(false);
  const [showProductionItems, setShowProductionItems] = useState(false);

  const fetchFunctions = {
    fetchOrderAsync: async () => {
      if (orderId) {
        const result = await fetchServiceWorkOrderByServiceId(orderId, false);
        return result.data;
      }
      return {};
    },

    fetchNotesAsync: async () => {
      if (order) {
        const result = await fetchNotes(moduleName, order.id);
        return result.data;
      }
      return [];
    },

    fetchCallLogsAsync: async () => {
      if (order) {
        const result = await fetchCallLogs(moduleName, order.id);
        return result.data;
      }
      return [];
    },

    fetchFilesAsync: async () => {
      if (order) {
        const result = await fetchAttachments(moduleName, order.id);
        return result.data;
      }
      return [];
    },
  };

  const {
    isLoading: isLoadingDetails,
    data: order,
    refetch: refetchOrder,
    isFetching: isFetchingDetails,
  } = useQuery(
    [`${moduleName}OrderDetails`, orderId],
    fetchFunctions.fetchOrderAsync,
    {
      refetchOnWindowFocus: false,
    }
  );

  const {
    isLoading: isLoadingFiles,
    data: files,
    refetch: refetchFiles,
    isFetching: isFetchingFiles,
  } = useQuery(
    [`${moduleName}Documents`, order],
    fetchFunctions.fetchFilesAsync,
    {
      refetchOnWindowFocus: false,
    }
  );

  const initData = (form, order) => {
    if (form && order) {
      setInputData(order);
      setAssignedTechnicians(order.assignedTechnicians ?? []);

      let _d = _.cloneDeep(order);

      // handle some custom fields
      if (_d.serviceRequestDate) {
        _d.serviceRequestDate = dayjs(
          convertToLocaleDateTime(_d.serviceRequestDate)
        );
      }

      if (_d.createdAt) {
        _d.createdAt = dayjs(convertToLocaleDateTime(_d.createdAt));
      }

      if (_d.scheduleDate) {
        _d.scheduleDate = dayjs(convertToLocaleDateTime(_d.scheduleDate));
      }
      if (_d.scheduleEndDate) {
        _d.scheduleEndDate = dayjs(convertToLocaleDateTime(_d.scheduleEndDate));
      }

      if (order.originalWorkOrderDateType) {
        _d.originalWorkOrderDateType = order.originalWorkOrderDateType;
        _d.originalWorkOrderDate = dayjs(
          convertToLocaleDateTime(order.originalWorkOrderDate)
        );
      }

      form.setFieldsValue(_d);

      setInitialValues((prev) => {
        let _iVal = _.cloneDeep(_d);
        _iVal.assignedTechnicians = order.assignedTechnicians ?? [];
        return _iVal;
      });
    }
  };

  const initFiles = (filesData) => {
    if (filesData) {
      setDocuments(
        filesData.filter((f) => f.fileType === FileTypes.file) ?? []
      );
      setPhotos(filesData.filter((f) => f.fileType === FileTypes.image) ?? []);
    }
  };

  useEffect(() => {
    initData(form, order);
  }, [order, form]);

  useEffect(() => {
    initFiles(files);
  }, [files]);

  const setFieldsValue = (fieldName, value, append = false) => {
    const updateValue = (newValue) => {
      form.setFieldValue(fieldName, newValue);

      if (fieldName === "assignedTechnicians") {
        // Workaround to antd multiselect issue not getting set by form
        setAssignedTechnicians(newValue);

        // Trigger onValuesChange explicitly after updating form values
        const allValues = form.getFieldsValue();
        checkIfInitialValuesChanged({ [fieldName]: value }, allValues);
      }
    };

    if (append) {
      const currentValue = form.getFieldValue(fieldName);
      if (!currentValue.includes(value)) {
        const updatedValue = [...currentValue, value];
        updateValue(updatedValue);
      }
    } else {
      if (fieldName === "originalWorkOrderDate") {
        if (value) {
          updateValue(dayjs(value));
        } else {
          updateValue(null);
        }
      } else {
        updateValue(value);
      }
    }
  };

  const handleExpandCollapseCallback = useCallback((type) => {
    if (type) {
      switch (type) {
        case "notes":
          setShowNotes((x) => {
            if (x === false) {
              handleScrollToView(type, false);
            }
            return !x;
          });
          break;
        case "callLogs":
          setShowCallLogs((x) => {
            if (x === false) {
              handleScrollToView(type, false);
            }
            return !x;
          });
          break;
        case "windows":
          setShowProductionItems((x) => {
            if (x === false) {
              handleScrollToView(type, false);
            }
            return !x;
          });
          break;
        case "remake":
          setShowRemakeItems((x) => {
            if (x === false) {
              handleScrollToView(type, false);
            }
            return !x;
          });
        default:
          break;
      }
    }
  }, []);

  const handleScrollToView = (elName, collapseOthers = true) => {
    if (elName) {
      switch (elName) {
        case "notes":
          setShowNotes(true);

          if (collapseOthers) {
            setShowRemakeItems(false);
            setShowProductionItems(false);
          }

          break;
        case "callLogs":
          setShowCallLogs(true);

          if (collapseOthers) {
            setShowRemakeItems(false);
            setShowProductionItems(false);
          }
          break;
        case "photos":
        case "documents":
          setShowNotes(false);
          setShowCallLogs(false);
          setShowRemakeItems(false);
          setShowProductionItems(false);
          break;
        case "remake":
          setShowRemakeItems(true);
          if (collapseOthers) {
            setShowProductionItems(false);
            setShowNotes(false);
            setShowCallLogs(false);
          }
          break;
        case "windows":
          setShowProductionItems(true);
          if (collapseOthers) {
            setShowRemakeItems(false);
            setShowNotes(false);
            setShowCallLogs(false);
          }
          break;
      }

      let header = document.getElementById(`title-${elName}`);
      setTimeout(
        () => header.scrollIntoView({ top: 0, behavior: "smooth" }),
        400
      );
    }
  };

  const handleConfirmSaveClick = useCallback(async () => {
    try {
      setIsSaving(true);
      setShowSaveConfirmation(false);

      if (!order) console.log("Data invalid.");

      let data = _.cloneDeep(form.getFieldsValue(true));

      data.id = order.id;

      let attachments = [];

      if (photos.length > 0) {
        photos.forEach((photo) => {
          attachments.push(photo);
        });
      }

      if (documents.length > 0) {
        documents.forEach((document) => {
          attachments.push(document);
        });
      }

      if (attachments.length > 0) data.serviceFiles = attachments;

      await updateServiceWorkOrder(data);

      refetchOrder();
      setHasChanges(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  }, [form, photos, documents, order, refetchOrder]);

  const handleSaveClick = (e) => {
    if (e) {
      form
        .validateFields()
        .then((values) => {
          setShowSaveConfirmation(true);
        })
        .catch((error) => {
          console.log("Validation failed:", error);
        });
    }
  };

  const handleCancelSaveClick = () => {
    setShowSaveConfirmation(false);
  };

  const handlePhotosOk = useCallback(async () => {
    if (tempPhotos) {
      const newPhotos = tempPhotos.map((d) => {
        if (d?.base64?.length > 0) {
          return {
            id: d.id,
            fileName: d.name,
            base64Content: d.base64.split(",")[1],
            contentType: d.type,
            size: d.size,
            note: d.fileNotes,
          };
        }
      });
      await saveImages(moduleName, order.id, newPhotos);
      refetchFiles();

      setShowPhotoUpload(false);
      setTempPhotos([]);
    }
  }, [tempPhotos, order, refetchFiles]);

  const handlePhotosDelete = useCallback(async () => {
    if (selectedPhotos?.length > 0) {
      let idsToDelete = selectedPhotos.map((p) => {
        return p.id;
      });

      await deleteAttachments(moduleName, idsToDelete);
      refetchFiles();
      setShowDeletePhotos(false);
      setSelectedPhotos([]);
    }
  }, [selectedPhotos, refetchFiles]);

  const handleDeleteCheckedFiles = useCallback(async () => {
    let checkedDocs = documents.filter((d) => d.checked);

    if (checkedDocs?.length > 0) {
      let idsToDelete = checkedDocs.map((d) => {
        return d.id;
      });

      setDocuments((prevDocs) => {
        let _filteredDocs = prevDocs.filter((p) => !idsToDelete.includes(p.id));

        _filteredDocs.forEach((d) => {
          d.checked = false;
        });

        return _filteredDocs;
      });

      await deleteAttachments(moduleName, idsToDelete);
      refetchFiles();

      setShowDeleteFiles(false);
    }
  }, [documents, refetchFiles]);

  const handleDocumentsOkClick = useCallback(async () => {
    if (fileData) {
      const updatedDocuments = fileData.map((d) => {
        if (d?.base64?.length > 0) {
          return {
            id: d.id,
            fileName: d.name,
            base64Content: d.base64.split(",")[1],
            contentType: d.type,
            size: d.size,
            note: d.fileNotes,
          };
        }
      });
      await saveAttachment(moduleName, order.id, updatedDocuments);
      setFileData([]);
      refetchFiles();

      setShowAttachments(false);
    }
  }, [fileData, order, refetchFiles]);

  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: "0px 0px",
  });

  const updateStatus = async (statusKey, id, val) => {
    if (statusKey && id && statusOptions) {
      let _statusVal = statusOptions.find((x) => x.key === statusKey).value;

      if (_statusVal == ServiceStates.scheduled.label) {
        let data = {
          id: id,
          status: _statusVal,
          scheduleDate: val.scheduleDateSS,
          scheduleEndDate: val.scheduleEndDateSS,
          serviceAssignees: val.assignedTechniciansSS,
        };
        await scheduleService(_statusVal, id, data);
      } else {
        await updateServiceWorkOrderState(_statusVal, id);
      }
      refetchOrder();
    }
  };

  const checkIfInitialValuesChanged = (changedValues, allValues) => {
    const changedFields = Object.keys(changedValues);

    const _hasChanges = changedFields.some((field) => {
      if (field === "assignedTechnicians") {
        return !_.isEqual(
          changedValues.assignedTechnicians,
          initialValues.assignedTechnicians
        );
      } else {
        return allValues[field] !== initialValues[field];
      }
    });

    setHasChanges(_hasChanges);
  };

  const updateAssignedAdmin = useCallback(
    async (orderId, val) => {
      if (orderId && val) {
        let data = {
          id: orderId,
          assignedAdmin: val,
        };

        await updateServiceAssignedAdmin(data);

        refetchOrder();
      }
    },
    [refetchOrder]
  );

  return (
    <>
      <Form
        form={form}
        name="EditServiceForm"
        colon={false}
        labelWrap
        requiredMark={customRequiredMark}
        onValuesChange={checkIfInitialValuesChanged}
        scrollToFirstError
        style={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        <div className={styles.workOrderOuterContainer}>
          <div className={styles.workOrderInnerContainer} ref={ref}>
            <div
              className={`flex space-x-1 items-center ${
                isMobile ? "w-full justify-between" : ""
              }`}
            >
              <OrderHeaderCard
                orderId={order?.serviceId}
                label={order ? `Service # ${order?.serviceId}` : ""}
                {...{
                  handleShare,
                  isMobile,
                  onClose,
                  hasChanges,
                  isReadOnly,
                }}
              />
              <OrderStatus
                orderId={order?.id}
                id={order?.serviceId}
                statusList={ServiceStates}
                statusKey={mapServiceEventStateToKey(order?.status)}
                style={isMobile ? null : { margin: "0 0.5rem 0 0.5rem" }}
                updateStatusCallback={updateStatus}
                handleStatusCancelCallback={() => {}}
                isReadOnly={isReadOnly}
              />
              {!isMobile && (
                <UserSelectWithConfirm
                  orderId={order?.id}
                  value={order?.assignedAdmin}
                  onChange={updateAssignedAdmin}
                  width="210px"
                  showAsLabel={isReadOnly}
                />
              )}
            </div>
            {!isMobile && (
              <CloseButton
                onClose={() => onClose()}
                title="Close Service"
                hasChanges={hasChanges}
              />
            )}
          </div>
        </div>

        {isMobile && (
          <div className="py-1 w-full items-center">
            <UserSelectWithConfirm
              orderId={order?.id}
              value={order?.assignedAdmin}
              onChange={updateAssignedAdmin}
              width="100%"
              showAsLabel={isReadOnly}
            />
          </div>
        )}

        {!isMobile && (
          <div
            className={`${styles.infoBar} flex flex-col`}
            style={{ zIndex: 0 }}
          >
            <hr style={{ margin: "0 0 3px 0" }} />

            <div className={styles.customerInfoOuterContainer}>
              <>
                <div className={styles.customerInfoInnerContainer}>
                  <CustomerInfoSection inputData={inputData} />
                </div>
                <div className={`${styles.tableButtonsOuterContainer} py-1`}>
                  <div>
                    <div
                      onClick={() => handleScrollToView("documents")}
                      className={`${styles.tableButton}`}
                    >
                      Documents
                    </div>
                  </div>
                  <div className="pl-3 pr-3">|</div>
                  <div>
                    <div
                      onClick={() => handleScrollToView("photos")}
                      className={`${styles.tableButton}`}
                    >
                      Photos
                    </div>
                  </div>

                  {inputData?.originalWorkOrderNo && (
                    <>
                      <div className="pl-3 pr-3">|</div>
                      <div>
                        <div
                          onClick={() => handleScrollToView("windows")}
                          className={`${styles.tableButton}`}
                        >
                          {`${inputData?.originalWorkOrderNo} Items`}
                        </div>
                      </div>
                      <div className="pl-3 pr-3">|</div>
                      <div>
                        {" "}
                        <div
                          onClick={() => handleScrollToView("remake")}
                          className={`${styles.tableButton}`}
                        >
                          Remakes
                        </div>
                      </div>
                    </>
                  )}
                  <div className="pl-3 pr-3">|</div>
                  <div>
                    <div
                      onClick={() => handleScrollToView("notes")}
                      className={`${styles.tableButton}`}
                    >
                      Notes
                    </div>
                  </div>

                  <div className="pl-3 pr-3">|</div>
                  <div>
                    <div
                      onClick={() => handleScrollToView("callLogs")}
                      className={`${styles.tableButton}`}
                    >
                      Call Logs
                    </div>
                  </div>
                </div>
              </>
            </div>
            <hr style={{ margin: "3px 0 3px 0" }} />
          </div>
        )}

        <div
          className="flex w-full py-2 space-x-3 sticky"
          style={{ zIndex: 0, borderBottom: "1px dotted lightgrey" }}
        >
          <div
            className={`flex w-full space-x-2 items-start ${
              isMobile ? "mt-1 justify-between" : ""
            }`}
          >
            <TextAreaField
              id="summary"
              fieldName="summary"
              label="Summary"
              labelSpan={"auto"}
              inputSpan={"auto"}
              required
              borderless
              size="middle"
              placeholder="Summary"
              style={{
                fontSize: "1rem",
                fontWeight: "500",
                padding: "0",
                paddingLeft: "2px",
              }}
              hideLabel={true}
            />

            {isMobile && (
              <MobileNavDropdown
                menuItems={[
                  {
                    key: "1",
                    label: <span>Order Information</span>,
                    onClick: () => handleScrollToView("orderInfo"),
                  },
                  {
                    key: "2",
                    label: <span>Customer Information</span>,
                    onClick: () => handleScrollToView("customerInfo"),
                  },
                  {
                    key: "3",
                    label: <span>Schedule</span>,
                    onClick: () => handleScrollToView("schedule"),
                  },
                  {
                    key: "4",
                    label: <span>WO Items</span>,
                    onClick: () => handleScrollToView("windows"),
                    disabled: !inputData.originalWorkOrderNo,
                  },
                  {
                    key: "5",
                    label: <span>Remake Items</span>,
                    onClick: () => handleScrollToView("remake"),
                    disabled: !inputData.originalWorkOrderNo,
                  },
                  {
                    key: "6",
                    label: <span>Documents</span>,
                    onClick: () => handleScrollToView("documents"),
                  },
                  {
                    key: "7",
                    label: <span>Photos</span>,
                    onClick: () => handleScrollToView("photos"),
                  },
                  {
                    key: "8",
                    label: <span>Notes</span>,
                    onClick: () => handleScrollToView("notes"),
                  },
                  {
                    key: "9",
                    label: <span>Call Logs</span>,
                    onClick: () => handleScrollToView("callLogs"),
                  },
                ]}
              />
            )}

            {!isMobile && !isReadOnly && (
              <Tooltip title={"Save Service"}>
                <Button
                  type={"primary"}
                  onClick={handleSaveClick}
                  disabled={isSaving || !hasChanges}
                  loading={isSaving}
                  size="middle"
                >
                  <span>Save</span>
                </Button>
              </Tooltip>
            )}
          </div>
        </div>

        <div
          className={styles.container}
          style={{ ...props.style }}
          id={"title-main"}
        >
          <div className={styles.grid} id={"title-topmost"}>
            <InView
              as="div"
              onChange={(inView, entry) => setShowGoToTop(!inView)}
              className="flex"
            >
              <ServiceInfo
                woSelectCallback={() => setHasChanges(true)}
                {...{
                  inputData,
                  setInputData,
                  form,
                  isMobile,
                  isReadOnly,
                  setFieldsValue,
                  WorkOrderSelectOptions,
                }}
              />
            </InView>

            <div className="grid space-y-4">
              <ServiceCustomerInfo {...{ isReadOnly }} />
              <ServiceDocuments
                module={moduleName}
                moduleId={inputData?.id}
                {...{
                  documents,
                  setDocuments,
                  setShowDeleteFiles,
                  setShowAttachments,
                  setShowDeleteFiles,
                }}
                isLoading={isFetchingFiles || isLoadingFiles}
              />
            </div>

            <div className="grid space-y-4">
              <ServiceSchedule
                moduleId={inputData?.id}
                {...{ inputData, form, setFieldsValue, assignedTechnicians }}
                disabled={
                  inputData?.status == ServiceStates.newDraft.label ||
                  inputData?.status == ServiceStates.confirmed.label ||
                  inputData?.status == ServiceStates.complete.label ||
                  inputData?.status == ServiceStates.cancelled.label ||
                  isReadOnly
                  // || inputData?.status == ServiceStates.rejectedService.label
                }
                showReturnTrip
              />
              <ServicePhotos
                {...{
                  photos,
                  tempPhotos,
                  setTempPhotos,
                  handlePhotosOk,
                  handlePhotosDelete,
                  containsNewUnsavedImages,
                  setContainsNewUnsavedImages,
                  showPhotoUpload,
                  setShowPhotoUpload,
                  showDeletePhotos,
                  setShowDeletePhotos,
                  selectedPhotos,
                  setSelectedPhotos,
                }}
                isLoading={isFetchingFiles || isLoadingFiles}
              />
            </div>
          </div>

          {inputData?.originalWorkOrderNo ? (
            <>
              <CollapsibleGroup
                id={"title-windows"}
                title={`${inputData?.originalWorkOrderNo} Production Items`}
                subTitle={`W: ${windowItemCount.length} | PD: ${patioDoors.length} | VD: ${vinylDoors.length} | ED: ${exteriorDoors.length} | GL: ${windowGlassCount.length}`}
                expandCollapseCallback={() =>
                  handleExpandCollapseCallback("windows")
                }
                value={showProductionItems}
                style={{ marginTop: "1rem" }}
              >
                <Collapse in={showProductionItems}>
                  <ProductionItems
                    workOrderNumber={inputData?.originalWorkOrderNo}
                    parentState={{
                      windows,
                      setWindows,
                      doors,
                      setDoors,
                      vinylDoors,
                      setVinylDoors,
                      patioDoors,
                      setPatioDoors,
                      exteriorDoors,
                      setExteriorDoors,
                    }}
                    action={"remake"}
                    disabled={order?.status !== ServiceStates.inProgress.label}
                  />
                </Collapse>
              </CollapsibleGroup>
              <CollapsibleGroup
                id={"title-remake"}
                title={"Remakes"}
                subTitle={`W: ${remakeWindows.length}`}
                expandCollapseCallback={() =>
                  handleExpandCollapseCallback("remake")
                }
                value={showRemakeItems}
                style={{ marginTop: "1rem" }}
              >
                <Collapse in={showRemakeItems}>
                  <RemakeItems
                    workOrderNumber={inputData?.originalWorkOrderNo}
                    parentState={{
                      remakeWindows,
                      setRemakeWindows,
                      remakePatioDoors,
                      setRemakePatioDoors,
                      remakeVinylDoors,
                      setRemakeVinylDoors,
                    }}
                  />
                </Collapse>
              </CollapsibleGroup>
            </>
          ) : null}

          <div
            className={`grid ${
              isMobile ? "grid-cols-1" : "grid-cols-2"
            } gap-3 pt-3`}
          >
            <div className="col-span-1">
              <ServiceNotes
                moduleId={order?.id}
                showNotes={showNotes}
                onExpandCollapse={handleExpandCollapseCallback}
              />
            </div>
            <div className="col-span-1">
              <ServiceCallLogs
                moduleId={order?.id}
                showCallLogs={showCallLogs}
                onExpandCollapse={handleExpandCollapseCallback}
              />
            </div>
          </div>

          {showGoToTop && (
            <div
              style={{
                position: "absolute",
                bottom: isMobile ? 60 : 10,
                right: 10,
              }}
            >
              <i
                className={`bi bi-arrow-up-circle-fill ${styles.goToTopIcon}`}
                onClick={() => handleScrollToView("topmost")}
              ></i>
            </div>
          )}
          {isMobile ? (
            <div className="bg-white flex justify-center sticky bottom-0 mt-2 space-x-2">
              <Button
                style={{ width: "100%", height: "100%" }}
                className="bg-centraBlue text-white"
                onClick={onClose}
              >
                <div className="flex space-x-2 justify-center items-center font-semibold py-2">
                  <FontAwesomeIcon icon={faClose}></FontAwesomeIcon>
                  <span>Close</span>
                </div>
              </Button>
              <Button
                style={{ width: "100%", height: "100%" }}
                className="bg-centraBlue"
                onClick={handleSaveClick}
                disabled={isSaving || !hasChanges || isReadOnly}
                loading={isSaving}
              >
                <div className="flex space-x-2 justify-center items-center font-semibold py-2">
                  <FontAwesomeIcon icon={faSave}></FontAwesomeIcon>
                  <span>Save</span>
                </div>
              </Button>
            </div>
          ) : null}
        </div>
      </Form>

      <ActionModal
        title={"Add / Update Documents"}
        open={showAttachments}
        showCancel={false}
        onCancel={() => {
          setShowAttachments(false);
          setContainsNewUnsavedFiles(false);
          setFileData([]);
        }}
        onOk={handleDocumentsOkClick}
        okDisabled={!containsNewUnsavedFiles}
        cancelLabel={"Cancel"}
        popConfirmOkTitle={"Save Documents Confirmation"}
        popConfirmOkDescription={"Do you want to proceed with the update?"}
        popConfirmCancelTitle={"Close Documents"}
        popConfirnCancelDescription={
          <div>
            <div>Any unsaved changes will be lost.</div>
            <div>Proceed anyway?</div>
          </div>
        }
      >
        <DocumentUploadNew
          documents={documents}
          setContainsNewUnsavedFiles={setContainsNewUnsavedFiles}
          fileData={fileData}
          setFileData={setFileData}
          isNew={false}
        />
      </ActionModal>

      <ConfirmationModal
        title={`Update Confirmation`}
        open={showSaveConfirmation}
        onOk={handleConfirmSaveClick}
        onCancel={handleCancelSaveClick}
        cancelLabel={"No"}
        okLabel={"Yes"}
      >
        <div className="pt-2">
          <div>Are you sure you want to update this service?</div>
        </div>
      </ConfirmationModal>

      <ConfirmationModal
        title={`Delete Confirmation`}
        open={showDeleteFiles}
        okLabel={"Ok"}
        onOk={handleDeleteCheckedFiles}
        okDisabled={!documents.find((x) => x.checked)}
        cancelLabel={"Cancel"}
        onCancel={() => setShowDeleteFiles(false)}
      >
        <div className="pt-2">
          <div>The following documents will be permanently deleted:</div>
          <div className="pt-2 pl-4">
            {documents?.map((td) =>
              td.checked ? <div key={td.name}>- {td.name}</div> : null
            )}
          </div>
        </div>
      </ConfirmationModal>
    </>
  );
}
