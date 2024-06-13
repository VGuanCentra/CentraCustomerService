"use client";
import React, { useCallback, useEffect, useState } from "react";
import Tooltip from "app/components/atoms/tooltip/tooltip";
import { Timeline } from "antd";
import { mapCallMessageTypeToKey } from "app/utils/utils";
import moment from "moment";
import ConfirmationModal from "app/components/atoms/confirmationModal/confirmationModal";
import { useAuthData } from "context/authContext";
import { DropdownButton } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import DateTimeItem from "app/components/atoms/workorderComponents/dateTimeItem";
import LockButton from "app/components/atoms/lockButton/lockButton";
import { Button } from "antd";
import styles from "./callLog.module.css";
import UserLabel from "../users/userLabel";
import { convertToLocaleDateTimelll } from "app/utils/date";
import { useSelector } from "react-redux";

export default function CallLogs(props) {
  const {
    moduleId,
    mode = "expanded",
    callLogs,
    calledMessageTypes,
    handleCallLogSave,
    handleCallLogDelete,
    readOnly = false,
    canAdd = false,
    canEdit = false,
    canDelete = false,
  } = props;
  const { loggedInUser } = useAuthData();
  const [callLogsTLInput, setCallLogsTLInput] = useState([]);
  const [showDeleteCallLog, setShowDeleteCallLog] = useState(false);
  const [callLogIdToDelete, setCallLogIdToDelete] = useState(null);
  const [originalCallLogs, setOriginalCallLogs] = useState([]);
  const [tempCallLogs, setTempCallLogs] = useState([]);

  const { isMobile } = useSelector((state) => state.app);

  let messageTypes = Object.entries(calledMessageTypes).map((e) => {
    return { key: e[0], value: e[1].label, color: e[1].color, icon: e[1].icon };
  });

  useEffect(() => {
    if (callLogs) {
      const _originalCallLogs = JSON.parse(JSON.stringify(callLogs));
      setOriginalCallLogs(_originalCallLogs);

      const _t = JSON.parse(JSON.stringify(callLogs));

      _t.forEach((t) => {
        t["isEditing"] = false;
      });

      setTempCallLogs(_t);
    }
  }, [callLogs]);

  const handleUpdateCallLog = useCallback(
    (callLogId, column, value, type = null) => {
      setTempCallLogs((prevCallLogs) => {
        let _p = JSON.parse(JSON.stringify(prevCallLogs));
        let _cl = _p.find((p) => p.id === callLogId);

        if (column === "isEditing") {
          if (value === true) {
            _p.forEach((callLog) => {
              if (callLog.id !== callLogId && callLog[column] === true) {
                let _og = originalCallLogs.find((cl) => cl.id === callLog.id);
                if (_og) {
                  Object.assign(callLog, _og);
                  callLog.isEditing = false;
                }
              }
            });
            _cl.isEditing = true;
          } else {
            if (_cl && _cl.id === "") {
              return _p.filter((p) => p.id !== callLogId);
            } else {
              // Handle the case when isEditing is set to false
              let _og = originalCallLogs.find((cl) => cl.id === callLogId);
              if (_og) {
                Object.assign(_cl, _og);
                _cl.isEditing = false;
              }
            }
          }
        } else {
          if (column === "calledDate") {
            let newDate = moment(_cl[column]);

            switch (type) {
              case "date":
                const newDateValue = moment(value);
                newDate.set({
                  year: newDateValue.year(),
                  month: newDateValue.month(),
                  date: newDateValue.date(),
                });
                break;
              case "time":
                const newTime = moment(value, "HH:mm");
                newDate.set({
                  hour: newTime.hour(),
                  minute: newTime.minute(),
                  second: newTime.second(),
                });
                break;
            }

            _cl[column] = newDate.toISOString();
          } else _cl[column] = value;
        }

        return _p;
      });
    },
    [originalCallLogs]
  );

  const onCancelClick = useCallback(
    (id) => {
      handleUpdateCallLog(id, "isEditing", false);
    },
    [handleUpdateCallLog]
  );

  const onCatSelect = useCallback(
    (id, val) => {
      handleUpdateCallLog(id, "calledMessage", val);
    },
    [handleUpdateCallLog]
  );

  const onDtChange = useCallback(
    (e, type, id) => {
      handleUpdateCallLog(id, "calledDate", e.target.value, type);
    },
    [handleUpdateCallLog]
  );

  const onNoteTxtChange = useCallback(
    (id, val) => {
      handleUpdateCallLog(id, "calledNotes", val);
    },
    [handleUpdateCallLog]
  );

  const onAddCallLogClick = useCallback(() => {
    setTempCallLogs((prevCallLogs) => {
      let _p = JSON.parse(JSON.stringify(prevCallLogs));
      _p.forEach((p) => {
        let _og = originalCallLogs.find((cl) => cl.id === p.id);
        if (_og) {
          Object.assign(p, _og);
          p.isEditing = false;
        }
      });

      let _nCL = {
        id: "",
        parentId: moduleId,
        calledNotes: "",
        calledDate: new Date().toISOString(),
        calledMessage: messageTypes[0].value,
        calledBy: loggedInUser ? loggedInUser.name : "Test User",
        isEditing: true,
      };

      _p.unshift(_nCL);
      return _p;
    });
  }, [originalCallLogs, loggedInUser, messageTypes, moduleId]);

  const CallLogButton = () => {
    return (
      <Tooltip title="Create new call log">
        <div
          className="text-centraBlue text-xs hover:text-blue-400 cursor-pointer space-x-2"
          onClick={onAddCallLogClick}
        >
          <span className="hover:underline">Add Call Log</span>
        </div>
      </Tooltip>
    );
  };

  const CallLogLabel = (callLog) => {
    return (
      <>
        {mode === "expanded" ? (
          <>
            {callLog.isEditing ? (
              <div
                className={`flex space-x-4 ${
                  isMobile ? "justify-start mb-2" : "pl-2 justify-end"
                }`}
              >
                <DateTimeItem
                  id={callLog.id}
                  name={"calledDate"}
                  value={callLog.calledDate}
                  onChange={onDtChange}
                  showLabel={false}
                  style={{ color: "var(--centrablue)" }}
                />
              </div>
            ) : (
              <div className="flex flex-col space-y-1 text-xs mr-2">
                <div className="flex items-center justify-end space-x-1">
                  <UserLabel username={callLog.calledBy} />
                </div>
                <div className="text-gray-400">
                  {convertToLocaleDateTimelll(callLog.calledDate)}
                </div>
              </div>
            )}
          </>
        ) : (
          <span className="text-gray-400 text-xs mr-2">
            {convertToLocaleDateTimelll(callLog.calledDate)}
          </span>
        )}
      </>
    );
  };

  const onEditClick = useCallback(
    (id) => {
      handleUpdateCallLog(id, "isEditing", true);
    },
    [handleUpdateCallLog]
  );

  const handleDeleteCallLogClick = (id) => {
    if (id) {
      setCallLogIdToDelete(id);
      setShowDeleteCallLog(true);
    }
  };

  const onDeleteConfirm = useCallback(async () => {
    if (callLogIdToDelete) {
      setShowDeleteCallLog(false);
      await handleCallLogDelete(callLogIdToDelete);
      setCallLogIdToDelete(null);
    }
  }, [callLogIdToDelete, handleCallLogDelete]);

  const onDeleteCancel = useCallback(async () => {
    setShowDeleteCallLog(false);
    setCallLogIdToDelete(null);
  }, []);

  const getCallLogChild = (callLog) => {
    var messageType = messageTypes.find(
      (cmt) => cmt.key === mapCallMessageTypeToKey(callLog.calledMessage)
    );
    return (
      <>
        {mode === "expanded" ? (
          <>
            {isMobile && (
              <>
                {callLog.isEditing ? (
                  <DateTimeItem
                    id={callLog.id}
                    name={"calledDate"}
                    value={callLog.calledDate}
                    onChange={onDtChange}
                    showLabel={false}
                    style={{ color: "var(--centrablue)", marginBottom: "10px" }}
                  />
                ) : (
                  <div className="flex text-xs items-center space-x-2 mb-2">
                    <div className="flex items-center justify-end space-x-1">
                      <UserLabel username={callLog.calledBy} />
                    </div>
                    <div className="text-gray-400">
                      {convertToLocaleDateTimelll(callLog.calledDate)}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="space-x-2 bg-gray-100 p-2 rounded-sm flex flex-col shadow-sm">
              {callLog.isEditing ? (
                <div className="flex flex-col space-y-2">
                  <div>
                    <Tooltip title="Choose Called Message Type">
                      <DropdownButton
                        id="dropdown-basic-button"
                        size="sm"
                        title={
                          <span>
                            <i
                              className={`${
                                callLog.calledMessage
                                  ? messageTypes.find(
                                      (option) =>
                                        option.key ===
                                        mapCallMessageTypeToKey(
                                          callLog.calledMessage
                                        )
                                    ).icon
                                  : messageTypes[0].icon
                              } text-white text-xs`}
                            ></i>
                            <span className="text-sm">
                              {callLog.calledMessage
                                ? messageTypes.find(
                                    (option) =>
                                      option.key ===
                                      mapCallMessageTypeToKey(
                                        callLog.calledMessage
                                      )
                                  ).value
                                : messageTypes[0].value}
                            </span>
                          </span>
                        }
                      >
                        {messageTypes.map((c, index) => {
                          return (
                            <Dropdown.Item
                              onClick={() => onCatSelect(callLog.id, c.value)}
                              key={`dropdown-msgtype-${index}`}
                            >
                              <span className="text-sm">
                                <i className={c.icon}></i>
                                {c.value}
                              </span>
                            </Dropdown.Item>
                          );
                        })}
                      </DropdownButton>
                    </Tooltip>
                  </div>
                  <textarea
                    id={`callLogText${callLog.id}`}
                    className={`${styles.textArea}`}
                    disabled={!callLog.isEditing}
                    onChange={(e) =>
                      onNoteTxtChange(callLog.id, e.target.value)
                    }
                    rows={2}
                    value={callLog.calledNotes}
                  />
                  <div className="flex space-x-2 justify-end">
                    <Button
                      onClick={() => onCancelClick(callLog.id)}
                      size="small"
                    >
                      Cancel
                    </Button>
                    <LockButton
                      tooltip={"Save Call Log"}
                      onClick={() => handleCallLogSave(callLog)}
                      disabled={false}
                      showLockIcon={false}
                      label={"Save"}
                      size="small"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-1 items-center">
                      <div
                        className="text-xs"
                        style={{ color: messageType.color }}
                      >
                        {messageType.value}{" "}
                      </div>
                    </div>
                    {!readOnly && (
                      <div className="flex space-x-2 items-center">
                        {canEdit && (
                          <Tooltip title="Edit Call Log">
                            <i
                              className="fa-solid fa-pen cursor-pointer opacity-20 hover:opacity-100"
                              onClick={() => onEditClick(callLog.id)}
                            />
                          </Tooltip>
                        )}

                        {canDelete && (
                          <Tooltip title="Delete Call Log">
                            <i
                              className="fa-solid fa-trash cursor-pointer opacity-20 hover:opacity-100"
                              onClick={() =>
                                handleDeleteCallLogClick(callLog.id)
                              }
                            />
                          </Tooltip>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="font-regular pt-2">
                    {" "}
                    {callLog.calledNotes}
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center space-x-2">
            {/* <i className={messageType.icon}></i> */}
            <div className="text-xs mt-1">{messageType.value}</div>

            {isMobile && (
              <span className="text-xs" style={{ color: messageType.color }}>
                {convertToLocaleDateTimelll(callLog.calledDate)}
              </span>
            )}
          </div>
        )}
      </>
    );
  };

  useEffect(() => {
    if (tempCallLogs) {
      var tlItems = [];

      const hasAddItemEnabled =
        tempCallLogs.filter((cl) => cl.id === 0 && cl.isEditing === true)
          .length > 0;

      if (mode === "expanded" && !hasAddItemEnabled && !readOnly && canAdd) {
        tlItems.push({
          label: "",
          children: CallLogButton(),
          color: "#9FB6CD",
          dot: <i class="fa-solid fa-phone" />,
        });
      }

      if (tempCallLogs?.length > 0) {
        tempCallLogs.map((cl) => {
          var item = {
            label: isMobile ? null : CallLogLabel(cl),
            children: getCallLogChild(cl),
            color: messageTypes.find(
              (cmt) => cmt.key === mapCallMessageTypeToKey(cl.calledMessage)
            ).color,
            dot: (
              <i
                className={
                  messageTypes.find(
                    (cmt) =>
                      cmt.key === mapCallMessageTypeToKey(cl.calledMessage)
                  ).icon
                }
              />
            ),
          };

          tlItems.push(item);
        });
      }

      setCallLogsTLInput(tlItems);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempCallLogs]);

  return (
    <>
      {mode === "expanded" ? (
        <>
          {tempCallLogs.length > 0 ? (
            <div className="pt-4 px-4 pb-2 w-full h-full">
              <Timeline mode="left" items={callLogsTLInput}></Timeline>
            </div>
          ) : (
            <div
              className={`flex ${
                isMobile ? "justify-center h-full" : "justify-between"
              }  items-center`}
            >
              {!isMobile && (
                <div className="pl-6 py-4 text-gray-400 text-xs">
                  No call logs have been added for this order.
                </div>
              )}
              {!readOnly && canAdd && (
                <div className="pr-4">{CallLogButton()}</div>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          {callLogsTLInput.length > 0 && (
            <div className="pt-8 px-4 w-full h-full">
              <Timeline mode="left" items={callLogsTLInput}></Timeline>
            </div>
          )}
        </>
      )}

      <ConfirmationModal
        title={`Delete Call Log`}
        open={showDeleteCallLog}
        onOk={onDeleteConfirm}
        onCancel={onDeleteCancel}
        cancelLabel={"No"}
        okLabel={"Yes"}
      >
        <div className="pt-2">
          <div>Are you sure you want to delete this call log?</div>
        </div>
      </ConfirmationModal>
    </>
  );
}
