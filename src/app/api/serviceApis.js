import axios from "axios";
import store from "../redux/store.js";

import { BASE_URL, ResultType } from "app/utils/constants";
import { updateResult } from "app/redux/calendar.js";

function getConfig() {
  return {
    headers: { Authorization: `Bearer ${store?.getState()?.app?.userToken}` },
    "Content-Type": "application/json",
  };
}

export async function fetchServiceWorkOrders(startDate, endDate) {
  const url = `${BASE_URL}/Service/GetServicesByRange?startDate=${startDate}&endDate=${endDate}`;
  return axios.get(url, getConfig());
}

// VGuan Debug:
export async function fetchAllServiceWorkOrders() {
  // const url = `${BASE_URL}/CustomerService/GetServices`;
  // return axios.get(url, getConfig());
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
}

export async function fetchServiceCountByStatus(status) {
  const url = `${BASE_URL}/Service/GetServiceCountByStatus${
    status && status.length > 0 ? `?status=${status}` : ""
  }`;
  return axios.get(url, getConfig());
}

export async function fetchServiceCountByAssignee(email) {
  const url = `${BASE_URL}/Service/GetServiceCountByAssignedToMe?email=${email}`;
  return axios.get(url, getConfig());
}

export async function fetchServiceWorkOrdersWithPagination(
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
  let url = `${BASE_URL}/Service/GetServicesPaginated?pageNumber=${pageNumber}&pageSize=${pageSize}&province=${province}&status=${status}&sortBy=${sortBy}&isDescending=${isDescending}`;

  if (assignedTo) {
    url += `&assignedTo=${assignedTo}`;
  }

  if (sosi) {
    url += `&sosi=${sosi}`;
  }

  if (searchText.length > 0) {
    url += `&searchText=${searchText}`;
  }

  return axios.get(url, getConfig());
}

export async function fetchServiceWorkOrderByWO(workOrderNum) {
  const url = `${BASE_URL}/Service/GetServicesByWO?originalWO=${workOrderNum}`;

  return axios.get(url, getConfig());
}

export async function fetchServiceWorkOrderById(
  serviceEventId,
  includeGenerics = false
) {
  const url = `${BASE_URL}/Service/GetServiceById?serviceId=${serviceEventId}&includeGenerics=${includeGenerics}`;

  return axios.get(url, getConfig());
}

export async function fetchServiceWorkOrderByServiceId(
  serviceId,
  includeGenerics = false
) {
  const url = `${BASE_URL}/Service/GetServiceByServiceId?serviceId=${serviceId}&includeGenerics=${includeGenerics}`;

  return axios.get(url, getConfig());
}
  //VGuan Debug 202406
export async function addServiceWorkOrder(data) {
  // const url = `${BASE_URL}/Service/AddService`;
  const url = `${BASE_URL}/CustomerService/AddService`;

  try {
    const response = await axios.post(url, data, getConfig());

    if (response.data) {
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

    return response.data;
  } catch (error) {
    console.error("Error creating service:", error);
    throw error;
  }
}

export async function updateServiceAssignedAdmin(data) {
  const url = `${BASE_URL}/Service/UpdateServiceAssignedAdmin`;

  try {
    const response = await axios.post(url, data, getConfig());

    if (response.data) {
      store.dispatch(
        updateResult({
          type: ResultType.success,
          message: "Work order updated.",
          source: "Service Work Order",
        })
      );
    } else {
      store.dispatch(
        updateResult({
          type: ResultType.error,
          message: "Work order update failed.",
          source: "Service Work Order",
        })
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error updating service:", error);
    throw error;
  }
}

export async function updateServiceWorkOrder(service) {
  const url = `${BASE_URL}/Service/UpdateService`;

  try {
    const response = await axios.post(url, service, getConfig());

    if (response.data) {
      store.dispatch(
        updateResult({
          type: ResultType.success,
          message: "Work order updated.",
          source: "Service Work Order",
        })
      );
    } else {
      store.dispatch(
        updateResult({
          type: ResultType.error,
          message: "Work order update failed.",
          source: "Service Work Order",
        })
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error updating service:", error);
    throw error;
  }
}

export async function updateServiceWorkOrderState(newStatus, moduleId) {
  const url = `${BASE_URL}/Common/Transit`;
  var data = {
    moduleName: "service",
    transitionCode: newStatus,
    id: moduleId,
  };

  try {
    const response = await axios.post(url, data, getConfig());

    if (response.data) {
      store.dispatch(
        updateResult({ type: ResultType.success, message: "Status updated." })
      );
    } else {
      store.dispatch(
        updateResult({
          type: ResultType.error,
          message: "Status update failed.",
        })
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
}

export async function scheduleService(newStatus, moduleId, data) {
  const url = `${BASE_URL}/Service/ScheduleService`;

  try {
    const response = await axios.post(url, data, getConfig());

    if (response.data) {
      store.dispatch(
        updateResult({ type: ResultType.success, message: "Status updated." })
      );
    } else {
      store.dispatch(
        updateResult({
          type: ResultType.error,
          message: "Status update failed.",
        })
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
}

export async function updateServiceWorkOrderSchedule(data) {
  const url = `${BASE_URL}/Common/UpdateEventSchedule`;

  try {
    const response = await axios.post(url, data, getConfig());

    if (response.data) {
      store.dispatch(
        updateResult({ type: ResultType.success, message: "Schedule updated." })
      );
    } else {
      store.dispatch(
        updateResult({
          type: ResultType.error,
          message: "Schedule update failed.",
        })
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
}

export async function fetchServiceReturnTrips(moduleId) {
  const url = `${BASE_URL}/Service/GetServiceReturnTrips?parentId=${moduleId}`;

  return axios.get(url, getConfig());
}

export async function saveReturnTrip(data) {
  const url = `${BASE_URL}/Service/SaveServiceReturnTrip`;

  try {
    const response = await axios.post(url, data, getConfig());

    if (response.data) {
      store.dispatch(
        updateResult({
          type: ResultType.success,
          message: "Return trip saved.",
        })
      );
    } else {
      store.dispatch(
        updateResult({
          type: ResultType.error,
          message: "Failed to save return trip.",
        })
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error saving return trip:", error);
    throw error;
  }
}

export async function deleteService(id) {
  const url = `${BASE_URL}/Service/DeleteService?id=${id}`;

  try {
    const response = await axios.delete(url, getConfig());
    if (response.data) {
      store.dispatch(
        updateResult({
          type: ResultType.success,
          message: "Service deleted.",
        })
      );
    } else {
      store.dispatch(
        updateResult({
          type: ResultType.error,
          message: "Failed to delete Service.",
        })
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error deleting Service:", error);
    throw error;
  }
}

export async function deleteReturnTrip(id) {
  const url = `${BASE_URL}/Service/DeleteServiceReturnTrip?&id=${id}`;

  try {
    const response = await axios.delete(url, getConfig());
    if (response.data) {
      store.dispatch(
        updateResult({
          type: ResultType.success,
          message: "Return Trip deleted.",
        })
      );
    } else {
      store.dispatch(
        updateResult({
          type: ResultType.error,
          message: "Failed to delete Return Trip.",
        })
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error deleting Return Trip:", error);
    throw error;
  }
}
