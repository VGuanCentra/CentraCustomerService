"use client"
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from './options.module.css';
import { EventsShownOptions, CalendarFontSizeOptions } from "app/utils/constants";
import { useCookies } from 'react-cookie';
import { updateIsReadOnly } from "app/redux/app";
import { Select, Switch } from "antd";

export default function Options() {
  const [cookies, setCookie] = useCookies(["options"]);
  const [isClient, setIsClient] = useState(false); // Hydration Fix

  const { isReadOnly, hasWritePermission } = useSelector(state => state.app);

  const dispatch = useDispatch();

  const updateCookie = useCallback((name, val) => {
    if (cookies && name) {
      let _options = { ...cookies.options };
      _options[name] = val;
      setCookie("options", _options, { path: "/", expires: new Date(Date.now() + 2592000), maxAge: 2592000 });
    }
  }, [cookies, setCookie]);

  const handleReadOnlyChange = useCallback((val) => {    
    dispatch(updateIsReadOnly(val));    
  }, [dispatch]);

  useEffect(() => {
    setIsClient(true)
  }, []);

  return (
    <div className={`${styles.root} pt-3`}>
      {isClient &&
        <table className="w-100 border-spacing-8">
          <tbody>
            <tr style={{ borderTop: "1rem solid transparent", borderBottom: "1rem solid transparent" }}>
              <td>
                <i className="fa-solid fa-calendar-day pr-2 text-blue-400" />
                <span>Hide weekends</span>
              </td>
              <td className="text-right pr-4">
                <Switch
                  style={{ backgroundColor: cookies?.options?.hideWeekends ? "#16A34A" : "#A1A1AA" }}
                  onChange={(checked) => { updateCookie("hideWeekends", checked) }}
                  checked={cookies?.options?.hideWeekends || false}
                  size="small"
                />
              </td>
            </tr>
            <tr className="bg-stone-50" style={{ borderBottom: "1rem solid transparent" }}>
              <td>
                <i className="fa-solid fa-maximize pr-2 text-blue-400" />
                <span>Expand events</span>
              </td>
              <td className="text-right pr-4">
                <Switch
                  style={{ backgroundColor: cookies?.options?.expandEvents ? "#16A34A" : "#A1A1AA" }}
                  onChange={(checked) => { updateCookie("expandEvents", checked) }}
                  checked={cookies?.options?.expandEvents || false}
                  size="small"
                />
              </td>
            </tr>
            {false &&
              <tr style={{ borderBottom: "1rem solid transparent" }}>
                <td>
                  {isReadOnly && <i className="fa-solid fa-lock pr-2 text-blue-400" />}
                  {!isReadOnly && <i className="fa-solid fa-lock-open pr-2 text-blue-400"></i>}
                  <span>Read-Only mode</span>
                </td>
                <td className="text-right pr-4">
                  <Switch
                    style={{ backgroundColor: isReadOnly ? "#16A34A" : "#A1A1AA" }}
                    onChange={handleReadOnlyChange}
                    checked={isReadOnly}
                    disabled={!hasWritePermission}
                    size="small"
                  />
                </td>
              </tr>
            }
            <tr className="bg-stone-50" style={{ borderBottom: "1rem solid transparent" }}>
              <td>
                <i className="fa-solid fa-diagram-next pr-2 text-blue-400" />
                <span>Hide drag & drop confirmation</span>
              </td>
              <td className="text-right pr-4">
                <Switch
                  style={{ backgroundColor: cookies?.options?.hideDragAndDrop ? "#16A34A" : "#A1A1AA"}}
                  onChange={(checked) => { updateCookie("hideDragAndDrop", checked) }}
                  checked={cookies?.options?.hideDragAndDrop}
                  disabled={!hasWritePermission}
                  size="small"
                />
              </td>
            </tr>
            <tr style={{ borderBottom: "1rem solid transparent" }}>
              <td>
                <i className="fa-solid fa-list-ol pr-2 text-blue-400" />
                <span className="text-sm">Events shown</span>
              </td>
              <td className="text-right pr-4">
                <Select
                  options={EventsShownOptions}
                  style={{ width: "4rem" }}
                  value={cookies?.options?.dayMaxEvents || 100}
                  onChange={(val) => { updateCookie("dayMaxEvents", val) }}
                  size="small"
                />
              </td>
            </tr>
            <tr className="bg-stone-50" style={{ borderBottom: "1rem solid transparent" }}>
              <td>
                <i className="fa-solid fa-font pr-2 text-blue-400" />
                <span className="text-sm"><span>Calendar font size</span></span>
              </td>
              <td className="text-right pr-4">
                <Select
                  options={CalendarFontSizeOptions}
                  style={{ width: "4rem" }}
                  value={cookies?.options?.calendarFontSize || 0.8}
                  onChange={(val) => { updateCookie("calendarFontSize", val) }}
                  size="small"
                />
              </td>
            </tr>
          </tbody>
        </table>
      }
    </div>
  );
}
