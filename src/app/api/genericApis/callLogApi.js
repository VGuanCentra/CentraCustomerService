import axios from "axios";
import store from "../../redux/store.js";
import { BASE_URL, ResultType } from "../../../app/utils/constants";
import { updateResult } from "app/redux/calendar.js";

function getConfig() {
  return {
    headers: { Authorization: `Bearer ${store?.getState()?.app?.userToken}` },
    "Content-Type": "application/json",
  };
}

export async function fetchCallLogs(module, moduleId) {
  const url = `${BASE_URL}/Common/GetCallLogs?module=${module}&parentId=${moduleId}`;

  return axios.get(url, getConfig());
}

export async function saveCallLog(module, data) {
  const url = `${BASE_URL}/Common/AddCallLog?module=${module}`;

  try {
    const response = await axios.post(url, data, getConfig());

    if (response.data) {
      store.dispatch(
        updateResult({
          type: ResultType.success,
          message: "Call log saved.",
        })
      );
    } else {
      store.dispatch(
        updateResult({
          type: ResultType.error,
          message: "Failed to save call log.",
        })
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error saving call log:", error);
    throw error;
  }
}

export async function deleteCallLog(module, id) {
  const url = `${BASE_URL}/Common/DeleteCallLogById?module=${module}&Id=${id}`;

  try {
    const response = await axios.delete(url, getConfig());
    if (response.data) {
      store.dispatch(
        updateResult({
          type: ResultType.success,
          message: "Call log deleted.",
        })
      );
    } else {
      store.dispatch(
        updateResult({
          type: ResultType.error,
          message: "Failed to delete call log.",
        })
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error deleting call log:", error);
    throw error;
  }
}
