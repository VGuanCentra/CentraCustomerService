"use client";
import styles from "app/components/templates/productionWorkorder/productionWorkorder.module.css";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import { Table } from "antd";

import CollapsibleGroup from 'app/components/atoms/workorderComponents/collapsibleGroup';
import Collapse from '@mui/material/Collapse';

import {
  fetchProductionWindows,
  fetchProductionDoors  
} from "app/api/productionApis";

import {
  fetchInstallationItemsByWONumber,
  fetchInstallationDoors
} from "app/api/installationApis";

import { getTableColumns } from "app/utils/workOrderUtils";

export default function StatusTable({ workOrderNumber,
  viewConfig,
  showStatusTable,
  handleExpandCollapseCallback }) {

  const [fetchWindows, setFetchWindows] = useState(true);
  const [fetchInstallationWindows, setFetchInstallationWindows] = useState(true);
  const [fetchDoors, setFetchDoors] = useState(true);  
  const [windows, setWindows] = useState([]);
  const [vinylDoors, setVinylDoors] = useState([]);
  const [patioDoors, setPatioDoors] = useState([]);
  const [exteriorDoors, setExteriorDoors] = useState([]);

  const {
    isFetching: isFetchingWindows,
    data: productionItems,
    refetch: refetchWindows,
  } = useQuery(
    "productionWindows",
    () => {
      if (workOrderNumber) {
        setFetchWindows(false);
        return fetchProductionWindows(workOrderNumber);
      }
    },
    { enabled: fetchWindows }
  );

  const {
    isFetching: isFetchingDoors,
    data: doorItems,
    refetch: refetchDoors,
  } = useQuery(
    "productionDoors",
    () => {
      if (workOrderNumber) {
        setFetchDoors(false);
        return fetchProductionDoors(workOrderNumber);
      }
    },
    { enabled: fetchDoors }
  );

  const {
    isFetching: isFetchingInstallationWindows,
    data: installationItems,
    refetch: refetchInstallationWindows,
  } = useQuery(
    "installationWindowItems",
    () => {
      if (workOrderNumber) {
        setFetchInstallationWindows(false);
        return fetchInstallationItemsByWONumber(workOrderNumber);
      }
    },
    { enabled: fetchInstallationWindows }
    );

  const {
    isFetching: isFetchingInstallationDoors,
    data: installationDoorItems,
    refetch: refetchInstallationDoors,
  } = useQuery(
    "installationDoors",
    () => {
      if (workOrderNumber) {
        return fetchInstallationDoors(workOrderNumber);
      }
    },
    { enabled: true }
  );

  const { isReadOnly, result, isMobile } = useSelector((state) => {
    return { ...state.calendar, ...state.app };
  });

  useEffect(() => {
    if (productionItems?.data) {
      // In old web calendar, only CDLC is categorized as a door, 52PD, 61DR and  27DS all come from fetching windows
      setWindows((x) => {
        let _windows = productionItems.data.filter(
          (x) => x.system !== "52PD" && x.system !== "61DR"
        );

        _windows.forEach((x, index) => {
          x.key = index;
          // Find and attach installation status          
          x.installStatus = installationItems?.data?.find(y => y.item === x.item)?.status;
        });
        
        return _windows;
      });

      setPatioDoors((x) => {
        let _patioDoors = productionItems.data.filter((x) => x.system === "52PD");

        _patioDoors.forEach((x, index) => {
          x.key = index;
          x.installStatus = installationItems?.data?.find(y => y.item === x.item)?.status;
        });

        return _patioDoors;
      });

      setVinylDoors((x) => {
        let _vinylDoors = productionItems.data.filter((x) => x.system === "61DR");

        _vinylDoors.forEach((x, index) => {
          x.key = index;
          x.installStatus = installationItems?.data?.find(y => y.item === x.item)?.status;
        });

        return _vinylDoors;
      });
    }
  }, [productionItems, setWindows, setPatioDoors, setVinylDoors, installationItems]);

  useEffect(() => {
    if (doorItems?.data) {
      // In old web calendar, only CDLC is categorized as a door, 52PD, 61DR and  27DS all come from fetching windows

      setExteriorDoors((x) => {
        let _exteriorDoors = doorItems.data.filter((x) => x.system === "CDLD");

        _exteriorDoors.forEach((x, index) => {
          x.key = index;
          x.installStatus = installationDoorItems?.data?.find(y => y.item === x.item)?.status;
        });

        return _exteriorDoors;
      });
    }
  }, [doorItems, setExteriorDoors, installationDoorItems]);

  return (
    <CollapsibleGroup
      id={"title-status-table"}
      title={"Production and Installation Status"}
      subTitle={`W: ${windows.length} | PD: ${patioDoors.length} | VD: ${vinylDoors.length} | ED: ${exteriorDoors.length}`}
      expandCollapseCallback={() => handleExpandCollapseCallback("statusTable")}
      value={viewConfig?.expanded ? true : showStatusTable}
      style={{ marginTop: "1rem" }}
    >
      <Collapse in={viewConfig?.expanded ? true : showStatusTable}>
      <div className={`${styles.tableTitle} pt-4`}>Windows</div>
      {windows?.length > 0 ? (
        <>
          <Table
            columns={getTableColumns(
              isMobile ? "productionVertical" : "installation",
              windows,
              null,
              !isReadOnly
            )}
            dataSource={windows}
            pagination={false}
            bordered={false}
          />
        </>
      ) : (
        <div className="pl-6 pt-4 text-red-800">
          *This order does not contain any Windows.
        </div>
      )}

      <div className={`${styles.tableTitle} pt-4`}>Patio Doors</div>

      {patioDoors?.length > 0 ? (
        <>
          <Table
            columns={getTableColumns(
              isMobile ? "productionVertical" : "installation",
              patioDoors,
              null,
              !isReadOnly
            )}
            dataSource={patioDoors}
            pagination={false}
            bordered={false}
          />
        </>
      ) : (
        <div className="pl-6 pt-4 pb-4 text-red-800">
          *This order does not contain any Patio doors.
        </div>
      )}

      <div className={`${styles.tableTitle} pt-4`}>Vinyl Doors</div>

      {vinylDoors?.length > 0 ? (
        <Table
          columns={getTableColumns(
            isMobile ? "productionVertical" : "installation",
            vinylDoors,
            null,
            !isReadOnly
          )}
          dataSource={vinylDoors}
          pagination={false}
          bordered={false}
          className="pt-4"
        />
      ) : (
        <div className="pl-6 pt-4 pb-4 text-red-800">
          *This order does not contain any Vinyl doors.
        </div>
      )}

      <div className={`${styles.tableTitle} pt-4`}>Exterior Doors</div>

      {exteriorDoors?.length > 0 ? (
        <Table
          columns={getTableColumns(
            isMobile ? "productionVertical" : "installation",
            exteriorDoors,
            null,
            !isReadOnly
          )}
          dataSource={exteriorDoors}
          pagination={false}
          bordered={false}
          className="pt-4"
        />
      ) : (
        <div className="pl-6 pt-4 pb-4 text-red-800">
          *This order does not contain any Exterior doors.
        </div>
        )}
      </Collapse>
    </CollapsibleGroup>
  );
}
