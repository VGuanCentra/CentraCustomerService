import axiosInstance from "../../msallib/services/api/axiosInstance";
import store from "../redux/store.js";
import { ResultType } from "app/utils/constants";
import { updateResult } from "app/redux/calendar.js";

//#### Start get method ####

export async function fetchServiceWorkOrders(startDate, endDate) {
  return await axiosInstance.get(
    //`${process.env.NEXT_PUBLIC_SERVICE_GET_ServicesByRange}?startDate=${startDate}&endDate=${endDate}`
    `/CustomerService/GetServicesByRange?startDate=${startDate}&endDate=${endDate}`
  );
}

export async function fetchAllServiceWorkOrders() {
  try {
    return await axiosInstance.get(
      // process.env.NEXT_PUBLIC_SERVICE_GET_AllServiceWorkOrders
      "/CustomerService/GetServices"
    );
  } catch (error) {
    console.error("Error fetching service fetchServiceWorkOrders data:", error);
  }
}

export async function fetchServiceCountByStatus(status) {
  const url = `/CustomerService/GetServiceCountByStatus${
    status && status.length > 0 ? `?status=${status}` : ""
  }`;
  return await axiosInstance.get(url);
}

export async function fetchServiceCountByAssignee(email) {
  // const url = `${process.env.NEXT_PUBLIC_SERVICE_GETServiceCountByAssignedToMe}?email=${email}`;
  const url = `/CustomerService/GetServiceCountByAssignedToMe?email=${email}`;
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
  // const url = `${process.env.NEXT_PUBLIC_SERVICE_GETServicesByWO}?originalWO=${workOrderNum}`;
  const url = `/CustomerService/GetServicesByWO?originalWO=${workOrderNum}`;
  return await axiosInstance.get(url);
}

export async function fetchServiceWorkOrderById(
  serviceEventId,
  includeGenerics = false
) {
  // const url = `${process.env.NEXT_PUBLIC_SERVICE_GETServiceById}?serviceId=${serviceEventId}&includeGenerics=${includeGenerics}`;
  const url = `/CustomerService/GetServiceById?serviceId=${serviceEventId}&includeGenerics=${includeGenerics}`;

  return await axiosInstance.get(url);
}

export async function fetchServiceWorkOrderByServiceId(
  serviceId,
  includeGenerics = false
) {
  // const url = `${process.env.NEXT_PUBLIC_SERVICE_GETServiceByServiceId}?serviceId=${serviceId}&includeGenerics=${includeGenerics}`;
  const url = `/CustomerService/GetServiceByServiceId?serviceId=${serviceId}&includeGenerics=${includeGenerics}`;

  return await axiosInstance.get(url);
}

export async function fetchServiceReturnTrips(moduleId) {
  // const url = `${process.env.NEXT_PUBLIC_SERVICE_GETServiceReturnTrips}?parentId=${moduleId}`;
  const url = `/CustomerService/GetServiceReturnTrips?parentId=${moduleId}`;
  return await axiosInstance.get(url);
}

//#### End get method ####

//#### Start POST method ####
export async function addServiceWorkOrder(data) {
  try {
    const response = await axiosInstance.post(
      // process.env.NEXT_PUBLIC_SERVICE_POSTAddService,
      "/CustomerService/AddService",
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
  // const url = process.env.NEXT_PUBLIC_SERVICE_POSTUpdateServiceAssignedAdmin;
  const url = "/CustomerService/UpdateServiceAssignedAdmin";
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
  // const url = process.env.NEXT_PUBLIC_SERVICE_POSTUpdateService;
  const url = "/CustomerService/UpdateService";
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
  // const url = process.env.NEXT_PUBLIC_SERVICE_POST_COMMON_Transit;
  const url = "/Common/Transit";
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
  // const url = process.env.NEXT_PUBLIC_SERVICE_POSTScheduleService;
  const url = "/CustomerService/ScheduleService";
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
  // const url = process.env.NEXT_PUBLIC_SERVICE_POST_COMMON_UpdateEventSchedule;
  const url = "/Common/UpdateEventSchedule";
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
  // const url = process.env.NEXT_PUBLIC_SERVICE_POSTSaveServiceReturnTrip;
  const url = "/CustomerService/SaveServiceReturnTrip";
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
  // const url = `${process.env.NEXT_PUBLIC_SERVICE_DeleteService}?id=${id}`;
  const url = `/CustomerService/DeleteService?id=${id}`;
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
  // const url = `${process.env.NEXT_PUBLIC_SERVICE_DeleteServiceReturnTrip}?&id=${id}`;
  const url = `/CustomerService/DeleteServiceReturnTrip?&id=${id}`;
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
