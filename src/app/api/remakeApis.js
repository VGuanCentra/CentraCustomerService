import axios from "axios";
import store from "../redux/store.js";
import { updateResult } from "../redux/calendar";
import { BASE_URL, ResultType } from "../utils/constants";

function getConfig() {
  return {
    headers: { Authorization: `Bearer ${store?.getState()?.app?.userToken}` },
    "Content-Type": "application/json",
  };
}

export async function fetchAllRemakeWorkOrders() {
  const url = `${BASE_URL}/Remake/GetRemakes`;
  return axios.get(url, getConfig());
}

export async function fetchRemakeCountByStatus(status) {
  const url = `${BASE_URL}/Remake/GetRemakeCountByStatus${
    status && status.length > 0 ? `?status=${status}` : ""
  }`;
  return axios.get(url, getConfig());
}

export async function fetchRemakeWorkOrders(
  pageNumber,
  pageSize,
  status,
  sortBy,
  searchText,
  isDescending
) {
  let url = `${BASE_URL}/Remake/GetRemakesPaginated?pageNumber=${pageNumber}&pageSize=${pageSize}&status=${status}&sortBy=${sortBy}&isDescending=${
    isDescending ? "true" : "false"
  }`;

  if (searchText.length > 0) {
    url += `&searchText=${searchText}`;
  }

  return axios.get(url, getConfig());
}

export async function updateRemakeWorkOrderState(newStatus, moduleId) {
  const url = `${BASE_URL}/Common/Transit`;
  var data = {
    moduleName: "remake",
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
        updateResult({ type: ResultType.error, message: "Status update failed." })
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
}

export async function fetchRemakeWorkOrderById(id) {
  const url = `${BASE_URL}/Remake/GetRemakeById?remakeId=${id}`;
  return axios.get(url, getConfig());
}

export async function fetchRemakeWorkOrderByRemakeId(id) {
  const url = `${BASE_URL}/Remake/GetRemakeByRemakeId?remakeId=${id}`;
  return axios.get(url, getConfig());
}

export async function updateRemakeWorkOrder(data) {
  const url = `${BASE_URL}/Remake/UpdateRemakes`;

  try {
    const response = await axios.post(url, data, getConfig());

    if (response.data) {
      store.dispatch(
        updateResult({
          type: ResultType.success,
          message: "Work order updated.",
          source: "Remake Work Order",
        })
      );
    } else {
      store.dispatch(
        updateResult({
          type: ResultType.error,
          message: "Work order update failed.",
          source: "Renake Work Order",
        })
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error updating remake:", error);
    throw error;
  }
}
