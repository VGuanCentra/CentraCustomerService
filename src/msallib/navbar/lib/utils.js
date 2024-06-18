export function urlParamsToObject(url) {
  const urlArr = url.split("?");
  const paramsString = urlArr[1] || "";
  const paramsArray = paramsString.split("&");

  const paramsObject = {};

  paramsArray?.forEach((param) => {
    const [key, value] = param.split("=");
    if (key && value) {
      paramsObject[decodeURIComponent(key)] = decodeURIComponent(value);
    }
  });

  return { params: paramsObject, baseurl: urlArr[0] };
}

export function objectToUrlParams(paramsObject) {
  const paramsArray = Object.entries(paramsObject).map(([key, value]) => {
    return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
  });

  return paramsArray.join("&");
}

export function removeUrlParameter(paramToRemove) {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    
    // Remove the specified parameter
    params.delete(paramToRemove);
    
    // Update the URL's search parameters
    url.search = params.toString();
    
    // Update the browser's address bar without reloading the page
    window.history.replaceState({}, document.title, url.toString());
  }

export function buildNestedTree(arr) {
  const idMapping = {};
  const root = [];

  // Step 1: Create a mapping of applicationFeatureId to object
  arr.forEach(item => {
    idMapping[item.applicationFeatureId] = item;
    item.navItems = []; // Initialize navItems array for every item
  });

  // Step 2: Build the tree structure
  arr.forEach(item => {
    if (item.parentFeatureId && idMapping[item.parentFeatureId]) {
      idMapping[item.parentFeatureId].navItems.push(item);
    } else {
      root.push(item);
    }
  });

  // Step 3: Return the root array
  return root;
}