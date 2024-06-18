import axios from "axios";

// let SERVER = "http://srvvandev:1237/authentication";
let SERVER = "https://permissions-api.centra.ca/authentication";
const timeout = 99999999999999999999999999;

export const USER_KEY = "authnav_user";

const getHeaders = (tokenKey) => {
  if (typeof window !== "undefined") {
    const { token } = JSON.parse(localStorage.getItem(tokenKey) || "{}");
    return { Authorization: token ? `Bearer ${token}` : "" };
  }
};

export const createRequest = (defaultRoute, tokenKey = USER_KEY, isThirdParty = false) => {
  axios.defaults.params = { m: Math.random(), t: new Date().getTime() };
  const request = axios.create({
    baseURL: (isThirdParty ? "" : SERVER) + (defaultRoute || ''),
    timeout,
    headers: getHeaders(tokenKey),
  });

  // request.interceptors.request.use((req) => {
  //   const { token } = JSON.parse(localStorage.getItem(tokenKey) || "{}");
  //   req.headers.Authorization = token ? `Bearer ${token}` : "";
  //   req.headers["Cache-Control"] = "no-cache";

  //   return req;
  // });

  // request.interceptors.response.use((response) => {
  //   if (response?.data?.invalid) {
  //     throw new Error(response.data.messages.join("\n"));
  //   }
  //   return response;
  // });

  return request;
};
