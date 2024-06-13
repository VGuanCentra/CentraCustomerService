"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, useSearchParams } from 'next/navigation';

import { Empty, Popconfirm } from 'antd';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';
import { LoadingOutlined } from '@ant-design/icons';

import ProductionEvent from "app/components/organisms/events/productionEvent";
import InstallationEvent from "app/components/organisms/events/installationEvent";
import ProductionWorkOrder from "app/components/templates/productionWorkorder/productionWorkorder";
import InstallationWorkOrder from "app/components/templates/installationWorkorder/installationWorkorder";
import SearchResultsHeader from "../search/subComponents/searchResultsHeader";
import Tooltip from "app/components/atoms/tooltip/tooltip";

import useCalendarEvents from "app/hooks/useCalendarEvents";

import { updateWorkOrderData } from "app/redux/calendar";
import { YMDDateFormat } from "app/utils/utils";

import { updateMarkedWorkOrderId, updateDepartment } from "app/redux/calendar";

import { searchSlice } from "app/redux/calendarAux";

import { Button, Typography } from "antd";
const { Text } = Typography;

import { Production, Installation, ProductionStates, CalendarTypes, ResultType } from "app/utils/constants";

export default function Search(props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const returnDepartmentParam = searchParams.get("return-department");
  const departmentToSearchParam = searchParams.get("department-to-search");
  const searchEntryParam = searchParams.get("search-entry");

  const [currentTab, setCurrentTab] = useState(null);
  const [key, setKey] = useState(null);
  const [tabs, setTabs] = useState([]);
  const [multiDayEventsEndDates, setMultiDayEventsEndDates] = useState({});

  const HEADER_HEIGHT_OFFSET = 130;

  const {
    date,
    department,
    workOrderData, // Only used to force refresh content      
    result
  } = useSelector(state => state.calendar);

  const { isMobile } = useSelector(state => state.app);

  const {
    isLoading,
    searchResults,
    departmentToSearch,
    searchedEvents
  } = useSelector(state => state.search);

  const {
    buildProductionEvents,
    buildInstallationEvents
  } = useCalendarEvents({
    ...{
      date,
      workOrders: searchResults?.data,
      departmentParam: departmentToSearch?.key
    }
  });

  const _departmentToSearch = departmentToSearch || department;

  useEffect(() => {
    let workOrders = [];
    let _multidayEventEndDates = {};

    if (searchResults?.data) {
      searchResults.data.forEach((resultWO, index) => {
        let workorderThatHasADuplicate = workOrders.find(x => x.workOrderNumber === resultWO.workOrderNumber);

        if (_departmentToSearch?.key === Installation) {
          if (workorderThatHasADuplicate && !resultWO.returnedJob) { 
            // Skip if duplicate WO isn't a return job            
          } else {
            workOrders.push({ ...resultWO });
          }
        } else { // For all other departments, don't allow duplicates (May change in the future)
          if (!workorderThatHasADuplicate) {
            workOrders.push({ ...resultWO });
          }
        }

        // Future consideration - check status if wo duplicates have statuses of Draft and Complete Reservation, only show Draft if this pair is found
        _multidayEventEndDates[resultWO.workOrderNumber] = resultWO.endDateTime;
      });

      setMultiDayEventsEndDates(_multidayEventEndDates);

      let _events = [];
      if (_departmentToSearch?.key === Production) {
        _events = buildProductionEvents(workOrders, true);
        dispatch(searchSlice.actions.updateSearchedEvents(_events));
      } else if (_departmentToSearch?.key === Installation) {
        _events = buildInstallationEvents(workOrders);
        dispatch(searchSlice.actions.updateSearchedEvents(_events));
      }
    }
  }, [dispatch, searchResults, _departmentToSearch, buildProductionEvents, buildInstallationEvents]);

  useEffect(() => {
    if (searchResults) {
      dispatch(searchSlice.actions.updateIsLoading(false));
    }
  }, [dispatch, searchResults]);

  useEffect(() => {
    if (departmentToSearchParam) {
      const departmentToSearch = CalendarTypes.find(x => x.key === departmentToSearchParam);
      dispatch(searchSlice.actions.updateDepartmentToSearch(departmentToSearch));
    }
  }, [dispatch, departmentToSearchParam]);

  useEffect(() => {
    if (searchEntryParam) {
      dispatch(searchSlice.actions.updateSearchEntry(searchEntryParam));
    }
  }, [dispatch, searchEntryParam]);

  useEffect(() => {
    if (returnDepartmentParam) {
      const returnDepartment = CalendarTypes.find(x => x.key === returnDepartmentParam);
      dispatch(updateDepartment(returnDepartment));
    }
  }, [dispatch, returnDepartmentParam]);
  
  const handleViewInCalendarClick = useCallback((id) => {
    if (id && searchedEvents) {
      let event = searchedEvents.find(x => x.id === id);
      if (event) {
        dispatch(updateMarkedWorkOrderId(id));
        router.push(`?department=${department?.key}&page=month&date=${YMDDateFormat(event.start)}`);
      }
    }
  }, [dispatch, router, searchedEvents, department]);

  // Map search results to tabs
  useEffect(() => {
    let _tabs = [];
    if (searchedEvents.length > 0) {
      searchedEvents.forEach((e) => {
        //let exists = _tabs.find(x => x.key === e.id); - Allow duplicates
        //if (!exists) {
          _tabs.push({
            key: e.id,
            value: e.id,
            backgroundColor: e.backgroundColor,
            actionItemId: e.actionItemId
          });
        //}
      });
    }
    setTabs(_tabs);
  }, [searchedEvents]);

  useEffect(() => {
    setKey(workOrderData);
  }, [workOrderData])

  useEffect(() => {
    if (searchResults?.data?.length > 0 && tabs?.length > 0) {
      let _workOrderData = searchResults?.data[0];
      if (_workOrderData) {
        dispatch(updateWorkOrderData(_workOrderData));
        setCurrentTab(tabs[0].key)
      }
    }
  }, [dispatch, searchResults, tabs]);

  const handleTabClick = useCallback((id) => {    
    let _id = id;

    // Remove the temporary 'returnedJob' suffix if exists
    if (_id.includes("-returnedjob")) {
      _id = _id.replace("-returnedjob", "");
    }

    if (searchedEvents && searchResults) {
      let _workOrderData = searchResults?.data?.find(x => x.workOrderNumber === _id)
      if (_workOrderData) {
        dispatch(updateWorkOrderData(_workOrderData));
      }
    }
  }, [dispatch, searchedEvents, searchResults]);

  // Update tabs after a successful state change
  useEffect(() => {
    if (result?.type === ResultType.success && result?.source === "Status Update") { // Result contains recently updated WO
      let newColor = null;

      for (const [key, value] of Object.entries(ProductionStates)) { // Determine the new color
        if (value?.transitionKey === result?.payload?.state) {
          newColor = value?.color;
        }
      }

      setTabs(x => {
        let _x = [...x];
        const index = _x.findIndex(t => t.actionItemId === result?.payload?.actionItemId);
        _x[index].backgroundColor = newColor; // Update tab information with the new state's background color
        return _x;
      });
    }
  }, [result]);

  return (
    <div className={`pl-4 pr-4 w-100 pt-3`}>
      <SearchResultsHeader
        setCurrentTab={setCurrentTab}
      />
      <div className={`shadow-md bg-white`} style={{ height: `${window.innerHeight - HEADER_HEIGHT_OFFSET}px` }}>

        {!searchResults && false &&
          <div className="flex items-center justify-center w-100 h-100">
            <div className="flex flex-row text-gray-400">
              <div style={{ marginTop: "-3px" }}>
                <LoadingOutlined spin className="mr-2" />
              </div>
              <div className="text-sm">
                <Text type="secondary">Searching...</Text>
              </div>
            </div>
          </div>
        }

        {searchResults?.error &&
          <div className="flex items-center justify-center w-100 h-100">
            <div className="flex flex-row text-red-400">
              <div className="text-sm">
                <div className="text-center">
                  <i className="fa-solid fa-circle-exclamation"></i> <Text type="danger">Something went wrong, please try again.</Text>
                </div>
                <div className="text-center">
                  <Text type="danger">  If the issue persists, kindly report it to support@centra.ca.</Text>
                </div>
              </div>
            </div>
          </div>
        }

        {searchResults?.data?.length > 20 &&
          <div className="flex items-center justify-center w-100 h-100">
            <div className="flex flex-row text-orange-400">
              <div className="text-sm">
                <div className="text-center">
                  <i className="fa-solid fa-circle-exclamation"></i> <Text type="warning">The search query returned more than 20 work orders.</Text>
                </div>
                <div className="text-center">
                  <Text type="warning">Please refine your search criteria for more precise results.</Text>
                </div>
              </div>
            </div>
          </div>
        }

        {searchResults?.data?.length > 0 && searchResults?.data?.length < 21 && searchedEvents && tabs && !isMobile &&
          <Tab.Container defaultActiveKey={currentTab}>
            <div className="flex flex-row">
              <div
                className="overflow-y-auto overflow-x-hidden"
                style={{
                  width: "19rem",
                  height: `${window.innerHeight - HEADER_HEIGHT_OFFSET}px`,
                  backgroundColor: "#FAF9F6",
                  paddingTop: "1rem",
                  borderRadius: "5px 0 0 5px"
                }}>
                <Nav variant="pills" className="flex-column">
                  {tabs.map((tab, index) => {
                    let event = searchedEvents.find(x => x.id === tab.key);
                    return (
                      event &&
                      <Nav.Item
                        key={`tab-${index}`}
                        onClick={() => setCurrentTab(tab.key)}
                      >
                        <Nav.Link
                          eventKey={tab.key}
                          style={{
                            marginTop: index !== 0 ? "5px" : 0,
                            fontSize: "0.8rem",
                            padding: 0,
                            height: "100%"
                          }}
                        >
                          <div onClick={() => {
                            dispatch(updateWorkOrderData(null));
                            setTimeout(() => handleTabClick(event.id), 50);
                            setKey(new Date().getTime());
                          }}
                            style={{
                              backgroundColor: `${tab?.backgroundColor}`,
                              width: "100%"
                            }}
                          >
                            {event.id === currentTab && false &&
                              <i
                                className="fa-solid fa-angles-right inline mt-1"
                                style={{
                                  paddingLeft: "3px",
                                  float: "left",
                                  paddingTop: "11px",
                                  paddingRight: "0.2rem"
                                }}
                              />
                            }
                            {_departmentToSearch.key === Production &&
                              <ProductionEvent
                                style={{
                                  backgroundColor: tab?.backgroundColor,
                                  fontSize: "0.7rem",
                                  display: "inline"
                                }}
                                textStyle={{
                                  fontWeight: "500",
                                  fontSize: "0.7rem"
                                }}
                                event={event}
                                isWONFirst={true}
                              />
                            }
                            {_departmentToSearch.key === Installation &&
                              <InstallationEvent
                                style={{
                                  backgroundColor: tab?.backgroundColor,
                                  fontSize: "0.7rem",
                                  display: "inline"
                                }}
                                textStyle={{
                                  fontWeight: "500",
                                  fontSize: "0.7rem"
                                }}
                                event={event}
                                isWONFirst={true}
                              />
                            }
                            <div style={{ backgroundColor: tab?.backgroundColor }}>
                              <Tooltip title={"Show calendar location"}>
                                <Popconfirm
                                  placement="right"
                                  title={`Show calendar location for WO# ${event.id}`}
                                  description={<div className="pt-2">
                                    <div>You will be diverted to the calendar view, to go back to this page</div><div> click the
                                      <Button onClick={(e) => { e.stopPropagation(); }} className="ml-2 mr-1">
                                        <i className="fa-solid fa-magnifying-glass-arrow-right pr-2"></i>
                                        Previous Search Results
                                      </Button> buton on the sidebar menu.</div>
                                    <div>Do you wish to proceed?</div>
                                  </div>}
                                  onConfirm={(e) => {
                                    handleViewInCalendarClick(event.id)
                                  }}
                                  okText="Yes"
                                  cancelText="No"
                                >
                                  <span className="pl-1 font-sm text-xs hover:text-blue-700 hover:underline">
                                    <span>
                                      <i className="fa-solid fa-calendar-day pr-1 pb-1 text-blue-600" />
                                    </span>
                                    <span>{YMDDateFormat(event?.start)}</span>
                                    {YMDDateFormat(event?.start) !== YMDDateFormat(multiDayEventsEndDates[event.id]) && false && // Hiding end date for search tabs
                                      <span>
                                        <i className="fa-solid fa-arrow-right text-blue-500 pl-1 pr-1"></i>
                                        <span><i className="fa-solid fa-calendar-day pr-1 pb-1 text-blue-600" /></span>
                                        <span>{YMDDateFormat(multiDayEventsEndDates[event.id])}</span>
                                      </span>
                                    }
                                  </span>
                                </Popconfirm>
                              </Tooltip>
                            </div>
                          </div>
                        </Nav.Link>
                      </Nav.Item>
                    )
                  })}
                </Nav>
              </div>

              <div className="w-100" style={{ borderLeft: "1px dotted lightgrey" }}>
                <Tab.Content style={{ height: "100%" }}>
                  <div
                    className="mt-0 ml-2 mr-2 p-2 rounded"
                    style={{
                      overflow: "hidden",
                      overflowY: "scroll",
                      height: `${window.innerHeight - HEADER_HEIGHT_OFFSET}px`
                    }}>
                    {!currentTab && !isLoading &&
                      <div style={{ height: "100%" }} className="flex items-center justify-center">
                        <div className="text-sm">
                          <Text type="secondary">Select a work order on the left pane to view details.</Text>
                        </div>
                      </div>
                    }

                    {currentTab && !isLoading &&
                      <>
                        {_departmentToSearch.key === Production &&
                          <ProductionWorkOrder
                            key={key}
                            viewConfig={{
                              stickyHeader: false,
                              width: "100%",
                              height: "100%",
                              hideLoading: true
                            }}
                            type={Production}
                          />
                        }
                        {_departmentToSearch.key === Installation &&
                          <InstallationWorkOrder
                            key={key}
                            viewConfig={{
                              stickyHeader: false,
                              width: "100%",
                              height: "100%",
                              hideLoading: true,
                              isInSearchPage: true
                            }}
                            type={Installation}
                          />
                        }
                      </>
                    }
                  </div>
                </Tab.Content>
              </div>
            </div>
          </Tab.Container>
        }

        {searchResults?.data?.length > 0 && searchedEvents && tabs && isMobile &&
          <div className="p-2 overflow-y-auto">
            {tabs.map((tab, index) => {
              let event = searchedEvents.find(x => x.id === tab.key);
              return (
                event &&
                <div onClick={() => { }} // Open work order
                  style={{
                    backgroundColor: `${event?.backgroundColor}`,
                    width: "100%"
                  }}
                  className="mb-1 rounded hover:cursor-pointer"
                >
                  {event.id === currentTab && false &&
                    <i
                      className="fa-solid fa-angles-right inline mt-1"
                      style={{
                        paddingLeft: "3px",
                        float: "left",
                        paddingTop: "11px",
                        paddingRight: "0.2rem"
                      }}
                    />
                  }
                  {_departmentToSearch.key === Production &&
                    <ProductionEvent
                      style={{
                        backgroundColor: tab?.backgroundColor,
                        fontSize: "0.7rem",
                        display: "inline"
                      }}
                      textStyle={{
                        fontWeight: "500",
                        fontSize: "0.7rem"
                      }}
                      event={event}
                      isWONFirst={true}
                    />
                  }
                  {_departmentToSearch.key === Installation &&
                    <InstallationEvent
                      style={{
                        backgroundColor: tab?.backgroundColor,
                        fontSize: "0.7rem",
                        display: "inline"
                      }}
                      textStyle={{
                        fontWeight: "500",
                        fontSize: "0.7rem"
                      }}
                      event={event}
                      isWONFirst={true}
                    />
                  }
                </div>
              )
            })}
          </div>
        }

        {searchResults?.data?.length === 0 &&
          <div style={{
            alignItems: "center",
            display: "flex",
            height: "calc(100vh - 11rem)",
            justifyContent: "center",
            width: "100%"
          }}
          >
            <Empty />
          </div>
        }
      </div>
    </div>
  )
}