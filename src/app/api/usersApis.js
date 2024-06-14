import axiosInstance from "../../msallib/services/api/axiosInstance";

export const getUserPermission = async () => {
  try {
    const resp = await axiosInstance.get("/permissions/GetPermissions");
    return resp?.data || [];
  } catch (error) {
    console.error("Error usersApis getUserPermission data:", error);
  }
};

// Method #1: 
// export const fetchUsersByDepartment = async (
//   department,
//   page = 1,
//   pageSize = 500
// ) => {
//   try {
//     const url = `/permissions/GetAllADUsers?department=${department}&page=${page}&pageSize=${pageSize}`;
//     const resp = await axiosInstance.get(url);
// return resp?.data || [];   ==> Call-Site just "result;"
//     return resp; // ==> Call-Site need to "result.data;"
//   } catch (error) {
//     console.error("Error usersApis fetchUsersByDepartment data:", error);
//   }
// };

// Method #2: 
export async function fetchUsersByDepartment(
  department,
  page = 1,
  pageSize = 500
) {
  try {
    // const url = `/permissions/GetAllADUsers?department=${department}&page=${page}&pageSize=${pageSize}`;
    // const resp = await axiosInstance.get(url);
    // return resp;
    return await axiosInstance.get(
      `/permissions/GetAllADUsers?department=${department}&page=${page}&pageSize=${pageSize}`
    );
  } catch (error) {
    console.error("Error usersApis fetchUsersByDepartment data:", error);
  }
}
