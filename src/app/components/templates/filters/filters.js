"use client"
import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useCookies } from 'react-cookie';

import { Button } from "antd";

//import { useRouter } from "next/navigation";

import { CalendarFilters, ManufacturingFacilityFilter, Production } from "app/utils/constants";

import Title from "app/components/atoms/title/title";
import PropertyFilters from "app/components/templates/filters/propertyFilters/propertyFilters";

import {
  updateFilters,
  updateIsFilterClean,
  updateFilteredWorkOrders,
  updateAppliedFilteredWorkOrders,
  updateShowMessage
} from "app/redux/calendar";

export default function Filters(props) {
  const { setShowFilter, style, paramFilterOut } = props;
  const dispatch = useDispatch();
  //const router = useRouter();

  const {
    department,
    isFilterClean,
    filteredWorkOrders,
    filters: initialFilters
  } = useSelector(state => state.calendar);

  //const filterParamOut = useCallback((filterOut) => {
  //  let filters = CalendarFilters.find(_filters => _filters.key === department?.key)?.values.map(fc => ({
  //    ...fc, // Spread to copy the existing properties
  //    fields: fc.fields.slice()
  //  })) || [];
  //  if (!filterOut) return filters;
  //  const updatedFilters = filters.map(filterCategory => {

  //    if (filterOut[filterCategory.key]) {
  //      const updatedFields = filterCategory.fields.map(field => {
  //        if (filterOut[filterCategory.key].includes(field.key)) {
  //          return { ...field, value: false };
  //        }
  //        return field;
  //      });
  //      return { ...filterCategory, fields: updatedFields };
  //    } else {
  //      return filterCategory;
  //    }
  //  });

  //  return updatedFilters;
  //}, [department]);

  //const filterOutUrlFilters = filterParamOut(paramFilterOut);
  const [filters, setFilters] = useState([]);
  const [applyDisabled, setApplyDisabled] = useState(false);
  const [cookies, setCookie] = useCookies([`wc-${department?.key}-filters`]);

  //const extractFalseFilters = useCallback((fs) => {
  //  // Object to hold the filters with false values
  //  const falseFilters = {};

  //  // Iterate through each filter category
  //  fs.forEach((filterCategory) => {
  //    // Iterate through each field in the category
  //    const falseFields = filterCategory.fields
  //      .filter((field) => field.value === false)
  //      .map((field) => field.key); // Collect keys of fields with false value

  //    // If there are any false fields, add them to the falseFilters object
  //    if (falseFields.length > 0) {
  //      falseFilters[filterCategory.key] = falseFields;
  //    }
  //  });

  //  const filterOutName = "filterOut";
  //  let returnUrl = window.location.href || "";
  //  if (Object.keys(falseFilters).length === 0){
  //    if (returnUrl.includes(filterOutName)){
  //      returnUrl = removeParameter(returnUrl, filterOutName)
  //    }
  //    return returnUrl;
  //  }
  //  const filterOutString = JSON.stringify(falseFilters);
  //  const addParameterString = `filterOut=${encodeURIComponent(filterOutString)}`;
  //  if (returnUrl.includes(filterOutName)){
  //    returnUrl = removeParameter(returnUrl, filterOutName)
  //  }

  //  if (returnUrl.includes("?")) {
  //    returnUrl += "&" + addParameterString;
  //  } else {
  //    returnUrl += "?" + addParameterString;
  //  }

  //  return returnUrl;
  //}, []);

  //function removeParameter(returnUrl, parameterToRemove) {
  //  const url = new URL(returnUrl);
  //  let newSearchParams = new URLSearchParams();
  //  url.searchParams.forEach((value, key) => {
  //    if (key !== parameterToRemove) {
  //      newSearchParams.set(key, value);
  //    }
  //  });

  //  url.search = newSearchParams.toString();
  //  return url.toString();
  //}


  //const handleApplyClick = useCallback(() => {
  //  dispatch(updateShowMessage({ value: true, message: "Applying filters...", duration: 1 }));
  //  setShowFilter(false);

  //  setTimeout(() => {
  //    dispatch(updateFilters(filters));
  //    dispatch(updateAppliedFilteredWorkOrders(filteredWorkOrders));
  //    router.push(extractFalseFilters(filters));
  //  }, 1000);

  //}, [dispatch, extractFalseFilters, router, setShowFilter, filters, filteredWorkOrders]);

  //const handleResetClick = useCallback((e) => {
  //  if (e.target) {
  //    dispatch(updateShowMessage({ value: true, message: "Resetting filters...", duration: 1 }));
  //    setShowFilter(false);
  //    const restedFilter = (fs => {
  //      let _filters = JSON.parse(JSON.stringify(fs));
  //      _filters.forEach((f) => {
  //        f.fields.forEach((fp) => {
  //          fp.value = true;
  //        });
  //      });

  //      dispatch(updateFilters(_filters));
  //      return _filters;
  //    })(filters);
  //    setTimeout(
  //      () => {
  //        setFilters(restedFilter);

  //        dispatch(updateFilteredWorkOrders([]));
  //        dispatch(updateAppliedFilteredWorkOrders([]));
  //        router.push(extractFalseFilters(restedFilter));
  //      }, 1000);
  //    }
  //}, [dispatch, setFilters,extractFalseFilters,router, setShowFilter, filters]);

  useEffect(() => {
    let result = true;

    if (filters) {
      filters.forEach((f) => {
        if (result) { // Never overwrite a false value if found
          result = f.fields.every(x => x.value); // If at least one field is false, disable reset button
        }
      });
    }

    dispatch(updateIsFilterClean(result));
  }, [dispatch, filters]);

  useEffect(() => { // Append manufacturing facility filters
    if (department) {
      const cookieFilters = cookies[`wc-${department.key}-filters`];

      if (cookieFilters?.length > 0) {
        setFilters([...initialFilters]);
      } else {
        setFilters([...CalendarFilters?.find(_filters => _filters.key === department?.key)?.values, ManufacturingFacilityFilter]);
      }
    }
  }, [dispatch, department, initialFilters, cookies]);

  //useEffect(() => {
  //  if (paramFilterOut) {
  //    setTimeout(() => {
  //      dispatch(updateFilters(filters));
  //      dispatch(updateAppliedFilteredWorkOrders(filteredWorkOrders));
  //    }, 1000);
  //  }
  //}, []); // TODO: Fix dependencies

  //Filter based on user branch during startup
  //useEffect(() => {
  //  if (userData?.branch) {
  //    setFilters(f => {
  //      const branchIndex = 1;
  //      let _f = JSON.parse(JSON.stringify(f));
  //      _f[branchIndex]?.fields?.forEach((fb) => {
  //        if (fb.label !== userData.branch) {
  //          fb.value = false;
  //        }
  //      });

  //      dispatch(updateFilters(_f));
  //      console.log("Applying default user branch filter...")
  //      return _f;
  //    });
  //  }
  //}, [dispatch, userData]);

  const handleApplyClick = useCallback(() => {
    dispatch(updateShowMessage({ value: true, message: "Applying filters...", duration: 1 }));
    setShowFilter(false);

    setTimeout(() => {
      dispatch(updateFilters(filters));
      dispatch(updateAppliedFilteredWorkOrders(filteredWorkOrders));
    }, 1000);

  }, [dispatch, filters, filteredWorkOrders, setShowFilter]);

  const handleResetClick = useCallback((e) => {
    if (e.target) {
      dispatch(updateShowMessage({ value: true, message: "Resetting filters...", duration: 1 }));
      setShowFilter(false);

      setTimeout(
        () => {
          setFilters(fs => {
            let _filters = JSON.parse(JSON.stringify(fs));
            _filters.forEach((f) => {
              f.fields.forEach((fp) => {
                fp.value = true;
              });
            });

            dispatch(updateFilters(_filters));
            return _filters;
          });

          dispatch(updateFilteredWorkOrders([]));
          dispatch(updateAppliedFilteredWorkOrders([]));
        }, 1000);
    }
  }, [dispatch, setFilters, setShowFilter]);

  return (
    <div style={{ ...style }}>
      <div className="flex flex-row justify-between">
        <Title
          label={"Filters"}
          labelClassName="text-sm pr-3 font-medium"
          Icon={() => { return <i className="fa-solid fa-filter pr-2" /> }}
        />
        <i className="fa-solid fa-xmark text-gray-500 hover:cursor-pointer" onClick={() => setShowFilter(false)}></i>
      </div>

      <div style={{ borderBottom: "1px dotted lightgrey" }} className="pb-3">
        <PropertyFilters
          filters={filters}
          setFilters={setFilters}
          setApplyDisabled={setApplyDisabled}
        />
      </div>

      <div className="w-100 flex flex-row justify-between mt-2 pl-1 pr-1">
        <Button
          onClick={handleResetClick}
          className="mt-2"
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

//"use client"
//import React, { useState, useCallback, useEffect } from "react";
//import { useSelector, useDispatch } from "react-redux";

//import { Button } from "antd";

//import { CalendarFilters, ManufacturingFacilityFilter } from 'app/utils/constants';
//import { useRouter } from "next/navigation";

//import Title from "app/components/atoms/title/title";
//import PropertyFilters from "app/components/templates/filters/propertyFilters/propertyFilters";

//import {
//  updateFilters,
//  updateIsFilterClean,
//  updateFilteredWorkOrders,
//  updateAppliedFilteredWorkOrders,
//  updateShowMessage
//} from "app/redux/calendar";

//export default function Filters(props) {
//  const { setShowFilter, style, paramFilterOut } = props;
//  const dispatch = useDispatch();
//  const router = useRouter();

//  const {
//    department,
//    isFilterClean,
//    filteredWorkOrders
//  } = useSelector(state => state.calendar);

//  const filterParamOut = useCallback((filterOut) => {
//    let filters = CalendarFilters.find(_filters => _filters.key === department?.key)?.values.map(fc => ({
//      ...fc, // Spread to copy the existing properties
//      fields: fc.fields.slice()
//    })) || [];
//    if (!filterOut) return filters;
//    const updatedFilters = filters.map(filterCategory => {

//      if (filterOut[filterCategory.key]) {
//        const updatedFields = filterCategory.fields.map(field => {
//          if (filterOut[filterCategory.key].includes(field.key)) {
//            return { ...field, value: false };
//          }
//          return field;
//        });
//        return { ...filterCategory, fields: updatedFields };
//      } else {
//        return filterCategory;
//      }
//    });

//    return updatedFilters;
//  }, [department]);

//  const filterOutUrlFilters = filterParamOut(paramFilterOut);
//  const [filters, setFilters] = useState(department ? [...filterOutUrlFilters, ManufacturingFacilityFilter] : []);
//  const [applyDisabled, setApplyDisabled] = useState(false);
//  const [hasMounted, setHasMounted] = useState(false);
//  const extractFalseFilters = useCallback((fs) => {
//    // Object to hold the filters with false values
//    const falseFilters = {};

//    // Iterate through each filter category
//    fs.forEach((filterCategory) => {
//      // Iterate through each field in the category
//      const falseFields = filterCategory.fields
//        .filter((field) => field.value === false)
//        .map((field) => field.key); // Collect keys of fields with false value

//      // If there are any false fields, add them to the falseFilters object
//      if (falseFields.length > 0) {
//        falseFilters[filterCategory.key] = falseFields;
//      }
//    });

//    const filterOutName = "filterOut";
//    let returnUrl = window.location.href || "";
//    if (Object.keys(falseFilters).length === 0){
//      if (returnUrl.includes(filterOutName)){
//        returnUrl = removeParameter(returnUrl, filterOutName)
//      }
//      return returnUrl;
//    }
//    const filterOutString = JSON.stringify(falseFilters);
//    const addParameterString = `filterOut=${encodeURIComponent(filterOutString)}`;
//    if (returnUrl.includes(filterOutName)){
//      returnUrl = removeParameter(returnUrl, filterOutName)
//    }

//    if (returnUrl.includes("?")) {
//      returnUrl += "&" + addParameterString;
//    } else {
//      returnUrl += "?" + addParameterString;
//    }

//    return returnUrl;
//  }, []);

//  function removeParameter(returnUrl, parameterToRemove) {
//    const url = new URL(returnUrl);
//    let newSearchParams = new URLSearchParams();
//    url.searchParams.forEach((value, key) => {
//      if (key !== parameterToRemove) {
//        newSearchParams.set(key, value);
//      }
//    });

//    url.search = newSearchParams.toString();
//    return url.toString();
//  }


//  const handleApplyClick = useCallback(() => {
//    dispatch(updateShowMessage({ value: true, message: "Applying filters...", duration: 1 }));
//    setShowFilter(false);

//    setTimeout(() => {
//      dispatch(updateFilters(filters));
//      dispatch(updateAppliedFilteredWorkOrders(filteredWorkOrders));
//      router.push(extractFalseFilters(filters));
//    }, 1000);

//  }, [dispatch, extractFalseFilters, router, setShowFilter, filters, filteredWorkOrders]);


//  const handleResetClick = useCallback((e) => {
//    if (e.target) {
//      dispatch(updateShowMessage({ value: true, message: "Resetting filters...", duration: 1 }));
//      setShowFilter(false);
//      const restedFilter = (fs => {
//        let _filters = JSON.parse(JSON.stringify(fs));
//        _filters.forEach((f) => {
//          f.fields.forEach((fp) => {
//            fp.value = true;
//          });
//        });

//        dispatch(updateFilters(_filters));
//        return _filters;
//      })(filters);
//      setTimeout(
//        () => {
//          setFilters(restedFilter);

//          dispatch(updateFilteredWorkOrders([]));
//          dispatch(updateAppliedFilteredWorkOrders([]));
//          router.push(extractFalseFilters(restedFilter));
//        }, 1000);
//      }
//  }, [dispatch, setFilters,extractFalseFilters,router, setShowFilter, filters]);

//  useEffect(() => {
//    setHasMounted(true);
//  }, []);

//  useEffect(() => {
//    let result = true;

//    if (filters) {
//      filters.forEach((f) => {
//        if (result) { // Never overwrite a false value if found
//          result = f.fields.every(x => x.value); // If at least one field is false, disable reset button
//        }
//      });
//    }

//    dispatch(updateIsFilterClean(result));
//  }, [dispatch, filters]);

//  useEffect(() => { // only do this when apply the url,firstMountCall
//    if (paramFilterOut && !hasMounted) {
//      setTimeout(() => {
//        dispatch(updateFilters(filters));
//        dispatch(updateAppliedFilteredWorkOrders(filteredWorkOrders));
//      }, 1000);
//    }
//  },[]); //Don't add any depenteices, this run only after the first render

//  useEffect(()=>{//reset the filter when change the department
//    if (department && hasMounted){
//      let restedFilter = CalendarFilters.find(_filters => _filters.key === department?.key)?.values.map(fc => ({
//        ...fc,
//        fields: fc.fields.slice()
//      })) || [];
//      let rrf = [...restedFilter, ManufacturingFacilityFilter]
//      if (rrf){
//        if (setShowFilter){
//          setShowFilter(false);
//        }
//        setTimeout(
//          () => {
//          setFilters(rrf);
//          dispatch(updateFilters(rrf));
//          dispatch(updateFilteredWorkOrders([]));
//          dispatch(updateAppliedFilteredWorkOrders([]));
//        },1000);

//      }
//    }

//  },[dispatch, setShowFilter, department])//Don't add hasMounted here

//  //Filter based on user branch during startup
//  //useEffect(() => {
//  //  if (userData?.branch) {
//  //    setFilters(f => {
//  //      const branchIndex = 1;
//  //      let _f = JSON.parse(JSON.stringify(f));
//  //      _f[branchIndex]?.fields?.forEach((fb) => {
//  //        if (fb.label !== userData.branch) {
//  //          fb.value = false;
//  //        }
//  //      });

//  //      dispatch(updateFilters(_f));
//  //      console.log("Applying default user branch filter...")
//  //      return _f;
//  //    });
//  //  }
//  //}, [dispatch, userData]);

//  return (
//    <div style={{ ...style }}>
//      <div className="flex flex-row justify-between">
//        <Title
//          label={"Filters"}
//          labelClassName="text-sm pr-3 font-medium"
//          Icon={() => { return <i className="fa-solid fa-filter pr-2" /> }}
//        />
//        <i className="fa-solid fa-xmark text-gray-500 hover:cursor-pointer" onClick={() => setShowFilter(false)}></i>
//      </div>

//      <div style={{ borderBottom: "1px dotted lightgrey" }} className="pb-3">
//        <PropertyFilters
//          filters={filters}
//          setFilters={setFilters}
//          setApplyDisabled={setApplyDisabled}
//        />
//      </div>

//      <div className="w-100 flex flex-row justify-between mt-2 pl-1 pr-1">
//        <Button
//          onClick={handleResetClick}
//          className="mt-2"
//        >
//          Reset
//        </Button>
//        <Button
//          type="primary"
//          onClick={handleApplyClick}
//          className="mt-2"
//          disabled={applyDisabled}
//        >
//          Apply
//        </Button>
//      </div>
//    </div>
//  );
//}
