import { createRequest, USER_KEY } from "./SERVER";
import axiosInstance from "../../services/api/axiosInstance";

const login = async ({ username, password }) => {
  const res = await createRequest().post(`Login`, {
    username,
    password,
  });

  if (res?.data?.token) {
    const user = res?.data?.user || {};
    const { permissions, ...userInfo } = user;
    const token = res?.data?.token;
    localStorage.setItem(USER_KEY, JSON.stringify({ token }));
    return {
      userInfo,
      permissions,
    };
  } else {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

// VGuan Debug:
// const getUserPermission = async () => {
//   try {
//     const res = await createRequest().get(`GetPermissions`);
//     return res?.data || [];
//   } catch (error) {
//     return false;
//   }
// };

const getUserPermission = async () => {
    try {
      // return await axiosInstance.get(
      //   "/permissions/GetPermissions"
      // );
      const resp = await axiosInstance.get(
        // process.env.NEXT_PUBLIC_SERVICE_GET_GetPermissions
        "/permissions/GetPermissions"
      );
      return resp?.data || [];
    } catch (error) {
      console.error("Error fetching service getUserPermission data:", error);
    }
};

// const paramToString = (obj, keepEmptyString = false) => {
//   return Object.keys(obj)
//     .map((k) => {
//       if (obj[k] || keepEmptyString) {
//         return `${[k]}=${obj[k]}`;
//       } else {
//         return "";
//       }
//     })
//     .join("&");
// };

export default {
  getUserPermission,
  login,
};
