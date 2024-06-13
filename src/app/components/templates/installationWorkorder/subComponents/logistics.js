"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";

import moment from "moment";
import dayjs from 'dayjs';

import AntDatePicker from "app/components/atoms/datePicker/datePicker";
import CollapsibleGroup from "app/components/atoms/workorderComponents/collapsibleGroup";
import EditableLabel from "app/components/atoms/editableLabel/editableLabel";
import LockButton from "app/components/atoms/lockButton/lockButton";

import Collapse from "@mui/material/Collapse";
import {
  Tag,
  Button,
  Popconfirm,
  Table,
  DatePicker
} from "antd";

const { RangePicker } = DatePicker;

import Title from "app/components/atoms/title/title";
import MuiModal from "app/components/atoms/modal/modal";

import { updateReturnJobDate, updateInstallation, updateRemeasureReturnJobDate, updateNotes } from 'app/api/installationApis';
import { YMDDateFormat, TimeFormat } from "app/utils/utils";

export default function Logistics({
  inputData,
  setInputData,
  viewConfig,
  showLogistics,
  handleExpandCollapseCallback,
  workOrderDataFromParent,
  notes,
  canEdit
}) {

  const [showPopOut, setShowPopOut] = useState(false);
  const [isFormModified, setIsFormModified] = useState(false);
  const [logisticsData, setLogisticsData] = useState([]);
  const [newestRemeasureNote, setNewestRemeasureNote] = useState(null);

  useEffect(() => {
    let _logisticsData = [
      { type: "Remeasure", date: inputData?.remeasureDate, reason: newestRemeasureNote },
      { type: "Remeasure Return Trip", date: inputData?.remeasureReturnTripDate, reason: inputData?.remeasureReturnTripReason },
      { type: "Return Trip", startDate: inputData?.returnedStartScheduleDate, endDate: inputData?.returnedEndScheduleDate, reason: inputData?.returnTripReason }
    ];

    setLogisticsData(_logisticsData)

  }, [inputData, newestRemeasureNote]);

  useEffect(() => {
    if (notes?.length > 0) {
      const remeasureNote = notes?.filter(x => x.category === "Re-Measure");
      setNewestRemeasureNote(remeasureNote?.length > 0 && remeasureNote[remeasureNote.length - 1]?.note);
    }
  }, [notes]);

  const handleSaveRemeasureNote = useCallback((e) => {
    let originalData = notes?.map(n => { // Grab all original notes
      return {
        GerneralNotesDate: n.date, // FF table column name is misspelled
        Category: n.category,
        GeneralNotes: n.note,
        CalledBy1: ["centrarest"] // Api endpoint requires FF user be passed for each notes being added
      }
    });

    originalData.push({ // Attach the new note
      GerneralNotesDate: moment().format("YYYY-MM-DDTHH:mm:ss"),
      Category: "Re-Measure",
      GeneralNotes: newestRemeasureNote,
      CalledBy1: ["centrarest"],
      LoggedBy1: ""
    })

    let data = { GeneralNotesList: [...originalData] };

    updateNotes({ // Pass everything to update endpoint
      module: "HomeInstallations",
      actionItemId: workOrderDataFromParent.actionItemId,
      jsonGeneralNotes: JSON.stringify(data)
    });
  }, [notes, newestRemeasureNote, workOrderDataFromParent]);

  const handleSaveData = useCallback((e) => {
    if (e && inputData) {      
      let remeasureDateData = {
        actionItemId: workOrderDataFromParent?.actionItemId,
        jsonFields: JSON.stringify({ remeasureDate: inputData?.remeasureDate ? moment(inputData?.remeasureDate).format('YYYY-MM-DDTHH:mm:ss.SSS') : null })
      }

      let remeasureReturnTripDateData = {
        "actionItemId": workOrderDataFromParent?.actionItemId,
        "returnTripStartDate": inputData?.remeasureReturnTripDate ? new Date(inputData?.remeasureReturnTripDate)?.toISOString() : null,
        "returnTripEndDate": null,
        "returnTripReason": inputData?.remeasureReturnTripReason
      }

      let returnStartScheduleDateData = {
        "actionItemId": workOrderDataFromParent?.actionItemId,
        "returnTripStartDate": inputData?.returnedStartScheduleDate ? new Date(inputData.returnedStartScheduleDate)?.toISOString() : null,
        "returnTripEndDate": inputData?.returnedEndScheduleDate ? new Date(inputData.returnedEndScheduleDate)?.toISOString() : null,
        "returnTripReason": inputData?.returnTripReason
      }
      
      // Remeasure
      if (workOrderDataFromParent.remeasureDate !== inputData.remeasureDate) {
        updateInstallation(remeasureDateData);
      }

      const _remeasureNotes = notes?.filter(x => x.category === "Re-Measure");

      if ((newestRemeasureNote !== ((_remeasureNotes?.length > 0) ? _remeasureNotes[_remeasureNotes?.length - 1]?.note : ""))) {
        handleSaveRemeasureNote();
      }
      
      // Remeasure Return Job
      if ((workOrderDataFromParent.remeasureReturnTripDate !== inputData.remeasureReturnTripDate) || (workOrderDataFromParent.remeasureReturnTripReason !== inputData.remeasureReturnTripReason)){
        updateRemeasureReturnJobDate(remeasureReturnTripDateData);      
      }

      // Return Job
      if ((workOrderDataFromParent.returnedStartScheduleDate !== inputData.returnedStartScheduleDate) ||
        (workOrderDataFromParent.returnedEndScheduleDate !== inputData.returnedEndScheduleDate) ||
        (workOrderDataFromParent.returnTripReason !== inputData.returnTripReason)) {
        updateReturnJobDate(returnStartScheduleDateData);
      }      
    }
    setShowPopOut(false);
  }, [workOrderDataFromParent, inputData, newestRemeasureNote, notes, handleSaveRemeasureNote]);

const getItemColor = (type) => {
  let result = "purple";

  if (type === "Remeasure Return Trip") {
    result = "magenta";
  } else if (type === "Return Trip") {
    result = "red";
  }

  return result;
}

  const handleEditOk = useCallback((payload, originalData, index) => {
  if (originalData?.type === "Return Trip") {
    setInputData(prev => {
      let _prev = { ...prev };
      _prev.returnTripReason = payload.reason;
      return _prev;
    });
  } else if (originalData?.type === "Remeasure Return Trip") {
    setInputData(prev => {
      let _prev = { ...prev };
      _prev.remeasureReturnTripReason = payload.reason;
      return _prev;
    });
  } else if (originalData?.type === "Remeasure") {    
    setNewestRemeasureNote(payload.reason);
  }
  setIsFormModified(true);
}, [setInputData]);

const handleDateChange = useCallback((newDate, originalData) => {
  if (newDate && originalData) {
    if (originalData?.type === "Remeasure") {
      setInputData(prev => {
        let _prev = { ...prev };
        _prev.remeasureDate = newDate.format('MM/DD/YYYY HH:mm:ss');
        return _prev;
      });
    } else if (originalData?.type === "Remeasure Return Trip") {
      setInputData(prev => {
        let _prev = { ...prev };
        _prev.remeasureReturnTripDate = newDate.format('MM/DD/YYYY HH:mm:ss');
        return _prev;
      });
    }
    setIsFormModified(true);
  }
}, [setInputData]);

  const handleDateRangeChange = useCallback((dates, dateStrings) => {
    if (dateStrings?.length > 1) {
      setInputData(prev => {
        let _prev = { ...prev };
        _prev.returnedStartScheduleDate = dates[0].format('MM/DD/YYYY HH:mm:ss');
        _prev.returnedEndScheduleDate = dates[1].format('MM/DD/YYYY HH:mm:ss');
        return _prev;
      });
      setIsFormModified(true);
    }
  }, [setInputData]);

const columns = [
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    width: 150,
    render: (type) => <Tag color={getItemColor(type)} className="w-[8.5rem]">{type}</Tag>,
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    width: 250,
    render: (date, originalData) => {
      if (originalData.type !== "Return Trip") {
        return (
          <div>
            <AntDatePicker
              format="YYYY-MM-DD hh:mm a"
              size="small"
              value={date ? moment(date) : null}
              onChange={(newDate) => { handleDateChange(newDate, originalData) }}
              showTime
              className="w-[15rem]"
            //disabled={disabled || isReadOnly}
            />
          </div>
        )
      } else {
        return (
          <div>
            <RangePicker
              className="w-[15rem]"
              size="small"
              onChange={handleDateRangeChange}
              //disabled={disabled}
              value={[
                originalData.startDate ? dayjs(originalData.startDate) : null,
                originalData.endDate ? dayjs(originalData.endDate) : null
              ]}
            />
          </div>
        )
      }
    }
  },
  {
    title: "Reason / Note",
    dataIndex: "reason",
    key: "reason",
    render: (reason, originalData) => (
      <div onClick={() => { }}>
        <EditableLabel
          inputKey={"reason"}
          title={"Edit Note"}
          value={reason}
          onSave={(data) => {
            handleEditOk(data, originalData);
            setIsFormModified(true);
          }}
          iconClass="mt-[-2px] text-blue-500"
          okLabel={"Ok"}
          multiline={true}
        >
          {reason || "<Click to add>"}
        </EditableLabel>
      </div>
    ),
  }
  ];

return (
  <CollapsibleGroup
    id={"title-logistics"}
    title={"Logistics"}
    canEdit={true}
    popOutStateCallback={(val) => setShowPopOut(val)}
    expandCollapseCallback={() => handleExpandCollapseCallback("logistics")}
    value={showLogistics}
    style={{ marginTop: "0.5rem", backgroundColor: "#FFF" }}
  >
    <Collapse in={viewConfig?.expanded ? true : showLogistics}>
      <div className="p-2 flex flex-row justify-between pt-2">
        <div className="w-[33%] pr-3">
          <div className="flex flex-row pb-2" style={{ borderBottom: "1px dotted lightgrey" }}>
            <Tag color={"purple"}>
              {"Remeasure"}
            </Tag>
            <Tag>
              {inputData?.remeasureDate &&
                <>
                  <span className="font-semibold">{YMDDateFormat(inputData?.remeasureDate)}</span>
                  <span className="pl-2 text-blue-700">{TimeFormat(inputData?.remeasureDate)}</span>
                </>
              }
              {!inputData?.remeasureDate &&
                <span>No schedule set</span>
              }
            </Tag>
          </div>
          <div>
          </div>
          <div className="text-xs pt-2 pl-1">
            {newestRemeasureNote}
          </div>
        </div>
        <div className="w-[33%] pr-3">
          <div className="flex flex-row pb-2" style={{ borderBottom: "1px dotted lightgrey" }}>
            <Tag color={"magenta"}>
              {"Remeasure Return Trip"}
            </Tag>
            <Tag>
              {inputData?.remeasureReturnTripDate &&
                <>
                  <span className="font-semibold">{YMDDateFormat(inputData?.remeasureReturnTripDate)}</span>
                  <span className="pl-2 text-blue-700">{TimeFormat(inputData?.remeasureReturnTripDate)}</span>
                </>
              }
              {!inputData?.remeasureReturnTripDate &&
                <span>No schedule set</span>
              }
            </Tag>
          </div>
          <div>
          </div>
          <div className="text-xs pt-2 pl-1">
            {inputData?.remeasureReturnTripReason}
          </div>
        </div>
        <div className="w-[33%] pr-3">
          <div className="flex flex-row pb-2" style={{ borderBottom: "1px dotted lightgrey" }}>
            <Tag color={"red"}>
              {"Return Trip"}
            </Tag>
            <Tag>
              {inputData?.returnedStartScheduleDate &&
                <span className="font-semibold">{`${YMDDateFormat(inputData?.returnedStartScheduleDate)} - ${YMDDateFormat(inputData?.returnedEndScheduleDate)}`}</span>
              }
              {!inputData?.returnedStartScheduleDate &&
                <span>No schedule set</span>
              }
            </Tag>
          </div>
          <div>
          </div>
          <div className="text-xs pt-2 pl-1">
            {inputData?.returnTripReason}
          </div>
        </div>
      </div>
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
            label={"Logistics Management"}
            className="inline-block mr-4 pt-1 pb-1 pr-2"
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
          <div></div>
          <div className="flex flex-row">
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
              onConfirm={handleSaveData}
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
          columns={columns}
          dataSource={logisticsData}
          pagination={false}
        />
      </MuiModal>
    </Collapse>
  </CollapsibleGroup>
);
}
