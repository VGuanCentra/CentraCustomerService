import axios from "axios";
import store from "../redux/store.js";

import {
  updateError,
  updateResult
} from "../redux/calendar";

import { BASE_URL, ResultType } from "app/utils/constants";

function getConfig() {
  return {
    headers: { Authorization: `Bearer ${store?.getState()?.app?.userToken}` },
    "Content-Type": "application/json",
  };
}

export async function fetchTimesheetsByEmail(email) {
  const url = `${BASE_URL}/TimeSheet/GetTimeSheetsByEmail?email=${email}`;
  store.dispatch(updateError(null));

  return axios.get(url, {
    headers: { 'Content-Type': 'application/json' }
  }).catch((err) => {
    console.log("error: ", err);
    store.dispatch(updateError(err?.message));
    throw new Error(err);
  });
}

export async function addTimesheet(data) {
  if (data) {    
    const url = `${BASE_URL}/TimeSheet/AddRecord`;
    axios.post(url, data, getConfig())
      .then((res) => {
        if (res?.status === 200) {
          store.dispatch(updateResult({ type: ResultType.success, message: "Timesheet successfully submitted.", source: "New Timesheet" }));
        } else {
          store.dispatch(updateResult({ type: ResultType.error, message: "Timesheet submission failed.", source: "New Timesheet" }));
        }
      })
      .catch(err => {
        store.dispatch(updateResult({ type: ResultType.error, message: err?.response?.data, source: "Add timesheet failed." }));
        console.log("error: ", err);
      })
  }
}

export async function editTimesheet(data) {
  if (data) {
    const url = `${BASE_URL}/TimeSheet/EditRecord`;
    axios.post(url, data, getConfig())
      .then((res) => {
        if (res?.status === 200) {
          store.dispatch(updateResult({ type: ResultType.success, message: "Timesheet successfully edited.", source: "Edit Timesheet" }));
        } else {
          store.dispatch(updateResult({ type: ResultType.error, message: "Timesheet edit failed.", source: "Edit Timesheet" }));
        }
      })
      .catch(err => {
        //store.dispatch(updateResult({ type: "error", message: err?.response?.data, source: "Create remake(s) failed. Please try again." }));
        console.log("error: ", err);
        throw new Error(err);
      })
  }
}

export async function fetchActivePayPeriods() {
  const url = `${BASE_URL}/TimeSheet/GetActivePayPeriods`;
  store.dispatch(updateError(null));

  return axios.get(url, {
    headers: { 'Content-Type': 'application/json' }
  }).catch((err) => {
    console.log("error: ", err);
    store.dispatch(updateError(err?.message));
    throw new Error(err);
  });
}

export async function fetchWorkorders(module) {
  const url = `${BASE_URL}/TimeSheet/GetWorkorders?module=${module}`;
  store.dispatch(updateError(null));

  return axios.get(url, {
    headers: { 'Content-Type': 'application/json' }
  }).catch((err) => {
    console.log("error: ", err);
    store.dispatch(updateError(err?.message));
    throw new Error(err);
  });
}

export async function fetchServicesAssignedToByEmail(email) {
  const url = `${BASE_URL}/TimeSheet/GetServicesAssignedToByEmail?email=${email}`;
  store.dispatch(updateError(null));

  return axios.get(url, {
    headers: { 'Content-Type': 'application/json' }
  }).catch((err) => {
    console.log("error: ", err);
    store.dispatch(updateError(err?.message));
    throw new Error(err);
  });
}

