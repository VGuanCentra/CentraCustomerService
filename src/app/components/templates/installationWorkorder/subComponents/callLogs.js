"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";

import { useQuery } from "react-query";
import moment from "moment";

import Title from "app/components/atoms/title/title";
import MuiModal from "app/components/atoms/modal/modal";
import Tooltip from "app/components/atoms/tooltip/tooltip";
import AntDatePicker from "app/components/atoms/datePicker/datePicker";
import CollapsibleGroup from "app/components/atoms/workorderComponents/collapsibleGroup";
import EditableLabel from "app/components/atoms/editableLabel/editableLabel";
import LockButton from "app/components/atoms/lockButton/lockButton";

import Collapse from "@mui/material/Collapse";
import {
  Tag,
  Dropdown,
  Menu,
  Modal,
  Input,
  Popconfirm,
  Button,
  Table,
  Space
} from "antd";
const { TextArea } = Input;

import {
  fetchCallLogsByParentId,
  updateCallLogs,
} from "app/api/installationApis";
import { InstallationCallLogCategories, ResultType } from "app/utils/constants";
import { YMDDateFormat, TimeFormat } from "app/utils/utils";

export default function CallLogs({
  style,
  viewConfig,
  showCallLogs,
  className,
  handleExpandCollapseCallback,
  recordId,
  actionItemId,
  canEdit
}) {
  const {
    isFetching,
    data: callLogsRaw,
    refetch,
  } = useQuery(
    "shippingcallLogs",
    () => {
      if (recordId) {
        return fetchCallLogsByParentId(recordId);
      }
    },
    { enabled: true }
  );

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFormModified, setIsFormModified] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [showCallLog, setShowCallLog] = useState(false);
  const [showPopOut, setShowPopOut] = useState(false);
  const [date, setDate] = useState(moment());
  const [callLogs, setCallLogs] = useState(null);
  const [text, setText] = useState(null);

  const { result } = useSelector((state) => state.calendar);
  const { userData, isMobile } = useSelector((state) => state.app);

  useEffect(() => {
    if (callLogsRaw?.data) {
      setCallLogs(
        callLogsRaw.data?.map((note, index) => {
          return { ...note, key: `note-${index}` };
        })
      );
    }
  }, [callLogsRaw]);

  const MenuItems = useCallback(({ onItemClick }) => {
    return (
      <Menu>
        {InstallationCallLogCategories.map((x, index) => {
          return (
            <Menu.Item
              key={index}
              className="p-0 m-0 pb-1"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Tag
                color={x.color}
                className="m-0 w-[10rem] hover:bg-white"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onItemClick(x);
                }}
              >
                <i className="fa-solid fa-angles-right pr-1" />
                {x.label}
              </Tag>
            </Menu.Item>
          );
        })}
      </Menu>
    );
  }, []);

  const handleDateChange = (val) => {
    if (val) {
      setDate(val);
    }
  };

  const handleTextChange = (e) => {
    if (e) {
      setText(e.target.value);
    }
  };

  const handleSaveNewCallLog = useCallback(
    (e) => {
      setShowCallLog(false);
      setText(null);
      let originalData = callLogs?.map((n) => {
        // Grab all original notes
        return {
          DateCalled: n.calledDate, // FF table column name is misspelled
          CalledMessage: n.calledMessage,
          Notes3: n.calledNotes,
          CalledBy1: ["centrarest"], // Api endpoint requires FF user be passed for each notes being added
          LoggedBy: n.calledBy,
        };
      });

      originalData.push({
        // Attach the new note
        DateCalled: moment(date).format("YYYY-MM-DDTHH:mm:ss"),
        CalledMessage: selectedCategory,
        Notes3: text,
        CalledBy1: ["centrarest"],
        LoggedBy: userData?.name,
      });

      let data = { CallLog: [...originalData] };

      updateCallLogs({
        // Pass everything to update endpoint
        module: "HomeInstallations",
        actionItemId: actionItemId,
        jsonCallLogs: JSON.stringify(data),
      });
    },
    [callLogs, date, text, selectedCategory, actionItemId, userData?.name]
  );

  const handleSaveAllCallLogs = useCallback(
    (e) => {
      if (e) {
        let data = callLogs?.map((n) => {
          // Grab all original notes
          return {
            DateCalled: n.calledDate, // FF table column name is misspelled
            CalledMessage: n.calledMessage,
            Notes3: n.calledNotes,
            CalledBy1: ["centrarest"], // Api endpoint requires FF user be passed for each notes being added
            LoggedBy: userData?.name,
          };
        });

        updateCallLogs({
          // Pass everything to update endpoint
          module: "HomeInstallations",
          actionItemId: actionItemId,
          jsonCallLogs: JSON.stringify({ CallLog: [...data] }),
        });

        setShowPopOut(false);
        setIsFormModified(false);
      }
    },
    [callLogs, actionItemId, userData?.name]
  );

  const handleEditOk = useCallback((payload, originalData, index) => {
    const key = Object.keys(payload)[0];
    if (key && index > -1) {
      setCallLogs((prev) => {
        let _prev = [...prev];
        _prev[index][key] = payload[key];
        return _prev;
      });
    }
  }, []);

  const columns = [
    {
      title: "Date",
      dataIndex: "calledDate",
      key: "calledDate",
      width: 120,
      sorter: (a, b) => new Date(a.calledDate) - new Date(b.calledDate),
      sertDirections: ["descend"],
      render: (calledDate) => <div>{YMDDateFormat(calledDate)}</div>,
    },
    {
      title: "Time",
      dataIndex: "calledDate",
      key: "calledDate",
      width: 100,
      render: (calledDate) => <div>{TimeFormat(calledDate)}</div>,
    },
    {
      title: "Note",
      dataIndex: "calledNotes",
      key: "calledNotes",
      render: (note, originalData, x) => (
        <div onClick={() => {}}>
          <EditableLabel
            inputKey={"calledNotes"}
            title={"Edit Note"}
            value={note}
            onSave={(data) => {
              handleEditOk(data, originalData, x);
              setIsFormModified(true);
            }}
            iconClass="mt-[-2px] text-blue-500"
            okLabel={"Ok"}
            multiline={true}
          >
            {note || "<Click to add>"}
          </EditableLabel>
        </div>
      ),
    },
    {
      title: "Logged By",
      dataIndex: "calledBy",
      key: "calledBy",
      width: 150,
    },
    {
      title: "Category",
      dataIndex: "calledMessage",
      key: "calledMessage",
      sorter: (a, b) =>
        a.calledMessage
          ?.toLowerCase()
          .localeCompare(b.calledMessage?.toLowerCase()),
      width: 120,
      render: (calledMessage, row, index) => (
        <Dropdown
          overlay={
            <MenuItems
              onItemClick={(val) => {
                setCallLogs((prev) => {
                  let _prev = [...prev];
                  _prev[index].calledMessage = val.value;
                  return _prev;
                });
                setIsFormModified(true);
              }}
            />
          }
          placement="topLeft"
          arrow
          trigger={["click"]}
        >
          <Tag
            color={
              InstallationCallLogCategories.find(
                (x) => x.value === calledMessage
              )?.color
            }
            className="text-[0.8rem] hover:cursor-pointer w-[9rem]"
          >
            {calledMessage}
          </Tag>
        </Dropdown>
      ),
    },
  ];

  const rowSelection = useMemo(() => {
    return {
      onChange: (_selectedRowKeys, selectedRows) => {
        setSelectedRowKeys(_selectedRowKeys);
      },
      getCheckboxProps: (record) => ({}),
    };
  }, []);

  const handleDeleteNotes = useCallback(() => {
    if (callLogs?.length > 0) {
      setCallLogs((prev) => {
        let newList = [];
        prev.forEach((n) => {
          let isSelected = selectedRowKeys.find((k) => k === n.key);
          if (!isSelected) {
            newList.push(n);
          }
        });
        setSelectedRowKeys([]);
        return newList;
      });
      setIsFormModified(true);
    }
  }, [callLogs, selectedRowKeys]);

  useEffect(() => {
    if (
      result?.type === ResultType.success &&
      result?.source === "Installation Call Logs"
    ) {
      refetch();
    }
  }, [result, refetch]);

  const CallLogItem = (props) => {
    const { callLog, index, color } = props;

    return (
      <div
        key={`note-${index}`}
        style={{          
          borderBottom: "1px dotted lightgrey",
        }}
        className="pb-1 mb-2"
      >
        {" "}
        {/* 49 to Leave space in between notes */}
        <div>
          <div className="flex flex-row justify-between">
            <div>
              <Tag color="#55acee">{index + 1}</Tag>
              <Tag>
                <span className="font-semibold">{YMDDateFormat(callLog.calledDate)}</span>
                <span className="pl-2 text-blue-700">{TimeFormat(callLog.calledDate)}</span>
              </Tag>
            </div>
            <span>
              <Tag>{callLog.calledBy}</Tag>
              <Tag color={color}>{`${callLog.calledMessage}`}</Tag>
            </span>
          </div>
          <div className="mt-2">{callLog.calledNotes}</div>
        </div>
      </div>
    )
  }

  return (
    <CollapsibleGroup
      id={"title-call-logs"}
      title={"Call Logs"}
      subTitle={`(${callLogs?.length || 0})`}
      expandCollapseCallback={() => handleExpandCollapseCallback("callLogs")}
      popOutStateCallback={(val) => setShowPopOut(val)}
      value={viewConfig?.expanded ? true : showCallLogs}
      style={{ marginTop: "1rem" }}
      //headerStyle={{ backgroundColor: "#EEF2FF" }}
      ActionButton={() => (
        <Tooltip title="Add a call log">
          <Dropdown
            overlay={<MenuItems onItemClick={(val) => { setSelectedCategory(val.value); setShowCallLog(true); }} />}
            placement="topLeft"
            arrow
            trigger={["click"]}
          >          
            <i className="fa-solid fa-square-plus text-[#3B82F6] hover:text-blue-400 text-xl mr-3 ml-[2px]"
              onClick={ (e) => { e.preventDefault(); e.stopPropagation(); }}
            />             
          </Dropdown>
        </Tooltip>
      )}
    >
      <Collapse in={viewConfig?.expanded ? true : showCallLogs}>
        {callLogs?.length > 0 && 
          <div className={`${className} p-2 flex flex-row justify-between mt-1`}>
            <div className="w-100 mr-4">
              {callLogs?.map((c, index) => {
                const color = InstallationCallLogCategories.find(x => x.value === c.calledMessage)?.color;
                return (
                  (index < (callLogs.length / 2)) && <CallLogItem callLog={c} index={index} key={index} color={color} />
                );
              })}
            </div>
            <div className="w-100 ml-4">
              {callLogs?.map((c, index) => {
                const color = InstallationCallLogCategories.find(x => x.value === c.calledMessage)?.color;
                return (
                  (index >= (callLogs.length / 2)) && <CallLogItem callLog={c} index={index} key={index} color={color} />
                );
              })}
            </div>
          </div>
        }
      </Collapse>
      <Modal
        centered
        cancelButtonProps={{
          size: "small",
        }}
        title={
          <Tag
            color={
              InstallationCallLogCategories.find(
                (x) => x.value === selectedCategory
              )?.color
            }
            className="text-[0.8rem]"
          >
            {`New Call Log - ${selectedCategory}`}
          </Tag>
        }
        open={showCallLog}
        onOk={() => {}}
        onCancel={() => {
          setShowCallLog(false);
        }}
        footer={(_, { OkBtn, CancelBtn }) => (
          <Space>
            <CancelBtn />
            <Popconfirm
              placement="left"
              title={"Add Note"}
              description={
                <div className="pt-2">
                  <div className="pb-2">Are you sure you want to save?</div>
                </div>
              }
              onConfirm={handleSaveNewCallLog}
              okText="Yes"
              cancelText="No"
            >
              <LockButton
                size="small"
                disabled={(!date || !text) || !canEdit}
                tooltip={"Save"}
                label={"Save"}
                showLockIcon={!canEdit}
              />                            
            </Popconfirm>
          </Space>
        )}
      >
        <div className="mt-[14px]">
          <div className="flex flex-row justify-between mb-2">
            <AntDatePicker
              format="YYYY-MM-DD hh:mm a"
              size="small"
              defaultValue={date}
              value={date}
              onChange={handleDateChange}
              showTime
            />
          </div>
          <TextArea
            rows={4}
            placeholder=""
            value={text}
            onChange={handleTextChange}
          />
        </div>
      </Modal>
      <MuiModal
        title=""
        open={showPopOut}
        onCancel={() => {
          setShowPopOut(false);
        }}
        centered
        okText="Save"
        style={{ width: "80vw", padding: "1rem" }}
      >
        <div className="flex flex-row justify-between">
          <Title
            label={"Call Logs Management"}
            className="inline-block mr-4 pt-1 pb-1 mb-3 pr-2"
            Icon={() => {
              return <i className="fa-solid fa-folder-open pr-2" />;
            }}
          ></Title>
          <div className="pl-8 pt-1">
            {isFormModified && (
              <Popconfirm
                placement="left"
                title={"Close"}
                description={
                  <div className="pt-2">
                    <div className="pb-2">
                      You have unsaved changes, are you sure?
                    </div>
                  </div>
                }
                onConfirm={() => {
                  setIsFormModified(false);
                  refetch();
                  setShowPopOut(false);
                }}
                okText="Yes"
                cancelText="No"
              >
                <i className="fa-solid fa-xmark text-xl text-gray-500 hover:cursor-pointer" />
              </Popconfirm>
            )}
            {!isFormModified && (
              <i
                className="fa-solid fa-xmark text-xl text-gray-500 hover:cursor-pointer"
                onClick={() => {
                  setShowPopOut(false);
                }}
              />
            )}
          </div>
        </div>
        <div className="flex flex-row justify-between pb-3 pt-3">
          <Popconfirm
            placement="left"
            title={"Delete Call Log(s)"}
            description={
              <div className="pt-2">
                <div className="pb-2">
                  Are you sure you want to delete the selected note(s)?
                </div>
              </div>
            }
            onConfirm={handleDeleteNotes}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              disabled={selectedRowKeys.length === 0 || !canEdit}
            >
              <i className="fa-solid fa-trash-can pr-2" />
              Delete
            </Button>
          </Popconfirm>
          <div className="flex flex-row">
            {isFormModified && (
              <Tooltip title="Changes not saved.">
                <i className="fa-solid fa-asterisk text-xs text-orange-300 mt-1 mr-2"></i>
              </Tooltip>
            )}
            <Popconfirm
              placement="left"
              title={"Save Updates"}
              description={
                <div className="pt-2">
                  <div className="pb-2">
                    Are you sure you want to save all your updates?
                  </div>
                </div>
              }
              onConfirm={handleSaveAllCallLogs}
              okText="Yes"
              cancelText="No"
            >
              <LockButton
                tooltip={"Save"}
                disabled={!isFormModified || !canEdit}
                showLockIcon={!canEdit}
                label={"Save"}                
              />
            </Popconfirm>
          </div>
        </div>
        <div
          style={{ borderTop: "1px dotted lightgrey" }}
          className="mb-3"
        ></div>
        <Table
          rowSelection={{ type: "checkbox", ...rowSelection }}
          columns={columns}
          dataSource={callLogs}
        />
      </MuiModal>
    </CollapsibleGroup>
  );
}
