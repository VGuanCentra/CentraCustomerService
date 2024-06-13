"use client";
import styles from "./ordersHeader.module.css";
import React, { useState, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import { Provinces } from "app/utils/constants";
import {
  updateStatusView,
  updateLocation,
  updateShowMessage,
  updateOrdersSideBarOpen,
  updateShowDefaultSettingsPopUp,
  updateFilterHasChanges,
} from "app/redux/orders";

import Tooltip from "app/components/atoms/tooltip/tooltip";

import { SearchIcon } from "app/utils/icons";
import { Collapse } from "@mui/material";

import { Button, Segmented, Breadcrumb, Badge, Popover, Tour } from "antd";
import { getIcon } from "app/utils/utils";
import UserAvatar from "app/components/organisms/users/userAvatar";
import { useAuthData } from "context/authContext";
import OrdersQuickSearch from "app/components/templates/quickSearch/ordersQuickSearch";
import OrderFilter from "app/(work-order-management)/shared/orderFilter";
import { updateUserModuleSettings } from "app/api/genericApis/userSettingsApi";

export default function OrdersHeader(props) {
  const [show, setShow] = useState(true);
  const { selectedStatus, states, refetch } = props;
  const {
    department,
    appliedFilteredWorkOrders,
    filters,
    location,
    assignedToMe,
    ordersSideBarOpen,
    showDefaultSettingsPopUp,
    hasFilterChanges,
    defaultUserSettings,
  } = useSelector((state) => state.orders);

  const { isMobile } = useSelector((state) => state.app);

  const [showFilter, setShowFilter] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  // VGuan Debug :
  const { loggedInUser } = useAuthData();

  const branchRef = useRef(null);
  const dfRef = useRef(null);
  const defaultButtonRef = useRef(null);

  const tourSteps = [
    {
      title: "Hi! Welcome to Centra Service Management!",
      description:
        "Looks like it's your first time here. Before you begin, you can first customize how you want the site to load next time you visit this page.",
    },
    {
      title: "Select Branch",
      description: "Use this switcher to filter records by branch.",
      target: () => branchRef.current,
    },
    {
      title: "Set Other Data Filters",
      description: "You can also set other filters here.",
      target: () => dfRef.current,
    },
    {
      title: "Set as Default",
      description:
        "Click here to set your configuration as default so they will be set the next time you load the site. You can do this anytime you change filters.",
      target: () => defaultButtonRef.current,
    },
  ];

  const onDrawerToggle = useCallback(
    (val) => {
      dispatch(updateOrdersSideBarOpen(val));
    },
    [dispatch]
  );

  const onProvinceChange = useCallback(
    (val) => {
      if (val) {
        switch (val) {
          case Provinces.bc:
            dispatch(updateLocation(Provinces.bc));
            break;
          case Provinces.ab:
            dispatch(updateLocation(Provinces.ab));
            break;
          case Provinces.all:
            dispatch(updateLocation(Provinces.all));
            break;
          default:
            break;
        }
      }
    },
    [dispatch]
  );

  const getDepartmentIcon = (department) => {
    const _icon = getIcon(department);

    return _icon && <> {_icon}</>;
  };

  const onForceRefresh = useCallback(() => {
    if (refetch) {
      dispatch(
        updateShowMessage({ value: true, message: "Refreshing data..." })
      );
      refetch();
      setTimeout(() => dispatch(updateShowMessage({ value: false })), 1000);
    }
  }, [dispatch, refetch]);

  const onFilterIconClick = useCallback(
    (e) => {
      setShowFilter(!showFilter);
    },
    [showFilter]
  );

  const isAFilterApplied = useCallback(() => {
    let result = false;

    filters.forEach((filterCategory) => {
      if (!result && filterCategory.key !== "provinceFilter") {
        result = !!filterCategory.fields.find((x) => x.value === false);
      }
    });

    return result;
  }, [filters]);

  const onTourClose = () => {
    dispatch(updateShowDefaultSettingsPopUp(false));
  };

  const onSetAsDefaultSettingsClick = async () => {
    let _data = {};

    if (defaultUserSettings) {
      _data = _.cloneDeep(defaultUserSettings);
      _data.settings = JSON.stringify({
        filters: filters,
        province: location,
      });
      _data.moduleName = department;
      _data.sAMAccountName = loggedInUser?.email;
    } else {
      let _settings = {
        filters: filters,
        province: location,
      };
      _data = {
        settings: JSON.stringify(_settings),
        moduleName: department,
        sAMAccountName: loggedInUser?.email,
      };
    }

    var result = await updateUserModuleSettings(_data);

    if (result) {
      dispatch(updateFilterHasChanges(false));
    }
  };

  return (
    <span className="w-100 pb-3 flex flex-row justify-start">
      <div className={`flex flex-row ${isMobile ? "justify-center pt-2" : ""}`}>
        <span className="hidden md:inline-block">
          <Tooltip
            title={`${ordersSideBarOpen ? "Minimize" : "Expand"} Orders Menu`}
          >
            {ordersSideBarOpen ? (
              <Button
                className="mr-4 mt-1 w-[12px] rounded-full hover:bg-blue-500 hover:text-red-400 bg-white text-gray-600 z-10"
                style={{ marginLeft: "-30px" }}
                onClick={() => onDrawerToggle(false)}
              >
                <i className="fa-solid fa-chevron-left ml-[-4px]"></i>
              </Button>
            ) : (
              <Button
                className="mr-4 mt-1 w-[12px] rounded-full hover:bg-blue-500 hover:text-red-400 bg-white text-gray-600 z-10"
                style={{ marginLeft: "-30px" }}
                onClick={() => onDrawerToggle(true)}
              >
                <i className="fa-solid fa-chevron-right ml-[-4px]"></i>
              </Button>
            )}
          </Tooltip>
        </span>
      </div>
      <div className="w-100">
        <div className="flex flex-row justify-between">
          <Breadcrumb
            separator={`/`}
            className="flex items-center"
            items={[
              {
                title: (
                  <div className="flex space-x-2 items-center cursor-pointer pl-1">
                    <span className="text-sm font-medium hover:underline">
                      {`${department}s`}
                    </span>
                  </div>
                ),
                onClick: () => {
                  dispatch(updateStatusView(""));
                  router.push(`/${department.toLowerCase(0)}`);
                },
              },
              {
                title: (
                  <div className="flex space-x-2 items-center">
                    {assignedToMe ? (
                      <>
                        <UserAvatar username={loggedInUser?.name ?? "test"} />
                        <span className="text-sm pr-3 font-medium">
                          Assigned To Me
                        </span>
                      </>
                    ) : (
                      <>
                        {selectedStatus ? (
                          <>
                            <i
                              className={`${states[selectedStatus]?.icon} pl-2`}
                              style={{
                                color: `${states[selectedStatus]?.color}`,
                              }}
                            ></i>
                            <span className="text-sm pr-3 font-medium">
                              {states[selectedStatus]?.label}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm pr-3 font-medium">
                            All Records
                          </span>
                        )}
                      </>
                    )}
                  </div>
                ),
              },
            ]}
          ></Breadcrumb>

          <div className="flex">
            <div className="mr-4 mt-2">
              <Tooltip title="Refresh Data">
                <i
                  className="fa-solid fa-arrows-rotate text-gray-500 hover:text-blue-500 hover:cursor-pointer"
                  onClick={onForceRefresh}
                />
              </Tooltip>
            </div>
            <div
              className="flex flex-row bg-white pl-4 pr-2"
              style={{ borderRadius: "4px" }}
            >
              <div className="flex gap-2 items-center">
                <div className="">{getDepartmentIcon(department)}</div>
                <span className="text-sm text-bold text-centraBlue">
                  {department}
                </span>
              </div>
              <div
                style={{ borderRight: "1px solid lightgrey" }}
                className="ml-4 mr-2"
              ></div>
              <div className="flex gap-2 items-center" ref={branchRef}>
                <Segmented
                  options={[Provinces.bc, Provinces.ab, Provinces.all]}
                  onChange={onProvinceChange}
                  value={location}
                />
              </div>
            </div>
            <div ref={dfRef}>
              <Popover
                content={() => <OrderFilter setShowFilter={setShowFilter} />}
                trigger="click"
                open={showFilter}
                onOpenChange={onFilterIconClick}
                placement="bottomRight"
              >
                <Badge
                  title="Some filters have been applied."
                  dot={
                    appliedFilteredWorkOrders?.length > 0 || isAFilterApplied()
                  }
                  className="ml-[8px] mt-[4px]"
                >
                  <Tooltip title="Filters">
                    <Button
                      style={{ outline: "none" }}
                      className="pt-0 pb-0 pr-[5px] pl-[5px] border-none"
                      type="secondary"
                    >
                      <i
                        className={`fa-solid fa-filter ${
                          showFilter ? "text-blue-500" : "text-gray-500"
                        } hover:text-blue-500`}
                      ></i>
                    </Button>
                  </Tooltip>
                </Badge>
              </Popover>
            </div>
            <div className="flex ml-2 text-xs items-center">
              <Button
                size="middle"
                className="text-xs"
                disabled={!hasFilterChanges}
                onClick={onSetAsDefaultSettingsClick}
                ref={defaultButtonRef}
              >
                Set as default
              </Button>
            </div>
          </div>

          <div
            className={`${styles.calendarMonthWeekDayViewContainer} flex flex-row justify-end items-center`}
          >
            <Collapse in={show} orientation={"horizontal"}>
              <OrdersQuickSearch />
            </Collapse>

            <span
              onClick={() => {
                setShow(!show);
              }}
              className={`mr-4 ml-3 hover:cursor:pointer hover:text-blue-500 ${
                show ? "text-blue-700" : "text-gray-500"
              }`}
            >
              <SearchIcon />
            </span>
          </div>
        </div>
      </div>
      <Tour
        open={showDefaultSettingsPopUp}
        onClose={onTourClose}
        steps={tourSteps}
      />
    </span>
  );
}
