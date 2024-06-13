"use client";
import React, { useState, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Provinces } from "app/utils/constants";
import {
  updateLocation,
  updateShowMessage,
  updateOrdersSideBarOpen,
  updateShowDefaultSettingsPopUp,
  updateFilterHasChanges,
} from "app/redux/orders";

import Tooltip from "app/components/atoms/tooltip/tooltip";

import { Button, Segmented, Breadcrumb, Badge, Popover, Tour } from "antd";
import { useAuthData } from "context/authContext";
import OrderFilter from "app/(work-order-management)/shared/orderFilter";
import { updateUserModuleSettings } from "app/api/genericApis/userSettingsApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export default function OrdersHeaderMobile(props) {
  const { refetch } = props;
  const {
    department,
    appliedFilteredWorkOrders,
    filters,
    location,
    hasFilterChanges,
    defaultUserSettings,
  } = useSelector((state) => state.orders);

  const [showFilter, setShowFilter] = useState(false);

  const dispatch = useDispatch();

  // const { loggedInUser } = useAuthData();
  const loggedInUser = null;

  const branchRef = useRef(null);
  const dfRef = useRef(null);
  const defaultButtonRef = useRef(null);

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
    <span className="w-100 flex flex-row justify-center ">
      <div className="flex flex-col justify-between w-100 gap-2">
        <div className="flex flex-row w-100 justify-stretch items-center gap-2">
          <div
            className="flex flex-row bg-centraBlue w-100 justify-between"
            style={{ padding: "0.8rem" }}
          >
            <div className="flex gap-3 items-center">
              <FontAwesomeIcon
                icon={faBars}
                className="text-white cursor-pointer font-bold"
                onClick={() => onDrawerToggle(true)}
              />
              <span className="text-sm text-white font-semibold">
                {department}
              </span>
            </div>
            <div className="flex gap-2 items-center" ref={branchRef}>
              <Segmented
                options={[Provinces.bc, Provinces.ab, Provinces.all]}
                onChange={onProvinceChange}
                value={location}
              />
            </div>
            <div className="flex gap-3 items-center justify-between">
              <div ref={dfRef}>
                <Popover
                  content={() => <OrderFilter setShowFilter={setShowFilter} />}
                  trigger="click"
                  open={showFilter}
                  onOpenChange={onFilterIconClick}
                  placement="bottom"
                >
                  <Badge
                    title="Some filters have been applied."
                    dot={
                      appliedFilteredWorkOrders?.length > 0 ||
                      isAFilterApplied()
                    }
                  >
                    <Tooltip title="Filters">
                      <Button
                        style={{ outline: "none" }}
                        className="pt-0 pb-0 pr-[5px] pl-[5px] border-none"
                        type="secondary"
                      >
                        <i
                          className={`fa-solid fa-filter text-white hover:text-blue-500`}
                        ></i>
                      </Button>
                    </Tooltip>
                  </Badge>
                </Popover>
              </div>
              <div className="flex items-center">
                <i
                  className="fa-solid fa-save text-white hover:text-blue-500 hover:cursor-pointer"
                  disabled={!hasFilterChanges}
                  onClick={onSetAsDefaultSettingsClick}
                  ref={defaultButtonRef}
                />
              </div>
              <div className="flex items-center">
                <Tooltip title="Refresh Data">
                  <i
                    className="fa-solid fa-arrows-rotate text-white hover:text-blue-500 hover:cursor-pointer"
                    onClick={onForceRefresh}
                  />
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </span>
  );
}
