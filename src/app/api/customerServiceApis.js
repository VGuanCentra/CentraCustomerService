/*
    useFetchServiceData.js replace src/app/api/serviceApis.js file.
    VGuan 2024-06-06 Debug. Never used on the project now!
*/

import axiosInstance from "../../msallib/services/api/axiosInstance";

//#### Start get method ####

export const fetchAllServiceWorkOrders_AAD = async () => {
  try {
    const resp = await axiosInstance.get(
      process.env.NEXT_PUBLIC_SERVICE_GET_AllServiceWorkOrders
      // "/CustomerService/GetServices"
    );
    // return resp.json();
    console.log("get all of Customer Service : " + resp.data);
    return resp.data;
  } catch (error) {
    console.error(
      "Error fetching customerServiceApis fetchServiceWorkOrders data:",
      error
    );
  }
};

export async function fetchServiceWorkOrderByServiceId_AAD(
  serviceId,
  includeGenerics = false
) {
  try {
    // const url = `/CustomerService/GetServiceByServiceId?serviceId=${serviceId}&includeGenerics=${includeGenerics}`;
    return await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_SERVICE_GETServiceByServiceId}?serviceId=${serviceId}&includeGenerics=${includeGenerics}`
    );
    // return resp?.data || [];
  } catch (error) {
    console.error(
      "Error fetching customerServiceApis fetchServiceWorkOrders data:",
      error
    );
  }
}

export async function fetchServiceReturnTrips_AAD(moduleId) {
  try {
    const resp = await axiosInstance.get(
      // `/CustomerService/GetServiceReturnTrips?parentId=${moduleId}`
      `${process.env.NEXT_PUBLIC_SERVICE_GETServiceReturnTrips}?parentId=${moduleId}`
    );
    // return resp?.data || [];
    return resp;
  } catch (error) {
    console.error(
      "Error fetching customerServiceApis fetchServiceReturnTrips_AAD data:",
      error
    );
  }
}

export async function fetchServiceCountByStatus_AAD(status) {
  try {
    // const url = `/CustomerService/GetServiceCountByStatus${
    //   status && status.length > 0 ? `?status=${status}` : ""
    // }`;

    const resp = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_SERVICE_GETServiceCountByStatus}${
        status && status.length > 0 ? `?status=${status}` : ""
      }`
    );
    return resp?.data || [];
  } catch (error) {
    console.error(
      "Error fetching customerServiceApis fetchServiceReturnTrips_AAD data:",
      error
    );
  }
}

export async function fetchServiceWorkOrdersWithPagination_AAD(
  pageNumber,
  pageSize,
  status,
  sortBy,
  isDescending,
  assignedTo = null,
  province,
  sosi = null,
  searchText = ""
) {
  try {
    // let url = `/CustomerService/GetServicesPaginated?pageNumber=${pageNumber}&pageSize=${pageSize}&province=${province}&status=${status}&sortBy=${sortBy}&isDescending=${isDescending}`;
    let url = `${process.env.NEXT_PUBLIC_SERVICE_GETServicesPaginated}?pageNumber=${pageNumber}&pageSize=${pageSize}&province=${province}&status=${status}&sortBy=${sortBy}&isDescending=${isDescending}`;

    if (assignedTo) {
      url += `&assignedTo=${assignedTo}`;
    }

    if (sosi) {
      url += `&sosi=${sosi}`;
    }

    if (searchText.length > 0) {
      url += `&searchText=${searchText}`;
    }

    // return await axiosInstance.get(url);
    const resp = await axiosInstance.get(url);

    // console.log("get all of Customer Service : " + resp.data);
    return resp.data;
  } catch (error) {
    console.error(
      "Error fetching customerServiceApis fetchServiceWorkOrdersWithPagination_AAD data:",
      error
    );
  }
}

//#### End get method ####

//#### Start POST method ####
export async function addServiceWorkOrder_AAD(formData) {
  try {
    const resp = await axiosInstance.post(
      process.env.NEXT_PUBLIC_SERVICE_POSTAddService,
      // "/CustomerService/AddService",
      formData,
      {
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      }
    );
    console.log("VGuan Debug: submitNewHireFormAsync" + resp.data);
    if (resp.data) {
      store.dispatch(
        updateResult({
          type: ResultType.success,
          message: "Work order created.",
          source: "Service Work Order",
        })
      );
    } else {
      store.dispatch(
        updateResult({
          type: ResultType.error,
          message: "Work order creation failed.",
          source: "Service Work Order",
        })
      );
    }
    return resp.data;
  } catch (error) {
    console.error("Error creating Service WorkOrder:", error);
    // throw error;
  }
}

//#### End post method ####
