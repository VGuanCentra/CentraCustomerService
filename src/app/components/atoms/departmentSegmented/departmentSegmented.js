"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { Segmented, Popover, Button } from "antd";
import { CalendarTypes, Installation, Shipping, Production, Remeasure, Backorder } from "app/utils/constants";
import { getDefaultSubDepartment, YMDDateFormat } from "app/utils/utils";
import { updateShowMessage } from "app/redux/calendar";

import { useCookies } from 'react-cookie';
import CalendarDropdownIcon from "app/components/atoms/calendarDropdownIcon/calendarDropdownIcon";

export default function DepartmentSegmented(props) {
  const { defaultOption, iconColor, calendarKey } = props;

  const [cookies, setCookie] = useCookies(["options"]);
  const [isDefault, setIsDefault] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  
  const { department, subDepartment, page, date } = useSelector((state) => state.calendar);

  const CalendarCategory = CalendarTypes.find(x => x.key === calendarKey);

  const handleSubDepartmentChange = useCallback((val) => {
    if (val && department) {
      let _department = CalendarTypes.find(x => x.key === department?.key);
      let _subDepartment = null;

      if (_department) {
        _subDepartment = _department?.options?.find(x => x.value === val);
        
        if (_subDepartment) {
          dispatch(updateShowMessage({ value: true, message: "Switching Calendars...", duration: 2 }));
          setTimeout(() => {
            if (_subDepartment?.key !== _department?.key) {
              router.push(
                `/?department=${_department?.key}&subdepartment=${_subDepartment?.key}&page=${page}&date=${YMDDateFormat(date)}`,
                undefined,
                { shallow: true }
              );
            }

            if (_subDepartment?.key === _department?.key) {
              router.push(
                `/?department=${_department?.key}&page=${page}&date=${YMDDateFormat(date)}`,
                undefined,
                { shallow: true }
              );
            }
          }, 1000);          
        }
      }
    }
  }, [dispatch, router, department, page, date]);

  const handleApply = useCallback(() => {
    if (department && cookies?.options?.defaultCookie !== department?.key) {
      let _cookies = { ...cookies.options }
      _cookies.defaultCalendar = department.key;
      setCookie("options", _cookies)
    }
  }, [department, setCookie, cookies]);

  const popoverContent = (
    <div>
      {isDefault &&
        <span className="text-sm">
          <span>This is your default calendar.</span>
        </span>
      }
      {!isDefault &&
        <span className="text-sm">
          <span className="pr-2">Make this my default calendar.</span>
          <Button size="small" type="primary" onClick={handleApply}>Apply</Button>
        </span>
      }
    </div>
  );

  useEffect(() => {
    if (department && cookies) {
      setIsDefault(department?.key === cookies?.options?.defaultCalendar);
    }
  }, [department, cookies]);

  return (
    <div
      className={`flex flex-row pl-4 pr-2`}
      style={{ borderRadius: "4px", backgroundColor: "#FFF" }}
    >
      <div className="flex flex-row">

        <CalendarDropdownIcon className="pt-2"/>

        <span className="text-sm text-bold text-centraBlue">
          <Segmented
            options={[
              CalendarCategory.options[0]?.value,
              CalendarCategory.options[1]?.value,
            ]}
            onChange={handleSubDepartmentChange}
            style={{ padding: "5px 0 5px 5px", backgroundColor: "#FFF" }}
            value={subDepartment?.value || getDefaultSubDepartment()}
          />
        </span>
      </div>

      {defaultOption &&
        <Popover content={popoverContent}>
          <div className="pt-2 pr-4">
            {isDefault && false &&
              <i className={`fa-regular fa-calendar-check pr-2 text-gray-500 text-centraBlue`}></i>
            }
            {!isDefault && false &&
              <i className={`fa-regular fa-calendar pr-2 text-gray-500 text-centraBlue`}></i>
            }
            <span className="text-sm text-bold text-centraBlue">
              {department?.value}
            </span>
          </div>
        </Popover>
      }
    </div>
  );
}
