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

export async function fetchImages(module, moduleId) {
  const url = `${BASE_URL}/Common/GetImages?module=${module}&parentId=${moduleId}`;

  return axios.get(url, getConfig());
}

export async function saveImages(module, moduleId, images) {
  const url = `${BASE_URL}/Common/UploadImages?module=${module}&parentId=${moduleId}`;

  try {
    const response = await axios.post(url, images, getConfig());
    if (response.data) {
      store.dispatch(
        updateResult({
          type: ResultType.success,
          message: "Photo(s) updated.",
        })
      );
    } else {
      store.dispatch(
        updateResult({
          type: ResultType.error,
          message: "Failed to upload photo(s).",
        })
      );
    }
    return response.data;
  } catch (error) {
    console.error("Error uploading photo(s):", error);
    throw error;
  }
}

export async function deleteImages(module, ids) {
  const url = `${BASE_URL}/Common/DeleteImagesByIds?module=${module}`;

  try {
    const response = await axios.post(url, ids, getConfig());
    if (response.data) {
      store.dispatch(
        updateResult({
          type: ResultType.success,
          message: "Photo(s) deleted.",
        })
      );
    } else {
      store.dispatch(
        updateResult({
          type: ResultType.error,
          message: "Failed to delete photo(s).",
        })
      );
    }
    return response.data;
  } catch (error) {
    console.error("Error deleting photo(s):", error);
    throw error;
  }
}
