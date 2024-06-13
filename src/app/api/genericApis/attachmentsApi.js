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

export async function fetchAttachments(module, moduleId) {
  const url = `${BASE_URL}/Common/GetFiles?module=${module}&parentId=${moduleId}`;

  return axios.get(url, getConfig());
}

export async function saveAttachment(module, moduleId, documents) {
  const url = `${BASE_URL}/Common/UploadFiles?module=${module}&parentId=${moduleId}`;

  try {
    const response = await axios.post(url, documents, getConfig());
    if (response.data) {
      store.dispatch(
        updateResult({
          type: ResultType.success,
          message: "Attachment(s) updated.",
        })
      );
    } else {
      store.dispatch(
        updateResult({
          type: ResultType.error,
          message: "Failed to save attachment(s).",
        })
      );
    }
    return response.data;
  } catch (error) {
    console.error("Error saving attachment(s):", error);
    throw error;
  }
}

export async function deleteAttachments(module, ids) {
  const url = `${BASE_URL}/Common/DeleteFilesByIds?module=${module}`;

  try {
    const response = await axios.post(url, ids, getConfig());
    if (response.data) {
      store.dispatch(
        updateResult({
          type: ResultType.success,
          message: "Attachment(s) deleted.",
        })
      );
    } else {
      store.dispatch(
        updateResult({
          type: ResultType.error,
          message: "Failed to delete attachment(s).",
        })
      );
    }
    return response.data;
  } catch (error) {
    console.error("Error deleting attachment(s):", error);
    throw error;
  }
}
