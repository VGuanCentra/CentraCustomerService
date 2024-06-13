"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import { useInView } from "react-intersection-observer";
import dayjs from "dayjs";

import {
  fetchRemakeWorkOrderByRemakeId,
  updateRemakeWorkOrder,
  updateRemakeWorkOrderState,
} from "app/api/remakeApis";

import {
  deleteAttachments,
  fetchAttachments,
  saveAttachment,
} from "app/api/genericApis/attachmentsApi";

import { Button, Form } from "antd";
import { RemakeRowStates } from "app/utils/constants";
import { getStatusOptions, mapRemakeRowStateToKey } from "app/utils/utils";
import { customRequiredMark } from "app/components/atoms/formFields/customRequiredMark";
import { convertToLocaleDateTime } from "app/utils/date";

import styles from "./remakeOrder.module.css";
import Divider from "../../shared/divider";
import ActionModal from "app/components/atoms/actionModal/actionModal";
import DocumentUploadNew from "app/components/organisms/documentUpload/documentUploadNew";
import ConfirmationModal from "app/components/atoms/confirmationModal/confirmationModal";
import RemakeInfo from "./remakeInfo";
import OrderHeaderCard from "app/components/atoms/orderHeaderCard";
import OrderStatus from "app/(work-order-management)/shared/orderStatus";
import CloseButton from "app/components/atoms/closeButton";
import Tooltip from "app/components/atoms/tooltip/tooltip";
import RemakeProductionItem from "./remakeProductionItem";
import RemakeAttachments from "./remakeAttachments";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faSave } from "@fortawesome/free-solid-svg-icons";

export default function EditRemakeOrder(props) {
  const { orderId, onClose, handleShare, isReadOnly = false } = props;
  const [form] = Form.useForm();
  const moduleName = "remake";
  const { isMobile } = useSelector((state) => state.app);
  const [inputData, setInputData] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showDeleteFiles, setShowDeleteFiles] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [fileData, setFileData] = useState([]);
  const [containsNewUnsavedFiles, setContainsNewUnsavedFiles] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  const [initialValues, setInitialValues] = useState([]);
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: "0px 0px",
  });

  // api calls
  const fetchOrderDetailsAsync = async () => {
    if (orderId) {
      const result = await fetchRemakeWorkOrderByRemakeId(orderId, false);
      return result.data;
    } else {
      return null;
    }
  };

  const fetchAttachmentsAsync = async () => {
    if (order) {
      const result = await fetchAttachments(moduleName, order.id);
      return result.data;
    }
    return [];
  };

  // useQuery call to fetch remake details
  const {
    isLoading: isLoadingDetails,
    data: order,
    refetch: refetchOrder,
    isFetching: isFetchingDetails,
  } = useQuery([`${moduleName}OrderDetails`, orderId], fetchOrderDetailsAsync, {
    refetchOnWindowFocus: false,
  });

  const {
    isLoading: isLoadingAttachments,
    data: attachments,
    refetch: refetchAttachments,
    isFetching: isFetchingAttachments,
  } = useQuery(`${moduleName}OrderAttachments`, fetchAttachmentsAsync, {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (form && order) {
      setInputData(order);

      let _d = _.cloneDeep(order);

      if (_d.createdAt) {
        _d.createdAt = dayjs(convertToLocaleDateTime(_d.createdAt));
      }

      if (_d.scheduleDate) {
        _d.scheduleDate = dayjs(convertToLocaleDateTime(_d.scheduleDate));
      }

      form.setFieldsValue(_d);

      setInitialValues((prev) => {
        let _iVal = _.cloneDeep(_d);
        return _iVal;
      });
    }
  }, [order, form]);

  useEffect(() => {
    if (attachments) {
      setDocuments(
        attachments // attachments.filter((f) => f.fileType === FileTypes.file) ?? []
      );
    }
  }, [attachments]);

  // onClick events

  const onConfirmSaveClick = useCallback(async () => {
    try {
      setIsSaving(true);
      setShowSaveConfirmation(false);

      if (!order) console.log("Data invalid.");

      let data = _.cloneDeep(form.getFieldsValue(true));

      data.id = order.id;

      let remakesToUpdate = [data];

      await updateRemakeWorkOrder(remakesToUpdate);

      refetchOrder();

      setHasChanges(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  }, [form, order, refetchOrder]);

  const handleDocumentsOk = useCallback(async () => {
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
      refetchAttachments();

      setShowAttachments(false);
    }
  }, [fileData, order, refetchAttachments]);

  const deleteCheckedFiles = useCallback(async () => {
    let checkedDocs = documents.filter((d) => d.checked);

    if (checkedDocs?.length > 0) {
      let idsToDelete = checkedDocs.map((d) => {
        return d.id;
      });

      await deleteAttachments(moduleName, idsToDelete);
      refetchAttachments();

      setShowDeleteFiles(false);
    }
  }, [documents, refetchAttachments]);

  const checkIfInitialValuesChanged = (changedValues, allValues) => {
    const changedFields = Object.keys(changedValues);

    const _hasChanges = changedFields.some((field) => {
      return allValues[field] !== initialValues[field];
    });
    setHasChanges(_hasChanges);
  };

  const updateStatus = useCallback(
    async (orderStatus, orderId) => {
      if (orderStatus && orderId) {
        let statusOptions = [];

        statusOptions = getStatusOptions("Remake");

        await updateRemakeWorkOrderState(
          statusOptions.find((x) => x.key === orderStatus).value,
          orderId
        );

        refetchOrder();
      }
    },
    [refetchOrder]
  );

  const onSaveClick = (e) => {
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

  const onCancelSaveClick = () => {
    setShowSaveConfirmation(false);
  };

  return (
    <>
      <Form
        form={form}
        name="EditRemakeForm"
        colon={false}
        labelWrap
        requiredMark={customRequiredMark}
        onValuesChange={checkIfInitialValuesChanged}
        scrollToFirstError={true}
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
                orderId={order?.remakeId}
                label={order ? `Remake # ${order?.remakeId}` : ""}
                {...{ handleShare, isMobile, onClose, hasChanges }}
              />
              <OrderStatus
                statusKey={mapRemakeRowStateToKey(order?.status)}
                style={isMobile ? null : { margin: "0 0.5rem 0 0.5rem" }}
                updateStatusCallback={updateStatus}
                handleStatusCancelCallback={() => {}}
                statusList={RemakeRowStates}
                orderId={order?.id}
                id={order?.remakeId}
                isReadOnly={isReadOnly}
              />
            </div>
            {!isMobile && (
              <CloseButton
                onClose={() => onClose()}
                title="Close Remake"
                hasChanges={hasChanges}
              />
            )}
          </div>
        </div>
        <div
          className="flex w-full justify-end pb-2 space-x-3 sticky"
          style={{ zIndex: 0, borderBottom: "1px dotted lightgrey" }}
        >
          {!isMobile && !isReadOnly && (
            <Tooltip title={"Save Remake"}>
              <Button
                type={"primary"}
                onClick={onSaveClick}
                disabled={isSaving || !hasChanges}
                loading={isSaving}
                size="middle"
              >
                <span>Save</span>
              </Button>
            </Tooltip>
          )}
        </div>

        <Divider />

        <div className="grid md:grid-cols-2 md:gap-2 overflow-auto">
          <RemakeInfo {...{ inputData, form, isReadOnly }} />
          <div className="flex flex-col w-full h-full space-y-2">
            <RemakeProductionItem {...{ inputData, isReadOnly }} />
            <RemakeAttachments
              module={moduleName}
              moduleId={inputData?.id}
              isLoading={isFetchingAttachments || isLoadingAttachments}
              {...{
                documents,
                setDocuments,
                setShowAttachments,
                setShowDeleteFiles,
              }}
            />
          </div>
        </div>

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
              className={`${
                isSaving || !hasChanges ? "text-slate-500" : "text-white"
              } bg-centraBlue `}
              onClick={onSaveClick}
              disabled={isSaving || !hasChanges}
              loading={isSaving}
            >
              <div className="flex space-x-2 justify-center items-center font-semibold py-2">
                <FontAwesomeIcon icon={faSave}></FontAwesomeIcon>
                <span>Save</span>
              </div>
            </Button>
          </div>
        ) : null}
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
        onOk={handleDocumentsOk}
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
          documents={attachments}
          setContainsNewUnsavedFiles={setContainsNewUnsavedFiles}
          fileData={fileData}
          setFileData={setFileData}
          isNew={false}
        />
      </ActionModal>

      <ConfirmationModal
        title={`Update Confirmation`}
        open={showSaveConfirmation}
        onOk={onConfirmSaveClick}
        onCancel={onCancelSaveClick}
        cancelLabel={"No"}
        okLabel={"Yes"}
      >
        <div className="pt-2">
          <div>Are you sure you want to update this remake?</div>
        </div>
      </ConfirmationModal>

      <ConfirmationModal
        title={`Delete Confirmation`}
        open={showDeleteFiles}
        onOk={() => deleteCheckedFiles()}
        onCancel={() => setShowDeleteFiles(false)}
        okDisabled={!documents.find((x) => x.checked)}
        cancelLabel={"Cancel"}
        okLabel={"Ok"}
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
