import axios from "axios";
import store from "../../redux/store.js";
import { BASE_URL, ResultType } from "../../../app/utils/constants";
import { updateResult } from "app/redux/calendar.js";
import {
  updateDefaultUserSettings,
  updateFilters,
  updateLocation,
} from "app/redux/orders.js";

function getConfig() {
  return {
    headers: { Authorization: `Bearer ${store?.getState()?.app?.userToken}` },
    "Content-Type": "application/json",
  };
}

export async function fetchUserModuleSettings(username, module) {
  const url = `${BASE_URL}/Common/GetUserSettings?userName=${username}&module=${module}`;

  return axios.get(url, getConfig());
}

export async function updateUserModuleSettings(data) {
  const url = `${BASE_URL}/Common/UpdateUserSettings`;
  try {
    const response = await axios.post(url, data, getConfig());

    if (response.data) {
      store.dispatch(
        updateResult({
          type: ResultType.success,
          message: "User default settings updated.",
        })
      );

      store.dispatch(updateDefaultUserSettings(response.data));

      let _settings = JSON.parse(response.data.settings);

      if (_settings) {
        let _filters = _settings.filters ?? [];
        let _location = _settings.province ?? Provinces.all;

        store.dispatch(updateFilters(_filters));
        store.dispatch(updateLocation(_location));
      }
    } else {
      store.dispatch(
        updateResult({
          type: ResultType.error,
          message: "User default settings update failed.",
        })
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error updating user settings:", error);
    throw error;
  }
}
