import axios from "axios";
import store from "../redux/store.js";

import {
  updateResult,
  updateStateChangeResult,
  updateError,
  updateWorkOrderData,
} from "../redux/calendar";

import { BASE_URL, ResultType } from "app/utils/constants";

function getConfig() {
  return {
    headers: { Authorization: `Bearer ${store?.getState()?.app?.userToken}` },
    "Content-Type": "application/json",
  };
}

export async function fetchShippingWorkOrders(startDate, endDate) {
  const url = `${BASE_URL}/FFShipping/GetShippingOrdersByRange?startDate=${startDate}&endDate=${endDate}`;
  store.dispatch(updateError(null)); // Make sure error state is empty before performing a new fetch
  return axios.get(url, {
    headers: { 'Content-Type': 'application/json' }
  }).catch((err) => {
    console.log("error: ", err);
    store.dispatch(updateError(err?.message));
    throw new Error(err);
  });
}



export async function fetchBackorderWorkOrders(startDate, endDate) {
  const url = `${BASE_URL}/ShippingBackOrder/GetShippingBackOrdersByRange?startDate=${startDate}&endDate=${endDate}`;
  store.dispatch(updateError(null)); // Make sure error state is empty before performing a new fetch
  return axios.get(url, {
    headers: { 'Content-Type': 'application/json' }
  }).catch((err) => {
    console.log("error: ", err);
    store.dispatch(updateError(err?.message));
    throw new Error(err);
  });
}

export async function fetchBackorderWorkOrder(id) {
  const url = `${BASE_URL}/ShippingBackOrder/GetShippingBackOrdersByWO?workordernumber=${id}`;
  return axios.get(url, getConfig()).catch((err) => {
    store.dispatch(updateWorkOrderData({ error: err }));
    throw new Error(err);
  });
}

export async function fetchCallLogsByWO(id) {
  const url = `${BASE_URL}/FFShipping/GetShippingCallLogsByWO?workOrderNumber=${id}`;
  return axios.get(url, getConfig()).catch((err) => {
    throw new Error(err);
  });
}

export async function updateCallLogs(data) {
  const url = `${BASE_URL}/Generic/UpdateCallLog`;
  axios
    .post(url, data, getConfig())
    .then((res) => {
      if (res?.status === 200) {
        store.dispatch(
          updateResult({
            type: ResultType.success,
            message: "Update Successful.",
            source: "Shipping Call Logs",
          })
        );
      } else {
        store.dispatch(
          updateResult({
            type: ResultType.error,
            message: "Update failed.",
            source: "Shipping Call Logs",
          })
        );
      }
    })
    .catch((err) => {
      console.log("error: ", err);
      throw new Error(err);
    });
}

export async function updateShippingDate(data) {
  const url = `${BASE_URL}/FFShipping/UpdateShippingDates`;
  axios
    .post(url, data, getConfig())
    .then((res) => {
      if (res?.status === 200) {
        store.dispatch(
          updateResult({
            type: ResultType.success,
            message: "Update Successful.",
            source: "Shipping Date",
          })
        );
      } else {
        store.dispatch(
          updateResult({
            type: ResultType.error,
            message: "Update failed.",
            source: "Shipping Date",
          })
        );
      }
    })
    .catch((err) => {
      console.log("error: ", err);
      throw new Error(err);
    });
}

