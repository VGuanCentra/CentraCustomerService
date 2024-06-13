"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import { searchSlice } from "app/redux/calendarAux";
import QuickSearch from "app/components/templates/quickSearch/quickSearch";
import RootHeader from "app/components/organisms/rootHeader/rootHeader";

import { Button } from "antd";
import { YMDDateFormat } from "../../utils/utils";

export default function SearchResultsHeader(props) {
  const { setCurrentTab } = props;

  const { searchResults, searchEntry, searchedEvents, departmentToSearch } = useSelector((state) => state.search);
  const { isMobile } = useSelector((state) => state.app);
  const { department, date, page } = useSelector((state) => state.calendar);

  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <RootHeader>
      <div className="flex flex-row justify-between">
        {!isMobile &&
          <div className="flex flex-row" style={{ maxWidth: "35rem" }}>

            {searchResults?.data?.length > -1 && (
              <div
                className="bg-slate-200 pl-1 pr-1 pt-1 rounded"
                style={{ color: "var(--centrablue)" }}
              >
                <i className="fa-solid fa-magnifying-glass pr-2"></i>
                <span className="text-sm pr-3 font-medium">
                  {`Search for "${searchEntry}" in ${departmentToSearch?.value || department?.value} returned ${searchedEvents?.length} result(s)`}
                </span>
              </div>
            )}
          </div>
        }

        <QuickSearch setCurrentTab={setCurrentTab} />{" "}

        {!isMobile &&
          <div className={`flex flex-row justify-end`}>
            <Button
              type="primary"
              onClick={() => {
                router.push(`?department=${department?.key}&page=${page}&date=${YMDDateFormat(date)}`);
                dispatch(searchSlice.actions.updateSearchResults(null));
              }}
            >
              <span>Close</span>
            </Button>
          </div>
        }
      </div>
    </RootHeader>
  );
}
