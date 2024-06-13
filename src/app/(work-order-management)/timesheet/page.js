"use client";
import styles from "../work-order-management.module.css";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import { useAuthData } from "context/authContext";
import dayjs from 'dayjs';

import { Form, Table, Tag, Modal, message } from 'antd';

import TimesheetHeader from "app/(work-order-management)/timesheet/subComponents/timesheetHeader/timesheetHeader";
import TimesheetForm from "app/(work-order-management)/timesheet/subComponents/timesheetForm/timesheetForm";
import Tooltip from "app/components/atoms/tooltip/tooltip";

import { fetchTimesheetsByEmail, addTimesheet, editTimesheet, fetchActivePayPeriods, fetchWorkorders, fetchServicesAssignedToByEmail } from 'app/api/timesheetApis';
import { YMDDateFormat } from "app/utils/utils";

import { ServiceStates, ResultType } from "app/utils/constants";

export default function Timesheet() {
  const [allTimesheets, setAllTimesheets] = useState([]);
  const [filteredTimesheets, setFilteredTimesheets] = useState([]);
  const [defaultPeriod, setDefaultPeriod] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [periodSelectionOptions, setPeriodSelectionOptions] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [forceUpdate, setForceUpdate] = useState(false);
  const [isFormEditable, setIsFormEditable] = useState(true);
  const [defaultPayPeriod, setDefaultPayPeriod] = useState("all");  
  const [serviceOptions, setServiceOptions] = useState([]);
  const [workType, setWorkType] = useState([]);

  const { result } = useSelector(state => state.calendar);

  const defaultTimesheet = useMemo(() => ({
    crlcelwo: "",
    dateWorked: "",
    hours: "5",
    notes: "",
    period: "",
    periodDisplay: "",
    shopDrawings: "",
    status: "",
    supplyOnlyWO: "",
    workOrderNumber: "",
    workStatus: "1",
    workType: ""
  }), []);

  const [defaultTimesheetData, setDefaultTimesheetData] = useState(defaultTimesheet);

  const { loggedInUser } = useAuthData();

  const [form] = Form.useForm();

  const resetForm = useCallback(() => {
    form.resetFields(); 
  }, [form]);

  const Service = "Service";
  const OfficeAdministration = "Office / Administration";

  const { isFetching,
    data: timesheetsRaw,
    refetch } = useQuery("timesheets", () => {
      if (loggedInUser?.email) {        
        return fetchTimesheetsByEmail(loggedInUser.email)
      }
    }, {
      enabled: true,
      refetchOnWindowFocus: false
    });

  const { isFetching: isFetchingPayPeriods,
    data: payPeriodsRaw,
    refetch: refetchPayPeriods } = useQuery("payPeriods", () => {      
      return fetchActivePayPeriods()      
    }, {
      enabled: true,
      refetchOnWindowFocus: false
    });

  const { isFetching: isFetchingAssignedTo,
    data: assignedToRaw,
    refetch: refetchAssignedTo } = useQuery("assignedTo", () => {
      if (loggedInUser?.email) {  
        return fetchServicesAssignedToByEmail(loggedInUser.email); 
      }
    }, {
      enabled: true,
      refetchOnWindowFocus: false
    });

  useEffect(() => {
    if (timesheetsRaw?.data) {
      let _timesheets = timesheetsRaw?.data?.map((timesheet, index) => {
        return ({ ...timesheet, key: index, date: YMDDateFormat(timesheet.dateWorked) })
      })
      setAllTimesheets(_timesheets);
    }
  }, [timesheetsRaw]);

  useEffect(() => {
    if (payPeriodsRaw?.data) {
      let _newPeriodSelectionOptions = [];
      payPeriodsRaw.data.forEach((pp) => {
        if (new Date(pp.periodStart) <= Date.now() && new Date(pp.periodEnd) >= Date.now() && pp.branch_Display === loggedInUser?.branch) {
          setDefaultPayPeriod(pp);
        }
        if (pp.branch_Display === loggedInUser?.branch || pp.branch_Display === "Langley") {
          _newPeriodSelectionOptions.push({ value: pp.actionItemId, label: pp.title, isActive: pp.currentStateName === "Active" });
        }
      });

      setPeriodSelectionOptions(_newPeriodSelectionOptions);
    }
  }, [payPeriodsRaw, loggedInUser]);

  const WorkTypes = [   
    {
      key: "service",
      value: Service,
      label: Service,
      color: "blue",
      hexBackgroundColor: "#e6f4ff",
      hexForegroundColor: "#002c8c"
    },  
    {
      key: "officeAdministration",
      value: OfficeAdministration,
      label: OfficeAdministration,
      color: "geekblue",
      hexBackgroundColor: "#f0f5ff",
      hexForegroundColor: "#061178"
    },  
  ]

  const SelectionFields = {
    serviceWO: [Service]
  }

  const Status =
  {
    Accepted: "#2db7f5",
    Rejected: "#f50"
  }

  const WorkStatusOptions = useMemo(() => ([
    { value: "1", label: "Regular Time" },
    { value: "1.5", label: "Over Time" },
    { value: "2.0", label: "Double Time" }
  ]), []);

  const columns = [
    {
      title: 'WO#',
      dataIndex: 'serviceWorkOrderNumberDisplay',
      key: 'serviceWorkOrderNumberDisplay',
      sorter: (a, b) => a.serviceWorkOrderNumberDisplay - b.serviceWorkOrderNumberDisplay,
      width: "7%",
      align: "center"
    },
    {
      title: 'Work Type',
      dataIndex: 'workType',
      key: 'workType',
      sorter: (a, b) => a.workType.localeCompare(b.workType),
      width: "9%",
      render: (text) => (
        <Tag color={WorkTypes.find(wt => wt.label === text)?.color} style={{ display: 'block', textAlign: 'center' }}>
          {text}
        </Tag>
      ),
    },
    {
      title: 'Date Worked',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      width: "9%",
      align: "center"
    },
    {
      title: 'Hours',
      dataIndex: 'hours',
      key1: 'hours',
      width: "5%",
      align: "center"
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      width: "15%"
    },    
    {
      title: 'Work Status',
      dataIndex: 'workStatus',
      key: 'workStatus',
      width: "10%",
      align: "center",
      render: (val) => (
        <div>{WorkStatusOptions?.find(x => x.value === val)?.label}</div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      width: "10%",
      render: (text) => (
        <Tag color={Status[text]} style={{ display: 'block', textAlign: 'center' }}>
          {text}
        </Tag>
      ),
      align: "center"
    },
    {
      title: 'Pay Period',
      dataIndex: 'periodDisplay',
      key: 'periodDisplay',
      width: "14%",
      align: "center",
      render: (val) => {        
        const isActive = periodSelectionOptions?.find(x => x.label === val)?.isActive;
        return (
          <div className="flex flex-row justify-center">
            <div>{val?.replace(/\s/g, '')}</div>
            {val && <Tooltip title={isActive ? "Period Active" : "Period Closed"}>
              <div className="h-[5px] w-[5px] mt-[8px] ml-1 rounded" style={{ backgroundColor: isActive ? "green" : "gray" }}></div>
            </Tooltip>
            }
          </div>
        )
      },
    },      
  ];

  useEffect(() => {
    if (allTimesheets?.length > 0 && selectedPeriod) {
      if (selectedPeriod === "all") {
        setFilteredTimesheets([...allTimesheets]);
      } else {
        setFilteredTimesheets(allTimesheets.filter(x => (x.period === selectedPeriod)));
      }
    }
  }, [allTimesheets, selectedPeriod, defaultPayPeriod]);

  useEffect(() => {
    if (assignedToRaw?.data) {
      let _serviceRawOptions = assignedToRaw?.data?.map((w) => {
        return ({ value: w.serviceId, label: w.serviceId })
      });

      if (_serviceRawOptions?.length > 0) {
        setServiceOptions(_serviceRawOptions);
      }
    }
  }, [assignedToRaw]);

  const rowClick = useCallback((row) => {
    setIsNew(false);
    setShowCreate(true);
    setIsFormEditable(false);

    // Set Form Data
    setDefaultTimesheetData({
      workType: row?.workType,
      hours: row?.hours,
      status: row.status,
      period: row.period,
      periodDisplay: row.periodDisplay,
      notes: row.notes,
      workStatus: WorkStatusOptions?.find(x => x.value === row.workStatus)?.label,
      serviceWO: row.serviceWorkOrderNumberDisplay,
      dateWorked: dayjs(row.dateWorked || dayjs()),
      validationFailureReason: row.validationFailureReason,
      key: row.key
    });
  }, [WorkStatusOptions]);

  // Custom row hover style
  const rowProps = (record) => {
    return {
      onClick: () => rowClick(record),
      className: 'hover-pointer',
    };
  };

  const onFinish = useCallback((values, isEdit) => {
    console.log('values:', values);
                                                                                                   
    let payload = {};                                                       // Fallback for test network
    let _serviceWO = serviceOptions?.find(x => x.value === values.serviceWO); 
    
    if (values) {                                                       // Fallback for test network
      payload.employee = loggedInUser?.samAccountName?.toLowerCase(),
      payload.serviceWorkOrderNumber = _serviceWO?.value,
      payload.serviceWorkOrderNumberDisplay = _serviceWO?.label,
      payload.workType = values.workType,
      payload.workStatus = values.workStatus,
      payload.dateWorked = values.dateWorked,
      payload.hours = `${values.hours}`, // Force it to be string
      payload.notes = values.notes,
      payload.period = values.period,
      payload.periodDisplay = periodSelectionOptions.find(x => x.value === values.period)?.label,
      payload.validationFailureReason = "",
      payload.status = ""

      if (!isEdit) {        
        addTimesheet(payload);
      } else {        
        let _recordId = allTimesheets[values?.key]?.actionItemId;
        payload.recordID = _recordId;
        editTimesheet(payload);
      }
      
      setShowCreate(false);
    }
  }, [
    periodSelectionOptions,
    loggedInUser,
    serviceOptions,
    allTimesheets
  ]);

  const warning = (message) => {
    messageApi.open({
      type: 'error',
      content: message,
      duration: 3,
      style: {marginTop: "10rem"}
    });
  };

  const onFinishFailed = () => {
    warning("Please fill in all required fields.");
  }

  useEffect(() => {
    setForceUpdate(prev => !prev);
  }, [defaultTimesheetData]);

  useEffect(() => {
    resetForm();
  }, [forceUpdate, resetForm]);

  const newTimesheetClick = useCallback(() => {
    if (periodSelectionOptions?.length > 0) {
      setShowCreate(true);
      setIsNew(true);
      setIsFormEditable(true);

      setDefaultTimesheetData({
        ...defaultTimesheet, // Set default pay period to current and date worked as today
        period: defaultPayPeriod?.actionItemId,
        periodDisplay: defaultPayPeriod?.title,
        dateWorked: dayjs(),
        workType: Service        
      });
    }    
  }, [defaultTimesheet, periodSelectionOptions, defaultPayPeriod]);

  useEffect(() => {
    if (result?.type === ResultType.success && result?.source === "New Timesheet") {
      refetch();
    }
  }, [result, refetch]);

  useEffect(() => {
    if (loggedInUser?.email) {
      refetch();
      refetchAssignedTo();
    }
  }, [loggedInUser, refetch, refetchAssignedTo])

  return (
    <div className={styles.root}>
      {contextHolder}
      <TimesheetHeader
        states={ServiceStates}
        refetch={refetch}
        periodSelectionOptions={periodSelectionOptions}
        setSelectedPeriod={setSelectedPeriod}
        defaultPayPeriodActionItemId={defaultPayPeriod}
        selectedPeriod={selectedPeriod}
        newTimesheetClick={newTimesheetClick}
      />
      <div className={styles.outerContainer}>
        <div className={styles.innerContainer}>
          <div className="flex flex-col space-y-2">
            <div style={{ height: "calc(100vh - 220px)" }}>              
              <div>
                <Table
                  columns={columns}
                  dataSource={filteredTimesheets}
                  size="small"
                  pagination={{
                    position: ["topRight"],
                    defaultPageSize: 20,
                    pageSizeOptions: [20, 50, 100]
                  }}                  
                  scroll={{ y: "calc(100vh - 270px)" }}
                  style={{ height: "100%", cursor: "pointer" }}                  
                  onRow={rowProps}
                />
              </div>
              <Modal                
                open={showCreate}
                onCancel={() => { setShowCreate(false) }}
                centered={true}
                width={700}
                footer={null}
                closable={false}
                key={forceUpdate ? 'forceUpdate' : 'normal'}
                destroyOnClose={true}
              >                
                <TimesheetForm
                  {...{
                    onFinish,
                    onFinishFailed,
                    defaultTimesheetData,
                    form,
                    forceUpdate,
                    isFormEditable,
                    Status,
                    workTypes: WorkTypes,
                    isNew,
                    periodSelectionOptions,
                    WorkStatusOptions,
                    setShowCreate,
                    setIsFormEditable,
                    loggedInUser,
                    serviceOptions,
                    workType,
                    setWorkType,
                    selectionFields: SelectionFields,
                    defaultPayPeriod,
                    warning
                  }}
                />                               
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
