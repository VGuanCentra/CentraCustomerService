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

export async function fetchNotes(module, moduleId) {
  const url = `${BASE_URL}/Common/GetGeneralNotes?module=${module}&parentId=${moduleId}`;

  return axios.get(url, getConfig());
}

export async function saveNote(module, data) {
  const url = `${BASE_URL}/Common/AddGeneralNote?module=${module}`;

  try {
    const response = await axios.post(url, data, getConfig());

    if (response.data) {
      store.dispatch(
        updateResult({
          type: ResultType.success,
          message: "Note saved.",
        })
      );
    } else {
      store.dispatch(
        updateResult({
          type: ResultType.error,
          message: "Failed to save note.",
        })
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error saving note:", error);
    throw error;
  }
}

export async function deleteNote(module, id) {
  const url = `${BASE_URL}/Common/DeleteGeneralNotesById?module=${module}&Id=${id}`;

  try {
    const response = await axios.delete(url, getConfig());
    if (response.data) {
      store.dispatch(
        updateResult({
          type: ResultType.success,
          message: "Note deleted.",
        })
      );
    } else {
      store.dispatch(
        updateResult({
          type: ResultType.error,
          message: "Failed to delete note.",
        })
      );
    }
    return response.data;
  } catch (error) {
    console.error("Error deleting note:", error);
    throw error;
  }
}
