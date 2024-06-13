"use client";
import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown, Menu } from "antd";
import { useRouter } from "next/navigation";

import Tooltip from "app/components/atoms/tooltip/tooltip";

import {
  Production,
  Service,
  Installation,
  //Shipping,
  //Remeasure,
  //Backorder,
  CalendarTypes
} from "app/utils/constants";

import { updateShowMessage } from "app/redux/calendar";

import { useCookies } from "react-cookie";

export default function CalendarDropdownIcon(props) {
  const { className } = props;
  const router = useRouter();
  const dispatch = useDispatch();

  const [cookies, setCookie] = useCookies(["options"]);

  const { department, subDepartment, page } = useSelector(
    (state) => state.calendar
  );

  const handleSetAsDefaultCalendar = useCallback((departmentKey) => {
    if (departmentKey) {
      let _cookies = { ...cookies.options };
      _cookies.defaultCalendar = departmentKey;
      setCookie("options", _cookies);
    }
  }, [setCookie, cookies]);

  const handleDropdownItemClick = useCallback((e) => {
    if (e && department) { //TODO: Low priority (make dynamic)
      if (e.key === 'remeasure') {
        router.push(
          `/?department=installation&subdepartment=${e.key}&page=${page}`,
          undefined,
          { shallow: true }
        );
      } else {
        router.push(
          `/?department=${e.key}&page=${page}`,
          undefined,
          { shallow: true }
        );
      }
      dispatch(updateShowMessage({ value: true, message: "Switching Calendars...", duration: 2 }));
    }
  }, [dispatch, router, page, department]);

  const defaultCalendar = cookies?.options?.defaultCalendar;

  const getCurrentCalendar = useCallback(() => {
    let result = null;
    let _currentCalendar = CalendarTypes.find(c => c.key === department?.key);
    
    if (_currentCalendar.type === "single") {
      result = _currentCalendar;
    } else {
      let _currentSubCalendar = _currentCalendar.options.find(a => a.key === subDepartment?.key);      
      result = _currentSubCalendar;
    }

    return result;
  }, [department, subDepartment]);

  const menu = (
    <Menu onClick={handleDropdownItemClick} style={{ marginLeft: "-5rem !important" }} popupOffset={[100, 100]} selectedKeys={[]}>
      {CalendarTypes.filter(x => x.key === Production || x.key === Installation || x.key === Service).map(ct => {
        return (
          <>
            {ct.type === "single" &&
              <Menu.Item
                style={{ marginBottom: "2px", paddingTop: "2px", paddingBottom: "2px" }}
                key={ct.key}
                className="group"
                disabled={true} // TODO: Enable upon installation calendar's release
              >
                <Tooltip title="Set as default">
                  <i className={`fa-solid ${ct.fontAwesomeIconName} pr-2 w-[1.5rem]`} style={{ color: ct.colors.foreground }} onClick={(e) => { handleSetAsDefaultCalendar(ct.key); e.stopPropagation(); }} />
                </Tooltip>
                <span className="inline-block">{ct.value}
                  <span>
                    {ct.key === defaultCalendar &&
                      <span className="pl-1 inline-block text-blue-700 ml-2">(Default Calendar)</span>
                    }
                  </span>
                </span>
              </Menu.Item>
            }
            {ct.type === "multi" &&
              <>{ct.options.map((cto) => {
                return (
                  <Menu.Item
                    style={{ marginBottom: "2px", paddingTop: "2px", paddingBottom: "2px" }}
                    key={cto.key}
                    className="group"
                    disabled={true} // TODO: Enable upon installation calendar's release
                  >
                    <Tooltip title="Set as default">
                      <i
                        style={{ color: cto.colors.foreground }}
                        className={`fa-solid ${cto.fontAwesomeIconName} pr-2 w-[1.5rem]`}
                        onClick={(e) => { e.stopPropagation(); handleSetAsDefaultCalendar(cto.key); }}
                      />
                    </Tooltip>                                
                    <span className="inline-block">{cto.value}
                      <>
                        {cto.key === defaultCalendar &&
                          <span className="pl-1 inline-block text-blue-700 ml-2">(Default Calendar)</span>
                        }
                      </>                      
                    </span>
                  </Menu.Item>
                )
              })}
              </>
            }
          </>
        )
      })}
    </Menu>
  );

  return (
    <Dropdown
      trigger="hover"
      className={`text-sm text-bold text-centraBlue hover:cursor-pointer ${className}`}
      overlay={menu}
      placement="bottom"
    >
      <div>
        <Tooltip title="Switch Calendar">
          <i className={`fa-solid ${getCurrentCalendar()?.fontAwesomeIconName} hover:text-gray-500 pr-2`}
            style={{ color: getCurrentCalendar()?.colors?.foreground}}
          />          
        </Tooltip>
      </div>
    </Dropdown>
  );
}
