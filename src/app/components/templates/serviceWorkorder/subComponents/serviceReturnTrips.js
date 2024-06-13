"use client";
import React, { useState } from "react";

import ReturnTrips from "app/components/organisms/returnTrips/returnTrips";
import { useQuery } from "react-query";
import {
  deleteReturnTrip,
  fetchServiceReturnTrips,
  saveReturnTrip,
} from "app/api/serviceApis";
import { Spin } from "antd";
import { antIcon } from "app/components/atoms/iconLoading/iconLoading";

export default function ServiceReturnTrips(props) {
  const { moduleId, inputData, disabled = false } = props;
  const [showAddForm, setShowAddForm] = useState(false);

  const onAddReturnTripClick = () => {
    setShowAddForm(true);
  };

  const fetchReturnTrips = async () => {
    if (inputData) {
      const result = await fetchServiceReturnTrips(inputData.id);
      return result.data;
    }
    return [];
  };

  const handleSaveReturnTrip = async (returnTrip) => {
    if (returnTrip) {
      const result = await saveReturnTrip(returnTrip);

      if (result) {
        setShowAddForm(false);
        refetchReturnTrips();
      }
    }
  };

  const handleDeleteReturnTrip = async (id) => {
    if (id) {
      const result = await deleteReturnTrip(id);

      if (result) {
        refetchReturnTrips();
      }
    }
  };

  const {
    isLoading: isLoadingReturnTrips,
    data: returnTrips,
    refetch: refetchReturnTrips,
    isFetching: isFetchingReturnTrips,
  } = useQuery([`serviceReturnTrips`, inputData], fetchReturnTrips, {
    refetchOnWindowFocus: false,
  });

  const isLoading = isLoadingReturnTrips || isFetchingReturnTrips;

  return (
    <div className="w-full h-full grid grid-cols-12 items-start flex-col md:flex-row ">
      <div className="flex justify-between items-center col-span-4">
        Return Trips
      </div>

      <div className="col-span-8">
        {isLoading ? (
          <div className="flex justify-center items-center w-full h-full py-4">
            <span>
              <Spin className="pr-2" indicator={antIcon} /> Loading...
            </span>
          </div>
        ) : (
          <div className=" mt-2">
            <ReturnTrips
              moduleId={moduleId}
              returnTrips={returnTrips}
              showAdd={showAddForm}
              cancelAddCallback={() => setShowAddForm(false)}
              saveAddCallback={handleSaveReturnTrip}
              deleteCallback={handleDeleteReturnTrip}
              disabled={disabled}
              onAddReturnTripClick={onAddReturnTripClick}
            />
          </div>
        )}
      </div>
    </div>
  );
}
