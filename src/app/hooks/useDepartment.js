"use client";
import { useCallback } from "react";
import { useSelector } from "react-redux";

import {
  Production,
  Installation,
  Remeasure,
  CalendarTypes,
  Shipping,
  Backorder,
  Service,
} from "app/utils/constants";

const useDepartment = () => {
  const { department, subDepartment } = useSelector((state) => state.calendar);

  const getWOColors = useCallback(() => {
    let result = {
      foreground: "#000",
      background: "#FFF",
    };

    const calendarType = CalendarTypes.find((x) => x.key === department?.key);
    const PrimaryCalendarIndex = 0;
    const SecondaryCalendarIndex = 1;

    if (CalendarTypes && department && calendarType) {
      if (department?.key === Production || department?.key === Service) {
        result = {
          foreground: calendarType.colors.foreground,
          background: calendarType.colors.background,
        };
      } else if (department?.key === Installation) {
        if (!subDepartment || subDepartment?.key === Installation) {
          result = {
            foreground:
              calendarType?.options[PrimaryCalendarIndex]?.colors?.foreground, // Primary calendar
            background:
              calendarType?.options[PrimaryCalendarIndex]?.colors?.background,
          };
        } else if (subDepartment?.key === Remeasure) {
          result = {
            foreground:
              calendarType?.options[SecondaryCalendarIndex]?.colors?.foreground, // Secondary calendar
            background:
              calendarType?.options[SecondaryCalendarIndex]?.colors?.background,
          };
        }
      } else if (department?.key === Shipping) {
        if (!subDepartment || subDepartment?.key === Shipping) {
          result = {
            foreground:
              calendarType?.options[PrimaryCalendarIndex]?.colors?.foreground, // Primary calendar
            background:
              calendarType?.options[PrimaryCalendarIndex]?.colors?.background,
          };
        } else if (subDepartment?.key === Backorder) {
          result = {
            foreground:
              calendarType?.options[SecondaryCalendarIndex]?.colors?.foreground, // Secondary calendar
            background:
              calendarType?.options[SecondaryCalendarIndex]?.colors?.background,
          };
        }
      }
    }

    return result;
  }, [department, subDepartment]);

  return {
    getWOColors,
  };
};

export default useDepartment;
