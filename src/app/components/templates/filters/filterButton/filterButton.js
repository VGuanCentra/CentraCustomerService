"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useCookies } from 'react-cookie';
import _ from "lodash";

import {
  ResultType,
  ManufacturingFacilities,
  ManufacturingFacility,
  Production,
  ManufacturingFacilityFilter,
  CalendarFilters,
  LangleyLabel,
  CalgaryLabel,
  AllLabel
} from "app/utils/constants";

import {
  updateResult,
  updateFilters,
  updateBranch,
  updateFilteredWorkOrders,
  updateAppliedFilteredWorkOrders
} from "app/redux/calendar";

import { Button, Popover, Badge, Divider, Space } from "antd";

import Filters from "app/components/templates/filters/filters";
import Title from "app/components/atoms/title/title";

export default function FilterButton(props) {
  const [showFilter, setShowFilter] = useState(false);

  const [isFilterHovered, setIsFilterHovered] = useState(false);
  const [isDefaultFilter, setIsDefaultFilter] = useState(false);

  const { appliedFilteredWorkOrders, filters, department } = useSelector(
    (state) => state.calendar
  );

  const [cookies, setCookie] = useCookies([`wc-${department?.key}-filters`]);

  const dispatch = useDispatch();

  const handleFilterClick = useCallback(
    (val) => { setShowFilter(val); }
    , []);

  const isAFilterApplied = useCallback(() => {
    let result = false;

    filters.forEach((filterCategory) => {
      if (!result && filterCategory.key !== ManufacturingFacility) {
        result = !!filterCategory.fields.find((x) => x.value === false);
      }
    });

    return result;
  }, [filters]);

  useEffect(() => {
    // Open filters upon load to apply user branch filter but close it as soon as branch filters are applied.
    setShowFilter(false);
  }, []);

  const updateCookie = useCallback((values) => {
    setCookie(`wc-${department.key}-filters`, JSON.stringify(values), { path: "/", expires: new Date(Date.now() + 2592000), maxAge: 2592000 });
  }, [setCookie, department]);

  const handleSetDefaultFilter = useCallback((value) => {
    updateCookie(value);
    setIsFilterHovered(false);
    dispatch(
      updateResult({
        type: ResultType.success,
        message: "Default filters saved.",
      }));
  }, [dispatch, updateCookie]);

  const handleResetToDefaultFilter = useCallback((value) => {
    const initialFilters = [...CalendarFilters?.find(_filters => _filters.key === department?.key)?.values, ManufacturingFacilityFilter];

    dispatch(updateFilters(initialFilters));
    dispatch(updateFilteredWorkOrders([]));
    dispatch(updateAppliedFilteredWorkOrders([]));
    dispatch(updateBranch(LangleyLabel));

    updateCookie(value);
    setIsFilterHovered(false);

    dispatch(
      updateResult({
        type: ResultType.success,
        message: "Default filters reset.",
      }));
  }, [dispatch, updateCookie, department]);

  const compressFilter = (filtersPayload) => {
    let result = [];
    if (filtersPayload?.length > 0) {
      filtersPayload.forEach((filterItem) => {
        let filteredItem = {};
        filteredItem[filterItem.key] = [];

        if (filterItem.fields?.length > 0) {
          filterItem.fields.forEach((filterItemField) => {
            if (!filterItemField.value) {
              filteredItem[filterItem.key].push(filterItemField.key);
            }
          })
        }

        if (filteredItem[filterItem.key]) {
          result.push(filteredItem);
        }
      });
    }
    return result;
  }

  const productionFiltersSummary = useCallback(() => {
    if (filters) {
      let _manufacturingFacility = "";
      let filteredOutCategories = [];
      const manufacturingFacilities = filters.find(x => x.key === ManufacturingFacility)?.fields;

      filteredOutCategories = compressFilter(filters);

      if (manufacturingFacilities?.length > 0) {
        const isLangleyShown = manufacturingFacilities.find(x => x.key === "langley")?.value;
        const isCalgaryShown = manufacturingFacilities.find(x => x.key === "calgary")?.value;

        if (isLangleyShown && isCalgaryShown) {
          _manufacturingFacility = AllLabel;
        } else if (isLangleyShown) {
          _manufacturingFacility = LangleyLabel;
        } else {
          _manufacturingFacility = CalgaryLabel;
        }
      }

      return (
        <div className="min-w-[17rem]">
          <div className="flex flex-row justify-between">
            <Title label="Filter Summary" className="w-[7rem]" />
          </div>
          <Divider type="Horizontal" className="mt-3" />
          <div className="mt-2">Manufacturing Facility: <span className="text-blue-500">{_manufacturingFacility}</span></div>

          <div className="">{filteredOutCategories.map((ck, index) => {
            const categoryKey = Object.getOwnPropertyNames(ck)[0];
            return (
              <div key={index}>
                {(categoryKey !== ManufacturingFacility) &&
                  <>
                    <div className="text-xs">
                      {`${filters.find(f => f.key === categoryKey)?.label}:`}
                      {ck[categoryKey].length === 0 && <span className="text-blue-500 pl-1">Show All</span>}
                      {ck[categoryKey].length > 0 && <span className="pl-1 text-blue-500 pr-1">[</span>}
                      {ck[categoryKey].map((ik, index) => {
                        return (<span className="text-xs text-orange-600" key={index}>{index > 0 ? <span className="pr-1">,</span> : <span></span>}{`${filters.find(f => f.key === categoryKey).fields.find(fi => fi.key === ik).label}`}</span>) // Find the item's label from filters
                      })}
                      {ck[categoryKey].length > 0 && <span className="text-blue-500 pl-1">]</span>}
                    </div>
                  </>
                }
              </div>
            )
          })}
            <div className="flex flex-row justify-end">
              <div className="text-orange-600 text-xs">*Filtered-out work orders</div>
            </div>
          </div>
          <Divider type="Horizontal" className="mt-2" />
          <div className="pt-3 flex flex-row justify-between">
            <Button
              size="small"
              onClick={() => handleResetToDefaultFilter([])}>
              <span>Reset</span>
            </Button>
            <Space>
              <Button
                size="small"
                onClick={() => setShowFilter(true)}
              >Modify
              </Button>
              <Button
                size="small"
                type="primary"
                disabled={isDefaultFilter}
                onClick={() => handleSetDefaultFilter(filteredOutCategories)}>
                Set as default
              </Button>
            </Space>
          </div>
        </div>
      )
    }
  }, [filters, handleSetDefaultFilter, isDefaultFilter, handleResetToDefaultFilter]);

  const handleHoverChange = (val) => {
    if (val) {
      setTimeout(() => setIsFilterHovered(val), 500); // Add slight delay when hovering
    } else {
      setIsFilterHovered(val);
    }
  };

  // Merge default filters from cookie with filters object
  const initialFilters = useRef(filters);
  useEffect(() => {
    let categoryKey = {};
    const webCalendarFilters = cookies[`wc-${department?.key}-filters`];
    let _filters = JSON.parse(JSON.stringify(initialFilters.current));

    if (webCalendarFilters?.length > 0) { // Outer loop is cookies filter
      webCalendarFilters.forEach((c) => {
        categoryKey = Object.getOwnPropertyNames(c)[0];
        let categoryKeyIndex = _filters.findIndex(f => f.key === categoryKey);

        let newFields = _filters[categoryKeyIndex].fields.map((nf) => {
          let _x = { ...nf };
          let filteredOutItemsFromCookie = webCalendarFilters.find(ifc => Object.getOwnPropertyNames(ifc)[0] === categoryKey)[categoryKey];
          if (filteredOutItemsFromCookie.find(foc => foc === nf.key)) {
            _x.value = false;
          }
          return _x;
        })

        _filters[categoryKeyIndex].fields = [...newFields];
      });

      dispatch(updateFilters(_filters));

      const manufacturingFacilityFilter = webCalendarFilters.find(x => Object.getOwnPropertyNames(x)[0] === ManufacturingFacility);

      if (manufacturingFacilityFilter) {

        const hasLangley = manufacturingFacilityFilter[ManufacturingFacility].find(x => x === "langley");
        const hasCalgary = manufacturingFacilityFilter[ManufacturingFacility].find(x => x === "calgary");

        if (hasLangley) {
          dispatch(updateBranch(CalgaryLabel));
        } else if (hasCalgary) {
          dispatch(updateBranch(LangleyLabel));
        } else {
          dispatch(updateBranch(AllLabel));
        }
      }
    }
  }, [dispatch, cookies, department]);

  // Enable / disabled set as default button
  useEffect(() => {
    const webCalendarFilters = cookies[`wc-${department?.key}-filters`];
    setIsDefaultFilter(_.isEqual(webCalendarFilters, compressFilter(filters)));
  }, [filters, cookies, department]);

  const getFilterSummaryContent = useCallback(() => {
    let result = (<div>Filters</div>)

    if (department) {
      if (department.key === Production) {
        result = productionFiltersSummary();
      }
    }

    return result;
  }, [department, productionFiltersSummary]);

  // If filters is open, close filter summary
  useEffect(() => {
    if (showFilter) {
      setIsFilterHovered(false);
    }
  }, [showFilter]);

  return (
    <>
      <Popover
        content={() => (
          <Filters
            setShowFilter={setShowFilter}
          />
        )}
        trigger="click"
        open={showFilter}
        onOpenChange={handleFilterClick}
        placement="bottom"
      >
        <Popover
          content={getFilterSummaryContent()}
          title=""
          trigger={"hover"}
          placement="bottom"
          onOpenChange={handleHoverChange}
          open={isFilterHovered}
        >
          <Badge
            title={isDefaultFilter ? "Default filters applied" : "Some filters have been applied."}
            dot={
              appliedFilteredWorkOrders?.length > 0 || isAFilterApplied()
            }
            color={isDefaultFilter ? "blue" : "red"}
            offset={[-3, 3]}
            className="ml-[8px] mt-[4px]"
          >
            <Button
              style={{ outline: "none" }}
              className="pt-0 pb-0 pr-[5px] pl-[5px] border-none"
              type="secondary"
            >
              <i
                className={`fa-solid fa-filter ${showFilter ? "text-blue-500" : "text-gray-500"
                  } hover:text-blue-500`}
              ></i>
            </Button>
          </Badge>
        </Popover>
      </Popover>
      <Filters style={{ display: "none" }} setShowFilter={setShowFilter} /> {/* Force filters to instantiate in order to filter based on user's branch */}
    </>
  );
}
