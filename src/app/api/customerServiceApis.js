/*
    useFetchServiceData.js replace src/app/api/serviceApis.js file.
    VGuan 2024-06-06
*/

import axiosInstance from "../../msallib/services/api/axiosInstance";

//#### Start get method ####

export const getUserPermission = async () => {
  // try {
  //   const res = await createRequest().get(`GetPermissions`);
  //   return res?.data || [];
  // } catch (error) {
  //   return false;
  // }
  try {
    const resp = await axiosInstance.get(
      "/permissions/GetPermissions"
    );
    return resp?.data || [];
  } catch (error) {
    console.error("Error fetching service fetchServiceWorkOrders data:", error);
  }
};

export const fetchAllServiceWorkOrders_AAD = async () => {
  try {
    const resp = await axiosInstance.get(
      //process.env.SERVICE_GET_URL_GET_AllServiceWorkOrders
      "/CustomerService/GetServices"
    );
    // return resp.json();
    console.log("get all of Customer Service : " + resp.data);
    return resp.data;
  } catch (error) {
    console.error("Error fetching service fetchServiceWorkOrders data:", error);
  }
};

export async function fetchServiceCountByStatus_AAD(status) {
  const url = `/CustomerService/GetServiceCountByStatus${
    status && status.length > 0 ? `?status=${status}` : ""
  }`;
  return await axiosInstance.get(url);
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
    let url = `/CustomerService/GetServicesPaginated?pageNumber=${pageNumber}&pageSize=${pageSize}&province=${province}&status=${status}&sortBy=${sortBy}&isDescending=${isDescending}`;

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

    console.log("get all of Customer Service : " + resp.data);
    return resp.data;
  } catch (error) {
    console.error(
      "Error fetching service fetchServiceWorkOrdersWithPagination_AAD data:",
      error
    );
  }
}

// export const fetchServiceWorkOrders = async (startDate, endDate) => {
//   try {
//     const resp = await axiosInstance.get(
//       //   process.env.SERVICE_GET_URL_GET_ServicesByRange +
//       "/CustomerService/GetServicesByRange" +
//         `?startDate=${startDate}&endDate=${endDate}`
//     );
//     return resp.json();
//   } catch (error) {
//     console.error("Error fetching service fetchServiceWorkOrders data:", error);
//   }
// };
//#### End get method ####

//#### Start POST method ####
export async function addServiceWorkOrder_AAD(formData) {
  try {
    const resp = await axiosInstance.post(
      // process.env.SERVICE_POST_URL_POST_ServiceWorkOrder,
      "/CustomerService/AddService",
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
