"use client";
import styles from "./installationWorkorder.module.css";
import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";

import { motion } from "framer-motion";

import LockButton from "app/components/atoms/lockButton/lockButton";
import WOInfoBar from "app/components/atoms/workorderComponents/woInfoBar";
import CustomerInfoBar from "app/components/atoms/workorderComponents/customerInfoBar";
import WORoot from "app/components/atoms/workorderComponents/woRoot";
import Overview from "./subComponents/overview";
import Parameters from "./subComponents/parameters";
import StaffAllocation from "./subComponents/staffAllocation";
import Documents from "./subComponents/documents";
import Summary from "./subComponents/summary";
import Photos from "./subComponents/photos";
import CallLogs from "./subComponents/callLogs";
import Notes from "./subComponents/notes";
import JobReview from "./subComponents/jobReview";
import Logistics from "./subComponents/logistics";
import Schedule from "app/components/templates/installationWorkorder/subComponents/schedule";
import StatusTable from "./subComponents/statusTable";

import { useInView, InView } from "react-intersection-observer";
import { useQuery } from "react-query";
import moment from "moment";

import { Installation, ResultType } from "app/utils/constants";
import { YMDDateFormat } from "app/utils/utils";

import {
  fetchInstallationWorkOrder,
  fetchInstallersById,
  fetchInstallationStaff,
  fetchProductionAndShippingDateByWONumber,
  fetchSubTradesByWONumber,
  updateInstallation,
  updateInstallationInstallData,
  updateStaff,
  fetchNotesByParentId
} from "app/api/installationApis";

import useDepartment from "app/hooks/useDepartment";
import usePermissions from "app/hooks/usePermissions";

export default function InstallationWorkOrder(props) {
  const { getWOColors } = useDepartment();

  const {
    onChange,
    onCloseCallback,
    viewConfig,
    action,
    className,
  } = props;

  const { workOrderData: workOrderDataFromParent } = useSelector((state) => state.calendar);

  const [inputData, setInputData] = useState(null);
  const [statusKey, setStatusKey] = useState(null);
  const [crew, setCrew] = useState({});
  const [allStaff, setAllStaff] = useState([]);
  const [staff, setStaff] = useState([]);
  const [subTrades, setSubTrades] = useState([]);

  const [showAttachments, setShowAttachments] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showCallLogs, setShowCallLogs] = useState(false);
  const [showJobReview, setShowJobReview] = useState(false);
  const [showLogistics, setShowLogistics] = useState(true);
  const [showStatusTable, setShowStatusTable] = useState(false);

  const [installationChangeItems, setInstallationChangeItems] = useState([]);
  const [dateChangeItems, setDateChangeItems] = useState([]);
  const [seniorInstallerChangeItem, setSeniorInstallerChangeItem] = useState(null);
  const [remeasurerChangeItem, setRemeasurerChangeItem] = useState(null);
  const [installersChangeItem, setInstallersChangeItem] = useState(null);

  const { result } = useSelector(state => state.calendar);

  const { isFetching, data: workOrderDataRaw, refetch, remove } = useQuery("installationWorkorder", () => {
    if (workOrderDataFromParent?.workOrderNumber) {
      return fetchInstallationWorkOrder(workOrderDataFromParent.workOrderNumber);
    }
  }, {
    enabled: true,
    refetchOnWindowFocus: false
  });

  const { isFetching: isFetchingInstallers, data: installersRaw, refetchInstallers, removeInstallers } = useQuery("installationInstallers", () => {
    if (workOrderDataFromParent?.workOrderNumber) {
      return fetchInstallersById(workOrderDataFromParent.workOrderNumber);
    }
  }, {
    enabled: true,
    refetchOnWindowFocus: false
  });

  const { isFetching: isFetchingStaff, data: staffRaw, refetch: refetchStaff } = useQuery("installationStaff", () => {
    if (workOrderDataFromParent?.workOrderNumber) {
      return fetchInstallationStaff(); // Fetch all staff anf filter after
    }
  }, {
    enabled: true,
    refetchOnWindowFocus: false
  });

  const { isFetching: isFetchingProdShipDates, data: prodShipDateRaw, refetch: refetchProdAndShipping } = useQuery("installationProdAndShipDates", () => {
    if (workOrderDataFromParent?.workOrderNumber) {
      return fetchProductionAndShippingDateByWONumber(workOrderDataFromParent.workOrderNumber);
    }
  }, {
    enabled: true,
    refetchOnWindowFocus: false
  });

  const { isFetching: isFetchingSubTrades, data: subTradesRaw, refetch: refetchSubtrades } = useQuery("installationSubtrades", () => {
    if (workOrderDataFromParent?.workOrderNumber) {
      return fetchSubTradesByWONumber(workOrderDataFromParent.workOrderNumber);
    }
  }, {
    enabled: true,
    refetchOnWindowFocus: false
  });

  const { isFetching: isFetchingNotes,
    data: notesRaw,
    refetch: refetchNotes } = useQuery("installationNotes", () => {
      if (workOrderDataFromParent?.recordId) {
        return fetchNotesByParentId(workOrderDataFromParent?.recordId)
      }
    }, {
      enabled: true,
      refetchOnWindowFocus: false
    });

  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: "0px 0px",
  });

  const { getUserHasFeatureEditByName } = usePermissions();

  useEffect(() => {
    if (workOrderDataRaw?.data) {
      setInputData({ ...workOrderDataRaw.data });
    }
  }, [workOrderDataRaw]);

  useEffect(() => {
    if (installersRaw?.data) {
      setCrew((x) => {
        let _x = { ...x };
        _x.seniorInstaller = installersRaw.data?.seniorInstaller;
        _x.installers = installersRaw?.data?.CrewNames
          ? installersRaw.data.CrewNames.replace(/(\r\n|\n|\r)/gm, "")?.split(
            ","
          )
          : [];
        _x.remeasurer = installersRaw.data?.RemeasureName;
        return _x;
      });
    }
  }, [installersRaw]);

  // Remove duplicate names - Api giving duplicate names though userId's are unique
  useEffect(() => {
    if (staffRaw?.data) {
      let uniqueStaff = staffRaw.data?.reduce((accumulator, currentValue) => {
        if (!accumulator.find(x => x.name === currentValue.name)) {
          accumulator.push(currentValue);
        }
        return accumulator;
      }, []);

      if (uniqueStaff?.length > 0) {
        setAllStaff(uniqueStaff)
      }
    }
  }, [staffRaw]);

  useEffect(() => {
    let branchStaff = allStaff.filter(x => x.branch === inputData?.branch);
    let lowerMainlandStaff = allStaff.filter(x => x.branch === "LowerMainland");

    if (inputData?.branch === "Langley") {
      setStaff([...branchStaff, ...lowerMainlandStaff]);
    } else {
      setStaff(branchStaff);
    }
  }, [allStaff, inputData]);

  /* Grouped array (If they prefer the old style)
  useEffect(() => { // Staff selection options
    if (staff?.length > 0) {
      console.log("staff ", staff);
      let groupedArray = [];
      const sortedObject = {};
      const reduced = staff.map(x => {
        return ({
          installerLevel: x.installerLevel,
          label: x.name,
          value: x.userId
        })
      })
      if (reduced) {
        const objectGrouped = Object.groupBy(reduced, s =>
          `Installer Level ${s.installerLevel}`
        );
        const keys = Object.keys(objectGrouped);
        if (keys) {
          keys.sort();
          keys.forEach(key => {
            sortedObject[key] = objectGrouped[key];
          });
          for (const [key, value] of Object.entries(sortedObject)) {
            groupedArray.push({ label: key, options: [...value] });
          }
        }                
        setStaffOptions(groupedArray.reverse());
      }      
    }
  }, [staff]);
  */

  const handleCloseWorkOrder = useCallback(() => {
    //if (!saveDisabled) {
    //setShowExitConfirmation(true);
    //} else {
    //resetWorkOrderState();
    remove();
    onCloseCallback();
    //}
  }, [onCloseCallback, remove]);

  const handleScrollToView = (elName) => {
    if (elName) {
      setShowNotes(false);
      setShowCallLogs(false);
      setShowJobReview(false);
      setShowLogistics(false);
      setShowStatusTable(false);
      setShowAttachments(false);

      switch (elName) {
        case "notes":
          setShowNotes(true);
          break;
        case "call-logs":
          setShowCallLogs(true);
          break;
        case "job-review":
          setShowJobReview(true);
          break;
        case "logistics":
          setShowLogistics(true);
          break;
        case "status-table":
          setShowStatusTable(true);
          break;
        case "attachments":
          setShowAttachments(true);
          break;
        default:
          break;
      }

      let header = document.getElementById(`title-${elName}`);

      if (header) {
        setTimeout(
          () => header.scrollIntoView({ top: 0, behavior: "smooth" }),
          400
        );
      }
    }
  };

  //const showClosePopup = [...orderChangeItems, ...notesChangeItems, ...dateChangeItems]?.length > 0;
  const showClosePopup = false;

  const handleExpandCollapseCallback = useCallback((type) => {
    if (type) {
      switch (type) {
        case "callLogs":
          setShowCallLogs((x) => !x);
          break;
        case "notes":
          setShowNotes((x) => !x);
          break;
        case "jobReview":
          setShowJobReview((x) => !x);
          break;
        case "installationStatus":
          setShowInstallationStatus((x) => !x);
          break;
        case "statusTable":
          setShowStatusTable((x) => !x);
          break;
        case "logistics":
          setShowLogistics(x => !x);
          break;
        case "attachments":
          setShowAttachments((x) => !x);
          break;
        default:
          break;
      }
    }
  }, []);

  const handleInputChange = useCallback((key, val) => {
    setInputData((x) => {
      let _x = { ...x };
      _x[key] = val;
      return _x;
    });

    if (key !== "allDay") {
      addInstallationChangeItem({ key: key, value: val });
    } else if (key === "allDay") { // When changing All Day value, the API requires the start and end dates to be passed with it   
      addDateChangeItem({ key: "scheduledStartDate", value: YMDDateFormat(inputData.startScheduleDate) });
      addDateChangeItem({ key: "scheduledEndDate", value: YMDDateFormat(inputData.endScheduleDate) });      
    }
  }, [inputData]);

  const handleDateInputChange = (key, val) => {
    setInputData((x) => {
      let _x = { ...x };
      _x[key] = val;
      return _x;
    });
    addDateChangeItem({ key: key, value: val });
  };

  const handleCrewInputChange = useCallback((type, val) => {
    setCrew((x) => {
      let _x = { ...x };
      _x[type] = val;
      return _x;
    });

    let userAccountCodes = [];
    let userAccountCode = null;
    let _names = [];

    if (type === "seniorInstaller") {
      userAccountCode = staff?.find(x => x.name === val)?.account_1;
      if (userAccountCode) {
        _names = [userAccountCode]
      }
      setSeniorInstallerChangeItem({
        actionItemId: workOrderDataFromParent.actionItemId,
        crewType: type,
        names: [..._names]
      });
    }
    else if (type === "remeasurer") {
      userAccountCode = staff?.find(x => x.name === val)?.account_1;
      if (userAccountCode) {
        _names = [userAccountCode]
      }
      setRemeasurerChangeItem({
        actionItemId: workOrderDataFromParent.actionItemId,
        crewType: type,
        names: [..._names]
      });
    }
    else if (type === "installers") {
      val?.forEach((installer) => {
        let installerObject = allStaff?.find(x => x.name?.toLowerCase()?.trim() === installer.toLowerCase()?.trim());
        if (installerObject?.account_1) {
          userAccountCodes.push(installerObject.account_1);
        }
      })
    }

    if (userAccountCodes?.length > 0 && type === "installers") {
      setInstallersChangeItem({
        actionItemId: workOrderDataFromParent.actionItemId,
        crewType: type,
        names: [...userAccountCodes]
      });
    }
  }, [workOrderDataFromParent, staff, allStaff]);

  const handleDateRangeChange = useCallback((date, dateString) => {
    if (dateString?.length === 2) {
      setInputData((prev) => {
        let _prev = { ...prev };
        if (moment(dateString[0]).format("MM/DD/YYYY HH:mm:ss") !== "Invalid date") {
          _prev.startScheduleDate = moment(dateString[0]).format("MM/DD/YYYY HH:mm:ss");
          addDateChangeItem({ key: "scheduledStartDate", value: dateString[0] });
        }
        if (moment(dateString[1]).format("MM/DD/YYYY HH:mm:ss") !== "Invalid date") {
          _prev.endScheduleDate = moment(dateString[1]).format("MM/DD/YYYY HH:mm:ss");
          addDateChangeItem({ key: "scheduledEndDate", value: dateString[1] });
        }
        return _prev;
      });
    }
  }, []);

  const handleRadioChange = useCallback((e) => {
    if (e?.target) {
      let _val = e?.target?.value?.toUpperCase() || null;
      setInputData((prev) => {
        let _prev = { ...prev };
        _prev.jobDifficulty = _val;
        return _prev;
      });
      addInstallationChangeItem({ key: "jobDifficulty", value: _val });
    }
  }, []);

  useEffect(() => {
    if (result?.type === ResultType.success && (result?.source === "Installation Data" || result?.source === "Installation Remeasure Return Schedule")) {
      refetch();
    }
  }, [result, refetch]);

  useEffect(() => {
    if (subTradesRaw?.data) {
      setSubTrades(subTradesRaw?.data);
    }
  }, [subTradesRaw]);

  const showAllClick = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      setStaff([...allStaff]);
    }
  }, [setStaff, allStaff]);

  const addInstallationChangeItem = (changeItem) => {
    if (changeItem) {
      setInstallationChangeItems((ci) => {
        let _ci = [...ci];
        let index = _ci.findIndex((x) => x.key === changeItem.key);

        if (index > -1) {
          // Already existing - just update the value
          _ci[index].value = changeItem.value;
        } else {
          _ci.push(changeItem); // Add to update list
        }

        return _ci;
      });
    }
  };

  const handleSaveForm = useCallback(() => {
    // Form update is handled by multiple endpoints
    if (installationChangeItems?.length > 0) {
      let jsonFields = {};
      installationChangeItems.forEach((ci) => {
        jsonFields[ci.key] = ci.value;
      });
      let data = {
        actionItemId: workOrderDataFromParent.actionItemId,
        jsonFields: JSON.stringify(jsonFields)
      }
      updateInstallation(data); // Endpoint 1
    }

    if (dateChangeItems?.length > 0) {
      let _data = {
        actionItemId: workOrderDataFromParent.actionItemId,        
      }

      dateChangeItems?.forEach((dc) => {
        if (dc.key === "financingStartDate") {
          _data.financing = true;
          _data[dc.key] = new Date(dc.value).toISOString();
        } else if (dc.key === "woodDropOffDate") {
          _data.woodDropOff = true;
          _data[dc.key] = new Date(dc.value).toISOString();
        } else if (dc.key === "scheduledStartDate" || dc.key === "scheduledEndDate") {
          _data.isAllDayChecked = inputData?.allDay === "Yes";
          _data[dc.key] = new Date(dc.value).toISOString();
        } else { // Leaving this here to handle catch-all
          _data[dc.key] = new Date(dc.value).toISOString();
        }
      });
      updateInstallationInstallData(_data); // Endpoint 2
    }

    if (seniorInstallerChangeItem) {
      updateStaff(seniorInstallerChangeItem); // Endpoint 3
    }

    if (remeasurerChangeItem) {
      updateStaff(remeasurerChangeItem); // Endpoint 4
    }

    if (installersChangeItem) {
      updateStaff(installersChangeItem); // Endpoint 5
    }

    setInstallersChangeItem(null);
    setSeniorInstallerChangeItem(null);
    setRemeasurerChangeItem(null);
    setDateChangeItems([]);
    setInstallationChangeItems([]);
  }, [
    installationChangeItems,
    dateChangeItems,
    workOrderDataFromParent,
    seniorInstallerChangeItem,
    remeasurerChangeItem,
    installersChangeItem,
    inputData
  ]);

  const addDateChangeItem = (changeItem) => {
    if (changeItem) {
      setDateChangeItems((ci) => {
        let _ci = [...ci];
        let index = _ci.findIndex((x) => x.key === changeItem.key);

        if (index > -1) {
          // Already existing - just update the value
          _ci[index].value = changeItem.value;
        } else {
          _ci.push(changeItem); // Add to update list
        }

        return _ci;
      });
    }
  };

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0, // Adjust the delay between children
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
  };

  useEffect(() => {
    if (result) {      
      if (result.type === ResultType.success && result.source?.includes("Installation")) {
        refetch();
        refetchProdAndShipping();
      }
    }
  }, [result, refetch, refetchProdAndShipping]);

  return (
    <WORoot
      className={className}
      readOnlyData={workOrderDataFromParent}
      inputData={inputData}
      viewConfig={viewConfig}
      showClosePopup={showClosePopup}
      onClose={handleCloseWorkOrder}
      styles={styles}
    >
      {inputData && !workOrderDataFromParent?.error && (
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className={`flex flex-col`}
          style={{
            zIndex: 0,
            position: viewConfig?.stickyHeader ? "sticky" : "relative",
          }}
        >
          <motion.div variants={itemVariants}>
            <WOInfoBar
              statusKey={statusKey}
              setStatusKey={setStatusKey}
              viewConfig={viewConfig}
              data={workOrderDataRaw?.data}
              inputData={inputData}
              // handleStatusOk={handleStatusOk} - Implement when  apis are ready
              // updateStatus={updateStatus}
              ref={ref}
              titleColor={getWOColors().foreground}
              titleBackgroundColor={getWOColors().background}
              canEdit={getUserHasFeatureEditByName("Order Details")}
            />
            <CustomerInfoBar
              viewConfig={viewConfig}
              data={workOrderDataRaw?.data}
              sections={[
                { key: "attachments", label: "Attachments" },
                { key: "notes", label: "Notes" },
                { key: "call-logs", label: "Call Logs" },
                { key: "logistics", label: "Logistics" },
                { key: "status-table", label: "Status" },
                { key: "job-review", label: "Job Reviews" },
              ]}
              handleScrollToView={handleScrollToView}
              type={Installation}
              sectionsStyle={{ width: "33rem" }}
            />
          </motion.div>

          <div
            className={""}
            style={{ ...props.style, overflowY: viewConfig?.isInSearchPage ? null : "scroll" }}
            id={"main-body"}
          >
            <motion.div variants={itemVariants} className="border-1 border-dotted border-slate-200 mt-2 pl-2 pr-2 pb-2 rounded mb-3 mr-4">
              <div className={styles.grid}>
                <div>
                  <Schedule
                    {...{
                      inputData,
                      onChange: handleDateRangeChange,
                      handleInputChange
                    }}
                  />
                  <Overview
                    //WorkOrderSelectOptions={WorkOrderSelectOptions}
                    inputData={inputData}
                    //handleInputChange={handleInputChange}
                    //handleSelectChange={handleSelectChange}
                    //orderChangeItems={orderChangeItems}
                    //isSearchView={!viewConfig.stickyHeader}
                    crew={crew}
                    staffOptions={staff}
                    className="min-w-[18rem]"
                    radioChange={handleRadioChange}
                    prodShipDates={prodShipDateRaw?.data}
                    subTrades={subTrades}
                  />
                </div>

                <Parameters
                  //WorkOrderSelectOptions={WorkOrderSelectOptions}
                  inputData={inputData}
                  style={{ minHeight: "10rem" }}
                  handleInputChange={handleInputChange}
                  handleDateInputChange={handleDateInputChange}
                  className="min-w-[13rem]"
                />
                <StaffAllocation
                  crew={crew}
                  inputData={inputData}
                  staffOptions={staff}
                  handleCrewInputChange={handleCrewInputChange}
                  showAllClick={showAllClick}
                  handleInputChange={handleInputChange}
                />

                <Summary inputData={inputData} />
              </div>
              <div className="flex flex-row justify-end pt-3">
                <LockButton
                  tooltip={"Save"}
                  onClick={handleSaveForm}
                  disabled={((installationChangeItems?.length === 0) && dateChangeItems?.length === 0 && !seniorInstallerChangeItem && !remeasurerChangeItem && !installersChangeItem) || !getUserHasFeatureEditByName("Order Details")}
                  showLockIcon={!getUserHasFeatureEditByName("Order Details")}
                  label={"Save"}
                />
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="pl-2 pr-2 rounded mb-3 mr-4">
              <Logistics {
                ...{
                  crew,
                  inputData,
                  setInputData,
                  showLogistics,
                  setShowNotes,
                  className,
                  handleExpandCollapseCallback,
                  workOrderDataRaw
                }}
                notes={notesRaw?.data}
                workOrderDataFromParent={workOrderDataRaw?.data}
                canEdit={getUserHasFeatureEditByName("Logistics")}
              />
            </motion.div>
            <motion.div variants={itemVariants} className="border-1 border-dotted border-slate-200 mt-2 pl-2 pr-2 pb-3 rounded mb-3 mr-4 bg-[#FAFAFA]">
              <div className="grid grid-cols-12 gap-[1rem] mt-2">
                <Documents
                  {...{
                    inputData,
                    showAttachments,
                    handleExpandCollapseCallback,
                    viewConfig,
                    className,
                    workOrderNumber: workOrderDataFromParent?.workOrderNumber,
                  }}
                  canEdit={getUserHasFeatureEditByName("Documents") }
                />

                <Photos
                  {...{
                    inputData,
                    showAttachments,
                    handleExpandCollapseCallback,
                    viewConfig,
                    className,
                    workOrderNumber: workOrderDataFromParent?.workOrderNumber,
                  }}
                  canEdit={getUserHasFeatureEditByName("Photo Gallery")}
                />
              </div>

              <Notes
                {...{
                  inputData,
                  viewConfig,
                  showNotes,
                  setShowNotes,
                  className,
                  handleExpandCollapseCallback,
                  recordId: workOrderDataFromParent?.recordId, // For fetching notes
                  actionItemId: workOrderDataFromParent?.actionItemId, // For updating notes
                  canEdit: getUserHasFeatureEditByName("Notes")
                }}
              />

              <CallLogs {
                ...{
                  inputData,
                  viewConfig,
                  showCallLogs,
                  className,
                  handleExpandCollapseCallback,
                  recordId: workOrderDataFromParent?.recordId, // For fetching notes
                  actionItemId: workOrderDataFromParent?.actionItemId, // For updating notes
                  canEdit: getUserHasFeatureEditByName("Call Logs")
                }}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="border-1 border-dotted border-slate-200 mt-2 pl-2 pr-2 pb-3 rounded mb-3 mr-4 bg-[#FAFAFA] pt-2">
              {false &&
                <Logistics {
                  ...{
                    crew,
                    inputData,
                    setInputData,
                    viewConfig,
                    showLogistics,
                    setShowNotes,
                    className,
                    handleExpandCollapseCallback,
                    workOrderDataFromParent,
                  }}
                />
              }
              <StatusTable
                workOrderNumber={
                  workOrderDataFromParent?.workOrderNumber || null
                }
                workOrderBranch={
                  workOrderDataFromParent?.branch ||
                  inputData?.branch_display
                }
                customerName={workOrderDataFromParent?.customerName}
                actionItemId={workOrderDataFromParent?.actionItemId || null}
                stickyHeader={viewConfig?.stickyHeader}
                action={action}
                viewConfig={viewConfig}
                handleExpandCollapseCallback={handleExpandCollapseCallback}
                {...{
                  action,
                  viewConfig,
                  showStatusTable
                }}
              />

              <JobReview {...{
                key: workOrderDataFromParent?.workOrderNumber,
                inputData,
                viewConfig,
                showJobReview,
                className,
                handleExpandCollapseCallback,
                recordId: workOrderDataFromParent?.recordId,
                actionItemId: workOrderDataFromParent?.actionItemId,
                workOrderNumber: workOrderDataFromParent?.workOrderNumber
              }} />
            </motion.div>
          </div>
        </motion.div>
      )}
    </WORoot>
  );
}