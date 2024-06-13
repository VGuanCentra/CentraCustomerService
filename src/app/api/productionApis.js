import axios from "axios";
import store from "../redux/store.js";
import { updateResult, updateStateChangeResult, updateError, updateWorkOrderData } from "../redux/calendar";
import { searchSlice } from "../redux/calendarAux";
import { BASE_URL, ResultType } from "app/utils/constants";

function getConfig() {
  const tokenString = localStorage.getItem("authnav_user");
  const tokenObject = JSON.parse(tokenString);

  return {
    headers: {
      Authorization: `Bearer ${tokenObject?.token}`,
      'Content-Type': 'application/json'
    }
  }
}

export async function fetchProductionWorkOrders(startDate, endDate) {
  const url = `${BASE_URL}/Production/GetProductionsByRange?startDay=${startDate}&endDay=${endDate}`;
  store.dispatch(updateError(null)); // Make sure error state is empty before performing a new fetch

  return axios.get(url, {
    headers: { 'Content-Type': 'application/json' }
  }).catch(err => {
      console.log("error: ", err)
      store.dispatch(updateError(err?.message));
      throw new Error(err);
    })
}

export async function fetchProductionWorkOrder(id) {
  const url = `${BASE_URL}/Production/GetProductionByWO?workordernumber=${id}`;
  return axios.get(url, getConfig())
    .catch(err => {
      store.dispatch(updateWorkOrderData({ error: err }));
      throw new Error(err);
    });
}

export async function fetchProductionWindows(id) {
  const url = `${BASE_URL}/Production/GetProductionItems?workordernumber=${id}&productionItemType=windows`;
  return axios.get(url, getConfig())
    .catch(err => {
      throw new Error(err);
    });
}

export async function fetchProductionDoors(id) {
  const url = `${BASE_URL}/Production/GetProductionItems?workordernumber=${id}&productionItemType=doors`;
  return axios.get(url, getConfig())
    .catch(err => {
      throw new Error(err);
    });
}

export async function fetchRemakeItems(token, id) {
  const url = `${BASE_URL}/Remake/GetRemakesByWO?originalWO=${id}`;

  return axios.get(url, getConfig())
    .catch(err => {
      throw new Error(err);
    });
}

export async function fetchBackorderItems(id) {
  const url = `${BASE_URL}/ShippingBackOrder/GetShippingBackOrdersByWO?workOrderNumber=${id}`;
  return axios.get(url, getConfig())
    .catch(err => {
      throw new Error(err);
    });
}

export async function fetchGlassItems(id) {
  const url = `${BASE_URL}/GlassLogistic/GetGlassItems?wo=${id}`;
  return axios.get(url, getConfig())
    .catch(err => {
      throw new Error(err);
    });
}

export async function fetchProductionDocuments(id) {
  if (id) {
    const url = `${BASE_URL}/Production/GetProductionDocumentFilesByWO?workordernumber=${id}`;
    return axios.get(url, getConfig())
      .catch(err => {
        throw new Error(err);
      });
  }
}

export async function searchProduction(department, searchType, data, startDay, endDay) {
  if (department && searchType && data && startDay && endDay) {
    const url = `${BASE_URL}/Generic/GetPlantProductionSearchResults?startDay=${startDay}&endDay=${endDay}&searchType=${searchType}&exactSearch=false`;
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

export async function updateProdOrder(data) {
  if (data) {
    const url = `${BASE_URL}/Production/UpdateProdOrder`;
    axios.post(url, data, getConfig())
      .then((res) => {
        if (res.data) {          
          // Attach payload to update result
          store.dispatch(updateResult({ type: ResultType.success, message: "Work order updated.", source: "Production Work Order" }));
        } else {
          store.dispatch(updateResult({ type: ResultType.error, message: "Work order update failed.", source: "Production Work Order" }));
        }
      })
      .catch(err => {
        console.log("error: ", err);
        throw new Error(err);
      })
  }
}

export async function updateState(data) {
  if (data) {
    const url = `${BASE_URL}/Generic/Transit`;
    axios.post(url, data, getConfig())
      .then((res) => {
        if (res?.status === 200) {
          const _payload = res?.data;
          const { recordID, lastOperationName } = _payload;

          store.dispatch(updateResult(
            {
              type: ResultType.success,
              message: "Update Successful.",
              source: "Status Update",
              payload: { actionItemId: recordID, state: lastOperationName }
            }));

        } else {
          store.dispatch(updateResult({ type: ResultType.error, message: "Update Failed.", source: "Status Update" }));
        }

        store.dispatch(updateStateChangeResult(res.data));
      })
      .catch(err => {
        console.log("error: ", err);
        throw new Error(err);
      })
  }
}

export async function updateBatchState(data) {

  if (data) {
    const url = `${BASE_URL}/Generic/BatchTransit`;

    axios.post(url, data, getConfig())
      .then((res) => {
        if (res?.status === 200) {
          store.dispatch(updateResult({ type: ResultType.success, message: "Status updated." }));
        } else {
          store.dispatch(updateResult({ type: ResultType.error, message: "Status update failed." }));
        }

        store.dispatch(updateStateChangeResult(res.data));
      })
      .catch(err => {
        console.log("error: ", err);
        throw new Error(err);
      })
  }
}

export async function updateEventDates(dates) {
  if (dates?.length > 0) {
    const url = `${BASE_URL}/Generic/UpdateEventTime`;
    let postData = dates.map((d) => {
      return {
        moduleName: "PlantProduction",
        recordId: d.recordId,
        startDate: d.startDate,
        startTime: d.startTime,
        endTime: d.endTime
      }
    })

    axios.post(url, postData, getConfig())
      .then((res) => {
        if (res?.status === 200) {
          store.dispatch(updateResult({ type: ResultType.success, message: "Update Successful.", source: "Production Reschedule" }));
        } else {
          store.dispatch(updateResult({ type: ResultType.error, message: "Update failed.", source: "Production Reschedule" }));
        }

        //store.dispatch(updateResult(res.data));
      })
      .catch(err => {
        console.log("error: ", err);
        throw new Error(err);
      })
  }
}

export async function updateBatchEventDates(data) {
  if (data?.length > 0) {
    const url = `${BASE_URL}/Generic/UpdateBatchEventTime`;

    axios.post(url, data, getConfig())
      .then((res) => {
        if (res?.status === 200) {
          store.dispatch(updateResult({ type: ResultType.success, message: "Update Successful.", source: "Bulk Reschedule" }));
        } else {
          store.dispatch(updateResult({ type: ResultType.error, message: "Update failed.", source: "Bulk Reschedule" }));
        }
      })
      .catch(err => {
        console.log("error: ", err);
        throw new Error(err);
      })
  }
}

export async function updateProductionDocuments(id, documents) {
  const url = `${BASE_URL}/Production/UpdateProductionDocumentFiles?actionItemId=${id}`;
  if (id && Array.isArray(documents)) {
    axios.post(url, documents, getConfig())
      .then((res) => {
        if (res?.status === 200) {
          store.dispatch(updateResult({ type: ResultType.success, message: "Update Successful.", source: "Documents" }));
        } else {
          store.dispatch(updateResult({ type: ResultType.error, message: "Update failed.", source: "Documents" }));
        }
      })
      .catch(err => {
        console.log("error: ", err);
        throw new Error(err);
      })
  }
}

export async function updateProductionItems(data) {
  if (data) {
    const url = `${BASE_URL}/Production/UpdateProductionItems`;

    axios.post(url, data, getConfig())
      .then((res) => {
        if (res?.status === 200) {
          store.dispatch(updateResult({ type: ResultType.success, message: "Update Successful.", source: "Production Items" }));
        } else {
          store.dispatch(updateResult({ type: ResultType.error, message: "Update failed.", source: "Production Items" }));
        }
      })
      .catch(err => {
        console.log("error: ", err);
        throw new Error(err);
      })
  }
}

export async function updateProjectManagementAndReturnedJobNotes(data) {
  if (data) {
    const url = `${BASE_URL}/Production/UpdateProdReturnedJobSchedule`;
    axios.post(url, data, getConfig())
      .then((res) => {
        if (res?.status === 200) {
          store.dispatch(updateResult({ type: ResultType.success, message: "Update Successful.", source: "Project Management / Returned Job" }));
        } else {
          store.dispatch(updateResult({ type: ResultType.error, message: "Update failed.", source: "Project Management / Returned Job" }));
        }
      })
      .catch(err => {
        console.log("error: ", err);
        throw new Error(err);
      })
  }
}

export async function updateNotes(data) {
  if (data) {
    const url = `${BASE_URL}/Production/UpdateProductionNotes`;
    axios.post(url, data, getConfig())
      .then((res) => {
        if (res?.status === 200) {
          store.dispatch(updateResult({ type: ResultType.success, message: "Update Successful.", source: "Notes" }));
        } else {
          store.dispatch(updateResult({ type: ResultType.error, message: "Update failed.", source: "Notes" }));
        }
      })
      .catch(err => {
        console.log("error: ", err);
        throw new Error(err);
      })
  }
}

export async function addRemakes(token, data) {
  if (data) {
    const url = `${BASE_URL}/Remake/AddRemakes`;

    axios.post(url, data, getConfig())
      .then((res) => {
        if (res?.status === 200) {
          store.dispatch(updateResult({ type: ResultType.success, message: "Remake Successfully Created.", source: "Create Remake" }));
        } else {
          store.dispatch(updateResult({ type: ResultType.error, message: "Could Not Create Remake(s). Please try again.", source: "Create Remake" }));
        }
      })
      .catch(err => {
        store.dispatch(updateResult({ type: ResultType.error, message: err?.response?.data, source: "Create remake(s) failed. Please try again." }));
        console.log("error: ", err);
        throw new Error(err);
      })
  }
}

export async function addBackorders(data) {
  if (data) {
    const url = `${BASE_URL}/ShippingBackOrder/AddShippingBackOrders`;
    axios.post(url, data, getConfig())
      .then((res) => {
        if (res?.status === 200) {
          store.dispatch(updateResult({ type: ResultType.success, message: "Backorder(s) Successfully Created.", source: "Create Backorder" }));
        } else {
          store.dispatch(updateResult({ type: ResultType.error, message: "Could Not Backorder(s). Please try again.", source: "Create Backorder" }));
        }
      })
      .catch(err => {
        store.dispatch(updateResult({ type: ResultType.error, message: err?.response?.data, source: "Create backorder(s) failed. Please try again." }));
        console.log("error: ", err);
        throw new Error(err);
      });
  }
}

export async function addRemakePhotos(data) {
  if (data) {
    const url = `${BASE_URL}/Common/UploadFiles?module=remake&parentId=${data.id}`;

    axios.post(url, data.files, getConfig())
      .then((res) => {
        if (res?.status === 200) {
          store.dispatch(updateResult({ type: ResultType.success, message: "Remake File Upload Successful.", source: "Remake Files" }));
        } else {
          store.dispatch(updateResult({ type: ResultType.error, message: "Remake File Upload Failed.", source: "Remake Files" }));
        }
      })
      .catch(err => {
        console.log("error: ", err);
        throw new Error(err);
      })
  }
}

export async function importGlass(company, data) {
  if (company && data) {

    const url = `${BASE_URL}/GlassLogistic/UploadGlassLogisticFile?company=${company}`;

    axios.post(url, data, {
      headers: { Authorization: `Bearer ${store?.getState()?.app?.userToken}` },
      'Content-Type': 'multipart/form-data',
    })
      .then((res) => {
        if (res?.data?.ErrorMessage) {
          store.dispatch(updateResult({ type: ResultType.error, message: `File already imported.`, source: "Glass Import" }));
        } else {
          store.dispatch(updateResult({ type: ResultType.success, message: "Glass Import Successful.", source: "Glass Import" }));
        }
      })
      .catch(err => {
        console.log("error: ", err);
        //throw new Error(err);
      })
  }
}

export async function searchProductionQuick(data) {
  if (data) {
    const url = `${BASE_URL}/Production/GetProductionQuickSearchResult`;
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

export async function searchProductionDetailed(data) {
  if (data) {
    const url = `${BASE_URL}/Production/GetProductionFullSearchResult`;
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
export async function fetchPlantProductionReport(startDate, endDate) {
  const url = `${BASE_URL}/Production/GetProductionPlanByRange?startDay=${startDate}&endDay=${endDate}`;
  store.dispatch(updateError(null)); // Make sure error state is empty before performing a new fetch
  return axios.get(url, {
    headers: { 'Content-Type': 'application/json' }
  }).catch(err => {
    console.log("error: ", err)
    store.dispatch(updateError(err?.message));
    throw new Error(err);
  })
}
