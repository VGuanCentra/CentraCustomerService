"use client";
import styles from "./remakeBackorderHeader.module.css";
import React from "react";
import { useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";

import BranchSelection from "app/components/atoms/branchSelection/branchSelection";
import Title from "app/components/atoms/title/title";
import RootHeader from "app/components/organisms/rootHeader/rootHeader";

import { Button, Popconfirm } from "antd";

export default function RemakeBackorderHeader(props) {
  const { department } = useSelector((state) => state.calendar);

  const router = useRouter();
  const searchParams = useSearchParams();
  const actionParam = searchParams.get("action");

  return (
    <RootHeader>
      <div className="flex flex-row justify-between">
        <div
          className="bg-slate-200 p-2 rounded"
          style={{ color: "var(--centrablue)" }}
        >
          {actionParam === "remake" &&
            <Title
              label={"Create Remake"}
              labelClassName="text-sm pr-3 font-medium"
              Icon={() => { return <i className="fa-solid fa-rotate-right pr-2 pl-3" /> }}
            />
          }
          {actionParam === "backorder" &&
            <Title
              label={"Create Backorder"}
              labelClassName="text-sm pr-3 font-medium"
              Icon={() => { return <i className="fa-solid fa-angles-left pr-2 pl-3" /> }}
            />
          }
        </div>

        <BranchSelection />

        <div
          className={`${styles.calendarMonthWeekDayViewContainer} flex flex-row justify-end`}
        >
          <div className="pt-1">
            <Popconfirm
              placement="right"
              title={"Navigate to Calendar View"}
              description={
                <div className="pt-2">
                  <div>
                    Once you close this window all your pending changes will be
                    lost.
                  </div>
                  <div>Proceed anyway?</div>
                </div>
              }
              onConfirm={(e) => {
                router.push(`?department=${department?.key}`);
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary">
                <span>Close</span>
              </Button>
            </Popconfirm>
          </div>
        </div>
      </div>
    </RootHeader>
  );
}