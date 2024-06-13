"use client"
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from 'next/navigation';

import { Button, Input, Space, Popover } from 'antd';

import { searchSlice } from "app/redux/calendarAux";
import { searchProductionQuick } from 'app/api/productionApis';
import { searchInstallationQuick } from 'app/api/installationApis';

import { Production, Installation, SearchCategories } from "app/utils/constants";

import DepartmentSelection from "app/components/atoms/departmentSelection/departmentSelection";

import Tooltip from "app/components/atoms/tooltip/tooltip";
import DetailedSearch from "app/components/templates/detailedSearch/detailedSearch";
import Title from "app/components/atoms/title/title";

export default function QuickSearch(props) {
  const { setCurrentTab } = props;
  const { department } = useSelector((state) => state.calendar);
  const { departmentToSearch, searchEntry } = useSelector((state) => state.search);

  const [searchDisabled, setSearchDisabled] = useState(true);
  const [showDetailedSearch, setShowDetailedSearch] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    setSearchDisabled(searchEntry?.length < 2)
  }, [searchEntry]);

  const handleSearchInputChange = useCallback((e) => {
    if (e) {
      dispatch(searchSlice.actions.updateSearchEntry(e.target.value));
    }    
  }, [dispatch]);

  const handleSearchClick = useCallback((e) => {
    if (e && searchEntry?.length > 1 && router) {
      dispatch(searchSlice.actions.updateIsLoading(true));
      dispatch(searchSlice.actions.updateSearchResults(null));

      let _departmentToSearch = departmentToSearch || department; // If departmentToSearch has not been explicitly selected, use deparment

      if (_departmentToSearch.key === Production) {
        searchProductionQuick(
          { workorderNumber: searchEntry },
          { customerName: searchEntry }
        );
      } else if (_departmentToSearch.key === Installation) {
        searchInstallationQuick(
          { workorderNumber: searchEntry },
          { customerName: searchEntry });
      }

      dispatch(searchSlice.actions.updateSearchEntry(searchEntry));
      dispatch(searchSlice.actions.updateDepartmentToSearch(_departmentToSearch));

      router.push(`/search?return-department=${department?.key}&department-to-search=${_departmentToSearch?.key}&search-entry=${searchEntry}`);

      if (setCurrentTab) {
        setCurrentTab(null); // Make sure not to display recently clicked search item
      }
    }
  }, [dispatch, router, searchEntry, departmentToSearch, department, setCurrentTab]);

  const handleSelectChange = useCallback((val) => {
    if (val) {      
      let _department = SearchCategories.find(x => x.key === val);
      if (_department) {
        dispatch(searchSlice.actions.updateDepartmentToSearch(_department));        
        dispatch(searchSlice.actions.updateSearchResults([])); // Clear previous search results when changing department to search
      }      
    }
  }, [dispatch]);

  useEffect(() => {
    const handleKeyUp = (e) => {
      if (e.key === 'Enter' || e.keyCode === 13) {
        let searchButton = document.getElementById("button-search");

        if (searchButton) {
          searchButton.click();
        }
      }
    }

    document.addEventListener('keyup', handleKeyUp, true);

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const content = (
    <div className="w-[20rem]">
      <div className="pb-2">
        <div className="flex flex-row justify-between">
          <Title
            label={"Detailed Search"}
            labelClassName="text-sm pr-3 font-medium"
            Icon={() => { return <i className="fa-solid fa-magnifying-glass pr-2" /> }}
          />
          <i className="fa-solid fa-xmark text-gray-500 hover:cursor-pointer" onClick={() => setShowDetailedSearch(false)}></i>
        </div>
      </div>
      <DetailedSearch />
    </div>
  );

  const handleOpenChange = (newOpen) => {
    setShowDetailedSearch(newOpen);
  };

  return (
    <div>
      <Space.Compact>
        <DepartmentSelection
          onChange={handleSelectChange}
          style={{ width: "7rem" }}
          value={departmentToSearch || department}
        />
        <Input
          placeholder="WO # or Customer Name"
          onChange={handleSearchInputChange}
          style={{ width: "12rem" }}
          value={(searchEntry.includes('[') && searchEntry.includes(']')) ? "" : searchEntry} // Don't show array string generated from detailed search in quicksearch input
        />

        <Tooltip title="Search by multiple fields">
          <Popover
            content={content}
            title=""
            trigger="click"
            placement="left"
            open={showDetailedSearch}
            onOpenChange={handleOpenChange}
          >
            <Button
              style={{ backgroundColor: "#FFF", width: "10px", color: "var(--centrablue)" }}
            >
              <i className="fa-solid fa-chevron-down hover:cursor:pointer  mt-[5px] ml-[-8px]"></i>
            </Button>
          </Popover>
        </Tooltip>

        <Tooltip title="Minimum search length is 2 characters">
          <Button
            id={"button-search"}
            type="primary"
            onClick={handleSearchClick}
            disabled={searchDisabled}
          >
            <span className="text-sm">Search</span>
          </Button>
        </Tooltip>
      </Space.Compact>
    </div>
  )
}
