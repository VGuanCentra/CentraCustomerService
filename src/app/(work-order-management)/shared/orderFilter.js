"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Button } from "antd";

import Title from "app/components/atoms/title/title";

import {
  updateFilters,
  updateIsFilterClean,
  updateShowMessage,
} from "app/redux/orders";

import _ from "lodash";

import { OrderFilters } from "app/utils/constants";
import OrderPropertyFilters from "./orderPropertyFilters";

export default function OrderFilter(props) {
  const { setShowFilter, style } = props;
  const dispatch = useDispatch();

  const { department, isFilterClean, filters } = useSelector(
    (state) => state.orders
  );

  const [selectedFilters, setSelectedFilters] = useState([]);

  const [applyDisabled, setApplyDisabled] = useState(false);

  useEffect(() => {
    if (filters) {
      let _defaultFilters = _.cloneDeep(filters);
      setSelectedFilters(_defaultFilters);
    } else {
      if (department) {
        fetchDepartmentFilters(department);
      }
    }
  }, [department, filters]);

  const fetchDepartmentFilters = (department) => {
    const departmentFilters = _.get(
      OrderFilters.find(
        (_filters) => _filters.key === department.toLowerCase()
      ),
      "values"
    );

    console.log(departmentFilters);
    setSelectedFilters(departmentFilters);
  };

  const handleApplyClick = useCallback(() => {
    dispatch(
      updateShowMessage({ value: true, message: "Applying filters..." })
    );
    setShowFilter(false);

    setTimeout(() => {
      dispatch(updateFilters(selectedFilters));
    }, 1000);
  }, [dispatch, selectedFilters, setShowFilter]);

  const handleResetClick = useCallback(
    (e) => {
      if (e.target) {
        dispatch(
          updateShowMessage({ value: true, message: "Resetting filters..." })
        );
        setShowFilter(false);

        setTimeout(() => {
          setSelectedFilters((fs) => {
            let _filters = JSON.parse(JSON.stringify(fs));
            _filters.forEach((f) => {
              f.fields.forEach((fp) => {
                fp.value = true;
              });
            });

            dispatch(updateFilters(_filters));
            return _filters;
          });
        }, 1000);
      }
    },
    [dispatch, setSelectedFilters, setShowFilter]
  );

  useEffect(() => {
    let result = true;

    if (selectedFilters) {
      selectedFilters.forEach((f) => {
        if (result) {
          // Never overwrite a false value if found
          result = f.fields.every((x) => x.value); // If at least one field is false, disable reset button
        }
      });
    }

    dispatch(updateIsFilterClean(result));
  }, [dispatch, selectedFilters]);

  return (
    <div style={{ width: "25rem", ...style }}>
      <div className="flex flex-row justify-between">
        <Title
          label={"Filters"}
          labelClassName="text-sm pr-3 font-medium"
          Icon={() => {
            return <i className="fa-solid fa-filter pr-2" />;
          }}
        />
        <i
          className="fa-solid fa-xmark text-gray-500 hover:cursor-pointer"
          onClick={() => setShowFilter(false)}
        ></i>
      </div>

      <div style={{ borderBottom: "1px dotted lightgrey" }} className="pb-3">
        <OrderPropertyFilters
          filters={selectedFilters}
          setFilters={setSelectedFilters}
          setApplyDisabled={setApplyDisabled}
        />
      </div>

      <div className="w-100 flex flex-row justify-between mt-2 pl-1 pr-1">
        <Button
          onClick={handleResetClick}
          className="mt-2"
          disabled={isFilterClean}
        >
          Reset
        </Button>
        <Button
          type="primary"
          onClick={handleApplyClick}
          className="mt-2"
          disabled={applyDisabled}
        >
          Apply
        </Button>
      </div>
    </div>
  );
}
