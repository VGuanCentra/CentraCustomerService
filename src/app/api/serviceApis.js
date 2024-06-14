import axiosInstance from "../../msallib/services/api/axiosInstance";
import store from "../redux/store.js";
import { ResultType } from "app/utils/constants";
import { updateResult } from "app/redux/calendar.js";

//#### Start get method ####

export async function fetchServiceWorkOrders(startDate, endDate) {
  // const url = `${BASE_URL}/Service/GetServicesByRange?startDate=${startDate}&endDate=${endDate}`;
  return await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_SERVICE_GET_ServicesByRange}?startDate=${startDate}&endDate=${endDate}`
  );
}

export async function fetchAllServiceWorkOrders() {
  // const url = `${BASE_URL}/CustomerService/GetServices`;
  try {
    return await axiosInstance.get(
      process.env.NEXT_PUBLIC_SERVICE_GET_AllServiceWorkOrders
    );
  } catch (error) {
    console.error("Error fetching service fetchServiceWorkOrders data:", error);
  }
}

export async function fetchServiceCountByStatus(status) {
  // const url = `${BASE_URL}/Service/GetServiceCountByStatus${
  //   status && status.length > 0 ? `?status=${status}` : ""
  // }`;
  const url = `${process.env.NEXT_PUBLIC_SERVICE_GETServiceCountByStatus}${
    status && status.length > 0 ? `?status=${status}` : ""
  }`;
  return await axiosInstance.get(url);
}

export async function fetchServiceCountByAssignee(email) {
  // const url = `${BASE_URL}/Service/GetServiceCountByAssignedToMe?email=${email}`;
  const url = `${process.env.NEXT_PUBLIC_SERVICE_GETServiceCountByAssignedToMe}?email=${email}`;
  return await axiosInstance.get(url);
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
  // let url = `${BASE_URL}/Service/GetServicesPaginated?pageNumber=${pageNumber}&pageSize=${pageSize}&province=${province}&status=${status}&sortBy=${sortBy}&isDescending=${isDescending}`;
  // let url = `${process.env.NEXT_PUBLIC_SERVICE_GETServicesPaginated}?pageNumber=${pageNumber}&pageSize=${pageSize}&province=${province}&status=${status}&sortBy=${sortBy}&isDescending=${isDescending}`;
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

  return await axiosInstance.get(url);
}

export async function fetchServiceWorkOrderByWO(workOrderNum) {
  // const url = `${BASE_URL}/Service/GetServicesByWO?originalWO=${workOrderNum}`;
  const url = `${process.env.NEXT_PUBLIC_SERVICE_GETServicesByWO}?originalWO=${workOrderNum}`;
  return await axiosInstance.get(url);
}

export async function fetchServiceWorkOrderById(
  serviceEventId,
  includeGenerics = false
) {
  // const url = `${BASE_URL}/Service/GetServiceById?serviceId=${serviceEventId}&includeGenerics=${includeGenerics}`;
  const url = `${process.env.NEXT_PUBLIC_SERVICE_GETServiceById}?serviceId=${serviceEventId}&includeGenerics=${includeGenerics}`;

  return await axiosInstance.get(url);
}

export async function fetchServiceWorkOrderByServiceId(
  serviceId,
  includeGenerics = false
) {
  // const url = `${BASE_URL}/Service/GetServiceByServiceId?serviceId=${serviceId}&includeGenerics=${includeGenerics}`;
  const url = `${process.env.NEXT_PUBLIC_SERVICE_GETServiceById}?serviceId=${serviceId}&includeGenerics=${includeGenerics}`;

  return await axiosInstance.get(url);
}

export async function fetchServiceReturnTrips(moduleId) {
  // const url = `${BASE_URL}/Service/GetServiceReturnTrips?parentId=${moduleId}`;
  const url = `${process.env.NEXT_PUBLIC_SERVICE_GETServiceReturnTrips}?parentId=${moduleId}`;
  return await axiosInstance.get(url);
}

//#### End get method ####

//#### Start POST method ####
export async function addServiceWorkOrder(data) {
  // const url = `${BASE_URL}/Service/AddService`;
  try {
    const response = await axiosInstance.post(
      process.env.NEXT_PUBLIC_SERVICE_POSTAddService,
      data
    );

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
  // const url = `${BASE_URL}/Service/UpdateServiceAssignedAdmin`;
  const url = process.env.NEXT_PUBLIC_SERVICE_POSTUpdateServiceAssignedAdmin;
  try {
    const response = await axiosInstance.post(url, data);

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
  // const url = `${BASE_URL}/Service/UpdateService`;
  const url = process.env.NEXT_PUBLIC_SERVICE_POSTUpdateService;
  try {
    const response = await axiosInstance.post(url, service);

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
  // const url = `${BASE_URL}/Common/Transit`;
  const url = process.env.NEXT_PUBLIC_SERVICE_POST_COMMON_Transit;
  var data = {
    moduleName: "service",
    transitionCode: newStatus,
    id: moduleId,
  };

  try {
    const response = await axiosInstance.post(url, data);

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
  // const url = `${BASE_URL}/Service/ScheduleService`;
  const url = process.env.NEXT_PUBLIC_SERVICE_POSTScheduleService;
  try {
    const response = await axiosInstance.post(url, data);

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
  // const url = `${BASE_URL}/Common/UpdateEventSchedule`;
  const url = process.env.NEXT_PUBLIC_SERVICE_POST_COMMON_UpdateEventSchedule;

  try {
    const response = await axiosInstance.post(url, data);

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

export async function saveReturnTrip(data) {
  // const url = `${BASE_URL}/Service/SaveServiceReturnTrip`;
  const url = process.env.NEXT_PUBLIC_SERVICE_POSTSaveServiceReturnTrip;
  try {
    const response = await axiosInstance.post(url, data);

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
  // const url = `${BASE_URL}/Service/DeleteService?id=${id}`;
  const url = `${process.env.NEXT_PUBLIC_SERVICE_DeleteService}?id=${id}`;
  try {
    const response = await axiosInstance.delete(url, data);
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
  // const url = `${BASE_URL}/Service/DeleteServiceReturnTrip?&id=${id}`;
  const url = `${process.env.NEXT_PUBLIC_SERVICE_DeleteServiceReturnTrip}?&id=${id}`;
  try {
    const response = await axiosInstance.delete(url, data);
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

//#### End post method ####
