"use client"
import React, { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from './propertyFilters.module.css';

import { useQuery } from "react-query";
import moment from "moment";

import { CalendarFilters, ManufacturingFacilityFilter, Production, Installation, InstallationStates } from 'app/utils/constants';
import { darkenColor, getAssignedLetterColor } from "app/utils/utils";

import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';

import { Checkbox, Badge, Avatar } from 'antd';

import WOFilter from "../../filters/woFilter/woFilter";

import { fetchSalesReps } from 'app/api/installationApis';

export default function PropertyFilters(props) {
  const { filters, setFilters, setApplyDisabled } = props;

  const { department, subDepartment, filteredWorkOrders, date } = useSelector(state => state.calendar);

  const [tabs, setTabs] = useState([]);
  const [currentTab, setCurrentTab] = useState("state");

  const { isFetching,
    data: salesRepsRaw,
    refetch: refetchSalesReps } = useQuery("installationSalesReps", () => {
      if (date) {
        const daysInMonth = moment(date).daysInMonth();
        const year = moment(date).format("YYYY");
        const month = moment(date).format("M");

        const bufferInMonths = 1;

        const startMonth = moment(date).subtract(bufferInMonths, "months").format("M");
        const endMonth = moment(date).add(bufferInMonths, "months").format("M");
        const endMonthDays = moment(date).add(bufferInMonths, "months").daysInMonth();
        const startYear = moment(date).subtract(bufferInMonths, "months").format("YYYY");
        const endYear = moment(date).add(bufferInMonths, "months").format("YYYY");

        if (daysInMonth && month && year) {
          return fetchSalesReps(`${startYear}-${startMonth}-${1}T00:00:00`, `${endYear}-${endMonth}-${endMonthDays}T23:59:59`);
        }
      }
    }, {
      enabled: department?.key === Installation,
      refetchOnWindowFocus: true
    });

  useEffect(() => {
    if (department && setFilters) {
      if (subDepartment)
      {
        setFilters(CalendarFilters?.find(x => x.key === subDepartment?.key)?.values);
      }
    }
  }, [department, setFilters, subDepartment]);

  // On every calendar change, select topmost tab
  useEffect(() => {
    if (department) {
      setTimeout(() => {
        const filterTabs = document.getElementById("filter-button-group")?.children;
        if (filterTabs?.length > 0) {
          filterTabs[0].click();
        }
      }, 100);
    }
  }, [department]);

  //const handleTabChange = (e) => {
  //  if (e?.target?.id) {
  //    let tabKey = e.target.id.replace('btnradiofilter-', '');
  //    if (tabKey) {
  //      setSelectedTab(tabKey);
  //    }
  //  }
  //}

  const handleCheckboxClick = useCallback((e) => {
    if (currentTab && e.target?.name) {
      setFilters(fs => {
        let _fs = JSON.parse(JSON.stringify(fs));
        _fs.forEach((f) => {
          if (f.key === currentTab) {
            f.fields?.forEach((ff) => {
              if (ff.key === e.target.name) {
                ff.value = !ff.value;
              }
            });
          }
        });
        return _fs;
      });
    }
  }, [currentTab, setFilters]);

  const handleSelectAllClick = useCallback((e) => {
    if (e.target && currentTab && filters) {
      let index = filters.findIndex(x => x.key === currentTab);
      setFilters(fs => {
        let _fs = JSON.parse(JSON.stringify(fs));
        _fs[index].fields.forEach((f) => {
          f.value = e.target.checked;
        })
        return _fs;
      });
    }
  }, [filters, currentTab, setFilters]);

  // Render tabs using CelanderFilters from constants, ensure that Manufacturing Facility does not generate a tab of its own
  useEffect(() => {
    let _tabs = [];
    if (filters && CalendarFilters && department?.key) {

      let _deptFilter = subDepartment || department;

      _tabs = CalendarFilters.find(x => x.key === _deptFilter.key)?.values.map((e) => {
        return { key: e.key, value: e.label }
      })

      if (department?.key === Production || department?.key === Installation) {
        _tabs.push({ key: "workOrderNumber", value: "Work Order #" });
      }

      setTabs(_tabs);
    }
  }, [department, subDepartment, filters]);

  useEffect(() => {
    if (filters) {
      let aPropertyHasAllCheckboxesUnchecked = false;

      filters.forEach((f) => {
        if (!aPropertyHasAllCheckboxesUnchecked && f.key !== "salesRep") { // Sales rep data sometimes fails to load and disables Apply button for all filters
          aPropertyHasAllCheckboxesUnchecked = f.fields?.every(x => !x.value);
        }
      });

      setApplyDisabled(aPropertyHasAllCheckboxesUnchecked);
    }
  }, [filters, setApplyDisabled]);

  const getTabMinContentWidth = (department) => {
    let result = "10rem"
    if (department) {
      if (department.key === Production) {
        result = "15.5rem";
      } else if (department.key === Installation) {
        result = "15.5rem";
      }
    }
    return result;
  }

  const InstallationStatusSymbol = useCallback((props) => {
    const { statusKey } = props;
    return <div className="w-[1rem] h-[1rem] rounded]" style={{ backgroundColor: InstallationStates[statusKey]?.color || "#000" }}></div>
  }, []);

  useEffect(() => {
    if (salesRepsRaw?.data && department?.key === Installation) {
      // Populate filter fields using salesRepsData
      setFilters(prev => {
        let _prev = [...prev];
        let salesRepIndex = _prev.findIndex(x => x.key === "salesRep");
        if (salesRepIndex > -1) {
          let salesRepFields = salesRepsRaw.data?.map(sr => ({
            key: sr?.replace(/\s/g, ''),
            label: sr,
            symbol: true,
            type: "checkbox",
            value: true
          }));

          // Key change here: Deep copy of _prev[salesRepIndex]
          let salesRepFilterCopy = {..._prev[salesRepIndex]};
          if (salesRepFilterCopy.fields?.length < 1) {
            salesRepFilterCopy.fields = [...salesRepFields];
            // Put the modified copy back into _prev array
            _prev[salesRepIndex] = salesRepFilterCopy;
          }
        }
        
        return _prev;
      });
    }
  }, [salesRepsRaw, department, setFilters]);
  

  const FieldColumn = useCallback((props) => {
    const { list, baseColor } = props;
    
    return (
      <div>
        {list?.map((f, index) => {
          let color = darkenColor(baseColor, index * 3 );          
          return (
            <div
              key={f.key}
              className={`${styles.checkboxLabelRoot} hover:cursor-pointer flex flex-row`}
            >
              <Checkbox
                name={f.key}
                onChange={handleCheckboxClick}
                checked={f.value}
                className="text-sm"
              >
                <div className="flex flex-row">
                  {f.symbol && department?.key === Installation && currentTab === "state" && <div className="pt-[4px] mr-2"><InstallationStatusSymbol statusKey={f.key} /></div>}
                  {f.symbol && department?.key === Installation && currentTab === "salesRep" &&
                    <Avatar
                    size="small"
                    style={{
                      //backgroundColor: color,
                      backgroundColor: getAssignedLetterColor(f?.label[0]),
                      color: '#FFF',
                      marginRight: "0.5rem"
                    }}
                  >
                      {f.label && f.label?.split(' ')?.map(word => word[0])?.join('')?.slice(0, 2)}
                    </Avatar>}

                  <div className="mt-[3px]">{f.label}</div>
                </div>
              </Checkbox>
            </div>
          )
        })}
      </div>
    )
  }, [currentTab, department, handleCheckboxClick]);

  const filterFields = filters?.find(fs => fs.key === currentTab)?.fields;

  useEffect(() => {
    if (department?.key === Installation && subDepartment) {
      refetchSalesReps();
    }
  }, [department, subDepartment, refetchSalesReps]);

  return (
    <div className={styles.root}>
      <div className="flex flex-row justify-end pt-3 pl-2 pb-2 text-xs min-h-[48px]" style={{ borderBottom: "1px dotted lightgrey" }}>
        {currentTab !== "workOrderNumber" &&
          <Checkbox
            onChange={(e) => handleSelectAllClick(e)}
            checked={filters?.find(x => x.key === currentTab)?.fields.every(y => y.value) || false}
            indeterminate={filters?.find(x => x.key === currentTab)?.fields.some(y => y.value) && filters?.find(x => x.key === currentTab)?.fields.some(y => !y.value)} // Some are true some are false
          >{<div className="pt-1 text-xs">Select All</div>}</Checkbox>
        }
      </div>
      <Tab.Container defaultActiveKey={"state"}>
        <div className="flex flex-row h-100">
          <div
            className="overflow-y-auto overflow-x-hidden"
            style={{
              width: "10rem",
              paddingTop: "1rem",
              borderRadius: "5px 0 0 5px"
            }}>
            <Nav variant="pills" className="flex-column">
              {tabs.map((tab, index) => {
                let count = tab.key === "workOrderNumber" ? filteredWorkOrders?.length : filters?.find(x => x.key === tab.key)?.fields.filter(y => !y.value)?.length;

                return (
                  <Nav.Item
                    key={`tab-${index}`}
                    onClick={() => setCurrentTab(tab.key)}
                    className={styles.navItem}
                  >
                    <Nav.Link
                      eventKey={tab.key}
                      className={styles.navLink}
                      style={{
                        marginTop: index !== 0 ? "5px" : 0,
                        fontSize: "0.8rem",
                        padding: 0,
                        height: "100%"
                      }}
                    >
                      <div className="pt-1 pb-1 pl-1">
                        {`${tab.value}`}
                        <Badge
                          size={"small"}
                          title={tab.key === "workOrderNumber" ? "Displayed work orders" : "Hidden field values"}
                          className="pl-1"
                          count={count}
                          style={{ backgroundColor: tab.key === "workOrderNumber" ? "#52c41a" : "#faad14" }}
                        />
                      </div>
                    </Nav.Link>
                  </Nav.Item>
                )
              })}
            </Nav>
          </div>
          <div className="overflow-y-auto" style={{ borderLeft: "1px dotted lightgrey", minWidth: `${getTabMinContentWidth(department)}` }}>
            <Tab.Content style={{ height: "100%" }}>
              <div className="p-2 rounded h-100 flex flex-row">
                {filterFields?.map((field, index) => {
                  let color = darkenColor("#cbd5e1", index * 2);
                  if (index % 10 === 0) {
                    return <FieldColumn key={index} list={filterFields?.slice(index, index + 10)} baseColor={color} />
                  }
                })}                                
                {currentTab === "workOrderNumber" &&
                  <WOFilter setShowFilter={() => { }} className="pl-1 h-100" />
                }
              </div>
            </Tab.Content>
          </div>
        </div>
      </Tab.Container>
    </div>
  );
}
