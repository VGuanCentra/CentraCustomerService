import axios from "axios";
import store from "../redux/store.js";
import { searchSlice } from "../redux/calendarAux";

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

export async function fetchInstallationWorkOrders(startDate, endDate) {
  const url = `${BASE_URL}/HomeInstallations/GetInstallationsByRange?startDay=${startDate}&endDay=${endDate}`;
  store.dispatch(updateError(null)); // Make sure error state is empty before performing a new fetch
  return axios.get(url, {
    headers: { 'Content-Type': 'application/json' }
  }).catch((err) => {
    console.log("error: ", err);
    store.dispatch(updateError(err?.message));
    throw new Error(err);
  });
}

export async function fetchRemeasureWorkOrders(startDate, endDate) {
  const url = `${BASE_URL}/HomeInstallations/GetRemeasuresByRange?startDay=${startDate}&endDay=${endDate}`;
  store.dispatch(updateError(null)); // Make sure error state is empty before performing a new fetch
  return axios.get(url, {
    headers: { 'Content-Type': 'application/json' }
  }).catch((err) => {
    console.log("error: ", err);
    store.dispatch(updateError(err?.message));
    throw new Error(err);
  });
}

export async function fetchInstallationWorkOrder(id) {
  const url = `${BASE_URL}/HomeInstallations/GetInstallationByWO?workordernumber=${id}`;
  return axios.get(url, getConfig()).catch((err) => {
    store.dispatch(updateWorkOrderData({ error: err }));
    throw new Error(err);
  });
}
export async function fetchInstallersById(id) {
  const url = `${BASE_URL}/HomeInstallations/GetInstallationStaffByWO?workordernumber=${id}`;
  return axios.get(url, getConfig()).catch((err) => {
    //store.dispatch(updateWorkOrderData({ error: err }));
    throw new Error(err);
  });
}

export async function fetchPhotosById(id) {
  const url = `${BASE_URL}/HomeInstallations/GetInstallationPhotosByWO?workOrderNumber=${id}`;
  return axios.get(url, getConfig()).catch((err) => {
    //store.dispatch(updateWorkOrderData({ error: err }));
    throw new Error(err);
  });
}

export async function fetchDocumentsById(id) {
  const url = `${BASE_URL}/HomeInstallations/GetInstallationDocumentFilesByWO?workOrderNumber=${id}`;
  return axios.get(url, getConfig()).catch((err) => {
    //store.dispatch(updateWorkOrderData({ error: err }));
    throw new Error(err);
  });
}

export async function fetchInstallationStaff(branch) {
  let url = `${BASE_URL}/HomeInstallations/GetInstallationAllStaff`; // Need to get rid of branch= or else won't work

  if (branch) { 
    url = `${BASE_URL}/HomeInstallations/GetInstallationAllStaff?branch=${branch}`
  }

  return axios.get(url, getConfig())
    .catch(err => {
      //store.dispatch(updateWorkOrderData({ error: err }));
      throw new Error(err);
    });
}

export async function fetchNotesByParentId(id) {
  const url = `${BASE_URL}/HomeInstallations/GetInstallationNotesByParentId?parentId=${id}`;
  return axios.get(url, getConfig()).catch((err) => {
    throw new Error(err);
  });
}

export async function updateNotes(data) {
  const url = `${BASE_URL}/Generic/UpdateGeneralNotes`;
  axios
    .post(url, data, getConfig())
    .then((res) => {
      if (res?.status === 200) {
        store.dispatch(
          updateResult({
            type: ResultType.success,
            message: "Update Successful.",
            source: "Installation Notes",
          })
        );
      } else {
        store.dispatch(
          updateResult({
            type: ResultType.error,
            message: "Update failed.",
            source: "Installation Notes",
          })
        );
      }
    })
    .catch((err) => {
      console.log("error: ", err);
      throw new Error(err);
    });
}

export async function fetchCallLogsByParentId(id) {
  const url = `${BASE_URL}/HomeInstallations/GetInstallationCallLogsByParentId?parentId=${id}`;
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
            source: "Installation Call Logs",
          })
        );
      } else {
        store.dispatch(
          updateResult({
            type: ResultType.error,
            message: "Update failed.",
            source: "Installation Call Logs",
          })
        );
      }
    })
    .catch((err) => {
      console.log("error: ", err);
      throw new Error(err);
    });
}

export async function fetchJobReviewByWONumber(id) {
  const url = `${BASE_URL}/HomeInstallations/GetInstallationJobReviewByWO?workOrderNumber=${id}`;
  return axios.get(url, getConfig())
    .catch(err => {
      throw new Error(err);
    });
}

export async function updateReturnJobDate(data) {
  const url = `${BASE_URL}/HomeInstallations/UpdateInstallationReturnJobScheduledDate`; 
  axios.post(url, data, getConfig())
    .then((res) => {
      if (res?.status === 200) {
        store.dispatch(updateResult({ type: ResultType.success, message: "Update Successful.", source: "Installation Return Schedule" }));
      } else {
        store.dispatch(updateResult({ type: ResultType.error, message: "Update failed.", source: "Installation Return Schedule" }));
      }
    })
    .catch(err => {
      console.log("error: ", err);
      throw new Error(err);
    })
}

export async function updateRemeasureReturnJobDate(data) {
  const url = `${BASE_URL}/HomeInstallations/UpdateRemeasureReturnJobScheduledDate`;
  axios.post(url, data, getConfig())
    .then((res) => {
      if (res?.status === 200) {
        store.dispatch(updateResult({ type: ResultType.success, message: "Update Successful.", source: "Installation Remeasure Return Schedule" }));
      } else {
        store.dispatch(updateResult({ type: ResultType.error, message: "Update failed.", source: "Installation Remeasure Return Schedule" }));
      }
    })
    .catch(err => {
      console.log("error: ", err);
      throw new Error(err);
    })
}

export async function updateInstallation(data) {  
  const url = `${BASE_URL}/HomeInstallations/UpdateInstallation`;
  axios.post(url, data, getConfig())
    .then((res) => {
      if (res?.status === 200) {
        store.dispatch(updateResult({ type: ResultType.success, message: "Update Successful.", source: "Installation Data" }));
      } else {
        store.dispatch(updateResult({ type: ResultType.error, message: "Update failed.", source: "Installation Data" }));
      }
    })
    .catch(err => {
      console.log("error: ", err);
      throw new Error(err);
    })
}

export async function fetchInstallationItemsByWONumber(id) {
  const url = `${BASE_URL}/HomeInstallations/GetInstallationItems?workOrderNumber=${id}`;
  return axios.get(url, getConfig())
    .catch(err => {
      throw new Error(err);
    });
}

export async function fetchInstallationDoors(id) {
  const url = `${BASE_URL}/HomeInstallations/GetInstallationItems?workOrderNumber=${id}installationItemType=doors`;
  return axios.get(url, getConfig())
    .catch(err => {
      throw new Error(err);
    });
}

export async function updateEventDates(dates) {
  if (dates?.length > 0) {
    const url = `${BASE_URL}/Generic/UpdateEventTime`;
    let postData = dates.map((d) => {
      return {
        moduleName: "HomeInstallations",
        recordId: d.recordId,
        startDate: d.startDate,
        startTime: d.startTime,
        endTime: d.endTime
      }
    })

    axios.post(url, postData, getConfig())
      .then((res) => {
        if (res?.status === 200) {
          store.dispatch(updateResult({ type: ResultType.success, message: "Update Successful.", source: "Installation Reschedule" }));
        } else {
          store.dispatch(updateResult({ type: ResultType.error, message: "Update failed.", source: "Installation Reschedule" }));
        }

        //store.dispatch(updateResult(res.data));
      })
      .catch(err => {
        console.log("error: ", err);
        throw new Error(err);
      })
  }
}

export async function updateInstallationInstallData(data) {
  const url = `${BASE_URL}/HomeInstallations/UpdateInstallationInstallData`;
  axios.post(url, data, getConfig())
    .then((res) => {
      if (res?.status === 200) {
        store.dispatch(updateResult({ type: ResultType.success, message: "Update Successful.", source: "Installation Data" }));
      } else {
        store.dispatch(updateResult({ type: ResultType.error, message: "Update failed.", source: "Installation Data" }));
      }
    })
    .catch(err => {
      console.log("error: ", err);
      throw new Error(err);
    })
}

export async function updateStaff(data) {
  const url = `${BASE_URL}/HomeInstallations/UpdateInstalltionCrew`;
  axios.post(url, data, getConfig())
    .then((res) => {
      if (res?.status === 200) {
        store.dispatch(updateResult({ type: ResultType.success, message: "Update Successful.", source: "Installation Staff" }));
      } else {
        store.dispatch(updateResult({ type: ResultType.error, message: "Update failed.", source: "Installation Staff" }));
      }
    })
    .catch(err => {
      console.log("error: ", err);
      throw new Error(err);
    })
}

export async function updateDocuments(actionItemId, data) {
  const url = `${BASE_URL}/HomeInstallations/UpdateDocumentFiles?actionItemId=${actionItemId}`;
  axios.post(url, data, getConfig())
    .then((res) => {
      if (res?.status === 200) {
        store.dispatch(updateResult({ type: ResultType.success, message: "Update Successful.", source: "Installation Documents" }));
      } else {
        store.dispatch(updateResult({ type: ResultType.error, message: "Update failed.", source: "Installation Documents" }));
      }
    })
    .catch(err => {
      console.log("error: ", err);
      throw new Error(err);
    })
}

export async function updatePhotos(actionItemId, data) {
  const url = `${BASE_URL}/HomeInstallations/UpdateInstallationPictures?actionItemId=${actionItemId}`;
  axios.post(url, data, getConfig())
    .then((res) => {
      if (res?.status === 200) {
        store.dispatch(updateResult({ type: ResultType.success, message: "Update Successful.", source: "Installation Photos" }));
      } else {
        store.dispatch(updateResult({ type: ResultType.error, message: "Update failed.", source: "Installation Photos" }));
      }
    })
    .catch(err => {
      console.log("error: ", err);
      throw new Error(err);
    })
}

export async function searchInstallation(department, searchType, data, startDay, endDay) {
  if (department && searchType && data && startDay && endDay) {
    const url = `${BASE_URL}/Generic/GetHomeInstallationSearchResults?startDay=${startDay}&endDay=${endDay}&searchType=${searchType}&exactSearch=false`;
    axios.post(url, data, getConfig())
      .then((res) => {
        if (res?.data) {
          store.dispatch(searchSlice.actions.updateSearchResults({ department: department, data: res.data }));
        }
      })
      .catch(err => {
        console.log("error: ", err);
        store.dispatch(searchSlice.actions.updateSearchResults({ department: department, error: err }));
        throw new Error(err);
      })
  }
}

export async function searchInstallationQuick(data) {
  if (data) {
    const url = `${BASE_URL}/HomeInstallations/GetInstallationQuickSearchResult`;
    axios.post(url, data, getConfig())
      .then((res) => {
        if (res?.data) {
          store.dispatch(searchSlice.actions.updateSearchResults({ department: "", data: res.data }));
        }
      })
      .catch(err => {
        console.log("error: ", err);
        store.dispatch(searchSlice.actions.updateSearchResults({ department: "", error: err }));
        throw new Error(err);
      })
  }
}

export async function searchInstallationDetailed(data) {
  if (data) {
    const url = `${BASE_URL}/HomeInstallations/GetInstallationFullSearchResult`;
    axios.post(url, data, getConfig())
      .then((res) => {
        if (res?.data) {
          store.dispatch(searchSlice.actions.updateSearchResults({ department: "", data: res.data }));
        }
      })
      .catch(err => {
        console.log("error: ", err);
        store.dispatch(searchSlice.actions.updateSearchResults({ department: "", error: err }));
        throw new Error(err);
      })
  }
}

export async function fetchSalesReps(startDate, endDate) {
  const url = `${BASE_URL}/HomeInstallations/GetSalesRepsByRange?startDay=${startDate}&endDay=${endDate}`;
  store.dispatch(updateError(null)); // Make sure error state is empty before performing a new fetch
  return axios.get(url, {
    headers: { 'Content-Type': 'application/json' }
  }).catch((err) => {
    console.log("error: ", err);
    store.dispatch(updateError(err?.message));
    throw new Error(err);
  });
}

export async function fetchProductionAndShippingDateByWONumber(id) {
  const url = `${BASE_URL}/HomeInstallations/GetInstallation_ProductionAndShippingDateByWO?workOrderNumber=${id}`;
  return axios.get(url, getConfig())
    .catch(err => {
      throw new Error(err);
    });
}

export async function fetchSubTradesByWONumber(id) {
  const url = `${BASE_URL}/HomeInstallations/GetInstallationSubTradesByWO?workOrderNumber=${id}`;
  return axios.get(url, getConfig())
    .catch(err => {
      throw new Error(err);
    });
}